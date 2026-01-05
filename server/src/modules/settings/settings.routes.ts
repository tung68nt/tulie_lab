import { Router } from 'express';
import * as SettingsController from './settings.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Public
router.get('/public', SettingsController.getPublicSettings);

// Admin
router.get('/', authenticate, authorize([Role.ADMIN]), SettingsController.list);
router.put('/', authenticate, authorize([Role.ADMIN]), SettingsController.update);

export default router;
