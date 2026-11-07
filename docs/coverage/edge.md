# /edge coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/cloud/Edge.jsx` (+ `Edge.css`) · gallery: `docs/gallery/edge/` · metric id: `api_key_created` (proxy on this page: the `edge.hero` click)

Open copy questions for James: (1) "What runs on yours" (the Beyond picker's h2) is not Hanzo copy; it was added by the earlier rebuild and is kept as the section's name, with Hanzo's "It uses what it finds" set under it as the caption (it used to sit above it). (2) The picker's six machine names and its answers are assembled from Hanzo's own runtime lines ("Metal on Apple Silicon." + "Detected at startup rather than configured by you."): the wording of each piece is Hanzo's, the joins are ours. (3) The field's band labels ("macOS", "Linux", "WebAssembly", "Hugging Face repo") and the live caption ("There is no request", "After that, offline") are fragments of Hanzo's sentences. (4) CTA labels are Hanzo's live ones; `lib/cta.js` does not exist yet.
Shared changes requested (`docs/requests/edge.md`): none filed; kit gaps reported to the Cloud 1 lead: `KeynoteOpen` shuts on Esc without returning focus (fixed here page-locally) and does not trap Tab in the open card; its card details are `hidden` with JS off (shown here page-locally); the stage's text-link secondary is 21px tall on phones (given 44px here).
Forks this page deleted: Frame's `Related` (now page-local hairline rows in the close), Frame's hooks (`useEvery` with its `setInterval`, `useFrame`, `useSteps`, `useLive`: now one page-local animation-frame loop and single timeouts), the lime canvas (`rgba(132, 204, 22)`), the `--ac` lime and the deep-lime accent words, the pill and labels floating over the field, the spring on the picker pill, the fade-up answer panel.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from Hanzo's copy (`lib/cta.js` not built yet)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; ~~prices from `lib/plans.js`~~ n/a: no price on this page
- [x] Open copy questions for James listed, none decided

Done here: `//` header lines at the top of `Edge.jsx` (V2, Persona, Goal, CTA, Metric, Signature, Motion kinds, Beyond). The page's solids: "View on GitHub" in the hero (`edge.hero`, `data-thumb`) and "Deploy to Cloud" in the close (`edge.close`), screens apart; "View Documentation" is the kit's text link (`edge.hero-2`).

## 2. Information architecture and navigation
- [x] ~~One `<main id="main">`~~ one `<main>`; the layout's skip link reaches its `#main` mark
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [x] ~~Breadcrumb at depth 2 or more~~ n/a: /edge is depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: `python3 scripts/parity.py /edge`: links 7/7. The related rows (GPUs, Machines, Containers) go through the kit's `A`; every ask through the kit's `Cta`.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] ~~`PageHero`~~ the kit's `KeynoteStage` (side look: h1 52px, lede, ask on the left; the localhost window bleeding right); nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, closing room, footer
- [x] Card-to-page links use Morph (related rows carry `data-morph` on the name); the six runtime cards open in place (kit `KeynoteOpen`)

