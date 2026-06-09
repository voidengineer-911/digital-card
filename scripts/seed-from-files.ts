/**
 * Seed script: migrates data/cards/*.ts records into the DB and uploads the
 * placeholder photo to Vercel Blob.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/seed-from-files.ts
 *
 * Uses the standard `pg` client (TCP/TLS, port 5432) via DIRECT_URL.
 * Connects by resolved IPv4 address with TLS SNI override to work around
 * Node 25 Happy Eyeballs timeout issue where hostname-based DNS resolution
 * causes ETIMEDOUT even when the IPs are individually reachable.
 */
import dns from 'node:dns/promises';
import fs from 'node:fs/promises';
import path from 'node:path';
import pg from 'pg';
import { uploadCardPhoto } from '../lib/blob';

// Inline card data — data/cards/ directory has been deleted after seeding.
type SeedCard = {
  slug: string; template: 'lux' | 'force'; brand?: 'force-ai' | 'force-media';
  defaultLocale: 'en' | 'ar';
  en: { name: string; title: string }; ar: { name: string; title: string };
  contact: { phone?: string; phoneDisplay?: string; whatsapp?: string; emails: string[]; websites?: string[] };
  socials: { instagram?: string; linkedin?: string; x?: string; github?: string; youtube?: string; tiktok?: string };
  copyrightYear: number;
};
const ahmad: SeedCard = {
  slug: 'ahmad', template: 'lux', defaultLocale: 'en',
  en: { name: 'Ahmad Sharaf', title: 'Founder and CEO · Force AI' },
  ar: { name: 'احمد شرف',    title: 'المؤسس والرئيس التنفيذي · فورس إيه آي' },
  contact: { phone: '+96541169141', phoneDisplay: '+965 4116 9141', whatsapp: '+96541169141', emails: ['ahmed0montaser@gmail.com'], websites: ['forcemediakw.com', 'force-ai.com', 'store.forcemediakw.com'] },
  socials: { linkedin: 'a7xq8', github: 'ForceAI-KW' },
  copyrightYear: 2026,
};
const ahmadFm: SeedCard = {
  slug: 'ahmad-fm', template: 'force', brand: 'force-media', defaultLocale: 'en',
  en: { name: 'Ahmad Sharaf', title: 'Ops Manager & AI Engineer' },
  ar: { name: 'احمد شرف',    title: 'مدير العمليات ومهندس ذكاء اصطناعي' },
  contact: { phone: '+96541169141', phoneDisplay: '+965 4116 9141', whatsapp: '+96541169141', emails: ['ahmed0montaser@gmail.com'], websites: ['forcemediakw.com', 'store.forcemediakw.com'] },
  socials: { linkedin: 'a7xq8', github: 'ForceAI-KW' },
  copyrightYear: 2026,
};

const { Client } = pg;

async function resolveIPv4(hostname: string): Promise<string> {
  const records = await dns.resolve4(hostname);
  if (!records.length) throw new Error(`No IPv4 address for ${hostname}`);
  return records[0];
}

