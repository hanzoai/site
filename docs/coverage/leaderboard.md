# /leaderboard coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/Leaderboard.jsx` · gallery: `docs/gallery/leaderboard/`

1. **Strategy and conversion.** One ask, Hanzo's "Open bounties" (/bounty): solid in the hero, then the sticky ask after the hero, then again at the close. "GitHub issues" and "Browse open bounties" are text links with an arrow.
2. **Information architecture and navigation.** Hanzo's header and footer are unchanged. Order: who leads, how ranks are counted, the token board, how to earn, then your own points. Each screen answers the question the one before it raised.
3. **First impression and page narrative.** The first screen holds the headline (line-mask cut-in) and one live object: the podium. Its tape adds up the lit hunter's score within 1s, with no input. After that, one idea per screen.
4. **Conversion system.** `data-thumb="Open bounties"` drives the phone thumb bar. `AskBar` carries the same label on desktop once the hero has gone. There is one solid button per screen.
5. **Trust and proof.** Every total shows its sum: bounty points plus tokens ÷ 100K, for example 450 + 1,060 = 1,510. A development-time assertion checks Hanzo's own figures add up. Recent rewards open in a sheet.
6. **Content presentation (copy untouched).** Parity is 94/94 text and 2/2 links. Detail sits behind clicks: the rewards in a sheet, the earning rules one per pinned chapter. There are no labels above headlines.
7. **Visual design system.** v2 scale from `components/v2/ProofScale.css` (display 96, headline 56, body 19, Zen Mono captions). Ink, greys and silvers only, with no hues. Hero objects use a 28px radius. There is one dark room: the token board.
8. **UI component library.** Uses the kit (`A`, `More`) and the v2 pieces `MaskLines`, `PinScenes`, `DetailSheet`, `SceneWipe` and `AskBar`. The steppers, the Log/Linear pill, the per-PR radio chips and the slider are styled; no control uses browser defaults.
9. **Motion and interaction.**
   - Idle: the podium cycles its hunters and the tape adds up.
   - Pointer: steps lift, rows fill with a clip-path wipe, buttons lift 1px and press at .98, steppers scale.
   - State: the scale pill glides (layoutId), the sheet rises, totals roll on a spring.
   - Scroll: the pinned receipt (≤ 250svh), the dark-room wipe and the bars drawing.
10. **Media.** The page has no Hanzo images or film. Its hero objects are product-style UI: podium, tape, board, receipt and calculator.
11. **Mobile and responsive.** At 375px the layouts are designed, not shrunk:
   - handles are hidden on the podium (still in the HTML);
   - pinned chapters become stacked chapters, each with its receipt;
   - all targets are 44px or more, there is no sideways scroll, and no text is under 14px.
12. **Accessibility.**
   - Real buttons with `aria-pressed`, `role=tab` and `role=radio`.
   - The sheet has a focus trap: focus goes in, Esc closes it, and focus returns to the button.
   - `aria-live` on the totals, focus rings everywhere, and reduced motion shows final states.
13. **Performance and engineering.**
   - Motion is transform, opacity and clip-path only.
   - Only the podium cycle runs while the page is idle, and it stops off screen (`useInView`).
   - No blur, no video, no canvas.
14. **SEO and machine files.** Metadata and JSON-LD are unchanged (`app/leaderboard/page.jsx`). All text is in the server HTML, including sheet content and every chapter.
15. **Catalogue and product pages.** Does not apply: the leaderboard is not a catalogue.
16. **Developer experience.** Does not apply beyond the links to GitHub bounty issues, which are kept.
17. **States and resilience.** The figures are static (Hanzo's board as published), so there is no loading or error state. The calculator has edge states: steppers disable at 0 and 99, and the board placement reads "Below #10…" when your tokens fall under the tenth org.
18. **Measurement and handover.** The asks are standard links; no analytics are wired yet (BRIEF-v3 §1, pending Hanzo's event log). Filmed with `scripts/motion.mjs` (desktop, 0 still screens, layout shift 0.000). Gallery: `desktop.mp4`, `desktop.jpg`, `phone-1..3.jpg`.
