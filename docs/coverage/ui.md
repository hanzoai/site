# /ui coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/apps/UiPage.jsx` · gallery: `docs/gallery/ui/` · Persona: front-end developers building React products · Goal and metric: `install_copy` · CTA: "GitHub" → github.com/hanzoai/ui

1. **Strategy and conversion.** One ask, Hanzo's "GitHub": solid in the hero (`data-thumb`, `data-cta="ui.hero"`), in the ask bar after the hero, and "View on GitHub" solid at the close (`data-cta="ui.close"`). The `pnpm add @hanzo/ui` copy sits beside it; "Deploy to Cloud" is outlined.
2. **Information architecture and navigation.** Header and footer unchanged. Order: the board and its tokens, six pinned specimens, the dark init room, paste-and-ship, "Stop reinventing buttons.", Get UI.
3. **First impression and page narrative.** "Hanzo UI" cuts in; the board under it uses itself: the menu opens, the dialog opens, a focus ring walks the keyboard path, the tokens retune. Then one property per screen with its own specimen.
4. **Conversion system.** One solid per viewport; the Copy copies exactly the displayed command.
5. **Trust and proof.** "Powers chat.hanzo.ai, platform.hanzo.ai, and every Hanzo dashboard" is shown as Hanzo says it; "8 stars" as Hanzo lists it.
6. **Content presentation (copy untouched).** Parity 59/59, 2/2. "React Component Library" sits under the headline with Hanzo's Enso mark; chapter tags sit under the words.
7. **Visual design system.** v2 scale. 0 UI hues: the token demo retunes between ink, graphite and steel; specimens are ink and grey. One dark room.
8. **UI component library.** Kit `A`, `Img`, `Copy`, `Magnetic`; shared `Paste`, `Code`; v2 `Settle`, `x-gauss/PinChapters`, `LineMask`, `Pause`, `NoJs`. The board's list is a styled list, not a raw table. Sliders are labelled; swatches are a `radiogroup`.
9. **Motion and interaction.**
   - Idle: the board opens its menu and dialog, walks focus and retunes; the keyboard specimen walks focus; the package specimen moves chat, console and cloud together.
   - Pointer: magnetic ask; every board control works; "Ship it" lifts and presses.
   - State: dragging radius and density reshapes every component at once (the Beyond); the dialog and menu open and close.
   - Scroll: the board settles; specimens pin.
   - Pause buttons on the board and on the specimens.
10. **Media.** Hanzo's Enso mark (kit `Img`). The rest is product UI.
11. **Mobile and responsive.** At 375px the board and tokens stack, specimens pin above words; targets 44px; no sideways scroll.
12. **Accessibility.** One h1. The dialog is `role=dialog`; the menu is `role=menu`. JS off: `NoJs`.
13. **Performance and engineering.** Loops stop off screen and when paused.
14. **SEO and machine files.** Unchanged.
15. **Catalogue and product pages.** Does not apply.
16. **Developer experience.** The init block (`npx @hanzo/ui init`, add, use) with Copy; the paste-and-ship prompt with Copy.
17. **States and resilience.** The board's field accepts focus and takes the demo over; static otherwise.
18. **Measurement and handover.** `data-cta` on both asks. Filmed into `docs/gallery/ui/`.
