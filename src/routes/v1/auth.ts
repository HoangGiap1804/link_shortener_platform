/**
 * Node module
 */
import { Router } from 'express';
import { body, cookie, query } from 'express-validator';
import bcrypt from 'bcrypt';

/**
 * Controller
 */
import authResgister from '@/controllers/v1/auth/register';
import authLogin from '@/controllers/v1/auth/login';
import authLogout from '@/controllers/v1/auth/logout';
import authRefreshToken from '@/controllers/v1/auth/refreshToken';
import authForgotPassword from '@/controllers/v1/auth/forgotPassword';
import authResetPassword from '@/controllers/v1/auth/resetPassword';

/**
 * Middleware
 */
import validationError from '@/middlewares/validationError';
import authentication from '@/middlewares/authentication';
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
    .withMessage('Password must be at least 8 characters long'),
  body('role')
    .trim()
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['user', 'admin'])
    .withMessage('Role is not suppor'),
  validationError,
  authResgister,
);

router.post(
  '/login',
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
      const user = await User.exists({ email: value }).exec();
      if (!user) {
        throw new Error('No user found with this email');
      }
    }),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .custom(async (password, { req }) => {
      const { email } = req.body;
      const user = await User.findOne({ email })
        .select('password')
        .lean()
        .exec();

      if (!user) return;

      const passwordIsValid = await bcrypt.compare(password, user.password);

      if (!passwordIsValid) {
        throw new Error('Invalid password');
      }
    }),
  validationError,
  authLogin,
);

router.delete('/logout', expressRateLimit('basic'), authentication, authLogout);

router.get(
  '/refresh-token',
  expressRateLimit('basic'),
  cookie('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required')
    .isJWT()
    .withMessage('Invalid refresh Token'),
  authentication,
  validationError,
  authRefreshToken,
);

router.post(
  '/forgot-password',
  expressRateLimit('passReset'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .isLength({ max: 30 })
    .withMessage('Email must be less than 30 characters')
    .custom(async (value) => {
      const user = await User.exists({ email: value }).exec();
      if (!user) {
        throw new Error('No user found with this email');
      }
    }),
  validationError,
  authForgotPassword,
);

router.post(
  '/reset-password',
  expressRateLimit('basic'),
  query('token')
    .notEmpty()
    .withMessage('Param token is required')
    .custom(async (value) => {
      const user = await User.exists({ passwordResetToken: value });
      if (!user) {
        throw new Error('No user found with this reset password token');
      }
    }),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  validationError,
  authResetPassword,
);
export default router;
