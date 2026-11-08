# /learn coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Learn.jsx` (+ `Learn.css`, `app/learn/page.jsx`) · gallery: `docs/gallery/learn/` · metric id: `api_key_created`

Open copy questions for James: none (every line and link is Hanzo's own; parity 69/69 text, 26/26 links). The closing line reuses the hero lede word for word, set on two lines.
Shared changes requested (`docs/build-notes/requests/<page>.md`): none. The header's solid ask is outlined page-locally in `Learn.css` while either page "Get started" is on screen (as /playground does).
Forks this page deleted: the `x-btn solid` hero button (now kit `Cta`), raw `<img>`/`<video>` (now kit `Img`/`Film`), the pill tag on the map, the map's outline (raise or outline: the panel's fill is kept), the hero-side and panel opacity fade-ups (now clip reveals), tile and card hover lifts, the 2.5rem tile titles, the three-column "Read the thinking" (now a hairline list); five separate sections after the map are now three scenes, collapsed questions and a closing ask.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` (no prices on the page)
- [x] Open copy questions for James listed, none decided

Done here: Persona, Goal, CTA, Metric `api_key_created`, Signature and Beyond are in the top comment of `components/pages/Learn.jsx` and `app/learn/page.jsx`. One solid per screen: while the hero's or the closing "Get started" is in view, `main.xlr[data-ask-on]` outlines the header's ask (an IntersectionObserver over both, `useHeroAsk`); between them the header's solid is the only one (the shared header labels it "Get started" at 1470, "Try Hanzo" at 375).

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- ~~Breadcrumb at depth 2 or more~~ n/a: depth-1 page.
- [x] Link parity: 0 removed, 0 unexpected

Done here: one `<main>`; every link goes through kit `A`, `Cta` or `More`; rail cards, rows, posts and thinking rows are real `<a>`; the two film cards use a sibling link whose `::after` covers the card so the Pause button is not inside a link. `parity.py /learn`: links 26/26.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [ ] `PageHero`; nothing above the h1 (nothing above the h1: yes; `PageHero` is not in the kit yet)
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [ ] Ends in proof strip, `Band`, footer (ends in a closing ask, then the footer; the live page has no proof strip, none added)
- [x] Card-to-page links use Morph; title lands within 12px

Done here: "Learn Hanzo" (52px) cuts in by line mask from the first paint and the train leaves the first station 0.9 s after the map is in view (measured: 01/05 at load, 02/05 1.3 s later). Hero bottom padding is `clamp(56px,6vw,88px)` and the index has no top padding, so "Pick what to try" sits at y≈222 at scrollY 700 (no dead screen). Then one idea per screen: the rail, University + Go further, the dark room, questions, and the close: the hero lede at display size with "Get started" (`data-cta="learn.close"`) and Hanzo University. Rail and row titles carry `data-morph` (the site's Morph picks them up where the destination has a target).

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label (header; the shared phone bar shows "Get started")
- ~~Copy button copies exactly the displayed text; failure never says Copied~~ n/a: no copy control.
- [x] `data-cta` and `data-thumb` on every primary

Done here: kit `Cta` only. "Get started" appears twice: hero (`data-cta="learn.hero"`, `data-thumb="Get started"`, measured at 1470, 375 and 320) and close (`data-cta="learn.close"`). "Hanzo University" is a kit link (`learn.university`, `learn.close-university`): arrow drifts and the label underlines on hover, .97 press in 90 ms.

## 5. Trust and proof
- ~~No logo without documented permission; no seal; no invented number~~ n/a: no logos, seals or claims. The numerals 01–06 and 01–05 are item counts.
- ~~Every figure traces to Hanzo's copy; qualifier beside the number~~ n/a: no figures.
- ~~Marquees pause, freeze under reduced motion, hide duplicates~~ n/a: no marquee.
- ~~Privacy link and owner line beside every submit~~ n/a: no form.

Done here: no logos, seals or invented figures; post dates are Hanzo's own (2026-10-26, 2026-10-25, 2026-10-07).

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts
- [x] `python3 scripts/parity.py /learn`: 0 missing

Done here: parity 69/69 text, 26/26 links. Scale: h1 52px (40 phone), section heads 26px (24 phone), one 64px figure per screen (the lit or hovered rail numeral, the others rest at half scale; the question number), the 44px lead post and closing line, titles 21px, body 16px, dates 13px mono. Questions are the kit `Faq`: multi-open, closed at rest, `#q-<slug>` opens one on load, and opening one writes its `#q-<slug>` to the address (closing it clears it); measured.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` OK on the 3 files. Nothing above a headline (the map's "Learn / Start here" labels sit inside the map; the statement's question caption now sits under the statement, 8 Nov). The map is no longer outlined; only its guide panel is a flat fill, and on desktop it reads as one row (guide name left, its line right, 120px tall), so map, train and open guide all sit in the first screen at 1470x801. Radii 24 cards, 16 media and panel, full buttons; no shadows. "Read the thinking" is a 5/7 split with a hairline list, not three equal boxes. Hero object is the transit map, unlike /affiliate and /beta. One dark room.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- ~~Dialogs are native, trap focus and return it~~ n/a: no dialog.
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: listed above

