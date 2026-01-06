import prisma from '../../config/prisma';

export const logActivity = async (data: {
    userId?: string | null;
    action: string;
    path?: string | null;
    ipAddress?: string | null;
    location?: string | null;
    device?: string | null;
    metadata?: any;
}) => {
    return prisma.activityLog.create({
        data: {
            userId: data.userId || null,
            action: data.action,
            path: data.path || null,
            ipAddress: data.ipAddress || null,
            location: data.location || null,
            device: data.device || null,
            metadata: data.metadata ? JSON.stringify(data.metadata) : null
        }
    });
};

export const listActivities = async (limit = 100, page = 1) => {
    const skip = (page - 1) * limit;
    const [total, logs] = await Promise.all([
        prisma.activityLog.count(),
        prisma.activityLog.findMany({
            take: limit,
            skip,
            orderBy: { createdAt: 'desc' }
        })
    ]);

    // Enhance logs with user details if possible (manual join)
    const userIds = [...new Set(logs.map((l: { userId: string | null }) => l.userId).filter(Boolean))];
    const users = await prisma.user.findMany({
        where: { id: { in: userIds as string[] } },
        select: { id: true, email: true, name: true, role: true }
    });

    const userMap = users.reduce((acc: any, u) => {
        acc[u.id] = u;
        return acc;
    }, {});

    const enrichedLogs = logs.map((log: { userId: string | null;[key: string]: unknown }) => ({
        ...log,
        user: log.userId ? userMap[log.userId] : null
    }));

    return { total, logs: enrichedLogs, page, totalPages: Math.ceil(total / limit) };
};
