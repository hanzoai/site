# /ingress coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/cloud/Ingress.jsx` · gallery: `docs/gallery/ingress/` · metric id: `cta_click ingress.hero`

Open copy questions for James: none. Round 3 (conductor copy rule) removed every invented visible string: the Beyond's h2 is now Hanzo's own sentence "Name one in an annotation, or chain several into a named pipeline and name that."; the chain's ends read "hanzo.ai" and "backend"; the empty chain shows an em dash; the board's labels are "hostname", "middleware", "backend", its routes are hanzo.ai/skill.md, docs/index.html and pricing.html (all on the page), its notes are Hanzo's "out of rotation", "put back when it recovers", "no reload, no dropped connection", "from disk"; the invented example hostnames, backend names, "certificate…" and the "Drag" cursor label are gone.
Shared changes requested (`docs/requests/ingress.md`): the phone header ask swap (second solid fill), the cookie card over the hero board, ShipPrompt's 32px Copy (wants 44px), the hero ask's hover (done page-local meanwhile). GetIt's spacing is now done page-local. Still waiting on `tokens.css`, `lib/cta.js`, `lib/track.js`, `PageHero` to land on main.
Forks this page deleted: the page's own hero shell (Frame `Hero`), hand-made buttons (`.v2-btn` became the kit `Cta`), a second ending (the agent prompt moved mid-page), the sticky phone visual over text (chapters now stack), every spring transition, Frame `useEvery` (now `useTick`)

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href are Hanzo's hero ask (`lib/cta.js` is not on main yet)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; no prices on this page
- [x] Copy questions: none (invented strings removed, round 3)

Done here: `// Persona:` to `// Beyond:` head `components/pages/cloud/Ingress.jsx`; the one ask is Hanzo's "View on GitHub" (ingress.hero, ingress.close). Measured with a headless walk: one solid button on the first screen at 1470×801 and 375×812.

## 2. Information architecture and navigation
- [x] One `<main>`; the layout's skip link reaches `#main`
- [x] Every link through `A` or the kit `Cta`; related cards are real links
- ~~Breadcrumb at depth 2 or more~~ n/a: a depth-1 page
- [x] Link parity: 0 removed, 0 unexpected

Done here: Parity 29/29 text and 2/2 links; Hanzo's header and footer are untouched; every link goes through `A`/`Cta` (`lib/route.js`).

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] Hero built from the kit's line mask (`Lines`) and one object (`PageHero` is not on main yet); nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; loud and quiet sections alternate
- [x] Ends in one close in Hanzo's words ("Get Ingress" with the ask), then the footer
- [x] The h1 is the `data-morph-target`, so cards elsewhere open into it

Done here: The first screen is the name, Hanzo's line, the ask, ports 80 and 443 as figures (64px), and one live object: a routing board (titled hanzoai/ingress) where requests arrive at hanzo.ai paths, pass middleware and land on a backend; a pod leaves rotation and comes back; the certificate is issued at load (Let's Encrypt) and only the middle of the loop waits for it. Round 3: the middleware box holds two chips' height, so its label no longer jumps (y 556 at all 12 samples); the board-to-"What happens at the edge" gap is down from about 360px to about 180px. The h1 (52px, 40px on phones) cuts in by CSS line mask at first paint, so it moves in under 1 s with no script; a headless JS-off pass found 0 hidden text blocks (entrance states hide only under `html.js`). Round 2: the empty "What happens at the edge" screen is gone (the h2 rides in the first wipe scene), and the black room enters as a rounded card (inset 32px, radius 28) that opens to full width as it reaches 25% of the viewport.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn` in the page
- [x] Sticky ask: the shared ask bar carries the hero label (`data-thumb`)
- [x] Copy buttons copy exactly the displayed text (kit `CodeBlock`/`Copy`)
- [x] `data-cta` and `data-thumb` on every primary

Done here: Hero `<Cta thumb id="ingress.hero">View on GitHub</Cta>`; the close repeats it (`ingress.close`); Hanzo's other buttons are quiet or link Ctas.

## 5. Trust and proof
- [x] No logo, seal or invented number
- [x] Every figure traces to Hanzo's copy
- ~~Marquees pause, freeze, hide duplicates~~ n/a: no marquee
- ~~Privacy link beside every submit~~ n/a: no form submits

Done here: The only figures are Hanzo's own (80 and 443); demos use Hanzo's words, never invented numbers.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px on phones) except 11–12px mono capitals and the kit's own copy label
- [x] Measures held; headings balanced
- [x] Code uses the kit `CodeBlock`
- [x] `python3 scripts/parity.py /ingress`: 0 missing

Done here: Parity 29/29 text and 2/2 links. Section labels sit under their headings as captions; phone labels raised to 14px (`components/pages/cloud/Ingress.css`).

