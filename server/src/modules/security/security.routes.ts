import { Router } from 'express';
import { SecurityController } from './security.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Log event - can be called by any user or even guests (though usually guests don't see content)
// We might want to make it open or authenticated. Let's make it open but capture user if exists.
// However, our middleware usually blocks if not authenticated.
// For now, let's assume this is mostly for enrolled students.
router.post('/log', authenticate, SecurityController.log);

// Admin view
router.get('/list', authenticate, authorize([Role.ADMIN]), SecurityController.list);

export default router;
