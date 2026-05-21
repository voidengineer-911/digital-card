import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { fromPrisma } from '@/lib/types';
import { CardLayout } from '@/components/CardLayout';
import { JsonLdPerson } from '@/components/JsonLd';

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const rows = await prisma.card.findMany({ select: { slug: true } });
  return rows.map((r) => ({ slug: r.slug }));
}
export const dynamicParams = false;
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const row = await prisma.card.findUnique({ where: { slug } });
  if (!row) return {};
  const card = fromPrisma(row);
  const c = card[card.defaultLocale];
  return {
    title: `${c.name} — ${c.title}`,
    description: c.title,
    openGraph: { title: c.name, description: c.title, type: 'profile' },
  };
}

export default async function CardPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const row = await prisma.card.findUnique({ where: { slug } });
  if (!row) notFound();
  const card = fromPrisma(row);
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.invalid';
  const url = `${base}/${card.slug}`;
  return (
    <>
      <JsonLdPerson card={card} url={url} />
      <CardLayout card={card} url={url} />
    </>
  );
}
