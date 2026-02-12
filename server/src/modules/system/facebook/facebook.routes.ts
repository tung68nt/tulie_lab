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
 * /api/ads/roi:
 *   get:
 *     summary: Get Marketing ROI data
 *     tags: [Ads]
 */
router.get('/roi', (req, res) => facebookController.getROI(req, res));

/**
 * @swagger
 * /api/ads/sync:
 *   post:
 *     summary: Manually sync Ad Insights
 *     tags: [Ads]
 */
router.post('/sync', (req, res) => facebookController.syncInsights(req, res));

/**
 * @swagger
 * /api/ads/sync-audience:
 *   post:
 *     summary: Sync users to Custom Audience
 *     tags: [Ads]
 */
router.post('/sync-audience', (req, res) => facebookController.syncAudience(req, res));

/**
 * @swagger
 * /api/ads/classify:
 *   post:
 *     summary: Classify leads and update tags
 *     tags: [Ads]
 */
router.post('/classify', (req, res) => facebookController.classify(req, res));

export default router;
