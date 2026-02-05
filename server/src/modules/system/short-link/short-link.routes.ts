import { Router } from 'express';
import { ShortLinkController } from './short-link.controller';
import { ShortLinkService } from './short-link.service';
import { PrismaShortLinkRepository } from './repositories/prisma-short-link.repository';

const router = Router();
const shortLinkRepository = new PrismaShortLinkRepository();
const shortLinkService = new ShortLinkService(shortLinkRepository);
const shortLinkController = new ShortLinkController(shortLinkService);

// Admin routes (management)
router.get('/', shortLinkController.getAllLinks);
router.post('/', shortLinkController.createShortLink);
router.patch('/:id', shortLinkController.updateLink);
router.delete('/:id', shortLinkController.deleteLink);

// Resolution route
router.get('/:code', shortLinkController.resolveCode);

export default router;
