import { Router } from 'express';

import userRouter from './user-router.js';
import socialNetworkRouter from './social-network-router.js';

const routes = Router();

routes.use('/user', userRouter);
routes.use('/social', socialNetworkRouter);

export default routes;
