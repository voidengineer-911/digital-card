import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { CardForm } from '@/components/admin/CardForm';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { updateCardAction, deleteCardAction } from './actions';

export default async function EditCardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await prisma.card.findUnique({ where: { id } });
  if (!row) notFound();

  const initial = {
    id: row.id,
    slug: row.slug,
    template: row.template as 'lux' | 'force',
    brand: row.brand === 'force_ai' ? 'force-ai' as const : row.brand === 'force_media' ? 'force-media' as const : null,
    defaultLocale: row.defaultLocale as 'en' | 'ar',
    enName: row.enName, enTitle: row.enTitle, arName: row.arName, arTitle: row.arTitle,
    photoUrl: row.photoUrl,
    phone: row.phone, phoneDisplay: row.phoneDisplay, whatsapp: row.whatsapp,
    emails: row.emails, websites: row.websites,
    instagram: row.instagram, linkedin: row.linkedin, x: row.x, github: row.github, youtube: row.youtube, tiktok: row.tiktok,
    copyrightYear: row.copyrightYear,
  };

  const boundUpdate = updateCardAction.bind(null, id);
  const boundDelete = deleteCardAction.bind(null, id);

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif italic text-[32px] text-ink">/{row.slug}</h1>
        <DeleteButton action={boundDelete} slug={row.slug} />
      </div>
      <CardForm initial={initial} action={boundUpdate} submitLabel="SAVE" />
    </>
  );
}
