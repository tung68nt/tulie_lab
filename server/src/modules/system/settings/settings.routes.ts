import { Router } from 'express';
import { settingController } from './settings.controller';
import { authenticate, authorize } from '../../../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Public/General
router.get('/', (req, res) => settingController.getSettings(req, res));
router.get('/public', (req, res) => settingController.getSettings(req, res));

// Admin only
router.put('/', authenticate, authorize([Role.ADMIN]), (req, res) => settingController.updateSettings(req, res));

// API Key management
router.get('/api-key', authenticate, authorize([Role.ADMIN]), (req, res) => settingController.getApiKey(req, res));
router.post('/api-key/regenerate', authenticate, authorize([Role.ADMIN]), (req, res) => settingController.regenerateApiKey(req, res));

// Email logs
router.get('/email-logs', authenticate, authorize([Role.ADMIN]), (req, res) => settingController.getEmailLogs(req, res));

// Telegram test
router.post('/telegram/test', authenticate, authorize([Role.ADMIN]), (req, res) => settingController.testTelegram(req, res));

export default router;
