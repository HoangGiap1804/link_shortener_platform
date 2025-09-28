/**
 * Custom modules
 */
import { logger } from '@/lib/winston';
import config from '@/config';

/**
 * Models
 */
import User from '@/models/v1/user';

/**
 * Types
 */
import type { Request, Response } from 'express';

const authLogout = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const user = await User.findOne({ _id: userId });

    if (!user) {
      res.status(404).json({
        code: 'NotFound',
        message: 'User not found',
      });
      return;
    }

    user.refreshToken = null;
    await user.save();

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    logger.info('User refresh token delete successfully', {
      userId: req.userId,
    });

    res.status(204);
    logger.info('User logged out successfully', { userId: req.userId });
  } catch (error) {
    res.status(500).json({
      code: 'Server Error',
      message: 'Internal server error',
    });

    logger.error('Error during user logout', error);
  }
  res.json({
    message: 'logout',
  });
};

export default authLogout;
