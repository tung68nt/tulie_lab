import prisma from '../../../config/prisma';

export class CrmService {
    async getProducts() {
        return prisma.product.findMany({
            include: {
                versions: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            }
        });
    }

    async getUsers(page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            prisma.user.findMany({
                skip,
                take: limit,
                select: {
                    id: true,
                    email: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                    profile: true,
                    _count: {
                        select: {
                            orders: true,
                            subscriptions: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.user.count()
        ]);

        return { users, total, page, limit };
    }

    async getOrders(page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                skip,
                take: limit,
                include: {
                    user: {
                        select: {
                            email: true,
                            profile: { select: { name: true, phone: true } }
                        }
                    },
                    items: {
                        include: {
                            course: { select: { title: true } },
                            product: { select: { title: true } }
                        }
                    },
                    invoiceProfile: true
                },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.order.count()
        ]);

        return { orders, total, page, limit };
    }

    async getTransactions(page = 1, limit = 100) {
        const skip = (page - 1) * limit;
        const [transactions, total] = await Promise.all([
            prisma.paymentTransaction.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.paymentTransaction.count()
        ]);

        return { transactions, total, page, limit };
    }

    async getSubscriptions(page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const [subscriptions, total] = await Promise.all([
            prisma.subscription.findMany({
                skip,
                take: limit,
                include: {
                    user: { select: { email: true } },
                    product: { select: { title: true } }
                },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.subscription.count()
        ]);

        return { subscriptions, total, page, limit };
    }

    async getDailyReportStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [
            todayOrders,
            todayPaidOrders,
            todayRevenue,
            todayNewUsers,
            securityRisks
        ] = await Promise.all([
            prisma.order.count({ where: { createdAt: { gte: today } } }),
            prisma.order.count({ where: { createdAt: { gte: today }, status: 'PAID' } }),
            prisma.order.aggregate({
                where: { createdAt: { gte: today }, status: 'PAID' },
                _sum: { amount: true }
            }),
            prisma.user.count({ where: { createdAt: { gte: today } } }),
            prisma.securityLog.count({ where: { createdAt: { gte: today } } })
        ]);

        return {
            todayOrders,
            todayPaidOrders,
            todayRevenue: Number(todayRevenue._sum.amount || 0),
            todayNewUsers,
            securityRisks
        };
    }

    async getStats() {
        const [totalRevenue, totalOrders, totalUsers, activeSubscriptions] = await Promise.all([
            prisma.order.aggregate({
                where: { status: 'PAID' },
                _sum: { amount: true }
            }),
            prisma.order.count({ where: { status: 'PAID' } }),
            prisma.user.count(),
            prisma.subscription.count({ where: { status: 'ACTIVE' } })
        ]);

        return {
            revenue: Number(totalRevenue._sum.amount || 0),
            orders: totalOrders,
            users: totalUsers,
            activeSubscriptions
        };
    }
    async getSystemReport(period: 'day' | 'week' | 'month' = 'day') {
        const now = new Date();
        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0);

        if (period === 'week') {
            const day = startDate.getDay(); // 0 is Sunday
            const diff = startDate.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
            startDate.setDate(diff);
        } else if (period === 'month') {
            startDate.setDate(1);
        }

        const [
            ordersCount,
            paidOrdersCount,
            revenue,
            newUsersCount,
            securityRisks
        ] = await Promise.all([
            prisma.order.count({ where: { createdAt: { gte: startDate } } }),
            prisma.order.count({ where: { createdAt: { gte: startDate }, status: 'PAID' } }),
            prisma.order.aggregate({
                where: { createdAt: { gte: startDate }, status: 'PAID' },
                _sum: { amount: true }
            }),
            prisma.user.count({ where: { createdAt: { gte: startDate } } }),
            prisma.securityLog.count({ where: { createdAt: { gte: startDate } } })
        ]);

        // Count pending orders (always total, not time based)
        const pendingOrders = await prisma.order.count({
            where: { status: 'PENDING' }
        });

        // Count inactive users (always total)
        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
        const inactiveUsers = await prisma.user.count({
            where: {
                role: 'USER',
                isActive: true,
                updatedAt: { lt: fourteenDaysAgo },
            }
        });

        // Map report title
        let title = 'HÔM NAY';
        if (period === 'week') title = 'TUẦN NÀY';
        if (period === 'month') title = 'THÁNG NÀY';

        return {
            title,
            todayOrders: ordersCount,
            todayPaidOrders: paidOrdersCount,
            todayRevenue: Number(revenue._sum.amount || 0),
            todayNewUsers: newUsersCount,
            pendingOrders,
            inactiveUsers,
            securityRisks,
            systemStatus: 'Hoạt động ổn định'
        };
    }

    // Deprecated wrapper for backward compatibility
    async getFullSystemReport() {
        return this.getSystemReport('day');
    }
}
