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
        const chatId = update.message.chat.id;
        const fromUser = update.message.from?.username || update.message.from?.first_name || 'Unknown';

        console.log(`[TelegramWebhook] Received message from ${fromUser} (${chatId}): ${text}`);

        // Command processing
        if (text === '/report' || text === '/baocao') {
            console.log('[TelegramWebhook] Processing /report command...');

            // Get report data
            const reportData = await crmService.getFullSystemReport();

            // Send report (using the configured service method which sends to default channel)
            // Ideally we might want to reply to 'chatId' but for now sending to main channel is safer/expected behavior
            await telegramService.sendDailyReport(reportData);

            console.log('[TelegramWebhook] Report command executed successfully');
        } else if (text === '/ping') {
            await telegramService.sendMessage(`Pong! Service is alive. IP: ${req.ip}`);
        }

        // Always return 200 OK to Telegram to prevent retries
        return res.status(200).json({ status: 'ok' });
    } catch (error) {
        console.error('[TelegramWebhook] Error processing webhook:', error);
        // Still return 200 to prevent Telegram from looping retries on our error
        return res.status(200).json({ status: 'error', message: 'Internal Server Error handled' });
    }
};
