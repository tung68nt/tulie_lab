import { Router } from 'express';
import * as ContactController from './contact.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Public
router.post('/', ContactController.submit);

// Admin
router.get('/admin', authenticate, authorize([Role.ADMIN]), ContactController.list);
router.put('/admin/:id', authenticate, authorize([Role.ADMIN]), ContactController.update);
router.delete('/admin/:id', authenticate, authorize([Role.ADMIN]), ContactController.remove);

export default router;
