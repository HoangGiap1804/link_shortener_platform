/**
 * Node modules
 */
import { Router } from 'express';

/**
 * Controllers
 */
import getCurrentUser from '@/controllers/v1/user/getUser';

/**
 * Widlewares
 */
import validationError from '@/middlewares/validationError';
import authentication from '@/middlewares/authentication';
import expressRateLimit from '@/lib/expressRateLimit';

/**
 * Models
 */
// import User from '@/models/v1/user';

const router = Router();

router.get('/', authentication, validationError, getCurrentUser);

export default router;
