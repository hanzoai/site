# /kai/guide coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/model/KaiGuide.jsx` (+ `KaiGuide.css`) · gallery: `docs/gallery/kai/guide/` · metric id: `api_key_created`

Open copy questions for James: none.
Shared changes requested (`docs/requests/<page>.md`): none written. Two notes for the shared owners: the desktop ask bar is a floating pill over content (MASTER 3.2 rule 6); the footer's server HTML logs a hydration warning on load.
Forks this page deleted: its own tab strip with a layoutId ink and three hand-built `<pre>` panels (now kit `Tabs` + `TabPanel` + `CodeBlock`); raw `.x-btn` asks (now `Cta`); the floating Replay button over the terminal (now a control in the terminal bar); the looping session and the endlessly cycling checker (both run once, then rest); every spring.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` — n/a for plans: the page has no plan; its only price ($0.021 / $0.042 per million input tokens) is Hanzo's sentence
- [x] Open copy questions for James listed, none decided

Done here: Header lines `// Persona:`, `// Goal:`, `// CTA:`, `// Metric: api_key_created`, `// Signature:`, `// Beyond:`. One solid "Get an API key" in the hero (measured: 1 solid on the first screen at 1470×801 and 375×812). It is repeated once at the close; the recipes room's one solid is Hanzo's "Read the Recipes Guide". `lib/cta.js` is not on this branch, so the labels are Hanzo's own.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it (shared shell)
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [x] Breadcrumb at depth 2 or more
- [x] Link parity: 0 removed, 0 unexpected

