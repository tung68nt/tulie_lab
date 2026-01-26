import { Order, OrderStatus, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { IOrderRepository } from './interfaces/order.repository.interface';
import { EventBus } from '../../../core/event-bus';
import { IUserRepository } from '../../system/users/interfaces/user.repository.interface';
import { ICourseRepository } from '../../lms/courses/interfaces/course.repository.interface';
import { IProductRepository } from '../products/interfaces/product.repository.interface';
import { IActivationCodeRepository } from '../activation-codes/interfaces/activation-code.repository.interface';
import prisma from '../../../config/prisma';
import axios from 'axios';
import { env } from '../../../config/env';

import { ISettingRepository } from '../../system/settings/interfaces/setting.repository.interface';
import { SettingService } from '../../system/settings/settings.service';
import { container } from '../../../core/container';

export class PaymentService {
    constructor(
        private orderRepository: IOrderRepository,
        private userRepository: IUserRepository,
        private courseRepository: ICourseRepository,
        private productRepository: IProductRepository,
        private activationCodeRepository: IActivationCodeRepository,
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
        metadata?: any;
    }): Promise<{ order: Order, isNewUser: boolean }> {
        const { userId, userInfo, items, marketing, isGift, metadata, promoCodeId } = data;
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
        const code = `${timestamp}${randomString}`;

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
            },
            metadata: metadata || undefined,
            promoCodeId: promoCodeId || null
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
        const order = await this.orderRepository.findByCode(code);
        if (order) {
            const transactions = await prisma.paymentTransaction.findMany({
                where: { code: order.code },
                orderBy: { createdAt: 'desc' }
            });
            (order as any).transactions = transactions.map((tx: any) => ({
                ...tx,
                amount: Number(tx.amountIn || 0),
                bankName: tx.gateway || 'Chuyển khoản ngân hàng',
                createdAt: tx.transactionDate || tx.createdAt
            }));
        }
        return order;
    }

    async getOrderById(id: string): Promise<Order | null> {
        const order = await this.orderRepository.findById(id);
        if (order) {
            const transactions = await prisma.paymentTransaction.findMany({
                where: { code: order.code },
                orderBy: { createdAt: 'desc' }
            });
            (order as any).transactions = transactions.map((tx: any) => ({
                ...tx,
                amount: Number(tx.amountIn || 0),
                bankName: tx.gateway || 'Chuyển khoản ngân hàng',
                createdAt: tx.transactionDate || tx.createdAt
            }));
        }
        return order;
    }

    async deleteOrder(id: string): Promise<void> {
        const order = await this.orderRepository.findById(id);
        if (!order) throw new Error('Order not found');

        await this.orderRepository.delete(id);
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
        gateway?: string,
        transactionDate?: string,
        accountNumber?: string,
        subAccount?: string,
        content?: string,
        referenceCode?: string,
        description?: string,
        accumulated?: number
    }): Promise<Order> {

        // 1. Record the transaction first (Always record even if order not found for auditing)
        await prisma.paymentTransaction.create({
            data: {
                gateway: data.gateway ?? null,
                amountIn: data.amount,
                transactionDate: data.transactionDate ? new Date(data.transactionDate) : new Date(),
                accountNumber: data.accountNumber ?? null,
                subAccount: data.subAccount ?? null,
                code: data.code ?? null,
                content: data.content ?? null,
                referenceCode: data.referenceCode ?? null,
                description: data.description ?? null,
                accumulated: data.accumulated ?? null,
                id: data.transactionId // Use the gateway's transaction ID if possible
            }
        }).catch((err: any) => {
            console.error('Failed to record transaction:', err);
            // Don't throw, we still want to try processing the order
        });

        if (!data.code) {
            console.log(`[Webhook] No order code provided for transaction ${data.transactionId}. Transaction recorded but no order updated.`);
            return {} as Order; // Return empty or handle gracefully
        }

        const order = await this.orderRepository.findByCode(data.code);
        if (!order) {
            console.log(`[Webhook] Order ${data.code} not found for transaction ${data.transactionId}. Transaction recorded but no order updated.`);
            return {} as Order;
        }

        // Check amount (allow for small differences if needed, but strictly for now)
        if (Number(data.amount) < Number(order.amount)) {
            throw new Error('Insufficient amount');
        }

        if (order.status === OrderStatus.PAID) {
            return order;
        }

        // Update Order with status and transactionId
        const updatedOrder = await this.orderRepository.update(order.id, {
            status: OrderStatus.PAID,
            transactionId: data.transactionId,
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
        return prisma.paymentTransaction.findMany({ orderBy: { createdAt: 'desc' } });
    }

    async syncTransactions(accountNumber?: string) {
        let apiKey = env.SEPAY_API_KEY;

        if (!apiKey) {
            try {
                // Fallback to Settings Service - check for SEPAY_API_KEY first, then SYSTEM_API_KEY
                const settingService = container.resolve<SettingService>('SettingService');
                const settings = await settingService.getSettings(['SEPAY_API_KEY', 'SYSTEM_API_KEY']);
                apiKey = settings.SEPAY_API_KEY || settings.SYSTEM_API_KEY || undefined;
            } catch (err) {
                console.warn('Could not resolve SettingService for API Key:', err);
            }
        }

        if (!apiKey) {
            throw new Error('Cấu hình SePay API Key chưa hoàn tất. Vui lòng kiểm tra trong Cài đặt hệ thống.');
        }

        let url = `https://my.sepay.vn/userapi/transactions/list`;
        if (accountNumber) {
            url += `?account_number=${accountNumber}`;
        }

        try {
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });

            if (response.data && response.data.transactions) {
                const transactions = response.data.transactions;
                console.log(`Syncing ${transactions.length} transactions from SePay`);

                const results = {
                    total: transactions.length,
                    processed: 0,
                    errors: 0
                };

                for (const tx of transactions) {
                    try {
                        // Map SePay API response to our processWebhook format
                        const webhookData: any = {
                            code: undefined, // Will try to extract from content
                            amount: Number(tx.amount_in || 0),
                            transactionId: String(tx.id),
                            accumulated: tx.accumulated ? Number(tx.accumulated) : undefined,
                            content: tx.content || tx.description || ''
                        };

                        // Extract order code from content if it matches pattern
                        const orderCodePattern = /\d{6}[A-Z0-9]{4}/;
                        const match = webhookData.content.toUpperCase().match(orderCodePattern);
                        if (match) {
                            webhookData.code = match[0];
                        }

                        if (tx.bank_name || tx.gateway) webhookData.gateway = tx.bank_name || tx.gateway;
                        if (tx.transaction_date) webhookData.transactionDate = tx.transaction_date;
                        if (tx.account_number) webhookData.accountNumber = tx.account_number;
                        if (tx.sub_account) webhookData.subAccount = tx.sub_account;
                        if (tx.reference_number) webhookData.referenceCode = tx.reference_number;
                        if (tx.description) webhookData.description = tx.description;

                        // Process the webhook (it will record transaction even if code not found)
                        await this.processWebhook(webhookData);
                        results.processed++;
                    } catch (err: any) {
                        console.error(`Failed to process transaction ${tx.id}:`, err.message);
                        results.errors++;
                    }
                }

                return results;
            }

            return { total: 0, processed: 0, errors: 0 };
        } catch (error: any) {
            console.error('Payment Sync Error:', error.response?.data || error.message);
            throw new Error(`Payment Sync Failed: ${error.message}`);
        }
    }
}
