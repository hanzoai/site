# /functions coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/cloud/Functions.jsx` (+ `Functions.css`) · gallery: `docs/gallery/functions/` · metric id: `api_key_created` (proxy on this page: the `functions.hero` click)

Open copy questions for James: (1) "One handler, your choices" (the composer's h2) and "Compose yours" are not Hanzo copy; both were added by the earlier rebuild and are kept, "Compose yours" now set under the h2 as its caption (it used to sit above it). (2) The composer's read-back lines join Hanzo's sentences to the chosen runtime, trigger or move ("Node.js: name a runtime and point at a handler file."), and "Choose at least one trigger." is ours. (3) The hero's demo words ("Triggers", "Kubernetes", "replicas", "scaled to zero", "warm pool", "node 1", "editing", "deployed") and the scenes' labels are illustration. (4) The hero's primary is Hanzo's "Try Hanzo" (→ /login), the same words as the header's ask; any change is James's call. `lib/cta.js` does not exist yet.
Shared changes requested (`docs/requests/functions.md`): none filed; kit gaps reported to the Cloud 1 lead: `KeynoteChapters`' "01 / 06" count is 12px (13px here, 14px on phones), the close's `CodeBlock` caption "Agent prompt" and `Copy` are 12 to 12.5px on phones, the stage's text-link secondary is 21px tall (44px here).
Forks this page deleted: Frame's `Related` (now page-local hairline rows on the graphite close), Frame's `useEvery` and `useLive` (the 380 ms `setInterval` and the scenes' interval loops: now single timeouts, scenes run once and rest), the replica count that climbed through invented numbers (now filled against hollow slots and a word), the hero-sized "0" in the warm scene (now three slots that empty), the overshoot curve `cubic-bezier(.34, 1.56, .64, 1)`, the springs on the composer pills, the per-page accent.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from Hanzo's copy (`lib/cta.js` not built yet)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; ~~prices from `lib/plans.js`~~ n/a: no price on this page
- [x] Open copy questions for James listed, none decided

Done here: `//` header lines at the top of `Functions.jsx` (V2, Persona, Goal, CTA, Metric, Signature, Motion kinds, Beyond). The page's solids: "Try Hanzo" in the hero (`functions.hero`, `data-thumb`) and "Deploy to Cloud" in the close (`functions.close`), screens apart; "View Documentation" is the kit's text link (`functions.hero-2`).

## 2. Information architecture and navigation
- [x] ~~One `<main id="main">`~~ one `<main>`; the layout's skip link reaches its `#main` mark
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [x] ~~Breadcrumb at depth 2 or more~~ n/a: /functions is depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: `python3 scripts/parity.py /functions`: links 7/7 (/login, the docs, GPUs, Machines, Containers, GitHub, deploy), all through the kit's `A` or `Cta`.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] ~~`PageHero`~~ the kit's `KeynoteStage` (h1 52px near 38% of the screen, lede, ask, the function's life); nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, closing room, footer
- [x] Card-to-page links use Morph (related rows carry `data-morph` on the name)

Done here: handler.js writes itself line by line by CSS from 0.3 s, a cursor riding the newest line, before hydration (`scratchpad/f-functions-d.jpg`); after hydration the calls and replicas run while seen and not paused. With JS disabled, 0 text blocks are hidden on desktop or phone (the whole file stands). Order: hero, six pinned chapters, the composer (quiet room), stacking use-case sheets, the graphite close.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text; failure never says Copied
- [x] `data-cta` and `data-thumb` on every primary

Done here: `data-cta` ids `functions.hero` (thumb "Try Hanzo"), `functions.hero-2` and `functions.close`. The close's agent prompt is the kit `CodeBlock`, which copies exactly what it shows.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [x] ~~Marquees pause, freeze under reduced motion, hide duplicates~~ n/a: no marquee
- [x] ~~Privacy link and owner line beside every submit~~ n/a: no form

Done here: The replica count that climbed 0 to 12 (numbers Hanzo never states) is gone: the hero shows filled against hollow slots on three nodes and "replicas" or "scaled to zero". The hero-sized "0" in the warm scene is gone (MASTER part 5: a zero never gets hero size). The only figures left are Hanzo's names: v1/v2 as version labels, "/v1/function".

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] ~~Tables, FAQ, tabs~~ n/a: none on this page; code is the hero's own file (drawn product UI) and the close's kit `CodeBlock`
- [x] `python3 scripts/parity.py /functions`: 0 missing

Done here: Parity text 79/79, links 7/7. Deck sizes: h1 52, section headings 26 (were 32 to 128), H3 17 (sheets), chapter titles 26 (kit), lede 21, body 16, code 14, captions 13 to 14, v1/v2 44/220. On phones the hero code wraps instead of scrolling sideways. The only text under 14px at 375 is the kit close's "Agent prompt" and `Copy`.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside the deck
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from the deck; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: Every hex in `Functions.css` is a deck value (#0a0a0a, #525252, #737373, #a3a3a3 on black only, #d4d4d4, #e5e5e5, #f5f5f5, #fafafa, #fff); 0 `box-shadow` (the GPU node's highlight is an outline ring); radii 6/8/12/16/24/999. "What you get" and "Compose yours" moved under their h2s; the sheets' "01" sits beside the title, not above it. State is filled against hollow (slots, trigger dots, the count dot, the toggles' tick), never a colour.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] ~~Dialogs~~ n/a: no dialog on this page
- [x] ~~Inputs 16px or larger~~ n/a: no input; no bare `:hover`
- [x] Forks this page deleted: listed above

Done here: Every `:hover` sits inside `@media (hover: hover)`; composer buttons and related rows press to .97 (rows .99) in 90 ms; focus `2px solid var(--focus)` (white on the graphite close). The two radio rows are real radiogroups with arrow keys and a roving tab stop; the toggles use `aria-pressed` with a tick that firms up.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit

Done here: `python3 scripts/variety.py`: OK (layoutId, pathLength; 0 `Rise`). Kinds: arrival, time (the file writing, calls arriving), idle (replicas filling and emptying), state (composer pill 300 ms `[0.16,1,0.3,1]`, read-back lines by line mask, scenes stepping), scroll (stage, chapters, stacking sheets). 0 `setInterval`, no spring or overshoot; phone scenes step once and rest; the hero loop pauses with the stage's control. Reduced motion: the file stands written, replicas shown, scenes on their last step. No page sound.

## 10. Media
- [x] ~~`Film` and `Pic` only~~ n/a: Hanzo has no image or film for Functions; the objects are drawn product UI
- [x] ~~At most 2 videos playing~~ n/a: no video
- [x] Budgets met; ~~alt on every image~~ n/a: no image
- [x] ~~4+ real visuals together~~ n/a: no Hanzo media for this page

Done here: Every object is HTML and SVG (the life, six scenes, the composer card, the sheets); no media weight.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: `sweep.cjs functions`: no sideways scroll, no errors. 320×640 scrollWidth 320; primary bottom at 234px at 375×667; 0 targets under 44px. On phones the hero stacks (triggers 2×2, the file, the nodes), chapters unpin (kit) and each scene plays once as it is seen.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] ~~Forms labelled~~ n/a: no form (the composer's groups have legends)
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: On white #0a0a0a / #525252 / #737373; on #f5f5f5 (composer room, scene tiles) only #525252 or darker; on black #fafafa, white 78%, white 55%, #a3a3a3. Headings: h1; h2 (chapters, composer, use cases, Get Functions); h3 (chapters, sheets). The composer's read-back list is `aria-live="polite"`.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: `Frame.jsx` is no longer imported; the hero's writing is pure CSS; its tick is one timeout at a time, stopped off screen and when paused. Motion is transform, opacity and outline colour only. Filming ran in the cloud container.

## 14. SEO and machine files
- [x] Title and description match live (from `content/pages.json`, unchanged)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route="/functions">` parses; no broken URL
- [x] Every card is a real link (related rows)

Done here: `app/functions/page.jsx` unchanged (metadata from `INDEX['/functions']`, `<JsonLd route="/functions" />`); every word, including the whole handler.js, is in the server HTML.

## 15. Catalogue and product pages
- [x] ~~Model card matches `SPEC.md`~~ n/a: not a catalogue or model page
- [x] Every card opens by Morph (related rows)
- [x] ~~Every maker and model page linked~~ n/a: not a catalogue
- [x] ~~One price figure everywhere~~ n/a: no price

Done here: Cloud product anatomy: identity (hero), the live object (the function's life), the facts that open in turn (six chapters), the composer, the use cases, the close.

## 16. Developer experience
- [x] One `CodeBlock` for copyable code (the close's agent prompt); the hero's handler.js is the product object, not a copy surface
- [x] ~~Config blocks parse on their own~~ n/a: none
- [x] Terminal pauses and ends on a static frame (the file rests written; the stage's pause holds the calls)
- [x] No hand-typed version number

Done here: The only copyable text is "Read https://hanzo.ai/skill.md and use Hanzo Functions in my project. Start with: hanzo functions list", byte for byte.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed (n/a in part: the page fetches nothing; "scaled to zero" is the drawn empty state)
- [x] Blocked live data leaves a complete page, no console errors
- [x] ~~A failed submit keeps its values~~ n/a: no form
- [x] A thrown island does not blank the page (`app/error.jsx` keeps header and footer)

Done here: Console errors: none (film, sweep, look script; desk and phone). No trigger chosen reads "Choose at least one trigger."; paused, reduced-motion and JS-off states each read as intended.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through the kit `Cta`'s `cta_click` (`hz-event`; `lib/track.js` is not built yet)
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: 8/10 …` in the page file's top comment
- [ ] Review read: `docs/review/functions.md` does not exist yet (no critic verdict to answer)

Done here: `data-cta` ids in part 4; metric `api_key_created`. Gallery: `docs/gallery/functions/desktop.mp4`, `desktop.jpg`, `phone-1.jpg` to `phone-3.jpg`, filmed with 0 console errors and no sideways scroll.
