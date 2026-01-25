import { Request, Response } from 'express';
import { container } from '../../../core/container';
import { UserService } from './users.service';
import { AuthRequest } from '../../../middleware/auth.middleware';

export class UserController {
    private get userService(): UserService {
        return container.resolve<UserService>('UserService');
    }

    async getProfile(req: AuthRequest, res: Response) {
        try {
            if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
            const user = await this.userService.getUserById(req.user.id);
            res.json(user);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateProfile(req: AuthRequest, res: Response) {
        try {
            if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
            const user = await this.userService.updateUser(req.user.id, req.body);
            res.json(user);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async listUsers(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const search = req.query.search as string;
            const result = await this.userService.getAllUsers(page, limit, search);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getUserDetails(req: Request, res: Response) {
        try {
            const user = await this.userService.getUserDetailsForAdmin(req.params.id as string);
            if (!user) return res.status(404).json({ message: 'User not found' });
            res.json(user);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getInactive(req: Request, res: Response) {
        try {
            const days = parseInt(req.query.days as string) || 7;
            const result = await this.userService.getInactiveUsers(days);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async enrollManual(req: Request, res: Response) {
        try {
            const { userId, courseId } = req.body;
            await this.userService.enrollUser(userId, courseId);
            res.json({ success: true });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async unenrollManual(req: Request, res: Response) {
        try {
            const { userId, courseId } = req.body;
            await this.userService.unenrollUser(userId, courseId);
            res.json({ success: true });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async grantMembership(req: Request, res: Response) {
        try {
            const { userId, days, tier } = req.body;
            const subscription = await this.userService.grantMembership(userId, days || 365, tier || 'PREMIUM');
            res.json(subscription);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async blockUser(req: Request, res: Response) {
        try {
            await this.userService.blockUser(req.params.id as string);
            res.json({ success: true, message: 'User blocked' });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async unblockUser(req: Request, res: Response) {
        try {
            await this.userService.unblockUser(req.params.id as string);
            res.json({ success: true, message: 'User unblocked' });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            await this.userService.deleteUser(req.params.id as string);
            res.json({ success: true, message: 'User deleted' });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getUserOrders(req: AuthRequest, res: Response) {
        try {
            if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
            const orders = await this.userService.getUserOrders(req.user.id);
            res.json(orders);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}

export const userController = new UserController();
