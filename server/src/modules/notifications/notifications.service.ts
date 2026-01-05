import prisma from '../../config/prisma';
import { NotificationType } from '@prisma/client';

export const createNotification = async (data: {
    title: string;
    content: string;
    type: NotificationType;
    isActive?: boolean;
    startDate?: Date | undefined;
    endDate?: Date | undefined;
    targetAll?: boolean;
    targetBirthday?: boolean;
}) => {
    const createData: any = {
        title: data.title,
        content: data.content,
        type: data.type,
        isActive: data.isActive,
        targetAll: data.targetAll,
        targetBirthday: data.targetBirthday
    };

    if (data.startDate) createData.startDate = data.startDate;
    if (data.endDate) createData.endDate = data.endDate;

    return prisma.systemNotification.create({
        data: createData
    });
};

export const getAllNotifications = async () => {
    return prisma.systemNotification.findMany({
        orderBy: { createdAt: 'desc' }
    });
};

export const getActiveNotifications = async () => {
    const now = new Date();
    return prisma.systemNotification.findMany({
        where: {
            isActive: true,
            OR: [
                { startDate: null },
                { startDate: { lte: now } }
            ],
            AND: [
                {
                    OR: [
                        { endDate: null },
                        { endDate: { gte: now } }
                    ]
                }
            ]
        },
        orderBy: { createdAt: 'desc' }
    });
};

export const getUserNotifications = async (userId: string) => {
    // Get user to check birthDate
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { birthDate: true }
    });

    const now = new Date();
    const isBirthday = user?.birthDate &&
        user.birthDate.getDate() === now.getDate() &&
        user.birthDate.getMonth() === now.getMonth();

    // 1. Get system-wide notifications that target all users OR target birthday (if applicable)
    const systemNotifications = await prisma.systemNotification.findMany({
        where: {
            isActive: true,
            OR: [
                { targetAll: true },
                { targetBirthday: isBirthday ? true : false }
            ],
            AND: [
                {
                    OR: [
                        { startDate: null },
                        { startDate: { lte: now } }
                    ]
                },
                {
                    OR: [
                        { endDate: null },
                        { endDate: { gte: now } }
                    ]
                }
            ]
        }
    });

    // 2. Get specific user notifications (tracking read status)
    const userNotifications = await prisma.userNotification.findMany({
        where: { userId },
        include: { notification: true },
        orderBy: { createdAt: 'desc' }
    });

    const existingIds = new Set(userNotifications.map(un => un.notificationId));

    // Filter out system notifications that have a corresponding user notification entry (read or tracking)
    // Note: For birthday, if it was read in previous years, this logic unfortunately hides it.
    // A proper solution requires a 'year' field or resetting read status.
    // For now, we assume simple behavior.
    const unreadSystemNotifications = systemNotifications.filter(sn => !existingIds.has(sn.id));

    return {
        unreadSystem: unreadSystemNotifications,
        userSpecific: userNotifications
    };
};

export const markAsRead = async (userId: string, notificationId: string) => {
    return prisma.userNotification.upsert({
        where: {
            userId_notificationId: {
                userId,
                notificationId
            }
        },
        update: {
            isRead: true,
            readAt: new Date()
        },
        create: {
            userId,
            notificationId,
            isRead: true,
            readAt: new Date() // Since we are marking as read immediately
        }
    });
};

export const updateNotification = async (id: string, data: {
    title?: string;
    content?: string;
    type?: NotificationType;
    isActive?: boolean;
    startDate?: Date | undefined;
    endDate?: Date | undefined;
    targetAll?: boolean;
    targetBirthday?: boolean;
}) => {
    const updateData: any = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.targetAll !== undefined) updateData.targetAll = data.targetAll;
    if (data.targetBirthday !== undefined) updateData.targetBirthday = data.targetBirthday;
    if (data.startDate !== undefined) updateData.startDate = data.startDate;
    if (data.endDate !== undefined) updateData.endDate = data.endDate;

    return prisma.systemNotification.update({
        where: { id },
        data: updateData
    });
};

export const deleteNotification = async (id: string) => {
    return prisma.systemNotification.delete({
        where: { id }
    });
};
