# /enterprise coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/Enterprise.jsx` (+ `Enterprise.css`) · route: `app/enterprise/page.jsx` · gallery: `docs/gallery/enterprise/`

Persona: an IT, security or platform lead choosing where Hanzo runs. Goal: see that it runs where you need it, and that you can verify it (brief 5.3). CTA: "Get Enterprise plan" (`data-cta="enterprise.hero"`, the page's ask via `thumb`), and one "Talk to sales" in the closing Band. Metric: cta_click on enterprise.hero and the Band.

1. **Strategy and conversion.** One ask in the hero, "Get Enterprise plan", which carries the site's ask bar after the hero. One "Talk to sales", in the Band. "Build on Hanzo Platform" is the outlined second option. The repeated deployment block with its own sales buttons is gone.
2. **Information architecture and navigation.** Order per 5.3: where it runs (the hero and its four chapters), the trust strip (in the first screen, then Security right after the chapters), what Enterprise includes, results, the GPU drawer, partners and clouds, questions, Band.
3. **First impression and page narrative.** The h1 cuts in by line with no label above it. At 1470×801 the h1, lede, both asks and the trust strip sit above the fold, and Hanzo's workspace peeks below with its audit log already writing. Scrolling settles the workspace inside four walls, one place per chapter.
4. **Conversion system.** Kit `<Cta>` with `data-cta` ids: enterprise.hero, enterprise.platform. Kit `Band` for the close. The ask bar carries "Get Enterprise plan".
5. **Trust and proof.** The trust strip sits in the first screen: Hanzo's three promises plus "How Hanzo is secured" and "Trust center". Security follows as a calm numbered list. Results sit on a split-flap board with each case linked. No seals and no invented figures.
6. **Content presentation (copy untouched).** Parity is 179/179 text and 23/23 links. Kit `Faq` (hidden="until-found", hash-open). Kit `DataTable` for the prefill measurements. "Hanzo Enterprise" moved from a kicker over the h1 into the workspace's title bar.
7. **Visual design system.** v2 scale, greys only (JAMES.md 7). Colour comes only from Hanzo's Zen film. There is one dark room, the Band.
8. **UI component library.** Kit: `Cta`, `Faq`, `Film`, `Img`, `DataTable`, `Band`, `Flap`, `A`, `More`. v2: `LogoWall`, `x-cannon/Drawer`. Page-local: the workspace (audit log), the walls, the four-wall glyph, the prefill instrument, and the rack card.
9. **Motion and interaction.**
   - **Scroll:** the boundary zoom (one pinned scene).
   - **Idle:** the audit log writes new rows, the Zen film plays, and the clouds drift.
   - **Arrival:** the h1 line cut-in, and the split-flap results.
   - **Pointer:** pointing at a prompt size reads it on the instrument.
   - **State:** the rack card grows into its drawer, and numbers roll on the instrument.
   - **Press:** .98 on buttons and cards.
   - Scroll-linked motion is one of six kinds.
10. **Media.** Hanzo's Zen film (kit `Film`: plays only on screen, never under reduced motion or Data Saver). Customer logos are kit `Img` and hide themselves if they fail to load. Real product UI is the hero object.
11. **Mobile and responsive.** At 375px there is no pin: the workspace sits full width, and the four places are tapped through, turning on their own until touched. Tiles, the board and the offers go to one column. 44px targets, and no sideways page scroll.
12. **Accessibility.** The workspace is decorative (aria-hidden). The places are real buttons with `aria-current`, and the caption is `aria-live`. The prompt sizes are a radio group. The drawer is a modal that traps Tab, closes on Esc and returns focus. Reduced motion shows the static story.
13. **Performance and engineering.** Transform and opacity only. The audit-log timer runs only while the workspace is on screen. The film plays only on screen. The logo wall is one CSS animation that pauses off screen.
14. **SEO and machine files.** Metadata and JSON-LD are unchanged. Every place, chapter caption, drawer line and answer is in the server HTML. With JS off, the four places read as a list and no text block is hidden (checked: 0).
15. **Catalogue and product pages.** Does not apply.
16. **Developer experience.** "Build on Hanzo Platform" goes to platform.hanzo.ai.
17. **States and resilience.** A customer logo that fails to load leaves its name. The logo wall falls back to names in type.
18. **Measurement and handover.** `data-cta` ids: enterprise.hero, enterprise.platform, and the Band's "Talk to sales".

**Ledger (deleted):**
- the repeated deployment block ("Which wall is yours") and its second sales button
- the long dark GPU room, now a light instrument plus a drawer
- the clip-path wipe
- the kicker above the h1
- the light close (the kit Band replaces it)
- doubled section air (now one 60–128px pad each)
