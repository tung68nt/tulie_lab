import express from 'express';
import { ProxyController } from './proxy.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = express.Router();

// Route to stream video
// Authenticate to prevent unauthorized usage of your server bandwidth
router.get('/stream', authenticate, ProxyController.streamVideo);

export default router;
