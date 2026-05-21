# Digital Card — Design Spec

**Date:** 2026-05-21
**Owner:** Ahmad Sharaf
**Status:** Approved (visual lock) — pending user spec review before implementation plan

---

## 1. Goals

- Personal digital business card for Ahmad Sharaf (Template A — "Nardo Lux"), representing him as Force AI Founder/CEO
- Reusable business-card template for Force Media (and future Force AI) employees (Template B — "Force Brand"); brand mark + footer org + role data swap **at the data layer** (per slug)
- Multiple cards per person are supported: Ahmad has `/ahmad` (Luxury Force AI) and `/ahmad-fm` (Force Brand Force Media — Ops Manager & AI Engineer)
- Team members get Force Brand Force Media cards only (no Force AI variant in v1)
- Single Next.js 16 deployment, content-as-code (no DB, no auth, no admin panel)
- Bilingual AR/EN, **one language visible at a time**, in-page button toggle (EN ↔ AR), default per card
- Statically generated; one URL per (person, brand) tuple at `/<slug>`
- Save-to-Contacts via vCard 3.0 download
- Web Share + QR Code
- Tap-style action stack: Call · WhatsApp · Email · SMS
- Mobile-first; max-width 420px; works in any modern browser

## 2. Non-goals (v1)

- No auth, no sign-up, no merchant onboarding
- No NFC card management (Ahmad writes the URL to a physical NFC sticker himself)
- No analytics in v1 → no consent banner needed (rule 5)
- No public marketing landing page — domain root redirects to Ahmad's slug
- No dynamic OG image generator in v1 (static PNG per person OR Next OG static)
- No tenant accounts — new cards added by commit + push

## 3. Architecture

### 3.1 Stack

