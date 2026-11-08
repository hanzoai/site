# Requests from /enterprise and /pricing (one line each)

- Resolved 8 Nov: James vendored the logos; `LOGOS = true`, shown as ink silhouettes (several are white artwork).
- (Was) Logos: `public/logos/customers/*` and `public/logos/partners/*` do not exist, so every logo 404'd (12 console errors). /enterprise now renders the names in type and requests no logo (`LOGOS = false` in `Enterprise.jsx`). Asking the shared owner to vendor the six customer and six cloud logos into `public/logos/`; then flip `LOGOS` to true.
- Header ask: on desktop the shared `Ask.jsx` already swaps the header's solid button to "Get Enterprise plan" once the hero ask has gone by (via `data-thumb`), and nothing floats. If the shared chat wants the quiet header ask to read "Get Enterprise plan" from the first screen too, that is a header change; not hacked here.
- Kit `Band`: with JS off its headline renders blurred (the `Words` entrance is not cleared by the noscript rule). Seen on /enterprise and /pricing by the critic.
- Kit `Film`: no pause control for loops over 5 s (MASTER parts 10 and 12). /enterprise adds a page-local 44px pause button on its Zen film until the kit has one.
- `lib/cta.js`, `lib/plans.js`, `PageHero` and `tokens.css` are not merged yet; both pages carry page-local deck values and Hanzo's own labels until then.
- Resolved here: the "1 Issue" hydration error on /enterprise came from the page's own pause button (`useReducedMotion` differed between server and client). Fixed page-locally; no console error at 1470×801 or 375×812, with or without reduced motion.
