/**
 * Node modules
 */
import jwt from 'jsonwebtoken';

/**
 * Custom modules
 */
import config from '@/config';

/**
 * Types
 */
import { Types } from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';

export const generateAccessToken = (userId: Types.ObjectId): string => {
  return jwt.sign({ userId }, config.JWT_ACCESS_SECRET, {
    expiresIn: config.ACCESS_TOKEN_EXPIRY,
    subject: 'accessApi',
  });
};

export const generateRefreshToken = (userId: Types.ObjectId): string => {
  return jwt.sign({ userId }, config.JWT_REFRESH_SECRET, {
    expiresIn: config.REFRESH_TOKEN_EXPIRY,
    subject: 'refreshToken',
  });
};

export const generatePasswordResetToken = (email: string): string => {
  return jwt.sign({ email }, config.JWT_PASSWORD_RESET_SECRET, {
    expiresIn: config.PASSWORD_RESET_EXPIRY,
    subject: 'passwordResetToken',
  });
};

export const verifyAccessToken = (token: string): string | JwtPayload => {
  return jwt.verify(token, config.JWT_ACCESS_SECRET);
};

export const verifyRefreshToken = (token: string): string | JwtPayload => {
  return jwt.verify(token, config.JWT_REFRESH_SECRET);
};

export const verifyPasswordResetToken = (
  token: string,
): string | JwtPayload => {
  return jwt.verify(token, config.JWT_PASSWORD_RESET_SECRET);
};
