import { Router } from 'express';
import { userController } from './users.controller';
import { authenticate, authorize } from '../../../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// User profile (self)
router.get('/my-orders', authenticate, (req: any, res, next) => {
    console.log(`[UsersRoutes] Hit /my-orders for user: ${req.user?.id}`);
    next();
}, (req, res) => userController.getUserOrders(req, res));

router.get('/profile', authenticate, (req, res) => userController.getProfile(req, res));
router.put('/profile', authenticate, (req, res) => userController.updateProfile(req, res));

// Admin routes
router.get('/', authenticate, authorize([Role.ADMIN]), (req, res) => userController.listUsers(req, res));
router.get('/inactive', authenticate, authorize([Role.ADMIN]), (req, res) => userController.getInactive(req, res));
router.get('/:id', authenticate, authorize([Role.ADMIN]), (req, res) => userController.getUserDetails(req, res));

// Enrollment management
router.post('/enroll', authenticate, authorize([Role.ADMIN]), (req, res) => userController.enrollManual(req, res));
router.post('/unenroll', authenticate, authorize([Role.ADMIN]), (req, res) => userController.unenrollManual(req, res));
router.post('/grant-membership', authenticate, authorize([Role.ADMIN]), (req, res) => userController.grantMembership(req, res));

// Admin Actions
router.post('/:id/block', authenticate, authorize([Role.ADMIN]), (req, res) => userController.blockUser(req, res));
router.post('/:id/unblock', authenticate, authorize([Role.ADMIN]), (req, res) => userController.unblockUser(req, res));
router.delete('/:id', authenticate, authorize([Role.ADMIN]), (req, res) => userController.deleteUser(req, res));

// Notes & Invoices
router.get('/:id/notes', authenticate, authorize([Role.ADMIN]), (req, res) => userController.getUserNotes(req, res));
router.post('/notes', authenticate, authorize([Role.ADMIN]), (req, res) => userController.addUserNote(req, res));
router.get('/:id/invoice-profiles', authenticate, (req, res) => userController.getInvoiceProfiles(req, res));
router.post('/:id/invoice-profiles', authenticate, (req, res) => userController.createInvoiceProfile(req, res));

export default router;