Done here: stations are an arrow-key tablist; rail steppers (44px) have hover, .97 press and `disabled` at each end; cards (numeral grows, still scales 1.04, title underlines), rows, posts, film cards and the two 44px Pause buttons answer hover inside `(hover: hover)` and press at .97 with a 2px focus ring (white in the dark room). The FAQ underline is on the question text only, so the "+" rotates clean. Kit `Cta` shows `aria-busy` on the hand-off.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- ~~Sound only on the listed moments, through the one kit~~ n/a: nothing page-local plays sound.

Done here: Signature (idle/time): the train leaves the first station at 0.9 s, rides every 2.8 s to MCP, then breathes (a ring swells three times, 4.8 s) and holds. Idle: the rail's numerals ink once across the cards on screen (0.7 s each, ends on touch); the Uta and Kai films loop in view. Pointer: the rail drags with inertia and snaps by proximity; the question number follows pointer and focus. State: a station wipes its guide in by clip-path in the train's direction (300 ms); answers open. Arrival: line-mask h1 and closing line; the hero side by clip reveal. Fade-ups: the map and the kit Faq (2). Scroll-linked: none. `variety.py` OK; reduced motion: first station, no ride, no ink, posters.

## 10. Media
- [x] `Film` and `Pic` only; sizes and posters set
- [x] At most 2 videos playing; pause button on loops over 5 s
- [x] Budgets met; nothing missing; alt on every image
- [x] No dimmed or filtered photo; 4+ real visuals together where the page has them

Done here: kit `Img` and `Film` only. Six Hanzo model stills on the rail (Enso on Chat, Iro on Playground, Mori on Hanzo Dev, Zen on Zen models, Oto on MCP, Koma on Agents; `public/models/*.webp`, 10–67 KB each, lazy, `alt=""` as the title names the card), four or more visible together at 1470. Two films: Uta on Hanzo University (`public/learn/uta-720.webm`, 128 KB, 6 s) and Kai on Kai's post (`public/learn/kai-640.webm`, 130 KB, 6 s), each with a 44px Pause first in its card; measured: it pauses and stays paused through scrolling. Nothing dimmed.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: scrollWidth equals the viewport at 1470, 375 and 320. 375×812: "Get started" full width at y 247–295; under the map the current station's name sits beneath its dot in 12px mono (first left-aligned, last right-aligned) and clip-reveals as the train moves (the other names are `display:none` on phones; every station keeps its name in `aria-label`); the rail shows one card and a 16% peek; the heading sits above the counter and steppers; the University, posts, thinking and close stack to one column.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- ~~Forms labelled; first error focused~~ n/a: no form.
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: body grey on white and the card fill, `#a3a3a3` only in the dark room. Both film loops have a Pause; the train's ride ends on its own and stops on any pick or arrow key; the breathing and the ink ride each end under 5 s. One h1, h2s per section, map guides are h3. The map is a labelled tablist; the question number is `aria-hidden`.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: every word is in the server HTML. No poller (`setTimeout` chains only); stills lazy with `width`/`height`; films load only near the screen. Filming and ffmpeg ran in the cloud container.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: `app/learn/page.jsx` keeps "Learn Hanzo — Hanzo AI" and the live description, and renders `<JsonLd route="/learn" />`.

## 15. Catalogue and product pages
- ~~Model card matches `SPEC.md`~~ n/a: not a catalogue or model page (the rail's stills are not model cards).
- ~~Every card opens by Morph~~ n/a: not a catalogue (titles carry `data-morph`).
- ~~Every maker and model page linked in the DOM~~ n/a: not a catalogue.
- ~~One price figure everywhere~~ n/a: no prices.

Done here: n/a: /learn is a developer index page, not a catalogue or model page; no model cards or prices appear.

## 16. Developer experience
- ~~One `CodeBlock`; copy equals display~~ n/a: no code on the page.
- ~~Config blocks parse on their own~~ n/a: no config.
- ~~Terminal pauses and ends on a static frame~~ n/a: no terminal.
- ~~No hand-typed version number~~ n/a: no version numbers.

Done here: n/a: no code, config, terminal or version on the page; the docs links are Hanzo's own URLs.

## 17. States and resilience
- ~~Loading, empty, error and offline states designed~~ n/a: static Hanzo copy; no live data or form.
- ~~Blocked live data leaves a complete page, no console errors~~ n/a: no live data.
- ~~A failed submit keeps its values and shows no success~~ n/a: no form.
- [x] A thrown island does not blank the page

Done here: no live data; blocked films keep their posters; JS off shows every guide, card, answer and the close (`NoJs` clears transforms, opacity and clip-paths). Playwright at 1470×801 and 375×812: 0 console errors, 0 page errors.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js`
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/build-notes/review/learn.md` verdict 8 or more (read: 7/10; every fix answered, awaiting the re-walk)

Done here: `data-cta` `learn.hero` and `learn.close` (plus the two University links) via kit `Cta`, which fires `cta_click`. Review (7/10) answered item by item: dead screen gone, rail cards carry Hanzo stills with one numeral big, closing ask, FAQ icon, train within 1 s plus a rest breath, fade-ups at 2, phone station labels, lead post as a full-width 8/5 row, map not outlined, thinking as a list, hash sync. Item 12 (site greys, hydration badge) is shared and left to the conductor.
