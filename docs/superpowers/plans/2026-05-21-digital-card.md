# Digital Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bilingual (AR/EN) Next.js 16 digital business card app with two visual templates (Nardo Lux for Ahmad's personal Force AI Founder card; Force Brand for Force Media / Force AI employee cards), per-card vCard download, Web Share + QR, deployable to Vercel as static SSG.

**Architecture:** Single Next.js 16 App Router project, content-as-code in `data/cards/*.ts`, static-generation via `generateStaticParams`, no DB, no auth. Each (person, brand) tuple is its own slug → its own Card record → its own URL. Brand swap is data-level. Locale is one-language-at-a-time with in-page EN ↔ AR toggle.

**Tech Stack:** Next.js 16 · TypeScript · Tailwind v4 · `qrcode` (QR client-side) · `lucide-react` (monoline icons) · `next/font/google` (Bodoni Moda + Inter) · Vitest + RTL (unit) · Playwright (e2e) · Vercel (deploy, Hobby).

**Spec:** `docs/superpowers/specs/2026-05-21-digital-card-design.md`

**Deferred from v1:** JSON-LD Person schema (SEO enhancement — sitemap + metadata cover the basics; rich-snippet schema can land in v1.1 once a sanitized JSON-LD helper component is in place).

---

## File Structure (locked at planning time)

```
digital-card/
├── app/
│   ├── [slug]/
│   │   ├── page.tsx                      # Task 12
│   │   ├── contact.vcf/route.ts          # Task 13
│   │   └── opengraph-image.tsx           # Task 15
│   ├── layout.tsx                        # Task 1 → Task 15 (fonts + metadata)
│   ├── page.tsx                          # Task 14 (root redirect)
│   ├── globals.css                       # Task 1
│   ├── robots.ts                         # Task 14
│   └── sitemap.ts                        # Task 14
├── data/
│   └── cards/
│       ├── _types.ts                     # Task 2
│       ├── ahmad.ts                      # Task 2
│       ├── ahmad-fm.ts                   # Task 2
│       └── index.ts                      # Task 2
├── components/
│   ├── CardLayout.tsx                    # Task 11
│   ├── templates/
│   │   ├── NardoLux.tsx                  # Task 9
│   │   └── ForceBrand.tsx                # Task 10
│   ├── ActionButton.tsx                  # Task 5
│   ├── SocialIconRow.tsx                 # Task 4
│   ├── LocaleToggle.tsx                  # Task 6 (client)
│   ├── ShareButton.tsx                   # Task 7 (client)
│   ├── QRModal.tsx                       # Task 8 (client)
│   └── FalconF.tsx                       # Task 4
├── public/
│   ├── photos/
│   │   └── ahmad.jpg                     # User-supplied
│   └── og/                               # populated by Next OG at build
├── lib/
│   ├── vcard.ts                          # Task 3
│   ├── i18n.ts                           # Task 2
│   └── locale-context.tsx                # Task 6 (client)
├── tests/
│   ├── setup.ts                          # Task 1
│   └── e2e/
│       ├── card-page.spec.ts             # Task 12
│       └── vcard.spec.ts                 # Task 13
├── scripts/
│   ├── rollback.sh                       # Task 18
│   └── backup-content.sh                 # Task 18
├── docs/
│   ├── ROLLBACK.md                       # Task 18
│   ├── DEPLOYMENT.md                     # Task 19
│   └── superpowers/specs/2026-05-21-digital-card-design.md
├── .github/workflows/
│   ├── ci.yml                            # Task 17
│   └── gitleaks.yml                      # Task 17
├── next.config.ts                        # Task 16
├── playwright.config.ts                  # Task 12
├── vitest.config.ts                      # Task 1
├── tsconfig.json                         # Task 1
├── tailwind.config.ts                    # Task 1, Task 15
├── package.json                          # Task 1
├── .gitignore                            # Task 1
├── .gitleaks.toml                        # Task 17
└── README.md                             # Task 19
```

---

## Task 1: Scaffold + deps + dev verification

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `vitest.config.ts`, `tests/setup.ts`, `.gitignore`

- [ ] **Step 1: Init Next.js project**

Run from `/Users/ahmadsharaf/Desktop/projects/digital-card/`:

```bash
cd /Users/ahmadsharaf/Desktop/projects/digital-card
git init
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*" \
  --eslint \
  --use-npm \
  --turbopack \
  --skip-install
```

Expected: prompts for project init in current dir; reply yes to overwrite empty dir if asked. The pre-existing `docs/` folder is preserved.

- [ ] **Step 2: Set license + install deps**

Edit `package.json`:
- Set `"license": "UNLICENSED"`
- Set `"private": true`
- Set `"name": "digital-card"`

Run:

```bash
npm install qrcode lucide-react
npm install -D @types/qrcode vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom @playwright/test
```

Expected: installs without errors. Lockfile created.

- [ ] **Step 3: Zero-vuln audit gate (rules 1 + 10)**

Run:

```bash
npm audit
```

Expected: `found 0 vulnerabilities`. If any appear, run `npm audit fix` then add `overrides` in `package.json` for any remaining; do NOT accept downgrades that change a major Next.js / React version.

- [ ] **Step 4: Configure Vitest**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
  resolve: {
    alias: { '@': '/' },
  },
});
```

Create `tests/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

Replace the `"scripts"` block in `package.json`:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:e2e": "playwright test"
}
```

- [ ] **Step 5: Tailwind tokens — custom colors + radii**

Replace `tailwind.config.ts` contents:

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Nardo Lux
        ink: '#0A0A0B',
        nardo: '#686A6C',
        // Force Brand
        wine: '#2D1418',
        'wine-elev': '#3D2128',
        orange: '#FF7700',
        'orange-hover': '#FF8A1A',
        cream: '#ECECEC',
      },
      borderRadius: {
        pill: '9999px',
      },
      letterSpacing: {
        'wider-12': '0.12em',
        'wider-15': '0.15em',
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 6: Verify dev server runs**

Run:

```bash
npm run dev
```

Open `http://localhost:3000`. Expected: default Next.js page renders. Stop with Ctrl+C.

- [ ] **Step 7: Commit (verify git author email first)**

Run:

```bash
git config user.email
# Must print: ahmed0montaser@gmail.com
# If not: git config user.email ahmed0montaser@gmail.com

git add package.json package-lock.json tsconfig.json next.config.ts tailwind.config.ts app/ vitest.config.ts tests/setup.ts .gitignore eslint.config.mjs postcss.config.mjs
git commit -m "$(cat <<'EOF'
chore: scaffold Next.js 16 digital-card project

- TypeScript, Tailwind v4, App Router, Turbopack
- vitest + RTL + jsdom for unit tests
- @playwright/test for e2e
- qrcode + lucide-react runtime deps
- license UNLICENSED, private true
- 0 npm audit vulnerabilities

Spec: docs/superpowers/specs/2026-05-21-digital-card-design.md
EOF
)"
```

---

## Task 2: Card data types + Ahmad's two cards + i18n

**Files:**
- Create: `data/cards/_types.ts`, `data/cards/ahmad.ts`, `data/cards/ahmad-fm.ts`, `data/cards/index.ts`, `lib/i18n.ts`
- Test: `lib/__tests__/i18n.test.ts`

- [ ] **Step 1: Write failing test for i18n string lookup**

Create `lib/__tests__/i18n.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { t } from '../i18n';

describe('i18n', () => {
  it('returns English string by key', () => {
    expect(t('SAVE_TO_CONTACTS', 'en')).toBe('SAVE TO CONTACTS');
  });
  it('returns Arabic string by key', () => {
    expect(t('SAVE_TO_CONTACTS', 'ar')).toBe('احفظ في جهات الاتصال');
  });
  it('returns key itself if missing', () => {
    expect(t('NON_EXISTENT_KEY' as never, 'en')).toBe('NON_EXISTENT_KEY');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- i18n
```

Expected: FAIL with `Cannot find module '../i18n'`.

- [ ] **Step 3: Create i18n module**

Create `lib/i18n.ts`:

```ts
export type Locale = 'en' | 'ar';

const STRINGS = {
  SAVE_TO_CONTACTS: { en: 'SAVE TO CONTACTS',  ar: 'احفظ في جهات الاتصال' },
  CALL:             { en: 'Call',              ar: 'اتصال' },
  WHATSAPP:         { en: 'WhatsApp',          ar: 'واتساب' },
  SEND_SMS:         { en: 'Send SMS',          ar: 'رسالة نصية' },
  SHARE:            { en: 'SHARE',             ar: 'مشاركة' },
  QR_CODE:          { en: 'QR CODE',           ar: 'رمز QR' },
  BY_FORCE_AI:      { en: 'BY FORCE AI',       ar: 'بواسطة فورس إيه آي' },
  BY_FORCE_MEDIA:   { en: 'BY FORCE MEDIA',    ar: 'بواسطة فورس ميديا' },
  CLOSE:            { en: 'Close',             ar: 'إغلاق' },
} as const;

export type StringKey = keyof typeof STRINGS;

export function t(key: StringKey, locale: Locale): string {
  const entry = STRINGS[key];
  if (!entry) return key;
  return entry[locale];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
npm test -- i18n
```

Expected: 3 passed.

- [ ] **Step 5: Write Card type definitions**

Create `data/cards/_types.ts`:

```ts
import type { Locale } from '@/lib/i18n';

export type Template = 'lux' | 'force';
export type Brand = 'force-ai' | 'force-media';

export interface CardContact {
  phone?: string;
  phoneDisplay?: string;
  whatsapp?: string;
  emails: string[];
  websites?: string[];
}

export interface CardSocials {
  instagram?: string;
  linkedin?: string;
  x?: string;
  github?: string;
  youtube?: string;
  tiktok?: string;
}

export interface CardI18n {
  name: string;
  title: string;
}

export interface Card {
  slug: string;
  template: Template;
  brand?: Brand;
  defaultLocale: Locale;
  en: CardI18n;
  ar: CardI18n;
  photo: string;
  contact: CardContact;
  socials: CardSocials;
  copyrightYear: number;
}
```

- [ ] **Step 6: Write Ahmad's two card records**

Create `data/cards/ahmad.ts`:

```ts
import type { Card } from './_types';

export const ahmad: Card = {
  slug: 'ahmad',
  template: 'lux',
  defaultLocale: 'en',
  en: { name: 'Ahmad Sharaf', title: 'Founder and CEO · Force AI' },
  ar: { name: 'احمد شرف',    title: 'المؤسس والرئيس التنفيذي · فورس إيه آي' },
  photo: '/photos/ahmad.jpg',
  contact: {
    phone:        '+96541169141',
    phoneDisplay: '+965 4116 9141',
    whatsapp:     '+96541169141',
    emails:       ['ahmed0montaser@gmail.com'],
    websites:     ['forcemediakw.com', 'force-ai.com', 'store.forcemediakw.com'],
  },
  socials: {
    linkedin: 'a7xq8',
    github:   'ForceAI-KW',
  },
  copyrightYear: 2026,
};
```

Create `data/cards/ahmad-fm.ts`:

```ts
import type { Card } from './_types';

export const ahmadFm: Card = {
  slug: 'ahmad-fm',
  template: 'force',
  brand: 'force-media',
  defaultLocale: 'en',
  en: { name: 'Ahmad Sharaf', title: 'Ops Manager & AI Engineer' },
  ar: { name: 'احمد شرف',    title: 'مدير العمليات ومهندس ذكاء اصطناعي' },
  photo: '/photos/ahmad.jpg',
  contact: {
    phone:        '+96541169141',
    phoneDisplay: '+965 4116 9141',
    whatsapp:     '+96541169141',
    emails:       ['ahmed0montaser@gmail.com'],
    websites:     ['forcemediakw.com', 'store.forcemediakw.com'],
  },
  socials: {
    linkedin: 'a7xq8',
    github:   'ForceAI-KW',
  },
  copyrightYear: 2026,
};
```

Create `data/cards/index.ts`:

```ts
import type { Card } from './_types';
import { ahmad } from './ahmad';
import { ahmadFm } from './ahmad-fm';

export const cards: Record<string, Card> = {
  [ahmad.slug]:   ahmad,
  [ahmadFm.slug]: ahmadFm,
};

export function getCard(slug: string): Card | undefined {
  return cards[slug];
}

export function listCardSlugs(): string[] {
  return Object.keys(cards);
}
```

- [ ] **Step 7: Type-check**

Run:

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 8: Commit**

```bash
git add data/ lib/i18n.ts lib/__tests__/i18n.test.ts
git commit -m "feat: card data types + Ahmad's two cards + i18n strings"
```

---

## Task 3: vCard 3.0 builder

**Files:**
- Create: `lib/vcard.ts`
- Test: `lib/__tests__/vcard.test.ts`

- [ ] **Step 1: Write failing test**

Create `lib/__tests__/vcard.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { buildVCard } from '../vcard';
import { ahmad } from '@/data/cards/ahmad';

describe('buildVCard', () => {
  it('emits VERSION 3.0', () => {
    expect(buildVCard(ahmad)).toContain('VERSION:3.0');
  });
  it('emits FN with English name', () => {
    expect(buildVCard(ahmad)).toContain('FN:Ahmad Sharaf');
  });
  it('emits N with family;given form', () => {
    expect(buildVCard(ahmad)).toMatch(/^N:Sharaf;Ahmad;;;$/m);
  });
  it('emits TEL with intl phone', () => {
    expect(buildVCard(ahmad)).toContain('TEL;TYPE=CELL,VOICE:+96541169141');
  });
  it('emits each EMAIL', () => {
    expect(buildVCard(ahmad)).toContain('EMAIL;TYPE=INTERNET:ahmed0montaser@gmail.com');
  });
  it('emits a URL line per website', () => {
    const v = buildVCard(ahmad);
    expect(v).toContain('URL:https://forcemediakw.com');
    expect(v).toContain('URL:https://force-ai.com');
    expect(v).toContain('URL:https://store.forcemediakw.com');
  });
  it('emits NOTE with bilingual name + title', () => {
    expect(buildVCard(ahmad)).toMatch(/NOTE:Ahmad Sharaf · احمد شرف/);
  });
  it('emits ORG and TITLE split from " · " separator', () => {
    const v = buildVCard(ahmad);
    expect(v).toContain('ORG:Force AI');
    expect(v).toContain('TITLE:Founder and CEO');
  });
  it('uses CRLF line endings', () => {
    expect(buildVCard(ahmad)).toContain('\r\n');
  });
  it('starts with BEGIN:VCARD and ends with END:VCARD', () => {
    const v = buildVCard(ahmad);
    expect(v.startsWith('BEGIN:VCARD\r\n')).toBe(true);
    expect(v.trimEnd().endsWith('END:VCARD')).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- vcard
```

Expected: FAIL — `Cannot find module '../vcard'`.

- [ ] **Step 3: Implement vCard builder**

Create `lib/vcard.ts`:

```ts
import type { Card } from '@/data/cards/_types';

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

export function buildVCard(card: Card): string {
  const { given, family } = splitName(card.en.name);
  const { title, org } = splitTitleOrg(card.en.title);
  const lines: string[] = ['BEGIN:VCARD', 'VERSION:3.0'];

  lines.push(`N:${escape(family)};${escape(given)};;;`);
  lines.push(`FN:${escape(card.en.name)}`);
  if (org)   lines.push(`ORG:${escape(org)}`);
  if (title) lines.push(`TITLE:${escape(title)}`);

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
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
npm test -- vcard
```

Expected: all assertions pass.

- [ ] **Step 5: Commit**

```bash
git add lib/vcard.ts lib/__tests__/vcard.test.ts
git commit -m "feat: vCard 3.0 builder with bilingual NOTE field"
```

---

## Task 4: FalconF SVG + SocialIconRow

**Files:**
- Create: `components/FalconF.tsx`, `components/SocialIconRow.tsx`
- Test: `components/__tests__/SocialIconRow.test.tsx`

