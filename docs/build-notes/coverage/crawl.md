# /crawl coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/cloud/Crawl.jsx` (+ `Crawl.css`) · gallery: `docs/gallery/crawl/` · metric id: `api_key_created` (proxy on this page: the `crawl.hero` click)

Open copy questions for James: (1) "Which plan covers it" is the slider panel's label, kept from the earlier rebuild; it is not Hanzo copy and not yet in `content/ui-strings.json` (kept visible rather than lose a word; approve or cut). (2) The slider readout sets each plan's first line as figure plus unit ("50,000" + "pages/month", "Unlimited" + "pages"): the same words in the same order, split in two. (3) The scene's drawn labels ("fetch + parse", "Headless Chromium", "SPA", "Markdown", "refused", "refused at the hop", "a model is asking", "content") and the example.com pages are illustration, not claims. (4) The CTA labels are Hanzo's live ones; `lib/cta.js` does not exist yet. (5) The "Send it a URL" console plays "deploy the gateway to staging / reading the project / gateway is on staging": a critic (7 Nov) called it off-topic for Crawl, but it is Hanzo's live copy on /crawl (`content/live/crawl.json`), so it stays word for word; James to decide whether the live page should script a crawl instead.
Shared changes requested: `docs/requests/reduced-motion-hydration.md` (shared v2/kit components hydrate differently under reduced motion; this page's own code uses `useCalm()` now); kit gaps are reported to the Cloud 1 lead instead (KeynoteClose's "Agent prompt" bar label and the kit `Copy` label render at 12 to 12.5px on phones, under the 14px floor; `KeynoteSpec`'s `Fig` has no size option below 64px).
Forks this page deleted: Frame's `Console` (8 `title=` tooltips, a `setInterval` build loop, a spring `layoutId` row) for a page-local console; Frame's `Related` row for hairline link rows; the hand-made `kn-btn` asks in the plans and in "Send it a URL" (now kit `Cta`); the native range input and the free number field of the plan finder (now a three-stop slider); the spring on the plan ring (now a 400 ms tween); the page's `--ac` accent override.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from Hanzo's copy (`lib/cta.js` not built yet)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; ~~prices from `lib/plans.js`~~ n/a: `lib/plans.js` does not exist; the three prices are Hanzo's ($49, $499, Custom), printed once
- [x] Open copy questions for James listed, none decided

Done here: The header comment (`//` lines at the top of `Crawl.jsx`) names Persona, Goal, CTA, Metric, Signature, Beyond and the V2 line. Solid fills: "Read the docs" in the hero (`crawl.hero`, `data-thumb`), "Read the docs" in "Send it a URL" (`crawl.send`) and "Deploy to Cloud" in the close (`crawl.close`), each on its own screen; every other ask (GitHub, the three plan buttons, View on GitHub) is a quiet `Cta`.

## 2. Information architecture and navigation
- [x] ~~One `<main id="main">`~~ one `<main>`; the layout's skip link reaches its `#main` mark
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [x] ~~Breadcrumb at depth 2 or more~~ n/a: /crawl is depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: Every link goes through the kit's `A` or `Cta` (the console's eight product links, its "Crawl — Hanzo" title to /home and "Open in the console ↗"; the related rows). `python3 scripts/parity.py /crawl`: links 14/14.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] ~~`PageHero`~~ the kit's `KeynoteStage` (h1 52px near 38% of the screen, lede, ask, the reader); nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, closing room, footer
- [x] Card-to-page links use Morph (the related rows carry `data-morph` on the product name)

Done here: At 1470×801 the h1, lede, ask and the top of the reader show (`scratchpad/f-crawl-d.jpg`); the URL types itself in by CSS at 0.1 s and the page's chrome dims at 0.7 s, before hydration. With JS disabled, 0 text blocks are hidden on desktop or phone (`w3/nojs.cjs`): the scene's paragraphs stand in order and the console's last line shows. Order: hero, the pinned scene (600svh, one beat per screen), the spec sheet, pricing, send it a URL (quiet room), the graphite close.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text; failure never says Copied
- [x] `data-cta` and `data-thumb` on every primary