Done here: Links go through `A` and `Cta`. The breadcrumb "Models / Kai Guide" sits under the hero asks (the last item is not a link). Parity: links 7/7.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero` (kit part not merged: the hero is page-local, h1 cut in by line mask 105%→0, 700 ms, ease-emphasis, 60 ms apart); nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer — the benchmark figures are the proof; there is no Band copy on this page, so the close repeats the hero ask (no new words)
- [x] Card-to-page links use Morph — n/a: no cards

Done here: The first screen moves within 1 s at both sizes (the terminal starts typing at 450 ms; screenshots at 0.3 s and 1.2 s differ). On phone the terminal sits right under the title, before the lede and the ask, and all four fit 375×812. JS-off render: 0 hidden text blocks (the `noscript` rule lifts the h1 masks and shows all three code panels).

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label (shared ask bar, fed by `data-thumb`)
- [x] Copy button copies exactly the displayed text; failure never says Copied (kit `Copy` / `CodeBlock`)
- [x] `data-cta` and `data-thumb` on every primary

Done here: `Cta` ids `kai-guide.hero` (thumb), `kai-guide.hero-reference`, `kai-guide.recipes`, `kai-guide.recipes-cookbook`, `kai-guide.recipes-github`, `kai-guide.close`, `kai-guide.close-reference`.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [x] Marquees pause — n/a: no marquee
- [x] Privacy link beside every submit — n/a: no form

Done here: The only proof figures are Hanzo's 84.4% (kai-1.4) and 76.6% (Jev), with Hanzo's sentence and "The runs →" beside them. The streamed response shows field names only, with values left as "…".

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts
- [x] `python3 scripts/parity.py /kai/guide`: 0 missing

Done here: Measured on every visible text node: only the 12px Zen Mono capital labels sit under 13px; code is the kit's 13.5px. Rest sizes: h1 52px (44px phone), section heads 26px, lede 21px, body 16px, figures 64px Air. Parity: text 184/184, links 7/7.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens (deck values only, set once at the top of `KaiGuide.css`)
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: taste.py passes on both files. Radii are 24 (terminal, code, checker, black room tile), 16 (verdict), 6 (chips) and full (buttons). No shadows; tiles are flat graphite. The labels ("Questions", "Call it", "Limits", …) sit beside or under their headings. The hero is a terminal, where `/kai` and the Zen pages lead with film.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs native — n/a: no dialog
- [x] Inputs 16px or larger; no bare `:hover` (all hover rules sit in `@media (hover: hover)`)
- [x] Forks this page deleted: listed above

Done here: Terminal pause/replay (44px, `aria-pressed`, white ring on graphite), model chips (radiogroup, arrow keys), range rulers (44px hit area over the track, ring on the knob), limit buttons (press translateY 1px), kit tabs and copy. Presses use scale .97 at 90 ms.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups (`variety.py` OK: typing only, 0 fade-ups)
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [ ] Sound: not built here (one shared kit, not merged yet)

Done here:
- Time: the session types once and streams once.
- Idle: the checker walks Hanzo's five cases once, then rests.
- State: kit tab pill; picking a limit loads its case.
- Arrival: the h1 cut-in.
- Scroll-triggered (2 of 6): the diff lines land and the bench bars draw.
- Glyphs draw once.
- Durations are the deck's 90/150/300/400/500 ms on ease-emphasis, with no springs.

## 10. Media
- [x] `Film` and `Pic` only — n/a: the page has no image or film on hanzo.ai
- [x] At most 2 videos — n/a
- [x] Budgets, alt — n/a
- [x] No dimmed photo — n/a

Done here: n/a: no media on this page. The hero object is the live terminal.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: Phone order is h1, the "Hanzo decision model" caption, a 148px terminal (typing), lede, then "Get an API key". At 375×667 the ask sits at 608–652px, inside the fold. Measured: scrollWidth equals the viewport at 320, 375 and 1470, and every panel ends inside the gutter.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled — n/a: no form; the rulers are labelled (`State tokens`, `Questions`)
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: Text pairs are #0a0a0a, #525252 and #737373 on white; white 78% and 55% on #171717; #a3a3a3 on black. The terminal has pause and replay. The verdict is `aria-live` once you take over. Gap: no axe run in this pass.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized (no media)
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop (all checks ran in the cloud)

Done here: Layout shift measured over a full scroll: 0.0009 at 1470×801 and 0.0049 at 375×812. The response block joins only when it streams, the verdict box holds the tallest of its five answers, and the status and price have fixed widths. Typing writes into text nodes through refs. Gap: bundle size not measured in this pass.

## 14. SEO and machine files
- [x] Title and description match live (`app/kai/guide/page.jsx`, unchanged)
- [x] Canonical equals og:url (shared `JsonLd`)
- [x] `<JsonLd route="/kai/guide">` parses
- [x] Every card a real link — n/a: no cards

Done here: The metadata and `JsonLd` in `app/kai/guide/page.jsx` are untouched from the captured page.

## 15. Catalogue and product pages
Done here: n/a: a developer guide, not a catalogue or model page.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display
- [x] Config blocks parse — n/a: no config block
- [x] Terminal pauses and ends on a static frame
- [x] No hand-typed version number

Done here: The curl, Python and TypeScript blocks are kit `CodeBlock`s under kit `Tabs`. The terminal's Copy gives the curl exactly. The terminal ends at rest on the full request and response, with pause and replay in its bar. The Jev diff stays a page `<pre>` (a diff view, not a copy block).

## 17. States and resilience
- [x] Loading, empty, error and offline states designed — n/a: no live data on this page
- [x] Blocked live data leaves a complete page, no console errors (nothing fetched; 0 page errors at both sizes)
- [x] A failed submit — n/a: no form
- [x] A thrown island does not blank the page (shared error boundary)

Done here: JS-off and reduced motion show the full request and response, every limit, all three code panels and the diff's final state. The checker covers its 200, extrapolated and 422 states.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js` (`Cta` sends `cta_click` through the shared event)
- [x] Nothing identifier-bearing before consent
- [x] `V2:` line in the page file's top comment
- [ ] Review read: `docs/review/kai-family.md` was 7/10 before this rework; every listed fix is done (terminal under the h1 on phone, empty-first terminal, reserved heights, 13px+ figures, `data-cta`); awaiting a new verdict

Done here: Gallery: `docs/gallery/kai/guide/` (desktop film plus 3 phone stills), re-filmed after this rework.
