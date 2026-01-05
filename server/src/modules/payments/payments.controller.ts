import { Request, Response } from 'express';
import * as PaymentService from './payments.service';
import { AuthRequest } from '../../middleware/auth.middleware';

export const checkout = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthRequest).user?.id!;
        const { courseId, promoCodeId } = req.body;

        // Get course to determine price
        const course: any = await require('../../config/prisma').default.course.findUnique({
            where: { id: courseId }
        });

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const order = await PaymentService.createOrder(userId, courseId, course.price, promoCodeId);
        res.json(order);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getOrder = async (req: Request, res: Response) => {
    try {
        const { code } = req.params;
        if (!code) return res.status(400).json({ message: 'Missing code' });
        const order = await PaymentService.getOrder(code);
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
        // Sepay payload
        const { id, transferAmount, transferContent, referenceCode } = req.body;

        if (!transferContent) {
            return res.status(400).json({ success: false, message: 'No content' });
        }

        // Extract Order Code from content
        // Assuming content contains the code e.g. "THANH TOAN ORD-123456"
        // Regex to find "ORD-" followed by numbers
        const match = transferContent.match(/ORD-\d+/);
        if (!match) {
            return res.status(200).json({ success: false, message: 'No order code found' });
        }

        const orderCode = match[0];

        await PaymentService.processWebhook({
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
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search as string;
        const status = req.query.status as string;

        const result = await PaymentService.getAllOrders({ page, limit, search, status });
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'Missing order ID' });

        const { status } = req.body;
        if (!status) return res.status(400).json({ message: 'Missing status' });

        const updated = await PaymentService.updateOrderStatus(id, status);
        res.json(updated);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getTransactions = async (req: Request, res: Response) => {
    try {
        const transactions = await PaymentService.getTransactions();
        res.json(transactions);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
