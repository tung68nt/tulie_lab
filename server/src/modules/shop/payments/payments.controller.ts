import { Request, Response } from 'express';
import { AuthRequest } from '../../../middleware/auth.middleware';
import { container } from '../../../core/container';
import { PaymentService } from './payments.service';
import prisma from '../../../config/prisma';

export const checkout = async (req: Request, res: Response) => {
    try {
        const paymentService = container.resolve<PaymentService>('PaymentService');
        const user = (req as AuthRequest).user; // Optional if guest
        const { form, cart, marketing, isGift, promoCodeId } = req.body;

        if (!cart || !Array.isArray(cart) || cart.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const items = cart.map((item: any) => ({
            id: item.id,
            type: item.type || 'COURSE' // Default to COURSE for backward compatibility
        }));

        const result = await paymentService.createOrder({
            ...(user?.id ? { userId: user.id } : {}),
            ...(form ? {
                userInfo: {
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    password: form.password
                }
            } : {}),
            items,
            marketing,
            isGift,
            promoCodeId
        });

        res.json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getOrder = async (req: Request, res: Response) => {
    try {
        const paymentService = container.resolve<PaymentService>('PaymentService');
        const { code } = req.params;
        if (!code) return res.status(400).json({ message: 'Missing code' });
        const order = await paymentService.getOrder(code as string);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const webhook = async (req: Request, res: Response) => {
    try {
        const paymentService = container.resolve<PaymentService>('PaymentService');

        // Validate API Key from Authorization header
        const authHeader = req.headers.authorization;
        const settingService = container.resolve<any>('SettingService');
        const storedApiKey = await settingService.getApiKey();

        if (storedApiKey) {
            // If API key is configured, validate it
            const expectedHeader = `Apikey ${storedApiKey}`;
            if (!authHeader || authHeader !== expectedHeader) {
                console.warn('Webhook: Invalid API key');
                return res.status(401).json({ success: false, message: 'Invalid API key' });
            }
        }

        // Sepay payload
        const { id, transferAmount, transferContent, referenceCode } = req.body;

        if (!transferContent) {
            return res.status(400).json({ success: false, message: 'No content' });
        }

        // Extract Order Code from content
        // Looking for TULIE followed by alphanumeric characters. 
        // We convert to uppercase for robust matching.
        const match = transferContent.toUpperCase().match(/TULIE[A-Z0-9]+/);
        if (!match) {
            return res.status(200).json({ success: false, message: 'No order code found' });
        }

        const orderCode = match[0];

        await paymentService.processWebhook({
            code: orderCode,
            amount: Number(transferAmount),
            transactionId: String(id)
        });

        res.json({ success: true, message: 'Processed' });
    } catch (error: any) {
        console.error('Webhook Error:', error);
        res.status(200).json({ success: false, message: error.message }); // Always return 200 to Sepay so it doesn't retry infinitely
    }
};


export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const paymentService = container.resolve<PaymentService>('PaymentService');
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search as string;
        const status = req.query.status as string;

        const result = await paymentService.getAllOrders({ page, limit, search, status });
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateStatus = async (req: Request, res: Response) => {
    try {
        const paymentService = container.resolve<PaymentService>('PaymentService');
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'Missing order ID' });

        const { status } = req.body;
        if (!status) return res.status(400).json({ message: 'Missing status' });

        const updated = await paymentService.updateOrderStatus(id as string, status);
        res.json(updated);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getTransactions = async (req: Request, res: Response) => {
    try {
        const paymentService = container.resolve<PaymentService>('PaymentService');
        const transactions = await paymentService.getTransactions();
        res.json(transactions);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const sendPaymentReminder = async (req: Request, res: Response) => {
    try {
        const paymentService = container.resolve<PaymentService>('PaymentService');
        const { id } = req.params;
        const { customMessage } = req.body;

        if (!id) return res.status(400).json({ message: 'Missing order ID' });

        // Reuse service logic if possible or migrate reminder logic to service
        // For now, keeping logic here but using resolved services where possible
        // Ideally this moves to PaymentService.sendReminder method

        // TODO: Move fully to Service. 
        // For quick refactor, we are leaving the reminder email logic here but it should be moved.
        // It relies on Order model which we can get from Service.

        const order: any = await paymentService.getOrder(id); // Using code or id? Service only has getOrder by CODE. We need getOrderById.

        const orderFull = await prisma.order.findUnique({
            where: { id: String(id) },
            include: { user: true, items: { include: { course: true, product: true } } }
        });

        if (!orderFull) return res.status(404).json({ message: 'Order not found' });
        if (orderFull.status !== 'PENDING') return res.status(400).json({ message: 'Order is not pending' });

        // Get bank settings
        const settingService = container.resolve<any>('SettingService');
        const settings = await settingService.getSettings([
            'bank_name', 'bank_account_no', 'bank_account_name', 'payment_transfer_syntax'
        ]);

        const bankName = settings.bank_name || 'VietinBank';
        const accountNo = settings.bank_account_no || '104002106705';
        const accountName = settings.bank_account_name || 'NGUYEN VAN A';
        const syntax = settings.payment_transfer_syntax || '{{code}}';
        const transferContent = syntax.replace('{{code}}', orderFull.code);

        const courseTitles = orderFull.items.map((i: any) => i.course?.title || i.product?.title || 'Sản phẩm').filter(Boolean);

        // Send email
        const emailService = require('../../../services/email.service').default;
        const success = await emailService.sendPaymentReminderEmail({
            to: orderFull.user.email,
            userName: (orderFull.user as any).profile?.name || 'Bạn',
            orderCode: orderFull.code,
            amount: orderFull.amount,
            courses: courseTitles,
            bankName,
            accountNo,
            accountName,
            transferContent,
            customMessage,
            userId: orderFull.userId,
            orderId: orderFull.id
        });

        if (success) {
            res.json({ success: true, message: 'Đã gửi email nhắc thanh toán' });
        } else {
            res.status(500).json({ message: 'Lỗi gửi email' });
        }
    } catch (error: any) {
        console.error('Send reminder error:', error);
        res.status(500).json({ message: error.message });
    }
};
