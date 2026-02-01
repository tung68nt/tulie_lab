import express from 'express';
import * as PricingAddOnController from './pricing-addons.controller';
import { authenticate, authorize } from '../../../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = express.Router();

// Public - list active add-ons
router.get('/', PricingAddOnController.list);
router.get('/:id', PricingAddOnController.get);

// Admin
router.post('/', authenticate, authorize([Role.ADMIN]), PricingAddOnController.create);
router.put('/:id', authenticate, authorize([Role.ADMIN]), PricingAddOnController.update);
router.delete('/:id', authenticate, authorize([Role.ADMIN]), PricingAddOnController.remove);
router.post('/reorder', authenticate, authorize([Role.ADMIN]), PricingAddOnController.reorder);

export default router;
