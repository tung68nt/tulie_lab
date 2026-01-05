import { Router } from 'express';
import * as blogController from './blog.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', blogController.getPublishedPosts);
router.get('/:slug', blogController.getPostBySlug);

// Admin routes
router.get('/admin/all', authenticate, authorize(['ADMIN']), blogController.getAllPosts);
router.get('/admin/:id', authenticate, authorize(['ADMIN']), blogController.getPostById);
router.post('/admin', authenticate, authorize(['ADMIN']), blogController.createPost);
router.put('/admin/:id', authenticate, authorize(['ADMIN']), blogController.updatePost);
router.delete('/admin/:id', authenticate, authorize(['ADMIN']), blogController.deletePost);

export default router;
