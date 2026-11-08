# /kms coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/cloud/Kms.jsx` · gallery: `docs/gallery/kms/` · metric id: `cta_click kms.hero`

Open copy questions for James: none. (Round 3, conductor rule: the Beyond block's own strings, "Seal one yourself", its paragraph, "value", "ciphertext", "iv" and the error sentence, were removed; it now uses only Hanzo's words: "Sealed on your machine", "The organization key stays on the client.", "DATABASE_PASSWORD", the chain names, and an em dash when WebCrypto is missing.)
Shared changes requested (`docs/build-notes/requests/kms.md`): phone header ask label (and its two solid fills at 375), header glass, FooterHTML hydration, solid-button hover token, `html:not(.js) .v2-in`, `.x-arrow` in v2 dark rooms, 44px phone targets in `Frame` Console and `GetIt`; still waiting on `tokens.css`, `lib/cta.js`, `lib/track.js`, `PageHero`.
Forks this page deleted: the shared three-part tail (the separate `km-proj` console section and `ShipPrompt`; now one page-local screen composed from `Console`, the kit `CodeBlock` and `A`), the page's own hero shell (Frame `Hero`), hand-made buttons (`.v2-btn` became the kit `Cta`), a second ending (the agent prompt moved mid-page), the sticky phone visual over text (chapters now stack), every spring transition, the random-digit scramble, the 112px outlined numeral (now a masked `01 / 06` caption under a rule panel), the version stack's `layout` re-flow (rows now slide by transform in a fixed box), the second filled button in the dark room (GitHub is a text link), the hand-rolled shadows and the off-deck `#f5f5f7`, the Frame code pane (now the kit `CodeBlock`)

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href are Hanzo's hero ask (`lib/cta.js` is not on main yet)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; no prices on this page
- [x] Open copy questions for James listed, none decided

Done here: `// Persona:` to `// Beyond:` head `components/pages/cloud/Kms.jsx`; the one ask is Hanzo's "Open KMS" (kms.hero, kms.close). Measured with a headless walk: one solid button on the first screen at 1470×801 and 375×812.

## 2. Information architecture and navigation
- [x] One `<main>`; the layout's skip link reaches `#main`
- [x] Every link through `A` or the kit `Cta`; related cards are real links
- ~~Breadcrumb at depth 2 or more~~ n/a: a depth-1 page
- [x] Link parity: 0 removed, 0 unexpected

Done here: Parity 87/87 text and 12/12 links; Hanzo's header and footer are untouched; every link goes through `A`/`Cta` (`lib/route.js`).

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] Hero is the name, Hanzo's line and one object; its pieces magnet-gather at first paint (CSS, `.km-mg`) (`PageHero` is not on main yet); nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; loud and quiet sections alternate
- [x] Ends in one close in Hanzo's words ("Get KMS" with the ask), then the footer
- [x] The h1 is the `data-morph-target`, so cards elsewhere open into it

Done here: The first screen is the name, Hanzo's line (now under the h1, above the asks), the ask, and one live object: a vault where DATABASE_PASSWORD passes Argon2id, HKDF-SHA256 and AES-256-GCM, is rotated, refuses a stale writer and records the read under an agent's name. The h1 cuts in by CSS line mask at first paint. Round 2: JS off shows the lede (`html:not(.js) .km .v2-in`, opacity 1 measured); the hero's bottom padding is 56px so Seal follows the vault; "What it holds" is 6 rows at 44svh (about 2.6 screens, was 5) beside a pinned panel that redraws per rule, so no run of near-identical quiet screens. Round 3: the tail is one quiet-room screen (913px desktop, was 730 + 655 + 903 across three white sections): the example console with the vault's DATABASE_PASSWORD v4 docked under it and following the console's rows, the agent prompt beside it, the related links as one hairline row; then one quiet Get KMS. Round 4 (motion map): the hero pieces gather like magnets at first paint, and the h1 no longer cuts in (one entrance per section). "What it holds" is now the spotlight vault room right under the hero, one screen of six sealed cells plus a readout, not 2.6 screens of rules.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn` in the page
- [x] Sticky ask: the shared ask bar carries the hero label (`data-thumb`)
- [x] Copy buttons copy exactly the displayed text (kit `CodeBlock`/`Copy`)
- [x] `data-cta` and `data-thumb` on every primary