- **Next.js 16** App Router, TypeScript
- **Tailwind v4**
- **`qrcode`** for client-side QR rendering
- **Web Share API** (native, no library)
- **Lucide React** for monoline outline icons (tree-shakeable, 1.5px stroke matches spec)
- **Bodoni Moda + Inter** via `next/font/google`
- **Vercel** deploy (Hobby, Ahmad's existing account)
- Domain: TBD by Ahmad (registered separately; standing Vercel-author-email rule applies)

### 3.2 Project layout

```
digital-card/
├── app/
│   ├── [slug]/
│   │   ├── page.tsx                  # card page, server component, SSG
│   │   ├── contact.vcf/route.ts      # vCard download route
│   │   └── opengraph-image.tsx       # per-card OG image
│   ├── layout.tsx                    # root layout, fonts, default metadata
│   ├── page.tsx                      # root → redirect to /ahmad
│   ├── globals.css                   # Tailwind + font wiring
│   ├── robots.ts                     # allow all
│   └── sitemap.ts                    # generated from cards map
├── data/
│   └── cards/
│       ├── _types.ts                 # Card interface
│       ├── ahmad.ts                  # Template A — Nardo Lux
│       └── index.ts                  # export const cards: Record<string, Card>
├── components/
│   ├── CardLayout.tsx                # template switcher
│   ├── templates/
│   │   ├── NardoLux.tsx              # Template A
│   │   └── ForceBrand.tsx            # Template B
│   ├── ActionButton.tsx              # pill button (primary | secondary)
│   ├── SocialIconRow.tsx
│   ├── LocaleToggle.tsx              # client EN|AR toggle
│   ├── ShareButton.tsx               # client: navigator.share + copy-link fallback
│   ├── QRModal.tsx                   # client: lazy `qrcode`
│   └── FalconF.tsx                   # SVG brand mark for Template B
├── public/
│   ├── photos/
│   │   └── ahmad.jpg                 # ≥256px square, <100 KB
│   └── og/
│       └── ahmad.png                 # optional static OG
├── lib/
│   ├── vcard.ts                      # buildVCard(card) → string
│   └── i18n.ts                       # AR/EN string map + helpers
├── scripts/
│   ├── rollback.sh                   # standard Force rollback recipe (no DB)
│   └── backup-content.sh             # tar of /data + /public/photos (no Neon)
├── docs/
│   ├── ROLLBACK.md
│   └── superpowers/specs/
│       └── 2026-05-21-digital-card-design.md   # this doc
├── .github/workflows/
│   ├── ci.yml                        # type-check, lint, build, npm audit gate
│   └── gitleaks.yml                  # rule 2 — secrets scan
├── package.json                      # license: UNLICENSED
└── README.md
```

### 3.3 Card data type

```ts
// data/cards/_types.ts
export type Template = 'lux' | 'force';
export type Brand = 'force-ai' | 'force-media';
export type Locale = 'en' | 'ar';

export interface CardContact {
  phone?: string;          // intl, digits-only e.g. '+96541169141' — used for tel: and vCard TEL
  phoneDisplay?: string;   // human format e.g. '+965 4116 9141' — used as button label
  whatsapp?: string;       // intl digits-only; defaults to phone if omitted
  emails: string[];        // ordered; first is primary
  websites?: string[];     // bare hostnames or full URLs
}

export interface CardSocials {
  instagram?: string;
  linkedin?: string;       // slug only (linkedin.com/in/<slug>)
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
  slug: string;            // URL path segment
  template: Template;      // 'lux' | 'force'
  brand?: Brand;           // required when template === 'force', ignored otherwise
  defaultLocale: Locale;   // initial render language
  en: CardI18n;
  ar: CardI18n;
  photo: string;           // public path e.g. '/photos/ahmad.jpg'
  contact: CardContact;
  socials: CardSocials;
  copyrightYear: number;
}
```

### 3.4 Ahmad's two cards (locked content)

Ahmad has **two cards**: a Luxury card for his Force AI Founder identity, and a Force Brand Force Media card for his Force Media operations role.

```ts
// data/cards/ahmad.ts — Luxury (Force AI Founder/CEO)
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

```ts
// data/cards/ahmad-fm.ts — Force Brand · Force Media (Ops Manager & AI Engineer)
import type { Card } from './_types';

export const ahmadFm: Card = {
  slug: 'ahmad-fm',
  template: 'force',
  brand: 'force-media',
  defaultLocale: 'en',
  en: { name: 'Ahmad Sharaf', title: 'Ops Manager & AI Engineer' },
  ar: { name: 'احمد شرف',    title: 'مدير العمليات ومهندس ذكاء اصطناعي' },
  photo: '/photos/ahmad.jpg',                  // same photo as the Luxury card
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

Team members (future): each gets one Card record with `template: 'force'` and `brand: 'force-media'`. No Force AI variant for team members in v1.

### 3.5 Route map

| Route | Purpose | Render |
|---|---|---|
| `/` | Server redirect → `/ahmad` | static redirect |
| `/[slug]` | Card page | SSG via `generateStaticParams()` over `Object.keys(cards)` |
| `/[slug]/contact.vcf` | vCard download | Route handler, `Content-Type: text/vcard`, `Content-Disposition: attachment; filename="<slug>.vcf"` |
| `/[slug]/opengraph-image` | Per-card OG image | Next.js OG, statically generated at build |
| `/robots.txt` | Allow all | Next `robots.ts` |
| `/sitemap.xml` | Every card slug | Next `sitemap.ts`, generated from `cards` |

## 4. Visual specification — Template A (Nardo Lux)

### 4.1 Aesthetic

Quiet luxury. References: Audi RS Nardo Gray paintwork, Bottega Veneta, Loro Piana, modern Swiss editorial. High typographic contrast, precise geometry, generous whitespace. Cold, expensive, deliberate. **No drop shadows. No gradients. No glassmorphism.**

### 4.2 Color (strict — only these three)

| Token | Hex | Use |
|---|---|---|
| `white` | `#FFFFFF` | Page background |
| `black` | `#0A0A0B` | Name, primary CTA bg, primary text, icons at full strength |
| `nardo` | `#686A6C` | Subtitle, hairlines, icon strokes, secondary surfaces (per Ahmad's exact spec: RGB 104,106,108 / HSL 210°,1.89%,41.57%) |
| `nardo/40` | `#686A6C` @ 40% | Hairline divider above socials |
| `nardo/25` | `#686A6C` @ 25% | Top bar bottom border |
| `nardo/6` | `#686A6C` @ 6%  | Hero circle background fill (visible behind/around photo) |
| `nardo/2` | `#686A6C` @ 2%  | Secondary pill fill (vs pure white — gives subtle presence) |

No other colors. No tints outside this list. No gradients.

### 4.3 Typography

- **Headlines / name**: Bodoni Moda 400, italic, letter-spacing -0.02em, line-height 1.05, color `black`.
- **Body / labels**: Inter 400/500/600 only.
- **Title-under-name**: Inter 500, all-caps, tracking +0.12em, 12px, color `nardo`.
- No third typeface anywhere.

### 4.4 Layout (mobile, 420px max-width)

| Element | Spec |
|---|---|
| Top bar | 64px tall, white bg, 1px `nardo/25` bottom border. Left: "FORCE AI" Inter 600 12px uppercase tracking +0.15em, **color `nardo`**. Right: `EN | AR` Inter 500 12px tracking +0.1em; active locale = `black`, inactive = `nardo`, pipe = `nardo`. |
| Hero portrait | 96×96, perfect circle, **fill `nardo/6` behind photo**, 1.5px solid `nardo` border (no shadow). Photo `object-cover`. Fallback when missing: monoline person silhouette in `nardo`. |
| Name | 48px Bodoni Moda italic, `black`, centered. Single line. |
| Title (subtitle) | 12px Inter 500 uppercase `nardo`, tracking +0.12em, centered. |
| Primary CTA | 100% width, 56px tall, `black` bg, white label "SAVE TO CONTACTS" Inter 600 14px tracking +0.08em uppercase, **border-radius 9999px (full pill)**, 20px Lucide `Download`/`ContactRound` icon left of label with 12px gap. |
| Secondary actions stack | 4 pills, 100% width, 56px tall each, **`nardo/2` bg, 1px solid `black` border**, `black` Inter 500 14px label, 20px Lucide monoline icon left, 12px gap between pills. Order: Call · WhatsApp · Email · SMS. **All pills border-radius 9999px.** |
| Hairline divider | 1px `nardo/40`, 88% width, centered. |
| Social row | Monoline Lucide icons 22px, 1.5px stroke, color `nardo`, 28px gap, centered. Only icons for non-empty socials. For Ahmad: LinkedIn + GitHub. |
| Share + QR row | Two 50%-width pills, 48px tall, `nardo/2` bg, 1px `black` border, `black` Inter 500 13px uppercase tracking +0.08em label, monoline icon left, 12px gap between. **Both border-radius 9999px.** |
| Footer | Centered, 11px Inter 400 `nardo`: "© 2026 Ahmad Sharaf" line 1; 4px gap; "BY FORCE AI" 10px Inter 500 uppercase tracking +0.15em line 2. |

### 4.5 Interactions

- Buttons: hover → label font-weight increases by 100; tap → container scales 0.98. 180ms ease.
- Page-load: 320ms opacity fade-in 0 → 1. Nothing else animates.
- Locale toggle: `<html lang>` and `<html dir>` swap with the active button; no page reload.

## 5. Visual specification — Template B (Force Brand)

### 5.1 Aesthetic

Bold modern tech-brand. Product-grade. References: Linear, Vercel, Stripe — but on the Force orange-on-dark identity. Deep wine ground, signal-orange accent, off-white text. Confident, geometric, modern.

### 5.2 Color (strict)

| Token | Hex | Use |
|---|---|---|
| `wine` | `#2D1418` | Page background |
| `wine-elev` | `#3D2128` | Elevated surface (hover bg on secondary pills) |
| `orange` | `#FF7700` | Brand mark, primary CTA bg, accent text, border on secondary pills, primary border on hero |
| `cream` | `#ECECEC` | Name, body labels, monoline social icons |
| `cream/60` | `#ECECEC` @ 60% | Footer text |
| `cream/30` | `#ECECEC` @ 30% | Share+QR pill border, divider hairline |

No other colors. No gradients. **Social icons stay `cream` monoline — never brand-color** (no LinkedIn-blue, never YouTube-red, etc.).

### 5.3 Typography

All Inter (no serif). Weights 400/500/600/700.

- Name: 36px Inter 700, `cream`, letter-spacing -0.01em.
- Title: 14px Inter 500, `orange`, uppercase, tracking +0.1em.
- Body / labels: 14–16px Inter 400/500, `cream`.
- Footer: 11px Inter 400 `cream/60`.

### 5.4 Layout

| Element | Spec |
|---|---|
| Brand block (top) | 32px top padding. Centered: `<FalconF>` SVG monogram 28px in `orange`, then 6px gap, then wordmark "FORCE AI" **or** "FORCE MEDIA" (per `card.brand`) Inter 600 12px uppercase tracking +0.15em `orange`. |
| Hero portrait | 96×96 rounded-square (border-radius 12px), 2px solid `orange` border, photo `object-cover`. |
| Name | 36px Inter 700 `cream`, centered. |
| Title | 14px Inter 500 `orange` uppercase tracking +0.1em, centered. |
| Primary CTA | 100% width, 56px, `orange` bg, `wine` text Inter 700 14px tracking +0.08em uppercase, **border-radius 9999px**, monoline icon left in `wine`. |
| Secondary actions stack | 4 pills, 100% width, 56px each, **transparent bg, 1px solid `orange` border**, `cream` Inter 500 14px label, 20px monoline `orange` icon left, 12px gap. **All border-radius 9999px.** |
| Hairline divider | 1px `cream/30`, 88% width, centered. |
| Social row | Monoline 22px, 1.5px stroke, color `cream`, 28px gap, centered. |
| Share + QR row | Two 50%-width pills, 48px tall, transparent bg, 1px `cream/30` border, `cream` Inter 500 13px uppercase tracking +0.08em label, monoline `cream` icon left. **Border-radius 9999px.** |
| Footer | Centered 11px Inter 400 `cream/60`: "© 2026 Force AI · Kuwait" (or "Force Media · Kuwait" per `card.brand`). |

### 5.5 Interactions

- Primary CTA: bg brightens to `#FF8A1A` on hover; tap scales 0.98.
- Secondary pills: border thickens to 2px `orange` on hover; bg fills to `wine-elev` at 60% opacity.
- 180ms ease everywhere. No bounce, no spring.

### 5.6 Brand swap (data-level, not runtime)

Brand selection happens at **data-authoring time**, not at render time. Each (person, brand) tuple is its own `Card` record with its own slug, its own title strings, its own footer org, and its own URL. There is **no in-page brand toggle**; visiting the card means you've chosen the brand variant by URL.

What swaps when `brand: 'force-ai'` vs `brand: 'force-media'`:
- Top wordmark: `FORCE AI` ↔ `FORCE MEDIA` (Inter 600 12px uppercase tracking +0.15em, orange)
- Footer org line: `© <year> Force AI · Kuwait` ↔ `© <year> Force Media · Kuwait`
- Card's `title` strings are author-written for the specific role (Ahmad's Force AI title is "Founder and CEO"; his Force Media title is "Ops Manager & AI Engineer")
- Falcon-F mark is shared (both brands use the same mark — only the wordmark text changes)

Same applies to bilingual: the AR title for each brand is author-written per brand.

## 6. vCard format (3.0, both templates)

Built server-side in `app/[slug]/contact.vcf/route.ts`. CRLF line endings. Long lines folded at 75 chars per RFC 2426.

```
BEGIN:VCARD
VERSION:3.0
N:Sharaf;Ahmad;;;
FN:Ahmad Sharaf
ORG:Force AI
TITLE:Founder and CEO
TEL;TYPE=CELL,VOICE:+96541169141
EMAIL;TYPE=INTERNET:ahmed0montaser@gmail.com
URL:https://forcemediakw.com
URL:https://force-ai.com
URL:https://store.forcemediakw.com
X-SOCIALPROFILE;TYPE=linkedin:https://linkedin.com/in/a7xq8
X-SOCIALPROFILE;TYPE=github:https://github.com/ForceAI-KW
PHOTO;ENCODING=b;TYPE=JPEG:<base64 of photo, ≤80 KB after encoding>
NOTE:Ahmad Sharaf · احمد شرف — Founder and CEO · Force AI
END:VCARD
```

**Bilingual handling**: FN/N stay English (universal contact-app rendering). Arabic name + title included in `NOTE` to keep the file maximally portable across iOS Contacts / Google Contacts / Outlook.

**Photo size guard**: build script enforces JPEG ≤ 80 KB at base64 encoding. Larger photos are downscaled at build via `sharp`.

## 7. Bilingual AR/EN

- Default locale set per card (`card.defaultLocale`).
- `<LocaleToggle>` (client component) flips `<html lang>` + `<html dir>`. No reload.
- Internal string map at `lib/i18n.ts`:
  - `SAVE_TO_CONTACTS`: `"SAVE TO CONTACTS"` / `"احفظ في جهات الاتصال"`
  - `CALL`: `"Call"` / `"اتصال"`
  - `WHATSAPP`: `"WhatsApp"` / `"واتساب"`
  - `EMAIL`: derived from address
  - `SEND_SMS`: `"Send SMS"` / `"رسالة نصية"`
  - `SHARE`: `"Share"` / `"مشاركة"`
  - `QR_CODE`: `"QR Code"` / `"رمز QR"`
  - `BY_FORCE_AI`: `"By Force AI"` / `"بواسطة فورس إيه آي"`
- Tailwind tracking utilities never applied to Arabic text — they sever joining (per Ahmad's standing rule `feedback-tailwind-tracking-breaks-arabic`).

## 8. Standing-policy compliance

| Rule | Status |
|---|---|
| 1 — Dep discipline + 0 CVEs at all severities | Audit gate in CI, no transitive caret pinning surprises (lockfile committed). |
| 2 — Security gates | No user input → no XSS surface. CSP headers strict, only `fonts.googleapis.com` + `fonts.gstatic.com` whitelisted. Gitleaks pre-commit + CI. |
| 3 — Scaling | Pure SSG. Edge-cached forever per build hash. No DB, no queries. |
| 4 — Mobile guards | N/A (web-only). |
| 5 — Cookie consent | NO third-party trackers in v1 → no banner needed. |
| 6 — Alerting | UptimeRobot on the domain post-launch, Telegram channel for P0. |
| 7 — Log drain | N/A — static site, no API logs. |
| 8 — Staging != prod API | N/A — no API at all. |
| 9 — GDPR erasure | N/A — no visitor PII stored. Ahmad's PII is published on his own card by his own commit. |
| 10 — CI audit gate at low severity | `npm audit` with no `--audit-level` flag (fails on anything). |
| 11 — Log retention | N/A. |
| 12 — Alert bridge token | N/A. |
| 13 — Preview API isolation | N/A. |
| Rollback bundle | `scripts/rollback.sh` + `docs/ROLLBACK.md` (Vercel-instant + git-revert; no Neon — no DB). |
| Vercel author email | Standing rule: HEAD author must be `ahmed0montaser@gmail.com` before every push. |

## 9. SEO + AEO

- Cards are PUBLIC, indexable (opposite of auth-only-tool noindex pattern).
- Per-card `<title>` = `"<Name> — <Title>"`.
- Per-card description = subtitle text.
- JSON-LD `Person` schema with:
  - `name`, `givenName`, `familyName`
  - `jobTitle`
  - `worksFor` → `Organization` (Force AI / Force Media)
  - `email`, `telephone`, `url`
  - `sameAs` array → linkedin, github, websites
- OG image: per-card static PNG (Phase 1) → Next OG route (Phase 2).
- `sitemap.xml` auto-generated from `cards` map.

## 10. Accessibility

- Contrast (WCAG): black-on-white ~16:1 (AAA); cream-on-wine ~10:1 (AA large); orange-on-wine ~3:1 (large text only — used only on the title where text is 14px+ uppercase). Orange-on-wine is **never** used for small body text.
- Touch targets: 56×100% pills exceed the 48×48 WCAG minimum.
- Focus rings: 2px black outline on Nardo Lux; 2px orange on Force Brand.
- `<html lang>` and `<html dir>` update on toggle.
- vCard download button has `aria-label="Download contact card for <name>"`.
- QR modal traps focus + closes on Escape + restores focus to trigger.

## 11. Edge cases

- vCard route 404s on unknown slug.
- Optional social/contact field missing → icon/pill simply doesn't render. No empty placeholders.
- Photo file missing → silhouette SVG fallback inside Nardo grey circle.
- Offline → fully static, works offline once cached.
- WhatsApp launch link uses sanitized digits only (`wa.me/96541169141`).
- Phone tap on desktop browsers → falls back to copy-to-clipboard with toast confirmation.

## 12. Testing

- Playwright smoke: `/ahmad` renders → click Save Contact → assert `.vcf` Content-Disposition header → click Share → assert `navigator.share` invocation OR modal opens → toggle EN ↔ AR → assert `<html dir>` flips between `ltr` and `rtl`.
- Lighthouse: target 100/100/100/100 (trivial given static + tiny payload).
- Real-device check: iOS Safari + Android Chrome — Save Contact must complete the OS contact-add flow with the photo embedded.

## 13. Open items (resolved)

- ✅ Templates A + B locked
- ✅ Color palettes locked (Nardo Lux: #FFFFFF / #0A0A0B / #686A6C · Force Brand: #2D1418 / #FF7700 / #ECECEC / #3D2128)
- ✅ All buttons → full pill (border-radius 9999px); secondaries outlined
- ✅ Ahmad has TWO cards: `/ahmad` (Luxury — Force AI Founder/CEO) and `/ahmad-fm` (Force Brand Force Media — Ops Manager & AI Engineer); both with AR + EN locked
- ✅ Brand swap is data-level (per-slug Card record), not a runtime toggle
- ✅ Team members get Force Brand Force Media cards only in v1
- ✅ Locale toggle is one-language-at-a-time, in-page EN ↔ AR button
- ⏭ Domain to be selected by Ahmad at deploy time
- ⏭ Photo file to be dropped at `public/photos/ahmad.jpg` by Ahmad before first build (silhouette fallback works in dev)
- ⏭ Force Media's wordmark text confirmed as "FORCE MEDIA" (same falcon-F mark as Force AI per existing brand reference)
