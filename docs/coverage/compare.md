# /compare coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Compare.jsx` · gallery: `docs/gallery/compare/` · metric id: `cta_click` on `compare.hero`

Open copy questions for James: none.
Shared changes requested (`docs/requests/<page>.md`): none filed. For the kit owner: `DetailSheet` is a `role=dialog` div, not a native `<dialog>` (part 8); `MaskLines` runs 1s where MASTER asks 700 ms.
Forks this page deleted: the giant tally (72–136px figures, now one 84px moment and three at 44px), the 95px full-width display h1, the gliding board with its spring, the 10 Hz `setInterval` clock, every hover transform that was not James's (row nudges, card lifts, arrow slides), the old tinted Apple greys.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; Hanzo's own label "Model routing APIs" → /compare/model-routing
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; n/a prices (no plan on this page)
- [x] Open copy questions for James listed, none decided

Done here: Persona, Goal, CTA, Metric, Signature and Beyond head the file. One solid ask in the hero (`compare.hero`) and again closing the dark room (`compare.close`); "Every row, in full" is a quiet (+), the two cards are links.

## 2. Information architecture and navigation
- [x] One `<main>`; the shared layout's `#main` mark takes the skip link (no second id)
- [x] Every link through `A`; every card a real link
- n/a Breadcrumb: /compare is depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: `parity.py /compare` reports links 2/2 (/compare/model-routing, /comparison). Header and footer untouched.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] Nothing above the h1 ("Hanzo vs" is a caption in the right column under the split); `PageHero` n/a until the shared part merges
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in the dark room with the page's one ask, then the footer
- [x] Card-to-page links use Morph (`data-morph` on the card's image)

Done here: At 1470×801 the 52px h1 (8 of 13 columns) sits beside its lede and ask, and the table is a wide object right under it with 4 rows showing; the progress hairline starts within 1 s and the reading line moves every 2.6 s. JS off: 0 blocks hidden (checked with JS disabled).

## 4. Conversion system
- [x] Kit `pf-btn solid` (no raw `.x-btn`); `<Cta>` n/a until it merges
- [x] Sticky ask: the shared bar reads the hero's `data-thumb`; no page-level bar
- n/a Copy button: no copy control on this page
- [x] `data-cta` and `data-thumb` on every primary

Done here: Hero ask `data-cta="compare.hero"` inside a `data-thumb="Model routing APIs"` wrapper; close ask `data-cta="compare.close"`. AskBar renders only hidden data for the shared bar.

## 5. Trust and proof
- [x] No logo, no seal, no invented number
- [x] Every figure traces to Hanzo's copy (600+, 500+, 1,600+, 1,800+, every Yes and No)
- n/a Marquees: none
- n/a Privacy by a submit: no form

Done here: Every cell is cut from Hanzo's own row sentence and every sentence is in the sheet verbatim; the tally counts Yes from those cells and shows only whole real counts.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; h1 broken into 4 lines that fit both widths
- [x] Table semantics (`caption`-less but `scope` on every header); `DataTable` n/a until it merges
- [x] `python3 scripts/parity.py /compare`: 0 missing

Done here: Parity 28/28 text, 2/2 links. Cells are 14–17px; mono captions 13px; the full sentences live in the sheet, not the scroll.

## 7. Visual design system
- [x] `python3 scripts/taste.py` passes; deck greys only
- [x] No label, tag, badge or pill above a headline
- [x] Radii 12, 20, 24 from the deck; tiles flat (no box plus shadow)
- [x] One icon set (hand-drawn ticks, dashes, arrows at 1.6–2px stroke); no icon in a rounded box
- [x] Differs from neighbours: an 8/5 split over a wide table (/comparison is a centred headline over a receipt slip)

Done here: `taste.py` OK on Compare.jsx and Compare.css. Rhythm from `ProofRhythm.css` (`pf-r` on `<main>`): h1 52, headings 26, Enso's tally the one 84px moment, the other three tallies 44px.

## 8. UI component library
- [x] Every control has hover (inside `@media (hover:hover)`), press (scale .97, 90 ms), focus-visible
- [x] Focus ring visible on every stop of a Tab crawl
- [ ] Dialogs are native: the kit's `DetailSheet` is a `role=dialog` div that traps and returns focus (kit owner's change)
- n/a Inputs: none
- [x] Forks this page deleted: listed above

