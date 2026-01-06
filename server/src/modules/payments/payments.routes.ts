import { Router } from 'express';
import * as PaymentController from './payments.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';

const router = Router();

router.post('/checkout', authenticate, PaymentController.checkout);

// Admin routes - MUST be before /:code
router.get('/orders', authenticate, authorize(['ADMIN']), PaymentController.getAllOrders);
router.put('/orders/:id/status', authenticate, authorize(['ADMIN']), PaymentController.updateStatus);
router.get('/transactions', authenticate, authorize(['ADMIN']), PaymentController.getTransactions);
router.post('/orders/:id/send-reminder', authenticate, authorize(['ADMIN']), PaymentController.sendPaymentReminder);

router.get('/:code', authenticate, PaymentController.getOrder);
router.post('/webhook', PaymentController.webhook); // Generic public callback
router.post('/sepay-webhook', PaymentController.webhook); // Legacy SePay callback (for backwards compatibility)

export default router;
