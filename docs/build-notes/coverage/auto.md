# /auto coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/apps/Auto.jsx` · gallery: `docs/gallery/auto/` · metric id: `cta_click:auto.primary`

Open copy questions for James: "Restart the pod" (`c4_restart_pod`). Each is in `content/ui-strings.json` as needs_james; until approved the control is icon-only or the name is for screen readers only.
Shared changes requested (`docs/requests/auto.md`): none.
Forks this page deleted: the cursor-following preview card that floated over the list, the url pill with a photo above the h1, raw .x-btn asks and Magnetic wrapper, the shaking lane, the full-scrim "pod rescheduled" overlay, the skeleton-bar and static-box minis, the single-letter connector glyphs, the framed editor window with its three dots, Motion `initial` entrances on the first screen (now CSS on `.js`).
Page-local files: `components/pages/apps/auto/Minis.jsx` (the six live objects in the index).

Measured on the dev server at 1470×801 and 375×812 (Playwright, JS on and off), round 3 after the 7/10 review: `build-auto/walk.js`, `minis.js`, `check.js`, `check3.js` (pinned room in 9 rest frames, reduced motion, copy), `hyd.js /auto 7`.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js`
- [x] Open copy questions for James listed, none decided

Done here: Persona is a developer who wants workflows that survive a restart; the one ask is Hanzo's "Open Auto" (`data-cta` primary in the hero, "close" as the later solid), metric `cta_click:auto.primary`. `lib/cta.js` is not merged yet, so the label is the live page's own. h1 count 1. no prices on the live page. Every button changes something on screen.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [ ] Breadcrumb at depth 2 or more (n/a: /auto is depth 1)
- [x] Link parity: 0 removed, 0 unexpected

Done here: `<main id="main" data-ask="off">`; the layout's "Skip to content" targets `#main`. 6 links in main, all through `A` or `Cta`. `python3 scripts/parity.py /auto` reports every live link present. No breadcrumb: the page sits at depth 1.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero`; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer
- [ ] Card-to-page links use Morph; title lands within 12px (n/a: no card on this page opens another page)

