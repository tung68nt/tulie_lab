import { Request, Response } from 'express';
import { AuthRequest } from '../../../middleware/auth.middleware';
import { container } from '../../../core/container';
import { PaymentService } from './payments.service';
import prisma from '../../../config/prisma';
import emailService from '../../../services/email.service';

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
            promoCodeId,
            metadata: {
                customerName: form.name, // General customer name
                phone: form.phone,
                email: form.email,
                isGift: !!form.isGift,
                createAccount: !!form.createAccount,
                ...(form.requireVAT ? {
                    requireVAT: true,
                    vatBuyerName: form.vatBuyerName,
                    customerName: form.vatBuyerName, // Override for invoice consistency if VAT is requested
                    companyName: form.vatCompanyName,
                    taxId: form.vatTaxId,
                    address: form.vatAddress,
                    vatEmail: form.vatEmail,
                    vatPhone: form.vatPhone
                } : {})
            }
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

        // Validate API Key from Authorization header (flexible validation)
        const authHeader = req.headers.authorization || req.headers['x-api-key'] as string;
        const settingService = container.resolve<any>('SettingService');
        const storedApiKey = await settingService.getApiKey();

        if (storedApiKey) {
            // If API key is configured, validate it with flexible matching
            let receivedKey = '';
            if (authHeader) {
                const match = authHeader.match(/^(?:Apikey|Bearer)\s+(.+)$/i);
                receivedKey = match?.[1] ?? authHeader;
            }

            const cleanReceivedKey = receivedKey.trim();
            const cleanStoredKey = storedApiKey.trim();

            if (!authHeader || cleanReceivedKey !== cleanStoredKey) {
                console.warn('=== WEBHOOK AUTH FAILED ===');
                return res.status(401).json({ success: false, message: 'Invalid API key' });
            }
            console.log('✅ Webhook: API key validated successfully');
        } else {
            console.log('⚠️  Webhook: No API key configured, skipping validation');
        }

        // Sepay payload mapping
        const {
            id,
            transferAmount,
            transferContent,
            referenceCode,
            description,
            content,
            code: paymentCode,
            gateway,
            transactionDate,
            accountNumber,
            subAccount,
            accumulated
        } = req.body;

        console.log('=== SEPAY PAYLOAD ===');
        console.log(`- Transaction ID: ${id}`);
        console.log(`- Gateway: ${gateway}`);
        console.log(`- Date: ${transactionDate}`);
        console.log(`- Account: ${accountNumber}`);
        console.log(`- Amount: ${transferAmount}`);
        console.log(`- Content: ${content}`);
        console.log(`- Description: ${description}`);
        console.log('=====================');

        // Try to get order code
        let orderCode: string | null = null;
        // Improved regex to prioritize DH prefix and handle exactly 12 characters
        const orderCodePattern = /DH[A-Z0-9]{10}/i;

        // 1. Try payment code field first, but still validate/clean with regex
        const rawPaymentCode = paymentCode || referenceCode || '';
        if (rawPaymentCode && typeof rawPaymentCode === 'string' && rawPaymentCode.trim()) {
            const cleanRaw = rawPaymentCode.trim();
            const match = cleanRaw.match(orderCodePattern);
            if (match) {
                orderCode = match[0].toUpperCase();
                console.log(`✅ Extracted Order Code from code field: ${orderCode}`);
            }
        }

        // 2. Try extracting from transfer content/description if not found yet
        if (!orderCode) {
            const actualTransferContent = transferContent || content || description || '';
            if (actualTransferContent && typeof actualTransferContent === 'string') {
                const trimmedContent = actualTransferContent.trim();
                const match = trimmedContent.match(orderCodePattern);

                if (match) {
                    orderCode = match[0].toUpperCase();
                    console.log(`✅ Extracted Order Code from content: ${orderCode}`);
                }
            }
        }

        if (!orderCode) {
            console.warn('⚠️ No Order Code found in webhook payload');
            // Return 200 success to SePay even if processing failed logic logic, to stop retries if it's a data issue.
            // But strictly speaking, if we want them to retry, 500.
            // SePay documentation says: "Nếu kết quả trả về không thỏa mãn... SePay sẽ xem là webhook thất bại."
            // Here we return { success: true } but log error internally if we can't process it?
            // Actually, if we can't find order code, it's likely unrelated transaction.
            return res.status(200).json({ success: true, message: 'Received but no order code found' });
        }

        console.log(`Processing Order: ${orderCode} with Amount: ${transferAmount}`);

        // Process payment
        const webhookData: any = {
            code: orderCode,
            amount: Number(transferAmount),
            transactionId: String(id),
            accumulated: (accumulated !== undefined && accumulated !== null) ? Number(accumulated) : undefined
        };

        if (gateway) webhookData.gateway = String(gateway);
        if (transactionDate) webhookData.transactionDate = String(transactionDate);
        if (accountNumber) webhookData.accountNumber = String(accountNumber);
        if (subAccount) webhookData.subAccount = String(subAccount);
        if (content) webhookData.content = String(content);
        if (referenceCode) webhookData.referenceCode = String(referenceCode);
        if (description) webhookData.description = String(description);

        await paymentService.processWebhook(webhookData);

        console.log('✅ Webhook processed successfully');

        // Strict SePay Response Format
        return res.status(200).json({ success: true });

    } catch (error: any) {
        console.error('=== WEBHOOK ERROR ===', error);

        // Return 200 for duplicate/idempotency errors to stop SePay retries
        if (error.message === 'Order not found' || error.message.includes('already') || error.message.includes('completed')) {
            return res.status(200).json({ success: true, message: error.message });
        }

        // Return 500 for actual server errors
        return res.status(500).json({ success: false, message: error.message });
    }
};


export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const paymentService = container.resolve<PaymentService>('PaymentService');
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search as string;
        const status = req.query.status as string;

        const { data: orders, meta: { total, stats } } = await paymentService.getAllOrders({ page, limit, search, status });
        res.json({
            data: orders,
            meta: {
                total,
                stats,
                page,
                limit
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getOrderById = async (req: Request, res: Response) => {
    try {
        const paymentService = container.resolve<PaymentService>('PaymentService');
        const id = String(req.params.id);
        if (!id) return res.status(400).json({ message: 'Missing order ID' });

        const order = await paymentService.getOrderById(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
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
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const search = req.query.search as string;
        const startDate = req.query.startDate as string;
        const endDate = req.query.endDate as string;

        const result = await paymentService.getTransactions({ page, limit, search, startDate, endDate });
        res.json(result);
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
        const success = await emailService.sendPaymentReminderEmail({
            to: orderFull.user.email,
            userName: (orderFull.user as any).profile?.name || 'Bạn',
            orderCode: orderFull.code,
            amount: Number(orderFull.amount),
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

export const syncTransactions = async (req: Request, res: Response) => {
    try {
        const paymentService = container.resolve<PaymentService>('PaymentService');
        const { accountNumber } = req.body;
        const result = await paymentService.syncTransactions(accountNumber);
        res.json({ message: 'Sync completed', result });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
