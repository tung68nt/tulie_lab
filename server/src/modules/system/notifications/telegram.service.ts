import axios from 'axios';
import prisma from '../../../config/prisma';

export class TelegramService {
    private botToken: string | undefined;
    private chatId: string | undefined;

    constructor() {
        // Initial values from env as fallback
        this.botToken = process.env.TELEGRAM_BOT_TOKEN;
        this.chatId = process.env.TELEGRAM_CHAT_ID;
    }

    private async refreshSettings() {
        try {
            const [tokenSetting, idSetting] = await Promise.all([
                prisma.systemSetting.findUnique({ where: { key: 'telegram_bot_token' } }),
                prisma.systemSetting.findUnique({ where: { key: 'telegram_chat_id' } })
            ]);

            if (tokenSetting?.value) this.botToken = tokenSetting.value;
            if (idSetting?.value) this.chatId = idSetting.value;
        } catch (error) {
            console.error('[TelegramService] Failed to refresh settings from DB:', error);
            // Fallback to initial env values (already in constructor)
        }
    }

    async sendMessage(message: string) {
        await this.refreshSettings();

        if (!this.botToken || !this.chatId) {
            console.warn('[TelegramService] Bot token or Chat ID not configured. Skipping notification.');
            return;
        }

        try {
            const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
            await axios.post(url, {
                chat_id: this.chatId,
                text: message,
                parse_mode: 'HTML'
            });
            console.log('[TelegramService] Message sent successfully');
        } catch (error: any) {
            console.error('[TelegramService] Failed to send message:', error.response?.data || error.message);
        }
    }

    async sendOrderAlert(order: any) {
        const message = `
🔔 <b>Đơn hàng mới!</b>
━━━━━━━━━━━━━━━━━━
<b>Mã:</b> <code>#${order.code}</code>
<b>Khách:</b> ${order.user?.profile?.name || order.user?.email || 'N/A'}
<b>Tiền:</b> ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(order.amount))}
<b>Trạng thái:</b> <code>${order.status}</code>
<b>Nội dung:</b> ${order.items?.map((i: any) => i.course?.title || i.product?.title).join(', ') || 'N/A'}
━━━━━━━━━━━━━━━━━━
<i>Hệ thống Academy Tulie</i>
        `.trim();

        return this.sendMessage(message);
    }

    async sendSecurityAlert(action: string, details: string, ip?: string) {
        const message = `
⚠️ <b>Cảnh báo Bảo mật!</b>
━━━━━━━━━━━━━━━━━━
<b>Hành vi:</b> <code>${action}</code>
<b>Chi tiết:</b> ${details}
<b>IP:</b> <code>${ip || 'N/A'}</code>
<b>Thời gian:</b> ${new Date().toLocaleString('vi-VN')}
━━━━━━━━━━━━━━━━━━
<i>Vui lòng kiểm tra Admin Panel ngay!</i>
        `.trim();

        return this.sendMessage(message);
    }

    async sendRegistrationAlert(name: string, email: string) {
        const message = `
👤 <b>Thành viên mới!</b>
━━━━━━━━━━━━━━━━━━
<b>Tên:</b> ${name}
<b>Email:</b> ${email}
<b>Thời gian:</b> ${new Date().toLocaleString('vi-VN')}
━━━━━━━━━━━━━━━━━━
        `.trim();

        return this.sendMessage(message);
    }

    async sendSystemHealthAlert(subject: string, details: string) {
        const message = `
🖥️ <b>Hệ thống: ${subject}</b>
━━━━━━━━━━━━━━━━━━
<b>Chi tiết:</b> ${details}
<b>Thời gian:</b> ${new Date().toLocaleString('vi-VN')}
━━━━━━━━━━━━━━━━━━
        `.trim();

        return this.sendMessage(message);
    }

    async sendDailyReport(data: {
        todayOrders: number;
        todayPaidOrders: number;
        todayRevenue: number;
        todayNewUsers: number;
        pendingOrders: number;
        inactiveUsers: number;
        securityRisks: number;
        systemStatus?: string;
    }) {
        const message = `
<b>📊 BÁO CÁO KINH DOANH & HỆ THỐNG</b>
━━━━━━━━━━━━━━━━━━
💰 <b>Kết quả hôm nay:</b>
- Doanh thu: <code>${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.todayRevenue)}</code>
- Đơn hàng: <b>${data.todayPaidOrders}</b>/${data.todayOrders} (Thành công/Tổng)
- Thành viên mới: <b>${data.todayNewUsers}</b>

⏳ <b>Tình hình tồn đọng:</b>
- Đơn hàng pending: <b>${data.pendingOrders}</b> đơn
- Học viên "ngủ đông": <b>${data.inactiveUsers}</b> người (>14 ngày)

🛡️ <b>Bảo mật & Sức khỏe:</b>
- Cảnh báo bảo mật: <b>${data.securityRisks > 0 ? `⚠️ ${data.securityRisks} vụ` : '✅ An toàn'}</b>
- Trạng thái: <code>${data.systemStatus || 'Hoạt động ổn định'}</code>
━━━━━━━━━━━━━━━━━━
<i>Hệ thống Academy Tulie - ${new Date().toLocaleDateString('vi-VN')}</i>
        `.trim();

        return this.sendMessage(message);
    }
}

export const telegramService = new TelegramService();
