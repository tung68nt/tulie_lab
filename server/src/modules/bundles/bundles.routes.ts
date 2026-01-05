import express from 'express';
import * as BundleController from './bundles.controller';
import { authenticate, authorize, authenticateOptional } from '../../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = express.Router();

// Public
router.get('/', authenticateOptional, BundleController.list);
router.get('/:id', BundleController.get);

// Admin
router.get('/manage/all', authenticate, authorize([Role.ADMIN]), BundleController.listAdmin);
router.post('/', authenticate, authorize([Role.ADMIN]), BundleController.create);
router.put('/:id', authenticate, authorize([Role.ADMIN]), BundleController.update);
router.delete('/:id', authenticate, authorize([Role.ADMIN]), BundleController.remove);

export default router;
