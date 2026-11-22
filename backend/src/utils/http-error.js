/** Error with an HTTP status that is safe to show to API clients. */
export class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.details = details;
  }
}

export const badRequest = (message, details) => new HttpError(400, message, details);
export const unauthorized = () => new HttpError(401, 'Unauthorized');
export const notFound = (what = 'Resource') => new HttpError(404, `${what} not found`);
