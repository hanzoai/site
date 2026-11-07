# /beta coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/Beta.jsx` · gallery: `docs/gallery/beta/`

1. **Strategy and conversion.** One ask, Hanzo's "Apply" (/beta/apply, the Beta access link): the one solid button in the hero (`data-thumb="Apply"`, `data-cta="beta.hero"`), then the sticky ask bar after the hero at every width. The pass tiles' "Apply" are text links with an arrow; the one solid "Apply" inside an opened pass is alone on screen.
2. **Information architecture.** Header and footer untouched. Hero (promise, the five products), the three passes, the close (Feedback, Book a call).
3. **First impression.** No label above the h1. "Get there first." cuts in; Kai, Enso and Zen play as their own films (Kai is first so a phone's first screen holds a playing film). "Hanzo beta" is the shelf label above the films, not an eyebrow.
4. **Conversion system.** `data-thumb`, `data-cta` on every primary (`beta.hero`, `beta.a/b/c`), `data-ask-name`. One solid button per screen.
5. **Trust and proof.** Hanzo's words only; no figures.
6. **Content presentation (copy untouched).** Parity 12/12, links 4/4. All added words are gone ("What are you after?", the choices, "Pass", the sign-in line). Controls without Hanzo words are icon-only with an aria-label (pause, close).
7. **Visual design system.** Grey deck, 0 UI hues; colour arrives only through Hanzo's films and model pictures. 28px tiles. One dark room (the close).
8. **UI components.** Kit `Film` and `Img` (no raw video/img), system `.x-btn` states, `.x-arrow` links, a dialog sheet with focus trap and return.
9. **Motion and interaction.** Signature: a pass opens into its sheet with a shared-element morph (state); the sheet holds focus, Esc, the scrim, Close and Back all close it. Idle: the films play while seen; Dev's lines write in and Studio's playhead runs once per view. Scroll: the product tiles settle into one row; the passes wipe in one by one. Pointer: tiles and passes lift on hover, the plus turns, film zooms; press scales .98. Arrival: the headline cuts in from the first paint; Feedback and Book a call cut in when reached.
10. **Media.** Hanzo's kai, enso and zen films (WebM with poster), the enso/zen pictures on the passes, and Kai's film once more in the close (played once, no loop); Dev and Studio drawn as their windows. Films play only on screen; a pause control stops the strip and the drawings (WCAG 2.2.2).
11. **Mobile.** The films are a swipe rail starting under the Apply button; passes stack as tall media tiles; the sheet rises from the bottom; full-width Apply; ≥44px targets.
12. **Accessibility.** The sheet is `role=dialog aria-modal`, Esc and the close return focus to the tile. The pause toggle has `aria-pressed`. Reduced motion: films keep their poster, nothing loops.
13. **Performance.** Films load only near the screen (kit Film); transforms and opacity only.
14. **SEO.** Metadata and JSON-LD unchanged. All text is server-rendered; with JavaScript off (`NoJs`) the lede and headline show in place.
15. **Catalogue.** Does not apply.
16. **Developer experience.** Does not apply.
17. **States.** Static; posters stand in while films load or under Data Saver.
18. **Measurement.** `data-cta` on each Apply. No metric id for /beta in PLAN-COMPONENTS 1.1 yet. Ledger: deleted the three raw `<video>`, the magenta accent, the invented matcher and the hand-rolled feedback popover.
