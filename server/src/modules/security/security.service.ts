import prisma from '../../config/prisma';

export const SecurityService = {
    async logEvent(data: {
        userId?: string;
        action: any; // SecurityAction enum
        ipAddress?: string;
        userAgent?: string;
        details?: string;
    }) {
        return await prisma.securityLog.create({
            data
        });
    },

    async listLogs(limit = 100, offset = 0) {
        const logs = await prisma.securityLog.findMany({
            take: limit,
            skip: offset,
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Enrich logs with user details
        const userIds = [...new Set(logs.map(l => l.userId).filter(Boolean))];
        const users = await prisma.user.findMany({
            where: { id: { in: userIds as string[] } },
            select: { id: true, email: true, name: true, role: true }
        });

        const userMap = users.reduce((acc: any, u) => {
            acc[u.id] = u;
            return acc;
        }, {});

        return {
            logs: logs.map(log => ({
                ...log,
                user: log.userId ? userMap[log.userId] : null
            })),
            total: await prisma.securityLog.count()
        };
    }
};
