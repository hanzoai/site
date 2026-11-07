# /legal/* coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/LegalDoc.jsx` (+ `LegalRoom.css`; `LegalDoc.css` stays shared with the /legal index; data `legalData.js`; route `app/legal/[slug]/page.jsx`, 11 members) · gallery: `docs/gallery/legal/` · metric id: one contact click (`data-cta="legal.contact"` on the documents' mailto links)

Open copy questions for James: none decided here. Functional strings (all `needs_james` in `content/ui-strings.json`): contents, find, not_found, of, close.
Shared changes requested: none. (Site-wide, for their owners: the 0–100 loading curtain on a direct link; the footer's native tooltip; the footer's privacy-choices icon colour.)
Forks this page deleted: its own table wrapper (DocNodes' `xlg-tw` inside the reading room → kit `DataTable`), the invented "sections" / "min read" figures, the per-document accent, the "§n" numbers.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] n/a solid fill: no sales ask on a legal document (MASTER part 4: "Legal and careers pages have none")
- [x] One h1; clear in 5 seconds (name, lede, effective date and version)
- [x] No dead or self-looping button
- [x] Open copy questions listed (none)

Done here: Persona (buyer, counsel, any user checking what they agreed to), Goal (find the clause, trust it is current); `data-ask="off"` on the page's `<main>`.

## 2. Information architecture and navigation
- [x] One `<main>`; the layout's skip link reaches it
- [x] Every link through `A` or the documents' own anchors; sibling cards are real links
- [x] Way back: "Legal" (Hanzo's own label) under the title, linking to the /legal hub
- [x] Link parity: 0 removed, 0 unexpected (terms 12/12, subprocessors 2/2, cookies 2/2; the /legal index 16/16)

Done here: every heading keeps its id and a copy-link button; the cover index and the rail both jump to any section.

## 3. First impression and page narrative
- [x] Sells in 5 s; moves within 1 s (title cut-in; the cover turns through its clauses by itself)
- [x] Nothing above the h1 (dates and the way back are a caption under it)
- [x] JS off: legible (all text in server HTML; the cover shows its first clause)
- [x] One idea per 100svh: stage with the cover, then the reading room (a long document reads as a document, MASTER: "Legal: reading column, sticky index, print CSS")
- [x] Ends in the other documents (cards), footer
- [x] Sibling titles carry `data-morph` into the next document's h1

Done here: at 1470×801 the title (52px), dates, lede and the cover with its clause plate; at 375×812 the title, dates, lede and the top of the cover.

## 4. Conversion system
- [x] n/a `Cta`: no ask on legal
- [x] n/a sticky ask (off by MASTER part 4)
- [x] Copy-link buttons say "copied" only when the link was written (DocNodes `CopyLink`)
- [x] `data-cta="legal.contact"` on the documents' own contact links

Done here: nothing to sell; the action is reading and finding.

## 5. Trust and proof
- [x] No logo, seal or invented number (the "min read" figure and "§n" numbers were removed)
- [x] Effective date, version and draft status are Hanzo's own words beside the title
- [x] n/a marquees
- [x] n/a submit

Done here: only Hanzo's own section numbers ("1.") appear, on the cover, the index and the plates.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals; code (the cookie names) at 13px+
- [x] Prose at 16px, measure 768px; headings 26px balanced
- [x] Tables through `DataTable` (cells wrap; phones read one card per row); n/a FAQ, tabs, code
- [x] `python3 scripts/parity.py /legal/terms /legal/subprocessors /legal/cookies /legal/dpa`: 0 missing

Done here: tables span the reading column with no inner vertical scroll (wheel over a subprocessor table moves the page: 899px for 10 notches); all 7 columns show at 1470.

## 7. Visual design system
- [x] `python3 scripts/taste.py components/pages/LegalDoc.jsx components/pages/LegalRoom.css`: OK
- [x] Nothing above a headline
- [x] Cover outlined (no shadow); tiles flat; sizes on the live scale (h1 52, heads 26, cover numeral 64, prose 16)
- [x] One icon set (search, copy link); no icon in a rounded box
- [x] Differs from neighbours: the hero object is the document's own cover and index (benchmarks: a chart card; careers: a role card)

Done here: no dark room: a calm utility page.

## 8. UI component library
- [x] Rail links, index rows, find field and cards answer hover, press (translateY 1px / scale .97) and focus
- [x] Focus ring visible on rail, index, find, copy links, cards
- [x] n/a dialogs
- [x] Find field 16px text, 44px tall, no browser clear button
- [x] Forks deleted: listed above

Done here: copy-link buttons are 44px; their confirmation stays on screen on phones.

## 9. Motion and interaction
- [x] One signature (the reading rail: marker springs to your section, line fills), supporting: title cut-in, cover clause turn, sigil field; 0 fade-ups
- [x] Kinds: idle (cover turns, contour drifts), pointer (index rows preview their clause, rail drags), state (marker, find lights and dims), time (cover's timing bar), scroll (rail line, plates); scroll is under half
- [x] Something moves without input; every control answers
- [x] Reduced motion: cover holds still, no bar, no stage transform
- [x] n/a sound

Done here: the cover's clause changes in place (a swipe that starts on the card survives); `variety.py` OK.

## 10. Media
- [x] n/a `Film`/`Pic`: Hanzo has no imagery for its legal documents
- [x] n/a videos
- [x] Nothing missing
- [x] The visual is the document's own cover, index and contour (Sigil seeded `/legal/<slug>`)

Done here: ≤7 canvases (cover contour plus at most 6 sibling contours drawn once).

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 375 (tables become row cards)
- [x] Targets 44px or more (rail rows, copy links, find field, cards)
- [x] n/a primary ask

Done here: the phone shows the index once (in the rail's Contents); the sideways swipe turns to the next document (terms → acceptable-use).

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured: prose ink #0a0a0a, muted #525252, inactive plates #737373 (4.7:1)
- [x] The moving cover holds while pointed at, pauses off screen, and is still under reduced motion
- [x] n/a forms beyond find (labelled from the register)
- [x] One h1; sections h2, sub-clauses h3; table captions name each table
- [x] Keyboard reaches every control; the marker is `aria-current`

Done here: the cover's moving plate is `aria-hidden` (the index carries the same words); find announces counts politely.

## 13. Performance and engineering
- [x] h1 and the whole document in server HTML
- [x] Transform and opacity only; nothing to size
- [x] One interval for the cover, only on screen and in a visible tab
- [x] Nothing heavy run on James's laptop

Done here: no network requests from the page.

## 14. SEO and machine files
- [x] Title and description from `content/pages.json` (unchanged)
- [x] Canonical unchanged (shared layout)
- [x] `<JsonLd route>` per document
- [x] Every sibling card is a real `<a href>`

Done here: print stylesheet: the document alone, no cover, rail or cards.

## 15. Catalogue and product pages
- [x] n/a model card
- [x] Sibling cards hand their title to the next h1
- [x] The /legal hub is linked under the title and above the cards
- [x] n/a price

Done here: the six documents after this one (wrapping), each with its own lede on hover.

## 16. Developer experience
- [x] n/a code blocks
- [x] n/a config
- [x] n/a terminal
- [x] No hand-typed version: versions are Hanzo's own meta lines

Done here: every heading has a stable id and a copy-link button.

## 17. States and resilience
- [x] Find has an empty state from the register ("Not in this document")
- [x] No live data
- [x] n/a submit
- [x] Nothing to throw beyond the kit parts

Done here: JS off shows the full document.

## 18. Measurement and handover
- [x] `data-cta` on the contact links (n/a `lib/track.js`: not on main)
- [x] Nothing identifier-bearing
- [x] `V2:` line in the file's top comment
- [ ] Review read: `docs/review/legal-family.md` verdict 8 or more (the last walk scored 6; every numbered fix is addressed here; waiting on the re-walk)

Done here: the critic's fixes 1–7 are in (tables, rail, numbers, cover, phone index, print, small controls); fix 8 is site-wide and listed for its owners.
