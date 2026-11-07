# /metrics coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/cloud/Metrics.jsx` (+ `.css`) · route: `app/metrics/page.jsx` · gallery: `docs/gallery/metrics/`
Answers `docs/review/metrics.md` (6/10). Each of its six fixes is listed below under the area it touches.

1. **Strategy and conversion.**
   - Header: `Persona: Developer`, `Goal: try Hanzo Metrics`, `CTA: "View on GitHub" → github.com/hanzoai/metrics`, `Metric: api_key_created`.
   - One ask, in Hanzo's words: "View on GitHub" is solid in the hero (`data-thumb`, `data-cta="metrics.hero"`) and again at the close (`metrics.close`).
   - The site's sticky ask bar and the phone thumb bar carry the same label from `data-thumb`. They step aside while either button is on screen, so one solid button shows per viewport.
   - "Deploy to Cloud" is a text link (review fix 4).
2. **Information architecture and navigation.** Hanzo's header and footer are unchanged. Order: the live chart; what a metric is here (six chapters); send a metric (dark room); related; get it. Every link the old page had is kept (12/12).
3. **First impression and page narrative.**
   - The first screen at 1470×801 is the product: a one-line title, the ask, and the query toolbar, with the live chart full-bleed under them (review fixes 3 and 6). No other page has this first screen.
   - The chart moves within the first second, with no input.
   - The h1 is in the server HTML and cuts in with CSS at first paint, without waiting for hydration. The eyebrow above it is gone (review fix 2); `metrics.hanzo.ai` now sits in the toolbar.
   - The statement "What a metric is here" opens the pinned scene beside the table, so it is never a screen with nothing to look at. One idea per screen after that.
4. **Conversion system.**
   - `data-thumb` is on both asks; `data-cta` is on both primaries.
   - The thumb bar label equals the close's label.
   - "Logs" is a card that opens into its page (Morph source `data-morph` on its title).
5. **Trust and proof.** The page states no figures beyond Hanzo's own ("4 stars", "Apache-2.0"). The chart and table values are drawn, not measured, and show no numbers.
6. **Content presentation (copy untouched).**
   - Parity is 59/59 text and 12/12 links.
   - The six points are one pinned table that changes per chapter. The label check lives in chapter three, beside the words on desktop and inside the table on phones.
   - The only added strings are drawn demo data (the query, rows and span names) and the label-check readout.
7. **Visual design system.**
   - 0 UI hues (review fix 1). The series differ by weight and dash: zen is a 2.6px ink line, kai a dashed grey line, enso a dotted silver line.
   - The trace bars, pills, flag and chips are ink or grey. The Paste "api" tag is grey, not green.
   - The v2 type scale comes from `components/v2/LaunchType.css`. Hero objects use a 28/22px radius. There is one dark room.
8. **UI component library.**
   - Kit pieces: `LineMask`, `PinnedChapters` (intro), `ClipWipe`, `LaunchConsole`, `LivePause`, `RelatedCards` and `LaunchClose`, plus Frame's `Paste`.
   - No `title=` attributes: `LaunchConsole` replaces Frame's console.
   - Every hover sits inside `@media (hover:hover)` and changes ink or background, never opacity alone. Every press scales to .97–.98.
9. **Motion and interaction.** Scroll-linked motion is one of six kinds.
   - Idle: the streaming chart and the console that finishes its build.
   - Pointer: a crosshair follows a fine pointer and reads the line under it; the close's ask is magnetic.
   - State: the split tabs, the label check, PromQL ↔ builder, and holding the chart (click) to keep a moment's traces open.
   - Time: the spike lands every ~10 s and the traces open.
   - Arrival: the cut-in title, and a timed wipe into the dark room (played once, not scrubbed).
   - Scroll: the pinned table only.
   - A pause control (44px, `aria-pressed`) sits first in the chart's toolbar.
10. **Media.** The page has no Hanzo film or image. Its objects are product UI (chart, table, console, terminal prompt) and the page's Sigil, framed at the close and drawn on the Logs card.
11. **Mobile and responsive.**
   - At 390×664 the chart sits under the title, toolbar and ask, and the traces card follows it.
   - The pinned chapter text clears the thumb bar in all six chapters (`pinchk`: all ok).
   - No sideways scroll, no text under 14px, and every target is 44px or more (including the pause button and repo link).
12. **Accessibility.**
   - Text contrast is 4.5:1 or better: muted text is #6e6e73, not #86868b.
   - The chart's hold control is a real button with `aria-pressed`, and the split and label buttons use `aria-pressed`. The table uses `role=table`, rows and cells.
   - The traces line is `aria-live`.
   - Reduced motion shows final states: the chart is set with its spike under the cursor and the traces open.
   - With JS off, the h1 and all six chapters are readable in order (the scene unpins).
13. **Performance and engineering.**
   - One rAF loop (the chart) runs only on screen and stops when paused or held. The crosshair moves by transform, with no React state per move.
   - The page file has no `setInterval`.
   - Motion is transform, opacity and clip-path only.
14. **SEO and machine files.** Metadata and JSON-LD are unchanged. All copy, including every chapter, is in the server HTML.
15. **Catalogue and product pages.** Follows the cloud product anatomy: identity, the live object, the six facts that open in turn, the console, the close.
16. **Developer experience.** The agent prompt copies exactly what it shows. The console's links are Hanzo's.
17. **States and resilience.**
   - The chart has no fetch, so there is no loading or failure state to design.
   - "4 stars" is Hanzo's static figure.
   - Paused, held and reduced-motion states each look intentional.
18. **Measurement and handover.** `data-cta` ids are `metrics.hero` and `metrics.close`, and the metric is `api_key_created`. The gallery has `d.mp4` (a full scroll-through), `d.jpg` and `p.jpg`.

Ledger: deleted the SettleStage hero and its scroll-scrubbed scale, the standalone statement section (now the pinned scene's intro), Frame's `Console` (8 `title=`), the eyebrow above the h1, the orange accent and every UI hue, the `useEvery` interval, and the plain "Related" row.
