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

    async testEmail(req: Request, res: Response) {
        try {
            const { default: emailService } = await import('../../../services/email.service');

            // First verify the connection
            const verified = await emailService.verifyConnection();
            if (!verified) {
                return res.status(400).json({
                    success: false,
                    message: 'Không thể kết nối tới SMTP server. Vui lòng kiểm tra lại cấu hình (host, port, user, pass).'
                });
            }

            // Get admin email to send test to
            const adminEmail = await emailService.getAdminEmail();
            const targetEmail = req.body?.email || adminEmail;

            if (!targetEmail) {
                return res.status(400).json({
                    success: false,
                    message: 'Chưa cấu hình email nhận. Vui lòng nhập email hoặc cài đặt Admin Notification Email.'
                });
            }

            // Send a test email
            const { getTransporter } = await import('../../../services/email.service');
            const transporter = await getTransporter();
            const from = process.env.SMTP_FROM || process.env.SMTP_USER || '"The Tulie Lab" <noreply@tulie.vn>';

            await transporter.sendMail({
                from,
                to: targetEmail,
                subject: '✅ Test Email - Tulie Academy',
                html: `
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h1 style="font-size: 24px; margin: 0;">✅ Kết nối Email thành công!</h1>
                        </div>
                        <div style="background: #f8f9fa; border-radius: 8px; padding: 24px; margin-bottom: 20px;">
                            <p style="margin: 0 0 8px 0;"><strong>SMTP Host:</strong> Đã kết nối</p>
                            <p style="margin: 0 0 8px 0;"><strong>Thời gian:</strong> ${new Date().toLocaleString('vi-VN')}</p>
                            <p style="margin: 0;"><strong>Gửi tới:</strong> ${targetEmail}</p>
                        </div>
                        <p style="color: #666; font-size: 14px;">
                            Email này xác nhận rằng hệ thống gửi mail của bạn đã được cấu hình đúng và hoạt động bình thường.
                        </p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="color: #999; font-size: 12px; text-align: center;">
                            © ${new Date().getFullYear()} The Tulie Lab
                        </p>
                    </div>
                `
            });

            res.json({
                success: true,
                message: `Đã gửi email thử nghiệm tới ${targetEmail} thành công!`
            });
        } catch (error: any) {
            console.error('[TestEmail] Error:', error);
            res.status(500).json({
                success: false,
                message: `Lỗi gửi email: ${error.message}`
            });
        }
    }
}

export const settingController = new SettingController();
