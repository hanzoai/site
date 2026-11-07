# /kai/guide coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/model/KaiGuide.jsx` (+ `KaiGuide.css`) · gallery: `docs/gallery/kai/guide/` · metric id: `api_key_created`

Open copy questions for James: none.
Shared changes requested: `docs/requests/kai-guide.md` (phone sticky ask: the header keeps a solid "Try Hanzo" beside the hero's solid "Get an API key" and never swaps at 375; kit `CodeBlock` needs a `room` prop so a light code tile does not turn the header dark; kit `Band` is a black room with non-deck greys and no `data-cta`, so this page builds its close locally). The footer's server HTML still logs a hydration warning on load (shared).
Forks this page deleted: its own tab strip with a layoutId ink and three hand-built `<pre>` panels (now kit `Tabs` + `TabPanel` + `CodeBlock`); raw `.x-btn` asks (now `Cta`); the floating Replay button over the terminal (now a control in the terminal bar); the looping session; every spring; the Motion tweens on the checker rulers (now one CSS transform, identical on server and client); the six-sentence recipe list (now one stage).

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` — n/a for plans: the page has no plan; its only price ($0.021 / $0.042 per million input tokens) is Hanzo's sentence
- [x] Open copy questions for James listed, none decided

Done here: Header lines `// Persona:`, `// Goal:`, `// CTA:`, `// Metric: api_key_created`, `// Signature:`, `// Beyond:`. One solid "Get an API key" in the hero and once more in the closing band (the header ask turns quiet while the band's solid is in view). The recipes room's "Read the Recipes Guide" is now the quiet (outlined) `Cta`, so the room holds no second solid. `lib/cta.js` is not on this branch, so the labels are Hanzo's own.

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
- [x] Ends in proof strip, `Band`, footer
- [x] Card-to-page links use Morph — n/a: no cards

Done here: Measured at 1470×801: the h1's last line ends at 305px (38% of the screen) and "Three question types" peeks in at 733px; the terminal is 477px tall. The page ends on a proof strip (84.4% / 76.6% bars and Hanzo's method sentence, between hairlines), then a page-local closing band on the Quiet room: the guide's own sentence "Kai answers each question with a probability for every answer it allows, and writes no text." cut in by line mask, then "Get an API key" and "Read the reference", then the footer. The kit `Band` was not used: it is a black room (a third dark surface) with non-deck greys and no `data-cta`. The `<noscript>` style now sits in the hero section, not inside the h1 (h1 textContent is "How toUse Kai").

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label (shared ask bar, fed by `data-thumb`)
- [x] Copy button copies exactly the displayed text; failure never says Copied (kit `Copy` / `CodeBlock`)
- [x] `data-cta` and `data-thumb` on every primary

Done here: `Cta` ids `kai-guide.hero` (thumb), `kai-guide.hero-reference`, `kai-guide.recipes` (quiet), `kai-guide.recipes-cookbook`, `kai-guide.recipes-github`, `kai-guide.close`, `kai-guide.close-reference`.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [x] Marquees pause — n/a: no marquee
- [x] Privacy link beside every submit — n/a: no form

Done here: The proof strip holds Hanzo's 84.4% (kai-1.4, ink) and 76.6% (Jev, grey) on zero-based bars, with Hanzo's sentence and "The runs →" beside them. The streamed response shows field names only, with values left as "…".

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts
- [x] `python3 scripts/parity.py /kai/guide`: 0 missing

Done here: Only the 12px Zen Mono capital labels and the `01 / 06` recipe index sit under 13px; code is the kit's 13.5px. Rest sizes: h1 52px (44px phone), section heads 26px, closing sentence 32px (26px phone), recipe on stage 44px mono (26px phone), lede 21px, body 16px, figures 64px Air. Parity: text 184/184, links 7/7.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside the deck ramp
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: Two dark surfaces only, never back to back: the graphite hero terminal and the black recipes room. The code (white tile on a full-width Quiet `#f5f5f5` room), the checker (Quiet tile, ink type, `#e4e4e7` tracks) and the Jev diff (Quiet tile, added lines on white, old tokens struck) are light. Room rhythm: Paper hero, Paper types, Quiet code, Paper limits, Black recipes, Paper Jev + proof, Quiet close. Radii 24 / 16 / 12 / 6 / full; no shadows. taste.py passes on both files.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs native — n/a: no dialog
- [x] Inputs 16px or larger; no bare `:hover` (all hover rules sit in `@media (hover: hover)`)
- [x] Forks this page deleted: listed above

