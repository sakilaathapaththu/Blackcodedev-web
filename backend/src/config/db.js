import mongoose from 'mongoose';
import { env } from './env.js';

mongoose.set('strictQuery', true);

/**
 * Reuses one connection across serverless invocations. On Vercel the module
 * stays warm between requests, so caching the promise avoids reconnecting
 * (and the cold-start 500s the old API produced) on every call.
 */
let connection = null;

export function connectDb() {
  if (!connection) {
    connection = mongoose
      .connect(env.MONGO_URI, { serverSelectionTimeoutMS: 10_000, maxPoolSize: 10 })
      .catch((err) => {
        connection = null; // allow a retry on the next request
        throw err;
      });
  }
  return connection;
}
