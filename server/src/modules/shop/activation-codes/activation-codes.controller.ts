import { Request, Response } from 'express';
import { container } from '../../../core/container';
import { ActivationCodeService } from './activation-codes.service';
import { AuthRequest } from '../../../middleware/auth.middleware';

export class ActivationCodeController {
    private get activationCodeService(): ActivationCodeService {
        return container.resolve<ActivationCodeService>('ActivationCodeService');
    }

    async generate(req: Request, res: Response) {
        try {
            const { courseId, count, buyerId, orderId } = req.body;
            const codes = await this.activationCodeService.generateCodes(courseId, count, buyerId, orderId);
            res.status(201).json(codes);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async redeem(req: AuthRequest, res: Response) {
        try {
            if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
            const { code } = req.body;
            const result = await this.activationCodeService.redeemCode(code, req.user.id);
            res.json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async list(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const result = await this.activationCodeService.listCodes({
                skip: (page - 1) * limit,
                take: limit
            });
            res.json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async getByOrder(req: Request, res: Response) {
        try {
            const result = await this.activationCodeService.getByOrderId(req.params.orderId as string);
            res.json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            if (!id) return res.status(400).json({ message: 'ID is required' });
            await this.activationCodeService.deleteCode(id);
            res.json({ success: true, message: 'Activation code deleted' });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
} catch (error: any) {
    res.status(400).json({ message: error.message });
}
    }
}

export const activationCodeController = new ActivationCodeController();
