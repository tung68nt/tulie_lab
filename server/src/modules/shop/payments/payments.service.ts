import { Order, OrderStatus, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { IOrderRepository } from './interfaces/order.repository.interface';
import { EventBus } from '../../../core/event-bus';
import { IUserRepository } from '../../system/users/interfaces/user.repository.interface';
import { ICourseRepository } from '../../lms/courses/interfaces/course.repository.interface';
import { IProductRepository } from '../products/interfaces/product.repository.interface';
import { IActivationCodeRepository } from '../activation-codes/interfaces/activation-code.repository.interface';

export class PaymentService {
    constructor(
        private orderRepository: IOrderRepository,
        private userRepository: IUserRepository, // Needed for guest checkout creation
        private courseRepository: ICourseRepository, // Needed for price check
        private productRepository: IProductRepository, // Needed for price check
        private activationCodeRepository: IActivationCodeRepository, // Needed for generating codes
        private eventBus: EventBus
    ) { }

    async createOrder(data: {
        userId?: string;
        userInfo?: {
            name: string;
            email: string;
            phone?: string;
            password?: string;
        };
        items: { id: string, type: 'COURSE' | 'PRODUCT', options?: any }[];
        amount?: number;
        promoCodeId?: string;
        marketing?: any;
        isGift?: boolean;
    }): Promise<{ order: Order, isNewUser: boolean }> {
        const { userId, userInfo, items, marketing, isGift } = data;
        let finalUserId = userId;
        let isNewUser = false;

        // 1. Resolve User
        if (!finalUserId) {
            if (!userInfo || !userInfo.email) {
                throw new Error('User information required for guest checkout');
            }

            const existingUser = await this.userRepository.findByEmail(userInfo.email);
            if (existingUser) {
                finalUserId = existingUser.id;
            } else {
                const passwordToHash = userInfo.password || Math.random().toString(36).slice(-8);
                const hashedPassword = await bcrypt.hash(passwordToHash, 10);

                const newUser = await this.userRepository.create({
                    email: userInfo.email,
                    password: hashedPassword,
                    role: Role.USER,
                    profile: {
                        create: {
                            name: userInfo.name,
                            phone: userInfo.phone || null
                        }
                    }
                });
                finalUserId = newUser.id;
                isNewUser = true;

                // Publish User Registered Event
                this.eventBus.publish({
                    type: 'USER_REGISTERED',
                    payload: { userId: newUser.id, email: newUser.email, name: userInfo.name },
                    timestamp: new Date()
                });
            }
        }

        // 2. Validate Items & Calculate Price
        const orderItemsData = [];
        let totalAmount = 0;

        for (const item of items) {
            if (item.type === 'COURSE') {
                const course = await this.courseRepository.findById(item.id);
                if (!course) throw new Error(`Course not found: ${item.id}`);

                orderItemsData.push({
                    courseId: course.id,
                    price: course.price,
                    metadata: item.options || undefined
                });
                totalAmount += Number(course.price);

            } else if (item.type === 'PRODUCT') {
                const product = await this.productRepository.findById(item.id);
                if (!product) throw new Error(`Product not found: ${item.id}`);

                orderItemsData.push({
                    productId: product.id,
                    price: product.price,
                    metadata: item.options || undefined
                });
                totalAmount += Number(product.price);
            }
        }

        // 3. Create Order
        const randomString = Math.random().toString(36).substring(2, 6).toUpperCase();
        const timestamp = Date.now().toString().slice(-6);
        const code = `TULIE${timestamp}${randomString}`;

        // Ensure status reflects calculation
        const initialStatus = totalAmount <= 0 ? OrderStatus.PAID : OrderStatus.PENDING;

        const order = await this.orderRepository.create({
            code,
            user: { connect: { id: finalUserId! } },
            amount: totalAmount,
            status: initialStatus,
            isGift: !!isGift,
            items: {
                create: orderItemsData
            }
        });

        // 4. Publish Event (Instead of direct logic)
        this.eventBus.publish({
            type: 'ORDER_CREATED',
            payload: { orderId: order.id, code: order.code, amount: totalAmount, userId: finalUserId, items: orderItemsData },
            timestamp: new Date()
        });

        // If free (PAID immediately), publish PAID event too
        if (initialStatus === OrderStatus.PAID) {
            this.eventBus.publish({
                type: 'ORDER_PAID',
                payload: { orderId: order.id, code: order.code, userId: finalUserId, items: orderItemsData, isGift: !!isGift },
                timestamp: new Date()
            });
        }

        return { order, isNewUser };
    }

    async getOrder(code: string): Promise<Order | null> {
        return this.orderRepository.findByCode(code);
    }

    async verifySepaySignature(payload: any, signature: string): Promise<boolean> {
        const crypto = require('crypto');
        const secret = process.env.SEPAY_SECRET_KEY || '';

        if (!secret) return false;

        const payloadString = JSON.stringify(payload);
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(payloadString)
            .digest('hex');

        return signature === expectedSignature;
    }

    async processWebhook(data: {
        code: string,
        amount: number,
        transactionId: string,
        signature?: string
    }): Promise<Order> {
        // Signature validation is handled in controller via API key
        // No need to verify again here

        const order = await this.orderRepository.findByCode(data.code);
        if (!order) throw new Error('Order not found');

        // Check amount
        if (Number(data.amount) < Number(order.amount)) {
            throw new Error('Insufficient amount');
        }

        if (order.status === OrderStatus.PAID) {
            return order;
        }

        // Update Order
        const updatedOrder = await this.orderRepository.update(order.id, {
            status: OrderStatus.PAID,
            updatedAt: new Date()
        });

        // Publish Event
        this.eventBus.publish({
            type: 'ORDER_PAID',
            payload: {
                orderId: order.id,
                code: order.code,
                userId: order.userId,
                isGift: order.isGift
            },
            timestamp: new Date()
        });

        return updatedOrder;
    }

    async getAllOrders(params: { page?: number; limit?: number; search?: string; status?: string } = {}) {
        const { page = 1, limit = 10, search, status } = params;
        const skip = (page - 1) * limit;

        const where: any = {};

        if (search) {
            where.OR = [
                { code: { contains: search, mode: 'insensitive' } },
                { user: { email: { contains: search, mode: 'insensitive' } } },
                { user: { profile: { name: { contains: search, mode: 'insensitive' } } } },
                { items: { some: { course: { title: { contains: search, mode: 'insensitive' } } } } }
            ];
        }

        if (status && status !== 'all') {
            where.status = status;
        }

        return this.orderRepository.findAll({ skip, take: limit, where, orderBy: { createdAt: 'desc' } });
    }

    async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
        const order = await this.orderRepository.findById(id);
        if (!order) throw new Error('Order not found');

        if (status === OrderStatus.PAID && order.status !== OrderStatus.PAID) {
            const updated = await this.orderRepository.update(id, { status: OrderStatus.PAID });

            // Allow manual manual trigger via Admin to flow through same event system
            this.eventBus.publish({
                type: 'ORDER_PAID',
                payload: { orderId: order.id, code: order.code, userId: order.userId, isGift: order.isGift },
                timestamp: new Date()
            });
            return updated;
        }

        return this.orderRepository.update(id, { status });
    }

    async getTransactions() {
        // Implementation remains similar or moved to repo
        // For now, keeping simple
        const prisma = require('../../../config/prisma').default;
        return prisma.paymentTransaction.findMany({ orderBy: { createdAt: 'desc' } });
    }
}