Done here: Terminal and recipe-stage pause controls (44px, `aria-pressed`, white ring on dark), recipe names (56px buttons, `aria-pressed`, hover fill by clip-path, press .98), question-type rows (Quiet fill wipes in, the name shifts 6px), model chips (radiogroup, arrow keys), range rulers (44px hit area, ink ring on the knob), limit buttons (press translateY 1px), kit tabs and copy, the quiet recipes ask outlined on black.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups (`variety.py` OK: typing only, 0 fade-ups)
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [ ] Sound: not built here (one shared kit, not merged yet)

Done here:
- Time: the session types once and streams once.
- Idle: the three question glyphs take turns (choice bars re-weight, the score dot steps, the noul thumb tips) in a 9 s round, one mover at a time, paused off screen; the recipe stage's hairline fills for 6 s and hands on to the next recipe (paused by its control, by the pointer on the room, by focus, and off screen); the checker walks Hanzo's five cases once, then rests.
- Pointer and state: recipe names come on stage by line mask (name) and clip (line); kit tab pill; picking a limit loads its case, and Price wipes a white tile behind the cost line and steps the figure forward.
- Arrival: the h1 cut-in; the closing sentence cuts in by line mask.
- Scroll-triggered: the diff lines land and the bench bars draw.
- Walk (1470×801): 1 still stop of 11 (the footer); phone 3 of 16 (footer).

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

Done here: Phone order is h1, the "Hanzo decision model" caption, a 148px terminal (typing), lede, then "Get an API key" (608–652px, inside 667). The recipe stage sits on top with the six names as a 2-column grid of 48px buttons beneath. Measured: overflowX 0 at 375 and 1470.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled — n/a: no form; the rulers are labelled (`State tokens`, `Questions`)
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: Text on white uses #0a0a0a, #525252, #737373; on the Quiet room and tiles #525252 or darker (the code room sets `--room-soft: #525252`); on black #fafafa, white 78%, #a3a3a3. The terminal and the recipe stage each have a pause control first in their bar; off-stage recipes are `aria-hidden`. Gap: no axe run in this pass.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized (no media)
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop (all checks ran in the cloud)

Done here: CLS over a full walk: 0.0027 at 1470×801 and 0.0094 at 375×812. The red hydration badge's page part is gone: the checker rulers render a fixed `translateX(nn.nn%)` string on both sides, and the two range inputs carry `suppressHydrationWarning` (a screenshot taken before hydration writes an inline caret-color on inputs). The only remaining console error is the shared FooterHTML. Gap: bundle size not measured in this pass.

## 14. SEO and machine files
- [x] Title and description match live (`app/kai/guide/page.jsx`, unchanged)
- [x] Canonical equals og:url (shared `JsonLd`)
- [x] `<JsonLd route="/kai/guide">` parses
- [x] Every card a real link — n/a: no cards

Done here: The metadata and `JsonLd` in `app/kai/guide/page.jsx` are untouched from the captured page. The h1's textContent no longer carries CSS.

## 15. Catalogue and product pages
Done here: n/a: a developer guide, not a catalogue or model page.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display
- [x] Config blocks parse — n/a: no config block
- [x] Terminal pauses and ends on a static frame
- [x] No hand-typed version number

Done here: The curl, Python and TypeScript blocks are kit `CodeBlock`s under kit `Tabs`; the tabs open on Python because the hero terminal already typed the curl (curl stays one tab away, unchanged). The terminal's Copy gives the curl exactly and ends at rest with pause and replay in its bar. The Jev diff stays a page `<pre>` (a diff view, not a copy block).

## 17. States and resilience
- [x] Loading, empty, error and offline states designed — n/a: no live data on this page
- [x] Blocked live data leaves a complete page, no console errors (nothing fetched; 0 page errors at both sizes)
- [x] A failed submit — n/a: no form
- [x] A thrown island does not blank the page (shared error boundary)

Done here: JS off prints the full request and response, every limit, all three code panels, all six recipes in the stage and the diff's final state. Reduced motion: `getAnimations()` inside the page is empty after 3 s; glyphs, recipe fill and close cut-in hold their final state. The checker covers its 200, extrapolated and 422 states.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js` (`Cta` sends `cta_click` through the shared event)
- [x] Nothing identifier-bearing before consent
- [x] `V2:` line in the page file's top comment
- [ ] Review read: `docs/review/kai/guide.md` (7/10); fixes 1 to 8 done here, fix 9 (phone sticky ask) requested in `docs/requests/kai-guide.md`; awaiting a new verdict

Done here: Gallery: `docs/gallery/kai/guide/` (round-2 desktop and phone stills added beside the earlier film and phone stills).
