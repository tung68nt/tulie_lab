import express from 'express';
import * as CategoriesController from './categories.controller';
import { authenticate, authorize } from '../../../middleware/auth.middleware';
import { Role } from '@prisma/client';
import { categoryController } from './categories.controller';

const router = express.Router();

// Public
// Public
router.get('/', (req, res) => categoryController.list(req, res));
router.get('/:slug', (req, res) => categoryController.getBySlug(req, res));

// Admin only
router.post('/', authenticate, authorize([Role.ADMIN]), (req, res) => categoryController.create(req, res));
router.put('/:id', authenticate, authorize([Role.ADMIN]), (req, res) => categoryController.update(req, res));
router.delete('/:id', authenticate, authorize([Role.ADMIN]), (req, res) => categoryController.delete(req, res));

export default router;
