/**
 * Custom Node
 */
import config from '@/config';
import { logger } from '@/lib/winston';
import {
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} from '@/lib/jwt';

/**
 * Types
 */
import { Request, Response } from 'express';
import User from '@/models/v1/user';
import { Types } from 'mongoose';

const authRefreshToken = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies.refreshToken as string;
  try {
    const user = await User.findOne({ refreshToken }).exec();
    if (!user) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Invalid refresh token',
      });
      return;
    }

    const jwtPayLoad = verifyRefreshToken(refreshToken) as {
      userId: Types.ObjectId;
    };

    const newAccessToken = generateAccessToken(jwtPayLoad.userId);
    const newRefreshToken = generateRefreshToken(jwtPayLoad.userId);
    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie('refreshToken', newRefreshToken, {
      maxAge: config.COOKIE_MAX_AGE,
      httpOnly: config.NODE_ENV === 'production',
      secure: true,
    });
    res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
    });
    logger.error('Error while refreshing token', error);
  }
  res.json({
    message: 'Refresh Token',
  });
};

export default authRefreshToken;
