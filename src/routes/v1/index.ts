/**
 * Node modules
 */
import { Router } from 'express';

/**
 * Routers
 */
import authRouter from './auth';
import userRouter from './user';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'API is live',
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRouter);
router.use('/user', userRouter);

export default router;
