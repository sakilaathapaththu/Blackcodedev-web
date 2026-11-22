/**
 * Public runtime configuration. Values are inlined at build time, so only
 * non-secret values belong here (never API keys or tokens).
 */
const DEFAULT_API = 'https://blackcodedev-web-wz5p.vercel.app';

/**
 * Turns user/env input into an absolute base URL: trims spaces and trailing
 * slashes, and adds `https://` when the scheme is missing (otherwise the
 * browser would treat "api.example.com" as a relative path).
 */
export function normalizeBaseUrl(value: string): string {
  const trimmed = value.trim().replace(/\/+$/, '');
  if (!trimmed) return '';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export const env = {
  /** Base URL of the backend API (backend/ in this repo). */
  apiUrl: normalizeBaseUrl(process.env.NEXT_PUBLIC_API_URL || DEFAULT_API),
} as const;
