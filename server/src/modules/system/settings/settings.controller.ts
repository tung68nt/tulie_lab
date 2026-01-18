import { Request, Response } from 'express';
import { container } from '../../../core/container';
import { SettingService } from './settings.service';

export class SettingController {
    private get settingService(): SettingService {
        return container.resolve<SettingService>('SettingService');
    }

    async getSettings(req: Request, res: Response) {
        try {
            const { keys } = req.query;
            let settings = await this.settingService.getAllSettings();

            // Filter if keys are provided
            if (keys && typeof keys === 'string') {
                const requestedKeys = keys.split(',');
                const filtered: any = {};
                for (const key of requestedKeys) {
                    if (settings[key]) filtered[key] = settings[key];
                }
                settings = filtered;
            }

            res.json(settings);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateSettings(req: Request, res: Response) {
        try {
            const result = await this.settingService.updateSettings(req.body);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getApiKey(req: Request, res: Response) {
        try {
            const key = await this.settingService.getApiKey();
            res.json({ apiKey: key });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async regenerateApiKey(req: Request, res: Response) {
        try {
            const key = await this.settingService.regenerateApiKey();
            res.json({ apiKey: key });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getEmailLogs(req: Request, res: Response) {
        try {
            // Simplified for now, direct prisma call if no repo yet
            const logs = await (await import('../../../config/prisma')).default.emailLog.findMany({
                orderBy: { createdAt: 'desc' },
                take: 50
            });
            res.json(logs);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}

export const settingController = new SettingController();
