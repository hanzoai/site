# /open-source coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/OpenSource.jsx` · gallery: `docs/gallery/open-source/`

1. **Strategy and conversion.** One ask, Hanzo's "View on GitHub": solid in the hero, then the sticky ask after the hero. "Star Our Repos", "Join Discord" and "Founder Program" are text links with an arrow. The closing screen keeps Hanzo's own "Start Contributing" as its one solid button.
2. **Information architecture and navigation.** Hanzo's header and footer are unchanged. Order: the sky and the count, what each ecosystem publishes, the total, every organization, what Hanzo is built on, the charter, then contribute. Each screen answers the question the one before it raised.
3. **First impression and page narrative.** The first screen holds the headline (line-mask cut-in), one ask and one live object: 2,247 repositories as points of light. The camera pulls back from inside Hanzo to all three galaxies within the first 3s, with no input, and the four counts sit under it. After that, one idea per screen.
4. **Conversion system.** `data-thumb="View on GitHub"` drives the phone thumb bar. `AskBar` carries the same label on desktop once the hero has gone. One solid button per screen.
5. **Trust and proof.** Every figure is Hanzo's own, as its build read GitHub and its forge, and each ecosystem panel links its figures to their source (forge listing, GitHub org). The read time ("Forge listing · read Nov 6, 06:04") sits on the dashboard.
6. **Content presentation (copy untouched).** Parity is 417/417 text and 139/139 links. Detail sits behind clicks: each ecosystem's commits, languages and repositories in a sheet; each galaxy's full organization list in a sheet; the other ecosystems in tabs. No labels above headlines ("Open Source First", "Charter", "Join the Community" are captions under them).
7. **Visual design system.** v2 scale from `components/v2/ProofScale.css` (display 128, headline 56, body 19, Zen Mono captions). Ink, greys and silvers only: the heat map is ink at alpha steps, the language bar is grey steps. Hero objects use a 28px radius, cards 16px. One dark room: the hero sky.
8. **UI component library.** Kit `A` and `More`; v2 pieces `MaskLines`, `DetailSheet` and `AskBar`. Tabs, galaxy chips and language chips are styled pills (no browser-default controls).
9. **Motion and interaction.**
   - Idle: the sky drifts and twinkles, the arrival pull-back, the dashboard's live dot.
   - Pointer: a cluster lights and names its organization under the pointer, drag pans the sky with inertia, cards and tiles lift 5px and press at .98, the card arrow fills and nudges, list rows slide 6px.
   - State: the ecosystem and galaxy pills glide (layoutId), the year of commits re-lights cell by cell, the language bar re-measures, sheets rise.
   - Scroll: only the line-mask headlines and the charter's signature, drawn when reached. No pinned scenes (Catalogue, BRIEF-v3 §5).
10. **Media.** Hanzo has no photographs or film for this page. Its hero objects are its own data drawn: the constellation, the commit-year dashboard and the language bar.
11. **Mobile and responsive.** At 375px the sky sits above the headline, the counts become a 2×2 grid, the tabs span the width, the dashboard stacks under its figures and every grid is one column. Targets are 44px or more, no sideways scroll, no text under 14px except the heat-map month axis (every other month shown at 11px, decorative, `aria-hidden`).
12. **Accessibility.**
   - Tabs with `role=tab`, arrow keys and `aria-controls`; language chips as `role=radio`.
   - Sheets trap focus, Esc closes, focus returns to the button.
   - The canvas has an `aria-label`; the heat map has Hanzo's own description as its label.
   - Reduced motion: the sky is still and fully pulled back, no arrival or re-light animations.
13. **Performance and engineering.** The canvas loop runs only while the hero is on screen (`useInView`) and stops for reduced motion. Everything else animates transform, opacity or stroke only. No blur, no video, no WebGL.
14. **SEO and machine files.** Metadata and JSON-LD unchanged (`app/open-source/page.jsx`). All text is in the server HTML, including every tab, sheet and organization.
15. **Catalogue and product pages.** Signature: the card that opens. Numbered organization cards (`01 / 37`) open into their `/oss/<org>` page with the title as the morph source; the sky's clusters open the same pages.
16. **Developer experience.** Every repository and commit links to its source; the language picker ("Contribute in your language", the Beyond) lists where you can contribute in your language.
17. **States and resilience.** The figures are static (Hanzo's build snapshot), so there is no loading or error state. Empty states: a language missing from an ecosystem's five main languages says so in the share line.
18. **Measurement and handover.** The asks are standard links; no analytics are wired yet (BRIEF-v3 §1, pending Hanzo's event log). Filmed with `scripts/motion.mjs`. Gallery: `desktop.mp4`, `desktop.jpg`, `phone-1..3.jpg`.
