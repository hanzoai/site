# /metrics — James-eye review
Ready: 2026-11-07 the chapters are a stage (stacks arrive, the query bar takes over, a column grows per tick, the spike opens into its chart and traces, the query folds into a rule, two orgs slide out) with a split-flap flip board on the mode; one sticky table on phones instead of seven; ch 03 holds one solid; 320 toolbar stacks; no ellipsis on /v1/event/insights; gliding split pill; Logs moved into the black room; close h2 52px.

Verdict: 7/10
First complaint: "The chart at the top is lovely, then it's the same grey table for six screens. A row goes bold, a word changes, scroll again. It's a spreadsheet you scroll past, and on the phone I get that table seven times."

Walked: 2026-11-07 17:00–17:16 UTC. Desktop was 1470×801 (Chromium, `(hover: hover)` true) and phone was 375×812 (isMobile, touch). I also checked 375×667 and 320×700. Video was recorded both ways (`recordVideo`). I diffed frames in the first 1.2 s and diffed each screen at rest (two shots 0.9 s apart). Desktop was scrolled with the wheel in 60%-of-screen steps with a dwell on each, 20 screens. Phone was scrolled in 85%-of-screen jumps (690px, real screen heights, not motion.mjs), 15 screens. I hovered and pressed every control class, moved the crosshair, held the chart by click and by tap, switched the split tabs, used the chapter rail to jump to 03 and toggled the label check. I also ran reduced motion, JS off, a CDP platform-font check, the h1 box over time, CLS, console errors and the neighbours (/o11y, /cloud/logs, /dashboards). Then I ran `parity.py /metrics` (59/59 text, 12/12 links) and `taste.py` on both files (OK).

Shared-chrome note: on some first loads a hydration error and a red "1 Issue" badge appear (2 of 3 cold loads in one probe, 0 of 3 in another). The diff is in `FooterHTML` (`data-x-shell="footer"` `dangerouslySetInnerHTML`) in the root layout, not in /metrics. It was not counted against the page, but it has to be fixed site-wide before any page can claim "no console errors".

## The 11 answers
1. **Sells in 5 s, moves within 1 s?** Yes. In the first screen the 52px h1 "Hanzo Metrics" (top 116px, box steady at 325.9×54.1 from 815 ms on, so there is no font swap), the lede, the solid "View on GitHub" and a live chart tile take the rest of the screen. All five frame diffs in the first 1.2 s changed. The line slides by one CSS transform, and a spike lands under the dashed cursor with "spike · zen" and the traces waterfall opening beside it. It is a real product object that runs itself. One gripe: the h1 baseline sits at about 21% of the height, not the 38% in MASTER part 3.
2. **One in, one out, or a document?** It is pinned on desktop, but it reads like a document. The chapter scene runs from y≈430 to y≈5,200 (about 6 screens) with one object, the "Hanzo Datastore" table, at the same size the whole way. Each chapter changes a bold row, a query string or a chip, while the words on the left swap. Screens 2, 3, 9 and 12 were at rest after the table finished its beats. On phone nothing pins: the same table is drawn 7 times, once above each chapter (`.mt-ch-own`), and the page is 10,654px tall (13+ screens). After the table comes the black room (good), then one related card and the close.
3. **A real visual object in every section?** Mostly. The hero chart, the table, the dark console (chart, services, traces) and the close contour art all count. The Related section is one full-width 1152px card that is mostly empty contour lines, plus a white band of about 250px before the close (desktop screen 16). In the chapters, the left column has about 250px of dead space between the paragraph and the 01–06 rail (desktop screens 3–12).
4. **One ask in the header, nothing floating, scale rhythm?**
   - **Desktop:** at the top, the header carries "Try Hanzo" outlined and the page's "View on GitHub" is the hero solid. Once the hero leaves, the header swaps to a solid "View on GitHub". Good.
   - **Phone:** after scrolling, the header still says "Try Hanzo" (outlined) and there is no ask bar, so the page's ask is missing from the sticky chrome on phone.
   - **One solid fill:** this breaks in chapter 03. The label check's pressed pills are solid ink (`.mt-lab-c button[aria-pressed='true'] { background: var(--ink) }`), so the measured viewport held 3 to 4 solid fills: "View on GitHub", "per-model", "per-route", "per-tenant".
   - **Scale:** h1 52, chapter intro h2 44, chapter h3 32 (desktop; 6px over the 26px resting size), room h2 26, close h2 "Get Metrics" 64. The close headline is bigger than the page's own h1, so the hierarchy inverts at the end. The rest has rhythm.
