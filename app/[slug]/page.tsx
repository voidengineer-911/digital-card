import { notFound } from 'next/navigation';
import { getCard, listCardSlugs } from '@/data/cards';
import { CardLayout } from '@/components/CardLayout';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return listCardSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export default async function CardPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const card = getCard(slug);
  if (!card) notFound();
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.invalid';
  const url = `${base}/${card.slug}`;
  return <CardLayout card={card} url={url} />;
}
