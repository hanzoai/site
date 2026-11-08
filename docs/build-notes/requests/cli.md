# /cli: requests (shared changes this page cannot make)

1. **Header ask label (shared chrome: `components/Chrome.jsx` / `HeaderTools.jsx`, and `lib/cta.js` once it exists).**
   Review `docs/build-notes/review/cli.md` fix 2 asks for this page's ask, "Install from hanzo.sh" (href `https://docs.hanzo.ai/docs/cli`, event id `cli.header`), in the sticky header on /cli instead of the site-wide "Try Hanzo".
   Status (round-2 review): on desktop the shared header already swaps to the solid "Install from hanzo.sh" after the hero. On phone it still says "Try Hanzo"; please apply the same swap at phone width.
   Request: let a page register its header ask ({page: '/cli', label: 'Install from hanzo.sh', href: 'https://docs.hanzo.ai/docs/cli', id: 'cli.header'}) through `lib/cta.js`, and have the header read it. Until then the header keeps "Try Hanzo" and this page carries its ask as the hero solid and the closing Band solid. No floating bar was added (the desktop pill is gone site-wide, d2b5ab8c).

2. **`components/v2/x-edison/AppLines.jsx` (shared).** Under reduced motion it renders `initial={false}` on the client but `translateY(108%)` in the server HTML, which throws a React hydration mismatch, and with JS off its lines stay masked (inline `transform: translateY(108%)`). /cli now uses a page-local copy, `components/pages/cli/Cut.jsx`, whose server HTML is the final frame and whose mask is a `.js`-scoped CSS class. Suggest the same fix in the shared file.

3. **`Band` `id` prop (kit).** Still open from `docs/build-notes/requests/apps1.md`: the closing Band here is page-local so its solid carries `data-cta="cli.band"`.
