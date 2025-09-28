/**
 * Node modules
 */
import bcrypt from 'bcrypt';

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

/**
 * Utils
 */
import { generateMongooseId } from '@/utils';

type RequestBody = Pick<IUser, 'email' | 'password' | 'role'>;

const authResgister = async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body as RequestBody;

  if (role === 'admin' && !config.WHITELISTED_EMAILS?.includes(email)) {
    res.status(400).json({
      code: 'BadRequest',
      message: 'You are not allowed to create and admin account',
    });
    return;
  }

  /**
   * Generate salt to hash the password
   */
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  try {
    const userId = generateMongooseId();

    const refreshToken = generateRefreshToken(userId);
    const accessToken = generateAccessToken(userId);

    const user = await User.create({
      _id: userId,
      email,
      password: hashPassword,
      role,
      refreshToken,
    });

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
    logger.error('Error during register a user', error);
  }
};
export default authResgister;
