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
        // Run every 1 hour to check if a report should be sent
        // This allows for much more flexible scheduling (e.g., specific time of day)
        const TICK_INTERVAL = 60 * 60 * 1000;

        setInterval(async () => {
            if (!(await this.isEnabled('telegram_notify_reports'))) return;

            try {
                const settings = await prisma.systemSetting.findMany({
                    where: {
                        key: { in: ['telegram_report_frequency', 'telegram_report_last_sent', 'telegram_report_time'] }
                    }
                });

                const settingsMap = settings.reduce((acc: any, s: any) => {
                    acc[s.key] = s.value;
                    return acc;
                }, {});

                const frequencyHours = parseInt(settingsMap.telegram_report_frequency || '12');
                const lastSent = settingsMap.telegram_report_last_sent ? new Date(settingsMap.telegram_report_last_sent) : new Date(0);
                const reportTime = settingsMap.telegram_report_time; // HH:mm format

                const now = new Date();
                const diffMs = now.getTime() - lastSent.getTime();
                const diffHours = diffMs / (1000 * 60 * 60);

                let shouldSend = false;

                if (reportTime) {
                    // If a specific time is set, check if we've passed it today and haven't sent a report yet
                    const [hour, minute] = reportTime.split(':').map(Number);
                    const targetTimeToday = new Date();
                    targetTimeToday.setHours(hour, minute, 0, 0);

                    // If it's past the target time and we haven't sent a report today
                    if (now >= targetTimeToday && lastSent.getDate() !== now.getDate()) {
                        shouldSend = true;
                    }
                } else if (diffHours >= frequencyHours) {
                    // Fallback to frequency-based reporting
                    shouldSend = true;
                }

                if (!shouldSend) return;

                // 1. Count pending orders
                const pendingOrdersCount = await prisma.order.count({
                    where: { status: 'PENDING' }
                });

                // 2. Count inactive users (> 14 days)
                const fourteenDaysAgo = new Date();
                fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

                const inactiveUsers = await prisma.user.count({
                    where: {
                        role: 'USER',
                        isActive: true,
                        updatedAt: { lt: fourteenDaysAgo },
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

                // Update last sent time
                await prisma.systemSetting.upsert({
                    where: { key: 'telegram_report_last_sent' },
                    update: { value: now.toISOString() },
                    create: { key: 'telegram_report_last_sent', value: now.toISOString(), type: 'text' }
                });

            } catch (error) {
                console.error('[TelegramSubscriber] Error generating daily report:', error);
            }
        }, TICK_INTERVAL);
    }
}
