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
