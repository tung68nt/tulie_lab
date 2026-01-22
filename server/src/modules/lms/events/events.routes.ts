import { Router } from 'express';
import { eventController } from './events.controller';
import { authenticate, authorize } from '../../../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Public routes
router.get('/', (req, res) => eventController.list(req, res));
router.get('/upcoming', (req, res) => eventController.listUpcoming(req, res));

// Admin routes
router.post('/', authenticate, authorize([Role.ADMIN]), (req, res) => eventController.create(req, res));
router.get('/:id', authenticate, authorize([Role.ADMIN]), (req, res) => eventController.getById(req, res));
router.put('/:id', authenticate, authorize([Role.ADMIN]), (req, res) => eventController.update(req, res));
router.delete('/:id', authenticate, authorize([Role.ADMIN]), (req, res) => eventController.delete(req, res));

export default router;
