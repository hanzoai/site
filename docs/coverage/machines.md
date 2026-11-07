# /machines coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/cloud/Machines.jsx` · gallery: `docs/gallery/machines/` · metric id: `signup_start (cta_click machines.hero)`

Open copy questions for James: (1) the hero quote's 2x and 4x rows ($6.96, $55.68, $5,081, 160 GB; $13.92, $111.36, $10,162, 320 GB) are not in `content/live/machines.json`, which captured only the 1x quote ($3.48, $27.84, $2,540, 80 GB); they are the 1x rate times the cards with one rounding rule (cents on the hour and the day, whole dollars on the month, as Hanzo's $2,540). Keep, or show only the 1x quote? (2) The "Tech specs" caption above the spec sheet was not Hanzo's copy and was removed; restore it only if James wants a label there.
Shared changes requested (`docs/requests/machines.md`): cookie card size, the header strip near the page end, the PinChapters crossfade (fixed page-locally), `tokens.css` (page tokens declared locally until it lands).
Forks this page deleted: the page's own hero shell (Frame `Hero`), hand-made buttons (`.v2-btn` became the kit `Cta`), a second ending (the agent prompt moved mid-page), the sticky phone visual over text (chapters now stack), every spring transition; round 2: the three-column spec wall, the shared `GetIt` contour close (the close is the page's own rack), the step console's six sets of boxes and its traffic-light dots, the invented console labels, the "Tech specs" label

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href are Hanzo's hero ask (`lib/cta.js` is not on main yet)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices only from the page's own quote
- [x] Open copy questions for James listed, none decided

Done here: `// Persona:` to `// Beyond:` head `components/pages/cloud/Machines.jsx`; the one solid fill is Hanzo's "Try Hanzo" (`#fafafa` on black, machines.hero; repeated in the close, machines.close). "View Documentation" is now a text link (white 78%, 1px underline, no fill), so the primary is the only fill in the hero.

## 2. Information architecture and navigation
- [x] One `<main>`; the layout's skip link reaches `#main`
- [x] Every link through `A` or the kit `Cta`; related cards are real links
- ~~Breadcrumb at depth 2 or more~~ n/a: a depth-1 page
- [x] Link parity: 0 removed, 0 unexpected

Done here: Parity 106/106 text and 7/7 links after round 2; Hanzo's header and footer are untouched; the close's GitHub chip and "Deploy to Cloud" go through `A`/`Cta`.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] Hero built from the kit's line mask (`Lines`) and one object (`PageHero` is not on main yet); nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; loud and quiet sections alternate
- [x] Ends in one close in Hanzo's words ("Get Machines" with the ask), then the footer
- [x] The h1 is the `data-morph-target`, so cards elsewhere open into it

Done here: At 1470x801 the `$3.48 / h` moment now sits at y 626 to 711, inside the fold, and the rack and quote stay inside the gutters (`.mc-rent` 85 to 1385; Lift settles from 1.04, not 1.12). Section breaks alternate 116 and 188px (specs 116/72, uses 188/116, own 72/116, ship 116/72, close 116) instead of 161.7px everywhere. The close is the page's own object: the four-card rack waking one card after another.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn` in the page
- [x] Sticky ask: the shared ask bar carries the hero label (`data-thumb`)
- [x] Copy buttons copy exactly the displayed text (kit `CodeBlock`/`Copy`)
- [x] `data-cta` and `data-thumb` on every primary

Done here: Hero `<Cta thumb id="machines.hero">Try Hanzo</Cta>` with a 2px rise and a white ring on hover (measured `translateY(-2px)`, outline white 55%); the close repeats it (`machines.close`) beside "Deploy to Cloud" (`machines.deploy`, link).

## 5. Trust and proof
- [x] No logo, seal or invented number
- [x] Every figure traces to Hanzo's copy
- ~~Marquees pause, freeze, hide duplicates~~ n/a: no marquee
- ~~Privacy link beside every submit~~ n/a: no form submits

Done here: $3.48, $27.84, $2,540, 80 GB and every spec value are Hanzo's; the 2x and 4x quote rows are derived from the 1x rate and listed as a copy question above, now with one rounding rule ($111.36, not $111).

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px on phones) except 11–12px mono capitals and the kit's own copy label
- [x] Measures held; headings balanced
- [x] Code uses the kit `CodeBlock`
- [x] `python3 scripts/parity.py /machines`: 0 missing

Done here: Parity 106/106 text and 7/7 links. The renting console quotes fragments of each step's own sentence ("returns the price and creates nothing", "one fleet, deduplicated", "Unbinding is separate"); no label outside Hanzo's copy remains. The agent prompt now wraps instead of clipping (scrollWidth 818 = clientWidth 818).

## 7. Visual design system
- [x] `python3 scripts/taste.py` passes (deck greys only; no hue)
- [x] No label, tag, badge or pill above a headline
- [x] Radii 28 (objects), 16–24 (tiles); one shadow per raised object
- ~~One icon set~~ n/a: no icons beyond the kit's and the GitHub mark
- [x] Differs from neighbours in hero medium and room order

Done here: Every value in `Machines.css` reads a page token (`--mc-*` on `.mc`, the deck ramp only: `#000` to `#fff`, `#e4e4e7`); the off-deck Apple greys (`#f5f5f7`, `#1c1c1e`, `#111112`, `#161617`, `#2c2c2e`, `#e3e3e6`) are gone. `tokens.css` is not on main, so the tokens are declared once on the page (requested). The stale "Accent: green" comments are deleted.

