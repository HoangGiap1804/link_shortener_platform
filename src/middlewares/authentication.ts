/**
 * Node modules
 */
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

/**
 * Custom modules
 */
// import { logger } from '@/lib/winston';
// import { verifyAccessToken } from "@/lib/jwt";

/**
 * Types
 */
import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '@/lib/jwt';
import { Types } from 'mongoose';
import { logger } from '@/lib/winston';
// import type { Types } from 'mongoose';

const authentication = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({
      code: 'AuthenticationError',
      message: 'Access denied, no token provided',
    });
    return;
  }

  const [_, token] = authHeader.split(' ');
  try {
    const jwtPayload = verifyAccessToken(token) as { userId: Types.ObjectId };
    req.userId = jwtPayload.userId;
    return next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(401).json({
        code: 'AutheticationError',
        message: 'Access token expired, request a new one with refresh token',
      });
      return;
    }

    if (error instanceof JsonWebTokenError) {
      res.status(401).json({
        code: 'AutheticationError',
        message: 'Access token invalid',
      });
      return;
    }

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
    });
    logger.error('Error during authentication', error);
    return;
  }
};

export default authentication;