- [ ] **Step 1: Write failing component test**

Create `components/__tests__/SocialIconRow.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { SocialIconRow } from '../SocialIconRow';

describe('SocialIconRow', () => {
  it('renders nothing when no socials', () => {
    const { container } = render(<SocialIconRow socials={{}} color="#686A6C" />);
    expect(container.firstChild).toBeNull();
  });
  it('renders one link per present social key', () => {
    const { container } = render(
      <SocialIconRow socials={{ linkedin: 'a7xq8', github: 'ForceAI-KW' }} color="#686A6C" />
    );
    const links = container.querySelectorAll('a');
    expect(links).toHaveLength(2);
    expect(links[0].getAttribute('href')).toBe('https://linkedin.com/in/a7xq8');
    expect(links[1].getAttribute('href')).toBe('https://github.com/ForceAI-KW');
  });
  it('skips empty-string handles', () => {
    const { container } = render(
      <SocialIconRow socials={{ linkedin: '', github: 'ForceAI-KW' }} color="#686A6C" />
    );
    expect(container.querySelectorAll('a')).toHaveLength(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- SocialIconRow
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement FalconF**

Create `components/FalconF.tsx`:

```tsx
type Props = { size?: number; color?: string; className?: string };

// Placeholder F-mark — minimalist sharp triangular F. Swap with the real
// Force falcon-F SVG once Ahmad supplies it under public/brand/falcon-f.svg.
export function FalconF({ size = 28, color = '#FF7700', className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M6 4 L26 4 L20 12 L12 12 L12 18 L22 18 L18 24 L12 24 L12 28 L6 28 Z"
        fill={color}
      />
    </svg>
  );
}
```

- [ ] **Step 4: Implement SocialIconRow**

Create `components/SocialIconRow.tsx`:

```tsx
import { Instagram, Linkedin, Github, Youtube } from 'lucide-react';
import type { CardSocials } from '@/data/cards/_types';

type Props = { socials: CardSocials; color: string };

function XIcon({ size = 22, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M17.53 3H20.5L13.93 10.49L21.66 21H15.62L10.86 14.59L5.46 21H2.49L9.49 12.99L2.08 3H8.28L12.55 8.84L17.53 3Z"
        stroke={color}
        strokeWidth="1.5"
      />
    </svg>
  );
}

