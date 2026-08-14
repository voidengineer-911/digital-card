'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { cardInputSchema } from '@/lib/admin-schemas';
import { deleteCardPhoto } from '@/lib/blob';
import { brandEnum, cardFormToRaw, toFieldErrors, cardWriteErrorMessage } from '@/lib/form-utils';

type State = { ok?: boolean; error?: string; fieldErrors?: Record<string, string> };

export async function updateCardAction(id: string, _prev: State, fd: FormData): Promise<State> {
  const parsed = cardInputSchema.safeParse(cardFormToRaw(fd));
  if (!parsed.success) {
    return {
      ok: false,
      error: 'Some fields need attention.',
      fieldErrors: toFieldErrors(parsed.error.issues),
    };
  }

  try {
    const brand = brandEnum(parsed.data.brand);
    const row = { ...parsed.data, brand };
    const card = await prisma.card.update({ where: { id }, data: row });
    revalidatePath(`/${card.slug}`);
    revalidatePath('/sitemap.xml');
  } catch (e) {
    return { ok: false, error: cardWriteErrorMessage(e) };
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
