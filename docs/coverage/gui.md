# /gui coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/apps/Gui.jsx` · gallery: `docs/gallery/gui/`

1. **Strategy and conversion.** One ask, Hanzo's "View on GitHub" (https://github.com/hanzoai/gui): solid in the hero (`data-thumb`, `data-cta="primary"`), carried after the hero by the v2 AskBar on desktop and the site's ask bar on phones, and the one solid button in the close (`data-cta="primary"`). "Deploy to Cloud" is the close's text row.
2. **Information architecture and navigation.** Hanzo's header and footer are unchanged. Order: the one component on four platforms, five ideas about it (chapters), set its props yourself (the dark room), install and the platforms, getting it, the close.
3. **First impression and page narrative.** A centred two-line title ("Hanzo GUI" / "One UI kit. Every platform."), the package line, the ask, then the code bar and the four frames. At 1470×801 all four frames and their Welcome are on the first screen and change within 3 seconds; at 375×812 the code bar and both phones show inside the first 660px. Nothing sits above the h1.
4. **Conversion system.** `data-thumb="View on GitHub"` drives the site's ask bar on phones; `AskBar` carries the same label on desktop (the site's bar stands aside there via `data-dock`, so only one shows). One solid button per viewport.
5. **Trust and proof.** The proof is the component itself: the same Welcome (Hanzo's code: a YStack, a Text, a Button) rendering identically in four frames, and a real typecheck that refuses a value outside the tokens. Hanzo's "4 stars" and licence sit in Get GUI.
6. **Content presentation (copy untouched).** Parity 70/70 text and 2/2 links. One idea per screen; the platforms open into their own panels; chapter labels sit under their headlines.
7. **Visual design system.** Biz grammar (`components/v2/Biz.css`). Ink, greys and white only, including the shared code pane (its default syntax hues are overridden on this page). Device frames are drawn with container units so one drawing serves every size. One dark room: the token editor.
8. **UI component library.** Kit `A`, `Go`, `More`; v2 `BizStage`, `BizChapters`, `BizOpen`, `AskBar`; `Paste` and `Code` from the cloud frame. Token chips are `role=radio` buttons; inputs are styled; every control has hover, press scale and a focus ring.
9. **Motion and interaction.**
   - Idle: the props change by themselves in the code bar and all four frames spring to the new state together (Pause on the bar, 44px).
   - State: tokens set all four; a drifted value fails the typecheck; platform cards open with a shared-element morph.
   - Scroll: the Stage settle and the pinned chapters (chapter 5 runs the springs while lit).
10. **Media.** No Hanzo films for GUI; the objects are product UI: four device frames, the editor and the code pane.
11. **Mobile and responsive.** At 375px the four frames sit two by two, the chapter stage pins an iOS phone beside a web window, the editor stacks over the frames, and the platform cards become a swipe rail. No sideways scroll; text ≥14px; targets ≥44px.
12. **Accessibility.** Real buttons and radios with `aria-checked` and `aria-pressed`; labelled inputs; the code bar and typecheck are `aria-live`; open cards trap and return focus; reduced motion shows the settled state.
13. **Performance and engineering.** Motion is transform and opacity plus one background colour per frame. The prop cycle only runs while the hero is on screen and stops on Pause; frames use container units, not JS measurement.
14. **SEO and machine files.** Metadata and JSON-LD unchanged (`app/gui/page.jsx`). Every word is in the server HTML, including every chapter and the open-card panels.
15. **Catalogue and product pages.** Product page: hero object, chapters, the editor, platforms that open, the close.
16. **Developer experience.** The install line and the Welcome code sit in a code pane with Copy; the agent prompt ("Paste and ship") is kept.
17. **States and resilience.** The typecheck has a pass and a fail state (a word and a shape cue, no colour); a drifted value leaves the frames on the last valid tokens. JS off: every word reads, the hero title uses a CSS arrival.
18. **Measurement and handover.** The asks carry `data-cta="primary"`; no analytics are wired yet. Filmed with the group's film script at 1470×801 and 375×812. Gallery: `desktop.mp4`, `desktop-hero.jpg`, `phone-1..3.jpg`.
