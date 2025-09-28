/**
 * Custom modules
 */
import config from '@/config';
import { logger } from '@/lib/winston';
import { generatePasswordResetToken } from '@/lib/jwt';
import { buildResetPasswordEmail } from '@/emailTemplate/emailResetPassword';

/**
 * Models
 */
import User from '@/models/v1/user';

/**
 * Types
 */
import type { Request, Response } from 'express';
import type { IUser } from '@/models/v1/user';
import nodemailerTransport from '@/lib/nodemailer';

type RequestBody = Pick<IUser, 'email'>;

const authForgotPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { email } = req.body as RequestBody;
  try {
    const passwordResetToken = generatePasswordResetToken(email);

    const user = await User.findOne({ email })
      .select('passwordResetToken')
      .exec();

    if (!user) {
      return;
    }
    user.passwordResetToken = passwordResetToken;
    await user.save();

    await nodemailerTransport.sendMail({
      from: 'hgiap1804@gmail.com',
      to: 'hgiap1804@gmail.com',
      subject: 'Xin caho test email',
      html: buildResetPasswordEmail({
        email: email,
        resetUrl: `${config.CLIENT_ORIGIN}/auth/reset-password?token=${passwordResetToken}`,
      }),
    });

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
    });

    logger.error('Error during reset password', error);
  }
};

export default authForgotPassword;
