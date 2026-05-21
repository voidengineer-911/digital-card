# Deployment

## Live URLs

- **Production:** https://digital-card-pi-seven.vercel.app
- Inspect (Vercel dashboard): https://vercel.com/ahmad-sharafs-projects/digital-card
- Repo: https://github.com/ForceAI-KW/digital-card
- First deployed: 2026-05-21

## Vercel deployment

### One-time setup

1. **Neon project**: created via `neonctl projects create --name digital-card`. Branches: `main` (prod) + `preview` (long-lived staging). Both connection strings paired with `DATABASE_URL` + `DIRECT_URL` env vars in Vercel:
   - Production env → `main` branch pooled + direct URLs
   - Preview env → `preview` branch pooled + direct URLs
   - **Rule 13 CI gate** (in `.github/workflows/ci.yml`) fails the build if these are equal.

2. **Vercel Blob**: connected via dashboard → Storage → Vercel Blob → Create. `BLOB_READ_WRITE_TOKEN` auto-injected to all envs.

3. **Admin password**:
   ```
   npx tsx scripts/hash-password.ts "your-strong-password"
   # → <saltHex>:<hashHex>
   ```
   Then `printf '<hash>' | vercel env add ADMIN_PASSWORD_HASH production` (use `printf`, not `echo`, to avoid the trailing-newline trap).

4. **JWT secret**:
   ```
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```
   `printf '<value>' | vercel env add ADMIN_JWT_SECRET production`

5. **GitHub secrets** (for CI workflows):
   - `VERCEL_TOKEN` — `vercel tokens create digital-card-ci` (or via dashboard)
   - `NEON_API_KEY` — Neon dashboard → Account Settings → API Keys
   - `NEON_PROJECT_ID` — `neonctl projects list --output json | jq -r '.[] | select(.name=="digital-card") | .id'`

### Env vars summary

| Name | Production | Preview | Development | Notes |
|---|---|---|---|---|
| `DATABASE_URL` | prod Neon branch | preview Neon branch | preview Neon branch | rule 13: MUST differ between prod + preview |
| `DIRECT_URL` | prod direct | preview direct | preview direct | |
| `ADMIN_PASSWORD_HASH` | ✓ | — | ✓ | scrypt `<salt>:<hash>` |
| `ADMIN_JWT_SECRET` | ✓ | — | ✓ | 32+ bytes base64 |
| `BLOB_READ_WRITE_TOKEN` | ✓ (auto) | ✓ (auto) | pulled via `vercel env pull` | |
| `NEXT_PUBLIC_SITE_URL` | `https://<domain>` | blank or staging | `http://localhost:3000` | rule 13: different from prod |

### Post-launch checks

- [ ] `/robots.txt` returns allow-all
- [ ] `/sitemap.xml` lists every slug (from DB)
- [ ] `/ahmad/contact.vcf` downloads with PHOTO line
- [ ] Locale toggle flips html dir ltr ↔ rtl
- [ ] CSP + HSTS + nosniff + frame-deny present
- [ ] `/admin` redirects to `/admin/login` when no cookie
- [ ] `/admin` reachable with correct password; rate-limits 6th attempt within 15 min
- [ ] CRUD admin flow completes (create → edit → delete) with revalidation
- [ ] UptimeRobot monitor on `/ahmad` (rule 6)
