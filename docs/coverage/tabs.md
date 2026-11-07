# /tabs coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/Tabs.jsx` · gallery: `docs/gallery/tabs/` · Persona: developers whose coding agents work in shells on real machines · Goal and metric: `signup_start` (app handoff to tabs.hanzo.ai) · CTA: "Open Tabs"

1. **Strategy and conversion.** One ask, Hanzo's "Open Tabs": solid in the hero (`data-thumb`, `data-cta="tabs.hero"`), in the shared ask bar after the hero, and as the dark room's solid button (`data-cta="tabs.close"`). "Read the source" is outlined.
2. **Information architecture and navigation.** Header and footer unchanged. Order: the live window and its tree, why it is shaped this way (three pinned chapters), link a machine, what you get.
3. **First impression and page narrative.** The headline cuts in; the window under it splits and closes its own panes while the tree grows and shrinks beside it. Then one idea per screen.
4. **Conversion system.** One solid per viewport; `hanzo link` copies exactly what is shown.
5. **Trust and proof.** Hanzo's claims only: no backend, a shell is a URL, MIT, 10k lines of scrollback.
6. **Content presentation (copy untouched).** Parity 26/26, 2/2. "Hanzo Tabs" names the window instead of sitting above the headline; chapter tags sit under the words.
7. **Visual design system.** v2 scale; 0 UI hues (the old terminal green is now silver on the dark panes, ink on light). The pane about to close shows a grey ring. One dark room.
8. **UI component library.** Kit `A`, `Copy`, `Magnetic`; v2 `Settle`, `x-gauss/PinChapters`, `LineMask`, `Pause`, `NoJs`. Browser/Phone is a `radiogroup`; the phone pages are a `tablist`.
9. **Motion and interaction.**
   - Idle: the tree tends itself (split, split, close, close); chapter visuals run (packets with no server, the URL naming sessions, a pane closing and its sibling taking the space).
   - Pointer: split and close any pane yourself; magnetic ask; the phone flip swipes.
   - State: layout animations re-flow panes and the tree (layoutId); Browser/Phone swaps the room; the key row sends a key.
   - Scroll: the window settles; the chapters pin.
   - Pause buttons on the window and the chapter visuals pause both the React loops and the CSS loops; decorative loops elsewhere run a few times and stop.
10. **Media.** Product UI only (window, panes, tree, phone).
11. **Mobile and responsive.** At 375px the window and tree stack, the name gets its own row, targets are 44px, the phone flip swipes; no sideways scroll.
12. **Accessibility.** One h1. Every pane control has a label ("Split build right", "Close shell 3"). JS off: `NoJs`.
13. **Performance and engineering.** Loops stop off screen and when paused.
14. **SEO and machine files.** Unchanged.
15. **Catalogue and product pages.** Does not apply.
16. **Developer experience.** `hanzo link` with a Copy that copies the displayed command.
17. **States and resilience.** Reset returns the tree to its start; the window never goes below one pane.
18. **Measurement and handover.** `data-cta` on both asks. Filmed into `docs/gallery/tabs/`.
