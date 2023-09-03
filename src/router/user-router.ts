import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.send('Router work');
});

export default router;