Done here: The localhost window streams its `data:` lines by CSS from 0.3 s, 0.22 s apart, before hydration, and the "Nothing is uploaded" ring pulses from first paint (`scratchpad/f-edge-d.jpg`, `f-edge-p.jpg`). With JS disabled, 0 text blocks are hidden on desktop or phone (the runtime cards' details stand under them). Order: hero, the field (black-on-white canvas), runtime cards, the picker (quiet room), the dark room, the light close.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text; failure never says Copied
- [x] `data-cta` and `data-thumb` on every primary

Done here: `data-cta` ids `edge.hero` (thumb "View on GitHub"), `edge.hero-2` and `edge.close`. The one copy control is the close's agent prompt (kit `Copy`).

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [x] ~~Marquees pause, freeze under reduced motion, hide duplicates~~ n/a: no marquee
- [x] ~~Privacy link and owner line beside every submit~~ n/a: no form

Done here: Figures are Hanzo's only: 4B, 600M, Q4_K / Q5_K / Q8_0, Q4_K_M, "about 2.5GB on disk". The stream and the field are drawn (bar widths, dots) and print no number.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] ~~Tables, FAQ, tabs and code use the kit parts~~ n/a: no table, FAQ, tab set or code sample (the facts became pressed buttons, not a tablist without panels)
- [x] `python3 scripts/parity.py /edge`: 0 missing

Done here: Parity text 64/64, links 7/7 ("01 / 03" kept, now under its fact). Deck sizes: h1 52, section headings 26 (`kn-headline`, was 32 to 128), H3 17, lede 21, body 16, captions 13 to 14, the picker figure 44/220, the opened card's 600M/4B 64/220 (44 in the grid). At 320 and 375 the only text under 14px is the kit close's "Agent prompt" and `Copy`.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside the deck
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from the deck; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: Every hex in `Edge.css` is a deck value (#000, #0a0a0a, #525252, #737373, #a3a3a3 on black only, #f5f5f5, #fafafa, #fff); the canvas draws only `rgba(10, 10, 10, a)`; 0 `box-shadow` (the pulse is a scaling ring, not a shadow); radii 6/8/12/16/24/999. "It uses what it finds" moved under its h2; the dark room's numbers sit beside their h3 on phones (a 32px column), never above.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs are native, trap focus and return it (kit `KeynoteOpen`: Esc and Close return focus; Tab trap is a kit gap, reported)
- [x] ~~Inputs 16px or larger~~ n/a: no input; no bare `:hover`
- [x] Forks this page deleted: listed above

Done here: Every `:hover` sits inside `@media (hover: hover)`; facts, picker buttons, related rows press to .97 (rows .99) in 90 ms; focus `2px solid var(--focus)`. The picker is a radiogroup with arrow keys and a roving tab stop. Esc on an open card now returns focus to it (`useEscReturn`; checked: `kno-card` focused after Esc, desk and phone).

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit

Done here: `python3 scripts/variety.py`: OK (requestAnimationFrame, layoutId; 0 `Rise`). Kinds: arrival, idle (stream, field), time (facts every 6.8 s with a filling bar), state (picker pill 300 ms `[0.16,1,0.3,1]`, the answer and caption by line mask, cards opening), scroll (stage and dark room only). No spring; the card art loops end (blink 6 times, events twice); the field has its own pause first in its DOM, the hero the stage's. Reduced motion draws each fact's final frame once. No page sound.

## 10. Media
- [x] ~~`Film` and `Pic` only~~ n/a: Hanzo has no image or film for Edge; the objects are drawn product UI and one canvas
- [x] ~~At most 2 videos playing~~ n/a: no video
- [x] Budgets met; ~~alt on every image~~ n/a: no image
- [x] ~~4+ real visuals together~~ n/a: no Hanzo media for this page

Done here: One canvas (the field), sized by a ResizeObserver at device pixel ratio up to 2, drawn only while seen and not paused.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: `sweep.cjs edge`: no sideways scroll, no errors. 320×640 scrollWidth 320; primary bottom at 269px at 375×667; 0 targets under 44px (the hero's text link given 44px). On phones the field is 400px tall with its discs under their labels, the facts stack, the picker is two columns.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] ~~Forms labelled; first error focused~~ n/a: no form
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: On white #0a0a0a / #525252 / #737373 (the answer card's labels); on #f5f5f5 only #525252 or darker (the picker's caption; the picker buttons and answer card are white fills); on black #fafafa, white 78%, white 55%, #a3a3a3. Headings: h1; h2 (field, visually hidden; runtime; picker; dark room; Get Edge); h3 (cases, open cards).

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: `Frame.jsx` is no longer imported; 0 `setInterval`; one rAF loop, cancelled when off screen or paused. Motion is transform and opacity only. Filming ran in the cloud container.

## 14. SEO and machine files
- [x] Title and description match live (from `content/pages.json`, unchanged)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route="/edge">` parses; no broken URL
- [x] Every card is a real link (related rows); the runtime cards are buttons that open in place

Done here: `app/edge/page.jsx` unchanged (metadata from `INDEX['/edge']`, `<JsonLd route="/edge" />`); every word is in the server HTML.

## 15. Catalogue and product pages
- [x] ~~Model card matches `SPEC.md`~~ n/a: not a catalogue or model page
- [x] Every card opens (in place, kit `KeynoteOpen`; reduced motion cuts)
- [x] ~~Every maker and model page linked~~ n/a: not a catalogue
- [x] ~~One price figure everywhere~~ n/a: no price

Done here: Cloud product anatomy: identity (hero), the live object (localhost window, field), the facts that open (six cards, uneven 7/5 pairs instead of three equal boxes a row), the close.

## 16. Developer experience
- [x] ~~One `CodeBlock`~~ n/a: no code sample; the close's agent prompt (kit) copies exactly what it shows
- [x] ~~Config blocks parse on their own~~ n/a: none
- [x] Terminal pauses and ends on a static frame (the stage's pause holds the stream; the stream rests 3 s between runs)
- [x] No hand-typed version number

Done here: The only copyable text is "Read https://hanzo.ai/skill.md and use Hanzo Edge in my project.", byte for byte.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed (n/a in part: the page fetches nothing)
- [x] Blocked live data leaves a complete page, no console errors
- [x] ~~A failed submit keeps its values~~ n/a: no form
- [x] A thrown island does not blank the page (`app/error.jsx` keeps header and footer)

Done here: Console errors: none (film, sweep, look script; desk and phone). Paused, chosen-by-hand (the bar stops filling), reduced-motion and JS-off states each read as intended.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through the kit `Cta`'s `cta_click` (`hz-event`; `lib/track.js` is not built yet)
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: 8/10 …` in the page file's top comment
- [ ] Review read: `docs/review/edge.md` does not exist yet (no critic verdict to answer)

Done here: `data-cta` ids in part 4; metric `api_key_created`. Gallery: `docs/gallery/edge/desktop.mp4`, `desktop.jpg`, `phone-1.jpg` to `phone-3.jpg`, filmed with 0 console errors and no sideways scroll.
