import mongoose from 'mongoose';
import { badRequest, notFound } from '../utils/http-error.js';

/**
 * Validates `req[source]` with a zod schema and replaces it with the parsed
 * (trimmed, coerced, unknown-keys-stripped) value.
 */
export const validate =
  (schema, source = 'body') =>
  (req, _res, next) => {
    const result = schema.safeParse(req[source] ?? {});
    if (!result.success) {
      const details = result.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message }));
      return next(badRequest(details[0]?.message ?? 'Invalid request', details));
    }
    // req.query is a getter in Express 5, so store parsed values separately.
    req.validated = { ...req.validated, [source]: result.data };
    if (source === 'body') req.body = result.data;
    next();
  };

/** Rejects malformed MongoDB ids in a route param with 404 (not a 500). */
export const validateObjectId =
  (param = 'id', what = 'Resource') =>
  (req, _res, next) => {
    if (!mongoose.isValidObjectId(req.params[param])) return next(notFound(what));
    next();
  };
