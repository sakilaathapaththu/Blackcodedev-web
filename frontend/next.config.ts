import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
];

/** Old static-site URLs -> new routes (keeps existing links and SEO). */
const legacyPages: Record<string, string> = {
  '/index.html': '/',
  '/aboutus.html': '/about',
  '/ourteam.html': '/team',
  '/careers.html': '/careers',
  '/contactus.html': '/contact',
  '/contact.html': '/contact',
  '/services.html': '/#services',
  '/admin-applications.html': '/admin',
};

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  reactStrictMode: true,

  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },

  async redirects() {
    return Object.entries(legacyPages).map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
};

export default nextConfig;
