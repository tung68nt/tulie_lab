import axios from 'axios';
import prisma from '../../../config/prisma';

export class TelegramService {
    private botToken: string | undefined;
    private chatId: string | undefined;
    private templates: Record<string, string> = {};

    private defaultTemplates = {
        telegram_template_order: `
🔔 <b>Đơn hàng mới!</b>
━━━━━━━━━━━━━━━━━━
<b>Mã:</b> <b>#{{code}}</b>
<b>Khách:</b> {{customer}}
<b>Tiền:</b> {{amount}}
<b>Trạng thái:</b> <b>{{status}}</b>
<b>Nội dung:</b> {{items}}
━━━━━━━━━━━━━━━━━━
<i>Hệ thống {{academy}}</i>
        `.trim(),
        telegram_template_security: `
⚠️ <b>Cảnh báo Bảo mật!</b>
━━━━━━━━━━━━━━━━━━
<b>Hành vi:</b> <b>{{action}}</b>
<b>Chi tiết:</b> {{details}}
<b>IP:</b> {{ip}}
<b>Thời gian:</b> {{time}}
━━━━━━━━━━━━━━━━━━
<i>Vui lòng kiểm tra Admin Panel ngay!</i>
        `.trim(),
        telegram_template_registration: `
👤 <b>Thành viên mới!</b>
━━━━━━━━━━━━━━━━━━
<b>Tên:</b> {{name}}
<b>Email:</b> {{email}}
<b>Thời gian:</b> {{time}}
━━━━━━━━━━━━━━━━━━
        `.trim(),
        telegram_template_report: `
<b>📊 BÁO CÁO KINH DOANH & HỆ THỐNG</b>
━━━━━━━━━━━━━━━━━━
💰 <b>Kết quả {{title}}:</b>
- Doanh thu: <b>{{revenue}}</b>
- Đơn hàng: <b>{{paidOrders}}</b>/{{totalOrders}} (Thành công/Tổng)
- Thành viên mới: <b>{{newUsers}}</b>

⏳ <b>Tình hình tồn đọng:</b>
- Đơn hàng pending: <b>{{pendingOrders}}</b> đơn
- Học viên "ngủ đông": <b>{{inactiveUsers}}</b> người (>14 ngày)

🛡️ <b>Bảo mật & Sức khỏe:</b>
- Cảnh báo bảo mật: <b>{{securityRisks}}</b>
- Trạng thái: <b>{{systemStatus}}</b>
━━━━━━━━━━━━━━━━━━
<i>Hệ thống {{academy}} - {{time}}</i>
        `.trim()
    };

    constructor() {
        // Initial values from env as fallback
        this.botToken = process.env.TELEGRAM_BOT_TOKEN;
        this.chatId = process.env.TELEGRAM_CHAT_ID;
    }

    private async refreshSettings() {
        try {
            const keys = [
                'telegram_bot_token',
                'telegram_chat_id',
                'telegram_template_order',
                'telegram_template_security',
                'telegram_template_registration',
                'telegram_template_report',
                'site_name'
            ];

            const settings = await prisma.systemSetting.findMany({
                where: { key: { in: keys } }
            });

            const settingsMap = settings.reduce((acc: any, s) => {
                acc[s.key] = s.value;
                return acc;
            }, {});

            if (settingsMap.telegram_bot_token) this.botToken = settingsMap.telegram_bot_token;
            if (settingsMap.telegram_chat_id) this.chatId = settingsMap.telegram_chat_id;

            this.templates = {
                order: settingsMap.telegram_template_order || this.defaultTemplates.telegram_template_order,
                security: settingsMap.telegram_template_security || this.defaultTemplates.telegram_template_security,
                registration: settingsMap.telegram_template_registration || this.defaultTemplates.telegram_template_registration,
                report: settingsMap.telegram_template_report || this.defaultTemplates.telegram_template_report,
                academy: settingsMap.site_name || 'Tulie Academy'
            };
        } catch (error) {
            console.error('[TelegramService] Failed to refresh settings from DB:', error);
        }
    }

    private renderTemplate(template: string, data: Record<string, any>) {
        let result = template;
        const allData = { ...data, academy: this.templates.academy };

        Object.entries(allData).forEach(([key, value]) => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            const replacement = (value !== undefined && value !== null) ? String(value) : 'N/A';
            result = result.replace(regex, replacement);
        });
        return result;
    }

    async sendMessage(message: string, targetChatId?: string | number) {
        await this.refreshSettings();

        const chatId = targetChatId || this.chatId;

        if (!this.botToken || !chatId) {
            console.warn('[TelegramService] Bot token or Chat ID not configured. Skipping notification.');
            return;
        }

        try {
            const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
            await axios.post(url, {
                chat_id: chatId.toString(),
                text: message,
                parse_mode: 'HTML'
            });
            console.log(`[TelegramService] Message sent successfully to ${chatId}`);
        } catch (error: any) {
            console.error('[TelegramService] Failed to send message:', error.response?.data || error.message);
        }
    }

    async sendOrderAlert(order: any) {
        if (!this.templates.order) await this.refreshSettings();

        const message = this.renderTemplate(this.templates.order, {
            code: order.code,
            customer: order.user?.profile?.name || order.user?.email || 'N/A',
            amount: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(order.amount)),
            status: order.status,
            items: order.items?.map((i: any) => i.course?.title || i.product?.title).join(', ') || 'N/A'
        });

        return this.sendMessage(message);
    }

    async sendSecurityAlert(action: string, details: string, ip?: string) {
        if (!this.templates.security) await this.refreshSettings();

        const message = this.renderTemplate(this.templates.security, {
            action,
            details,
            ip: ip || 'N/A',
            time: new Date().toLocaleString('vi-VN')
        });

        return this.sendMessage(message);
    }

    async sendRegistrationAlert(name: string, email: string) {
        if (!this.templates.registration) await this.refreshSettings();

        const message = this.renderTemplate(this.templates.registration, {
            name,
            email,
            time: new Date().toLocaleString('vi-VN')
        });

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
        title?: string;
        todayOrders: number;
        todayPaidOrders: number;
        todayRevenue: number;
        todayNewUsers: number;
        pendingOrders: number;
        inactiveUsers: number;
        securityRisks: number;
        systemStatus?: string;
    }, targetChatId?: string | number) {
        if (!this.templates.report) await this.refreshSettings();

        const message = this.renderTemplate(this.templates.report, {
            title: data.title || 'hôm nay',
            revenue: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.todayRevenue),
            paidOrders: data.todayPaidOrders,
            totalOrders: data.todayOrders,
            newUsers: data.todayNewUsers,
            pendingOrders: data.pendingOrders,
            inactiveUsers: data.inactiveUsers,
            securityRisks: data.securityRisks > 0 ? `⚠️ ${data.securityRisks} vụ` : '✅ An toàn',
            systemStatus: data.systemStatus || 'Hoạt động ổn định',
            time: new Date().toLocaleDateString('vi-VN')
        });

        return this.sendMessage(message, targetChatId);
    }
}

export const telegramService = new TelegramService();

