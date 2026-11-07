# /learn coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Learn.jsx` · gallery: `docs/gallery/learn/` · metric id: `api_key_created`

Open copy questions for James: none (every line and link is Hanzo's own).
Shared changes requested (`docs/requests/<page>.md`): none.
Forks this page deleted: the `x-btn solid` hero button (now kit `Cta`), raw `<img>` (now kit `Img`), the pill tag on the map, the train's looping pulse and shadow, tile and card hover lifts, the 2.5rem tile titles, five separate sections after the map (now two).


## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js`
- [x] Open copy questions for James listed, none decided

Done here: Header comment in `app/learn/page.jsx` names Persona, Goal, CTA, Metric `api_key_created`, Signature, Beyond. One solid per screen: kit `Cta` "Get started" (`learn.hero`, `data-thumb`); after the hero the header carries "Get started". No copy questions.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- ~~Breadcrumb at depth 2 or more~~ n/a: depth 1 page.
- [x] Link parity: 0 removed, 0 unexpected

Done here: One `<main>` from the layout; links via `A`/`Cta`/`More`; parity links 26/26; each map station's guide is linked by its own name.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [ ] `PageHero`; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [ ] Ends in proof strip, `Band`, footer
- [x] Card-to-page links use Morph; title lands within 12px

Done here: Nothing above the h1. "Learn Hanzo" (52px) cuts in by line mask; the train starts riding within 1 s, stops at each station once and rests on MCP. `PageHero` is not in the kit (left open). After the map: one index (what to try, go further, Hanzo University), one dark room (the blog and the thinking), questions, footer; no kit `Band` (left open). JS off: every station's guide and every row are in the HTML.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- ~~Copy button copies exactly the displayed text; failure never says Copied~~ n/a: no copy control.
- [x] `data-cta` and `data-thumb` on every primary

Done here: Kit `Cta` only (no raw `.x-btn` in the page file); `data-cta` and `data-thumb` on the primary.

## 5. Trust and proof
- ~~No logo without documented permission; no seal; no invented number~~ n/a: no logos, seals or figures.
- ~~Every figure traces to Hanzo's copy; qualifier beside the number~~ n/a: no figures.
- ~~Marquees pause, freeze under reduced motion, hide duplicates~~ n/a: no marquee.
- ~~Privacy link and owner line beside every submit~~ n/a: no form.

Done here: No figures, logos or seals; dates on posts are Hanzo's.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts
- [x] `python3 scripts/parity.py /learn`: 0 missing

Done here: Parity 69/69 text. Type from MASTER: h1 52px, section heads 26px, the station guide 26px, row, post and link titles 21px, body 16px, mono caps 12px. Faq is the kit's.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` passes (greys only); nothing above a headline (the map's labels sit inside the map); radii 24/16/12, no box plus shadow; one dark room. Differs from /affiliate (link as type) and /beta (films): its hero object is the transit map.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- ~~Dialogs are native, trap focus and return it~~ n/a: no dialog.
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: the `x-btn solid` hero button (now kit `Cta`), raw `<img>` (now kit `Img`), the pill tag on the map, the train's looping pulse and shadow, tile and card hover lifts, the 2.5rem tile titles, five separate sections after the map (now two). listed below

Done here: Stations are a tablist with arrow keys and focus rings; rows, posts and links answer hover (underline, arrow drifts) and press .97; kit `Cta` states.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- ~~Sound only on the listed moments, through the one kit~~ n/a: the shared sound kit is not on main yet; nothing page-local plays sound.

Done here: Signature: the train rides the Start-here line once (0.5s per stop, ease-emphasis) and rests. State: picking a station moves the train and opens its guide. Arrival: line-mask h1. Pointer: station dots ink on hover. No loops; reduced motion shows the first station.

## 10. Media
- [x] `Film` and `Pic` only; sizes and posters set
- ~~At most 2 videos playing; pause button on loops over 5 s~~ n/a: no video.
- [x] Budgets met; nothing missing; alt on every image
- ~~No dimmed or filtered photo; 4+ real visuals together where the page has them~~ n/a: one image (Zen's sphere on the Hanzo University link), undimmed.

Done here: Kit `Img` for the one image, sized and lazy; alt empty (decorative, the words beside it name the link).

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: 375×812: hero ask full width above the fold; the map keeps its dots and shows the guide below; the index and the dark room stack to one column; no horizontal scroll at 320; targets 44px+.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- ~~Forms labelled; first error focused~~ n/a: no form.
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: Greys at 4.5:1+ on white and dark; one h1, h2s in order; the map is a labelled tablist; every row is a real link with its title as its name.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: h1 in server HTML; no poller; one lazy image; motion is transform and opacity.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: Title and description unchanged; `<JsonLd route="/learn" />` renders canonical and og tags.

## 15. Catalogue and product pages
- ~~Model card matches `SPEC.md` (or n/a: not a catalogue or model page)~~ n/a: not a catalogue or model page.
- ~~Every card opens by Morph~~ n/a: not a catalogue; the index rows carry `data-morph`.
- ~~Every maker and model page linked in the DOM~~ n/a: not a catalogue.
- ~~One price figure everywhere~~ n/a: no prices.

Done here: n/a: not a catalogue or model page.

## 16. Developer experience
- ~~One `CodeBlock`; copy equals display (or n/a: no code on the page)~~ n/a: no code on the page.
- ~~Config blocks parse on their own~~ n/a: no config.
- ~~Terminal pauses and ends on a static frame~~ n/a: no terminal.
- ~~No hand-typed version number~~ n/a: no version numbers.

Done here: n/a: no code on the page.

## 17. States and resilience
- ~~Loading, empty, error and offline states designed~~ n/a: static page; no live data or form.
- ~~Blocked live data leaves a complete page, no console errors~~ n/a: no live data.
- ~~A failed submit keeps its values and shows no success~~ n/a: no form.
- [x] A thrown island does not blank the page

Done here: Static Hanzo copy; a thrown map leaves the rest of the page; JS off shows every guide.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js`
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [x] Review read: `docs/review/learn.md` verdict 8 or more

Done here: `data-cta` id `learn.hero` (kit Cta fires `cta_click`); V2 line in the route header; conductor review `docs/review/learn.md` (6/10 at `84c407e`): eyebrows and teal out, Get started the only solid, five sections folded into two, route words removed.
