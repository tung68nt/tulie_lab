import { IUserRepository } from './interfaces/user.repository.interface';
import prisma from '../../../config/prisma'; // Still needed for some complex raw queries/enrollments if not refactored yet

export class UserService {
    constructor(private userRepository: IUserRepository) { }

    async getUserById(id: string) {
        const user = await this.userRepository.findById(id, {
            profile: true,
            subscriptions: true,
            enrollments: { include: { course: true } },
            orders: {
                include: {
                    items: {
                        include: {
                            course: true,
                            product: {
                                include: {
                                    versions: {
                                        orderBy: { createdAt: 'desc' }
                                    }
                                }
                            }
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            }
        });

        if (user && (user as any).orders) {
            (user as any).orders = (user as any).orders.map((order: any) => ({
                ...order,
                courses: order.items.filter((i: any) => i.courseId).map((i: any) => i.course),
                products: order.items.filter((i: any) => i.productId).map((i: any) => i.product)
            }));
        }

        return user;
    }

    async getUserDetailsForAdmin(id: string) {
        try {
            // PHASE 1: Core User Data (Essential)
            const user = await this.userRepository.findById(id, {
                profile: true,
                subscriptions: {
                    include: { product: true },
                    orderBy: { endDate: 'desc' }
                },
                enrollments: {
                    include: { course: { select: { id: true, title: true, slug: true, thumbnail: true } } },
                    orderBy: { createdAt: 'desc' }
                }
            });

            if (!user) {
                console.warn(`[UserService.getUserDetailsForAdmin] User not found: ${id}`);
                return null;
            }

            console.log(`[UserService.getUserDetailsForAdmin] Base data loaded for: ${user.email}`);

            // PHASE 2: Advanced Relations (Safe Mode)
            let orders: any[] = [];
            let activities: any[] = [];
            let securityLogs: any[] = [];
            let lastLogin: any = null;
            let progress: any[] = [];

            try {
                // Fetch optional data in parallel with individual error handling
                const results = await Promise.allSettled([
                    prisma.order.findMany({
                        where: { userId: id },
                        include: {
                            items: {
                                include: {
                                    course: { select: { id: true, title: true } },
                                    product: {
                                        include: {
                                            versions: { orderBy: { createdAt: 'desc' }, take: 1 }
                                        }
                                    }
                                }
                            }
                        },
                        orderBy: { createdAt: 'desc' }
                    }),
                    prisma.activityLog.findMany({
                        where: { userId: id },
                        orderBy: { createdAt: 'desc' },
                        take: 100
                    }),
                    prisma.securityLog.findMany({
                        where: { userId: id },
                        orderBy: { createdAt: 'desc' },
                        take: 50
                    }),
                    prisma.activityLog.findFirst({
                        where: { userId: id, action: 'login' },
                        orderBy: { createdAt: 'desc' }
                    }),
                    prisma.lessonProgress.findMany({
                        where: { userId: id },
                        select: { lessonId: true, isCompleted: true, updatedAt: true },
                        orderBy: { updatedAt: 'desc' },
                        take: 100
                    })
                ]);

                if (results[0].status === 'fulfilled') orders = results[0].value;
                if (results[1].status === 'fulfilled') activities = results[1].value;
                if (results[2].status === 'fulfilled') securityLogs = results[2].value;
                if (results[3].status === 'fulfilled') lastLogin = results[3].value;
                if (results[4].status === 'fulfilled') progress = results[4].value;

                // Log any failures in optional data
                results.forEach((res, idx) => {
                    if (res.status === 'rejected') {
                        console.error(`[UserService.getUserDetailsForAdmin] Optional fetch ${idx} failed:`, res.reason);
                    }
                });
            } catch (pErr) {
                console.error('[UserService.getUserDetailsForAdmin] Parallel fetch block failed:', pErr);
            }

            // PHASE 3: Data Processing (Safe Mode)
            let processedOrders: any[] = [];
            let pendingOrders: any[] = [];
            let purchasedProducts: any[] = [];
            let stats = {
                totalEnrollments: (user as any).enrollments?.length || 0,
                totalOrders: 0,
                totalPaid: 0,
                completedLessons: 0,
                totalLessons: 0
            };

            try {
                const orderCodes = orders.map((o: any) => o.code).filter(Boolean);
                const transactions = orderCodes.length > 0 ? await prisma.paymentTransaction.findMany({
                    where: { code: { in: orderCodes } }
                }).catch(() => []) : [];

                processedOrders = orders.map((o: any) => ({
                    ...o,
                    transactions: transactions
                        .filter((tx: any) => tx.code === o.code)
                        .map((tx: any) => ({
                            ...tx,
                            amount: Number(tx.amountIn || 0),
                            bankName: tx.gateway || 'Bank Transfer'
                        }))
                }));

                pendingOrders = orders.filter((o: any) => o.status === 'PENDING');

                purchasedProducts = orders
                    .filter((o: any) => o.status === 'PAID')
                    .flatMap((o: any) => (o.items || []).map((i: any) => ({
                        ...(i.product || {}),
                        purchasedAt: o.createdAt,
                        currentVersion: i.product?.versions?.[0]?.version || '1.0.0'
                    })))
                    .filter(p => p.id);

                // Stats
                const enrollmentIds = (user as any).enrollments?.map((e: any) => e.courseId).filter(Boolean) || [];
                const totalLessonsCount = enrollmentIds.length > 0 ? await prisma.lesson.count({
                    where: { courseId: { in: enrollmentIds } }
                }).catch(() => 0) : 0;

                stats = {
                    totalEnrollments: (user as any).enrollments?.length || 0,
                    totalOrders: orders.length,
                    totalPaid: orders.filter((o: any) => o.status === 'PAID').reduce((sum, o) => sum + Number(o.amount || 0), 0),
                    completedLessons: progress.filter((p: any) => p.isCompleted).length,
                    totalLessons: totalLessonsCount
                };

            } catch (procErr) {
                console.error('[UserService.getUserDetailsForAdmin] Data processing failed:', procErr);
            }

            return {
                ...user,
                orders: processedOrders,
                activities,
                securityLogs,
                purchasedProducts,
                lastLoginAt: lastLogin?.createdAt || null,
                lastLoginIp: lastLogin?.ipAddress || null,
                pendingOrders,
                stats,
                progress
            };
        } catch (error: any) {
            console.error(`[UserService.getUserDetailsForAdmin] FATAL CRASH for ID: ${id}`);
            console.error(error);
            // Throwing here triggers 500, but is safer than returning null if we want to know why it's failing
            // Actually, for triệt để fix, let's return a basic user object if possible
            try {
                const basicUser = await this.userRepository.findById(id, { profile: true });
                if (basicUser) return { ...basicUser, error: 'Partial data load' };
            } catch (inner) { }
            return null;
        }
    }

    async updateUser(id: string, data: any) {
        console.log('[UserService] updateUser input:', id, data);

        // Destructure known profile fields
        const {
            name, phone, birthDate, address, city,
            occupation, company, avatar,
            allowEmailMarketing, allowSMSMarketing,
            ...userData
        } = data;

        // Construct profile data explicitly
        const profileInput: any = {
            name, phone, address, city,
            occupation, company, avatar,
            allowEmailMarketing, allowSMSMarketing
        };

        // Handle birthDate separately
        if (birthDate !== undefined) {
            profileInput.birthDate = birthDate;
        }

        // Remove undefined keys
        Object.keys(profileInput).forEach(key =>
            profileInput[key] === undefined && delete profileInput[key]
        );

        console.log('[UserService] profileInput:', profileInput);
        console.log('[UserService] userData (User model fields):', userData);

        const updatedUser = await this.userRepository.update(id, {
            ...userData,
            profile: {
                upsert: {
                    create: profileInput,
                    update: profileInput
                }
            }
        } as any);

        console.log('[UserService] updatedUser result:', updatedUser);
        return updatedUser;
    }

    async getAllUsers(pageIndex: number = 1, limit: number = 20, search?: string) {
        const skip = (pageIndex - 1) * limit;
        const where: any = {};
        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { profile: { name: { contains: search, mode: 'insensitive' } } }
            ];
        }

        const [users, total, roleCounts] = await Promise.all([
            this.userRepository.findMany({
                where,
                select: { id: true, email: true, role: true, createdAt: true, profile: { select: { name: true } } },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            this.userRepository.count(where),
            this.userRepository.groupByRole()
        ]);

        return {
            data: users,
            pagination: { page: pageIndex, limit, total, totalPages: Math.ceil(total / limit) },
            stats: {
                total,
                admins: roleCounts.find(r => r.role === 'ADMIN')?._count?._all || 0,
                users: roleCounts.find(r => r.role === 'USER')?._count?._all || 0
            }
        };
    }

    async enrollUser(userId: string, courseId: string) {
        const existing = await prisma.enrollment.findUnique({
            where: { userId_courseId: { userId, courseId } }
        });
        if (existing) return existing;
        return prisma.enrollment.create({ data: { userId, courseId } });
    }

    async getUserOrders(userId: string) {
        const orders = await prisma.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        course: { select: { id: true, title: true, slug: true } },
                        product: { select: { id: true, title: true, slug: true, thumbnail: true, type: true } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return orders.map((order: any) => ({
            ...order,
            courses: order.items.filter((i: any) => i.courseId).map((i: any) => i.course),
            products: order.items.filter((i: any) => i.productId).map((i: any) => i.product)
        }));
    }

    async unenrollUser(userId: string, courseId: string) {
        return prisma.enrollment.delete({ where: { userId_courseId: { userId, courseId } } });
    }

    async getInactiveUsers(inactiveDays: number = 7) {
        const usersWithEnrollments = await this.userRepository.findMany({
            where: { role: 'USER', enrollments: { some: {} } },
            select: { id: true, email: true, createdAt: true, profile: { select: { name: true } }, enrollments: { select: { course: { select: { title: true } } }, take: 3 } }
        });

        const userIds = usersWithEnrollments.map(u => u.id);

        // Batch fetch latest activities for these users
        // Since we want the *latest* per user, and Prisma groupBy doesn't give full object easily, 
        // we can fetch recent logs for these users and process in memory (assuming not millions of logs yet for inactive users).
        // A optimized way: Fetch logs where userId in userIds, orderBy createdAt desc.
        // To avoid fetching ALL logs, we might rely on the fact that if they are inactive, they haven't logged in recently?
        // But we need the *last* date. 
        // Let's use a raw query for performance or a simplified logic.
        // Simple optimization:
        const lastActivities = await prisma.activityLog.findMany({
            where: { userId: { in: userIds } },
            orderBy: { createdAt: 'desc' },
            distinct: ['userId'], // Postgres-specific feature supported by Prisma? Yes, distinct is supported.
            select: { userId: true, createdAt: true }
        });

        const activityMap = new Map();
        lastActivities.forEach(log => {
            if (log.userId) activityMap.set(log.userId, log.createdAt);
        });

        const inactiveUsers = [];
        for (const user of usersWithEnrollments) {
            const lastData = activityMap.get(user.id);
            const lastActivityDate = lastData || user.createdAt;
            const daysSinceActivity = Math.floor((Date.now() - new Date(lastActivityDate).getTime()) / (1000 * 60 * 60 * 24));

            if (daysSinceActivity >= inactiveDays) {
                inactiveUsers.push({
                    ...user,
                    lastActivityAt: lastActivityDate,
                    daysSinceActivity,
                    courses: user.enrollments.map((e: any) => e.course.title)
                });
            }
        }
        return inactiveUsers.sort((a, b) => b.daysSinceActivity - a.daysSinceActivity);
    }

    async grantMembership(userId: string, days: number = 365, tier: string = 'PREMIUM') {
        const tierLower = tier.toLowerCase();

        // 1. Deactivate all existing ACTIVE subscriptions
        await prisma.subscription.updateMany({
            where: {
                userId,
                status: 'ACTIVE'
            },
            data: {
                status: 'EXPIRED',
                updatedAt: new Date()
            }
        });

        // 2. If tier is FREE, we are done after deactivating
        if (tier.toUpperCase() === 'FREE') {
            console.log(`[UserService.grantMembership] Downgraded user ${userId} to FREE. Old subscriptions deactivated.`);
            return null;
        }

        // 3. Create new subscription
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + days);

        // 3. Try to find a subscription product that matches the tier
        let product = await prisma.product.findFirst({
            where: {
                type: 'SUBSCRIPTION',
                OR: [
                    { slug: { contains: tierLower, mode: 'insensitive' } },
                    { title: { contains: tierLower, mode: 'insensitive' } }
                ]
            }
        });

        // Fallback or generic matching
        if (!product) {
            console.warn(`[UserService.grantMembership] No specific product found for tier: ${tier}. Searching for any subscription product.`);
            product = await prisma.product.findFirst({
                where: { type: 'SUBSCRIPTION' },
                orderBy: { createdAt: 'asc' }
            });
        }

        console.log(`[UserService.grantMembership] Granting ${tier} to user ${userId} for ${days} days until ${endDate.toISOString()}`);

        return prisma.subscription.create({
            data: {
                userId,
                status: 'ACTIVE',
                startDate: new Date(),
                endDate,
                productId: product?.id || null
            }
        });
    }

    async blockUser(id: string) {
        return this.userRepository.update(id, { isActive: false });
    }

    async unblockUser(id: string) {
        return this.userRepository.update(id, { isActive: true });
    }

    async addUserNote(userId: string, content: string, adminId?: string, adminName?: string) {
        return (prisma as any).userNote.create({
            data: {
                userId,
                content,
                adminId: adminId || null,
                adminName: adminName || null
            }
        });
    }

    async getUserNotes(userId: string) {
        return (prisma as any).userNote.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
    }

    async getInvoiceProfiles(userId: string) {
        return (prisma as any).userInvoiceProfile.findMany({
            where: { userId },
            orderBy: { isDefault: 'desc' }
        });
    }

    async createInvoiceProfile(userId: string, data: { companyName: string, taxCode: string, address: string, email?: string, isDefault?: boolean }) {
        if (data.isDefault) {
            await (prisma as any).userInvoiceProfile.updateMany({
                where: { userId },
                data: { isDefault: false }
            });
        }
        return (prisma as any).userInvoiceProfile.create({
            data: {
                ...data,
                userId
            }
        });
    }

    async deleteUser(id: string) {
        // Soft delete or hard delete? User requested "xoá tài khoản"
        // In most SaaS, soft delete is safer. But let's assume hard delete if requested in admin panel.
        // Actually, userRepository should handle deletion.
        return (this.userRepository as any).delete(id);
    }
}
