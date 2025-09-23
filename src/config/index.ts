/**
 * Node module
 */
import dotenv from 'dotenv';

dotenv.config();

/**
 * Constants
 */
const CORS_WHITELIST = ['https://'];

const config = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  CORS_WHITELIST,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};

export default config;
