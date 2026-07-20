# card.force-ai.co — deploy

The force-ai.co zone has a catch-all FWB Worker route `*/*` → force-web-cf-preview
that hijacks ALL subdomains. So Cloudflare **Pages custom domains don't work** here —
they get shadowed by the store Worker (you'd see the store's Arabic 404 / "Back to store").

Fix: serve the card as a **Worker** with a MORE-SPECIFIC route `card.force-ai.co/*`
(specific routes beat `*/*`).

## Update the card
1. Regenerate the page (from ../build.py) → copy into public/index.html
2. `cd worker && wrangler deploy`   (Worker name: force-card)

DNS: `card` CNAME → forceai-card.pages.dev (proxied) provides the proxied hostname the
route attaches to. The old Pages project `forceai-card` is now just a backup/CNAME target.
