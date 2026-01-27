import { Router } from 'express';
import { productController } from './products.controller';
import { authenticate, authorize } from '../../../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Helper to check if a string is a UUID
const isUUID = (str: string) => /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(str);

// Public routes
router.get('/', (req, res) => productController.list(req, res));

// Combined route for both ID (UUID) and slug
router.get('/:idOrSlug', (req, res) => {
    const param = req.params.idOrSlug;
    if (isUUID(param)) {
        // Set the id param for the controller
        (req.params as any).id = param;
        return productController.getById(req, res);
    }
    // Set the slug param for the controller
    (req.params as any).slug = param;
    return productController.getBySlug(req, res);
});

// Admin routes
router.post('/', authenticate, authorize([Role.ADMIN]), (req, res) => productController.create(req, res));
router.put('/:id', authenticate, authorize([Role.ADMIN]), (req, res) => productController.update(req, res));
router.delete('/:id', authenticate, authorize([Role.ADMIN]), (req, res) => productController.delete(req, res));
router.post('/:id/versions', authenticate, authorize([Role.ADMIN]), (req, res) => productController.addVersion(req, res));
router.delete('/versions/:versionId', authenticate, authorize([Role.ADMIN]), (req, res) => productController.deleteVersion(req, res));

// Upsell Routes
router.get('/:id/upsells', (req, res) => productController.getUpsells(req, res));
router.post('/:id/upsells', authenticate, authorize([Role.ADMIN]), (req, res) => productController.addUpsell(req, res));
router.delete('/:id/upsells/:upsellId', authenticate, authorize([Role.ADMIN]), (req, res) => productController.removeUpsell(req, res));

// Classification Routes
router.get('/classifications/list', (req, res) => productController.listClassifications(req, res));
router.post('/classifications', authenticate, authorize([Role.ADMIN]), (req, res) => productController.createClassification(req, res));
router.put('/classifications/:id', authenticate, authorize([Role.ADMIN]), (req, res) => productController.updateClassification(req, res));
router.delete('/classifications/:id', authenticate, authorize([Role.ADMIN]), (req, res) => productController.deleteClassification(req, res));

export default router;
