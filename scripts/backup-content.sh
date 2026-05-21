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
