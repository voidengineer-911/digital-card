import { ImageResponse } from 'next/og';
import { prisma } from '@/lib/prisma';
import { fromPrisma } from '@/lib/types';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OG({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row = await prisma.card.findUnique({ where: { slug } });
  if (!row) return new ImageResponse(<div />, size);
  const card = fromPrisma(row);
  const c = card.en;
  const isLux = card.template === 'lux';
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: isLux ? '#FFFFFF' : '#2D1418',
        color: isLux ? '#0A0A0B' : '#ECECEC',
        fontSize: 60, fontFamily: 'serif',
      }}>
        <div style={{ fontSize: 96, fontStyle: 'italic' }}>{c.name}</div>
        <div style={{ marginTop: 16, fontSize: 28, color: isLux ? '#686A6C' : '#FF7700', textTransform: 'uppercase', letterSpacing: 4 }}>{c.title}</div>
      </div>
    ),
    size,
  );
}
