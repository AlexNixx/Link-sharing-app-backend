import { Router } from 'express';
import { socialNetworkController } from '../controller/social-network-controller.js';
import { authMiddleware } from '../middlewares/auth-middleware.js';

const router = Router();

router.get('/', authMiddleware, socialNetworkController.getMyLinks);
router.post('/', authMiddleware, socialNetworkController.createOrUpdate);
router.delete('/:id', authMiddleware, socialNetworkController.delete);

export default router;
