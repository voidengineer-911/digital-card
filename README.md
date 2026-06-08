# Digital Card

Personal + team digital business cards. Bilingual AR/EN. Two visual templates (Nardo Lux · Force Brand). Next 16 · Prisma 7 · Neon · Vercel Blob · admin CRUD. ISR (revalidate=3600) for public routes, force-dynamic for /admin.

## Development
```
npm install
npm run dev          # http://localhost:3000
npm test             # unit tests
npm run test:e2e     # Playwright smoke
npm run build        # server-bundle build
```

## Adding a card
Cards are managed through the `/admin` CRUD panel — no TypeScript file editing required.

1. Open `/admin` and log in with the `ADMIN_PASSWORD_HASH` credential.
2. Use the Create Card form to enter slug, name, title, links, and upload a photo.
3. Vercel ISR revalidates public card pages automatically.

> Note: `data/cards/` and `public/photos/` directories were removed in v2. Do not attempt to add cards by editing TypeScript files.

## Templates
- `lux` — Nardo Lux (white/black/Nardo grey, Bodoni Moda italic name, full-pill buttons)
- `force` — Force Brand (wine/orange/cream, Inter, wordmark swap via `brand: 'force-ai' | 'force-media'`)

## Admin panel
URL: `/admin` (redirects to `/admin/login` when unauthenticated)

Required env vars:
| Var | Description |
|---|---|
| `ADMIN_PASSWORD_HASH` | scrypt hash — generate: `npx tsx scripts/hash-password.ts "your-password"` |
| `ADMIN_JWT_SECRET` | 32+ bytes base64 — generate: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token — injected automatically when Blob storage is connected |

Photos are stored in Vercel Blob (not in `public/`). See `docs/DEPLOYMENT.md` for full setup.

## Rollback
See `docs/ROLLBACK.md`. Four paths: Vercel-instant · `./scripts/rollback.sh` · DB backup restore · Neon branch restore.

## License
UNLICENSED — proprietary.
