import express from 'express';
import * as CouponController from './coupons.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = express.Router();

// Public / Validated User
router.post('/validate', authenticate, CouponController.validate);
// Or allow public validate if guest checkout?
// User said "Apply Coupon in Checkout". Guest checkout supported?
// Schema has UserID optionally in CouponUsage.
// Let's allow public validate but discourage brute force. Rate limit or Auth preferred.
// For now, keep `authenticate` as safer default, assuming User must login to pay.

// Admin Management
router.get('/manage', authenticate, authorize([Role.ADMIN]), CouponController.list);
router.post('/', authenticate, authorize([Role.ADMIN]), CouponController.create);
router.get('/:id', authenticate, authorize([Role.ADMIN]), CouponController.get);
router.put('/:id', authenticate, authorize([Role.ADMIN]), CouponController.update);
router.delete('/:id', authenticate, authorize([Role.ADMIN]), CouponController.remove);

export default router;
