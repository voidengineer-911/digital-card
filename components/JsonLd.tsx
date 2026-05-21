import type { Card } from '@/data/cards/_types';

type Props = { card: Card; url: string };

function buildSchema(card: Card, url: string) {
  const c = card.en;
  const parts = c.title.split(/\s+·\s+/);
  const jobTitle = parts[0]?.trim() || c.title;
  const orgName  = parts[1]?.trim();

  const sameAs: string[] = [];
  for (const site of card.contact.websites ?? []) {
    sameAs.push(site.startsWith('http') ? site : `https://${site}`);
  }
  if (card.socials.linkedin)  sameAs.push(`https://linkedin.com/in/${card.socials.linkedin}`);
  if (card.socials.github)    sameAs.push(`https://github.com/${card.socials.github}`);
  if (card.socials.instagram) sameAs.push(`https://instagram.com/${card.socials.instagram}`);
  if (card.socials.x)         sameAs.push(`https://x.com/${card.socials.x}`);
  if (card.socials.youtube)   sameAs.push(`https://youtube.com/@${card.socials.youtube}`);
  if (card.socials.tiktok)    sameAs.push(`https://tiktok.com/@${card.socials.tiktok}`);

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: c.name,
    alternateName: card.ar.name,
    jobTitle,
    // Strip the slug path from `url` to get the site origin, then append the
    // card.photo path. Avoids duplicating the slug in the image URL
    // (e.g. `https://x/ahmad/photos/...` → `https://x/photos/...`).
    image: (() => {
      try {
        const u = new URL(url);
        return `${u.origin}${card.photo}`;
      } catch {
        return card.photo;
      }
    })(),
    url,
    email: card.contact.emails[0],
    sameAs,
  };
  if (orgName) {
    data.worksFor = { '@type': 'Organization', name: orgName };
  }
  if (card.contact.phone) {
    data.telephone = card.contact.phone;
  }
  return data;
}

// Sanitize JSON for inline script injection: escape `<` to prevent breaking out
// of the script tag with `</script>` injection. Schema.org JSON-LD never
// contains user-controlled HTML, but defense in depth.
function safeStringify(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function JsonLdPerson({ card, url }: Props) {
  const schema = buildSchema(card, url);
  return (
    <script
      type="application/ld+json"
      // Schema.org Person from server-controlled card data only. We escape `<`
      // as < to prevent any script-tag breakout. No user input flows here.
      dangerouslySetInnerHTML={{ __html: safeStringify(schema) }}
    />
  );
}
