import path from 'node:path';
import multer from 'multer';
import { badRequest } from '../utils/http-error.js';

export const MAX_CV_BYTES = 10 * 1024 * 1024;

/** Extension -> accepted MIME types (some OSes report Word files as octet-stream). */
const ALLOWED = {
  '.pdf': ['application/pdf'],
  '.doc': ['application/msword', 'application/octet-stream'],
  '.docx': [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/octet-stream',
  ],
};

/** File signatures ("magic bytes"), so a renamed executable is rejected. */
const SIGNATURES = {
  '.pdf': [Buffer.from('%PDF')],
  '.doc': [Buffer.from([0xd0, 0xcf, 0x11, 0xe0])],
  '.docx': [Buffer.from([0x50, 0x4b, 0x03, 0x04])],
};

/** True when the uploaded bytes really look like the claimed file type. */
export function hasValidSignature(file) {
  const ext = path.extname(file.originalname).toLowerCase();
  return (SIGNATURES[ext] ?? []).some((sig) => file.buffer.subarray(0, sig.length).equals(sig));
}

/** Memory storage: the file is streamed to Vercel Blob, never to local disk. */
export const uploadCv = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_CV_BYTES, files: 1, fields: 20 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const ok = ALLOWED[ext]?.includes(file.mimetype);
    cb(ok ? null : badRequest('Only PDF, DOC or DOCX files are allowed'), Boolean(ok));
  },
}).single('cv');
