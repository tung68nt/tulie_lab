import { Router } from 'express';
import { productController } from './products.controller';
import { authenticate, authorize } from '../../../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Public
router.get('/', (req, res) => productController.list(req, res));
router.get('/:slug', (req, res) => productController.getBySlug(req, res));

// Admin
router.post('/', authenticate, authorize([Role.ADMIN]), (req, res) => productController.create(req, res));
router.put('/:id', authenticate, authorize([Role.ADMIN]), (req, res) => productController.update(req, res));
router.delete('/:id', authenticate, authorize([Role.ADMIN]), (req, res) => productController.delete(req, res));
router.post('/:id/versions', authenticate, authorize([Role.ADMIN]), (req, res) => productController.addVersion(req, res));
router.delete('/versions/:versionId', authenticate, authorize([Role.ADMIN]), (req, res) => productController.deleteVersion(req, res));

export default router;
