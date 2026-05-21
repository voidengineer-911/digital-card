import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fromPrisma } from '@/lib/types';
import { buildVCard } from '@/lib/vcard';

export const revalidate = 3600;

export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const row = await prisma.card.findUnique({ where: { slug } });
  if (!row) return new NextResponse('Not found', { status: 404 });
  const card = fromPrisma(row);
  const body = await buildVCard(card);
  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': `attachment; filename="${card.slug}.vcf"`,
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
