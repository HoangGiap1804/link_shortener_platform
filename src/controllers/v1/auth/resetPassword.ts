/**
 * Node modules
 */
import bcrypt from 'bcrypt';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

/**
 * Custom modules
 */
// import config from '@/config';
import { logger } from '@/lib/winston';
import { verifyPasswordResetToken } from '@/lib/jwt';
import nodemailerTransport from '@/lib/nodemailer';

/**
 * Models
 */
import User from '@/models/v1/user';

/**
 * Types
 */
import { Request, Response } from 'express';
type QueryBody = { token: string };

const authResetPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { token } = req.query as QueryBody;
    const { password } = req.body;
    const { email } = verifyPasswordResetToken(token) as { email: string };

    const user = await User.findOne({ email }).select(
      'password passwordResetToken refreshToken',
    );

    if (!user) {
      return;
    }

    if (!user.passwordResetToken) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Password reset token not found',
      });
      return;
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    user.password = hashPassword;
    user.passwordResetToken = null;
    user.refreshToken = null;
    await user.save();

    res.sendStatus(204);

    await nodemailerTransport.sendMail({
      from: 'hgiap1804@gmail.com',
      to: 'hgiap1804@gmail.com',
      subject: 'Password Successfully Reset',
    });
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(401).json({
        code: 'ResetTokenExpired',
        message: 'Your password reset token bas been expired',
      });
      return;
    }

    if (error instanceof JsonWebTokenError) {
      res.status(401).json({
        code: 'ResetTokenError',
        message: 'Invalid reset password token',
      });
      return;
    }

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
    });

    logger.error('Error during reset password', error);
  }
};

export default authResetPassword;
