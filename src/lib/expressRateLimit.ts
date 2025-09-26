/**
 * Node modules
 */
import { rateLimit } from 'express-rate-limit';

/**
 * Custom modules
 */
import config from '@/config';

/**
 * Types
 */
import type { RateLimitRequestHandler, Options } from 'express-rate-limit';
type RateLimitType = 'basic' | 'auth' | 'passReset';

const defaultLimitOpt: Partial<Options> = {
  windowMs: config.WINDOW_MS,
  legacyHeaders: false,
  standardHeaders: true,
};

const rateLimitOpt = new Map<RateLimitType, Partial<Options>>([
  ['basic', { ...defaultLimitOpt, limit: 100 }],
  ['auth', { ...defaultLimitOpt, limit: 10 }],
  ['passReset', { ...defaultLimitOpt, limit: 3 }],
]);

const expressRateLimit = (type: RateLimitType): RateLimitRequestHandler => {
  return rateLimit(rateLimitOpt.get(type));
};

export default expressRateLimit;