## 7. Visual design system
- [x] `python3 scripts/taste.py` passes (deck greys only; no hue)
- [x] No label, tag, badge or pill above a headline
- [x] Radii 28 (objects), 16–24 (tiles); one shadow per raised object
- ~~One icon set~~ n/a: no icons beyond the kit's
- [x] Differs from neighbours in hero medium and room order

Done here: Greys from Hanzo's deck only; one dark room (the pipeline). Round 3: the hero ask hovers to #262626 (was the shared #2c2c2e) with a 4px arrow nudge, styled page-local. Round 2 swapped the off-deck #f5f5f7, #161617, #2c2c2e for #f5f5f5, #171717, #262626; board tiles are flat (a 2px ring only when hit) and the scene card keeps the floating shadow with no outline. Deck hex literals remain in page CSS because `tokens.css` is not on main yet.

## 8. UI component library
- [x] Every control has hover (inside `@media (hover:hover)`), press .97, focus-visible, disabled
- [x] Focus ring is the shared system's
- ~~Dialogs are native, trap focus and return it~~ n/a: no dialog on this page
- [x] Inputs 16px or larger; no bare `:hover` in the page CSS
- [x] Forks this page deleted: listed above

Done here: Kit `Cta`, `CodeBlock`, `Copy` and Cloud 3's `LivePause`. Round 2, the dark room: off chips hover to a 40% white border and #fafafa text, on chips to #fafafa; the ↑/↓ buttons hover to white 14%; chips and arrows press to scale(.97) in 90 ms; focus is a 2px white ring with a black halo. Walk: 13/14 desktop hovers answer (the 14th is a disabled ↑).

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups (`variety.py` OK)
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval` in the page (timers are `setTimeout` chains)
- [x] Sound only on the listed moments, through the one kit (`lib/sound.js`, wired by `components/Sound.jsx`): the ask taps, the pause toggle and the middleware chips tick (`aria-pressed`, `data-sound="tick"`), the ↑/↓ reorder buttons and a finished drag tick, copy chimes; the board loops while seen and never finishes, so no done chime

Done here: Signature: the routing board, live. Idle: the board routes a request a second while on screen. Time (round 2): each of the six scenes plays its drawing once as it is wiped in, then rests: the three sources slide up under `networking.k8s.io/v1 Ingress` and `default IngressClass` ticks on; the lock shackle draws and closes, then "Let's Encrypt" and "wildcards included" arrive; the chips arrive 60 ms apart (the `--d` index) and a request passes through the black ones; the hollow pod empties and refills; the four paths type in one after another; 80 and 443 settle. State: middleware chips add and drag-reorder (keyboard arrows too), and a request dot steps down the chain on each change, lighting each row it passes. Scroll: the six scenes wipe up while the section pins; round 3 removed the auto-settle, so the page never moves on its own (probe: scrollTo 3500, 2700, 4100 rest exactly there; a 300px wheel flick from 2400 rests at 2670, no pull-back). Instead the handover is clean mid-wipe: the outgoing text and card fade out over the first 30% of the next wipe (`--out`), the incoming caption and h3 cut in by line mask and the body rises 16px once its wipe passes 50% (`data-t`), so two headings never stack; each drawing starts as its wipe begins, so no card arrives empty. Reduced motion: every drawing is its final frame, scenes stacked.

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

Done here: At 375: the scenes stack one after another with no pin and each drawing plays when half of it is on screen; the board keeps the request path, with the middleware as one compact 13px row between hosts and backends (round 2); the pipeline stacks under its chips and the room is open full width. Measured: ask bottom at 446 of 667; pinned scenes stack under 900px, nothing floats over text.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast: #0a0a0a and #525252 on white and #f5f5f5, #a3a3a3 and white on black
- [x] Pause control (Cloud 3's `LivePause`, 44px, `aria-pressed`) on every self-running object
- [x] Forms labelled (no form fields)
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
- [x] Canonical through the shared `<JsonLd route="/ingress" />`
- [x] `<JsonLd route>` renders; no broken URL
- [x] Every card is a real link

Done here: `app/ingress/page.jsx` unchanged: metadata from `content/pages.json` and `<JsonLd route="/ingress" />`.

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

Done here: A headless JS-off pass shows every word; reduced motion stops each demo on its final frame.

## 18. Measurement and handover
- [x] `data-cta` on every primary (the kit `Cta` sends `cta_click`); `lib/track.js` is not on main yet
- [x] Nothing identifier-bearing; no field value in any payload
- [x] `V2: 8/10` line in the page file's top comment
- [x] Review read: `docs/review/ingress.md` (round 2, 7/10): fixes 1-4, 6, 7, 8 done page-local; fix 5 (phone header ask) filed in `docs/requests/ingress.md`

Done here: `ingress.hero` and `ingress.close` on the asks. Gallery: `docs/gallery/ingress/` (round 2: `round2-desktop.jpg`, `round2-desktop-pipeline.jpg`, `round2-phone.jpg`; round 3: `round3-desktop-wipe.jpg`, `round3-desktop-edge.jpg`, `round3-phone.jpg`).
