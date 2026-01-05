import { Router } from 'express';
import * as InstructorController from './instructors.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.get('/', InstructorController.list);
router.get('/:id', InstructorController.get);

// Admin only routes
router.post('/', authenticate, authorize([Role.ADMIN]), InstructorController.create);
router.put('/:id', authenticate, authorize([Role.ADMIN]), InstructorController.update);
router.delete('/:id', authenticate, authorize([Role.ADMIN]), InstructorController.remove);

export default router;
