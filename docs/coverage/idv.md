# /idv coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/cloud/Idv.jsx` · gallery: `docs/gallery/idv/` · metric id: `cta_click idv.hero`

Open copy questions for James: none.
Shared changes requested (`docs/requests/idv.md`): none filed; waiting on `tokens.css`, `lib/cta.js`, `lib/track.js`, `PageHero` to land on main.
Forks this page deleted: the page's own hero shell (Frame `Hero`), hand-made buttons (`.v2-btn` became the kit `Cta`), a second ending (the agent prompt moved mid-page), the sticky phone visual over text (chapters now stack), every spring transition, the kicker added beside the h1

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href are Hanzo's hero ask (`lib/cta.js` is not on main yet)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; no prices on this page
- [x] Open copy questions for James listed, none decided

Done here: `// Persona:` to `// Beyond:` head `components/pages/cloud/Idv.jsx`; the one ask is Hanzo's "View on GitHub" (idv.hero, idv.close). Measured with a headless walk: one solid button on the first screen at 1470×801 and 375×812.

## 2. Information architecture and navigation
- [x] One `<main>`; the layout's skip link reaches `#main`
- [x] Every link through `A` or the kit `Cta`; related cards are real links
- ~~Breadcrumb at depth 2 or more~~ n/a: a depth-1 page
- [x] Link parity: 0 removed, 0 unexpected

Done here: Parity 28/28 text and 2/2 links; Hanzo's header and footer are untouched; every link goes through `A`/`Cta` (`lib/route.js`).

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] Hero built from the kit's line mask (`Lines`) and one object (`PageHero` is not on main yet); nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; loud and quiet sections alternate
- [x] Ends in one close in Hanzo's words ("Get IDV" with the ask), then the footer
- [x] The h1 is the `data-morph-target`, so cards elsewhere open into it

Done here: The first screen is the name, the ask, Hanzo's intro (first sentence in ink at first paint, the rest inked word by word, resting in full ink; it leads on a phone) and one live object: the switchboard where the four calls stay put while the vendor turns (Jumio, Onfido, Plaid, the rest) and the verdict lane answers each one's own way (HMAC-SHA256, polled from the provider, refuse with only "approved" struck). It moves within 1 s, pausable.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn` in the page
- [x] Sticky ask: the shared ask bar carries the hero label (`data-thumb`)
- [x] Copy buttons copy exactly the displayed text (kit `CodeBlock`/`Copy`)
- [x] `data-cta` and `data-thumb` on every primary

Done here: Hero `<Cta thumb id="idv.hero">View on GitHub</Cta>`; the close repeats it (`idv.close`); Hanzo's other buttons are quiet or link Ctas.

## 5. Trust and proof
- [x] No logo, seal or invented number
- [x] Every figure traces to Hanzo's copy
- ~~Marquees pause, freeze, hide duplicates~~ n/a: no marquee
- ~~Privacy link beside every submit~~ n/a: no form submits

Done here: The only figures are Hanzo's own (four calls, the five-year record clock); demos use Hanzo's words, never invented numbers.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px on phones) except 11–12px mono capitals and the kit's own copy label
- [x] Measures held; headings balanced
- [x] Code uses the kit `CodeBlock`
- [x] `python3 scripts/parity.py /idv`: 0 missing

Done here: Parity 28/28 text and 2/2 links. Section labels sit under their headings as captions; phone labels raised to 14px (`components/pages/cloud/Idv.css`).

## 7. Visual design system
- [x] `python3 scripts/taste.py` passes (deck greys only; no hue)
- [x] No label, tag, badge or pill above a headline
- [x] Radii 28 (objects), 16–24 (tiles); one shadow per raised object
- ~~One icon set~~ n/a: no icons beyond the kit's
- [x] Differs from neighbours in hero medium and room order

Done here: Greys from Hanzo's deck only (`taste.py` OK); the vendor-tab hover fill is a deck step, not an invented grey. Hex literals remain in page CSS because `tokens.css` is not on main yet.

## 8. UI component library
- [x] Every control has hover (inside `@media (hover:hover)`), press .97, focus-visible, disabled
- [x] Focus ring is the shared system's
- ~~Dialogs are native, trap focus and return it~~ n/a: no dialog on this page
- [x] Inputs 16px or larger; no bare `:hover` in the page CSS
- [x] Forks this page deleted: listed above

Done here: Kit `Cta`, `CodeBlock`, `Copy` and Cloud 3's `LivePause`; segmented controls get a grey veil on hover and press .97 from `v2scale.css`.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups (`variety.py` OK)
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval` in the page (timers are `setTimeout` chains)
- [x] Sound only on the listed moments, through the one kit (`lib/sound.js`, wired by `components/Sound.jsx`): the ask taps, tabs, radios and pause toggles tick (radios carry `data-sound="tick"`), copy chimes; the demos loop while seen and never finish, so no done chime

