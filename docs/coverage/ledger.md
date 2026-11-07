# /ledger coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/apps/Ledger.jsx` · gallery: `docs/gallery/ledger/` · metric id: `docs_click`

Open copy questions for James: none.
Shared changes requested (`docs/requests/<page>.md`): none. 
Forks this page deleted: the group's `BizAsk` button (now kit `Cta`), the v1 hero step accordion, the cloud `Get` block and the v1 three-box capability grid (now one tabbed object). The page's own AskBar pill (duplicate sticky ask) and the cursor label "Watch" are also gone.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js` (n/a for the label source: no `lib/cta.js` yet, so it uses Hanzo's own "Read the docs" → docs.hanzo.ai/docs/cli/books)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` (n/a: no prices)
- [x] Open copy questions for James listed, none decided

Done here: Header has Persona, Goal, CTA, a `Metric: docs_click` line, Signature, Beyond and V2. The one solid ask "Read the docs" appears in the hero and the close; the gate measures 1 solid fill per viewport at 1470×801 and 375×812.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it (the layout's `#main` mark sits before `<main>`)
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [x] Breadcrumb at depth 2 or more (n/a: depth 1)
- [x] Link parity: 0 removed, 0 unexpected

Done here: One `<main>`, and the layout's skip link targets `#main` above it. Parity shows links 3/3 (docs, GitHub, Deploy) through `A`, `More` and kit `Cta`.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero`; nothing above the h1 (n/a for `PageHero`: not merged yet, so the page uses `BizLines` with the same line-mask spec)
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer (n/a for kit `Band`: it fades in with `Rise` and would be a second dark room, so the close is one 44px sentence, the same ask and a full-width row)
- [x] Card-to-page links use Morph; title lands within 12px (n/a: no cards lead to pages)

Done here:
- First screen at 1470×801: "Hanzo Ledger" at 52px, cut in by line mask (700ms, 60ms per line), one lede line, the ask, and the live book posting by itself within the first second.
- JS off: 0 hidden text runs (gate script).
- Order: hero book → three chapters → dark capability room → splitter → receipt close.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn` (kit `Cta` for the hero ask, the GitHub link and the close ask; 0 raw `.x-btn`)
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text; failure never says Copied
- [x] `data-cta` and `data-thumb` on every primary

Done here: kit `Cta` ids `ledger.hero`, `ledger.github` and `ledger.close` are written as `data-cta` and sent as `cta_click`; `ledger.deploy` is on the row. `Cta thumb` gives the header and the phone bar the same "Read the docs", and nothing floats on desktop (measured: 0 fixed bars). Copy is the kit `Copy`.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [x] Marquees pause, freeze under reduced motion, hide duplicates (n/a: no marquee)
- [x] Privacy link and owner line beside every submit (n/a: no form)

Done here: Every figure (10,000, 9,500, 500, USD/2, order_42_payout) comes from Hanzo's own curl and Numscript example on the page. There are no logos and no seals.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts
- [x] `python3 scripts/parity.py /ledger`: 0 missing

Done here:
- Parity 55/55 text, 3/3 links.
- Phone text is 14px or more; the only 12px items are Zen Mono capital labels.
- The request uses kit `Code` inside `BizSheet`. The capabilities are `role=tab` tabs with every panel in the HTML.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here:
- `taste.py` is OK. Colours are the deck ramp only (#0a0a0a, #525252, #737373, #171717, #f2f2f2, #e4e4e7), via `--bz-*`.
- Radii are 6/8/12/16/24/full. Objects are outlined with no shadow.
- Scale: h1 52, headings 26, one figure big per screen (Σ 0 at 84 while its chapter is lit, the amount at 64).
- The hero is a ledger book beside the title, unlike the shells, phones and canvases of its neighbours.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs are native, trap focus and return it (`BizSheet` is a role=dialog with focus in and back, Esc closes, aria-modal only while open)
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: listed above

Done here:
- Every hover sits inside `@media (hover: hover)`.
- Press is scale .97 on the pause, tabs, chips and sheet button.
- The amount input is 64px (`--text-control` 52px on touch). The slider thumb answers hover with a ring.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit

Done here:
- Signature: the book posts by itself. Supporting: Stage settle, pinned chapters, line-mask cut-in.
- Kinds of movement: idle (the book), pointer (a journal row lights its accounts), state (the tab pill glides), arrival (h1), scroll (chapters).
- No springs: tweens of 300ms on ease-emphasis or in-out. `variety.py` OK; the book uses `setTimeout`.
- Sound comes from the site kit (tabs, toggles, asks).

## 10. Media
- [x] `Film` and `Pic` only; sizes and posters set (n/a: no images or films on this page)
- [x] At most 2 videos playing; pause button on loops over 5 s (n/a: no video; the self-running book has a 44px pause)
- [x] Budgets met; nothing missing; alt on every image (n/a: no images)
- [x] No dimmed or filtered photo; 4+ real visuals together where the page has them (n/a: Hanzo's ledger page has no media)

Done here: The page has no Hanzo media. Its objects are product UI drawn in HTML: the book, the posting, the chain, the retries, the capability objects, the splitter and the receipt.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here:
- At 375 the order is title, lede, ask (y≈350), then the book with 2×2 accounts.
- Chapters stack, each with its own scene; nothing pins under 900px.
- No sideways scroll and no target under 44px (gate script).

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused (n/a: no form; the splitter's fields are labelled)
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here:
- Body grey is #525252 on white (7.8:1) and quiet labels #737373 (4.7:1).
- The book has a pause button with `aria-pressed`.
- Tabs use arrow keys; the sheet closes on Esc and returns focus.
- One h1; h2 per section, h3 inside.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: The h1 and the book render on the server, and the book's loop runs only on screen (`useLive`). Filming and checks ran in the cloud session.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link (n/a: no cards)

Done here: The title is "Hanzo Ledger — Hanzo AI" from `content/pages.json`. Canonical and og:url are both https://hanzo.ai/ledger/. `app/ledger/page.jsx` renders `<JsonLd route="/ledger" />`, unchanged.

## 15. Catalogue and product pages
- [x] n/a: not a catalogue or model page (a product page; no model cards, no prices)

Done here: n/a. It follows the product anatomy: identity, the book as console, three chapters, the "See the request" spec sheet, and one closing ask.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (kit `Code` until `CodeBlock` merges; Copy takes the displayed text)
- [x] Config blocks parse on their own (n/a: no JSON config block; the curl is shell)
- [x] Terminal pauses and ends on a static frame (n/a: no terminal)
- [x] No hand-typed version number

Done here: The curl request (Hanzo's own) sits in one `Code` pane with Copy in "See the request". The splitter writes the postings and Numscript live from the amount and percentage.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed
- [x] Blocked live data leaves a complete page, no console errors
- [x] A failed submit keeps its values and shows no success (n/a: no submit)
- [x] A thrown island does not blank the page

Done here:
- Splitter: an empty or zero amount reads "Type an amount above zero" and the seal shows "—".
- Book: refusals read as an inverted note with a × cue.
- Nothing is fetched, so blocked networks change nothing; the film showed no console errors.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js` (data-cta ready; `lib/track.js` not in the repo yet)
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/review/ledger.md` verdict 8 or more (6/10 at 069c088; every listed fix is applied since, awaiting re-walk)

Done here: The page has `V2: 8/10 …` and `data-cta` ids `ledger.hero`, `ledger.close` and `ledger.deploy`. The 6/10 review's six fixes are in at d66e1ef and later:
- one sticky bar;
- a grey code sheet;
- the tab pill draws;
- the book answers the pointer;
- 14px phone floors and hover-only hovers;
- chapters stacked on phones.
