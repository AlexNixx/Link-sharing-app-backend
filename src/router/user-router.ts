import { Router } from 'express';
import { userController } from '../controller/user-controller.js';
import { authMiddleware } from '../middlewares/auth-middleware.js';

const router = Router();

router.post('/sign-up', userController.singUp);
router.post('/sign-in', userController.singIn);
router.post('/logout', userController.logout);
router.put('/update-profile', authMiddleware, userController.updateProfile);
router.get('/refresh-tokens', userController.refresh);

export default router;
