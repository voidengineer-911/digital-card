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
