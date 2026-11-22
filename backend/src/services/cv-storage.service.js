import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { get, put } from '@vercel/blob';
import { env } from '../config/env.js';

/**
 * Stores CVs in Vercel Blob. Paths include a random UUID so URLs can't be
 * guessed. Set BLOB_ACCESS=private (with a private Blob store) so files can
 * only be downloaded through the admin endpoint.
 */
export async function saveCv(file) {
  const ext = path.extname(file.originalname).toLowerCase();
  const pathname = `cvs/${new Date().toISOString().slice(0, 10)}/${randomUUID()}${ext}`;

  const blob = await put(pathname, file.buffer, {
    access: env.BLOB_ACCESS,
    contentType: file.mimetype || 'application/octet-stream',
    token: env.BLOB_READ_WRITE_TOKEN,
    addRandomSuffix: false,
  });

  return {
    cvPath: blob.pathname,
    cvAccess: env.BLOB_ACCESS,
    cvUrl: env.BLOB_ACCESS === 'public' ? blob.url : undefined,
  };
}

/** Opens a stored CV for streaming to an authorised admin. */
export async function openCv({ cvPath, cvUrl, cvAccess }) {
  const target = cvPath ?? cvUrl;
  if (!target) return null;
  return get(target, { access: cvAccess ?? 'public', token: env.BLOB_READ_WRITE_TOKEN });
}
