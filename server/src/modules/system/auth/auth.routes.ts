import { Router } from 'express';
import { authController } from './auth.controller';
import { authenticate } from '../../../middleware/auth.middleware';
import { authLimiter, passwordResetLimiter } from '../../../middleware/rate-limit.middleware';

const router = Router();

router.post('/register', authLimiter, (req, res) => authController.register(req, res));
router.post('/login', authLimiter, (req, res) => authController.login(req, res));
router.post('/logout', (req, res) => authController.logout(req, res));
router.get('/me', authenticate, (req, res) => authController.me(req, res));
router.post('/forgot-password', passwordResetLimiter, (req, res) => authController.forgotPassword(req, res));
router.post('/reset-password', passwordResetLimiter, (req, res) => authController.resetPassword(req, res));

// Google Auth
router.get('/google', (req, res) => authController.googleLogin(req, res));
router.post('/google/verify', (req, res) => authController.verifyGoogleToken(req, res));

export default router;
