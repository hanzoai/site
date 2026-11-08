# /dev coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/DevPage.jsx` · gallery: `docs/gallery/dev/` · metric id: `signup_start` (`install_copy` on the install commands)

Open copy questions for James:
1. The live page says Linux, macOS and Windows, but curl and Homebrew are not Windows. The copy is kept as is.
2. `v0.7.7` is hand-typed, as on Hanzo's page; MASTER 16 wants versions from the registry at build time.
3. The sample session needed a task line. It uses Hanzo's own "Describe the change." rather than an invented sentence.

Shared changes requested (`docs/requests/chat.md`): the kit `Band` (blur word reveal, no `data-cta`), the floating ask bar on desktop, and `.x-arrow` underlines.
Forks this page deleted: page `Btn` and `Lk` button forks (now kit `Cta`), the hand-written install table and two code-block forks (now kit `Tabs` plus `CodeBlock`), the hand-written dark close (now kit `Band`), the raw `<table>`, and the four-column highlights row.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`. n/a for `lib/cta.js`: it is not on main. The label is Hanzo's own "Open Dev".
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button. n/a for prices: none on /dev.
- [x] Open copy questions for James listed, none decided

Done here: "Open Dev" (`/login?next=%2Fdev`) is the only solid fill: the kit `Cta` in the hero, the site ask bar after it, and the closing `Band`. "Read the docs" and "Explore GitHub examples" are text links.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it (shared layout)
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- n/a: breadcrumb. Depth 1.
- [x] Link parity: 0 removed, 0 unexpected

Done here: Parity: links 12/12. Every link is the kit `Cta kind="link"` or `A`. `#install` still lands on Install.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero`; nothing above the h1. `PageHero` is not in the kit, so this is the same anatomy as a page part.
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer
- n/a: Morph. No cards lead to their own page here.

Done here:
- At 1470×801: the 52px h1 on the left, the lede and asks on the right (an 8/5 split), and the whole terminal beneath. Its session writes from the first second.
- Order: hero, the black race room, the places rail, quiet sheets, install, source and Q&A, paste, then the black `Band`.
- The page is 10,716px, down from 13,343.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text; failure never says Copied (kit `CodeBlock` and `Copy`; the `$ ` prompt is display-only)
- [x] `data-cta` and `data-thumb` on every primary

Done here: `Cta id="dev.hero" thumb`. Every link carries its own `data-cta` (dev.docs, dev.github, dev.race and the rest). Cross-origin hand-offs get the kit's `aria-busy` ring.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- n/a: marquees. None.
- n/a: a Privacy link by a submit. No form.

Done here: 3.02×, 44 and 42 tasks, the 95% interval 2.06–4.36×, 8.22× and 1.31× with their intervals, and the run medians 9.52 s and 2.29 s are Hanzo's. The clocks show only 0.00 s (ready) or the final median: no running count flashes numbers that aren't Hanzo's.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts (`Tabs`/`TabPanel`, `CodeBlock`, `Faq multi`)
- [x] `python3 scripts/parity.py /dev`: 0 missing

Done here: Parity: text 176/176. Sizes:
- h1: 52px
- section headings: 26px
- the 3.02× figure: grows from its resting size to 160px as the room opens
- body: 15 to 17px
- captions: 12px mono capitals

The reading index is folded into a `<details>` whose summary is Hanzo's own heading.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes. Literal hex values are snapped to the deck (`tokens.css` does not exist yet).
- [x] No label, tag, badge or pill above a headline. The section labels are captions below their headings.
- [x] Radii, shadows and sizes from tokens; never box plus shadow. Radii: 24 for objects, 16 for code, 12 to 14 for rows. The only shadow is on the floating terminal.
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here:
- Rooms: paper, black (race), paper, quiet `#f5f5f5` (sheets), paper, black (`Band`).
- Hero: a stacked terminal under an 8/5 headline row. /chat is headline-left with the window right; /agents is a black film room.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- n/a: dialogs. None (the info note is a disclosure).
- [x] Inputs 16px or larger; no bare `:hover`. n/a for inputs: none.
- [x] Forks this page deleted: listed below

