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

## 4. Neon snapshot restore (for migration scenarios)

Each push to `main` triggers the `neon-snapshot` workflow, which creates a `prod-<short-sha>` Neon branch capturing prod data state at that commit. To restore:

1. In Neon dashboard → digital-card → Branches, pick the `prod-<sha>` branch corresponding to the desired commit.
2. Promote it to primary (`neonctl branches set-primary --project-id green-shadow-14491887 <branch>`) OR copy the `DATABASE_URL` from that branch and set it as a Vercel env override, then redeploy.
3. Run `npx prisma migrate deploy` against the new URL to ensure schema is consistent.

**When to use:** if HEAD ran a Prisma migration that altered prod data and you want both schema AND data rolled back. Code-only rollback (`./scripts/rollback.sh`) does NOT undo schema changes.

**Branch hygiene:** the snapshot workflow auto-prunes to keep newest 8 `prod-<sha>` branches. Total Neon branches stay ≤ 10 (`main` + `preview` + ≤ 8 snapshots) — within the free-tier 10-branch cap.

**Required secrets:** `NEON_API_KEY` + `NEON_PROJECT_ID` must be set in GitHub repo secrets. If missing, the workflow exits 0 with a skip message (no snapshot created). Create an API key at https://console.neon.tech/app/settings/api-keys.

## Notes
- HEAD git author email must be `ahmed0montaser@gmail.com` for every push (Vercel Hobby rule).
