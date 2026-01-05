import { Router } from 'express';
import * as ActivityController from './activity.controller';
import { authenticate, authenticateOptional, authorize } from '../../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Log activity (can be public/guest or authenticated)
router.post('/log', authenticateOptional, ActivityController.logActivity);

// Admin: View all logs
router.get('/list', authenticate, authorize([Role.ADMIN]), ActivityController.listActivities);

export default router;
