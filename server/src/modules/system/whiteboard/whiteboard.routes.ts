import { Router } from 'express';
import { WhiteboardController } from './whiteboard.controller';
import { WhiteboardService } from './whiteboard.service';
import { PrismaWhiteboardRepository } from './repositories/prisma-whiteboard.repository';
import { authenticate } from '../../../middleware/auth.middleware';

const router = Router();
const repository = new PrismaWhiteboardRepository();
const service = new WhiteboardService(repository);
const controller = new WhiteboardController(service);

// Public / Optional Auth routes
import { authenticateOptional } from '../../../middleware/auth.middleware';
router.get('/:id', authenticateOptional, controller.getOne);

// All other whiteboard routes require strict authentication
router.use(authenticate);

// Admin routes (Must be before generic :id routes if they conflicted, but here they are specific)
import { authorize } from '../../../middleware/auth.middleware';
import { Role } from '@prisma/client';
router.get('/admin/stats', authorize([Role.ADMIN]), controller.getAdminStats);

router.post('/', controller.create);
router.get('/my', controller.getMyWhiteboards);
// router.get('/:id', controller.getOne); // Moved up
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

// Artboard routes
router.post('/:id/artboards', controller.addArtboard);
router.post('/:id/snapshots', controller.saveSnapshot);
router.put('/artboards/:artboardId/state', controller.saveArtboardState);

export default router;
