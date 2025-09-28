/**
 * Node modules
 */
import nodemailer from 'nodemailer';

/**
 * Custom modules
 */
import config from '@/config';

const nodemailerTransport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  pool: true,
  auth: {
    user: config.SENDER_EMAIL,
    pass: config.PASSWORD_EMAIL,
  },
});
export default nodemailerTransport;
