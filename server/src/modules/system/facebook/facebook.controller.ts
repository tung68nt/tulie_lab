import { Request, Response } from 'express';
import { FacebookService } from './facebook.service';

export class FacebookController {
    constructor(private readonly facebookService: FacebookService) { }

    async getROI(req: Request, res: Response) {
        try {
            let { startDate, endDate } = req.query;

            // Default to last 30 days if dates are missing
            if (!startDate || !endDate) {
                const now = new Date();
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(now.getDate() - 30);

                startDate = thirtyDaysAgo.toISOString();
                endDate = now.toISOString();
            }

            const data = await this.facebookService.getMarketingROI(
                new Date(startDate as string),
                new Date(endDate as string)
            );

            res.json(data);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async syncInsights(req: Request, res: Response) {
        try {
            const { datePreset } = req.body;
            const data = await this.facebookService.syncDailyInsights(datePreset || 'yesterday');
            res.json({ message: 'Sync successful', data });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async syncAudience(req: Request, res: Response) {
        try {
            const { audienceId, userEmails } = req.body;
            if (!audienceId || !userEmails) {
                return res.status(400).json({ message: 'Missing audienceId or userEmails' });
            }
            await this.facebookService.syncUsersToCustomAudience(audienceId, userEmails);
            res.json({ message: 'Audience sync initiated' });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async classify(req: Request, res: Response) {
        try {
            await this.facebookService.classifyLeads();
            res.json({ message: 'Lead classification complete' });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
