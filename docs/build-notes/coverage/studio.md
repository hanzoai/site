# /studio coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Studio.jsx` (+ `Studio.css`, shared `components/v2/A2Lines`, `A2Paste`, `A2.css`, `components/Opener.jsx`) · gallery: `docs/gallery/studio/` · metric id: `studio.hero`, `studio.close` (cta_click)

Open copy questions for James: Hanzo's "Open Studio" links to /studio, the page it sits on. The words and the /studio href are kept (parity), but with JavaScript on the link now takes you into the cutting room (the monitor) instead of reloading the page: should it point at studio.hanzo.ai instead?
Shared changes requested (`docs/requests/studio.md`): header honours `data-thumb` at phone widths; A2Lines hydration mismatch under reduced motion; A2Paste Copy button 40px on desktop.
Forks this page deleted: the six equal explainer cards (3x2 grid, now one node graph and one pane), the three equal spec columns (now one hairline list), the raw solid `.x-btn` hero ask and the solid "Open Studio" that looped to /studio (now kit `<Cta>`), the "REC" mark above the "Get Studio" h2 (now under it), the grayscale/brightness filter on the film-strip frames, the Apple greys (#f5f5f7, #a1a1a6, #6e6e73, #0d0d0f, #19191c, #1c1c20), off-deck durations (1.1 s, .45, .35, .25, .2, .6, .8 s) and off-scale type (12.5, 13.5, 14.5, 15, 19, 20, 22, 44 px).

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js` (n/a for the lib: `lib/cta.js` does not exist yet; the label is Hanzo's own "Launch studio.hanzo.ai")
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` (n/a for prices: none on the page)
- [x] Open copy questions for James listed, none decided

Done here: Top comment names Persona, Goal, CTA, Metric (`studio.hero`, `studio.close`), Signature and Beyond, plus the `V2:` line. Solid fills measured: hero ask at y 269, the Studio-or-Design answer at y 1989 (only one of its two answers is visible, the other is `inert`), the close ask; the close's solid goes to studio.hanzo.ai. The close now holds one solid and one text link ("Open Hanzo Design" is a kit `More`); "Open Studio" moved under the related list as a text link with an up arrow (it scrolls back into the monitor, `#xst-cinema`, and focuses the playhead), and "Deploy to Cloud" in the black card is a white `More` text link, so no outlined pills remain at the close.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- ~~Breadcrumb at depth 2 or more~~ n/a: /studio is depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: `<main className="a2 xst" id="main">`, one `a[href="#main"]` skip link in the chrome. `parity.py /studio`: text 87/87, links 16/16; the six film-strip frames are `<a href="/iro">` etc.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero` (n/a for the part: not merged; the kit equivalent is A2Lines line-mask h1 + one lede + one ask + one object); nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- ~~Ends in proof strip, `Band`, footer~~ n/a: no `Band` component merged; the page ends on its own close (director's chair + the dark "Get Studio" card) straight into the footer
- [x] Card-to-page links use Morph (the film-strip frames open through the WebGL opener, `useOpener`)

Done here: At 1470x801 the 52px h1 runs 140 to 306px (baseline at 38%), the monitor starts at 349px and the first timeline track ends at 791px, so the product and its first row are on the first screen; the timeline plays within 1 s. At 375x812 the h1 is 36px with `text-wrap: balance` and sets in 3 lines (108 to 222px); under MASTER's 40px on purpose, because at 40px Hanzo's copy wraps to 5 lines and pushed the monitor to 563px. With 48px top padding and a 16/1.45 lede the monitor now starts at 413px (about 250px of product inside 660px). Section gaps at 1470x801 (last content line to next first line): Paste rule to the Studio-or-Design card 56px, card to the reel frame 47px (the reel is pulled up 56px), reel captions to the graph heading about 120px at the end of the pin, graph to the strip heading about 119px, strip links to the close heading 116px (were 182, 231, 355). JS off (Playwright, javaScriptEnabled false): every heading at opacity 1 / transform none, all six capability panes and both Studio-or-Design answers visible via a `noscript` rule.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label (desktop: the header swaps to "Launch studio.hanzo.ai"; phone: requested, see `docs/requests/studio.md` item 1)
- [x] Copy button copies exactly the displayed text; failure never says Copied (shared `A2Paste`)
- [x] `data-cta` and `data-thumb` on every primary

