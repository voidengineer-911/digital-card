'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { Brand } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { cardInputSchema } from '@/lib/admin-schemas';
import { deleteCardPhoto } from '@/lib/blob';

type State = { ok?: boolean; error?: string; fieldErrors?: Record<string, string> };

function parseList(s: string | null): string[] {
  if (!s) return [];
  return s.split(',').map((x) => x.trim()).filter(Boolean);
}

export async function updateCardAction(id: string, _prev: State, fd: FormData): Promise<State> {
  const raw = {
    slug: (fd.get('slug') ?? '').toString(),
    template: (fd.get('template') ?? 'lux').toString() as 'lux' | 'force',
    brand: ((fd.get('brand') ?? '').toString() || null) as 'force-ai' | 'force-media' | null,
    defaultLocale: (fd.get('defaultLocale') ?? 'en').toString() as 'en' | 'ar',
    enName: (fd.get('enName') ?? '').toString(),
    enTitle: (fd.get('enTitle') ?? '').toString(),
    arName: (fd.get('arName') ?? '').toString(),
    arTitle: (fd.get('arTitle') ?? '').toString(),
    photoUrl: (fd.get('photoUrl') ?? '').toString(),
    phone: (fd.get('phone') ?? '').toString() || null,
    phoneDisplay: (fd.get('phoneDisplay') ?? '').toString() || null,
    whatsapp: (fd.get('whatsapp') ?? '').toString() || null,
    emails: parseList(fd.get('emails')?.toString() ?? ''),
    websites: parseList(fd.get('websites')?.toString() ?? ''),
    instagram: (fd.get('instagram') ?? '').toString() || null,
    linkedin: (fd.get('linkedin') ?? '').toString() || null,
    x: (fd.get('x') ?? '').toString() || null,
    github: (fd.get('github') ?? '').toString() || null,
    youtube: (fd.get('youtube') ?? '').toString() || null,
    tiktok: (fd.get('tiktok') ?? '').toString() || null,
    copyrightYear: Number(fd.get('copyrightYear') ?? 2026),
  };

  const parsed = cardInputSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path[0]?.toString() ?? '_';
      if (!fieldErrors[k]) fieldErrors[k] = issue.message;
    }
    return { ok: false, error: 'Some fields need attention.', fieldErrors };
  }

  try {
    const brand: Brand | null = parsed.data.brand === 'force-ai' ? Brand.force_ai : parsed.data.brand === 'force-media' ? Brand.force_media : null;
    const row = { ...parsed.data, brand };
    const card = await prisma.card.update({ where: { id }, data: row });
    revalidatePath(`/${card.slug}`);
    revalidatePath('/sitemap.xml');
  } catch (e) {
    const msg = (e as { code?: string }).code === 'P2002' ? 'Slug already taken.' : 'Database error.';
    return { ok: false, error: msg };
  }
  redirect(`/admin?status=saved`);
}

export async function deleteCardAction(id: string): Promise<void> {
  const card = await prisma.card.findUnique({ where: { id }, select: { slug: true, photoUrl: true } });
  if (!card) redirect('/admin');
  await prisma.card.delete({ where: { id } });
  await deleteCardPhoto(card!.photoUrl);
  revalidatePath(`/${card!.slug}`);
  revalidatePath('/sitemap.xml');
  redirect('/admin?status=deleted');
}
