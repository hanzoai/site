# /blockchain (the overview) coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/blockchain/BlockchainIndex.jsx` (+ `BlockchainIndex.css`) · gallery: `docs/gallery/blockchain/` (desktop.mp4, desktop-hero.jpg, phone-1..3.jpg) · metric id: `signup_start` (the catalogue's action: open a card)

Open copy questions for James: none (Hanzo's "Try Hanzo" and "View Pricing" kept as live; "Try Hanzo" → /signup and "View Pricing" → /pricing?tab=blockchain as the v1 page mapped them).
Shared changes requested (`docs/build-notes/requests/<page>.md`): none. The /blockchain/* family files (`BlockPage.jsx`, `Directory.jsx`, `blockchain.css`, `bcData.js`) belong to another group and are untouched.
Forks this page deleted: `BizAsk` (now kit `Cta`), the v2 `AskBar`, the raw `<table>` matrix (now kit `DataTable`), the hand-built code window (now kit `CodeBlock`), the `data-cursor` label, every hover lift and spring.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js`
- [x] Open copy questions for James listed, none decided

Done here: Header carries Persona, Metric, Goal, CTA, Signature, Beyond and V2. The header's "Try Hanzo" is the one solid fill; the page's own "Try Hanzo" (same words) is the solid `Cta` in the hero (the only black on the first screen; the product pills are quiet grey) and in the close; the header rests quiet until the hero ask leaves. `lib/cta.js` and `lib/plans.js` do not exist yet; the live labels and hrefs are used; no prices on this page.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- ~~Breadcrumb at depth 2 or more~~ n/a: /blockchain is depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: One `<main>`; the shell's skip link targets `#main`. All 19 pieces are real `<A>` links to their /blockchain/* page; matrix rows link to each product; parity links 16/16.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero`; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer
- [x] Card-to-page links use Morph; title lands within 12px

Done here: h1 at 52px (CSS line cut-in), the ask beside it with "Now Available" and the free-tier line as captions, then the `chain:` reel at 64px whose first roll comes at 0.9s; server HTML has 0 `opacity:0` runs. Sequence: reel, pieces index, groups (quiet room), agent (dark), matrix, close. Each piece's name carries `data-morph` and lands on the family page's `data-morph-target` h1 (checked: a click on "Hanzo Chains" opens /blockchain/chains).

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text; failure never says Copied
- [x] `data-cta` and `data-thumb` on every primary

Done here: `<Cta id="blockchain.hero|blockchain.close" kind="solid" thumb>Try Hanzo</Cta>`; the site's header and bar carry "Try Hanzo" (named by `data-ask-name="Hanzo Blockchain"`). The agent code copies through the kit `CodeBlock` (copies the displayed text, says Copied only on success).

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- ~~Marquees pause, freeze under reduced motion, hide duplicates~~ n/a: no marquee (the reel is paused by its own button)
- ~~Privacy link and owner line beside every submit~~ n/a: no form

Done here: The counts shown (k / 15 product pages name a chain, "36 chains on its page", matrix totals across and down) are counted at build time from Hanzo's own product pages via `bcData.js`, each labelled with what it counts.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts
- [x] `python3 scripts/parity.py /<path>`: 0 missing

Done here: Parity text 153/153, links 16/16. 0 text under 14px at 375 except the kit `CodeBlock` (13.5px code, the MASTER spec). The matrix is `DataTable` (caption, scope headers, sticky first column, own scroll region); code is `CodeBlock`; 19 pieces collapse to 8 (5 on a phone) with a true count ("Show all 19 pieces", checked on phone: 5 → 19 → 5), all in the HTML.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: taste OK; greys snapped to the deck ramp and `--bz-*` tokens; radii 6/8/12/16/full; no drop shadows; sizes h1 52, headings 26, the reel 64 (key 26), piece names 21, body 16. Hero medium is a single typographic argument with product chips, unlike the family's product heroes.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs are native, trap focus and return it
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: listed below

Done here: Pause, show-all, group toggles, index rows (arrow +8px and line +4px, even on the row the stage already holds), close rows (arrow +6px) and matrix cells answer hover with a fill (inside `@media (hover: hover)`), press .97–.995, and a 2px ring; `Cta` brings busy/disabled. No dialogs or inputs on this page. Deleted: see the top of this card.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- ~~Sound only on the listed moments, through the one kit~~ n/a: the page plays no sound of its own

Done here: Signature: the reel (idle, a 0.5s translateY every 2s, first after 0.9s); supporting: line cut-ins (arrival), the card-to-page morph (state), the matrix answering the pointer. variety OK, 0 Rise, no springs. One `setTimeout` chain while seen and not paused; reduced motion holds Ethereum.

## 10. Media
- ~~`Film` and `Pic` only; sizes and posters set~~ n/a: no photo or film on this page
- ~~At most 2 videos playing~~ n/a
- [x] Budgets met; nothing missing; alt on every image
- ~~No dimmed or filtered photo; 4+ real visuals together~~ n/a: Hanzo's overview has no media

Done here: No image requests; the only graphics are CSS (dots, chips) and the kit's icons.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: Width 375/375 and 1470/1470 in the film; phone h1 3 lines at 40px, the product pills one swipe row that never reflows (CLS 0); 0 targets under 44px; the matrix scrolls inside its own region with the product column pinned, cells 44px tall and tap to light; the ask sits at ~290px on a phone, the reel inside the first 660px.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: Text uses ink, `#525252`, `#737373` on white and `#525252` on `#f5f5f5`; the dim chips use `#a3a3a3` on white only as an off state beside ink "on" chips. The reel has a 44px Pause (`aria-pressed`) and an sr-only "chain: <value>". One h1, h2 per section; toggles use `aria-expanded`; every matrix dot has an aria-label; the readout is `aria-live`.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: Data is read on the server (`app/blockchain/page.jsx` → `bcData.js`) and every piece, group sentence, chain and matrix cell is in the server HTML; motion is transform only. Filmed in the cloud container.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: `app/blockchain/page.jsx` unchanged (metadata from `metaOf('/blockchain')`, `<JsonLd route="/blockchain" />`); 19 piece cards and 15 matrix rows are real links.

## 15. Catalogue and product pages
- ~~Model card matches `SPEC.md`~~ n/a: no model cards on this page
- [x] Every card opens by Morph
- [x] Every maker and model page linked in the DOM
- ~~One price figure everywhere~~ n/a: no prices

Done here: Every piece links to its /blockchain/* page with `data-morph` on its name; all 16 family destinations from the live page are linked (16/16), including the 11 hidden until "Show all".

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (or n/a: no code on the page)
- ~~Config blocks parse on their own~~ n/a: the sample is TypeScript, not config
- ~~Terminal pauses and ends on a static frame~~ n/a: no terminal
- [x] No hand-typed version number

Done here: Hanzo's `hanzo-agent.ts` sample renders through the kit `CodeBlock` (13.5/1.65, comments dimmed, Copy equals display); no version numbers are typed.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed
- [x] Blocked live data leaves a complete page, no console errors
- ~~A failed submit keeps its values and shows no success~~ n/a: nothing is submitted
- [x] A thrown island does not blank the page

Done here: No live data at view time (built from Hanzo's pages), so the page is complete offline; the reel has playing, paused and reduced states; the matrix has an idle prompt ("Point at a cell, or tap one") and a readout for named and not-named pairs. 0 console errors in the film.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js`
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/build-notes/review/<page>.md` verdict 8 or more

Done here: `data-cta="blockchain.hero"` and `"blockchain.close"`; `Cta` dispatches `cta_click` with the id only. V2 line updated; `docs/build-notes/review/blockchain-family.md` covers the /blockchain/* template (another group), and no review of this overview exists yet, so its verdict is pending a critic.
