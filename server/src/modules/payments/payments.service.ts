import prisma from '../../config/prisma';
import { OrderStatus } from '@prisma/client';

// Enhanced order creation with promo code support
export const createOrder = async (userId: string, courseId: string, amount: number, promoCodeId?: string) => {
    // Check if enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId
            }
        }
    });

    if (existingEnrollment) {
        throw new Error('Already enrolled');
    }

    const code = `ORD-${Date.now()}`; // Simple unique code

    let finalAmount = amount;
    let discount = 0;
    let originalAmount = amount;

    /*
    // Apply promo code if provided
    if (promoCodeId) {
        const promoCode = await prisma.promoCode.findUnique({
            where: { id: promoCodeId }
        });

        if (promoCode) {
            discount = PromoCodeService.calculateDiscount(amount, promoCode);
            finalAmount = amount - discount;

            // Increment usage count
            await prisma.promoCode.update({
                where: { id: promoCodeId },
                data: {
                    usedCount: {
                        increment: 1
                    }
                }
            });
        }
    }
    */

    // Transaction for order creation
    return prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
            data: {
                code,
                userId,
                amount: finalAmount,
                // originalAmount: promoCodeId ? originalAmount : null, // Removed: Not in schema
                // discount: promoCodeId ? discount : null, // Removed: Not in schema
                status: finalAmount <= 0 ? OrderStatus.PAID : OrderStatus.PENDING,
                // promoCodeId: promoCodeId || null, // Removed: Not in schema
                courses: {
                    connect: { id: courseId }
                }
            }
        });

        // If free, enroll immediately
        if (finalAmount <= 0) {
            await tx.enrollment.create({
                data: {
                    userId,
                    courseId
                }
            });
        }

        return order;
    });
};

export const getOrder = async (code: string) => {
    return prisma.order.findUnique({
        where: { code },
        include: { courses: true }
    });
};

// Sepay webhook signature verification
export const verifySepaySignature = (payload: any, signature: string): boolean => {
    const crypto = require('crypto');
    const secret = process.env.SEPAY_SECRET_KEY || '';

    if (!secret) {
        console.warn('SEPAY_SECRET_KEY not configured');
        return false;
    }

    // Create signature from payload
    const payloadString = JSON.stringify(payload);
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payloadString)
        .digest('hex');

    return signature === expectedSignature;
};

export const processWebhook = async (data: {
    code: string,
    amount: number,
    transactionId: string,
    signature?: string
}) => {
    // Verify signature if provided
    if (data.signature && process.env.SEPAY_SECRET_KEY) {
        const { signature, ...payload } = data;
        if (!verifySepaySignature(payload, signature)) {
            throw new Error('Invalid webhook signature');
        }
    }

    const order = await prisma.order.findUnique({
        where: { code: data.code },
        include: { courses: true }
    });

    if (!order) {
        throw new Error('Order not found');
    }

    // Verify amount (allow small difference if needed, but for now exact or greater)
    if (Number(data.amount) < Number(order.amount)) {
        throw new Error('Insufficient amount');
    }

    if (order.status === OrderStatus.PAID) {
        return order; // Already paid - idempotency
    }

    // Transaction
    return prisma.$transaction(async (tx) => {
        // 1. Update Order
        const updatedOrder = await tx.order.update({
            where: { id: order.id },
            data: {
                status: OrderStatus.PAID,
                updatedAt: new Date()
            }
        });

        // 2. Create Enrollments for all courses in order
        if (order.courses && order.courses.length > 0) {
            for (const course of order.courses) {
                // Check if already enrolled to avoid unique constraint error
                const existing = await tx.enrollment.findUnique({
                    where: {
                        userId_courseId: {
                            userId: order.userId,
                            courseId: course.id
                        }
                    }
                });

                if (!existing) {
                    await tx.enrollment.create({
                        data: {
                            userId: order.userId,
                            courseId: course.id
                        }
                    });
                }
            }
        }

        // 3. Send emails (non-blocking, outside transaction)
        // Get user info for email
        const user = await tx.user.findUnique({ where: { id: order.userId }, select: { email: true, name: true } });
        if (user) {
            const courseTitles = order.courses?.map(c => c.title) || [];
            // Import and send emails after transaction commits
            import('../../services/email.service').then(({ emailService }) => {
                emailService.sendPaymentSuccessEmail(user.email, user.name || 'Học viên', order.code, courseTitles);
                emailService.sendAdminOrderNotification(order.code, user.email, courseTitles, Number(order.amount));
            }).catch(err => console.log('Email service error:', err));
        }

        return updatedOrder;
    });
};
// Get all orders for Admin with pagination
export const getAllOrders = async (params: { page?: number; limit?: number; search?: string; status?: string } = {}) => {
    const { page = 1, limit = 10, search, status } = params;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
        where.OR = [
            { code: { contains: search, mode: 'insensitive' } },
            { user: { email: { contains: search, mode: 'insensitive' } } },
            { user: { name: { contains: search, mode: 'insensitive' } } },
            // { user: { fullName: { contains: search, mode: 'insensitive' } } },
            { courses: { some: { title: { contains: search, mode: 'insensitive' } } } }
        ];
    }

    if (status && status !== 'all') {
        where.status = status;
    }

    // Get basic stats (counts by status)
    const [total, orders, stats] = await Promise.all([
        prisma.order.count({ where }),
        prisma.order.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
            include: {
                user: { select: { id: true, email: true, name: true } },
                courses: { select: { id: true, title: true } }
            }
        }),
        prisma.order.groupBy({
            by: ['status'],
            _count: { id: true },
            _sum: { amount: true }
        })
    ]);

    // Format stats for frontend
    const statsMap: any = {
        total: stats.reduce((acc, curr) => acc + curr._count.id, 0),
        paid: stats.find(s => s.status === 'PAID')?._count.id || 0,
        pending: stats.find(s => s.status === 'PENDING')?._count.id || 0,
        cancelled: stats.find(s => s.status === 'CANCELLED')?._count.id || 0,
        totalRevenue: stats.reduce((acc, curr) => acc + (curr.status === 'PAID' || curr.status === 'COMPLETED' ? Number(curr._sum.amount || 0) : 0), 0)
    };

    return {
        data: orders,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            stats: statsMap
        }
    };
};

// Update order status (Admin)
export const updateOrderStatus = async (id: string, status: OrderStatus) => {
    const order = await prisma.order.findUnique({
        where: { id },
        include: { courses: true }
    });

    if (!order) throw new Error('Order not found');

    // If changing to PAID, ensure enrollment
    if ((status === OrderStatus.PAID) &&
        order.status !== OrderStatus.PAID) {

        return prisma.$transaction(async (tx) => {
            const updated = await tx.order.update({
                where: { id },
                data: { status }
            });

            if (order.courses && order.courses.length > 0) {
                for (const course of order.courses) {
                    const existing = await tx.enrollment.findUnique({
                        where: {
                            userId_courseId: {
                                userId: order.userId,
                                courseId: course.id
                            }
                        }
                    });

                    if (!existing) {
                        await tx.enrollment.create({
                            data: {
                                userId: order.userId,
                                courseId: course.id
                            }
                        });
                    }
                }
            }
            return updated;
        });
    }

    // Normal update (e.g. to CANCELLED)
    return prisma.order.update({
        where: { id },
        data: { status }
    });
};

export const getTransactions = async () => {
    return prisma.paymentTransaction.findMany({
        orderBy: { createdAt: 'desc' }
    });
};
