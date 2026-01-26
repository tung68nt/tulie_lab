import { Router } from 'express';
import { crmController } from './crm.controller';
import { crmAuthMiddleware } from '../../../middleware/crm-auth.middleware';

const router = Router();

// Secure all CRM routes with the special API Key middleware
router.use(crmAuthMiddleware);

router.get('/products', crmController.getProducts);
router.get('/users', crmController.getUsers);
router.get('/orders', crmController.getOrders);
router.get('/transactions', crmController.getTransactions);
router.get('/subscriptions', crmController.getSubscriptions);
router.get('/stats', crmController.getStats);

export default router;