async function main() {
  // photoUrl is NOT NULL in the schema. In prod we upload the real photo to Vercel
  // Blob; in CI / local without BLOB_READ_WRITE_TOKEN we use a placeholder (e2e asserts
  // card text, never the image src) so seeding needs no Blob credential.
  let photoUrl: string;
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const photoPath = path.join(process.cwd(), 'public', 'photos', 'ahmad.jpg');
    const photoBuf = await fs.readFile(photoPath);
    console.log('uploading photo to Vercel Blob...');
    photoUrl = await uploadCardPhoto('ahmad', photoBuf, 'image/jpeg');
    console.log('photo →', photoUrl);
  } else {
    photoUrl = process.env.SEED_PLACEHOLDER_PHOTO_URL ?? 'https://placehold.co/400x400.png';
    console.log('no BLOB_READ_WRITE_TOKEN — placeholder photo:', photoUrl);
  }

  const rawUrl = process.env.DIRECT_URL!;
  const parsed = new URL(rawUrl);
  const hostname = parsed.hostname;
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
  // Neon needs explicit IPv4 resolution (Node 25 Happy-Eyeballs ETIMEDOUT workaround)
  // + TLS-by-IP with an SNI override. A local postgres service container (CI) is plain
  // TCP — no DNS lookup, no TLS — so branch on the host.
  const host = isLocal ? hostname : await resolveIPv4(hostname);
  if (!isLocal) console.log(`resolved ${hostname} → ${host}`);

  const client = new Client({
    host,
    port: parsed.port ? Number(parsed.port) : 5432,
    user: parsed.username,
    password: parsed.password,
    database: parsed.pathname.slice(1),
    ssl: isLocal
      ? false
      : {
          rejectUnauthorized: false,
          // SNI must match the Neon host for TLS to succeed when connecting by IP
          servername: hostname,
        },
    connectionTimeoutMillis: 15000,
  });

  await client.connect();
  console.log(`connected to ${isLocal ? 'local postgres' : 'Neon'} via TCP`);

  for (const src of [ahmad, ahmadFm]) {
    const template = src.template === 'lux' ? 'lux' : 'force';
    const brand =
      src.brand === 'force-ai'
        ? 'force_ai'
        : src.brand === 'force-media'
          ? 'force_media'
          : null;

    const res = await client.query(
      `INSERT INTO "Card" (
        id, slug, template, brand, "defaultLocale",
        "enName", "enTitle", "arName", "arTitle",
        "photoUrl", phone, "phoneDisplay", whatsapp,
        emails, websites,
        instagram, linkedin, x, github, youtube, tiktok,
        "copyrightYear", "createdAt", "updatedAt"
      ) VALUES (
        gen_random_uuid()::text,
        $1, $2::"Template", $3::"Brand", $4::"Locale",
        $5, $6, $7, $8,
        $9, $10, $11, $12,
        $13, $14,
        $15, $16, $17, $18, $19, $20,
        $21, now(), now()
      )
      ON CONFLICT (slug) DO UPDATE SET
        template        = EXCLUDED.template,
        brand           = EXCLUDED.brand,
        "defaultLocale" = EXCLUDED."defaultLocale",
        "enName"        = EXCLUDED."enName",
        "enTitle"       = EXCLUDED."enTitle",
        "arName"        = EXCLUDED."arName",
        "arTitle"       = EXCLUDED."arTitle",
        "photoUrl"      = EXCLUDED."photoUrl",
        phone           = EXCLUDED.phone,
        "phoneDisplay"  = EXCLUDED."phoneDisplay",
        whatsapp        = EXCLUDED.whatsapp,
        emails          = EXCLUDED.emails,
        websites        = EXCLUDED.websites,
        instagram       = EXCLUDED.instagram,
        linkedin        = EXCLUDED.linkedin,
        x               = EXCLUDED.x,
        github          = EXCLUDED.github,
        youtube         = EXCLUDED.youtube,
        tiktok          = EXCLUDED.tiktok,
        "copyrightYear" = EXCLUDED."copyrightYear",
        "updatedAt"     = now()
      RETURNING id, slug`,
      [
        src.slug,
        template,
        brand,
        src.defaultLocale,
        src.en.name,
        src.en.title,
        src.ar.name,
        src.ar.title,
        photoUrl,
        src.contact.phone ?? null,
        src.contact.phoneDisplay ?? null,
        src.contact.whatsapp ?? null,
        src.contact.emails,
        src.contact.websites ?? [],
        src.socials.instagram ?? null,
        src.socials.linkedin ?? null,
        src.socials.x ?? null,
        src.socials.github ?? null,
        src.socials.youtube ?? null,
        src.socials.tiktok ?? null,
        src.copyrightYear,
      ],
    );
    console.log(`upserted ${res.rows[0].slug} → id ${res.rows[0].id}`);
  }

  await client.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