Done here: Row buttons, count chips, the pause and the cards answer hover with an underline or a fill, never a nudge; presses scale .97 in 90 ms.

## 9. Motion and interaction
- [x] One signature (the reading line), 3 supporting (line-mask h1, tally swap, dark-room wipe), 0 fade-ups
- [x] Kinds: idle (reading line), time (progress hairline), state (sheet, tally, phone rows), arrival (h1), scroll (wipe only)
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval` (the hairline's `animationend` moves the line)
- n/a Sound: no shared sound kit exists yet

Done here: Deck timings: 300 ms ease-in-out glide, 300 ms ease-emphasis swaps, 150 ms hovers, 90 ms presses; no springs. `variety.py` OK.

## 10. Media
- [x] One image (the Enso art), sized; `Pic` n/a until it merges
- n/a Videos: none
- [x] Alt: decorative (`alt=""`) beside its text label
- [x] Not dimmed or filtered; the art drifts 20px on hover (art drift)

Done here: `/models/enso.webp` with width and height set, in the table header and the card that opens.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: `phone.mjs /compare` OK (375/375). On phones the table is one card per row, the four APIs stacked, the sentence on tap (44px row buttons).

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast: ink on #f5f5f5, No at 40% ink is paired with a dash shape
- [x] Pause control on the moving reading line, first in the table's DOM (44px, `aria-pressed`, named "Pause" from the register)
- n/a Forms: none
- [x] One h1; h2 per section; h3 in the sheet; names start with visible text
- [x] Keyboard reaches every control; focusing a row holds the line on it

Done here: The pause toggle stops the line; rows use `aria-pressed`, the counter is `aria-live`, the tally is `aria-live`.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] One image; transform, opacity and clip-path only
- [x] No poller (the clock is a CSS animation); no third party
- [x] Nothing heavy run on James's laptop (filmed in the cloud)

Done here: The line moves on `animationend`; the only timer is the 2.5 s hand-rest `setTimeout`.

## 14. SEO and machine files
- [x] Title and description unchanged (`app/compare/page.jsx`)
- [x] Canonical from the shared layout
- [x] `<JsonLd route="/compare" />` renders
- [x] Every card is a real link

Done here: All text, including every row sentence and "01 / 07", is in the server HTML.

## 15. Catalogue and product pages
- n/a Model card: no model grid on this page
- [x] The one comparison card opens by Morph
- n/a Maker and model links: not a catalogue
- n/a Prices: none

Done here: The card's image carries `data-morph`; the destination hero belongs to the /compare/* family owner.

## 16. Developer experience
- n/a CodeBlock: no code on the page
- n/a Config blocks: none
- n/a Terminal: none
- n/a Versions: none

Done here: n/a: the page carries no code, config or terminal.

## 17. States and resilience
- [x] Static table, so no loading or error state; counting has an empty state ("—" and empty bars)
- [x] No live data; the page is complete with the network blocked
- n/a Submit: no form
- [x] No island can blank the page (no Sigil, Opener or canvas)

Done here: Untick every countable row and each figure reads "—"; JS off and reduced motion both read in full.

## 18. Measurement and handover
- [x] `data-cta` on every primary; n/a `lib/track.js` (not in `lib/` yet)
- [x] Nothing identifier-bearing; no form
- [x] `V2:` line in the top comment
- [ ] Review read: `docs/review/compare.md` says 7/10, walked before this rework

Done here: `compare.hero` and `compare.close`; V2 line updated; the critic's points (h1 leading, one thing at a time, phone rows, one ask) are answered in parts 3, 4 and 11.
