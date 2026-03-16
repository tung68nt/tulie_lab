import { Request, Response } from 'express';
import { telegramService } from './telegram.service';
import { CrmService } from '../crm/crm.service';

const crmService = new CrmService();

export const telegramWebhook = async (req: Request, res: Response) => {
    try {
        const update = req.body;

        // Validate basic Telegram Update structure
        if (!update || !update.message || !update.message.text) {
            return res.status(200).json({ status: 'ignored' });
        }

        const text = update.message.text.trim();
        const lowerText = text.toLowerCase();
        const chatId = update.message.chat.id;
        const fromUser = update.message.from?.username || update.message.from?.first_name || 'Unknown';

        console.log(`[TelegramWebhook] Received message from ${fromUser} (${chatId}): ${text}`);

        // Command processing
        if (lowerText.startsWith('/report') || lowerText.startsWith('/baocao')) {
            console.log(`[TelegramWebhook] Processing report command: ${text}`);

            let period: 'day' | 'week' | 'month' = 'day';

            if (lowerText.includes('month') || lowerText.includes('thang')) {
                period = 'month';
            } else if (lowerText.includes('week') || lowerText.includes('tuan')) {
                period = 'week';
            }

            // Get report data
            const reportData = await crmService.getSystemReport(period);

            // Send report (using the requesting chatId)
            await telegramService.sendDailyReport(reportData, chatId);

            console.log('[TelegramWebhook] Report command executed successfully');
        } else if (lowerText === '/ping') {
            await telegramService.sendMessage(`Pong! Service is alive. IP: ${req.ip}`, chatId);
        } else if (lowerText === '/help' || lowerText === '/start') {
            const helpMessage = `
<b>🤖 Hướng dẫn sử dụng Bot Tulie Academy</b>
━━━━━━━━━━━━━━━━━━
📊 <b>Báo cáo:</b>
- <code>/report</code>: Báo cáo trong ngày
- <code>/report week</code>: Báo cáo trong tuần
- <code>/report month</code>: Báo cáo trong tháng

✨ <b>Khác:</b>
- <code>/ping</code>: Kiểm tra trạng thái kết nối
- <code>/help</code>: Xem hướng dẫn này
━━━━━━━━━━━━━━━━━━
            `.trim();
            await telegramService.sendMessage(helpMessage, chatId);
        }

        // Always return 200 OK to Telegram to prevent retries
        return res.status(200).json({ status: 'ok' });
    } catch (error) {
        console.error('[TelegramWebhook] Error processing webhook:', error);
        // Still return 200 to prevent Telegram from looping retries on our error
        return res.status(200).json({ status: 'error', message: 'Internal Server Error handled' });
    }
};
