import { Request, Response } from 'express';
import * as NotificationService from './notifications.service';
import { AuthRequest } from '../../middleware/auth.middleware';
import { NotificationType } from '@prisma/client';

// ADMIN: Create notification
export const create = async (req: Request, res: Response) => {
    try {
        const { title, content, type, startDate, endDate, targetAll, targetBirthday } = req.body;

        // Explicit checks or defaults
        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        const notification = await NotificationService.createNotification({
            title,
            content,
            type: type as NotificationType || NotificationType.SYSTEM,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            targetAll: targetAll ?? true,
            targetBirthday: targetBirthday ?? false
        });

        res.status(201).json(notification);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// USER: Get my notifications
export const getMyNotifications = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthRequest).user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const result = await NotificationService.getUserNotifications(userId);

        // Transform for frontend
        const notifications = [
            ...result.unreadSystem.map(n => ({
                id: n.id,
                title: n.title,
                content: n.content,
                type: n.type,
                createdAt: n.createdAt,
                isRead: false
            })),
            ...result.userSpecific.map(un => ({
                id: un.notification.id,
                title: un.notification.title,
                content: un.notification.content,
                type: un.notification.type,
                createdAt: un.notification.createdAt,
                isRead: un.isRead
            }))
        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        res.json(notifications);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// USER: Mark as read
export const markRead = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthRequest).user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const { id } = req.params; // Notification ID
        if (!id) return res.status(400).json({ message: 'Missing ID' });

        await NotificationService.markAsRead(userId, id);
        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// ADMIN: List all system notifications
export const listAll = async (req: Request, res: Response) => {
    try {
        const notifications = await NotificationService.getAllNotifications();
        res.json(notifications);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// ADMIN: Update notification
export const update = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'Missing ID' });

        const { title, content, type, isActive, startDate, endDate, targetAll, targetBirthday } = req.body;

        const notification = await NotificationService.updateNotification(id, {
            title,
            content,
            type: type as NotificationType,
            isActive,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            targetAll,
            targetBirthday
        });

        res.json(notification);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// ADMIN: Delete
export const remove = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'Missing ID' });

        await NotificationService.deleteNotification(id);
        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
