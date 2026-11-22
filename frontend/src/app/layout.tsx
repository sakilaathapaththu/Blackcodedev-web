import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { seoKeywords } from '@/config/seo';
import { siteConfig } from '@/config/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'BlackCode Devs — Modern Software Development in Sri Lanka',
    template: '%s - BlackCode Devs',
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  keywords: seoKeywords,
  robots: {
    index: true,
    follow: true,
    googleBot: { 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
  },
  verification: { google: 'l4MOTqgI6ioUfdIkTRDTZnratNiRpW9Ym2HDy_dPEbM' },
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    title: 'BlackCode Devs — Modern Software Development',
    description: 'We build high-quality web and mobile apps. Cloud-ready, secure, and fast.',
    url: '/',
    images: [{ url: '/images/minilogo.png', width: 512, height: 512 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BlackCode Devs — Modern Software Development',
    description: 'Web & mobile apps, cloud, and AI integrations.',
    images: ['/images/minilogo.png'],
  },
  other: {
    'geo.region': 'LK',
    'geo.placename': 'Colombo',
    language: 'en, si, ta',
    rating: 'General',
    subject: 'Full-stack web & mobile app development, cloud, AI/ML, and IoT solutions in Sri Lanka',
    'revisit-after': '7 days',
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        {/* Social profile linking for SEO (React hoists these into <head>). */}
        <link rel="me" href={siteConfig.social.instagram} />
        <link rel="me" href={siteConfig.social.linkedin} />
        {children}
      </body>
    </html>
  );
}
