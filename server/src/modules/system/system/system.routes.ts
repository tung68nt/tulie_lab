import { Router } from 'express';
import * as SystemController from './system.controller';
import { authenticate, authorize } from '../../../middleware/auth.middleware';

const router = Router();

// Only Admins can view system stats
router.get('/stats', authenticate, authorize(['ADMIN']), SystemController.getSystemStats);

export default router;