## 8. UI component library
- [x] Every control has hover (inside `@media (hover:hover)`), press .97, focus-visible, disabled
- [x] Focus ring is the shared system's
- ~~Dialogs are native, trap focus and return it~~ n/a: no dialog on this page
- [x] Inputs 16px or larger; no bare `:hover` in the page CSS
- [x] Forks this page deleted: listed above

Done here: Measured hovers: size tabs `#a3a3a3` to `#fafafa`; spec rows, owner rows and related links fill `#f5f5f5`; tiles tilt (up to 2.5°) and run their diagram; the chapter dots get a soft well. Desktop walk: 1 of 14 hover targets unchanged (the size tab that was selected). Tapping the selected size re-rolls the quote.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups (`variety.py` OK)
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval` in the page (timers are `setTimeout` chains)
- [x] Sound only on the listed moments, through the one kit (`lib/sound.js`, wired by `components/Sound.jsx`): the ask taps, tabs, radios and pause toggles tick (radios carry `data-sound="tick"`), copy chimes; the demos loop while seen and never finish, so no done chime

Done here: Kept: the card wake-up, the rolling price, the gliding size pill, the Lift settle. Added: pointer (tile tilt, hover-run diagrams), arrival (80 counts up once from 10 as the H100 card lights; the close rack wakes card by card), time (the renting console streams its request then its answer by line mask). Step text now cuts: out in 150 ms, in from 180 ms, body by clip-path, so two steps never overlap (sampled: 1 visible step in 12 of 12 frames).

## 10. Media
- ~~`Film` and `Pic` only~~ n/a: no photo or film on Hanzo's page
- ~~At most 2 videos; pause on loops~~ n/a: no video
- [x] Nothing missing; no image without alt
- ~~No dimmed photo; 4+ real visuals together~~ n/a: Hanzo's page has no imagery

Done here: Product objects are drawn in HTML and CSS from Hanzo's words: the hero rack and quote, the single H100 card by its specs, the renting console, the tile diagrams and the closing rack.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320 (scrollWidth 320)
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: At 375 the rack stacks above the quote, the spec moment then the list, each step with its own console sized to its content (no empty panel), tiles one per row and owner rows two columns. Touch: each tile's diagram runs once when it is on screen (`data-run`), the hover's tap equivalent. Walk: overflowX 0, CLS 0.0003.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast: #0a0a0a and #525252 on white and #f5f5f5, #a3a3a3 and white on black
- [x] Pause control (Cloud 3's `LivePause`, 44px, `aria-pressed`) on every self-running object
- [x] Forms labelled (no form fields)
- [x] One h1; no heading skips
- [x] Keyboard reaches every control

Done here: Headings now run h1, then h2 (26px: NVIDIA H100, How renting one works, When you want a whole machine, Whose machine it is, Paste and ship, Get Machines) with h3 at 21px under each; the spec sheet no longer jumps from h1 to h3. The docs link is white 78% on black (well over 4.5:1).

## 13. Performance and engineering
- [x] h1 and the hero object are in the server HTML
- [x] Transform, opacity and clip-path only; demo timers run only while on screen
- [x] No poller; no third-party request
- [x] Nothing heavy run on James's laptop (filmed in the cloud)

Done here: New motion is transform, opacity and clip-path (row fills are `::before` opacity, the cell fills `::after` scale; the related links fade a background colour like the kit buttons); the count uses Motion's `animate` once; timers stop off screen and when paused (`useLive`, `useSteps`).

## 14. SEO and machine files
- [x] Title and description from `content/pages.json`
- [x] Canonical through the shared `<JsonLd route="/machines" />`
- [x] `<JsonLd route>` renders; no broken URL
- [x] Every card is a real link

Done here: `app/machines/page.jsx` unchanged: metadata from `content/pages.json` and `<JsonLd route="/machines" />`.

## 15. Catalogue and product pages
- ~~Model card matches `SPEC.md`~~ n/a: not a catalogue or model page
- ~~Every card opens by Morph~~ n/a: no catalogue cards
- ~~Every maker and model page linked~~ n/a: not /models
- [x] One price figure everywhere (the page's own quote)

Done here: n/a for cards: a top-level cloud product launch page; one rounding rule for every quote figure (cents on hour and day, whole dollars on the month).

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display
- ~~Config blocks parse on their own~~ n/a: no config block
- ~~Terminal pauses and ends on a static frame~~ n/a: no typed terminal
- [x] No hand-typed version number

Done here: Hanzo's agent prompt uses the kit `CodeBlock` (via `ShipPrompt`); it wraps on the page (`pre-wrap`), and Copy still copies exactly the displayed text.

## 17. States and resilience
- [x] Every state looks intended: static copy, reduced motion and JS off checked
- [x] No live data, so nothing to block; no console errors
- ~~A failed submit keeps its values~~ n/a: no form posts anywhere; the page's inputs are in-page demos and nothing is sent
- [x] A thrown island leaves the page: the shared `app/error.jsx` keeps header and footer

Done here: Server HTML carries the true 80 (the count only arms when the figure is below the fold and motion is allowed); reduced motion lights the H100 card and the closing rack at once. Console: only the shared FooterHTML hydration mismatch.

## 18. Measurement and handover
- [x] `data-cta` on every primary (the kit `Cta` sends `cta_click`); `lib/track.js` is not on main yet
- [x] Nothing identifier-bearing; no field value in any payload
- [x] `V2: 8/10` line in the page file's top comment
- [x] Review read: `docs/review/machines.md` (6/10), all ten fixes worked through

Done here: `machines.hero`, `machines.close` and `machines.deploy` on the asks. Gallery: `docs/gallery/machines/` (round 1 film and stills; round 2 `round2-desktop.jpg`, `round2-specs.jpg`, `round2-phone.jpg`).
