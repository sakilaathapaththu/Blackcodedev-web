/**
 * Public runtime configuration. Values are inlined at build time, so only
 * non-secret values belong here (never API keys or tokens).
 */
const DEFAULT_API = 'https://blackcodedev-web-wz5p.vercel.app';

function trimSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

export const env = {
  /** Base URL of the backend API (backend/ in this repo). */
  apiUrl: trimSlash(process.env.NEXT_PUBLIC_API_URL || DEFAULT_API),
} as const;
