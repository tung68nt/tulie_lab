import { Router } from 'express';
import * as CMSController from './cms.controller';
import { authenticate, authorize } from '../../../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// CMS Settings Routes
router.get('/', CMSController.getSettings);
router.post('/', authenticate, authorize([Role.ADMIN]), CMSController.updateSetting);

export default router;
