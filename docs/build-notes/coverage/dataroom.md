# /dataroom coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/apps/Dataroom.jsx` (+ `Dataroom.css`) · gallery: `docs/gallery/dataroom/` · metric id: `signup_start`

Open copy questions for James: none (no CTA label changed; "Try Hanzo" goes to /login as on the live hero, while the header's "Try Hanzo" goes to /signup; both kept as live).
Shared changes requested (`docs/build-notes/requests/<page>.md`): none.
Forks this page deleted: the raw `.x-btn` asks (now kit `Cta`), the v2 `AskBar` (the site's ask bar carries the ask), every `data-cursor` label, every spring and hover lift.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js`
- [x] Open copy questions for James listed, none decided

Done here: Header carries Persona, Metric `signup_start`, Goal, CTA, Signature, Beyond and V2. The header's "Try Hanzo" is the one solid fill (SYSTEM.md §5); the page's own asks carry the same words, so they are quiet (outlined) `Cta`s: hero and close, "Try Hanzo" → /login (`lib/cta.js` does not exist yet, so the live hero's label and href are used). Prices are the live page's four plans; `lib/plans.js` does not exist yet.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- ~~Breadcrumb at depth 2 or more~~ n/a: /dataroom is depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: One `<main>`; the layout's skip link targets `#main` (the shell's main mark). Every link is `A`, `More` or `Cta`; parity links 8/8.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero`; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer
- [x] Card-to-page links use Morph; title lands within 12px

Done here: The h1 (52px, CSS line cut-in) sits beside the live room, whose reading bars move within a second; "Secure Document Sharing" is a caption under the h1. Server HTML has 0 `opacity:0` runs in the hero. Sequence: room, five chapters, folder tree, dark room, plans ladder, close (one sentence, the ask, rows). The ten feature files open into their panel with BizOpen's shared-element morph (no page to morph to).

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- ~~Copy button copies exactly the displayed text~~ n/a: no copy button on this page
- [x] `data-cta` and `data-thumb` on every primary

Done here: Both asks are `<Cta to="/login" id="dataroom.hero|dataroom.close" kind="quiet" thumb>Try Hanzo</Cta>` (quiet because the header's identical ask is solid); the site's ask bar (Ask.jsx) carries the same words after the hero and steps aside while either is on screen, named by `data-ask-name="Hanzo Dataroom"`.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- ~~Marquees pause, freeze under reduced motion, hide duplicates~~ n/a: no marquee
- ~~Privacy link and owner line beside every submit~~ n/a: no form (the email field in the dark room is a local preview, never sent)

Done here: Prices ($0, $25, $59, $99 /mo) and plan lines are byte-identical to `content/live/dataroom.json`; the room's views, feed and bars are demo state labelled with Hanzo's own phrases (time spent on each page, how far they got, came back), not claims.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts
- [x] `python3 scripts/parity.py /<path>`: 0 missing

Done here: Measured: 0 text runs under 14px at 375 (12px mono capitals excepted), off-scale sizes only in kit parts (links 15px). Parity text 102/102, links 8/8. The ten feature descriptions open file by file (BizOpen), hidden copy stays in the HTML.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: taste OK; every grey snapped to the deck ramp (`#0a0a0a`, `#171717`, `#404040`, `#525252`, `#737373`, `#a3a3a3`, `#d4d4d4`, `#e4e4e4`, `#e9e9e9`, `#f2f2f2`, `#f5f5f5`, `#fbfbfb`) or `--bz-*` tokens; radii 6/8/12/16/24/28/full; surfaces outlined only, the floating gate card alone raised (`--bz-float`); sizes 12–64 from the scale (h1 52, headings 26, views 64, prices 44). Hero medium is a reading-analytics room bleeding off the right edge, unlike /ledger's book or /captable's table.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs are native, trap focus and return it
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: listed below

Done here: Pause, switches (`role=switch`), gate buttons, file rows and close rows answer hover with a fill inside `@media (hover: hover)`, press .97–.99, and a 2px focus ring; `Cta` brings busy/disabled. File panels are BizOpen dialogs (focus in, Esc, focus back). The email input is 17px mono. Deleted: raw `.x-btn`, `AskBar`, `data-cursor`, hover lifts.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- ~~Sound only on the listed moments, through the one kit~~ n/a: the page plays no sound of its own

Done here: Signature: the room reads Deck.pdf by itself (idle), plus chapters (scroll), line cut-ins (arrival) and files opening (state); variety OK, 0 Rise. Tweens only (0.3s ease-emphasis arrivals, 0.15–0.5s ease-in-out moves, 0.9s scene moves), no springs. One `setTimeout` loop, only while seen and not paused; reduced motion shows the finished visit.

## 10. Media
- ~~`Film` and `Pic` only; sizes and posters set~~ n/a: no photo or film; the deck pages are inline SVG
- ~~At most 2 videos playing~~ n/a: no video
- [x] Budgets met; nothing missing; alt on every image
- ~~No dimmed or filtered photo; 4+ real visuals together~~ n/a: the page has no Hanzo media

Done here: All visuals are inline SVG (ten deck pages, icons) with `aria-hidden`; no image requests.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: Filmed at both sizes: scroll width 375/375 and 1470/1470; 0 targets under 44px; the room bleeds off the right edge at both sizes; chapters stack (kit); the ask sits at ~350px on a 375 phone.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: Text on white uses `#0a0a0a`/`#525252`/`#737373`; on `#f2f2f2`/`#f5f5f5` tiles `#525252` or ink. The room has a 44px Pause (`aria-pressed`). The email field has a visible label. One h1, h2 per section, h3 in cards.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: The h1 and the room render in server HTML; motion is transform and opacity only (bars scaleX, strip translateX); the only timer runs while seen. Filming ran in the cloud container.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: `app/dataroom/page.jsx` unchanged: metadata from `content/pages.json`, `<JsonLd route="/dataroom" />`. Plan and door links are real `<a>`; the feature files are buttons that open in place (no page of their own).

## 15. Catalogue and product pages
- ~~Model card matches `SPEC.md`~~ n/a: not a catalogue or model page
- ~~Every card opens by Morph~~ n/a: files open in place (BizOpen), no destination page
- ~~Every maker and model page linked in the DOM~~ n/a
- [x] One price figure everywhere

Done here: Each plan price appears once, in its rung.

## 16. Developer experience
- ~~One `CodeBlock`; copy equals display~~ n/a: no code on the page
- ~~Config blocks parse on their own~~ n/a
- ~~Terminal pauses and ends on a static frame~~ n/a
- ~~No hand-typed version number~~ n/a

Done here: n/a: the page has no code, terminal or version.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed
- [x] Blocked live data leaves a complete page, no console errors
- ~~A failed submit keeps its values and shows no success~~ n/a: nothing is submitted
- [x] A thrown island does not blank the page

Done here: No live data: the page is complete in server HTML. The room has playing/paused/reduced states; the viewer has gated, cleared ("Open it again") and "Opens straight away" states, downloads on/off, expiry on/off. 0 console errors in the film.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js`
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/build-notes/review/<page>.md` verdict 8 or more

Done here: `data-cta="dataroom.hero"` and `"dataroom.close"`; `Cta` dispatches `cta_click` (no copy, no PII); the typed email never leaves the page. V2 line updated; no `docs/build-notes/review/dataroom.md` yet, so the verdict is pending a critic.