Done here: Both primaries are `<Cta to="https://studio.hanzo.ai" id="studio.hero|studio.close" thumb>` (checked: `data-cta="studio.hero"`, `data-thumb="Launch studio.hanzo.ai"`), so they also fire `cta_click` and show the cross-origin pressed state. The "Open Hanzo Design" asks stay on the kit `Go`.
 7 Nov (Ready pass): the close keeps one solid ask (Launch studio.hanzo.ai) with "See plans, from $8/month" to /pricing beside it and Open Hanzo Design as a text link; the Studio or Design card's answers are quiet outline links, not a second solid.
## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- ~~Marquees pause, freeze under reduced motion, hide duplicates~~ n/a: no marquee on the page
- ~~Privacy link and owner line beside every submit~~ n/a: no form

Done here: Figures are Hanzo's own (12 trajectories, 14mm to 135mm, 2.39:1, f/1.4, 4K, GPL-3.0). The new timecodes on the timeline clips (00:04–00:08) are the demo's own ruler, `aria-hidden`, not a claim.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts (n/a for tables/FAQ/code: none; the capability tabs are APG tabs with arrow keys, Home/End)
- [x] `python3 scripts/parity.py /studio`: 0 missing

Done here: Type now only on the deck scale: h1 52 (40 phone), every section h2 26, pane h3 21, body 16/17, captions 13/14, mono labels 12. Parity: `/studio: OK  text 87/87  links 16/16`.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste: OK (2 checked)`; every colour is a deck grey (#fafafa, #f5f5f5, #d4d4d4, #a3a3a3, #737373, #262626, #171717, #0a0a0a, #000) or white/black alpha, declared once on `.xst`. "● REC" now sits under "Visual builder studio", not above "Get Studio"; the visible kicker before an h2 is gone everywhere (A2's `.a2-kick` stays visually hidden). The graph nodes are flat white on a dotted #f5f5f5 canvas; only the active node takes the floating shadow. `unique.py`: OK.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading (n/a for disabled/loading: no control can be disabled; the ask's loading is the kit `Cta` aria-busy)
- [x] Focus ring visible on every stop of a Tab crawl
- ~~Dialogs are native, trap focus and return it~~ n/a: no dialog
- ~~Inputs 16px or larger; no bare `:hover`~~ n/a for inputs: none; every page hover sits inside `@media (hover: hover)`
- [x] Forks this page deleted: listed below

Done here: Hover now tells you something: the hero/close ask slides its arrow 4px; a timeline clip swaps its label for its timecode (00:04–00:08) with a ring; model and "what are you making" chips go to an ink/white border with a fill shift; graph nodes lift 3px; related rows slide; Play scales its icon. Press is scale .97/.98 at 90 ms on chips, rigs, library, nodes, frames and asks. Graph nodes get a 2px ink `:focus-visible` ring. See "Forks this page deleted" at the top.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [ ] Reduced motion shows the final state; no `setInterval` (final states yes; three `setInterval` timers remain: Which, Graph, Strip)
- [x] Sound only on the listed moments, through the one kit

Done here: `variety.py`: OK with 3 techniques (useScroll reel = signature; rAF timeline; layoutId: the graph's active ring travels node to node in 400 ms ease-in-out). Kinds: idle (timeline, chip hop, render pass), pointer (scrub, opener warp, clip timecodes), state (rig tabs, graph tabs, pane clip-reveal), scroll (reel), arrival (h1 cut-in). The reel is 240svh (was 360): the frame grows from .92 to 1 over the first 15% of the pin, and each pillar's move is bigger and framed on its still's subject (Dolly 1.25 to 1.7 about the right edge, Crane ±12% at 1.32, Orbit a 23% pan with ±2.5° tilt; object-position picks the subject's band). Changeovers never blend two texts: reel captions, the graph pane and the Studio-or-Design answer take the outgoing item out in 150 ms and bring the incoming one in after a 150 ms delay, its title cutting in through a line mask (translateY 105% to 0, 500 ms ease-emphasis). On phones the reel frame is a sticky 2.39:1 strip under the header that swaps still, rig and `0n / 03` as each pillar's title crosses it (IntersectionObserver, no pin). Reduced motion: frame and stills hold their framed rest state, masks at rest, `getAnimations()` running = 0. Deck timings only (90/150/300/400/500 ms, three deck curves). Reduced motion: `getAnimations()` = 0 after 3 s at both sizes, the timeline holds a still at 60% of shot 1, the graph ring moves with duration 0. Sound comes from the shared kit on `[data-cta]`; the page adds none.
 7 Nov: the capability ring cuts (no flight) on any jump longer than one node; the film strip's lit frame is always brought into view as the timer moves it; the close card's still drifts like a held shot under the REC tally.
## 10. Media
- [ ] `Film` and `Pic` only; sizes and posters set (still raw `<img>`/`<video>`; swap when the kit's Film/Pic suit the timeline stills)
- [x] At most 2 videos playing; pause button on loops over 5 s (one strip film at a time; the timeline has Play/Pause)
- [x] Budgets met; nothing missing; alt on every image
- [x] No dimmed or filtered photo; 4+ real visuals together where the page has them

Done here: 0 `<img>` without alt in `<main>`. The grayscale/brightness filter on inactive film-strip frames is gone; the active frame is marked by a white inset ring (opacity) and a 1.03 scale. Measured: one `<video>` in the strip at a time; 4+ model films/stills on screen together in the strip and in the inspector library.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: scrollWidth 375 at 375 and 320 at 320. Playwright found 0 links/buttons under 44px at 375 and 320 (inline /design and studio.hanzo.ai padded to 45px, strip links and hanzoai to 44px; rigs and chips 44px under `pointer: coarse`). Phone ask row is inline (solid + text link) ending at 543px. The node graph stacks into one wired list on phones, tap opens a node's pane.
 7 Nov: the phone desk stacks monitor, inspector, then the three specs (the grid areas no longer squeeze the specs into a sliver); on wide screens all six film frames fit with none past the edge.
## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item (the timeline has Play/Pause; the graph and chips stop on hover, focus or the first pick)
- ~~Forms labelled; first error focused~~ n/a: no form
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: Hint text on black moved from #6e6e73 to white 55% (about 6:1); body greys on white are #525252. Heading order H1, H2, H3 x3 (reel), H2, H3 x6 (pane), H2 x3. The capability graph is a `tablist` with `aria-selected`, roving tabindex, arrows/Home/End and one `tabpanel`; inactive panes are `aria-hidden`. "Open Studio" moves focus to the timeline slider after scrolling.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: The h1 and the monitor's first still are server-rendered; the film-strip `<video>` now joins only after hydration (`ready` flag), which removed the reduced-motion hydration error. Everything animates transform, opacity or clip-path; colour changes snap. Lighthouse not run (cloud job).

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: Title "Hanzo Studio — AI Cinema, Camera Rig & Production Engine" unchanged; canonical and og:url both `https://hanzo.ai/studio/`; 2 JSON-LD blocks parse.

