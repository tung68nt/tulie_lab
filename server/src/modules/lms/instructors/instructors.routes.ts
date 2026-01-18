import { Router } from 'express';
import * as InstructorController from './instructors.controller';
import { authenticate, authorize } from '../../../middleware/auth.middleware';
import { instructorController } from './instructors.controller';
import { Role } from '@prisma/client';

const router = Router();

// Public
router.get('/', (req, res) => instructorController.list(req, res));
router.get('/:id', (req, res) => instructorController.getById(req, res));

// Admin only routes
router.post('/', authenticate, authorize([Role.ADMIN]), (req, res) => instructorController.create(req, res));
router.put('/:id', authenticate, authorize([Role.ADMIN]), (req, res) => instructorController.update(req, res));
router.delete('/:id', authenticate, authorize([Role.ADMIN]), (req, res) => instructorController.delete(req, res));

export default router;
