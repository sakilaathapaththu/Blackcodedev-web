import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';
import { generalLimiter } from './middleware/rate-limit.js';
import { router } from './routes/index.js';

/** Builds the Express app (shared by the local server and the Vercel function). */
export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', 1); // behind Vercel's proxy: use the real client IP for rate limits

  app.use(helmet());
  app.use(
    cors({
      // No list configured = allow all in development only.
      origin: env.CORS_ORIGINS.length ? env.CORS_ORIGINS : !env.isProduction,
      methods: ['GET', 'POST', 'PATCH'],
      allowedHeaders: ['Content-Type', 'x-api-key'],
      maxAge: 600,
    }),
  );
  app.use(express.json({ limit: '100kb' }));
  app.use(generalLimiter);

  // Make sure the database is connected before any route runs.
  app.use(async (_req, _res, next) => {
    await connectDb();
    next();
  });

  app.use('/api', router);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
