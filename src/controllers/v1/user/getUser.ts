/**
 * Custom modules
 */
import { logger } from '@/lib/winston';

/**
 * Modles
 */
import User from '@/models/v1/user';

/**
 * Types
 */
import { Request, Response } from 'express';

const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select('-__v').lean().exec();

    res.status(200).json({
      user,
    });

    logger.info('Get current user successfully');
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
    });
    logger.error('Error during gettign current user', error);
  }
};

export default getCurrentUser;