Done here: Hero is its own hero: one left-hand stack (h1 top 116px at 1470×801, the mono caption, then the line with "Open Auto" and "Documentation" on the same row), then the race as full-bleed tracks with no window frame: a control strip ("Restart the pod" at y 318 desktop / 328 phone, the line "Step state is written down as it goes.", published, pause), then the two runs as tracks whose hairline runs edge to edge. The race ends at y 677 and the next heading peeks in. Two runs step every 700 ms and on the first run the pod is rescheduled at step 3, so by about 2.2 s the record lane reads "step 3 / 5" while the goroutine lane has dropped to "step 1 / 5" (measured at 2200 ms on both sizes); after that the record finishes first and the pod is rescheduled again every other run. `PageHero` is not merged; the existing equivalent (`StageHero` or the page's own hero with the same line-mask cut-in, 700 ms ease-emphasis, now a CSS animation scoped to `.js` so the server HTML is the final state) is used, and the mono caption sits under the h1. JS off: h1 "Hanzo Auto" at opacity 1, 0 hidden headings or paragraphs. Rooms: hero (light) → the six properties index, the open row's live object top-aligned beside its title and body, closed rows 60px (light) → four figures, pinned for 150svh while each word cuts in and grows to 120px in its moment, then the container outline closes (dark) → the connectors as rows feeding a drawn chain (light) → closing band (dark). The live page has no proof strip, so it ends on the band and the footer.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text; failure never says Copied
- [x] `data-cta` and `data-thumb` on every primary

Done here: 0 `.x-btn` without `data-cta` in main; CTAs found: primary*, docs, close*, close-view-on-github, deploy (* = solid). The header carries the sticky ask at every width; the page bar is off (`data-ask="off"`) because the critic's shared note (15:00) fails any pill seen over content. Copy is the kit `Copy`, which copies the prompt string it shows; after a real copy its label reads the kit's "Copied" and, page-locally, the button inverts to #f5f5f7 with ink text (measured with clipboard permission). 1 `data-thumb` in main.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [ ] Marquees pause, freeze under reduced motion, hide duplicates (n/a: no marquee)
- [ ] Privacy link and owner line beside every submit (n/a: nothing is submitted)

Done here: No partner logos (no mirrored marks with permission exist in the repo), so the connector grid is quiet text rows with no stand-in glyphs; product names appear as text only. Parity holds every printed figure. Demo values (counts, offsets, machine names) are labelled examples in the header comment and drawn as objects, not claims.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts
- [x] `python3 scripts/parity.py /auto`: 0 missing

Done here: Small text: 0 runs under 13px on desktop, 0 under 14px on the phone (mono capitals excepted). Sizes follow the deck: h1 52px (40 phone), section heads 26px, h3 17px, lede 20px, body 15px, figures 64px Air at rest; in the pinned room the word in its moment grows to 120px (64 phone) while the others settle to 40px (32 phone), then all return to 64. Lede 44ch, body 66ch, headings balanced. Code: the agent prompt in the band. Parity: 0 missing.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` OK on the page JSX and CSS and the Cloud 4 shared files; only the deck neutrals and `#e4e4e7`. Captions sit under headings. Radii 8, 10, 12, 14, 20, 24; objects are outlined with a hairline and carry no shadow. Icons are one inline 16px stroke set (status ring, tick, plus, restart, arrow). /automations opens on a framed canvas (moving to a dock-to-board path) with connector tiles; /auto has no framed window: its first screen is a left title stack over two full-bleed tracks, its connectors are rows (not tiles) and its middle is an index of live objects plus a pinned figures room.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs are native, trap focus and return it
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: listed below

Done here: Hover sits under `@media (hover: hover), (pointer: none)` (so the connector board, links and the band's repo chip answer even without a hover media flag; the repo chip now fills as well as outlining) and changes fill or border only: "Restart the pod" fills ink at full opacity (was 40%), "Documentation", "View on GitHub" and "Deploy to Cloud" get a grey fill page-locally (measured transparent → rgb(245,245,245)), connector rows fill #e4e4e7 and their plus turns, track nodes take an ink border, the index rows' title inks and plus fills; press is scale .96-.98 in 90 ms; focus-visible draws a 2px ink or white ring. While the pod restarts the restart button is `aria-disabled` and its icon turns (busy) instead of fading. Nothing on the page loads data, so no loading state. Dialogs: none. Inputs: none. Forks deleted: see the top of this card.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [ ] Sound only on the listed moments, through the one kit (n/a: the page plays no sound of its own; the kit owns it)

Done here: Signature: a run that survives the restart (the live race tracks). Supporting techniques in `Auto.jsx` (variety.py counts 3): pointer lean on the tracks (`useSpring`, up to 1.5°, fine pointers only, applied after mount), the figures room pinned for 150svh (140 on phone) and driven by `useScroll` (each word's stretch of the pin triggers a timed cut-in and makes it the big word; past half the pin the container outline draws in 0.9 s and its chips follow, so every resting frame is complete and the outline is closed by the pin's end), and `pathLength` wires in the connector chain and the container. Also: the index line grows as it opens and the open row runs its live object (time: record ticks, /v1/pieces streaming, one run from two triggers, the SSE event log, draft vs published, IAM then KMS), the chain re-flows on press (state). Kinds: idle and time (hero race, minis), pointer (lean, restart), state, scroll (only the pinned figures room). Timers are timeout chains (`useTick`), no `setInterval`. Reduced motion (`useCalm`) renders the settled frame: the race split at record step 4 / goroutine step 1 with the marker shown, each mini on its last frame, the figures unpinned and static; the spinners, blinking dots and CSS entrances are off. Measured at 375×667 with reduced motion: `document.getAnimations()` running at 3 s = 0.

## 10. Media
- [ ] `Film` and `Pic` only; sizes and posters set (n/a: no photo or video)
- [x] At most 2 videos playing; pause button on loops over 5 s
- [ ] Budgets met; nothing missing; alt on every image (n/a: 0 images, 0 without alt)
- [ ] No dimmed or filtered photo; 4+ real visuals together where the page has them (n/a: no photos)

Done here: 0 videos. The moving objects are drawn in HTML and SVG; each loop over 5 s carries a 44px pause button (measured 44×44 at 1470 and 375): the race's (in its control strip), and one in the open index row's live object (it pauses all six).

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: Overflow 0px at 375 and 0px at 320. 0 controls under 44px at 375 after scrolling the whole page. The primary ask's bottom edge sits at 357px on an 812px screen. On phones each hero lane is a row of five status dots on one track with the current step named ("step 3 / 5 · Postgres"), so the restart control, both lanes and the marker fit the first screen (race ends at y 662); the figures room still pins with the four words as rows (44px at rest, 64px in the moment, "Apache" clears the gutter); every hover state also answers a tap.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: Re-measured at rest after every 600px of scroll at 1470 and 375 (`check.js`): 0 text runs under 4.5:1 (the dark minis' secondary grey was raised from #737373 to #a3a3a3; the goroutine's running node is now #404040 under white, 10:1). Headings 12222 with 0 skips. Pause controls: the race and the open index object. Every input has a label or a register name; nothing validates, so there is no error to focus. Controls are native buttons, links and inputs.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [ ] JS and CSS inside budget; every image and video sized (not measured by this chat; no media to size)
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: `curl /auto/` returns the h1 in the HTML. Demos run only while on screen (`useInView`) and stop when paused or off screen. No fetch, poller or third-party script on the page. 0 console errors at both widths (`errs.js`: 0 desktop, 0 phone, overflow 0). The round-3 review's hydration mismatch on the hero lede (`motion.p` with `initial={{opacity:0,y:16}}`) is removed at the source: no Motion `initial` is left on the first screen (h1 cut-in, caption, line, asks and race enter by CSS keyframes under `.js`, the lean style is only attached after mount), so server and client HTML match; `hyd.js /auto 7` = 0 at both sizes on all 7 lone reloads. A separate mismatch in the shared `FooterHTML` (its `__html` differs on a cold dev compile) can still show on the very first load after a recompile; it is not this page's code.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: Title "Workflow automation in one binary — Hanzo AI". Canonical https://hanzo.ai/auto/, og:url https://hanzo.ai/auto/. 2 JSON-LD blocks, all parse. Metadata comes from `content/pages.json` through the route file.

## 15. Catalogue and product pages
- [ ] Model card matches `SPEC.md` (or n/a: not a catalogue or model page)
- [ ] Every card opens by Morph (n/a: no cards that open pages)
- [ ] Every maker and model page linked in the DOM (n/a)
- [x] One price figure everywhere

Done here: Not a model page. Cloud product anatomy: identity, the race tracks as console, four figures as the fact strip, six openable properties, the band. Prices: no prices on the live page.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (or n/a: no code on the page)
- [ ] Config blocks parse on their own (n/a: no config block)
- [ ] Terminal pauses and ends on a static frame (n/a: no terminal; the nearest thing, the GET /v1/pieces and SSE log objects, pause with the index pause button and settle on their last frame under reduced motion)
- [x] No hand-typed version number

Done here: Code: the agent prompt in the band. The agent prompt is one string shown and copied as is. No version numbers are typed into the page.

## 17. States and resilience
- [ ] Loading, empty, error and offline states designed (n/a: the page reads no live data)
- [x] Blocked live data leaves a complete page, no console errors
- [ ] A failed submit keeps its values and shows no success (n/a: no submit)
- [x] A thrown island does not blank the page

Done here: Every word is in the server HTML and every demo is local, so a blocked network still shows the whole page; JS off was checked above. Each demo is its own component; the page has no shared runtime state to lose.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js`
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/review/auto.md` verdict 8 or more

Done here: `data-cta` on every primary (kit `Cta`); the page imports no analytics itself. `V2:` line present in `components/pages/apps/Auto.jsx`. Last critic verdict on file: 7/10 (round 3, 7 Nov); every fix in that review is addressed in this round except the shared header-glass smear (header owner), which waits for the next walk.
