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
                orderBy: {
                    createdAt: 'desc'
                }
            }
        }
    });
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
