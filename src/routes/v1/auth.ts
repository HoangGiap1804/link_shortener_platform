/**
 * Node module
 */
import { Router } from 'express';
import { body } from 'express-validator';

/**
 * Controller
 */
import authResgister from '@/controllers/v1/auth/register';

/**
 * Middleware
 */
import validationError from '@/middlewares/validationError';
import expressRateLimit from '@/lib/expressRateLimit';

/**
 * Models
 */
import User from '@/models/v1/user';

const router = Router();

router.post(
  '/register',
  expressRateLimit('auth'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .isLength({ max: 30 })
    .withMessage('Email must be less than 30 characters')
    .custom(async (value) => {
      const userExists = await User.exists({ email: value }).exec();
      if (userExists) {
        throw new Error('This email is already in use');
      }
    }),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 10 characters long'),
  body('role')
    .trim()
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['user', 'admin'])
    .withMessage('Role is not suppor'),
  validationError,
  authResgister,
);

export default router;
