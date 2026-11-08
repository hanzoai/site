# /comparison coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Comparison.jsx` · gallery: `docs/gallery/comparison/` · metric id: `signup_start`, read as `cta_click` on `comparison.hero`

Open copy questions for James: none.
Shared changes requested (`docs/build-notes/requests/<page>.md`): none filed. For the kit owner: `DetailSheet` is a `role=dialog` div, not a native `<dialog>` (part 8); `MaskLines` runs 1s where MASTER asks 700 ms.
Forks this page deleted: the floating phone total pill (`.xcm-mini`), the digit-rolling odometer, the 112–128px centred headline, the 140 ms `setInterval` printer (now CSS transition delays), the spring on the stack bar, every hover transform that was not James's (row nudges, box swell, arrow turn), the side-by-side stack table (now in a sheet, so every price shows once).

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; Hanzo's own label "Try Hanzo" → hanzo.ai/signup
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; n/a `lib/plans.js` (no plan prices here)
- [x] Open copy questions for James listed, none decided

Done here: One solid ask in the hero (`comparison.hero`) and again at the close of the dark room (`comparison.close`); "Images it runs" is a quiet (+) and "Put them all back" a text control.

## 2. Information architecture and navigation
- [x] One `<main>`; the shared layout's `#main` mark takes the skip link (no second id)
- [x] Every link through `A`
- n/a Breadcrumb: /comparison is depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: `parity.py /comparison` reports 63/63 text and no links to lose; header and footer untouched.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] Nothing above the h1 ("Comparison" is a caption in the right column of the split); `PageHero` n/a until the shared part merges
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in the dark room's closing line and the one ask, then the footer
- [x] Card-to-page: the receipt is the `data-morph-target` for /compare's "Buy it, or run it" card

Done here: The 52px h1 sits left of the 8/5 split with its lede and ask; beneath, the slip feeds out of its slot within 1 s of arrival and its lines print in a 60 ms stagger. JS off: 0 blocks hidden (checked with JS disabled).

## 4. Conversion system
- [x] Kit `pf-btn solid` (no raw `.x-btn`); `<Cta>` n/a until it merges
- [x] Sticky ask: the shared bar reads the hero's `data-thumb`; the page's own floating total is gone
- n/a Copy button: none on this page
- [x] `data-cta` and `data-thumb` on every primary

Done here: Hero ask `data-cta="comparison.hero"` inside `data-thumb="Try Hanzo"`; close ask `data-cta="comparison.close"`. AskBar renders only hidden data for the shared bar.

## 5. Trust and proof
- [x] No logo, no seal, no invented number
- [x] Every figure traces to Hanzo's copy (each stack's compose footprint and $/mo, the $225.57/mo total)
- n/a Marquees: none
- n/a Privacy by a submit: no form

Done here: The total only ever shows whole real figures (the sum of the lines switched on); the note under the slip says what the figure leaves out.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan in the headings
- [x] The stack table lives in a sheet with `scope` on every header; `DataTable` n/a until it merges
- [x] `python3 scripts/parity.py /comparison`: 0 missing

Done here: Parity 63/63. The critic's "the same eleven prices listed twice" is answered: the main scroll shows each price once, on the slip; images, vCPU and GB open in the sheet.

## 7. Visual design system
- [x] `python3 scripts/taste.py` passes; deck greys only
- [x] No label, tag, badge or pill above a headline
- [x] Radii 6, 8, 12, 16 from the deck; the slip is flat paper with one floating shadow
- [x] One icon set (hand-drawn tick, arrow, reset at 1.6–2.2px); no icon in a rounded box
- [x] Differs from neighbours: a receipt slip feeding from a slot (/compare is a wide table)

Done here: `taste.py` OK on Comparison.jsx and Comparison.css. Rhythm from `ProofRhythm.css` (`pf-r` on `<main>`): h1 52, headings 26, the total the one 84px moment (52px phone), the dark-room "$ ?" a 64px figure.

