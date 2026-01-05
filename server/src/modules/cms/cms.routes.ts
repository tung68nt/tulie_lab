import { Router } from 'express';
import * as CMSController from './cms.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Public: Get settings (for homepage etc)
router.get('/', CMSController.getSettings);

// Admin: Update settings
router.post('/', authenticate, authorize([Role.ADMIN]), CMSController.updateSetting);

export default router;
