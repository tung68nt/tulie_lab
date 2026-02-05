import { Router } from 'express';
import { WhiteboardController } from './whiteboard.controller';
import { WhiteboardService } from './whiteboard.service';
import { PrismaWhiteboardRepository } from './repositories/prisma-whiteboard.repository';
import { authenticate } from '../../../middleware/auth.middleware';

const router = Router();
const repository = new PrismaWhiteboardRepository();
const service = new WhiteboardService(repository);
const controller = new WhiteboardController(service);

// All whiteboard routes require authentication
router.use(authenticate);

router.post('/', controller.create);
router.get('/my', controller.getMyWhiteboards);
router.get('/:id', controller.getOne);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

// Artboard routes
router.post('/:id/artboards', controller.addArtboard);
router.post('/:id/snapshots', controller.saveSnapshot);
router.put('/artboards/:artboardId/state', controller.saveArtboardState);

// Admin routes
import { authorize } from '../../../middleware/auth.middleware';
import { Role } from '@prisma/client';
router.get('/admin/stats', authorize([Role.ADMIN]), controller.getAdminStats);

export default router;