Done here: `data-cta` ids: `crawl.hero`, `crawl.hero-2`, `crawl.plan-build`, `crawl.plan-scale`, `crawl.plan-enterprise`, `crawl.send`, `crawl.send-gh`, `crawl.close`. The ask bar reads `data-thumb="Read the docs"` from the hero. The one copy control is the close's agent prompt (kit `Copy`, `copyText` honest).

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [x] ~~Marquees pause, freeze under reduced motion, hide duplicates~~ n/a: no marquee
- [x] ~~Privacy link and owner line beside every submit~~ n/a: no form

Done here: The only figures are Hanzo's: $49, $499, Custom, 50,000 / 500,000 / Unlimited pages, 5 / 25 / Unlimited concurrent crawlers, and 169.254.169.254 and 302 from the copy. The plan finder can show nothing else: it has three stops and no number field. The invented "2" figure of "Two ways to call it" is gone (now two outline chips, HTTP and MCP).

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] ~~Tables, FAQ, tabs and code use the kit parts~~ n/a: no table, FAQ, tab set or code sample here (the Markdown panes are drawn illustration, `aria-hidden`)
- [x] `python3 scripts/parity.py /crawl`: 0 missing

Done here: Parity: text 108/108, links 14/14. Sizes are deck only: h1 52, section headings 26 (`kn-headline`), H3 17, lede 21, body 16, captions 13 to 14, the slider figure 64/220, plan prices 44/220. At 320 and 375 the only text under 14px is the kit close's "Agent prompt" (12px) and `Copy` (12.5px), reported above.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside the deck
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from the deck; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: Every hex in `Crawl.css` is a deck value (#0a0a0a, #262626, #525252, #737373, #a3a3a3 on black only, #d4d4d4, #e4e4e4, #e5e5e5, #e9e9e9, #ededed, #f2f2f2, #f5f5f5, #f7f7f7, #fafafa, #fff); 0 `box-shadow`; radii 6/8/12/16/24/999 only. The "Which plan covers it" label above the Pricing h2 moved into the slider panel; the phone step numbers moved under the scene; the "content" tag is in the flow inside the outlined subtree, not floating over the page. Status is a shape or a word: the refused node is a dashed outline with "refused", the console's step a hollow circle that fills.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] ~~Dialogs are native, trap focus and return it~~ n/a: no dialog on this page
- [x] ~~Inputs 16px or larger~~ n/a: no text input (the slider is a `role="slider"` thumb); no bare `:hover`
- [x] Forks this page deleted: listed above

Done here: Every `:hover` in `Crawl.css` sits inside `@media (hover: hover)`; reader tabs, chapter titles, steps, slider stops, console links and related rows press to .97 (rows .99) in 90 ms; every focus ring is `2px solid var(--focus)`. Loading is the `Cta` hand-off state (`aria-busy`). The slider takes arrows, Home and End, a tap or a drag, and its thumb is a 44px target.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit

Done here: `python3 scripts/variety.py`: OK (useScroll, pathLength, layoutId; 0 `Rise`). Six kinds: arrival (h1 cut-in, stage), idle (the reader crawls an example page every 5.6 s while seen and not paused), scroll (stage settle, the scene: 2 of 6), state (stop slider, figure by line mask, ring glide 400 ms `[0.4,0,0.2,1]`), time (the console's session runs once, 2.4 s), pointer (magnetic ask, slider drag). No spring; the flow dots run three times and rest; the phone scene plays once with a pause control first in its DOM. No sound added by the page.

## 10. Media
- [x] ~~`Film` and `Pic` only~~ n/a: the page has no Hanzo image or film; its objects are drawn product UI
- [x] ~~At most 2 videos playing~~ n/a: no video
- [x] Budgets met; nothing missing; ~~alt on every image~~ n/a: no image
- [x] ~~4+ real visuals together~~ n/a: Hanzo has no media for Crawl

Done here: The objects are the reader (hero), the crawl map (scene), the slider and sheet (pricing), the console (send) and the close's terminal; all are HTML and SVG, no media weight.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: `sweep.cjs crawl`: no sideways scroll, no errors (desk and 375). At 320×640 scrollWidth 320; at 375×667 the primary's bottom is at 234px. The phone scene is its own composition: words, the map, then six 44px steps and the pause control; the console's sidebar becomes 44px icon links with their names kept for readers.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] ~~Forms labelled; first error focused~~ n/a: no form
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: Text on white is #0a0a0a, #525252 or #737373 (4.74:1); on #f5f5f5 (send room, slider panel) only #525252 or darker (the note moved from #737373 to #525252); on black #fafafa, white 78%, white 55% (5.9:1) or #a3a3a3. Headings: h1, then h2 (scene, How it works, Pricing, Send it a URL, Get Crawl) and h3 (chapters, plans). The hero loop pauses with the stage's control; the phone scene has its own `kn-pause` (`aria-pressed`).

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: The page no longer imports `Frame.jsx` (or its CSS); 0 `setInterval`, timers are single `setTimeout`s gated on being seen. The scene's one scroll value drives every part through a CSS variable (no per-frame React); the zoomed site is `display: none` until its beat. All filming ran in the cloud container.

## 14. SEO and machine files
- [x] Title and description match live (from `content/pages.json`, unchanged)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route="/crawl">` parses; no broken URL
- [x] Every card is a real link

Done here: `app/crawl/page.jsx` is unchanged: metadata from `INDEX['/crawl']` and `<JsonLd route="/crawl" />`. Every word is in the server HTML (parity reads it without JS).

## 15. Catalogue and product pages
- [x] ~~Model card matches `SPEC.md`~~ n/a: not a catalogue or model page
- [x] Every card opens by Morph (the three related rows)
- [x] ~~Every maker and model page linked~~ n/a: not a catalogue
- [x] One price figure everywhere

Done here: Cloud product anatomy: identity (hero), the live object (reader), the facts that open in turn (the scene and the spec sheet), the console, the close. Each price prints once, in the sheet; the slider readout repeats the chosen plan's own line.

## 16. Developer experience
- [x] ~~One `CodeBlock`~~ n/a: no code sample on the page; the close's agent prompt is the kit `KeynoteClose` terminal and copies exactly what it shows
- [x] ~~Config blocks parse on their own~~ n/a: no config block
- [x] Terminal pauses and ends on a static frame (the console runs once and rests; the close's caret blinks 6 times)
- [x] No hand-typed version number

Done here: The only copyable text is "Read https://hanzo.ai/skill.md and use Hanzo Crawl in my project. Start with: hanzo crawl create", copied byte for byte by the kit `Copy`.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed (n/a in part: the page fetches nothing; the console's running and done states are drawn)
- [x] Blocked live data leaves a complete page, no console errors
- [x] ~~A failed submit keeps its values~~ n/a: no form
- [x] A thrown island does not blank the page (`app/error.jsx` keeps header and footer)

Done here: No fetch at all, so nothing can fail to load; console errors: none (film and sweep, desk and phone). Paused, chosen-by-hand, reduced-motion (final states, the session already done) and JS-off states each read as intended.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through the kit `Cta`'s `cta_click` (`hz-event`; `lib/track.js` is not built yet)
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: 8/10 …` in the page file's top comment
- [ ] Review read: `docs/review/crawl.md` does not exist yet (no critic verdict to answer)

Done here: Eight `data-cta` ids (part 4); metric `api_key_created`. Gallery: `docs/gallery/crawl/desktop.mp4` (scroll film), `desktop.jpg`, `phone-1.jpg` to `phone-3.jpg`, filmed with 0 console errors and no sideways scroll.