Done here: Signature: a verdict, or nothing. Idle: the vendor turns every 3 s while seen (pausable). Pointer: the board leans 2.5°, a vendor hover previews its verdict and names how it answers. State: the vendor pill glides (layoutId); the forge's three choices recompute a real HMAC-SHA256 and the verdict leads with its word (accepted, polled, refusal). Time: the intro inks in. Arrival: sheet titles cut into their line, the 4 counts up, the hash and the KMS tree draw. Scroll: the six sheets stack (outgoing ones step back with a 16px edge, words kept) and the forge opens from a 16px (8px phone) inset kept inside the text gutter (C1 fix: the old 32px inset cut its heading while opening).

## 10. Media
- ~~`Film` and `Pic` only~~ n/a: no photo or film on Hanzo's page
- ~~At most 2 videos; pause on loops~~ n/a: no video
- [x] Nothing missing; no image without alt
- ~~No dimmed photo; 4+ real visuals together~~ n/a: Hanzo's page has no imagery

Done here: Objects are drawn from Hanzo's words (the switchboard, the counting 4, "approved" struck over "refuses", the full-width hash, the polling dots, the KMS tree, IDV beside Risk, the forge); the close is the shared GetIt with its contour art. No Hanzo media exists for this page.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320 (scrollWidth 320)
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: At 375: the lede leads, the four vendors sit in two rows of two (none faded), each sheet shows its title and object before its paragraph, the forge reads provider, callback, choices, verdict in order. `check.mjs` 7 Nov: phone OK; desk flags only the stacked sheets covering the sheet beneath, which is the design (the outgoing sheet keeps a 16px edge, no text in it).

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast: #0a0a0a and #525252 on white and #f5f5f5, #a3a3a3 and white on black
- [x] Pause control (Cloud 3's `LivePause`, 44px, `aria-pressed`) on every self-running object
- [x] Forms labelled
- [x] One h1; no heading skips
- [x] Keyboard reaches every control

Done here: The live object is `aria-hidden` with its pause button outside it; tabs and radios carry `aria-selected`/`aria-checked`; `aria-live` where a demo answers.

## 13. Performance and engineering
- [x] h1 and the hero object are in the server HTML
- [x] Transform, opacity and clip-path only; demo timers run only while on screen
- [x] No poller; no third-party request
- [x] Nothing heavy run on James's laptop (filmed in the cloud)

Done here: Timers stop off screen and when paused (`useLive` and `useTick`); bundle size not measured on this page.

## 14. SEO and machine files
- [x] Title and description from `content/pages.json`
- [x] Canonical through the shared `<JsonLd route="/idv" />`
- [x] `<JsonLd route>` renders; no broken URL
- [x] Every card is a real link

Done here: `app/idv/page.jsx` unchanged: metadata from `content/pages.json` and `<JsonLd route="/idv" />`.

## 15. Catalogue and product pages
- ~~Model card matches `SPEC.md`~~ n/a: not a catalogue or model page
- ~~Every card opens by Morph~~ n/a: no catalogue cards
- ~~Every maker and model page linked~~ n/a: not /models
- ~~One price figure everywhere~~ n/a: no prices

Done here: n/a: a top-level cloud product launch page; its h1 is the `data-morph-target` for cards that open into it.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display
- ~~Config blocks parse on their own~~ n/a: no config block
- ~~Terminal pauses and ends on a static frame~~ n/a: no typed terminal
- [x] No hand-typed version number

Done here: Hanzo's agent prompt use the kit `CodeBlock`, whose Copy copies exactly what is shown.

## 17. States and resilience
- [x] Every state looks intended: static copy, reduced motion and JS off checked
- [x] No live data, so nothing to block; no console errors
- ~~A failed submit keeps its values~~ n/a: n/a: no form posts anywhere; the page's inputs are in-page demos and nothing is sent
- [x] A thrown island leaves the page: the shared `app/error.jsx` keeps header and footer

Done here: If WebCrypto is unavailable the forge keeps the server-rendered verdict for the callback as sent (the HMAC values are in the HTML), and nothing leaves the page; the verdict stamp is `aria-live="polite"`.

## 18. Measurement and handover
- [x] `data-cta` on every primary (the kit `Cta` sends `cta_click`); `lib/track.js` is not on main yet
- [x] Nothing identifier-bearing; no field value in any payload
- [x] `V2: 8/10` line in the page file's top comment
- [x] Review read: no `docs/review/idv.md` yet

Done here: `idv.hero` and `idv.close` on the asks. Gallery: `docs/gallery/idv/` (earlier film and stills plus C1 stills `c1-desk-hero.jpg`, `c1-desk-forge.jpg`, `c1-phone-hero.jpg`). Shared request kept in `docs/requests/cloud2.md` (CodeBlock `overscroll-behavior` under reduced motion).