## 8. UI component library
- [x] Every control has hover (inside `@media (hover:hover)`), press (scale .97, 90 ms), focus-visible
- [x] Focus ring visible on every stop of a Tab crawl
- [ ] Dialogs are native: the kit's `DetailSheet` is a `role=dialog` div that traps and returns focus (kit owner's change)
- n/a Inputs: none
- [x] Forks this page deleted: listed above

Done here: Slip lines are `role=switch` buttons; hover fills the row, darkens the box and underlines the name; no nudges.

## 9. Motion and interaction
- [x] One signature (the slip feeding and printing), 3 supporting (line-mask h1, total swap, dark-room wipe with duty chapters), 0 fade-ups
- [x] Kinds: time (feed and print), state (switches, stack bar reflow, total swap, sheet), arrival (h1), scroll (wipe, chapters ≤ 250svh)
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- n/a Sound: no shared sound kit exists yet

Done here: Deck timings: 300 ms ease-emphasis prints, 60 ms stagger, 300 ms ease-in-out reflow, 150 ms hovers, 90 ms presses; the paper feed is the one scene move at 1.4 s. `variety.py` OK.

## 10. Media
- n/a Images and films: the page has none; its objects are the slip and the duty receipt
- n/a Videos: none
- n/a Alt: no images
- n/a Dimmed photos: none

Done here: n/a: no media on this page; the hero object is product-style paper drawn in HTML.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320 (the sheet's table scrolls inside the sheet)
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: `phone.mjs /comparison` OK (375/375). Nothing floats over content: the old total pill is removed; the shared bar is the only bottom layer.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast: ink and #525252 on white; #a3a3a3 only on black
- n/a Pause control: nothing loops (the slip prints once)
- n/a Forms: none
- [x] One h1; h2 for the bill and the dark room; names start with visible text
- [x] Keyboard reaches every switch, the sheet and the reset

Done here: Each line's switch says "Take out / Add" with its price; the total is real text for screen readers and the full figure stays in the page whatever is selected.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] No images; transform, opacity and clip-path only
- [x] No poller (printing is CSS transition delays); no third party
- [x] Nothing heavy run on James's laptop (filmed in the cloud)

Done here: Unprinted lines wait invisible in place and the slip feeds by transform, so printing causes no layout shift.

## 14. SEO and machine files
- [x] Title and description unchanged (`app/comparison/page.jsx`)
- [x] Canonical from the shared layout
- [x] `<JsonLd route="/comparison" />` renders
- n/a Cards: none

Done here: Every stack's images and figures, every duty and the full total are in the server HTML.

## 15. Catalogue and product pages
- n/a Model card: not a catalogue or model page
- [x] It receives /compare's card by Morph (`data-morph-target` on the slip)
- n/a Maker and model links: not a catalogue
- [x] One price figure everywhere (each stack's $/mo appears once in the scroll)

Done here: n/a for catalogue parts; the slip is the landing target of the card that opens from /compare.

## 16. Developer experience
- n/a CodeBlock: no code on the page
- n/a Config blocks: none
- n/a Terminal: none
- n/a Versions: image tags are Hanzo's compose text, not typed versions

Done here: n/a: no code; image names are shown in mono as their compose files write them.

## 17. States and resilience
- [x] Static figures, so no loading or error state; the empty state reads "Nothing running, nothing to pay. Add a stack back."
- [x] No live data; complete with the network blocked
- n/a Submit: no form
- [x] No island can blank the page

Done here: Strike every stack and the empty line shows with a $0.00/mo total; the "same image, more than once" block comes and goes with the selection.

## 18. Measurement and handover
- [x] `data-cta` on every primary; n/a `lib/track.js` (not in `lib/` yet)
- [x] Nothing identifier-bearing; no form
- [x] `V2:` line in the top comment
- [x] Review read: `docs/build-notes/review/comparison.md` 8/10 (walked before this rework; its complaint, prices shown twice, is fixed)

Done here: `comparison.hero` and `comparison.close`; V2 line updated.
