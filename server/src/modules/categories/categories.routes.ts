import express from 'express';
import * as CategoriesController from './categories.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = express.Router();

// Public
router.get('/', CategoriesController.list);
router.get('/:id', CategoriesController.get);

// Admin only
router.post('/', authenticate, authorize([Role.ADMIN]), CategoriesController.create);
router.put('/:id', authenticate, authorize([Role.ADMIN]), CategoriesController.update);
router.delete('/:id', authenticate, authorize([Role.ADMIN]), CategoriesController.remove);

export default router;
