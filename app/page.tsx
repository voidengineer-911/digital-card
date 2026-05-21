import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function Root() {
  const first = await prisma.card.findFirst({ orderBy: { createdAt: 'asc' }, select: { slug: true } });
  redirect(first ? `/${first.slug}` : '/admin/login');
}
