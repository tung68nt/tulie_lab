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

        // Log full request for debugging
        console.log('=== WEBHOOK RECEIVED ===');
        console.log('Headers:', JSON.stringify(req.headers, null, 2));
        console.log('Body:', JSON.stringify(req.body, null, 2));
        console.log('Query:', JSON.stringify(req.query, null, 2));

        // Validate API Key from Authorization header (flexible validation)
        const authHeader = req.headers.authorization || req.headers['x-api-key'] as string;
        const settingService = container.resolve<any>('SettingService');
        const storedApiKey = await settingService.getApiKey();

        if (storedApiKey) {
            // If API key is configured, validate it with flexible matching
            let receivedKey = '';
            if (authHeader) {
                // Extract key from various formats:
                // - "Apikey sk_xxx"
                // - "Bearer sk_xxx"
                // - "sk_xxx"
                const match = authHeader.match(/^(?:Apikey|Bearer)\s+(.+)$/i);
                receivedKey = match?.[1] ?? authHeader;
            }

            // Trim both keys for comparison to avoid whitespace issues
            const cleanReceivedKey = receivedKey.trim();
            const cleanStoredKey = storedApiKey.trim();

            if (!authHeader || cleanReceivedKey !== cleanStoredKey) {
                console.warn('=== WEBHOOK AUTH FAILED ===');
                console.warn('Received header:', authHeader);
                console.warn('Extracted key:', cleanReceivedKey);
                console.warn('Expected key:', cleanStoredKey);
                console.warn('Keys match:', cleanReceivedKey === cleanStoredKey);
                return res.status(401).json({ success: false, message: 'Invalid API key' });
            }
            console.log('✅ Webhook: API key validated successfully');
        } else {
            console.log('⚠️  Webhook: No API key configured, skipping validation');
        }

        // Sepay payload - be flexible with field names
        const {
            id,
            transferAmount,
            transferContent,
            referenceCode,
            description,
            content,
            code: paymentCode,
            gateway
        } = req.body;

        console.log('=== WEBHOOK PARSED DATA ===');
        console.log('Transaction ID:', id);
        console.log('Amount:', transferAmount);
        console.log('Payment Code:', paymentCode);
        console.log('Transfer Content:', transferContent);
        console.log('Reference Code:', referenceCode);
        console.log('Gateway:', gateway);
        console.log('Full body:', JSON.stringify(req.body, null, 2));

        // Try to get order code from multiple sources
        let orderCode: string | null = null;

        // 1. Try payment code field first (SePay's "Code thanh toán")
        if (paymentCode && typeof paymentCode === 'string' && paymentCode.trim()) {
            orderCode = paymentCode.trim().toUpperCase();
            console.log('✅ Found order code from payment code field:', orderCode);
        }

        // 2. Try extracting from transfer content
        if (!orderCode) {
            const actualTransferContent = transferContent || content || description || '';
            if (actualTransferContent && typeof actualTransferContent === 'string') {
                const trimmedContent = actualTransferContent.trim().toUpperCase();

                // First try to match SEVQR prefix pattern (VietinBank specific)
                const sevqrMatch = trimmedContent.match(/SEVQR([A-Z0-9]{10,})/);
                if (sevqrMatch && sevqrMatch[1]) {
                    orderCode = sevqrMatch[1];
                    console.log('✅ Found order code from SEVQR pattern:', orderCode);
                } else {
                    // Fallback to generic 10-character alphanumeric pattern
                    const genericMatch = trimmedContent.match(/\b[A-Z0-9]{10}\b/);
                    if (genericMatch) {
                        orderCode = genericMatch[0];
                        console.log('✅ Found order code from generic pattern:', orderCode);
                    }
                }
            }
        }

        // 3. Try reference code
        if (!orderCode && referenceCode && typeof referenceCode === 'string') {
            const trimmedRef = referenceCode.trim().toUpperCase();
            const match = trimmedRef.match(/\b[A-Z0-9]{10}\b/);
            if (match) {
                orderCode = match[0];
                console.log('✅ Found order code from reference code:', orderCode);
            }
        }

        if (!orderCode) {
            console.error('=== WEBHOOK ERROR: No order code found ===');
            console.error('Payment Code:', paymentCode);
            console.error('Transfer Content:', transferContent);
            console.error('Reference Code:', referenceCode);
            console.error('Content:', content);
            console.error('Description:', description);
            console.error('Full Body:', JSON.stringify(req.body, null, 2));
            console.error('Query Params:', JSON.stringify(req.query, null, 2));

            // Return 200 but log as failure - don't block SePay from sending more webhooks
            return res.status(200).json({
                success: false,
                message: 'No order code found in webhook payload',
                receivedData: {
                    paymentCode,
                    transferContent,
                    referenceCode,
                    bodyKeys: Object.keys(req.body),
                    queryKeys: Object.keys(req.query)
                }
            });
        }

        console.log('✅ Using order code:', orderCode);

        // Process payment
        await paymentService.processWebhook({
            code: orderCode,
            amount: Number(transferAmount),
            transactionId: String(id)
        });

        console.log('✅ Order processed successfully:', orderCode);
        console.log('=== WEBHOOK COMPLETED ===\n');

        res.json({ success: true, message: 'Payment processed successfully', orderCode });
    } catch (error: any) {
        console.error('=== WEBHOOK ERROR ===');
        console.error('Error:', error);
        console.error('Stack:', error.stack);

        // Return 500 for actual errors so SePay will retry
        // Only return 200 for "expected" errors like duplicate processing
        if (error.message === 'Order not found' || error.message.includes('already')) {
            return res.status(200).json({ success: false, message: error.message });
        }

        res.status(500).json({ success: false, message: error.message });
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
        const id = String(req.params.id);
        if (!id) return res.status(400).json({ message: 'Missing order ID' });

        const { status } = req.body;
        if (!status) return res.status(400).json({ message: 'Missing status' });

        const updated = await paymentService.updateOrderStatus(id, status);
        res.json(updated);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteOrder = async (req: Request, res: Response) => {
    try {
        const paymentService = container.resolve<PaymentService>('PaymentService');
        const id = String(req.params.id);
        const userId = (req as AuthRequest).user?.id;

        if (!id) return res.status(400).json({ message: 'Missing order ID' });
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const order = await paymentService.getOrderById(id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        if (order.userId !== userId) {
            return res.status(403).json({ message: 'You can only delete your own orders' });
        }
        if (order.status !== 'PENDING') {
            return res.status(400).json({ message: 'Only pending orders can be deleted' });
        }

        await paymentService.deleteOrder(id);
        res.json({ message: 'Order deleted successfully' });
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
        const id = String(req.params.id);
        const { customMessage } = req.body;

        if (!id) return res.status(400).json({ message: 'Missing order ID' });

        // Reuse service logic if possible or migrate reminder logic to service
        // For now, keeping logic here but using resolved services where possible
        // Ideally this moves to PaymentService.sendReminder method

        // TODO: Move fully to Service. 
        // For quick refactor, we are leaving the reminder email logic here but it should be moved.
        // It relies on Order model which we can get from Service.


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