## 15. Catalogue and product pages
- ~~Model card matches `SPEC.md`~~ n/a: not a catalogue or model page
- [x] Every card opens by Morph (film-strip frames through the WebGL opener)
- ~~Every maker and model page linked in the DOM~~ n/a: not the catalogue (all six creative model pages are linked)
- ~~One price figure everywhere~~ n/a: no prices

Done here: Hovering a frame bulges it through the opener; clicking opens /iro, /koma, /mori, /oto, /koe or /uta.

## 16. Developer experience
- ~~One `CodeBlock`; copy equals display~~ n/a: no code on the page (the agent prompt is the shared `A2Paste`)
- ~~Config blocks parse on their own~~ n/a: no config
- ~~Terminal pauses and ends on a static frame~~ n/a: no terminal
- ~~No hand-typed version number~~ n/a: none (Koma 2.0 is Hanzo's copy)

Done here: n/a throughout; the only copyable text is A2Paste's prompt, which copies exactly what it shows.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed (n/a for empty/error/offline: no live data)
- [x] Blocked live data leaves a complete page, no console errors
- ~~A failed submit keeps its values and shows no success~~ n/a: no form
- [x] A thrown island does not blank the page

Done here: No live calls; console errors: 0 over 12 fresh loads (1470 and 375, default and reduced motion, 3 each) and 0 during the walks. The empty voice-track gap clips no longer take the active outline. JS off is legible (part 3).

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js` (cta_click is dispatched by the kit `Cta`)
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/review/studio.md` verdict 8 or more (read; the last verdict was 6/10, re-review pending)

Done here: `data-cta="studio.hero"` and `"studio.close"` with `data-thumb`; the `V2:` line lists this pass. All ten review fixes were worked in order; item 9 (phone header ask) and the A2Lines/A2Paste items are in `docs/requests/studio.md`.
