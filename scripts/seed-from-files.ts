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
import { ahmad } from '../data/cards/ahmad';
import { ahmadFm } from '../data/cards/ahmad-fm';

const { Client } = pg;

async function resolveIPv4(hostname: string): Promise<string> {
  const records = await dns.resolve4(hostname);
  if (!records.length) throw new Error(`No IPv4 address for ${hostname}`);
  return records[0];
}

async function main() {
  const photoPath = path.join(process.cwd(), 'public', 'photos', 'ahmad.jpg');
  const photoBuf = await fs.readFile(photoPath);

  console.log('uploading photo to Vercel Blob...');
  const photoUrl = await uploadCardPhoto('ahmad', photoBuf, 'image/jpeg');
  console.log('photo →', photoUrl);

  // Resolve hostname to IPv4 explicitly — works around Node 25 Happy Eyeballs
  // ETIMEDOUT bug where concurrent IPv4+IPv6 attempts all time out together.
  const rawUrl = process.env.DIRECT_URL!;
  const parsed = new URL(rawUrl);
  const hostname = parsed.hostname;
  const ipv4 = await resolveIPv4(hostname);
  console.log(`resolved ${hostname} → ${ipv4}`);

  const client = new Client({
    host: ipv4,
    port: 5432,
    user: parsed.username,
    password: parsed.password,
    database: parsed.pathname.slice(1),
    ssl: {
      rejectUnauthorized: false,
      // SNI must match the Neon host for TLS to succeed when connecting by IP
      servername: hostname,
    },
    connectionTimeoutMillis: 15000,
  });

  await client.connect();
  console.log('connected to Neon via TCP');

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
