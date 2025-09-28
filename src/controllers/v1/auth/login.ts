/**
 * Node modules
 */
// import bcrypt from 'bcrypt';

/**
 * Custom modules
 */
import { logger } from '@/lib/winston';
import config from '@/config';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';

/**
 * Models
 */
import User from '@/models/v1/user';

/**
 * Types
 */
import type { Request, Response } from 'express';
import type { IUser } from '@/models/v1/user';
type RequestBody = Pick<IUser, 'email' | 'password'>;

/**
 * Utils
 */
// import { generateMongooseId } from '@/utils';

const authLogin = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body as RequestBody;

  try {
    const user = await User.findOne({ email }).exec();

    if (!user) return;

    const refreshToken = generateRefreshToken(user._id);
    const accessToken = generateAccessToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      maxAge: config.COOKIE_MAX_AGE,
      httpOnly: config.NODE_ENV === 'production',
      secure: true,
    });

    res.status(200).json({
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
    });
    logger.error('Error during login account', error);
  }
};
export default authLogin;
