import { Router } from 'express';
import { getLearningAnalytics } from './analytics.controller';
import { authenticate, authorize } from '../../../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Apply admin guard to all analytics routes
router.use(authenticate, authorize([Role.ADMIN]));

router.get('/', getLearningAnalytics);

export default router;