function TikTokIcon({ size = 22, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V9.18a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.79 4.79 0 0 1-1.84-.61Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SocialIconRow({ socials, color }: Props) {
  const items: Array<{ href: string; label: string; icon: React.ReactNode }> = [];

  if (socials.instagram) items.push({
    href: `https://instagram.com/${socials.instagram}`,
    label: 'Instagram',
    icon: <Instagram size={22} strokeWidth={1.5} color={color} />,
  });
  if (socials.linkedin) items.push({
    href: `https://linkedin.com/in/${socials.linkedin}`,
    label: 'LinkedIn',
    icon: <Linkedin size={22} strokeWidth={1.5} color={color} />,
  });
  if (socials.x) items.push({
    href: `https://x.com/${socials.x}`,
    label: 'X',
    icon: <XIcon color={color} />,
  });
  if (socials.github) items.push({
    href: `https://github.com/${socials.github}`,
    label: 'GitHub',
    icon: <Github size={22} strokeWidth={1.5} color={color} />,
  });
  if (socials.youtube) items.push({
    href: `https://youtube.com/@${socials.youtube}`,
    label: 'YouTube',
    icon: <Youtube size={22} strokeWidth={1.5} color={color} />,
  });
  if (socials.tiktok) items.push({
    href: `https://tiktok.com/@${socials.tiktok}`,
    label: 'TikTok',
    icon: <TikTokIcon color={color} />,
  });

  if (items.length === 0) return null;

  return (
    <div className="flex items-center justify-center gap-7" role="list">
      {items.map((it) => (
        <a
          key={it.href}
          href={it.href}
          aria-label={it.label}
          target="_blank"
          rel="noopener noreferrer"
          role="listitem"
          className="transition-transform active:scale-95"
        >
          {it.icon}
        </a>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run:

```bash
npm test -- SocialIconRow
```

Expected: 3 passed.

- [ ] **Step 6: Commit**

```bash
git add components/FalconF.tsx components/SocialIconRow.tsx components/__tests__/SocialIconRow.test.tsx
git commit -m "feat: FalconF mark + SocialIconRow (skips empty, opens new tab)"
```

---

## Task 5: ActionButton (pill)

**Files:**
- Create: `components/ActionButton.tsx`
- Test: `components/__tests__/ActionButton.test.tsx`

- [ ] **Step 1: Write failing test**

Create `components/__tests__/ActionButton.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ActionButton } from '../ActionButton';

describe('ActionButton', () => {
  it('renders label text', () => {
    render(<ActionButton variant="primary" template="lux" label="SAVE TO CONTACTS" href="#" />);
    expect(screen.getByText('SAVE TO CONTACTS')).toBeInTheDocument();
  });
  it('renders as <a> when href provided', () => {
    render(<ActionButton variant="secondary" template="lux" label="Call" href="tel:+96541169141" />);
    const link = screen.getByRole('link', { name: /call/i });
    expect(link).toHaveAttribute('href', 'tel:+96541169141');
  });
  it('renders as <button> when onClick provided', () => {
    render(<ActionButton variant="secondary" template="lux" label="Share" onClick={() => {}} />);
    expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument();
  });
  it('has rounded-pill class', () => {
    const { container } = render(<ActionButton variant="primary" template="lux" label="X" href="#" />);
    expect(container.firstChild).toHaveClass('rounded-pill');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- ActionButton
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement ActionButton**

Create `components/ActionButton.tsx`:

```tsx
import React from 'react';
import type { Template } from '@/data/cards/_types';

type Variant = 'primary' | 'secondary' | 'small';

type CommonProps = {
  variant: Variant;
  template: Template;
  label: string;
  icon?: React.ReactNode;
  className?: string;
};

type LinkProps  = CommonProps & { href: string; onClick?: never };
type BtnProps   = CommonProps & { onClick: () => void; href?: never };
type Props      = LinkProps | BtnProps;

const STYLES: Record<Template, Record<Variant, string>> = {
  lux: {
    primary:   'h-14 bg-ink text-white font-semibold uppercase tracking-wider-12 text-[14px]',
    secondary: 'h-14 bg-[rgba(104,106,108,0.02)] border border-ink text-ink font-medium text-[14px]',
    small:     'h-12 bg-[rgba(104,106,108,0.02)] border border-ink text-ink font-medium uppercase tracking-[0.08em] text-[13px]',
  },
  force: {
    primary:   'h-14 bg-orange text-wine font-bold uppercase tracking-wider-12 text-[14px] hover:bg-orange-hover',
    secondary: 'h-14 bg-transparent border border-orange text-cream font-medium text-[14px] hover:bg-wine-elev/60',
    small:     'h-12 bg-transparent border border-cream/30 text-cream font-medium uppercase tracking-[0.08em] text-[13px]',
  },
};

export function ActionButton(props: Props) {
  const { variant, template, label, icon, className = '' } = props;
  const cls = `w-full rounded-pill flex items-center justify-center gap-3 px-6 transition-all duration-[180ms] ease-in-out active:scale-[0.98] ${STYLES[template][variant]} ${className}`;

  const content = (
    <>
      {icon ? <span className="shrink-0">{icon}</span> : null}
      <span className="leading-none">{label}</span>
    </>
  );

  if ('href' in props && props.href) {
    return <a href={props.href} className={cls} aria-label={label}>{content}</a>;
  }
  return <button type="button" onClick={props.onClick} className={cls} aria-label={label}>{content}</button>;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
npm test -- ActionButton
```

Expected: 4 passed.

- [ ] **Step 5: Commit**

```bash
git add components/ActionButton.tsx components/__tests__/ActionButton.test.tsx
git commit -m "feat: ActionButton pill (primary/secondary/small, lux/force variants)"
```

---

## Task 6: LocaleToggle + LocaleContext (client)

**Files:**
- Create: `lib/locale-context.tsx`, `components/LocaleToggle.tsx`
- Test: `components/__tests__/LocaleToggle.test.tsx`

- [ ] **Step 1: Write failing test**

Create `components/__tests__/LocaleToggle.test.tsx`:

```tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LocaleProvider } from '@/lib/locale-context';
import { LocaleToggle } from '../LocaleToggle';

describe('LocaleToggle', () => {
  beforeEach(() => {
    document.documentElement.lang = 'en';
    document.documentElement.dir  = 'ltr';
  });

  it('renders EN active when initial=en', () => {
    render(<LocaleProvider initial="en"><LocaleToggle /></LocaleProvider>);
    expect(screen.getByText('EN')).toHaveAttribute('data-active', 'true');
    expect(screen.getByText('AR')).toHaveAttribute('data-active', 'false');
  });
  it('switches to AR on click and updates <html dir/lang>', () => {
    render(<LocaleProvider initial="en"><LocaleToggle /></LocaleProvider>);
    fireEvent.click(screen.getByText('AR'));
    expect(screen.getByText('AR')).toHaveAttribute('data-active', 'true');
    expect(document.documentElement.lang).toBe('ar');
    expect(document.documentElement.dir).toBe('rtl');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- LocaleToggle
```

Expected: FAIL — modules not found.

- [ ] **Step 3: Implement LocaleContext**

Create `lib/locale-context.tsx`:

```tsx
'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Locale } from './i18n';

type Ctx = { locale: Locale; setLocale: (l: Locale) => void };
const LocaleCtx = createContext<Ctx | null>(null);

export function LocaleProvider({ initial, children }: { initial: Locale; children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initial);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir  = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  return <LocaleCtx.Provider value={{ locale, setLocale: setLocaleState }}>{children}</LocaleCtx.Provider>;
}

export function useLocale(): Ctx {
  const ctx = useContext(LocaleCtx);
  if (!ctx) throw new Error('useLocale must be used inside LocaleProvider');
  return ctx;
}
```

- [ ] **Step 4: Implement LocaleToggle**

Create `components/LocaleToggle.tsx`:

```tsx
'use client';
import { useLocale } from '@/lib/locale-context';

type Props = { activeColor?: string; inactiveColor?: string };

export function LocaleToggle({ activeColor = '#0A0A0B', inactiveColor = '#686A6C' }: Props) {
  const { locale, setLocale } = useLocale();

  const cell = (l: 'en' | 'ar') => (
    <button
      key={l}
      type="button"
      onClick={() => setLocale(l)}
      data-active={locale === l}
      className="text-[12px] font-medium uppercase tracking-[0.1em] transition-colors"
      style={{ color: locale === l ? activeColor : inactiveColor }}
      aria-label={l === 'en' ? 'Switch to English' : 'Switch to Arabic'}
    >
      {l.toUpperCase()}
    </button>
  );

  return (
    <div className="flex items-center gap-2">
      {cell('en')}
      <span style={{ color: inactiveColor }}>|</span>
      {cell('ar')}
    </div>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run:

```bash
npm test -- LocaleToggle
```

Expected: 2 passed.

- [ ] **Step 6: Commit**

```bash
git add lib/locale-context.tsx components/LocaleToggle.tsx components/__tests__/LocaleToggle.test.tsx
git commit -m "feat: LocaleToggle + LocaleContext (updates <html lang/dir>)"
```

---

## Task 7: ShareButton (client)

**Files:**
- Create: `components/ShareButton.tsx`
- Test: `components/__tests__/ShareButton.test.tsx`

- [ ] **Step 1: Write failing test**

Create `components/__tests__/ShareButton.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ShareButton } from '../ShareButton';

describe('ShareButton', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'share', { value: undefined, configurable: true, writable: true });
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });
  });
  it('calls navigator.share when available', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', { value: share, configurable: true });
    render(<ShareButton url="https://card.example/ahmad" title="Ahmad Sharaf" template="lux" />);
    fireEvent.click(screen.getByRole('button', { name: /share/i }));
    await Promise.resolve();
    expect(share).toHaveBeenCalledWith({ url: 'https://card.example/ahmad', title: 'Ahmad Sharaf' });
  });
  it('falls back to clipboard when share unavailable', async () => {
    render(<ShareButton url="https://card.example/ahmad" title="Ahmad Sharaf" template="lux" />);
    fireEvent.click(screen.getByRole('button', { name: /share/i }));
    await Promise.resolve();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://card.example/ahmad');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- ShareButton
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement ShareButton**

Create `components/ShareButton.tsx`:

```tsx
'use client';
import { useState } from 'react';
import { Share2 } from 'lucide-react';
import { ActionButton } from './ActionButton';
import type { Template } from '@/data/cards/_types';

type Props = { url: string; title: string; template: Template; label?: string };

export function ShareButton({ url, title, template, label = 'SHARE' }: Props) {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    if (typeof navigator !== 'undefined' && (navigator as Navigator & { share?: (data: ShareData) => Promise<void> }).share) {
      try {
        await navigator.share({ url, title });
        return;
      } catch {
        /* user cancelled — fall through to clipboard */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — no-op */
    }
  };

  return (
    <ActionButton
      variant="small"
      template={template}
      label={copied ? 'COPIED' : label}
      icon={<Share2 size={18} strokeWidth={1.5} />}
      onClick={onClick}
    />
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
npm test -- ShareButton
```

Expected: 2 passed.

- [ ] **Step 5: Commit**

```bash
git add components/ShareButton.tsx components/__tests__/ShareButton.test.tsx
git commit -m "feat: ShareButton — navigator.share with clipboard fallback"
```

---

## Task 8: QRModal (client, lazy qrcode)

**Files:**
- Create: `components/QRModal.tsx`
- Test: `components/__tests__/QRModal.test.tsx`

- [ ] **Step 1: Write failing test**

Create `components/__tests__/QRModal.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QRModal } from '../QRModal';

describe('QRModal', () => {
  it('opens when trigger clicked', () => {
    render(<QRModal url="https://example.com" template="lux" />);
    expect(screen.queryByRole('dialog')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /qr code/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
  it('closes on Escape', () => {
    render(<QRModal url="https://example.com" template="lux" />);
    fireEvent.click(screen.getByRole('button', { name: /qr code/i }));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- QRModal
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement QRModal**

Create `components/QRModal.tsx`:

```tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { QrCode, X } from 'lucide-react';
import { ActionButton } from './ActionButton';
import type { Template } from '@/data/cards/_types';

type Props = { url: string; template: Template; label?: string };

export function QRModal({ url, template, label = 'QR CODE' }: Props) {
  const [open, setOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (!open || !canvasRef.current) return;
    let cancelled = false;
    import('qrcode').then((QR) => {
      if (cancelled || !canvasRef.current) return;
      QR.toCanvas(canvasRef.current, url, { width: 240, margin: 1, color: { dark: '#0A0A0B', light: '#FFFFFF' } });
    });
    return () => { cancelled = true; };
  }, [open, url]);

  return (
    <>
      <ActionButton
        variant="small"
        template={template}
        label={label}
        icon={<QrCode size={18} strokeWidth={1.5} />}
        onClick={() => setOpen(true)}
      />
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="QR code for this card"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-[12px] flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <canvas ref={canvasRef} />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="text-[#0A0A0B] hover:opacity-70"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
npm test -- QRModal
```

Expected: 2 passed.

- [ ] **Step 5: Commit**

```bash
git add components/QRModal.tsx components/__tests__/QRModal.test.tsx
git commit -m "feat: QRModal — lazy qrcode, Escape closes, backdrop click closes"
```

---

## Task 9: NardoLux template (client, reads locale from context)

**Files:**
- Create: `components/templates/NardoLux.tsx`

- [ ] **Step 1: Implement NardoLux**

Create `components/templates/NardoLux.tsx`:

```tsx
'use client';
import Image from 'next/image';
import { Phone, MessageCircle, Mail, MessageSquare, Download } from 'lucide-react';
import type { Card } from '@/data/cards/_types';
import { ActionButton } from '@/components/ActionButton';
import { SocialIconRow } from '@/components/SocialIconRow';
import { LocaleToggle } from '@/components/LocaleToggle';
import { ShareButton } from '@/components/ShareButton';
import { QRModal } from '@/components/QRModal';
import { t } from '@/lib/i18n';
import { useLocale } from '@/lib/locale-context';

const NARDO = '#686A6C';

type Props = { card: Card; url: string };

export function NardoLux({ card, url }: Props) {
  const { locale } = useLocale();
  const c = card[locale];
  const tel = card.contact.phone ?? '';
  const wa  = card.contact.whatsapp ?? card.contact.phone ?? '';
  const email = card.contact.emails[0] ?? '';

  return (
    <div className="bg-white min-h-screen">
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] h-16 bg-white border-b flex justify-between items-center px-4 z-50"
              style={{ borderBottomColor: 'rgba(104,106,108,0.25)' }}>
        <span className="text-[12px] font-semibold uppercase tracking-wider-15" style={{ color: NARDO }}>
          FORCE AI
        </span>
        <LocaleToggle />
      </header>

      <main className="max-w-[420px] mx-auto px-4 pt-32 pb-16 flex flex-col items-center">
        <div className="relative w-24 h-24 mb-6 rounded-full overflow-hidden"
             style={{ backgroundColor: 'rgba(104,106,108,0.06)', border: `1.5px solid ${NARDO}` }}>
          <Image
            src={card.photo}
            alt={c.name}
            width={96}
            height={96}
            className="w-full h-full object-cover"
            priority
          />
        </div>

        <h1 className="font-serif italic text-[48px] leading-[1.05] tracking-[-0.02em] text-ink mb-2 text-center">
          {c.name}
        </h1>
        <p className="font-medium text-[12px] uppercase mb-8 text-center" style={{ color: NARDO, letterSpacing: '0.12em' }}>
          {c.title}
        </p>

        <div className="w-full mb-3">
          <ActionButton
            variant="primary"
            template="lux"
            label={t('SAVE_TO_CONTACTS', locale)}
            icon={<Download size={20} strokeWidth={1.5} />}
            href={`/${card.slug}/contact.vcf`}
          />
        </div>

        <div className="w-full flex flex-col gap-3 mb-10">
          {tel && (
            <ActionButton variant="secondary" template="lux"
              label={`${t('CALL', locale)} ${card.contact.phoneDisplay ?? tel}`}
              icon={<Phone size={20} strokeWidth={1.5} />}
              href={`tel:${tel}`} />
          )}
          {wa && (
            <ActionButton variant="secondary" template="lux"
              label={t('WHATSAPP', locale)}
              icon={<MessageCircle size={20} strokeWidth={1.5} />}
              href={`https://wa.me/${wa.replace(/\D/g, '')}`} />
          )}
          {email && (
            <ActionButton variant="secondary" template="lux"
              label={email}
              icon={<Mail size={20} strokeWidth={1.5} />}
              href={`mailto:${email}`} />
          )}
          {tel && (
            <ActionButton variant="secondary" template="lux"
              label={t('SEND_SMS', locale)}
              icon={<MessageSquare size={20} strokeWidth={1.5} />}
              href={`sms:${tel}`} />
          )}
        </div>

        <hr className="w-[88%] border-0 h-px mb-8" style={{ backgroundColor: 'rgba(104,106,108,0.40)' }} />

        <div className="mb-10">
          <SocialIconRow socials={card.socials} color={NARDO} />
        </div>

        <div className="w-full grid grid-cols-2 gap-3 mb-12">
          <ShareButton url={url} title={c.name} template="lux" label={t('SHARE', locale)} />
          <QRModal url={url} template="lux" label={t('QR_CODE', locale)} />
        </div>

        <footer className="flex flex-col items-center gap-1 text-[11px]" style={{ color: NARDO }}>
          <span>© {card.copyrightYear} {c.name}</span>
          <span className="text-[10px] font-medium uppercase tracking-wider-15">{t('BY_FORCE_AI', locale)}</span>
        </footer>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

Run:

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/templates/NardoLux.tsx
git commit -m "feat: NardoLux template — luxury white/black/nardo grey layout"
```

---

## Task 10: ForceBrand template (client, reads locale from context)

**Files:**
- Create: `components/templates/ForceBrand.tsx`

- [ ] **Step 1: Implement ForceBrand**

Create `components/templates/ForceBrand.tsx`:

```tsx
'use client';
import Image from 'next/image';
import { Phone, MessageCircle, Mail, MessageSquare, Download } from 'lucide-react';
import type { Card } from '@/data/cards/_types';
import { ActionButton } from '@/components/ActionButton';
import { SocialIconRow } from '@/components/SocialIconRow';
import { LocaleToggle } from '@/components/LocaleToggle';
import { ShareButton } from '@/components/ShareButton';
import { QRModal } from '@/components/QRModal';
import { FalconF } from '@/components/FalconF';
import { t } from '@/lib/i18n';
import { useLocale } from '@/lib/locale-context';

const ORANGE = '#FF7700';
const CREAM  = '#ECECEC';

const BRAND_LABEL = {
  'force-ai':    { wordmark: 'FORCE AI',    footerOrg: 'Force AI · Kuwait',    by: 'BY_FORCE_AI'    as const },
  'force-media': { wordmark: 'FORCE MEDIA', footerOrg: 'Force Media · Kuwait', by: 'BY_FORCE_MEDIA' as const },
};

type Props = { card: Card; url: string };

export function ForceBrand({ card, url }: Props) {
  if (!card.brand) throw new Error(`ForceBrand template requires card.brand; slug=${card.slug}`);
  const { locale } = useLocale();
  const c = card[locale];
  const brand = BRAND_LABEL[card.brand];
  const tel = card.contact.phone ?? '';
  const wa  = card.contact.whatsapp ?? card.contact.phone ?? '';
  const email = card.contact.emails[0] ?? '';

  return (
    <div className="bg-wine min-h-screen">
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] h-16 bg-wine flex justify-end items-center px-4 z-50">
        <LocaleToggle activeColor={CREAM} inactiveColor="rgba(236,236,236,0.5)" />
      </header>

      <main className="max-w-[420px] mx-auto px-4 pt-24 pb-16 flex flex-col items-center">
        <div className="flex flex-col items-center gap-1 mb-8">
          <FalconF size={28} color={ORANGE} />
          <span className="text-[12px] font-semibold uppercase tracking-wider-15" style={{ color: ORANGE }}>
            {brand.wordmark}
          </span>
        </div>

        <div className="relative w-24 h-24 mb-6 rounded-[12px] overflow-hidden" style={{ border: `2px solid ${ORANGE}` }}>
          <Image
            src={card.photo}
            alt={c.name}
            width={96}
            height={96}
            className="w-full h-full object-cover"
            priority
          />
        </div>

        <h1 className="font-sans font-bold text-[36px] leading-[1.05] tracking-[-0.01em] mb-2 text-center" style={{ color: CREAM }}>
          {c.name}
        </h1>
        <p className="font-medium text-[14px] uppercase mb-8 text-center" style={{ color: ORANGE, letterSpacing: '0.1em' }}>
          {c.title}
        </p>

        <div className="w-full mb-3">
          <ActionButton
            variant="primary"
            template="force"
            label={t('SAVE_TO_CONTACTS', locale)}
            icon={<Download size={20} strokeWidth={1.5} color="#2D1418" />}
            href={`/${card.slug}/contact.vcf`}
          />
        </div>

        <div className="w-full flex flex-col gap-3 mb-10">
          {tel && (
            <ActionButton variant="secondary" template="force"
              label={`${t('CALL', locale)} ${card.contact.phoneDisplay ?? tel}`}
              icon={<Phone size={20} strokeWidth={1.5} color={ORANGE} />}
              href={`tel:${tel}`} />
          )}
          {wa && (
            <ActionButton variant="secondary" template="force"
              label={t('WHATSAPP', locale)}
              icon={<MessageCircle size={20} strokeWidth={1.5} color={ORANGE} />}
              href={`https://wa.me/${wa.replace(/\D/g, '')}`} />
          )}
          {email && (
            <ActionButton variant="secondary" template="force"
              label={email}
              icon={<Mail size={20} strokeWidth={1.5} color={ORANGE} />}
              href={`mailto:${email}`} />
          )}
          {tel && (
            <ActionButton variant="secondary" template="force"
              label={t('SEND_SMS', locale)}
              icon={<MessageSquare size={20} strokeWidth={1.5} color={ORANGE} />}
              href={`sms:${tel}`} />
          )}
        </div>

        <hr className="w-[88%] border-0 h-px mb-8" style={{ backgroundColor: 'rgba(236,236,236,0.30)' }} />

        <div className="mb-10">
          <SocialIconRow socials={card.socials} color={CREAM} />
        </div>

        <div className="w-full grid grid-cols-2 gap-3 mb-12">
          <ShareButton url={url} title={c.name} template="force" label={t('SHARE', locale)} />
          <QRModal url={url} template="force" label={t('QR_CODE', locale)} />
        </div>

        <footer className="text-[11px] text-center" style={{ color: 'rgba(236,236,236,0.6)' }}>
          © {card.copyrightYear} {brand.footerOrg}
        </footer>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

Run:

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/templates/ForceBrand.tsx
git commit -m "feat: ForceBrand template — wine/orange/cream + brand wordmark swap"
```

---

## Task 11: CardLayout switcher

**Files:**
- Create: `components/CardLayout.tsx`
- Test: `components/__tests__/CardLayout.test.tsx`

- [ ] **Step 1: Write failing test**

Create `components/__tests__/CardLayout.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { CardLayout } from '../CardLayout';
import { ahmad } from '@/data/cards/ahmad';
import { ahmadFm } from '@/data/cards/ahmad-fm';

describe('CardLayout', () => {
  it('renders Luxury layout for template=lux (white background)', () => {
    const { container } = render(<CardLayout card={ahmad} url="https://x/ahmad" />);
    expect(container.querySelector('.bg-white')).toBeTruthy();
  });
  it('renders Force layout for template=force (wine background)', () => {
    const { container } = render(<CardLayout card={ahmadFm} url="https://x/ahmad-fm" />);
    expect(container.querySelector('.bg-wine')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- CardLayout
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement CardLayout**

Create `components/CardLayout.tsx`:

```tsx
import type { Card } from '@/data/cards/_types';
import { NardoLux } from './templates/NardoLux';
import { ForceBrand } from './templates/ForceBrand';
import { LocaleProvider } from '@/lib/locale-context';

type Props = { card: Card; url: string };

export function CardLayout({ card, url }: Props) {
  return (
    <LocaleProvider initial={card.defaultLocale}>
      {card.template === 'lux'
        ? <NardoLux   card={card} url={url} />
        : <ForceBrand card={card} url={url} />}
    </LocaleProvider>
  );
}
```

- [ ] **Step 4: Run all tests**

Run:

```bash
npm test
```

Expected: all green.

- [ ] **Step 5: Commit**

```bash
git add components/CardLayout.tsx components/__tests__/CardLayout.test.tsx
git commit -m "feat: CardLayout switcher (lux vs force) under LocaleProvider"
```

---

## Task 12: Card page route + SSG

**Files:**
- Create: `app/[slug]/page.tsx`, `playwright.config.ts`, `tests/e2e/card-page.spec.ts`

- [ ] **Step 1: Configure Playwright**

Create `playwright.config.ts`:

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  webServer: {
    command: 'npm run build && npm run start -- -p 3001',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  use: {
    baseURL: 'http://localhost:3001',
  },
});
```

- [ ] **Step 2: Write smoke tests**

Create `tests/e2e/card-page.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test('Luxury card page renders Ahmad', async ({ page }) => {
  await page.goto('/ahmad');
  await expect(page.getByRole('heading', { name: 'Ahmad Sharaf' })).toBeVisible();
  await expect(page.getByText(/founder and ceo/i)).toBeVisible();
  await expect(page.getByText('FORCE AI')).toBeVisible();
});

test('Force Brand card page renders Ahmad in Force Media role', async ({ page }) => {
  await page.goto('/ahmad-fm');
  await expect(page.getByRole('heading', { name: 'Ahmad Sharaf' })).toBeVisible();
  await expect(page.getByText(/ops manager/i)).toBeVisible();
  await expect(page.getByText('FORCE MEDIA')).toBeVisible();
});

test('EN ↔ AR locale toggle flips html dir', async ({ page }) => {
  await page.goto('/ahmad');
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  await page.getByRole('button', { name: /switch to arabic/i }).click();
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.getByRole('heading', { name: 'احمد شرف' })).toBeVisible();
});

test('Unknown slug 404s', async ({ page }) => {
  const res = await page.goto('/no-such-card');
  expect(res?.status()).toBe(404);
});
```

- [ ] **Step 3: Implement the route**

Create `app/[slug]/page.tsx`:

```tsx
import { notFound } from 'next/navigation';
import { getCard, listCardSlugs } from '@/data/cards';
import { CardLayout } from '@/components/CardLayout';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return listCardSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export default async function CardPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const card = getCard(slug);
  if (!card) notFound();
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.invalid';
  const url = `${base}/${card.slug}`;
  return <CardLayout card={card} url={url} />;
}
```

- [ ] **Step 4: Install Playwright browsers + run**

Run:

```bash
npx playwright install --with-deps chromium
npm run test:e2e
```

Expected: 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add app/[slug]/page.tsx playwright.config.ts tests/e2e/card-page.spec.ts
git commit -m "feat: [slug] page + SSG + Playwright smoke (lux+force+locale+404)"
```

---

## Task 13: vCard download route

**Files:**
- Create: `app/[slug]/contact.vcf/route.ts`, `tests/e2e/vcard.spec.ts`

- [ ] **Step 1: Write failing e2e**

Create `tests/e2e/vcard.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test('vCard download returns text/vcard with attachment disposition', async ({ request }) => {
  const res = await request.get('/ahmad/contact.vcf');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('text/vcard');
  expect(res.headers()['content-disposition']).toContain('attachment');
  expect(res.headers()['content-disposition']).toContain('ahmad.vcf');
  const body = await res.text();
  expect(body).toContain('BEGIN:VCARD');
  expect(body).toContain('VERSION:3.0');
  expect(body).toContain('FN:Ahmad Sharaf');
  expect(body).toContain('TEL;TYPE=CELL,VOICE:+96541169141');
  expect(body).toContain('END:VCARD');
});

test('vCard 404 for unknown slug', async ({ request }) => {
  const res = await request.get('/no-such-slug/contact.vcf');
  expect(res.status()).toBe(404);
});
```

- [ ] **Step 2: Run e2e to verify it fails**

Run:

```bash
npm run test:e2e -- vcard
```

Expected: FAIL — route handler not yet implemented.

- [ ] **Step 3: Implement route handler**

Create `app/[slug]/contact.vcf/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { getCard } from '@/data/cards';
import { buildVCard } from '@/lib/vcard';

export const dynamic = 'force-static';

export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const card = getCard(slug);
  if (!card) return new NextResponse('Not found', { status: 404 });

  const body = buildVCard(card);
  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': `attachment; filename="${card.slug}.vcf"`,
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
```

- [ ] **Step 4: Run e2e to verify it passes**

Run:

```bash
npm run test:e2e
```

Expected: all e2e tests green.

- [ ] **Step 5: Commit**

```bash
git add app/[slug]/contact.vcf/route.ts tests/e2e/vcard.spec.ts
git commit -m "feat: /[slug]/contact.vcf route — vCard 3.0 attachment"
```

---

## Task 14: Root redirect + robots + sitemap

**Files:**
- Modify: `app/page.tsx`
- Create: `app/robots.ts`, `app/sitemap.ts`

- [ ] **Step 1: Root redirect**

Replace `app/page.tsx` contents:

```tsx
import { redirect } from 'next/navigation';

export default function Root() {
  redirect('/ahmad');
}
```

- [ ] **Step 2: robots.ts**

Create `app/robots.ts`:

```ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/sitemap.xml`,
  };
}
```

- [ ] **Step 3: sitemap.ts**

Create `app/sitemap.ts`:

```ts
import type { MetadataRoute } from 'next';
import { listCardSlugs } from '@/data/cards';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const now = new Date().toISOString();
  return listCardSlugs().map((slug) => ({
    url: `${base}/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: slug === 'ahmad' ? 1.0 : 0.7,
  }));
}
```

- [ ] **Step 4: Verify dev**

Run `npm run dev`. Visit `/` → redirects to `/ahmad`. Visit `/sitemap.xml` → lists both cards. Visit `/robots.txt` → allow `*`. Stop.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx app/robots.ts app/sitemap.ts
git commit -m "feat: root → /ahmad redirect, robots allow all, sitemap from cards"
```

---

## Task 15: Fonts + per-card metadata + OG image

**Files:**
- Modify: `app/layout.tsx`, `app/[slug]/page.tsx`, `tailwind.config.ts`
- Create: `app/[slug]/opengraph-image.tsx`

- [ ] **Step 1: Wire fonts in root layout**

Replace `app/layout.tsx` contents:

```tsx
import type { Metadata } from 'next';
import { Bodoni_Moda, Inter } from 'next/font/google';
import './globals.css';

const bodoni = Bodoni_Moda({ subsets: ['latin'], style: ['italic', 'normal'], variable: '--font-serif' });
const inter  = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.invalid'),
  title: { default: 'Digital Card', template: '%s — Digital Card' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={`${bodoni.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Add fontFamily tokens to Tailwind**

Edit `tailwind.config.ts` — add inside `theme.extend`:

```ts
fontFamily: {
  sans:  ['var(--font-sans)',  'system-ui', 'sans-serif'],
  serif: ['var(--font-serif)', 'serif'],
},
```

- [ ] **Step 3: Per-card generateMetadata**

Replace `app/[slug]/page.tsx` contents:

```tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCard, listCardSlugs } from '@/data/cards';
import { CardLayout } from '@/components/CardLayout';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return listCardSlugs().map((slug) => ({ slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const card = getCard(slug);
  if (!card) return {};
  const c = card[card.defaultLocale];
  return {
    title: `${c.name} — ${c.title}`,
    description: c.title,
    openGraph: { title: c.name, description: c.title, type: 'profile' },
  };
}

export default async function CardPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const card = getCard(slug);
  if (!card) notFound();
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.invalid';
  const url = `${base}/${card.slug}`;
  return <CardLayout card={card} url={url} />;
}
```

- [ ] **Step 4: Per-card OG image**

Create `app/[slug]/opengraph-image.tsx`:

```tsx
import { ImageResponse } from 'next/og';
import { getCard } from '@/data/cards';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OG({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const card = getCard(slug);
  if (!card) return new ImageResponse(<div />, size);
  const c = card.en;
  const isLux = card.template === 'lux';
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: isLux ? '#FFFFFF' : '#2D1418',
        color: isLux ? '#0A0A0B' : '#ECECEC',
        fontSize: 60, fontFamily: 'serif',
      }}>
        <div style={{ fontSize: 96, fontStyle: 'italic' }}>{c.name}</div>
        <div style={{ marginTop: 16, fontSize: 28, color: isLux ? '#686A6C' : '#FF7700', textTransform: 'uppercase', letterSpacing: 4 }}>
          {c.title}
        </div>
      </div>
    ),
    size,
  );
}
```

- [ ] **Step 5: Build verification**

Run:

```bash
npx tsc --noEmit && npm run build
```

Expected: build succeeds, static output includes `/`, `/ahmad`, `/ahmad-fm`, `/ahmad/contact.vcf`, `/ahmad-fm/contact.vcf`, and OG images.

- [ ] **Step 6: Commit**

```bash
git add app/layout.tsx app/[slug]/page.tsx app/[slug]/opengraph-image.tsx tailwind.config.ts
git commit -m "feat: fonts (Bodoni Moda + Inter), per-card metadata, OG image"
```

---

## Task 16: Security headers + image config + 404 page

**Files:**
- Modify: `next.config.ts`
- Create: `app/not-found.tsx`

- [ ] **Step 1: CSP + security headers**

Replace `next.config.ts` contents:

```ts
import type { NextConfig } from 'next';

const csp = [
  "default-src 'self'",
  "img-src 'self' data: blob:",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "script-src 'self' 'unsafe-inline'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
].join('; ');

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
```

- [ ] **Step 2: 404 page**

Create `app/not-found.tsx`:

```tsx
export default function NotFound() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <h1 className="font-serif italic text-[64px] leading-none text-ink">404</h1>
      <p className="text-[14px] mt-4" style={{ color: '#686A6C' }}>Card not found</p>
    </main>
  );
}
```

- [ ] **Step 3: Verify build + headers**

Run:

```bash
npm run build
npm start -- -p 3002 &
sleep 3
curl -sI http://localhost:3002/ahmad | grep -i 'content-security-policy\|strict-transport\|x-frame'
kill %1
```

Expected: each header line present.

- [ ] **Step 4: Commit**

```bash
git add next.config.ts app/not-found.tsx
git commit -m "feat: CSP + HSTS + nosniff + frame-deny + Permissions-Policy + 404 page"
```

---

## Task 17: CI workflow + gitleaks

**Files:**
- Create: `.github/workflows/ci.yml`, `.github/workflows/gitleaks.yml`, `.gitleaks.toml`

- [ ] **Step 1: CI workflow**

Create `.github/workflows/ci.yml`:

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - name: Zero-vuln audit gate (rule 10)
        run: npm audit
      - run: npx tsc --noEmit
      - run: npm run lint
      - run: npm test
      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
      - run: npm run build
```

- [ ] **Step 2: gitleaks config + workflow**

Create `.gitleaks.toml`:

```toml
title = "digital-card gitleaks config"
[allowlist]
description = "Project-wide allowlist"
paths = [
  ".github/workflows/.*",
  "node_modules/.*",
]
```

Create `.github/workflows/gitleaks.yml`:

```yaml
name: gitleaks
on:
  push:
    branches: [main]
  pull_request:
jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      - uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/ci.yml .github/workflows/gitleaks.yml .gitleaks.toml
git commit -m "ci: type-check + lint + unit + e2e + build + audit gate + gitleaks"
```

---

## Task 18: Rollback bundle

**Files:**
- Create: `scripts/rollback.sh`, `scripts/backup-content.sh`, `docs/ROLLBACK.md`

- [ ] **Step 1: rollback.sh**

Create `scripts/rollback.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "✗ uncommitted changes — refusing to roll back. commit or stash first."
  exit 1
fi

CURR=$(git log -1 --pretty=%H)
echo "rolling back HEAD ${CURR:0:8} ..."
git revert HEAD --no-edit
git push
echo "✓ revert pushed — Vercel auto-redeploy in ~30s"
```

```bash
chmod +x scripts/rollback.sh
```

- [ ] **Step 2: backup-content.sh**

Create `scripts/backup-content.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

PROJECT="digital-card"
DEST="${HOME}/Desktop/projects/_backups/${PROJECT}"
mkdir -p "$DEST"
TS=$(date -u +%Y%m%dT%H%M%SZ)
SHA=$(git log -1 --pretty=%h)
FILE="${DEST}/${TS}-${SHA}.tar.gz"

tar -czf "$FILE" data/ public/photos/
ls -1 "$DEST" | sort -r | tail -n +31 | xargs -I {} rm -- "${DEST}/{}" 2>/dev/null || true
echo "✓ backup → $FILE"
```

```bash
chmod +x scripts/backup-content.sh
```

- [ ] **Step 3: ROLLBACK.md**

Create `docs/ROLLBACK.md`:

```markdown
# Rollback Guide

Three paths, fastest first.

## 1. Vercel instant rollback (≤30 s)
Open Vercel → Project: digital-card → Deployments → pick a previous green deploy → "Promote to Production". No git changes; the previous artifact serves immediately.

## 2. Git-revert (≤2 min)
```
./scripts/rollback.sh
```
Refuses to run with uncommitted changes. Reverts HEAD and pushes; Vercel auto-redeploys.

## 3. Content backup (≤5 min)
Static content lives in `data/` + `public/photos/`. Local snapshots at `~/Desktop/projects/_backups/digital-card/` keep the last 30 commits.

To restore:
```
tar -xzf ~/Desktop/projects/_backups/digital-card/<file>.tar.gz
```
Then commit + push.

## Notes
- No DB in this project → schema-rollback concerns do not apply.
- HEAD git author email must be `ahmed0montaser@gmail.com` for every push (Vercel Hobby rule).
```

- [ ] **Step 4: Commit**

```bash
git add scripts/rollback.sh scripts/backup-content.sh docs/ROLLBACK.md
git commit -m "ops: rollback bundle (Vercel-instant / git-revert / content-backup)"
```

---

## Task 19: README + DEPLOYMENT.md + .env.example

**Files:**
- Create: `README.md`, `docs/DEPLOYMENT.md`, `.env.example`

- [ ] **Step 1: .env.example**

Create `.env.example`:

```
# Public site URL — used for sitemap, OG image base, canonical
NEXT_PUBLIC_SITE_URL=https://card.example.com
```

- [ ] **Step 2: README.md**

Create `README.md`:

```markdown
# Digital Card

Personal + team digital business cards. Bilingual AR/EN. Two visual templates (Nardo Lux · Force Brand). Static Next.js 16.

## Development
```
npm install
npm run dev          # http://localhost:3000
npm test             # unit tests
npm run test:e2e     # Playwright smoke
npm run build        # static export verification
```

## Adding a card
1. Add `data/cards/<slug>.ts` exporting a `Card` record.
2. Register it in `data/cards/index.ts`.
3. Drop photo at `public/photos/<slug>.jpg` (≥256px square, <100 KB).
4. Commit + push; Vercel rebuilds.

## Templates
- `lux` — Nardo Lux (white/black/Nardo grey, Bodoni Moda italic name, full-pill buttons)
- `force` — Force Brand (wine/orange/cream, Inter, wordmark swap via `brand: 'force-ai' | 'force-media'`)

## Rollback
See `docs/ROLLBACK.md`. Three paths: Vercel-instant · `./scripts/rollback.sh` · content backup.

## License
UNLICENSED — proprietary.
```

- [ ] **Step 3: DEPLOYMENT.md**

Create `docs/DEPLOYMENT.md`:

```markdown
# Deployment

## Vercel (Hobby plan)
1. Verify git author email for this repo:
   ```
   git config user.email
   git log -1 --pretty=fuller
   ```
   Vercel Hobby rejects deploys whose HEAD author email isn't the owner's (`ahmed0montaser@gmail.com`).
2. Vercel dashboard → "Import Project" → select the GitHub repo.
3. Framework preset: Next.js. No build overrides.
4. Environment variables:
   - Production: `NEXT_PUBLIC_SITE_URL=https://<your-domain>`
   - Preview: leave `NEXT_PUBLIC_SITE_URL` blank or set to staging URL (rule 13: must differ from production)
5. Add custom domain in Vercel → Domains. Follow DNS instructions.
6. After first deploy:
   - UptimeRobot monitor on `https://<your-domain>/ahmad` (rule 6)
   - Telegram channel for P0 alerts

## Post-launch checks
- [ ] `/robots.txt` returns allow-all
- [ ] `/sitemap.xml` lists every slug
- [ ] `/ahmad/contact.vcf` downloads → "Add to Contacts" works on iOS Safari
- [ ] `/ahmad/contact.vcf` likewise on Android Chrome
- [ ] Locale toggle flips `<html dir>` ltr ↔ rtl
- [ ] Lighthouse mobile ≥99 on all four axes
- [ ] `curl -sI https://<domain>/ahmad` shows CSP + HSTS headers
```

- [ ] **Step 4: Commit**

```bash
git add README.md docs/DEPLOYMENT.md .env.example
git commit -m "docs: README + DEPLOYMENT + .env.example"
```

---

## Task 20: Final verification + first push

- [ ] **Step 1: Full stack run**

Run:

```bash
npm audit && npx tsc --noEmit && npm run lint && npm test && npm run test:e2e && npm run build
```

Expected: every command exits 0.

- [ ] **Step 2: Manual eyes-on**

Run `npm run dev`, open browser:
- `/ahmad` → Luxury template, EN default
  - Click AR → name becomes "احمد شرف", html dir flips to rtl
  - Click "SAVE TO CONTACTS" → `.vcf` downloads
  - Click "SHARE" → native share sheet (mobile) or copy-confirmation (desktop)
  - Click "QR CODE" → modal opens with QR; Escape closes; backdrop click closes
- `/ahmad-fm` → Force Brand, wine bg, orange CTA, "FORCE MEDIA" wordmark, "OPS MANAGER & AI ENGINEER"
- `/` → redirects to `/ahmad`
- `/no-such-card` → 404 page

- [ ] **Step 3: Verify git author**

```bash
git config user.email                  # expect ahmed0montaser@gmail.com
git log -1 --pretty=fuller             # author email must match
```

If not, fix:

```bash
git config user.email ahmed0montaser@gmail.com
git commit --allow-empty -m "chore: refresh HEAD author for Vercel Hobby"
```

- [ ] **Step 4: Create remote + push** (after creating the GitHub repo under `ForceAI-KW/digital-card`)

```bash
git remote add origin git@github-primary:ForceAI-KW/digital-card.git
git branch -M main
git push -u origin main
```

- [ ] **Step 5: Tag launch**

```bash
git tag v0.1.0 -m "first card — Ahmad Sharaf"
git push --tags
```

- [ ] **Step 6: Vercel + domain + uptime** — follow `docs/DEPLOYMENT.md`.

---

## Self-Review

**Spec coverage:**
- §1 Goals → Tasks 2 (data), 9–11 (templates), 6 (locale toggle), 12 (SSG), 13 (vCard), 7+8 (share/QR).
- §3.1 Stack → Task 1.
- §3.3 Card type → Task 2.
- §3.4 Ahmad's two cards → Task 2.
- §3.5 Route map → Tasks 12 (page), 13 (vcf), 14 (root/robots/sitemap), 15 (OG).
- §4 Nardo Lux visual → Task 9.
- §5 Force Brand visual → Task 10.
- §5.6 Brand swap → Task 10 (`BRAND_LABEL` keyed by `card.brand`).
- §6 vCard → Tasks 3 + 13.
- §7 Bilingual → Tasks 2 (i18n), 6 (toggle + context), 9/10 (templates consume context).
- §8 Standing-policy compliance → Tasks 1 (audit), 16 (CSP + HSTS), 17 (CI + gitleaks), 18 (rollback bundle), 19 (DEPLOYMENT post-launch checks incl. UptimeRobot).
- §9 SEO → Task 14 (sitemap + robots) + Task 15 (metadata + OG). JSON-LD explicitly deferred to v1.1 with rationale.
- §10 Accessibility → Tasks 4 (aria-label per social), 5 (button aria-label), 6 (lang/dir), 8 (role=dialog + Escape).
- §11 Edge cases → Task 13 (404 vcf), Task 4 (skip empty socials), Task 7 (clipboard fallback), Task 9/10 (only render contact tiles when fields present).
- §12 Testing → Tasks 12+13 (Playwright), Tasks 2/3/4/5/6/7/8/11 (Vitest).

**Placeholder scan:** clean — no TBD/TODO/"implement later"/etc. in any task.

**Type consistency:** `Card`, `CardI18n`, `CardContact`, `CardSocials`, `Locale`, `Template`, `Brand` all defined in Task 2 and consumed unchanged in Tasks 3/4/5/9/10/11. `t(key, locale)` signature consistent across 9/10. `ActionButton` discriminated union (`LinkProps | BtnProps`) consumed correctly in 9/10/7/8. `LocaleProvider`/`useLocale` consistent across 6/9/10/11. `BRAND_LABEL` keys match `Brand` type.

No issues found.
