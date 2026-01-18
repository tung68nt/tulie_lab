import { Router } from 'express';
import { blogController } from './blog.controller';
import { authenticate, authorize } from '../../../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Public
router.get('/', (req, res) => blogController.listPosts(req, res));
router.get('/:slug', (req, res) => blogController.getPost(req, res));

// Admin
router.get('/admin/list', authenticate, authorize([Role.ADMIN]), (req, res) => blogController.listPostsAdmin(req, res));
router.post('/admin/create', authenticate, authorize([Role.ADMIN]), (req, res) => blogController.create(req, res));
router.put('/admin/:id', authenticate, authorize([Role.ADMIN]), (req, res) => blogController.update(req, res));
router.delete('/admin/:id', authenticate, authorize([Role.ADMIN]), (req, res) => blogController.delete(req, res));

export default router;
