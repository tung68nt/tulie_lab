import { Router } from 'express';
import { WhiteboardController } from './whiteboard.controller';
import { WhiteboardService } from './whiteboard.service';
import { PrismaWhiteboardRepository } from './repositories/prisma-whiteboard.repository';
import { authenticate } from '../../../middleware/auth.middleware';

const router = Router();
const repository = new PrismaWhiteboardRepository();
const service = new WhiteboardService(repository);
const controller = new WhiteboardController(service);

// 1. Specific Routes (Must come before /:id)
// authenticated routes
router.get('/my', authenticate, controller.getMyWhiteboards);

// 2. Admin routes
import { authorize } from '../../../middleware/auth.middleware';
import { Role } from '@prisma/client';
router.get('/admin/stats', authenticate, authorize([Role.ADMIN]), controller.getAdminStats);

// 3. Generic ID Routes (Public/Optional) - This matches /:id, so it must be after specific paths
import { authenticateOptional } from '../../../middleware/auth.middleware';
router.get('/:id', authenticateOptional, controller.getOne);

// 4. Authenticated Actions
router.use(authenticate);
router.post('/', controller.create);
// router.get('/my', controller.getMyWhiteboards); // Moved up
// router.get('/:id', controller.getOne); // Moved up
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

// Artboard routes
router.post('/:id/artboards', controller.addArtboard);
router.post('/:id/snapshots', controller.saveSnapshot);
router.put('/artboards/:artboardId/state', controller.saveArtboardState);

export default router;
