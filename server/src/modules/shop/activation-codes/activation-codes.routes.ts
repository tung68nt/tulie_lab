import { Router } from 'express';
import { activationCodeController } from './activation-codes.controller';
import { authenticate, authorize } from '../../../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Public - User redeem
router.post('/redeem', authenticate, (req, res) => activationCodeController.redeem(req, res));

// Admin routes - Match FE API calls
router.get('/admin/list', authenticate, authorize([Role.ADMIN]), (req, res) => activationCodeController.list(req, res));
router.post('/admin/create', authenticate, authorize([Role.ADMIN]), (req, res) => activationCodeController.generate(req, res));
router.delete('/admin/:id', authenticate, authorize([Role.ADMIN]), (req, res) => activationCodeController.delete(req, res));

// Legacy routes (keep for backwards compatibility)
router.get('/', authenticate, authorize([Role.ADMIN]), (req, res) => activationCodeController.list(req, res));
router.post('/generate', authenticate, authorize([Role.ADMIN]), (req, res) => activationCodeController.generate(req, res));
router.get('/order/:orderId', authenticate, authorize([Role.ADMIN]), (req, res) => activationCodeController.getByOrder(req, res));

export default router;
