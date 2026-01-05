import { Request, Response } from 'express';
import * as ActivityService from './activity.service';
import { AuthRequest } from '../../middleware/auth.middleware';

export const logActivity = async (req: Request, res: Response) => {
    try {
        const { action, path, metadata, device } = req.body;
        const userId = (req as any).user?.id || null;

        // Get IP
        const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';
        const userAgent = req.headers['user-agent'] || '';

        // Simple Location Detection (Placeholder)
        // Ideally use a geoip library here. For now validation.
        // We can use 'geoip-lite' if installed, or just store null.
        let location = 'Unknown';

        // Try simple lookup if user specifically requested it
        try {
            // const geoip = require('geoip-lite');
            // const geo = geoip.lookup(ipAddress);
            // location = geo ? `${geo.city}, ${geo.country}` : 'Unknown';
        } catch (e) {
            // ignore
        }

        const log = await ActivityService.logActivity({
            userId,
            action: action || 'UNKNOWN',
            path: path || null,
            ipAddress: ipAddress || null,
            location: (location && location !== 'Unknown') ? location : null,
            device: device || userAgent || null,
            metadata
        });

        res.json({ success: true, id: log.id });
    } catch (error: any) {
        console.error('Log Activity Error:', error);
        res.status(500).json({ message: 'Failed to log activity' });
    }
};

export const listActivities = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 100;

        const data = await ActivityService.listActivities(limit, page);
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
