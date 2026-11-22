import { createHash, timingSafeEqual } from 'node:crypto';
import { env } from '../config/env.js';
import { unauthorized } from '../utils/http-error.js';

const digest = (value) => createHash('sha256').update(value).digest();
const expected = digest(env.ADMIN_API_KEY);

/**
 * Requires a valid `x-api-key` header. Hashing both sides gives equal-length
 * buffers so the comparison is constant-time (no timing leaks).
 */
export function requireAdmin(req, _res, next) {
  const provided = (req.get('x-api-key') ?? '').trim();
  if (!provided || !timingSafeEqual(digest(provided), expected)) {
    return next(unauthorized());
  }
  next();
}
