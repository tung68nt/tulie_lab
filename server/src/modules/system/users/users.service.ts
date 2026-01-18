import { IUserRepository } from './interfaces/user.repository.interface';
import prisma from '../../../config/prisma'; // Still needed for some complex raw queries/enrollments if not refactored yet

export class UserService {
    constructor(private userRepository: IUserRepository) { }

    async getUserById(id: string) {
        return this.userRepository.findById(id, {
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
    }

    async getUserDetailsForAdmin(id: string) {
        const user = await this.userRepository.findById(id, {
            enrollments: {
                include: { course: { select: { id: true, title: true, slug: true, thumbnail: true } } },
                orderBy: { createdAt: 'desc' }
            },
            orders: {
                include: { items: { include: { course: { select: { id: true, title: true } } } } },
                orderBy: { createdAt: 'desc' }
            },
            progress: {
                select: { lessonId: true, isCompleted: true, updatedAt: true },
                orderBy: { updatedAt: 'desc' },
                take: 20
            }
        });

        if (!user) return null;

        const activities = await prisma.activityLog.findMany({
            where: { userId: id },
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        const lastLogin = await prisma.activityLog.findFirst({
            where: { userId: id, action: 'login' },
            orderBy: { createdAt: 'desc' }
        });

        const pendingOrders = (user as any).orders.filter((o: any) => o.status === 'PENDING').map((o: any) => ({
            ...o,
            pendingDays: Math.floor((Date.now() - new Date(o.createdAt).getTime()) / (1000 * 60 * 60 * 24))
        }));

        return {
            ...user,
            activities,
            lastLoginAt: lastLogin?.createdAt || null,
            lastLoginIp: lastLogin?.ipAddress || null,
            pendingOrders,
            stats: {
                totalEnrollments: (user as any).enrollments.length,
                totalOrders: (user as any).orders.length,
                totalPaid: (user as any).orders.filter((o: any) => o.status === 'PAID').reduce((sum: number, o: any) => sum + o.amount, 0),
                completedLessons: (user as any).progress.filter((p: any) => p.isCompleted).length
            }
        };
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
        return prisma.order.findMany({
            where: { userId },
            include: { items: { include: { course: { select: { id: true, title: true, slug: true } } } } },
            orderBy: { createdAt: 'desc' }
        });
    }

    async unenrollUser(userId: string, courseId: string) {
        return prisma.enrollment.delete({ where: { userId_courseId: { userId, courseId } } });
    }

    async getInactiveUsers(inactiveDays: number = 7) {
        const usersWithEnrollments = await this.userRepository.findMany({
            where: { role: 'USER', enrollments: { some: {} } },
            select: { id: true, email: true, createdAt: true, profile: { select: { name: true } }, enrollments: { select: { course: { select: { title: true } } }, take: 3 } }
        });

        const inactiveUsers = [];
        for (const user of usersWithEnrollments) {
            const lastActivity = await prisma.activityLog.findFirst({
                where: { userId: user.id },
                orderBy: { createdAt: 'desc' }
            });
            const lastActivityDate = lastActivity?.createdAt || user.createdAt;
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

    async grantMembership(userId: string, days: number = 365) {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + days);

        // Try to find a subscription product to link
        const product = await prisma.product.findFirst({
            where: { type: 'SUBSCRIPTION' }
        });

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
}
