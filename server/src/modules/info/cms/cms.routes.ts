import { Router } from 'express';
import { settingController } from '../../system/settings/settings.controller';
import { authenticate, authorize } from '../../../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Wrap Settings specifically for CMS module
router.get('/', (req, res) => settingController.getSettings(req, res));
router.get('/settings', (req, res) => settingController.getSettings(req, res));
router.put('/settings', authenticate, authorize([Role.ADMIN]), (req, res) => settingController.updateSettings(req, res));

export default router;
