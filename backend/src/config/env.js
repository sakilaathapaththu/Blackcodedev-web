import { z } from 'zod';

/**
 * Validates environment variables once at startup so misconfiguration fails
 * fast with a clear message instead of at the first request.
 */
const csv = z
  .string()
  .optional()
  .transform((value) =>
    (value ?? '')
      .split(',')
      .map((item) => item.trim().replace(/\/+$/, ''))
      .filter(Boolean),
  );

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),

  MONGO_URI: z.string().min(1, 'MONGO_URI is required'),
  ADMIN_API_KEY: z.string().min(16, 'ADMIN_API_KEY must be at least 16 characters'),

  // Browser origins allowed to call the API (comma separated).
  CORS_ORIGINS: csv,

  // Vercel Blob (CV storage)
  BLOB_READ_WRITE_TOKEN: z.string().min(1, 'BLOB_READ_WRITE_TOKEN is required'),
  BLOB_ACCESS: z.enum(['public', 'private']).default('public'),

  // Contact form email (Gmail app password)
  GMAIL_USER: z.string().email().optional(),
  GMAIL_APP_PASSWORD: z.string().optional(),
  CONTACT_TO_EMAIL: z.string().email().default('helloblackcodedev@gmail.com'),
});

const parsed = schema.safeParse({
  ...process.env,
  // Backwards compatibility with the old careers-api variable name.
  BLOB_READ_WRITE_TOKEN:
    process.env.BLOB_READ_WRITE_TOKEN ?? process.env.BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN,
  CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL ?? process.env.TO_EMAIL,
});

if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n');
  throw new Error(`Invalid environment configuration:\n${issues}`);
}

export const env = Object.freeze({
  ...parsed.data,
  isProduction: parsed.data.NODE_ENV === 'production',
  mailEnabled: Boolean(parsed.data.GMAIL_USER && parsed.data.GMAIL_APP_PASSWORD),
});
