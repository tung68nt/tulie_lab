import { EventBus } from '../../../core/event-bus';
import { telegramService } from './telegram.service';
import prisma from '../../../config/prisma';

import { CrmService } from '../crm/crm.service';
const crmService = new CrmService();

export class TelegramEventSubscriber {
    private static instance: TelegramEventSubscriber;
    private eventBus: EventBus;

    private constructor() {
        this.eventBus = EventBus.getInstance();
        this.init();
        this.startReportingJob();
    }

    public static getInstance(): TelegramEventSubscriber {
        if (!TelegramEventSubscriber.instance) {
            TelegramEventSubscriber.instance = new TelegramEventSubscriber();
        }
        return TelegramEventSubscriber.instance;
    }

    private async isEnabled(key: string): Promise<boolean> {
        const setting = await prisma.systemSetting.findUnique({ where: { key } });
        return setting?.value === 'true';
    }

    private init() {
        // Handle New Orders
        this.eventBus.subscribe('ORDER_CREATED', async (payload) => {
            if (!(await this.isEnabled('telegram_notify_orders'))) return;
            try {
                // Fetch full order details to enrich notification
                const order = await prisma.order.findUnique({
                    where: { id: payload.orderId },
                    include: {
                        user: { include: { profile: true } },
                        items: { include: { course: true, product: true } }
                    }
                });

                if (order) {
                    await telegramService.sendOrderAlert(order);
                }
            } catch (error) {
                console.error('[TelegramSubscriber] Error processing ORDER_CREATED:', error);
            }
        });

        // Handle Payment Success
        this.eventBus.subscribe('ORDER_PAID', async (payload) => {
            if (!(await this.isEnabled('telegram_notify_orders'))) return;
            try {
                const order = await prisma.order.findUnique({
                    where: { id: payload.orderId },
                    include: {
                        user: { include: { profile: true } },
                        items: { include: { course: true, product: true } }
                    }
                });

                if (order) {
                    await telegramService.sendMessage(`
<b>✅ Thanh toán thành công!</b>
━━━━━━━━━━━━━━━━━━
<b>Mã đơn:</b> <code>${order.code}</code>
<b>Khách hàng:</b> ${order.user?.profile?.name || order.user?.email}
<b>Số tiền:</b> ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(order.amount))}
━━━━━━━━━━━━━━━━━━
                    `.trim());
                }
            } catch (error) {
                console.error('[TelegramSubscriber] Error processing ORDER_PAID:', error);
            }
        });

        // Handle New User Registration
        this.eventBus.subscribe('USER_REGISTERED', async (payload) => {
            if (!(await this.isEnabled('telegram_notify_registrations'))) return;
            await telegramService.sendRegistrationAlert(payload.name, payload.email);
        });

        // Handle Security Alerts
        this.eventBus.subscribe('SECURITY_ALERT', async (payload) => {
            if (!(await this.isEnabled('telegram_notify_security'))) return;
            await telegramService.sendSecurityAlert(
                payload.action,
                payload.details || 'Hành vi đáng ngờ',
                payload.ipAddress
            );
        });
    }

    private startReportingJob() {
        // Run every 12 hours
        const INTERVAL = 12 * 60 * 60 * 1000;

        setInterval(async () => {
            if (!(await this.isEnabled('telegram_notify_reports'))) return;

            try {
                // 1. Count pending orders
                const pendingOrdersCount = await prisma.order.count({
                    where: { status: 'PENDING' }
                });

                // 2. Count inactive users (> 14 days)
                const fourteenDaysAgo = new Date();
                fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

                // Check lastSession expiry or createdAt/updatedAt if no session tracking
                // Since we have ActivityLog, we can check latest log
                const inactiveUsers = await prisma.user.count({
                    where: {
                        role: 'USER',
                        isActive: true,
                        updatedAt: { lt: fourteenDaysAgo },
                        // Optional: Join with activity logs or sessions if they exist
                    }
                });

                // 3. Get detailed daily business metrics
                const dailyStats = await crmService.getDailyReportStats();

                await telegramService.sendDailyReport({
                    ...dailyStats,
                    pendingOrders: pendingOrdersCount,
                    inactiveUsers: inactiveUsers,
                    systemStatus: 'Hoạt động ổn định'
                });
            } catch (error) {
                console.error('[TelegramSubscriber] Error generating daily report:', error);
            }
        }, INTERVAL);
    }
}