Done here: Hero `<Cta thumb id="kms.hero">Open KMS</Cta>`; the close repeats it (`kms.close`); Hanzo's other buttons are quiet or link Ctas.

## 5. Trust and proof
- [x] No logo, seal or invented number
- [x] Every figure traces to Hanzo's copy
- ~~Marquees pause, freeze, hide duplicates~~ n/a: no marquee
- ~~Privacy link beside every submit~~ n/a: no form submits

Done here: The only figures are Hanzo's own (AES-256, K8s, MIT, and the rule numbers 01 to 06); "Every read recorded" is the dark room's one large figure and the rest rest at 26px; demos use Hanzo's words, never invented numbers.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px on phones) except 11–12px mono capitals and the kit's own copy label
- [x] Measures held; headings balanced
- [x] Code uses the kit `CodeBlock`
- [x] `python3 scripts/parity.py /kms`: 0 missing

Done here: Parity 87/87 text and 12/12 links. Section labels sit under their headings as captions; phone labels raised to 14px (`components/pages/cloud/Kms.css`). Round 3: the pinned chapter h2 is 26px over 21px rule h3s; the agent prompt wraps instead of clipping, and the phone terminal fades at its right edge to show it scrolls; no visible string outside `content/live/kms.json` in the Beyond block.

## 7. Visual design system
- [x] `python3 scripts/taste.py` passes (deck greys only; no hue)
- [x] No label, tag, badge or pill above a headline
- [x] Radii 28 (objects), 16–24 (tiles); one shadow per raised object
- ~~One icon set~~ n/a: no icons beyond the kit's
- [x] Differs from neighbours in hero medium and room order

Done here: Greys from Hanzo's deck only, named once as `--km-*` tokens at the top of `Kms.css` (tokens.css is not on main) and used by name everywhere else; `#f5f5f7` is gone and shadows are the deck's floating shadow and a hairline. One dark room (Nothing lands on disk). "Example project" sits under its line as a caption. Round 3: one edge system, every section in the same 1152px container (159 to 1311 at 1470, hero stage included); the tail is a `#f5f5f5` quiet room, not a third white section.

## 8. UI component library
- [x] Every control has hover (inside `@media (hover:hover)`), press .97, focus-visible, disabled
- [x] Focus ring is the shared system's
- ~~Dialogs are native, trap focus and return it~~ n/a: no dialog on this page
- [x] Inputs 16px or larger; no bare `:hover` in the page CSS
- [x] Forks this page deleted: listed above

