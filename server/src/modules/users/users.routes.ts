import { Router } from 'express';
import * as UserController from './users.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);

// Specific routes first
router.get('/profile', UserController.getProfile);
router.put('/profile', UserController.updateProfile);
router.get('/orders', UserController.getUserOrders);

// Admin routes
router.get('/', authorize([Role.ADMIN]), UserController.listUsers);
router.post('/enroll', authorize([Role.ADMIN]), UserController.manualEnroll);
router.post('/unenroll', authorize([Role.ADMIN]), UserController.manualUnenroll);
router.get('/:id', authorize([Role.ADMIN]), UserController.getUser);

export default router;
