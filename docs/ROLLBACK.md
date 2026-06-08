# Rollback Guide

Four paths, fastest first.

## 1. Vercel instant rollback (≤30 s)
Open Vercel → Project: digital-card → Deployments → pick a previous green deploy → "Promote to Production". No git changes; the previous artifact serves immediately.

## 2. Git-revert (≤2 min)
```
./scripts/rollback.sh
```
Refuses to run with uncommitted changes. Reverts HEAD and pushes; Vercel auto-redeploys.

## 3. DB backup restore (≤5 min)
Card content lives in Neon Postgres; photos live in Vercel Blob. Daily local pg_dump backups are taken automatically by launchd (`com.forceai.neon-backup`) and stored at `~/Desktop/projects/_backups/digital-card/` (30-day retention).

To restore from a local dump:
```
pg_restore -d "$DATABASE_URL" ~/Desktop/projects/_backups/digital-card/<file>.dump
```
Then redeploy or trigger ISR revalidation as needed.

> Note: `data/` and `public/photos/` directories were removed in v2; content is no longer stored in git.

## 4. Neon point-in-time restore (for migration scenarios)

> **Note (2026-06-08):** The per-commit `prod-<sha>` Neon snapshot workflow (`neon-snapshot.yml`) has been **retired** fleet-wide due to branch-accumulation cost. The workflow file is disabled. DR is now daily local pg_dump (see §3 above).

For schema + data rollback after a bad migration:

1. Identify the last-good local dump at `~/Desktop/projects/_backups/digital-card/`.
2. Restore to a fresh Neon branch:
   ```
   neonctl branches create --project-id green-shadow-14491887 --name recovery-<date>
   pg_restore -d "<recovery-branch-url>" ~/Desktop/projects/_backups/digital-card/<file>.dump
   ```
3. Point production at the recovery branch by updating `DATABASE_URL` + `DIRECT_URL` in Vercel env vars, then redeploy.
4. Run `npx prisma migrate deploy` if the target schema differs.
5. Delete the recovery branch once stable to stay within the free-tier 10-branch cap.

**When to use:** if HEAD ran a Prisma migration that altered prod data and you want both schema AND data rolled back. Code-only rollback (`./scripts/rollback.sh`) does NOT undo schema changes.

## Notes
- HEAD git author email must be `ahmed0montaser@gmail.com` for every push (Vercel Hobby rule).
