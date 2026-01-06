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

// API Key management
router.get('/api-key', authenticate, authorize([Role.ADMIN]), SettingsController.getApiKey);
router.post('/api-key/regenerate', authenticate, authorize([Role.ADMIN]), SettingsController.regenerateApiKey);

export default router;
