import type { Card } from '@/lib/types';

const CRLF = '\r\n';

function escape(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

function splitName(full: string): { given: string; family: string } {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return { given: parts[0], family: '' };
  return { given: parts.slice(0, -1).join(' '), family: parts[parts.length - 1] };
}

function splitTitleOrg(title: string): { title: string; org?: string } {
  const m = title.match(/^(.*?)\s+·\s+(.+)$/);
  if (!m) return { title };
  return { title: m[1].trim(), org: m[2].trim() };
}

/**
 * Fold a long vCard line per RFC 2425/2426: CRLF + space every 75 chars.
 * The continuation space is counted as part of the next segment.
 */
function foldLine(line: string): string {
  if (line.length <= 75) return line;
  const parts: string[] = [];
  let i = 0;
  while (i < line.length) {
    parts.push((i === 0 ? '' : ' ') + line.slice(i, i + 75));
    i += 75;
  }
  return parts.join(CRLF);
}

async function fetchPhotoBase64(url: string): Promise<string | null> {
  if (!url) return null;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > 100 * 1024) return null;
    return buf.toString('base64');
  } catch {
    return null;
  }
}

export async function buildVCard(card: Card): Promise<string> {
  const { given, family } = splitName(card.en.name);
  const { title, org } = splitTitleOrg(card.en.title);
  const lines: string[] = ['BEGIN:VCARD', 'VERSION:3.0'];

  lines.push(`N:${escape(family)};${escape(given)};;;`);
  lines.push(`FN:${escape(card.en.name)}`);
  if (org)   lines.push(`ORG:${escape(org)}`);
  if (title) lines.push(`TITLE:${escape(title)}`);

  // PHOTO — fetch from Blob URL, base64-encode, fold per RFC 2425/2426
  const photoBase64 = await fetchPhotoBase64(card.photoUrl);
  if (photoBase64) {
    const line = 'PHOTO;ENCODING=b;TYPE=JPEG:' + photoBase64;
    lines.push(foldLine(line));
  }

  if (card.contact.phone) {
    lines.push(`TEL;TYPE=CELL,VOICE:${card.contact.phone}`);
  }
  for (const email of card.contact.emails) {
    lines.push(`EMAIL;TYPE=INTERNET:${escape(email)}`);
  }
  for (const site of card.contact.websites ?? []) {
    const url = site.startsWith('http') ? site : `https://${site}`;
    lines.push(`URL:${url}`);
  }

  if (card.socials.linkedin) {
    lines.push(`X-SOCIALPROFILE;TYPE=linkedin:https://linkedin.com/in/${card.socials.linkedin}`);
  }
  if (card.socials.github) {
    lines.push(`X-SOCIALPROFILE;TYPE=github:https://github.com/${card.socials.github}`);
  }
  if (card.socials.instagram) {
    lines.push(`X-SOCIALPROFILE;TYPE=instagram:https://instagram.com/${card.socials.instagram}`);
  }
  if (card.socials.x) {
    lines.push(`X-SOCIALPROFILE;TYPE=twitter:https://x.com/${card.socials.x}`);
  }
  if (card.socials.youtube) {
    lines.push(`X-SOCIALPROFILE;TYPE=youtube:https://youtube.com/@${card.socials.youtube}`);
  }
  if (card.socials.tiktok) {
    lines.push(`X-SOCIALPROFILE;TYPE=tiktok:https://tiktok.com/@${card.socials.tiktok}`);
  }

  lines.push(`NOTE:${escape(card.en.name)} · ${escape(card.ar.name)} — ${escape(card.en.title)}`);
  lines.push('END:VCARD');

  return lines.join(CRLF) + CRLF;
}
