# /legal: requests to the shared system

- **Canonical trailing slash (shared metadata/JsonLd).** The canonical is `https://hanzo.ai/legal/`; MASTER says URLs match live with no trailing slash. The page passes no canonical of its own, so this is the shared layout's call.
- **Header tools reach the live API.** Loading /legal (like every page) opens a connection to `api.hanzo.ai:443` from the shared header (`components/HeaderTools.jsx`); the brief says pages must never hit Hanzo's live API. Not page-local.
- **check.cjs and `.x-sr`.** The checker reports "text overlap" between the visually hidden group h2s (`.x-sr`, 1px clipped) and the row labels on phone. False positives: the tool skips `.sr-only`/`.visually-hidden` but not the site's own `.x-sr`.
- **Hydration mismatch seen once.** A single "A tree hydrated but some attributes … didn't match" appeared on one load right after a CSS edit (HMR recompile); 4 later cold loads had 0 errors. If it shows again, the shared header/footer are the first suspects (the page reads reduced motion only after hydration).
