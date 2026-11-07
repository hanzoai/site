# /history: shared change request (7 Nov)

For the owner of `public/` (shared media): the year plates reference Hanzo's own customer media, which are not mirrored into `public/`, and hanzo.ai is not reachable from the cloud sessions to fetch them:
- /logos/customers/skully.png, bellabeat.svg, kanoa.png, unikoin-gold.svg, casper-blockchain.svg, arca.png, damon-motorcycles.svg, trillerfest.png, keek-social.svg
- /customers/kanoa/buds.webp, /customers/damon-motorcycles/reveal.webp

Until they land, each year shows its own customer name and badge as a wordmark plate (`.xhi-plate-word`); the real image replaces it automatically once the file exists.

Still open on 8 Nov (review fix 2): the files above are not in `public/` yet. Each plate now shows the year's own figure large ("$5.8M Raised", "120k ETH", ...) from the first paint, and the picture fades in over it as soon as the file exists, so nothing is said twice in the meantime.

For the shared Ask owner (`components/Ask.jsx`; review fix 6, 8 Nov): on desktop the header reads "Talk to Hanzo FDE" from the hero to the principles, then flips back to an outlined "Try Hanzo" while the closing Band's own "Talk to Hanzo FDE" (`data-cta="history.band"`, `data-thumb`) is on screen, so the label changes twice per visit. Please keep the page's label in the header and only outline it while the Band's ask shows. `usePhoneAsk` is shared with /features and /founder, so this page does not change it.

For the footer owner: the "1 Issue" hydration report the critic saw also named the shared `FooterHTML` `__html`; the page's own part (the Your year `<input>` style) is now `suppressHydrationWarning`.
