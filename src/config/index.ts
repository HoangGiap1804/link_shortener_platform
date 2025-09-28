/**
 * Node module
 */
import dotenv from 'dotenv';

/**
 * Types
 */
import type ms from 'ms';

dotenv.config();

/**
 * Constants
 */
const CORS_WHITELIST = ['https://'];
const _1H_IN_MILLISECOND = 1000 * 60 * 60;
const _7d_IN_MILLISECOND = 7 * 1000 * 60 * 60;

const config = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  CORS_WHITELIST,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  WINDOW_MS: _1H_IN_MILLISECOND,
  MONGO_CONNECTION_URL: process.env.MONGO_CONNECTION_URL,
  WHITELISTED_EMAILS: process.env.WHITELISTED_EMAILS?.split(','),
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  JWT_PASSWORD_RESET_SECRET: process.env.JWT_PASSWORD_RESET_SECRET!,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY as ms.StringValue,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY as ms.StringValue,
  PASSWORD_RESET_EXPIRY: process.env.PASSWORD_RESET_EXPIRY as ms.StringValue,
  SENDER_EMAIL: process.env.SENDER_EMAIL!,
  PASSWORD_EMAIL: process.env.PASSWORD_EMAIL!,
  COOKIE_MAX_AGE: _7d_IN_MILLISECOND,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN!,
};

export default config;
