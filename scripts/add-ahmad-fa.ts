import 'dotenv/config';
import { prisma } from '../lib/prisma';

async function main() {
  // Reuse the same photo URL from the existing Ahmad cards (uploaded to Vercel Blob during V2 seed).
  const existing = await prisma.card.findUnique({ where: { slug: 'ahmad' }, select: { photoUrl: true } });
  if (!existing) throw new Error('seed card /ahmad missing — cannot reuse photoUrl');

  const row = {
    slug: 'ahmad-fa',
    template: 'force' as const,
    brand: 'force_ai' as const,
    defaultLocale: 'en' as const,
    enName: 'Ahmad Sharaf',
    enTitle: 'Founder and CEO',
    arName: 'احمد شرف',
    arTitle: 'المؤسس والرئيس التنفيذي',
    photoUrl: existing.photoUrl,
    phone: '+96541169141',
    phoneDisplay: '+965 4116 9141',
    whatsapp: '+96541169141',
    emails: ['ahmed0montaser@gmail.com'],
    websites: ['forcemediakw.com', 'force-ai.com', 'store.forcemediakw.com'],
    instagram: null,
    linkedin: 'a7xq8',
    x: null,
    github: 'ForceAI-KW',
    youtube: null,
    tiktok: null,
    copyrightYear: 2026,
  };

  const card = await prisma.card.upsert({
    where: { slug: row.slug },
    update: row,
    create: row,
  });
  console.log(`upserted ${card.slug} → id ${card.id}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
