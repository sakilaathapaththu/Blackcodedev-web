import multer from 'multer';
import { HttpError, notFound } from '../utils/http-error.js';

export function notFoundHandler(req, _res, next) {
  next(notFound(`Route ${req.method} ${req.path}`));
}

/**
 * Single place that turns errors into JSON responses. Internal details are
 * logged but never sent to the client.
 */
export function errorHandler(err, req, res, _next) {
  let status = 500;
  let body = { error: 'Server error' };

  if (err instanceof HttpError) {
    status = err.status;
    body = { error: err.message, ...(err.details && { details: err.details }) };
  } else if (err instanceof multer.MulterError) {
    status = 400;
    body = { error: err.code === 'LIMIT_FILE_SIZE' ? 'CV must be 10 MB or smaller' : err.message };
  } else if (err?.type === 'entity.too.large') {
    status = 413;
    body = { error: 'Request body too large' };
  } else if (err?.type === 'entity.parse.failed') {
    status = 400;
    body = { error: 'Invalid JSON body' };
  } else if (err?.name === 'ValidationError') {
    status = 400;
    body = { error: 'Invalid data' };
  }

  if (status >= 500) console.error(`[${req.method} ${req.originalUrl}]`, err);
  res.status(status).json(body);
}
