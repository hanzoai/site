# /legal coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/LegalIndex.jsx` (+ `LegalIndex.css`, data `legalData.js`) · gallery: `docs/gallery/legal/` · metric id: document open (`legal.doc.<slug>`)

Open copy questions for James: the pile's stamp "draft · pending counsel" condenses Hanzo's status line ("Status: draft, pending counsel."); the ladder's step numbers 01–04 are ordinal, not claims.
Shared changes requested: `docs/requests/templates.md` (covers every Business 2 page). Utility page: no ask (`data-ask="off"`), per MASTER part 4.
Forks this page deleted: the sheet that popped in front in the same frame (now it leaves on top, then tucks under), stamps on every sheet (top sheet only, wrapping inside it), the floating pause on the fan, `AnimatePresence initial={false}` that cancelled the rows' arrival, the see-through chip bar, the invented "Show"/"Documents" labels, the phone's repeated group label on every row, the cursor label "Open", every spring, the stale colour comments.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] No page solid (legal carries no ask); the header's "Try Hanzo" is the one solid
- [x] One h1; clear in 5 seconds
- [x] No dead button
- [x] Copy questions listed

Done here: gate: 1 h1, 0 page solids.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; shared skip link
- [x] Every row is a real `A` to its document
- [x] n/a breadcrumb (depth 1)
- [x] Link parity 0 removed

Done here: parity links 16/16; `#agreements`, `#policies`, `#notices-and-registers` select their chip.

## 3. First impression and page narrative
- [x] Sells in 5 s; the pile deals within 2.6 s
- [x] h1 CSS cut-in painted by the server; "Legal" sits under the h1
- [x] JS off legible (pause hidden with JS off)
- [x] Hero pile → statement and status → index → how they fit (ladder) → contact
- [x] Ends on the contact rows, then footer (Utility: no band)
- [x] Rows open into their document page

Done here: gate JS-off hidden 0.

## 4. Conversion system
- [x] n/a `<Cta>`: no ask on legal pages
- [x] Ask bar off (`data-ask="off"`)
- [x] n/a copy
- [x] `data-cta="legal.doc.<slug>"` on every row

Done here: e.g. `legal.doc.terms`, `legal.doc.privacy`.

## 5. Trust and proof
- [x] No seal, no certification mark, no invented number
- [x] Status line is Hanzo's ("draft, pending counsel")
- [x] n/a marquees
- [x] n/a submit

Done here: the page says plainly that the documents are not yet effective, in Hanzo's words.

## 6. Content presentation (copy untouched)
- [x] Phone text 14px+
- [x] Statement at 32px (26px phone); prose 16–18px
- [x] The index is one ruled list per group, each with a hidden h2 of Hanzo's group title
- [x] `parity.py /legal`: 0 missing

Done here: parity `text 62/62 links 16/16`.

## 7. Visual design system
- [x] `taste.py` passes (0 hues; #0a0a0b and #c7c7cc swapped for deck values)
- [x] No label above a headline
- [x] Rows divided by hairlines; only the pile floats
- [x] One icon set
- [x] Differs from neighbours: a pile of paper

Done here: gate hues [].

## 8. UI component library
- [x] Hover in `@media (hover:hover)`; row press translateY(1px); chips .98
- [x] Focus ring on every stop
- [x] n/a dialogs
- [x] No bare `:hover`
- [x] Forks deleted: listed above

Done here: the sticky chip bar is opaque white with a hairline.

## 9. Motion and interaction
- [x] Signature (the dealing pile), supporting: Settle, filter, document open; 0 fade-ups
- [x] Idle (pile), state (chips), arrival (h1, rows rise 16px once, ladder grows at 25% in view), scroll (settle)
- [x] Moves without input; every control answers
- [x] Reduced motion: the pile cuts; no springs
- [x] n/a sound

Done here: the deal is two-phase: out on top (450ms ease-emphasis), then the next sheet comes forward after 200ms.

## 10. Media
- [x] n/a: no media on the live page
- [x] n/a
- [x] n/a
- [x] n/a

Done here: n/a.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Targets 44px+
- [x] n/a primary (no ask)

Done here: the stamp wraps inside the top sheet; the pause sits under the pile.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured
- [x] Pause on the pile
- [x] n/a forms
- [x] One h1; hidden h2 per group, then h2 sections
- [x] Keyboard reaches every row and chip

Done here: the pile is `aria-hidden`; the index carries the same documents as links.

## 13. Performance and engineering
- [x] h1 and every row in server HTML
- [x] No images
- [x] No poller, no third party
- [x] Nothing heavy on James's laptop

Done here: one client island.

## 14. SEO and machine files
- [x] Title and description from `content/pages.json`
- [x] Canonical from shared layout
- [x] `<JsonLd route="/legal" />`
- [x] Every row is a real link

Done here: `app/legal/page.jsx`.

## 15. Catalogue and product pages
- [x] n/a
- [x] Rows open their document
- [x] All twelve documents linked
- [x] n/a

Done here: twelve of twelve in the index (filtered groups stay in the HTML, hidden).

## 16. Developer experience
- [x] n/a: no code
- [x] n/a
- [x] n/a
- [x] n/a

Done here: n/a.

## 17. States and resilience
- [x] Filter states: All, or one group
- [x] Blocked network: complete page, no console errors
- [x] n/a submit
- [x] Print: one column, no pile, no chips

Done here: `@media print` in `LegalIndex.css`.

## 18. Measurement and handover
- [x] `data-cta` on every row
- [x] Nothing identifier-bearing
- [x] `V2:` line in `app/legal/page.jsx`
- [ ] Review 8 or more (re-review pending)

Done here: previous review 7/10; its seven fixes addressed.
