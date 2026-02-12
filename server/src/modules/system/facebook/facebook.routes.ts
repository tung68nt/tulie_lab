import { Router } from 'express';
import { container } from '../../../core/container';
import { FacebookController } from './facebook.controller';
import { FacebookService } from './facebook.service';

const router = Router();

// Resolve from DI container
const facebookService = container.resolve<FacebookService>('FacebookService');
const facebookController = new FacebookController(facebookService);

/**
 * @swagger
 * /api/facebook/roi:
 *   get:
 *     summary: Get Marketing ROI data
 *     tags: [Facebook]
 */
router.get('/roi', (req, res) => facebookController.getROI(req, res));

/**
 * @swagger
 * /api/facebook/sync:
 *   post:
 *     summary: Manually sync Facebook Ad Insights
 *     tags: [Facebook]
 */
router.post('/sync', (req, res) => facebookController.syncInsights(req, res));

/**
 * @swagger
 * /api/facebook/sync-audience:
 *   post:
 *     summary: Sync users to Custom Audience
 *     tags: [Facebook]
 */
router.post('/sync-audience', (req, res) => facebookController.syncAudience(req, res));

/**
 * @swagger
 * /api/facebook/classify:
 *   post:
 *     summary: Classify leads and update tags
 *     tags: [Facebook]
 */
router.post('/classify', (req, res) => facebookController.classify(req, res));

export default router;