Done here: Rows, ladder rungs, rail controls, the `(i)` toggle and Pause or Replay all have:
- hover inside `@media (hover:hover)`
- press at scale .97 (90 ms)
- a 2px ring

Ladder rungs are a fixed 52px. Their lines show in one fixed-height box, so nothing jumps on hover.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups (`variety.py` OK)
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- n/a: sound. The shared kit is not on main.

Done here: Kinds of movement:
- time: the session and the race, both on `AppDemo` (run once, pause, rest)
- arrival: the h1 line mask and the terminal entry
- pointer: the thrown rail with inertia, ladder and row previews
- state: row and tab pills at 300 ms ease-emphasis, no springs
- scroll: only the race room opening and the figure growing

Each card and sheet plays one scene when first seen.

## 10. Media
- n/a: `Film`/`Pic`. No raster media; every object is a live UI render.
- n/a: video limits. None.
- [x] Budgets met; nothing missing; alt on every image (no images)
- n/a: real visuals. The page has no Hanzo imagery to show.

Done here: Objects are product renders: the terminal and file pane, the race board, four place UIs, code rows, the fence and the harness. All are drawn in CSS at true size.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320 (checked at 375: 0px)
- [x] Every target 44px or more; every hover has a tap path. The one exception is the inline `hanzoai/dev` link inside a sentence.
- [x] Primary ask above the fold at 375×667

Done here: On phone: the h1 is 3 lines at 40px, then the lede and "Open Dev", with the terminal starting on the first screen. The race stacks and is not pinned. The rail is a native swipe with snap, and the sheets are not sticky.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better (`#0a0a0a`, `#525252` and `#737373` on white; `#fafafa`, white 78% and `#a3a3a3` on black)
- [x] Pause control on every moving item (the session and the race)
- n/a: forms. None.
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: The session's final frame is in the server HTML. The race result is a visually hidden list. Toggles use `aria-pressed` and `aria-expanded`, and the tabs are the kit's APG tabs. Gap: no axe run in this pass.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized. Budgets are unmeasured (no CI yet).
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: Only transform, opacity and clip-path animate. The session writes into nodes through refs. The race ticks only while it plays and pauses off screen.

## 14. SEO and machine files
- [x] Title and description match live (unchanged in `app/dev/page.jsx`)
- [x] Canonical equals og:url equals the live URL (shared metadata)
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link. n/a for cards: the place cards are not links (Hanzo's are not either).

Done here: `app/dev/page.jsx` keeps "Hanzo Dev — the coding agent", its description, and `<JsonLd route="/dev" />`.

## 15. Catalogue and product pages
- n/a: not a catalogue or model page.

Done here: n/a. /dev is a Launch page with no model cards or price tables.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (kit `CodeBlock` for the install, sign-in and agent prompt)
- n/a: config blocks. None.
- [x] Terminal pauses and ends on a static frame (`AppDemo`, plus a server-rendered poster)
- [x] No hand-typed version number. Exception: Hanzo's own `v0.7.7`, listed as a copy question.

Done here: The install is three kit tabs, one command each, with `prompt` (`$ ` is display-only, so the copy is the command). The terminal starts in view, pauses, and rests on the poster frame.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed. Demo states: ready, running, done. Offline is n/a: nothing is fetched.
- [x] Blocked live data leaves a complete page, no console errors
- n/a: failed submits. No form.
- [x] A thrown island does not blank the page (shared boundaries)

Done here: JS off shows the finished session and the finished race (9.52 s and 2.29 s, done). With motion on, the clocks reset to ready on mount, before you reach them. Runs with `api.hanzo.ai` blocked logged 0 console errors.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js`. `lib/track.js` is not on main; the kit `Cta` dispatches `hz-event`.
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment (after review)
- [x] Review read: `docs/review/dev.md` verdict 8 or more. The critic gave 6 before these fixes; pending re-review.

Done here: Proof is in `docs/gallery/dev/`: a 15 s 1470×801 film, the first screen, and three 375×812 phone shots.
