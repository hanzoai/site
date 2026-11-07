# /legal coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/LegalIndex.jsx` (+ `LegalIndex.css`, data `legalData.js`) · gallery: `docs/gallery/legal/` · metric id: document open (`legal.doc.<slug>`)

Open copy questions for James: the pile's stamp "draft · pending counsel" condenses Hanzo's status line ("Status: draft, pending counsel."); the ladder's step numbers 01–04 are ordinal, not claims.
Shared changes requested: `docs/requests/templates.md` (covers every Business 2 page). Utility page: no ask (`data-ask="off"`), per MASTER part 4.
Forks this page deleted: the sheet that popped in front in the same frame (now it leaves on top, then tucks under), stamps on every sheet (top sheet only, wrapping inside it), the floating pause on the fan, `AnimatePresence initial={false}` that cancelled the rows' arrival, the see-through chip bar, the invented "Show"/"Documents" labels, the phone's repeated group label on every row, the cursor label "Open", every spring, the stale colour comments, the shared `Settle` (it read reduced motion during render and broke hydration; a legal-local `Rise` replaces it with the same scale-and-lift).

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
- [x] JS off legible (a `<noscript>` sheet hides the pause, which would do nothing)
- [x] Hero pile → statement and status → index → how they fit (ladder) → contact
- [x] Ends on the contact rows, then footer (Utility: no band)
- [x] Rows open into their document page (`data-morph` title → the document's h1)

Done here: JS off: every word legible, the ladder at full height, no pause button.

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
- [x] `taste.py` passes (0 hues; #0a0a0b and #c7c7cc are gone, only deck greys remain)
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

Done here: the sticky chip bar is opaque white (#fff, no blur) and draws its hairline only while stuck under the header.

## 9. Motion and interaction
- [x] Signature (the dealing pile), supporting: line-mask cut-ins, the stage settle (`Rise`), rows rising once, the ladder; 0 fade-ups
- [x] Idle (pile; on the index screens a reading lamp lights one row at a time, 1.8s each, once through, the way the pile deals), state (chips, with a tick), arrival (h1, rows rise 16px once in 400ms with 60ms stagger, ladder grows from 25% in view), scroll (settle)
- [x] Moves without input; every control answers
- [x] Reduced motion: the pile cuts (no travel), rows, ladder and stage sit in their final place from first paint; no springs; no hydration error
- [x] Sound: a tick on a chip, through `lib/sound`

Done here: the deal is two-phase, sampled every 80ms: the top sheet travels out on top to x −110%, −8° (450ms ease-emphasis, z 40), then drops under the pile and the next sheet comes forward 200ms later.

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

Done here: at 375 the stamp (54–247 × 728–810) sits inside the top sheet (16–278 × 528–833) and the pause sits under the pile (864–909), touching no sheet; at 1470 the pause sits on the pile's top-right corner (y 169–214), clear of every sheet; scroll width 320 at 320.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured: ink #0a0a0a on white, soft text rgb(72,72,74) (about 9:1)
- [x] One pause state, shown as a 44px button beside the pile and at the end of the chip bar: it stops the deal and the reading lamp together; keyboard focus on a row puts the lamp out
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

Done here: `@media print` in `LegalIndex.css`: no header, footer, cookie note, pile or chips; all twelve rows print, hidden groups included.

## 18. Measurement and handover
- [x] `data-cta="legal.doc.<slug>"` on every row (12)
- [x] Nothing identifier-bearing
- [x] `V2:` line in `components/pages/LegalIndex.jsx`
- [ ] Review 8 or more (re-review pending)

Done here: previous review 7/10; its seven fixes addressed.
