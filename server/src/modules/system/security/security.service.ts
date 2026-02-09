import prisma from '../../../config/prisma';
import { EventBus } from '../../../core/event-bus';

export const SecurityService = {
    async logEvent(data: {
        userId?: string;
        action: any; // SecurityAction enum
        ipAddress?: string;
        userAgent?: string;
        details?: string;
    }) {
        const log = await prisma.securityLog.create({
            data
        });

        // Publish alert for critical actions
        if (['FAILED_LOGIN', 'ACCESS_DENIED', 'ADMIN_ACTION'].includes(data.action)) {
            EventBus.getInstance().publish({
                type: 'SECURITY_ALERT',
                payload: { action: data.action, details: data.details, ipAddress: data.ipAddress, userId: data.userId },
                timestamp: new Date()
            });
        }

        return log;
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
        const userIds = [...new Set(logs.map((l: any) => l.userId).filter(Boolean))];
        const users = await prisma.user.findMany({
            where: { id: { in: userIds as string[] } },
            select: {
                id: true,
                email: true,
                role: true,
                profile: { select: { name: true } }
            }
        });

        const userMap = users.reduce((acc: any, u: any) => {
            acc[u.id] = u;
            return acc;
        }, {});

        return {
            logs: logs.map((log: any) => ({
                ...log,
                user: log.userId ? userMap[log.userId] : null
            })),
            total: await prisma.securityLog.count()
        };
    }
};
