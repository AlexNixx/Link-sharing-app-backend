import { Router } from 'express';
import { userController } from '../controller/user-controller.js';

const router = Router();

router.post('/sign-up', userController.singUp);
router.post('/sign-in', userController.singIn);
router.post('/logout', userController.logout);
router.get('/refresh-tokens', userController.refresh);

export default router;
