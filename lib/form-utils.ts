import { Brand } from '@prisma/client';

export function parseList(s: string | null): string[] {
  if (!s) return [];
  return s.split(',').map((x) => x.trim()).filter(Boolean);
}

export function brandEnum(s: 'force-ai' | 'force-media' | null): Brand | null {
  if (s === 'force-ai') return Brand.force_ai;
  if (s === 'force-media') return Brand.force_media;
  return null;
}
