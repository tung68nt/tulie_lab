import { Request, Response } from 'express';
import { SecurityService } from './security.service';

export const SecurityController = {
    async log(req: Request, res: Response) {
        try {
            const { action, details } = req.body;
            // Get IP and User Agent
            const ipAddress = req.headers['x-forwarded-for'] as string || req.ip || '';
            const userAgent = req.headers['user-agent'] || '';

            // Get User ID if authenticated (handling potentially missing user)
            const userId = (req as any).user?.id || null;

            if (!action) {
                return res.status(400).json({ error: 'Action is required' });
            }

            const log = await SecurityService.logEvent({
                userId,
                action,
                ipAddress,
                userAgent,
                details
            });

            return res.json({ success: true, id: log.id });
        } catch (error) {
            console.error('Security Log Error:', error);
            // Don't leak internal errors to client in this case, just 200 OK to not break client flow
            return res.json({ success: false });
        }
    },

    async list(req: Request, res: Response) {
        try {
            const logs = await SecurityService.listLogs();
            return res.json(logs);
        } catch (error) {
            return res.status(500).json({ error: 'Failed to fetch logs' });
        }
    }
};
