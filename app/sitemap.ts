import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  try {
    const rows = await prisma.card.findMany({ select: { slug: true, updatedAt: true } });
    return rows.map((r) => ({
      url: `${base}/${r.slug}`,
      lastModified: r.updatedAt.toISOString(),
      changeFrequency: 'monthly',
      priority: r.slug === 'ahmad' ? 1.0 : 0.7,
    }));
  } catch {
    // Local Node 25 Neon WebSocket ETIMEDOUT quirk — return empty sitemap
    return [];
  }
}
