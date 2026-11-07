# /console coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/apps/ConsolePage.jsx` · gallery: `docs/gallery/console/`

1. **Strategy and conversion.** One ask, Hanzo's "Open Console" (https://platform.hanzo.ai): solid in the hero (`data-thumb`, `data-cta="primary"`), carried after the hero by the v2 AskBar on desktop and the site's ask bar on phones, and the one solid button in the close (`data-cta="primary"`). "Documentation", "Deploy to Cloud", "Self-host" and "View on GitHub" are text links.
2. **Information architecture and navigation.** Hanzo's header and footer are unchanged. Order: the shell running, its six modules (chapters), find anything by typing, what it stands on (four facts that open), getting it, then the close. The shell's sidebar keeps Hanzo's eight product links.
3. **First impression and page narrative.** The hero is the page's one dark room: the h1, one line, the ask, then the console window, which starts typing in its palette within 1.5 seconds. At 1470×801 the window's header, palette and module are on the first screen; at 375×812 the window starts inside the first 660px. Nothing sits above the h1.
4. **Conversion system.** `data-thumb="Open Console"` drives the site's ask bar on phones; `AskBar` carries the same label on desktop (the site's bar stands aside there via `data-dock`, so only one shows). One solid button per viewport: the hero ask, then the close ask.
5. **Trust and proof.** The four facts are Hanzo's own (/v1, OIDC, Per-org, OSS); each opens into its page with Hanzo's sentence, /v1 with the generated client code.
6. **Content presentation (copy untouched).** Parity 93/93 text and 14/14 links. Detail sits in open cards and the palette; one module per chapter; chapter labels sit under their headlines.
7. **Visual design system.** Biz grammar (`components/v2/Biz.css`). Ink, greys and white only: inside the dark shell the live light is white, and every status also has a word (Ready, Building, active, revoked, connected). One dark room: the hero.
8. **UI component library.** Kit `A`, `Go`, `More`; v2 `BizStage`, `BizChapters`, `BizOpen`; `Paste` and `Code` from the cloud frame. The palette is a real combobox; module buttons, the key's Revoke, the Pause and the result rows have hover detail and press scale.
9. **Motion and interaction.**
   - Idle and time: the shell's palette types a module's name, the module opens and plays its own moment (a build finishes, a key is revoked, usage records land, an app gets an identity and a store, a provider connects, the organization switches).
   - State: the palette filters as you type; the fact cards open with a shared-element morph.
   - Scroll: the Stage settle and the pinned chapters.
   - Pause on the window (44px, WCAG 2.2.2); tapping a module also takes over.
10. **Media.** No Hanzo films for the console; the objects are product UI: the shell (three times: hero, chapters, palette) and the code pane.
11. **Mobile and responsive.** At 375px the shell drops its rail and module column and keeps the module, the palette film and the Pause; the chapter stage pins compactly; the palette stacks its results over the shell. No sideways scroll; text ≥14px; targets ≥44px.
12. **Accessibility.** The palette is `role=combobox` with `aria-activedescendant` over a `role=listbox`; "/" focuses it; module buttons use `aria-pressed`; open cards trap focus and return it; reduced motion shows final states.
13. **Performance and engineering.** Motion is transform and opacity. The film runs only while the window is on screen (`useLive`) and stops on Pause; module moments play once per opening; timers are cleared on every change.
14. **SEO and machine files.** Metadata and JSON-LD unchanged (`app/console/page.jsx`). All words are in the server HTML, including the open-card panels and every chapter.
15. **Catalogue and product pages.** Product page: hero object, chapters, the palette, facts that open, the close.
16. **Developer experience.** The /v1 card opens into the typed client code (Copy); the agent prompt ("Paste and ship") is kept.
17. **States and resilience.** The palette has an empty state ("Nothing matches …"); keys toggle between active and revoked; projects show Building then Ready. JS off: every word reads, and the hero copy uses a CSS arrival.
18. **Measurement and handover.** The asks carry `data-cta="primary"`; no analytics are wired yet. Filmed with the group's film script at 1470×801 and 375×812. Gallery: `desktop.mp4`, `desktop-hero.jpg`, `phone-1..3.jpg`.
