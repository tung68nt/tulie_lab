import { Router } from 'express';
import { landingPageController } from './landing-pages.controller';
import { authenticate, authorize } from '../../../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Public routes
router.get('/', (req, res) => landingPageController.list(req, res));

// Admin routes (more specific routes first)
router.post('/', authenticate, authorize([Role.ADMIN]), (req, res) => landingPageController.create(req, res));
router.get('/id/:id', authenticate, authorize([Role.ADMIN]), (req, res) => landingPageController.getById(req, res));
router.put('/:id', authenticate, authorize([Role.ADMIN]), (req, res) => landingPageController.update(req, res));
router.delete('/:id', authenticate, authorize([Role.ADMIN]), (req, res) => landingPageController.delete(req, res));
router.post('/:id/duplicate', authenticate, authorize([Role.ADMIN]), (req, res) => landingPageController.duplicate(req, res));
router.post('/:id/set-homepage', authenticate, authorize([Role.ADMIN]), (req, res) => landingPageController.setHomepage(req, res));

// Public dynamic route (must be last to avoid matching admin routes)
router.get('/:slug', (req, res) => landingPageController.getBySlug(req, res));

export default router;
