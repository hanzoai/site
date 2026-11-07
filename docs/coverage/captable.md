# /captable coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/apps/Captable.jsx` · gallery: `docs/gallery/captable/`

1. **Strategy and conversion.** One ask, Hanzo's "Try Hanzo" (/login): solid in the hero, in the sticky site ask bar, on the phone thumb bar and as the one solid button in the close. "Documentation", the plan CTAs, "Contact Sales", "Deploy to Cloud" and the GitHub links are text links.
2. **Information architecture and navigation.** Hanzo's header and footer are unchanged. Order: the number (what the table says), six instruments as chapters, the term sheet, the waterfall, plans, where it comes from and the ways in, the close.
3. **First impression and page narrative.** Like a model launch: the founders' fully diluted share is the hero figure, gigantic and live, beside the example company's table it is computed from. At 1470×801 the figure, the bar and the whole table show; at 375×812 the table starts under the ask inside the first 660px.
4. **Conversion system.** `data-thumb="Try Hanzo"` and `data-cta="primary"` on the hero ask; `data-cta="primary"` on the close; `site ask bar title="Cap Table"` as the last child of main. One solid button per screen.
5. **Trust and proof.** Every figure is computed from the example company's inputs, which are shown and labelled ("Example company. Every number in it is an input you would give your own."). No invented claims.
6. **Content presentation (copy untouched).** Parity 103/103 text, 7/7 links. The ten clauses live in "Read the term sheet"; plans open into their own panels; the chapters hold the six steps. No label sits above a headline.
7. **Visual design system.** Biz grammar. Holders are ink and three greys; the founders' row is the inked one; the waterfall inverts the founders' card. No hues. One dark room: the waterfall.
8. **UI component library.** Kit `A`, `More`; v2 `BizLines`, `BizChapters`, `BizSheet`, `BizOpen`, the site's ask bar (`components/Ask.jsx`). Styled sliders, pause button, chips and rows.
9. **Motion and interaction.**
   - Idle: the pre-money price drifts and the round re-runs (signature); the figure rolls digit by digit; a pause button stops it.
   - Scroll: six sticky chapters light the table rows they explain.
   - State: plan cards open into their panels (BizOpen); the term sheet slides in.
   - Pointer: drag the pre-money price or the exit price; buttons, chips and rows lift and press at .98.
10. **Media.** No Hanzo film on this page; the objects are product UI (the table, the bar, the term sheet, the waterfall).
11. **Mobile and responsive.** At 375px the hero stacks title, figure, ask, table, then the lede; the chapters pin a compact table; the term sheet is one column; no sideways scroll; text ≥ 14px; targets ≥ 44px.
12. **Accessibility.** Labelled range inputs with `aria-valuetext`; the rolling figure has a screen-reader copy; pause button with `aria-pressed`; sheets and panels trap focus; reduced motion stops the drift and the roll.
13. **Performance and engineering.** Bars move by transform (translate and scale) only; the drift runs only while the hero is on screen; no canvas, video or blur.
14. **SEO and machine files.** Metadata and JSON-LD unchanged (`app/captable/page.jsx`). All text, clauses and plan panels are in the server HTML.
15. **Catalogue and product pages.** Product page (archetype A, told as a launch): hero figure, chapters, spec as a term sheet, plans, close.
16. **Developer experience.** Docs, the hanzoai/captable repo and the upstream captableinc/captable are kept as links.
17. **States and resilience.** The SAFE converts at its cap or its discount and says which; the waterfall handles exits below the preferences (pro rata). JS off: every text and the figure at the default price are legible.
18. **Measurement and handover.** `data-cta` marks the asks; no analytics wired yet (BRIEF-v3 §1). Filmed with the cloud film script at 1470×801 and 375×812, no console errors from this page. Gallery: `desktop.mp4`, `desktop-hero.jpg`, `phone-1..3.jpg`.
