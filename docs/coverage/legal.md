# /legal coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/LegalIndex.jsx` (+ `LegalIndex.css`; the `/legal/*` template's `LegalDoc.*` is untouched) · gallery: `docs/gallery/legal/` · Persona: buyers, security and legal reviewers, users checking their terms · Goal: reach the right document in one step · CTA: none

1. **Strategy and conversion.** Legal pages carry no ask (PLAN-COMPONENTS 2.4: "none on legal and careers"), so `<main data-ask="off">` keeps the shared ask bar away; the header's Try Hanzo stays as the only solid button. Every card is a real link into its document.
2. **Information architecture and navigation.** Header and footer unchanged. Order: the stack (hero), the canonical-home statement and status, the twelve documents with filter chips (All, Agreements, Policies, Notices and registers), how these fit together, contact. Group anchors (#agreements, #policies, #notices-and-registers, #how-these-fit-together, #contact) are kept.
3. **First impression and page narrative.** "Legal & Trust Center" cuts in; beside it a stack of paper deals itself, each sheet with its own hanzo.ai/legal address and Hanzo's "draft · pending counsel" stamp.
4. **Conversion system.** No ask; cards open into their pages through the morph layer (`data-morph` on the title).
5. **Trust and proof.** "Status: draft, pending counsel." and "not yet effective" stay in a calm status panel beside the statement.
6. **Content presentation (copy untouched).** Parity 62/62, 16/16. "Legal" sits under the headline; the group titles are the filter chips; the filter only hides cards visually (hidden ones stay in the HTML).
7. **Visual design system.** v2 scale; 0 UI hues (the old sepia is ink); the ladder's first state is the one inverted step. No dark room (utility page).
8. **UI component library.** Kit `A`; `DocNodes` for Hanzo's text; v2 `Settle`, `x-gauss/LineMask`, `Pause`, `NoJs`. Chips use `aria-pressed`.
9. **Motion and interaction.**
   - Idle: the stack deals a sheet every 2.4s.
   - Pointer: cards lift, their arrow turns ink and nudges; mail links draw their underline.
   - State: chips re-flow the cards (layout animation); a card opens into its document (View Transition).
   - Scroll: only the stack's settle.
   - The stack has a pause button; the status dot pings twice and stops.
10. **Media.** None belong to this page; the object is the paper stack.
11. **Mobile and responsive.** At 375px the stack peeks under the lede on the first screen; chips wrap; cards stack; the ladder is two by two; mail rows stack; no sideways scroll.
12. **Accessibility.** One h1. The decorative sheets are `aria-hidden`; the real documents are the card links. JS off: `NoJs`.
13. **Performance and engineering.** One timer, off screen and when paused it stops.
14. **SEO and machine files.** Metadata and JSON-LD unchanged.
15. **Catalogue and product pages.** A small catalogue: twelve documents, three groups, counts on the chips.
16. **Developer experience.** Does not apply.
17. **States and resilience.** Filtering can't empty the grid (every chip has documents).
18. **Measurement and handover.** No ask on legal; document opens are plain links. Filmed into `docs/gallery/legal/`.
