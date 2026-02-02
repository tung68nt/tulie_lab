import { Router } from 'express';
import * as MentoringController from './mentoring.controller';
import { authenticate, authorize } from '../../../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.post('/book', authenticate, MentoringController.book);
router.get('/my-sessions', authenticate, MentoringController.mySessions);

// Admin Routes
router.get('/schedule', authenticate, authorize([Role.ADMIN]), MentoringController.getSchedule);
router.put('/:id', authenticate, authorize([Role.ADMIN]), MentoringController.update);

export default router;
