import { Request, Response } from 'express';
import { container } from '../../../core/container';
import { SettingService } from './settings.service';

const SENSITIVE_SETTING_KEYS = [
    'sepay_api_key',
    'sepay_secret_key',
    'smtp_pass',
    'jwt_secret',
    'apiKey',
    'SYSTEM_API_KEY'
];

export class SettingController {
    private get settingService(): SettingService {
        return container.resolve<SettingService>('SettingService');
    }

    async getSettings(req: Request, res: Response) {
        try {
            const { keys } = req.query;
            let settings = await this.settingService.getAllSettings();

            // Security Filter: Remove sensitive keys from public results
            SENSITIVE_SETTING_KEYS.forEach(key => {
                if (settings[key]) delete settings[key];
            });

            // Filter if specific keys are provided
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

    async testTelegram(req: Request, res: Response) {
        try {
            const { telegramService } = await import('../notifications/telegram.service');
            await telegramService.sendMessage('🚀 <b>Test Connection!</b>\n\nChúc mừng! Bot Telegram của bạn đã được cấu hình thành công cho Academy Tulie.');
            res.json({ message: 'Đã gửi tin nhắn thử nghiệm thành công!' });
        } catch (error: any) {
            res.status(500).json({ message: `Lỗi gửi tin nhắn: ${error.message}` });
        }
    }
}

export const settingController = new SettingController();
