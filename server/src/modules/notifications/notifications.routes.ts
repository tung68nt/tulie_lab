import { Router } from 'express';
import * as NotificationController from './notifications.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// User routes
router.get('/', authenticate, NotificationController.getMyNotifications);
router.put('/:id/read', authenticate, NotificationController.markRead);

// Admin routes
router.post('/', authenticate, authorize([Role.ADMIN]), NotificationController.create);
router.get('/all', authenticate, authorize([Role.ADMIN]), NotificationController.listAll);
router.put('/:id', authenticate, authorize([Role.ADMIN]), NotificationController.update);
router.delete('/:id', authenticate, authorize([Role.ADMIN]), NotificationController.remove);

export default router;
