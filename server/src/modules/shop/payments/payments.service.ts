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
        items: { id: string, type: 'COURSE' | 'PRODUCT' | 'BUNDLE', options?: any }[];
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
            } else if (item.type === 'BUNDLE') {
                const bundle = await prisma.bundle.findUnique({
                    where: { id: item.id },
                    include: { courses: true }
                });
                if (!bundle) throw new Error(`Bundle not found: ${item.id}`);

                const coursesCount = bundle.courses.length;
                if (coursesCount === 0) throw new Error('Bundle has no courses');

                // Split bundle price among courses for tracking
                // In a more complex system, we might want a 'BUNDLE' type in OrderItem
                const pricePerCourse = Math.floor(bundle.salePrice / coursesCount);
                const remainder = bundle.salePrice % coursesCount;

                for (let i = 0; i < coursesCount; i++) {
                    const bc = bundle.courses[i];
                    if (!bc) continue;
                    orderItemsData.push({
                        courseId: bc.courseId,
                        price: i === 0 ? pricePerCourse + remainder : pricePerCourse,
                        metadata: item.options ? { ...item.options, bundleId: bundle.id } : { bundleId: bundle.id }
                    });
                }
                totalAmount += bundle.salePrice;
            }
        }

        // 3. Create Order
        const randomString = Math.random().toString(36).substring(2, 6).toUpperCase();
        const timestamp = Date.now().toString().slice(-6);
        const code = `DH${timestamp}${randomString}`;

        // Ensure status reflects calculation
        const initialStatus = totalAmount <= 0 ? OrderStatus.PAID : OrderStatus.PENDING;

        // Handle invoice info
        let invoiceProfileId = null;
        if (metadata?.requestInvoice && metadata?.invoiceInfo) {
            const info = metadata.invoiceInfo;
            if (info.id) {
                // Check if profile exists or create new one
                // Use prisma directly here if needed
                const existingProfile = await (prisma as any).userInvoiceProfile.findFirst({
                    where: {
                        id: info.id,
                        userId: finalUserId!
                    }
                });
                if (existingProfile) {
                    invoiceProfileId = existingProfile.id;
                } else {
                    // If ID is provided but profile doesn't exist for this user, create a new one
                    try {
                        const profile = await (prisma as any).userInvoiceProfile.create({
                            data: {
                                userId: finalUserId!,
                                companyName: info.companyName,
                                taxCode: info.taxCode,
                                address: info.address,
                                email: info.email,
                                isDefault: true
                            }
                        });
                        invoiceProfileId = profile.id;
                    } catch (err) {
                        console.error('Failed to auto-create invoice profile:', err);
                    }
                }
            } else {
                try {
                    const profile = await (prisma as any).userInvoiceProfile.create({
                        data: {
                            userId: finalUserId!,
                            companyName: info.companyName,
                            taxCode: info.taxCode,
                            address: info.address,
                            email: info.email,
                            isDefault: true
                        }
                    });
                    invoiceProfileId = profile.id;
                } catch (err) {
                    console.error('Failed to auto-create invoice profile:', err);
                }
            }
        }

        const order = await (this.orderRepository as any).create({
            code,
            user: { connect: { id: finalUserId! } },
            amount: totalAmount,
            status: initialStatus,
            isGift: !!isGift,
            items: {
                create: orderItemsData
            },
            metadata: metadata || undefined,
            promoCodeId: promoCodeId || null,
            invoiceProfile: invoiceProfileId ? { connect: { id: invoiceProfileId } } : undefined,
            marketingLead: marketing ? {
                create: {
                    source: marketing.source,
                    medium: marketing.medium,
                    campaign: marketing.campaign,
                    term: marketing.term,
                    content: marketing.content,
                    fbc: marketing.fbc,
                    fbp: marketing.fbp,
                    gclid: marketing.gclid,
                    clickId: marketing.clickId,
                    userId: finalUserId
                }
            } : undefined
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

    private async enrichOrderWithTransactions(order: Order | null): Promise<Order | null> {
        if (!order) return null;

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

        return order;
    }

    async getOrder(code: string): Promise<Order | null> {
        const order = await this.orderRepository.findByCode(code);
        return this.enrichOrderWithTransactions(order);
    }

    async getOrderById(id: string): Promise<Order | null> {
        const order = await this.orderRepository.findById(id);
        return this.enrichOrderWithTransactions(order);
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

        console.log(`[Webhook] 🔍 Searching for order with code: "${data.code}" (length: ${data.code.length})`);

        const order = await this.orderRepository.findByCode(data.code);

        if (!order) {
            // Try to find similar orders for debugging
            const allPendingOrders = await prisma.order.findMany({
                where: { status: OrderStatus.PENDING },
                select: { code: true, amount: true },
                take: 10,
                orderBy: { createdAt: 'desc' }
            });
            console.log(`[Webhook] ❌ Order "${data.code}" not found. Recent pending orders:`,
                allPendingOrders.map((o: any) => `${o.code} (${o.amount})`).join(', '));
            console.log(`[Webhook] Transaction ${data.transactionId} recorded but no order updated.`);
            return {} as Order;
        }

        console.log(`[Webhook] ✅ Found order: ${order.code}, status: ${order.status}, amount: ${order.amount}`);

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

    async getRecentPublicOrders(limit = 10) {
        // Fetch only PAID orders with user profile and course titles
        const orders = await prisma.order.findMany({
            where: {
                status: OrderStatus.PAID,
                userId: { not: null }
            },
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    include: {
                        profile: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                items: {
                    include: {
                        course: {
                            select: { title: true }
                        },
                        product: {
                            select: { title: true }
                        }
                    }
                }
            }
        });

        const anonymize = (name: string) => {
            if (!name) return 'Khách hàng';
            const parts = name.split(' ');
            if (parts.length === 1) return parts[0];
            const last = parts[parts.length - 1];
            const rest = parts.slice(0, -1).map(p => p[0]).join('. ');
            return `${rest}. ${last}`;
        };

        return orders.map(order => {
            const name = order.user?.profile?.name || 'Khách hàng';
            const item = order.items[0]?.course?.title || order.items[0]?.product?.title || 'khóa học';

            return {
                id: order.id,
                name: anonymize(name),
                location: 'Việt Nam', // We don't track location yet, maybe random from a set or default
                action: `vừa đăng ký ${item}`,
                time: 'Gần đây',
                createdAt: order.createdAt
            };
        });
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

    async getTransactions(params: {
        page?: number;
        limit?: number;
        search?: string;
        startDate?: string;
        endDate?: string;
    } = {}) {
        const { page = 1, limit = 20, search, startDate, endDate } = params;
        const skip = (page - 1) * limit;

        const where: any = {};

        if (search) {
            where.OR = [
                { code: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } },
                { accountNumber: { contains: search, mode: 'insensitive' } },
                { referenceCode: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }

        if (startDate || endDate) {
            where.transactionDate = {};
            if (startDate) where.transactionDate.gte = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                where.transactionDate.lte = end;
            }
        }

        const [transactions, total] = await Promise.all([
            prisma.paymentTransaction.findMany({
                where,
                skip,
                take: limit,
                orderBy: [
                    { transactionDate: 'desc' },
                    { createdAt: 'desc' }
                ]
            }),
            prisma.paymentTransaction.count({ where })
        ]);

        // Efficiently enrich with orderId by batching the lookup
        const orderCodes = transactions
            .map((tx: any) => tx.code)
            .filter((code: any): code is string => !!code && code.startsWith('DH'));

        let codeToOrderId: Record<string, string> = {};
        if (orderCodes.length > 0) {
            const orders = await prisma.order.findMany({
                where: { code: { in: orderCodes } },
                select: { id: true, code: true }
            });
            codeToOrderId = orders.reduce((acc: any, order: any) => {
                acc[order.code] = order.id;
                return acc;
            }, {} as Record<string, string>);
        }

        const enrichedTransactions = transactions.map((tx: any) => {
            if (tx.code && codeToOrderId[tx.code]) {
                return { ...tx, orderId: codeToOrderId[tx.code] };
            }
            return tx;
        });

        return { data: enrichedTransactions, total };
    }

    async syncTransactions(params: {
        accountNumber?: string;
        limit?: number;
        dateMin?: string;
        dateMax?: string;
    } = {}) {
        let gateways: any[] = [];
        const settingService = container.resolve<SettingService>('SettingService');

        try {
            const settings = await settingService.getSettings(['payment_gateways', 'SEPAY_API_KEY', 'bank_account_no']);
            if (settings.payment_gateways) {
                gateways = JSON.parse(settings.payment_gateways);
            }

            // Fallback for legacy SePay config if no gateways are defined
            if (gateways.length === 0) {
                const legacyKey = settings.SEPAY_API_KEY || env.SEPAY_API_KEY;
                if (legacyKey) {
                    gateways.push({
                        id: 'legacy-sepay',
                        name: 'SePay (Legacy)',
                        type: 'SEPAY',
                        isActive: true,
                        config: {
                            apiKey: legacyKey,
                            accountNumber: settings.bank_account_no
                        }
                    });
                }
            }
        } catch (err) {
            console.warn('[PaymentService] Failed to load payment gateways from settings:', err);
        }

        const results = {
            total: 0,
            processed: 0,
            errors: 0
        };

        for (const gateway of gateways) {
            if (!gateway.isActive) continue;

            try {
                if (gateway.type === 'SEPAY') {
                    const res = await this.syncSePay({
                        apiKey: gateway.config.apiKey,
                        accountNumber: gateway.config.accountNumber || params.accountNumber || "",
                        limit: params.limit ?? 100,
                        dateMin: params.dateMin ?? "",
                        dateMax: params.dateMax ?? ""
                    });
                    results.total += res.total;
                    results.processed += res.processed;
                    results.errors += res.errors;
                } else {
                    console.log(`[PaymentService] Sync not implemented for gateway type: ${gateway.type}`);
                }
            } catch (err: any) {
                console.error(`[PaymentService] Failed to sync gateway ${gateway.name || gateway.id}:`, err.message);
                results.errors++;
            }
        }

        return results;
    }

    private async syncSePay(params: {
        apiKey: string;
        accountNumber?: string;
        limit?: number;
        dateMin?: string;
        dateMax?: string;
    }) {
        const { apiKey, accountNumber, limit = 100, dateMin, dateMax } = params;

        let url = `https://my.sepay.vn/userapi/transactions/list`;
        const queryParams = new URLSearchParams();
        if (accountNumber) queryParams.append('account_number', accountNumber);
        queryParams.append('limit', String(limit > 5000 ? 5000 : limit));
        if (dateMin) queryParams.append('transaction_date_min', dateMin);
        if (dateMax) queryParams.append('transaction_date_max', dateMax);

        url += `?${queryParams.toString()}`;

        try {
            // Robust cleaning: remove quotes and 'Bearer ' prefix if user pasted it
            const cleanApiKey = apiKey.trim().replace(/^["'`]|["'`]$/g, '').replace(/^Bearer\s+/i, '');
            console.log(`[SePay Sync] Using API Key: ${cleanApiKey.charAt(0)}...${cleanApiKey.slice(-4)} (Length: ${cleanApiKey.length})`);

            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${cleanApiKey}`
                }
            });

            if (response.data && response.data.transactions) {
                const transactions = response.data.transactions;
                console.log(`[SePay Sync] Syncing ${transactions.length} transactions from SePay User API`);

                const results = {
                    total: transactions.length,
                    processed: 0,
                    errors: 0
                };

                for (const tx of transactions) {
                    try {
                        const content = tx.transaction_content || tx.description || '';
                        // Map SePay API response to our processWebhook format
                        const webhookData: any = {
                            code: undefined, // Will try to extract from content
                            amount: Number(tx.amount_in || 0),
                            transactionId: String(tx.id),
                            accumulated: tx.accumulated ? Number(tx.accumulated) : undefined,
                            content: content
                        };

                        // Extract order code from content if it matches pattern
                        const orderCodePattern = /DH[A-Z0-9]{6,12}/i;
                        const match = webhookData.content.match(orderCodePattern);
                        if (match) {
                            webhookData.code = match[0].toUpperCase();
                        }

                        if (tx.bank_brand_name || tx.gateway) webhookData.gateway = tx.bank_brand_name || tx.gateway;
                        if (tx.transaction_date) webhookData.transactionDate = tx.transaction_date;
                        if (tx.account_number) webhookData.accountNumber = tx.account_number;
                        if (tx.sub_account) webhookData.subAccount = tx.sub_account;
                        if (tx.reference_number) webhookData.referenceCode = tx.reference_number;
                        if (tx.description) webhookData.description = tx.description;

                        // Upsert transaction
                        await prisma.paymentTransaction.upsert({
                            where: { id: webhookData.transactionId },
                            update: {
                                code: webhookData.code ?? null,
                                content: webhookData.content ?? null,
                                description: webhookData.description ?? null,
                            },
                            create: {
                                gateway: webhookData.gateway ?? null,
                                amountIn: webhookData.amount,
                                transactionDate: webhookData.transactionDate ? new Date(webhookData.transactionDate) : new Date(),
                                accountNumber: webhookData.accountNumber ?? null,
                                subAccount: webhookData.subAccount ?? null,
                                code: webhookData.code ?? null,
                                content: webhookData.content ?? null,
                                referenceCode: webhookData.referenceCode ?? null,
                                description: webhookData.description ?? null,
                                accumulated: webhookData.accumulated ?? null,
                                id: webhookData.transactionId
                            }
                        });

                        // Trigger processing (idempotent at order level)
                        if (webhookData.code) {
                            await this.processWebhook(webhookData);
                        }

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
            console.error('Payment Sync Error:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
                url: url
            });
            if (error.response?.status === 401) {
                throw new Error('Lỗi xác thực SePay (401). Vui lòng kiểm tra lại API Key.');
            }
            throw new Error(`Lỗi đồng bộ SePay: ${error.message}`);
        }
    }
}
