# /legal/* coverage (PLAN-COMPONENTS areas 2.1–2.18)

Template: `components/pages/LegalDoc.jsx`, `LegalRoom.css` (its own), `LegalDoc.css` (shared with the /legal index, unchanged), data `legalData.js`, route `app/legal/[slug]/page.jsx` (11 members). Kit: `components/v2/Fam*`. Gallery: `docs/gallery/legal/` (terms and subprocessors: desktop film at 1470×801, three phone screens each).

1. **Strategy and conversion.** Persona: enterprise buyer, counsel, any user checking what they agreed to. Goal: find the clause and trust it is the current text (effective date and version beside the title). No sales ask on a legal document (PLAN-COMPONENTS 2.4: no thumb bar on legal); the action is reading and finding. Metric: one contact click (the documents' own addresses).
2. **Information architecture and navigation.** Hanzo's header and footer unchanged. "Legal" (the way back to the /legal hub) moved from above the title into the meta row under the dates. Every heading keeps its id and its copy-link button; the cover index and the rail both jump to any section.
3. **First impression and page narrative.** The document's name at display size on the left, its lede and dates on the right; the cover is on the first screen at 1470×801 and 375×812, already reading its first clause (number huge, first sentence) and turning to the next by itself. Then the reading room, then the other documents.
4. **Conversion system.** No filled button on the page (nothing to sell); the cover rows, rail links and sibling cards are the actions. The site's thumb bar keeps Hanzo's own default on phones.
5. **Trust and proof.** Effective date, version and draft status (Hanzo's words) sit beside the title and lede, the first thing read after the name. Nothing is summarised or reworded.
6. **Content presentation (copy untouched).** Parity: terms 168/168 text and 12/12 links, subprocessors 75/75 and 2/2, cookies 61/61 and 2/2; the /legal index still 62/62 and 16/16. Prose at 19px, 64ch, number plates per section; tables keep their headers while scrolling in their own frame. No eyebrow above any headline.
7. **Visual design system.** v2 scale from `fam.css`; 0 UI hues (ink number plates, ink marker and progress line, grey highlights for find matches). Cover 32px radius, hairlines, long soft shadow. No dark room: a calm utility page.
8. **UI component library.** Kit `A`; v2 `FamLines`, `FamStage`, `FamNext`; `DocNodes` (copy link per heading). The find field is a styled field with a search icon (no browser default look), 16px text, 44px tall.
9. **Motion and interaction.**
   - Idle: the cover turns through its clauses every 3.4 s with a timing bar; its contour drifts.
   - Pointer: hovering an index row shows that clause on the cover and holds it; the sibling rail drags with inertia; cards lift and show their own lede.
   - State: the contents marker springs to the section you are in; find lights matches and dims sections without them.
   - Scroll (under half): the rail's line and percentage fill; the number plate of the section you are in turns ink.
   - One signature plus three supporting; `variety.py` OK.
10. **Media.** Hanzo has no imagery for legal documents; the object is the document itself, its contour (Sigil seeded `/legal/<slug>`) and its index.
11. **Mobile and responsive.** At 375 the title, lede and dates come first, then the cover (clause plate over the index), the rail as a collapsed "Contents" disclosure, then the prose. The site layer turns to the next document on a sideways swipe (checked: terms → acceptable-use). No sideways scroll; text 14px or more.
12. **Accessibility.** One h1; the cover's moving plate is `aria-hidden` (the index carries the same words); find has a label from the register and announces counts politely; the marker is `aria-current`. Reduced motion: the cover holds still, no bar, no spring.
13. **Performance and engineering.** One interval for the cover, only while it is on screen and the tab is visible; transform and opacity; ≤7 canvases (cover contour plus at most 6 sibling contours drawn once).
14. **SEO and machine files.** Metadata and JSON-LD per document unchanged; every word is in the server HTML; JS off: everything reads, the cover shows its first clause.
15. **Catalogue and product pages.** The other documents are real links, at most 6 (the ones after this one, wrapping), one tab stop each, their title the Morph source into the next document's h1; each shows its own lede on hover.
16. **Developer experience.** Every heading has a copy-link button; anchors are stable ids.
17. **States and resilience.** Find has an empty state from the register ("Not in this document"); nothing depends on the network.
18. **Measurement and handover.** `Persona:`/`Goal:`/`CTA:` and the metric in the file's header. Ledger (deleted): the "Legal" kicker over the title, the invented "sections" and "min read" figures, the per-document accent, the find feature's invented sentences.
