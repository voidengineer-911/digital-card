import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminHome() {
  const cards = await prisma.card.findMany({
    orderBy: { createdAt: 'asc' },
    select: { id: true, slug: true, enName: true, template: true, brand: true, photoUrl: true },
  });

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif italic text-[32px] text-ink">Cards</h1>
        <Link
          href="/admin/cards/new"
          className="h-12 px-6 rounded-pill bg-ink text-white font-semibold uppercase tracking-[0.08em] text-[12px] flex items-center"
        >+ NEW CARD</Link>
      </div>

      {cards.length === 0 ? (
        <p className="text-[14px]" style={{ color: '#686A6C' }}>No cards yet. Create the first one.</p>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-[0.12em]" style={{ color: '#686A6C' }}>
              <th className="py-3"></th>
              <th className="py-3">Slug</th>
              <th className="py-3">Name</th>
              <th className="py-3">Template</th>
              <th className="py-3"></th>
            </tr>
          </thead>
          <tbody>
            {cards.map((c) => (
              <tr key={c.id} className="border-t" style={{ borderColor: 'rgba(104,106,108,0.20)' }}>
                <td className="py-3">
                  <Image src={c.photoUrl} alt="" width={32} height={32} className="rounded-full object-cover" />
                </td>
                <td className="py-3 text-[14px] text-ink">/{c.slug}</td>
                <td className="py-3 text-[14px] text-ink">{c.enName}</td>
                <td className="py-3 text-[14px]" style={{ color: '#686A6C' }}>
                  {c.template}{c.brand ? ` · ${c.brand}` : ''}
                </td>
                <td className="py-3 text-right">
                  <Link href={`/${c.slug}`} target="_blank" className="text-[12px] mr-4" style={{ color: '#686A6C' }}>Preview</Link>
                  <Link href={`/admin/cards/${c.id}`} className="text-[12px] text-ink">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
