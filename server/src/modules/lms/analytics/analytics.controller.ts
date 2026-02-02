import { Request, Response } from 'express';
import { AnalyticsService } from './analytics.service';

const analyticsService = new AnalyticsService();

export const getLearningAnalytics = async (req: Request, res: Response) => {
    try {
        const stats = await analyticsService.getLearningAnalytics();
        res.json(stats);
    } catch (error: any) {
        console.error('[AnalyticsController] Error:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};
