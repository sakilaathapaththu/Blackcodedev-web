import { rateLimit } from 'express-rate-limit';

/**
 * Per-IP limits. Note: on serverless each instance keeps its own counters,
 * so these are a first line of defence rather than a hard global limit.
 */
const limiter = (windowMinutes, limit, message) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: message },
  });

export const generalLimiter = limiter(15, 300, 'Too many requests. Please try again later.');
export const contactLimiter = limiter(15, 5, 'Too many messages. Please try again later.');
export const applicationLimiter = limiter(60, 10, 'Too many applications. Please try again later.');
export const adminLimiter = limiter(15, 100, 'Too many admin requests. Please try again later.');
