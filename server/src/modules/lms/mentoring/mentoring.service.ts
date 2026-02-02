import prisma from '../../../config/prisma';
import { MentoringSessionStatus } from '@prisma/client';

export const bookSession = async (userId: string, data: { addOnId: string; startTime: string; bookingNote?: string }) => {
    // 1. Verify ownership of AddOn
    // We check if the user has an OrderItem associated with this AddOn
    // OR if we track ownership differently. Usually checking OrderItem with status PAID.

    // For now, simpler check: User must have purchased the add-on.
    // Ideally we query OrderItem linked to User (via Order) and AddOn.
    const purchase = await prisma.orderItem.findFirst({
        where: {
            order: {
                userId,
                status: 'PAID'
            },
            addOnId: data.addOnId
        }
    });

    if (!purchase) {
        throw new Error('You have not purchased this mentoring package.');
    }

    // 2. Check session limits
    const addOn = await prisma.pricingAddOn.findUnique({
        where: { id: data.addOnId },
        select: { sessionCount: true, sessionDuration: true }
    });

    if (!addOn) throw new Error('Add-on not found');

    const usedSessions = await prisma.mentoringSession.count({
        where: {
            userId,
            addOnId: data.addOnId,
            status: { not: 'CANCELLED' }
        }
    });

    if (usedSessions >= addOn.sessionCount) {
        throw new Error('You have used all your sessions for this package.');
    }

    // 3. Book session
    const startTime = new Date(data.startTime);
    const endTime = new Date(startTime.getTime() + addOn.sessionDuration * 60000);

    return prisma.mentoringSession.create({
        data: {
            userId,
            addOnId: data.addOnId,
            startTime,
            endTime,
            bookingNote: data.bookingNote ?? null,
            status: 'PENDING'
        }
    });
};

export const getAdminSchedule = async (start: string, end: string) => {
    return prisma.mentoringSession.findMany({
        where: {
            startTime: {
                gte: new Date(start),
                lte: new Date(end)
            }
        },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    profile: {
                        select: { name: true, avatar: true }
                    }
                }
            },
            addOn: { select: { id: true, name: true, type: true } }
        },
        orderBy: { startTime: 'asc' }
    });
};

export const getUserSessions = async (userId: string) => {
    return prisma.mentoringSession.findMany({
        where: { userId },
        include: {
            addOn: { select: { id: true, name: true, type: true, sessionDuration: true } }
        },
        orderBy: { startTime: 'desc' }
    });
};

export const updateSession = async (id: string, data: {
    status?: MentoringSessionStatus;
    meetingLink?: string;
    notes?: string;
    startTime?: string;
}) => {
    const updateData: any = { ...data };

    if (data.startTime) {
        // Recalculate endTime if startTime changes
        const session = await prisma.mentoringSession.findUnique({
            where: { id },
            include: { addOn: true }
        });
        if (session) {
            const start = new Date(data.startTime);
            updateData.startTime = start;
            updateData.endTime = new Date(start.getTime() + session.addOn.sessionDuration * 60000);
        }
    }

    return prisma.mentoringSession.update({
        where: { id },
        data: updateData
    });
};
