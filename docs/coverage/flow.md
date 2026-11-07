# /flow coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/apps/Flow.jsx` · gallery: `docs/gallery/flow/`

1. **Strategy and conversion.** One ask, Hanzo's "Open Flow" (https://flow.hanzo.ai): solid in the hero (`data-thumb`, `data-cta="primary"`), carried after the hero by the v2 site ask bar on desktop and the site's ask bar on phones, and the one solid button in the close (`data-cta="primary"`). "Documentation", "Deploy to Cloud" and "View on GitHub" are text links.
2. **Information architecture and navigation.** Hanzo's header and footer are unchanged. Order: the canvas running, what each node does (chapters), step through it yourself (playground), four facts that open, getting it, then the two commands and the ask.
3. **First impression and page narrative.** The first screen is the canvas itself: the h1 sits among six running nodes, a pulse travels the edges within a second, and the inspector follows the run. At 375×812 two rows of nodes show inside the first 660px. Nothing sits above the h1.
4. **Conversion system.** `data-thumb="Open Flow"` drives the site's ask bar on phones; the site's ask bar (`components/Ask.jsx`) carries the same label on desktop (the site's bar stands aside there via `data-dock`, so only one shows). One solid button per viewport: the hero ask, then the close ask.
5. **Trust and proof.** The facts are Hanzo's own (Python, REST, :7860, MIT); each opens into its page with Hanzo's sentence. The close shows the exact two commands with a Copy that copies what is shown.
6. **Content presentation (copy untouched).** Parity 40/40 text and 4/4 links. Detail lives in open cards (REST opens into REST / JSON / MCP tabs) and in the chapters, one idea per screen. Chapter labels sit under their headlines.
7. **Visual design system.** Biz grammar (`components/v2/Biz.css`): display 128/96, headline, lede, body, Zen Mono labels. Ink, greys and white only; done nodes and outputs are inverted ink chips. One dark room: the playground.
8. **UI component library.** Kit `A`, `Go`, `More`, `Copy`; v2 `BizLines`, `BizChapters`, `BizOpen`. Custom controls (nodes, step chips, play/pause, tabs) are styled buttons with hover lifts and press scale.
9. **Motion and interaction.**
   - Idle: the run (pulse along each edge, the node's progress bar, its output appearing).
   - Pointer and state: playground nodes and step chips answer the hand; fact cards open with a shared-element morph; tabs switch.
   - Scroll: line-masked headings and the pinned chapters.
   - Pause on the hero object (44px) and Play/Pause in the playground (WCAG 2.2.2).
10. **Media.** The page has no Hanzo films or images for Flow; its objects are product UI: the canvas, the inspector, the playground and the terminal.
11. **Mobile and responsive.** At 375px the canvas re-lays as a two-column snake, the chapter board pins compactly on top, the playground becomes a stacked panel with 48px controls. No sideways scroll; text ≥14px; targets ≥44px.
12. **Accessibility.** Real buttons with `aria-pressed`, `aria-current`, `role=tab`; the inspector and run state are `aria-live`; focus rings on every control; reduced motion shows the finished run.
13. **Performance and engineering.** Motion is transform and opacity (the pulse rides keyframed x/y). The run only steps while on screen (`useLive`), and stops on Pause. Edges are measured with a ResizeObserver, not on scroll.
14. **SEO and machine files.** Metadata and JSON-LD unchanged (`app/flow/page.jsx`). Every word is in the server HTML, including chapters, open-card panels and inactive tabs.
15. **Catalogue and product pages.** Product page: hero object, chapters, spec-like facts that open, close.
16. **Developer experience.** The two commands to run it locally are the close's object, with Copy; the agent prompt ("Paste and ship") is kept.
17. **States and resilience.** The run has running, passing, done and complete states; "…" stands for a node that has not returned yet. JS off: every word and the finished labels read; the hero copy uses a CSS arrival.
18. **Measurement and handover.** The asks carry `data-cta="primary"`; no analytics are wired yet. Filmed with the group's film script at 1470×801 and 375×812 (no console errors, no sideways scroll). Gallery: `desktop.mp4`, `desktop-hero.jpg`, `phone-1..3.jpg`.
