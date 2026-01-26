import { Request, Response } from 'express';
import { CrmService } from './crm.service';

const crmService = new CrmService();

export class CrmController {
    async getProducts(req: Request, res: Response) {
        try {
            const products = await crmService.getProducts();
            res.json(products);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getUsers(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 50;
            const result = await crmService.getUsers(page, limit);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getOrders(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 50;
            const result = await crmService.getOrders(page, limit);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getTransactions(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 100;
            const result = await crmService.getTransactions(page, limit);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getSubscriptions(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 50;
            const result = await crmService.getSubscriptions(page, limit);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getStats(req: Request, res: Response) {
        try {
            const stats = await crmService.getStats();
            res.json(stats);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}

export const crmController = new CrmController();
