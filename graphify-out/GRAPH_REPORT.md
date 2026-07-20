# Graph Report - digital-card  (2026-07-20)

## Corpus Check
- 88 files · ~96,740 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 595 nodes · 736 edges · 55 communities (46 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c82b27d0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]

## God Nodes (most connected - your core abstractions)
1. `Digital Card Implementation Plan` - 23 edges
2. `Task 4: Auth library + middleware + login` - 21 edges
3. `Task 3: Read-path migration (TS files → Prisma)` - 20 edges
4. `Digital Card — Admin Panel (v2) Design Spec` - 20 edges
5. `Task 6: Admin form (new + edit) + Zod schemas + server actions` - 15 edges
6. `Digital Card — Design Spec` - 14 edges
7. `Digital Card Admin Panel (v2) — Implementation Plan` - 13 edges
8. `Task 1: Prisma init + Neon branches + schema` - 13 edges
9. `Task 10: Playwright admin e2e + DEPLOYMENT.md + final verification` - 13 edges
10. `Task 2: Card data types + Ahmad's two cards + i18n` - 11 edges

## Surprising Connections (you probably didn't know these)
- `middleware()` --calls--> `verifySession()`  [EXTRACTED]
  middleware.ts → lib/admin-session.ts
- `OG()` --calls--> `fromPrisma()`  [EXTRACTED]
  app/[slug]/opengraph-image.tsx → lib/types.ts
- `generateMetadata()` --calls--> `fromPrisma()`  [EXTRACTED]
  app/[slug]/page.tsx → lib/types.ts
- `fetchPhotoBase64()` --calls--> `fetch()`  [INFERRED]
  lib/vcard.ts → standalone-card/worker/src/index.js
- `createCardAction()` --calls--> `parseList()`  [EXTRACTED]
  app/admin/cards/new/actions.ts → lib/form-utils.ts

## Communities (55 total, 9 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (56): ActionButton(), BtnProps, CommonProps, LinkProps, Props, STYLES, Variant, CardLayout() (+48 more)

