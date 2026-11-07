# /learn coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Learn.jsx` (+ `Learn.css`, `app/learn/page.jsx`) · gallery: `docs/gallery/learn/` · metric id: `api_key_created`

Open copy questions for James: none (every line and link is Hanzo's own; parity 69/69 text, 26/26 links).
Shared changes requested (`docs/requests/<page>.md`): none. The header's solid "Try Hanzo" is outlined page-locally in `Learn.css` while the hero's "Get started" is on screen (as /playground does).
Forks this page deleted: the `x-btn solid` hero button (now kit `Cta`), raw `<img>` (now kit `Film`), the pill tag on the map, the train's looping pulse and shadow, tile and card hover lifts, the 2.5rem tile titles; five separate sections after the map are now three scenes (the rail, University + Go further, the dark room) plus collapsed questions.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` (no prices on the page)
- [x] Open copy questions for James listed, none decided

Done here: Persona, Goal, CTA, Metric `api_key_created`, Signature and Beyond are in the top comment of both `components/pages/Learn.jsx` and `app/learn/page.jsx`. One solid per screen: while "Get started" (kit `Cta`, `data-cta="learn.hero"`) is in view, `main.xlr[data-ask-on]` turns the header's "Try Hanzo" into an outline (measured: header ask background `rgba(0,0,0,0)` at 1470×801 and 375×812); once the hero ask leaves view the header's solid returns, labelled "Get started".

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- ~~Breadcrumb at depth 2 or more~~ n/a: depth-1 page.
- [x] Link parity: 0 removed, 0 unexpected

Done here: One `<main>`; every link goes through kit `A`, `Cta` or `More`; the rail cards, rows, posts and thinking links are real `<a>`; the two film cards use a sibling link whose `::after` covers the card. `parity.py /learn`: links 26/26.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [ ] `PageHero`; nothing above the h1 (nothing above the h1: yes; `PageHero` is not in the kit yet)
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [ ] Ends in proof strip, `Band`, footer (the live page has no proof strip or band; none added)
- [x] Card-to-page links use Morph; title lands within 12px

Done here: "Learn Hanzo" (52px) cuts in by line mask and the train starts riding the Start-here line within a second, by itself, then rests on MCP. After the map, one idea per screen: (1) the 01–06 rail, (2) Hanzo University's film beside Go further, (3) the dark room led by the newest post at 44px with the thinking along its foot, (4) questions collapsed under a 64px question number. Heights differ (rail ~760px, University ~900px, dark room ~1100px, questions ~600px). Rail and row titles carry `data-morph`.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label (header only: the shared desktop pill was removed site-wide on 7 Nov)
- ~~Copy button copies exactly the displayed text; failure never says Copied~~ n/a: no copy control.
- [x] `data-cta` and `data-thumb` on every primary

Done here: kit `Cta` for "Get started" (`data-cta="learn.hero"`, `data-thumb="Get started"`, measured at 1470, 375 and 320) and "Hanzo University" (`data-cta="learn.university"`, kit link: arrow drifts and the label underlines on hover, scale .97 on press in 90 ms). After the hero, the sticky header carries "Get started" solid.

## 5. Trust and proof
- ~~No logo without documented permission; no seal; no invented number~~ n/a: no logos, seals or claims. The 64px numerals are item counts (01–06, 01–05), not claims.
- ~~Every figure traces to Hanzo's copy; qualifier beside the number~~ n/a: no figures.
- ~~Marquees pause, freeze under reduced motion, hide duplicates~~ n/a: no marquee.
- ~~Privacy link and owner line beside every submit~~ n/a: no form.

Done here: No logos, seals or invented figures; the post dates are Hanzo's own (2026-10-26, 2026-10-25, 2026-10-07).

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts
- [x] `python3 scripts/parity.py /learn`: 0 missing

Done here: parity 69/69 text, 26/26 links. Scale: h1 52px (40 phone), section heads 26px (24 phone), figures 64px (rail numerals, question number), the lead post 44px as the dark room's one big thing, row and card titles 21px, body 16px, dates 13px mono. Questions are the kit `Faq`, multi-open, all closed at rest, `#q-<slug>` opens one (hidden answers stay in the HTML as `hidden="until-found"`).

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` OK on the 3 files (greys only; the only colour-free media are Hanzo's Zen and Kai films). Nothing above a headline: the map's "Learn / Start here" labels sit inside the map. Radii 24 (cards, films), 16 (map panel), full (buttons); flat fills, no shadows. Hero object is the transit map, unlike /affiliate (type) and /beta (films). One dark room.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- ~~Dialogs are native, trap focus and return it~~ n/a: no dialog.
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: listed above

Done here: stations are an arrow-key tablist; rail steppers (44px) have hover, .97 press and `disabled` at each end; cards, rows, posts, film cards and the two 44px pause buttons have hover inside `(hover: hover)`, .97 press and a 2px focus ring (white on the dark room); the kit `Cta` shows `aria-busy` on the cross-origin hand-off. Every `:hover` in `Learn.css` sits inside `@media (hover: hover)`.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- ~~Sound only on the listed moments, through the one kit~~ n/a: nothing page-local plays sound.

Done here: Signature (idle/time): the train rides the Start-here line once, 2.8 s a stop, and rests. Idle: the rail's numerals ink one after another across the cards on screen when it first comes into view (0.7 s each, under 5 s, ends on any touch); the Zen and Kai films loop in view. Pointer: the rail drags with inertia (mouse) and snaps by proximity; the question number follows pointer and focus, cut in by line mask. State: stations open their guide; answers open. Arrival: line-mask h1. Scroll-linked: none. Timers are `setTimeout` chains; reduced motion keeps the first station, no ink ride, film posters. `unique.py`/`variety.py`: /learn passes.

## 10. Media
- [x] `Film` and `Pic` only; sizes and posters set
- [x] At most 2 videos playing; pause button on loops over 5 s
- [x] Budgets met; nothing missing; alt on every image
- [x] No dimmed or filtered photo; 4+ real visuals together where the page has them (the page has two: Zen and Kai)

Done here: kit `Film` only (no raw `<video>`/`<img>` in the page file): Zen's film on the Hanzo University card (`public/learn/zen-720.webm`, 30 KB, 8 s loop) and Kai's film on Kai's own post (`public/learn/kai-640.webm`, 130 KB, 6 s loop), both re-encoded from `public/models` to sit inside the 150 KB card budget, posters from `public/models/*.webp`, `w`/`h` set. Each has a 44px Pause (`aria-pressed`) first in its card; measured: pressing it pauses the film and it stays paused through scrolling. Films are decorative (`aria-hidden`), undimmed.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: measured scrollWidth = clientWidth at 1470, 375 and 320. 375×812: "Get started" full width at y 247–295 (above the fold at 667); the map keeps its dots with the guide below; the rail shows one card with a 16% peek and scrolls natively; University and Go further, the posts and the thinking stack to one column. Steppers, pause buttons, stations and FAQ rows are 44px+.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- ~~Forms labelled; first error focused~~ n/a: no form.
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: body grey `#525252` on white and `#f2f2f2`, `#a3a3a3` only on `#171717`/`#0a0a0a`. Both film loops have a Pause first in their card; the train rides once (2.8 s a stop, 4 stops) and stops on any pick or arrow key; the ink ride is under 5 s. One h1, then h2s; map guides are h3. The map is a labelled tablist (arrow keys); the rail is a labelled list of links; the question number is `aria-hidden`.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: "Learn Hanzo" and every guide, card, post and answer are in the server HTML. No poller (no `setInterval`); films load only near the screen (`preload="none"`, source added by IntersectionObserver). Filming and ffmpeg ran in the cloud container.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: `app/learn/page.jsx` keeps title "Learn Hanzo — Hanzo AI" and the live description, and renders `<JsonLd route="/learn" />`. Every card is a real `<a href>`.

## 15. Catalogue and product pages
- ~~Model card matches `SPEC.md`~~ n/a: not a catalogue or model page.
- ~~Every card opens by Morph~~ n/a: not a catalogue (rail and row titles still carry `data-morph`).
- ~~Every maker and model page linked in the DOM~~ n/a: not a catalogue.
- ~~One price figure everywhere~~ n/a: no prices.

Done here: n/a: /learn is a developer index page, not a catalogue or model page; no model cards or prices appear.

## 16. Developer experience
- ~~One `CodeBlock`; copy equals display~~ n/a: no code on the page.
- ~~Config blocks parse on their own~~ n/a: no config.
- ~~Terminal pauses and ends on a static frame~~ n/a: no terminal.
- ~~No hand-typed version number~~ n/a: no version numbers.

Done here: n/a: no code, config, terminal or version on the page; the docs links (quickstart, CLI, API reference, Agents, MCP) are Hanzo's own URLs.

## 17. States and resilience
- ~~Loading, empty, error and offline states designed~~ n/a: static Hanzo copy; no live data or form.
- ~~Blocked live data leaves a complete page, no console errors~~ n/a: no live data.
- ~~A failed submit keeps its values and shows no success~~ n/a: no form.
- [x] A thrown island does not blank the page

Done here: no live data; with the films blocked the posters stay; JS off shows every guide (the `NoJs` rule), every card and every answer. Playwright at 1470×801, 375×812 and 320: no page errors from /learn's files (the only console errors seen came from another page's half-saved file in the shared dev server).

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js`
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/review/learn.md` verdict 8 or more (read: 6/10; every fix answered, awaiting the re-walk)

Done here: `data-cta="learn.hero"` and `learn.university` via kit `Cta` (fires `cta_click` through the kit's event); no identifiers, no forms. V2 line in `components/pages/Learn.jsx` and `app/learn/page.jsx`. Review read (6/10): card written true; the parts after the map folded into three scenes and collapsed questions; each scene has one big thing (64px rail numerals, the Zen film, the 44px lead post with Kai's film, the 64px question number); `data-cta`/`data-thumb` on "Get started" at every width; "Hanzo University" has the kit hover and press.
