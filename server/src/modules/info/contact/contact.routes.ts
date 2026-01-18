import { Router } from 'express';
import { contactController } from './contact.controller';
import { authenticate, authorize } from '../../../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Public
router.post('/', (req, res) => contactController.create(req, res));

// Admin
router.get('/', authenticate, authorize([Role.ADMIN]), (req, res) => contactController.list(req, res));
router.put('/:id/status', authenticate, authorize([Role.ADMIN]), (req, res) => contactController.updateStatus(req, res));
router.delete('/:id', authenticate, authorize([Role.ADMIN]), (req, res) => contactController.delete(req, res));

export default router;