### Community 1 - "Community 1"
Cohesion: 0.04
Nodes (48): code:block1 (digital-card/), code:bash (DATABASE_URL=<DATABASE_URL_PROD> DIRECT_URL=<DIRECT_URL_PROD), code:ts (import { Pool, neonConfig } from '@neondatabase/serverless';), code:bash (npx tsc --noEmit), code:bash (git config user.email                     # must be ahmed0mo), code:bash (npm install @vercel/blob), code:bash (vercel env pull .env.local), code:ts (import { put, del } from '@vercel/blob';) (+40 more)

### Community 2 - "Community 2"
Cohesion: 0.09
Nodes (24): SignInForm(), State, config, middleware(), hashPassword(), requireAdmin(), scrypt, signSession() (+16 more)

### Community 3 - "Community 3"
Cohesion: 0.08
Nodes (18): NotFound(), GET(), EditCardPage(), fromPrisma(), buildVCard(), escape(), fetchPhotoBase64(), foldLine() (+10 more)

### Community 4 - "Community 4"
Cohesion: 0.06
Nodes (35): 10. Accessibility, 11. Edge cases, 12. Testing, 13. Open items (resolved), 1. Goals, 2. Non-goals (v1), 3.1 Stack, 3.2 Project layout (+27 more)

### Community 5 - "Community 5"
Cohesion: 0.1
Nodes (21): Action, ActionState, CardForm(), field(), Props, DeleteButton(), Props, PhotoDropzone() (+13 more)

### Community 6 - "Community 6"
Cohesion: 0.07
Nodes (28): 10. Seed migration, 11. UI direction, 12. Standing-policy compliance (delta from v1), 13. Environment variables (new in v2), 14. Routes (full list after v2), 15. Build phases (one commit batch each), 16. Testing, 17. Edge cases (+20 more)

### Community 7 - "Community 7"
Cohesion: 0.1
Nodes (21): code:bash (npm install jose), code:ts (import { describe, it, expect, beforeEach } from 'vitest';), code:bash (npm test -- admin-auth), code:ts (import { scrypt as scryptCb, randomBytes, timingSafeEqual } ), code:bash (npm test -- admin-auth), code:ts (import { describe, it, expect } from 'vitest';), code:bash (npm test -- rate-limit), code:ts (type Bucket = { count: number; resetAt: number };) (+13 more)

### Community 8 - "Community 8"
Cohesion: 0.1
Nodes (20): code:ts (import type { Locale } from './i18n';), code:tsx (import type { Metadata } from 'next';), code:ts (import { NextResponse } from 'next/server';), code:ts (async function fetchPhotoBase64(url: string): Promise<string), code:ts (const photoBase64 = await fetchPhotoBase64(card.photoUrl);), code:ts (export async function buildVCard(card: Card): Promise<string), code:ts (import { beforeEach, vi } from 'vitest';), code:ts (it('emits PHOTO line when photoUrl is fetchable', async () =) (+12 more)

### Community 9 - "Community 9"
Cohesion: 0.13
Nodes (15): code:bash (npm install zod), code:ts (import { describe, it, expect } from 'vitest';), code:bash (npm test -- admin-schemas), code:ts (import { z } from 'zod';), code:bash (npm test -- admin-schemas), code:tsx ('use client';), code:ts ('use server';), code:tsx (import { CardForm } from '@/components/admin/CardForm';) (+7 more)

### Community 10 - "Community 10"
Cohesion: 0.19
Nodes (10): buildSchema(), JsonLdPerson(), Props, safeStringify(), ahmad, ahmadFm, { container }, j (+2 more)

### Community 11 - "Community 11"
Cohesion: 0.15
Nodes (13): code:block100, code:block101 (`printf '<value>' | vercel env add ADMIN_JWT_SECRET producti), code:bash (npm audit && npx tsc --noEmit && npm run lint && npm test &&), code:bash (git add tests/e2e/admin-login.spec.ts tests/e2e/admin-crud.s), code:bash (git push origin main), code:ts (import { defineConfig } from '@playwright/test';), code:bash (npm install -D dotenv), code:ts (import { test, expect } from '@playwright/test';) (+5 more)

### Community 12 - "Community 12"
Cohesion: 0.18
Nodes (11): code:ts (import { describe, it, expect } from 'vitest';), code:bash (npm test -- i18n), code:ts (export type Locale = 'en' | 'ar';), code:bash (npm test -- i18n), code:ts (import type { Locale } from '@/lib/i18n';), code:ts (import type { Card } from './_types';), code:ts (import type { Card } from './_types';), code:ts (import type { Card } from './_types';) (+3 more)

### Community 13 - "Community 13"
Cohesion: 0.2
Nodes (9): 1. Vercel instant rollback (≤30 s), 2. Git-revert (≤2 min), 3. DB backup restore (≤5 min), 4. Neon point-in-time restore (for migration scenarios), code:block1 (./scripts/rollback.sh), code:block2 (pg_restore -d "$DATABASE_URL" ~/Desktop/projects/_backups/di), code:block3 (neonctl branches create --project-id green-shadow-14491887 -), Notes (+1 more)

### Community 14 - "Community 14"
Cohesion: 0.2
Nodes (10): code:bash (git config user.email), code:bash (cd /Users/ahmadsharaf/Desktop/projects/digital-card), code:bash (npm install qrcode lucide-react), code:bash (npm audit), code:ts (import { defineConfig } from 'vitest/config';), code:ts (import '@testing-library/jest-dom/vitest';), code:json ("scripts": {), code:ts (import type { Config } from 'tailwindcss';) (+2 more)

### Community 15 - "Community 15"
Cohesion: 0.22
Nodes (8): Adding a card, Admin panel, code:block1 (npm install), Development, Digital Card, License, Rollback, Templates

### Community 16 - "Community 16"
Cohesion: 0.22
Nodes (8): code:block1 (npx tsx scripts/hash-password.ts "your-strong-password"), code:block2 (node -e "console.log(require('crypto').randomBytes(32).toStr), Deployment, Env vars summary, Live URLs, One-time setup, Post-launch checks, Vercel deployment

### Community 17 - "Community 17"
Cohesion: 0.22
Nodes (8): code:block1 (digital-card/), code:tsx ('use client';), code:bash (npx tsc --noEmit), code:bash (git add components/templates/NardoLux.tsx), Digital Card Implementation Plan, File Structure (locked at planning time), Self-Review, Task 9: NardoLux template (client, reads locale from context)

### Community 18 - "Community 18"
Cohesion: 0.22
Nodes (9): code:bash (#!/usr/bin/env bash), code:bash (chmod +x scripts/rollback.sh), code:bash (#!/usr/bin/env bash), code:bash (chmod +x scripts/backup-content.sh), code:markdown (# Rollback Guide), code:block97 (Refuses to run with uncommitted changes. Reverts HEAD and pu), code:block98 (Then commit + push.), code:bash (git add scripts/rollback.sh scripts/backup-content.sh docs/R) (+1 more)

### Community 19 - "Community 19"
Cohesion: 0.29
Nodes (7): code:tsx (import { describe, it, expect, beforeEach } from 'vitest';), code:bash (npm test -- LocaleToggle), code:tsx ('use client';), code:tsx ('use client';), code:bash (npm test -- LocaleToggle), code:bash (git add lib/locale-context.tsx components/LocaleToggle.tsx c), Task 6: LocaleToggle + LocaleContext (client)

### Community 20 - "Community 20"
Cohesion: 0.29
Nodes (7): code:tsx (import { describe, it, expect } from 'vitest';), code:bash (npm test -- SocialIconRow), code:tsx (type Props = { size?: number; color?: string; className?: st), code:tsx (import { Instagram, Linkedin, Github, Youtube } from 'lucide), code:bash (npm test -- SocialIconRow), code:bash (git add components/FalconF.tsx components/SocialIconRow.tsx ), Task 4: FalconF SVG + SocialIconRow

### Community 21 - "Community 21"
Cohesion: 0.29
Nodes (7): code:tsx (import type { Metadata } from 'next';), code:ts (fontFamily: {), code:tsx (import type { Metadata } from 'next';), code:tsx (import { ImageResponse } from 'next/og';), code:bash (npx tsc --noEmit && npm run build), code:bash (git add app/layout.tsx app/[slug]/page.tsx app/[slug]/opengr), Task 15: Fonts + per-card metadata + OG image

### Community 22 - "Community 22"
Cohesion: 0.29
Nodes (7): code:block100 (# Public site URL — used for sitemap, OG image base, canonic), code:markdown (# Digital Card), code:block102, code:markdown (# Deployment), code:block104 (Vercel Hobby rejects deploys whose HEAD author email isn't t), code:bash (git add README.md docs/DEPLOYMENT.md .env.example), Task 19: README + DEPLOYMENT.md + .env.example

### Community 23 - "Community 23"
Cohesion: 0.33
Nodes (4): bodoni, inter, metadata, tharwat

### Community 25 - "Community 25"
Cohesion: 0.33
Nodes (6): code:ts (import { test, expect } from '@playwright/test';), code:bash (npm run test:e2e -- vcard), code:ts (import { NextResponse } from 'next/server';), code:bash (npm run test:e2e), code:bash (git add app/[slug]/contact.vcf/route.ts tests/e2e/vcard.spec), Task 13: vCard download route

### Community 26 - "Community 26"
Cohesion: 0.33
Nodes (6): code:ts (import { describe, it, expect } from 'vitest';), code:bash (npm test -- vcard), code:ts (import type { Card } from '@/data/cards/_types';), code:bash (npm test -- vcard), code:bash (git add lib/vcard.ts lib/__tests__/vcard.test.ts), Task 3: vCard 3.0 builder

### Community 27 - "Community 27"
Cohesion: 0.33
Nodes (6): code:bash (npm audit && npx tsc --noEmit && npm run lint && npm test &&), code:bash (git config user.email                  # expect ahmed0montas), code:bash (git config user.email ahmed0montaser@gmail.com), code:bash (git remote add origin git@github-primary:ForceAI-KW/digital-), code:bash (git tag v0.1.0 -m "first card — Ahmad Sharaf"), Task 20: Final verification + first push

### Community 28 - "Community 28"
Cohesion: 0.33
Nodes (6): code:tsx (import { describe, it, expect } from 'vitest';), code:bash (npm test -- CardLayout), code:tsx (import type { Card } from '@/data/cards/_types';), code:bash (npm test), code:bash (git add components/CardLayout.tsx components/__tests__/CardL), Task 11: CardLayout switcher

### Community 29 - "Community 29"
Cohesion: 0.33
Nodes (6): code:tsx (import { describe, it, expect } from 'vitest';), code:bash (npm test -- ActionButton), code:tsx (import React from 'react';), code:bash (npm test -- ActionButton), code:bash (git add components/ActionButton.tsx components/__tests__/Act), Task 5: ActionButton (pill)

### Community 30 - "Community 30"
Cohesion: 0.33
Nodes (6): code:tsx (import { describe, it, expect, vi, beforeEach } from 'vitest), code:bash (npm test -- ShareButton), code:tsx ('use client';), code:bash (npm test -- ShareButton), code:bash (git add components/ShareButton.tsx components/__tests__/Shar), Task 7: ShareButton (client)

### Community 31 - "Community 31"
Cohesion: 0.33
Nodes (6): code:tsx (import { describe, it, expect } from 'vitest';), code:bash (npm test -- QRModal), code:tsx ('use client';), code:bash (npm test -- QRModal), code:bash (git add components/QRModal.tsx components/__tests__/QRModal.), Task 8: QRModal (client, lazy qrcode)

### Community 32 - "Community 32"
Cohesion: 0.33
Nodes (6): code:ts (import { defineConfig } from '@playwright/test';), code:ts (import { test, expect } from '@playwright/test';), code:tsx (import { notFound } from 'next/navigation';), code:bash (npx playwright install --with-deps chromium), code:bash (git add app/[slug]/page.tsx playwright.config.ts tests/e2e/c), Task 12: Card page route + SSG

### Community 33 - "Community 33"
Cohesion: 0.4
Nodes (5): code:ts (import type { NextConfig } from 'next';), code:tsx (export default function NotFound() {), code:bash (npm run build), code:bash (git add next.config.ts app/not-found.tsx), Task 16: Security headers + image config + 404 page

### Community 34 - "Community 34"
Cohesion: 0.4
Nodes (5): code:yaml (name: CI), code:toml (title = "digital-card gitleaks config"), code:yaml (name: gitleaks), code:bash (git add .github/workflows/ci.yml .github/workflows/gitleaks.), Task 17: CI workflow + gitleaks

### Community 35 - "Community 35"
Cohesion: 0.4
Nodes (5): code:tsx (import { redirect } from 'next/navigation';), code:ts (import type { MetadataRoute } from 'next';), code:ts (import type { MetadataRoute } from 'next';), code:bash (git add app/page.tsx app/robots.ts app/sitemap.ts), Task 14: Root redirect + robots + sitemap

### Community 36 - "Community 36"
Cohesion: 0.5
Nodes (4): code:tsx ('use client';), code:bash (npx tsc --noEmit), code:bash (git add components/templates/ForceBrand.tsx), Task 10: ForceBrand template (client, reads locale from context)

## Knowledge Gaps
- **358 isolated node(s):** `config`, `config`, `config`, `eslintConfig`, `csp` (+353 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Digital Card Implementation Plan` connect `Community 17` to `Community 12`, `Community 14`, `Community 18`, `Community 19`, `Community 20`, `Community 21`, `Community 22`, `Community 25`, `Community 26`, `Community 27`, `Community 28`, `Community 29`, `Community 30`, `Community 31`, `Community 32`, `Community 33`, `Community 34`, `Community 35`, `Community 36`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Why does `Digital Card Admin Panel (v2) — Implementation Plan` connect `Community 1` to `Community 8`, `Community 9`, `Community 11`, `Community 7`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `Task 4: Auth library + middleware + login` connect `Community 7` to `Community 1`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **What connects `config`, `config`, `config` to the rest of the system?**
  _358 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.04 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._