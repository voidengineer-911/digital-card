import { Brand } from '@prisma/client';
import type { ZodIssue } from 'zod';

export function parseList(s: string | null): string[] {
  if (!s) return [];
  return s.split(',').map((x) => x.trim()).filter(Boolean);
}

/**
 * Pull every card field off a submitted FormData and coerce it.
 *
 * This 21-field block was duplicated near-verbatim between `createCardAction`
 * and `updateCardAction` — the two copies differed only in whitespace. Adding a
 * field to the card form meant remembering to edit both; miss one and the field
 * silently never persists on that path, with no error anywhere. Create and edit
 * must read a form the same way, so they now literally do.
 *
 * The result is deliberately untyped-ish (it feeds `cardInputSchema.safeParse`)
 * — validation is the schema's job, not this function's.
 */
export function cardFormToRaw(fd: FormData) {
  const str = (k: string, fallback = '') => (fd.get(k) ?? fallback).toString();
  const nullable = (k: string) => str(k) || null;

  return {
    slug: str('slug'),
    template: str('template', 'lux') as 'lux' | 'force',
    brand: (str('brand') || null) as 'force-ai' | 'force-media' | null,
    defaultLocale: str('defaultLocale', 'en') as 'en' | 'ar',
    enName: str('enName'),
    enTitle: str('enTitle'),
    arName: str('arName'),
    arTitle: str('arTitle'),
    photoUrl: str('photoUrl'),
    phone: nullable('phone'),
    phoneDisplay: nullable('phoneDisplay'),
    whatsapp: nullable('whatsapp'),
    emails: parseList(fd.get('emails')?.toString() ?? ''),
    websites: parseList(fd.get('websites')?.toString() ?? ''),
    instagram: nullable('instagram'),
    linkedin: nullable('linkedin'),
    x: nullable('x'),
    github: nullable('github'),
    youtube: nullable('youtube'),
    tiktok: nullable('tiktok'),
    copyrightYear: Number(fd.get('copyrightYear') ?? 2026),
  };
}

/**
 * First error message per field, in the shape the admin forms render.
 * Also duplicated between the create and update actions.
 */
export function toFieldErrors(issues: ZodIssue[]): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of issues) {
    const k = issue.path[0]?.toString() ?? '_';
    if (!fieldErrors[k]) fieldErrors[k] = issue.message;
  }
  return fieldErrors;
}

/** Prisma write failures surface identically on both card write paths. */
export function cardWriteErrorMessage(e: unknown): string {
  return (e as { code?: string }).code === 'P2002' ? 'Slug already taken.' : 'Database error.';
}

export function brandEnum(s: 'force-ai' | 'force-media' | null): Brand | null {
  if (s === 'force-ai') return Brand.force_ai;
  if (s === 'force-media') return Brand.force_media;
  return null;
}
