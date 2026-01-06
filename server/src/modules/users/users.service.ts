import prisma from '../../config/prisma';

export const getUserById = async (id: string) => {
    return prisma.user.findUnique({
        where: { id },
        include: {
            enrollments: {
                include: {
                    course: true
                }
            },
            orders: {
                include: {
                    courses: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }
        }
    });
};

// Enhanced version for admin with activity logs
export const getUserDetailsForAdmin = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            enrollments: {
                include: {
                    course: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            thumbnail: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            },
            orders: {
                include: {
                    courses: {
                        select: {
                            id: true,
                            title: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            },
            progress: {
                select: {
                    lessonId: true,
                    isCompleted: true,
                    updatedAt: true
                },
                orderBy: { updatedAt: 'desc' },
                take: 20
            }
        }
    });

    if (!user) return null;

    // Get activity logs for this user
    const activities = await prisma.activityLog.findMany({
        where: { userId: id },
        orderBy: { createdAt: 'desc' },
        take: 50
    });

    // Get last login from activity logs
    const lastLogin = await prisma.activityLog.findFirst({
        where: {
            userId: id,
            action: 'login'
        },
        orderBy: { createdAt: 'desc' }
    });

    // Calculate pending order duration
    const pendingOrders = user.orders.filter((o: any) => o.status === 'PENDING').map((o: any) => ({
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
            totalEnrollments: user.enrollments.length,
            totalOrders: user.orders.length,
            totalPaid: user.orders.filter((o: any) => o.status === 'PAID').reduce((sum: number, o: any) => sum + o.amount, 0),
            completedLessons: user.progress.filter((p: any) => p.isCompleted).length
        }
    };
};


export const updateUser = async (id: string, data: any) => {
    return prisma.user.update({
        where: { id },
        data,
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            phone: true,
            birthDate: true,
            address: true,
            city: true,
            occupation: true,
            company: true,
            avatar: true,
            allowEmailMarketing: true,
            allowSMSMarketing: true
        }
    });
};

export const getAllUsers = async () => {
    return prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true
        }
    });
};

export const enrollUser = async (userId: string, courseId: string) => {
    // Check if subscription exists
    const existing = await prisma.enrollment.findUnique({
        where: {
            userId_courseId: { userId, courseId }
        }
    });

    if (existing) return existing;

    return prisma.enrollment.create({
        data: {
            userId,
            courseId
        }
    });
};

export const getUserOrders = async (userId: string) => {
    return prisma.order.findMany({
        where: { userId },
        include: {
            courses: {
                select: {
                    id: true,
                    title: true,
                    slug: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
};

export const unenrollUser = async (userId: string, courseId: string) => {
    return prisma.enrollment.delete({
        where: {
            userId_courseId: { userId, courseId }
        }
    });
};

// Get inactive users (no activity in X days) who have enrollments
export const getInactiveUsers = async (inactiveDays: number = 7) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - inactiveDays);

    // Get users with enrollments who have no recent activity
    const usersWithEnrollments = await prisma.user.findMany({
        where: {
            role: 'USER',
            enrollments: {
                some: {} // Has at least one enrollment
            }
        },
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            enrollments: {
                select: {
                    course: {
                        select: { title: true }
                    }
                },
                take: 3
            }
        }
    });

    // For each user, check their last activity
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
                courses: user.enrollments.map(e => e.course.title)
            });
        }
    }

    // Sort by longest inactive first
    return inactiveUsers.sort((a, b) => b.daysSinceActivity - a.daysSinceActivity);
};
