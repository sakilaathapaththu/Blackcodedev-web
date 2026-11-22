import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

const routes = [
  { path: '/', priority: 1 },
  { path: '/about', priority: 0.8 },
  { path: '/team', priority: 0.6 },
  { path: '/careers', priority: 0.7 },
  { path: '/contact', priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, priority }) => ({
    url: new URL(path, siteConfig.url).toString(),
    changeFrequency: 'monthly',
    priority,
  }));
}
