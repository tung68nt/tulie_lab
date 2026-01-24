import { Router } from 'express';
import * as PaymentController from './payments.controller';
import { authenticate, authenticateOptional, authorize } from '../../../middleware/auth.middleware';
import { apiLimiter, webhookLimiter, emailLimiter } from '../../../middleware/rate-limit.middleware';

const router = Router();

router.post('/checkout', authenticateOptional, apiLimiter, PaymentController.checkout);

// Admin routes - MUST be before /:code
router.get('/orders', authenticate, authorize(['ADMIN']), apiLimiter, PaymentController.getAllOrders);
router.put('/orders/:id/status', authenticate, authorize(['ADMIN']), apiLimiter, PaymentController.updateStatus);
router.delete('/orders/:id', authenticate, apiLimiter, PaymentController.deleteOrder); // User can delete their own pending orders
router.get('/transactions', authenticate, authorize(['ADMIN']), apiLimiter, PaymentController.getTransactions);
router.post('/orders/:id/send-reminder', authenticate, authorize(['ADMIN']), emailLimiter, PaymentController.sendPaymentReminder);

router.get('/:code', authenticate, apiLimiter, PaymentController.getOrder);
router.post('/sync', authenticate, authorize(['ADMIN']), apiLimiter, PaymentController.syncTransactions);
router.post('/webhook', webhookLimiter, PaymentController.webhook); // Generic public callback
router.post('/sepay-webhook', webhookLimiter, PaymentController.webhook); // Legacy SePay callback (for backwards compatibility)

export default router;