Done here: Kit `Cta`, `CodeBlock`, `Copy` and Cloud 3's `LivePause`. Round 2: `#km-in` takes the one 2px ink ring with a white halo; the six rule rows get a hairline fill that wipes in on hover (and the hovered rule takes the panel); Documentation's hover fills `#f5f5f5` with an ink edge and presses to .98 (round 3); related links fill white on hover, slide their arrow and press to .98; "View on GitHub" brightens from white 78% to `#fafafa`; the console title underlines. Round 4: the six vault cells are buttons (hover leads the light, click or tap places it, Tab brings it, press .98, 2px white ring); Copy in both code plates lifts its veil and comes to full ink on hover and presses to .98; the hero ask slides an arrow in on hover with its width held (padding trades sides, measured 120px before and after).

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups (`variety.py` OK)
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval` in the page (timers are `setTimeout` chains)
- [x] Sound only on the listed moments, through the one kit (`lib/sound.js`, wired by `components/Sound.jsx`): the ask taps, tabs, radios and pause toggles tick (radios carry `data-sound="tick"`), copy chimes; the demos loop while seen and never finish, so no done chime

Done here: Signature: a secret, sealed and rotated. Idle: the vault loops while on screen; a hairline crosses the rule panel every 4.8 s and the rule redraws. Round 3 tail: the secret strip under the example console steps through the four projects every 2.6 s while seen (pressing the console's own rows, so its highlight moves too), a hairline times each step, the project name cuts in by mask; hover holds it, a click or Enter takes it over, and it has its own `LivePause`. Pointer: the vault tilts up to 2.5 degrees to a mouse (fine pointers, not under reduced motion). State: Seal one yourself re-seals on every keystroke; the panel clip-swaps per rule and its `01 / 06` caption cuts in by mask. Scroll: the panel pins while rules pass; the dark room opens from a rounded card to full width. `variety.py` OK (useScroll, clip reveal); reduced motion: `getAnimations()` empty at 3 s, 3 log lines. Round 4 (motion map: spotlight, entrances magnet-gather, blinds, pendulum, grid-wave, stretch-scroll): the pinned panel and the scrubbed dark-room open are gone. Idle: the light glides cell to cell every 3.6 s and breathes on each (pausable), the vault loops, the host dot breathes, Seal types its own dots and re-seals until the field is taken. Pointer: the light follows the mouse, the vault tilts. Time: the dark room's terminal types its 11 lines once at 40% in view. State: the readout swaps rule with a rise, the lit cell's lines wipe in. Scroll: only the entrances.

## 10. Media
- ~~`Film` and `Pic` only~~ n/a: no photo or film on Hanzo's page
- ~~At most 2 videos; pause on loops~~ n/a: no video
- [x] Nothing missing; no image without alt
- ~~No dimmed photo; 4+ real visuals together~~ n/a: Hanzo's page has no imagery

Done here: Product objects are drawn in HTML and CSS from Hanzo's words; the close carries the product's own Sigil (its figures as data).

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320 (scrollWidth 320)
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: At 375: the vault stacks its secret above its versions and holds one height (625px across a 10 s loop, CLS 0.0016); each rule carries its own picture under its text; the dark room leads with "Every read recorded" then three rows; the Get KMS contour art sits right of the lede. Measured: ask bottom at 303 of 667, scrollWidth 375. Round 3: the phone pause (369 to 414) clears the production tag (428) by 14px; the refused chip sits inside the version box; "Open in the console", the console side links and "Deploy to Cloud" are 44px; scrollWidth 320 at 320. Round 4: the refused write takes the v2 slot (v2 fades out), overlap with any visible row measured 0px at 375 and 1470; the vault room is two columns of 132px cells that open whole to their title when lit, with the readout under them; check.mjs: covered 0, wide 0 at both sizes.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast: #0a0a0a and #525252 on white and #f5f5f5, #a3a3a3 and white on black
- [x] Pause control (Cloud 3's `LivePause`, 44px, `aria-pressed`) on every self-running object
- [x] Forms labelled
- [x] One h1; no heading skips
- [x] Keyboard reaches every control

Done here: The live object is `aria-hidden` with its pause button first in the DOM and now placed at the top right of the secret, the first thing you meet on the object; the rule panel and pictures are `aria-hidden` (the rule text carries the meaning); `aria-live` on the ciphertext. Round 4: each vault cell is a button named by its rule title, `aria-pressed` on the lit one, `aria-describedby` its readout (full rule text always in the DOM); the field has its own `LivePause`. JS off and reduced motion drop the light and show every title and picture.

## 13. Performance and engineering
- [x] h1 and the hero object are in the server HTML
- [x] Transform, opacity and clip-path only; demo timers run only while on screen
- [x] No poller; no third-party request
- [x] Nothing heavy run on James's laptop (filmed in the cloud)

Done here: Timers stop off screen and when paused (`useLive`). Round 2: the vault's version stack and log have fixed heights and rows move by transform only; walk CLS 0.0011 desktop and 0.0016 phone (was 0.023 / 0.020). Round 3 walk: CLS 0.00095 desktop, 0.00004 phone (the console caption holds a fixed height so the stepping never moves it). Bundle size not measured. Round 4: the light moves by two CSS variables and radial masks (no layout), cells hold a fixed height (Hanzo's base CSS forces 44px min-heights on touch, so `height` is used), the readout stacks its six items in one grid cell so it never changes height; walk CLS 0.007 (motion.mjs).

## 14. SEO and machine files
- [x] Title and description from `content/pages.json`
- [x] Canonical through the shared `<JsonLd route="/kms" />`
- [x] `<JsonLd route>` renders; no broken URL
- [x] Every card is a real link

Done here: `app/kms/page.jsx` unchanged: metadata from `content/pages.json` and `<JsonLd route="/kms" />`.

## 15. Catalogue and product pages
- ~~Model card matches `SPEC.md`~~ n/a: not a catalogue or model page
- ~~Every card opens by Morph~~ n/a: no catalogue cards
- ~~Every maker and model page linked~~ n/a: not /models
- ~~One price figure everywhere~~ n/a: no prices

Done here: n/a: a top-level cloud product launch page; its h1 is the `data-morph-target` for cards that open into it.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display
- ~~Config blocks parse on their own~~ n/a: no config block
- [x] Terminal types once and ends on its static frame (about 4 s, so no pause needed)
- [x] No hand-typed version number

Done here: Hanzo's agent prompt and the CLI use the kit `CodeBlock`, whose Copy copies exactly what is shown. Round 4: the dark room's CLI types line by line once when 40% in view (CSS clip per line; the text is in the HTML from the start, so Copy still equals display).

## 17. States and resilience
- [x] Every state looks intended: static copy, reduced motion and JS off checked
- [x] No live data, so nothing to block; no console errors
- ~~A failed submit keeps its values~~ n/a: n/a: no form posts anywhere; the page's inputs are in-page demos and nothing is sent
- [x] A thrown island leaves the page: the shared `app/error.jsx` keeps header and footer

Done here: Sealed on your machine shows an em dash without WebCrypto; nothing is sent. A headless JS-off pass shows every word.

## 18. Measurement and handover
- [x] `data-cta` on every primary (the kit `Cta` sends `cta_click`); `lib/track.js` is not on main yet
- [x] Nothing identifier-bearing; no field value in any payload
- [x] Top comment carries the round-4 change log (no score line: James, 7 Nov, no x/10)
- [x] Review read: `docs/build-notes/review/kms.md` (round 1, 6/10), every fix answered

Done here: `kms.hero` and `kms.close` on the asks. Gallery: `docs/gallery/kms/` (round 1 film and stills; round 2 `round2-desktop.jpg`, `round2-desktop-holds.jpg`, `round2-phone.jpg`). Review `docs/build-notes/review/kms.md` (6/10) read and its fixes 1 to 9 done; fix 10 is shared chrome, filed in `docs/build-notes/requests/kms.md`. Round 3: review (7/10) fixes 1 and 3 to 8 done page-locally, fix 2 done by the conductor's copy rule (Beyond strings removed, no copy questions), fix 9 filed; proof `round3-desktop-tail.jpg`, `round3-phone-tail.jpg`, `round3-phone-hero.jpg`. Round 4: review round 3 (7/10) fixes 1, 3, 4, 6, 7 done; 2 and 5 concerned the pinned rule panel, which the motion-map rebuild replaced with the spotlight vault (styled this round, never blank: a cell is always lit); 8 stays filed in `docs/build-notes/requests/kms.md`. Proof `docs/gallery/kms/round4-*.jpg`.