5. **Does every hover and press answer, without jumps?** Yes, with no width jumps anywhere. Hover changes fill or ink on the ask (#0a0a0a to #262626), split tabs, pause, rail, copy, services (row fill, and the chart's highlighted series follows), console icons (fill plus tooltip), "Open in the console" (inverts) and the related card. Press measured scale ≈0.97 on all of them. The crosshair reads the line and names the nearest series in the legend, which is a hover that tells you something. The magnetic ask claimed on the card did not move when the pointer was 10px outside the button (transform: none). The split pill swaps background; it does not glide.
6. **Overlap, font swap, layout shift?**
   - **Font and CLS:** the h1 renders in Zen (CDP platform font) with a stable box. Desktop CLS was 0.0127 over the full walk (from `.mt-ch-copy` and a CODE node late on). Phone CLS was 0.0006. Neither page overlaps itself; only the shared cookie card sits over content until dismissed.
   - **At 320px:** scrollWidth is 320, but the hero toolbar is clipped. The pause button's right edge is at 330px and the split group's at 325px, so "per-tenant" and the pause are cut off at the edge (`p320`). The legend runs to 330px.
   - **Desktop truncation:** the prompt bar truncates Hanzo's own "/v1/event/insights" to "/v1/event/insigh…" (`.mt-api` with `text-overflow: ellipsis`).
7. **Which reference, and is its motion there?** It is an apple.com pinned stage with one panel changing, plus synchronized-style self-running product UI. The pin and the per-chapter beats work: a rail fills, rows light up, the query string rewrites, and the PromQL ↔ builder swap happens. But Apple's pinned scenes change the object dramatically from chapter to chapter, and here each chapter is a 1-row highlight in the same 7-row grid. The reference's motion is present but faint. The dark room's ClipWipe and the "hanzo metrics query" landing on the line are the best authored moments on the page.
8. **Different from its neighbours?**
   - **Hero:** different. Metrics has a white hero with a live line chart, /o11y a black hero with a trace waterfall, /cloud/logs its own xcf layout.
   - **Section skeleton:** identical to /o11y: hero, then a pinned chapter scene, then a dark ClipWipe room, then one RelatedCards, then LaunchClose with a contour Sigil and "Get X". In the DOM, /o11y is `lx-dark lx-pin lx-wipe lx-rel lx-close` and /metrics is hero, `mt-ch`, `mt-send` (ClipWipe), `mt-rel`, `mt-close`.
   - **Repeated element:** the hero's traces waterfall (gateway, chat.completion, datastore.query, model.generate) is the same kind of object as /o11y's hero.
   - **Verdict:** the signature differs; the page shape is a template.
9. **All 18 parts?** Mostly; the gaps are listed below.
10. **Banned tells?** None found. No hue (taste OK), no gradient text, no Inter, no kicker above a headline ("02 / 06" sits under its h3), and no cursor glow. Three things are close: three equal pills in a row in the label check (pills, not boxes); a spinner on "checkout-web Building" in the console, where part 17 says no spinner on sections (here it is a status glyph inside a product UI, which is borderline); and the area fill under the line, which is ink at 10% to 0 (monochrome, so not a gradient tell).
11. **Copy untouched?** Yes. `parity.py /metrics` returned OK, 59/59 text and 12/12 links. One copy line is visually cut ("/v1/event/insigh…").

Motion kinds, counted:
- **Idle:** the sliding line, the riding spike flag and the console build.
- **Time:** each chapter's table beats.
- **Pointer:** the crosshair and the service hover that highlights a series.
- **State:** split tabs, the label check, the held moment, a sent query landing.
- **Arrival:** the h1 line mask and the ClipWipe.
- **Scroll:** which chapter is on.

That is 5+ kinds, and scroll is well under half. Reduced motion had 0 running animations after 3.5 s with the final states shown. With JS off, every heading and paragraph is visible.

## Missing from the 18 parts
- **Part 1 / 4 (one solid fill):** chapter 03 holds 3–4 solid ink fills (label-check pills plus the header ask).
- **Part 4 (sticky ask on phone):** the phone header keeps "Try Hanzo" and no bar carries "View on GitHub" after the hero leaves.
- **Part 3 (one in, one out; rhythm):** six desktop screens hold one unchanging object, and phone stacks 7 copies of it. No loud and quiet alternation inside the chapters.
- **Part 7 (differs from neighbours):** the section skeleton is the same as /o11y's.
- **Part 8 (gliding tab pill):** the split tabs swap backgrounds; there is no glide.
- **Part 11 (44px targets):** phone split tabs are 40px tall (`.mt-split button { min-height: 40px }`) and console icons are 39×44. At 320 the toolbar's pause and "per-tenant" are clipped.
- **Part 6 (no truncation of copy):** "/v1/event/insights" is ellipsised in the prompt bar on desktop.
- **Part 3 (h1 baseline near 38%):** it sits at about 21%. This is minor, and acceptable for a product hero.
- **Coverage card factual check:**
  - "one solid" is false in ch. 03.
  - "magnetic close ask" was not observed on the hero ask (the close ask was not separately confirmed).
  - "0 console errors" is false on cold loads, but the error is the shared footer's hydration, not this page.
  - "scrollWidth 320 at 320" is true, but content is clipped.

## Fixes (in order)
1. **Make the chapters a stage, not a spreadsheet.** On each chapter, change the object, not one row:
   - 01: the three kinds slide into one table from three stacks.
   - 02: the query bar morphs between PromQL text and builder pills as the main move, with the table dimmed.
   - 03: the table physically grows a column per tick, translating the grid (the Beyond aid made visible), next to a counter of series multiplying.
   - 04: the spike row's bar extends into the hero-style chart with its traces.
   - 05: the query folds into an "alert rule" card.
   - 06: org b and org c rows collapse away.

   Cut the per-chapter scroll from about 720px to about 480px so the scene is 4 screens, not 6.5. On phone, do not render a full `.mt-ch-own` table 7 times. Render the table once at the top of the chapter group with `position: sticky; top: 64px` at about 40svh, or show only the 2–3 rows each chapter is about.
2. **Make chapter 03 hold one solid fill.** Change `.mt-lab-c button[aria-pressed='true']` to `background: #fff; color: var(--ink); box-shadow: inset 0 0 0 1px var(--ink)` (or a #ededed fill with ink text) so the header "View on GitHub" stays the only solid.
3. **Fix the clipping at 320.** At ≤359px, put `.mt-tool` on its own rows ('host pause' / 'q q' / 'split split'), let `.mt-split` scroll (`overflow-x: auto; scroll-snap-type: x proximity`) or reduce the button padding to 0 8px, and wrap `.mt-legend`. Raise phone `.mt-split button` to `min-height: 44px` and `.mt-con-ico` to 44×44.
4. **Show the page's ask on phone after the hero.** Ask the shared-chrome owner (`docs/build-notes/requests/metrics.md`) to swap the header ask to the `data-thumb` label on phone too, as desktop already does.
5. **Break the /o11y template.** Keep the order the content needs, but give /metrics its own closing shape. For example, drop the generic `RelatedCards` full-width contour card and the 250px white band, and put the Logs link as a row inside the black room's console sidebar (it already links `/cloud/logs`). Or end on the hero chart returning small beside "Get Metrics". Bring the close h2 back to 52px or less so it does not out-shout the h1.
6. **Stop truncating "/v1/event/insights".** In `.mt-api`, remove `text-overflow: ellipsis` and `white-space: nowrap`, or move the chip under the bar.
7. **Small fixes.** Make the split tab pill glide (one absolutely positioned pill moved by `transform`, 300 ms ease-in-out). Fill the left column's dead space in the chapters by bottom-aligning the copy to the rail or moving the rail up under the paragraph. Swap the console "Building" spinner for a hollow-to-filled dot.
8. **Site-wide (not this page).** Fix the `FooterHTML` hydration mismatch in the root layout; it puts a red "1 Issue" badge on cold loads.
