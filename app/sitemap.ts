import type { MetadataRoute } from 'next';
import { listCardSlugs } from '@/data/cards';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const now = new Date().toISOString();
  return listCardSlugs().map((slug) => ({
    url: `${base}/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: slug === 'ahmad' ? 1.0 : 0.7,
  }));
}
