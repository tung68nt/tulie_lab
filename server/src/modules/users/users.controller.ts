import { Request, Response } from 'express';
import * as UserService from './users.service';
import { AuthRequest } from '../../middleware/auth.middleware';

export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthRequest).user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await UserService.getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthRequest).user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const data = req.body;
        // Basic validation/filtering could go here

        const user = await UserService.updateUser(userId, data);

        res.json(user);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const listUsers = async (req: Request, res: Response) => {
    try {
        const users = await UserService.getAllUsers();
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const manualEnroll = async (req: Request, res: Response) => {
    try {
        const { userId, courseId } = req.body;
        if (!userId || !courseId) {
            return res.status(400).json({ message: 'Missing userId or courseId' });
        }
        await UserService.enrollUser(userId, courseId);
        res.json({ message: 'User enrolled successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const manualUnenroll = async (req: Request, res: Response) => {
    try {
        const { userId, courseId } = req.body;
        if (!userId || !courseId) {
            return res.status(400).json({ message: 'Missing userId or courseId' });
        }
        await UserService.unenrollUser(userId, courseId);
        res.json({ message: 'User unenrolled successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Missing user ID' });
        }
        // Use enhanced function for admin view with activities and stats
        const user = await UserService.getUserDetailsForAdmin(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserOrders = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthRequest).user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const orders = await UserService.getUserOrders(userId);
        res.json(orders);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getInactiveUsers = async (req: Request, res: Response) => {
    try {
        const days = Number(req.query.days) || 7;
        const users = await UserService.getInactiveUsers(days);
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
