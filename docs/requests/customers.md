# Shared requests from /customers and /customers/* (page-local workarounds in place)

1. **Media mirror (MASTER part 10).** Covers and logos (`/customers/<slug>/*.webp`, `/logos/customers/*`, `/logos/partners/*`) are not in `public/`; dev pulls them from hanzo.ai by rewrite. In the cloud box hanzo.ai is blocked, so they 404 (browser "Failed to load resource" lines) and the pages show their designed fallbacks (Sigil plate, names, the graphite figure ledger on case pages). Please mirror them into `public/` with the shared media task.
2. **Doorway hold cap (`components/pages/doorway.js`).** The shared `openDoor` holds the ink until the destination lifts it, with only an 8 s failsafe. /customers wraps it page-locally: 640 ms grow + 700 ms cap, then a non-landing door is removed. A cap inside `openDoor` would cover every page.
3. **Header ask.** The page's ask is "Talk to us"; the shared header carries "Try Hanzo". Not changed (shared chrome).
