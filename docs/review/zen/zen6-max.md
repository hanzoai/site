# /zen/zen6-max — James-eye review

Verdict: 6/10
First complaint: "The film slides over the name while I scroll. 'Max' and the line under it are sitting on top of the video. Then I get four lines of text with nothing to look at, and big empty white gaps. It's a nice rack, but the start feels broken and the middle feels like a document."

Walked with Playwright (Chromium), moving, on 7 Nov 2026:
- **Desktop, 1470x801.** Wheel-scrolled in 100px notches with about 110 ms dwell, top to footer, with a frame every 4 notches. Recorded on video. Then exact scroll stops at 300, 600, 900 and 1200 through the hero settle.
- **Phone, 375x812** (isMobile, hasTouch, DPR 2). Same walk in 100px steps, plus tapping the rack's planning chips.
- **Controls.** Hovered and pressed every one, measuring computed style before, during and after: hero ask, "Run it on your own GPUs", film pause, promise rows, the B300/B200 radios, the planning chips, the sheet column headers, source links and the "Around the servers" drawer. Opened the drawer and switched the sheet to B200. Moved the pointer across the close Sigil.
- **Checks.** Idle motion inside 1 s, reduced-motion final state (`getAnimations()` after 3 s), horizontal scroll, element overlap, and the console across 8 fresh loads.

Working files: /tmp/claude-0/-home-user-hanzo-site/715b2a45-dd44-5306-98d1-bc0b4d91bc34/scratchpad/critic/zen6-max/

## What works
- **The first screen sells.** The name, lede and "Talk to sales" sit over a full-bleed black Zen film. The h1 cuts in by line mask and the film is playing inside 1 s with no input (frames at 150 ms and 1000 ms differ). Monochrome throughout, and nothing sits above the h1.
- **The rack chapters are the real signature, and they are good.** It is a pinned dark panel with a `01 / 04` counter. Servers slide in, then the count runs to 9,216 GB. The GPUs split into pools, and a twin rack lands across a dashed failure-domain line, one change per step. It reads like an Apple pinned scene, which is the right reference for an enterprise rack.
- **The B300/B200 sheet is a proper Beyond.** Picking a column header tints the column and switches the rack. The two totals sit over their columns as the one big figure on that screen. The drawer opens with a rotating plus and a two-column list.
- **The close** has a Sigil field that bends to the pointer beside one ask, which is a quiet, correct ending.
- **It is clean.** No horizontal page scroll at 375. Reduced motion lands on the settled stage with 0 running animations after 3 s. Press states exist everywhere (scale 0.97 to 0.98, or translateY 1px).

## What fails (ranked, each with a concrete fix the owner can make in the page's own files)
1. **The hero settle runs the film card over the h1 and lede (overlap on the first screen while moving).**
   - At scroll 600 on desktop, the shrinking `.zx-card` covers "Max" and "deep reasoning, long context, and code" (see `desk-stage-600.png`). The blend mode keeps the text legible but visibly colliding.
   - **Fix in `ZenMax.css`, `.zx-stage-pin` / `.zx-card` transforms driven by `--k`:**
     - end the card's resting box above the h1 (top row, columns 6–13, bottom edge at least 27px above the h1 cap height); or
     - move the h1, lede and asks out as the card arrives (translateY on `.zx-stage-b` keyed to the same `--k`), so the two never share pixels between k = 0.2 and 0.8.
   - Also put the pause button inside the card's corner at every `--k`. At rest it floats alone in white space under the card (frame at scroll 1200).
2. **Promises is a dead section and reads as a document.** It holds four h2 rows of 26px headings plus 21px sentences, with no visual object (`.zx-prom`, 774px tall).
   - **Fix in `ZenMax.jsx` `Promises()`:** keep the words and give the section one object that changes per row. Options from facts on the page:
     - one small router drawing, where "One name" fans into the specialists, a request lights its configuration, a long bar shows context, and a terminal line shows tools;
     - a sticky panel on the right that swaps per row as each row reaches mid-screen, the same IntersectionObserver as `Chapters`.
   - Drop the lede-size 21px `p` to 17px so the four rows are medium, not all big.
3. **Long empty white scroll.**
   - The stage is 1922px tall. After it settles there is about a full screen of blank white before "One name" (frame s016).
   - There is another blank band between "On your own premises" and the rack (frames s028–s032).
   - **Fix in `ZenMax.css`:**
     - cut `.zx-stage` height so the settle ends as the promises arrive (use `offset: ['start start','end end']` over roughly 140svh, not 240svh);
     - pull `.zx-ch` up so the panel overlaps the dep head by 40px (MASTER part 3, "old and new overlap by 40px").
4. **Phone shows two solid fills and two different asks on the first screen.** The header shows "Try Hanzo" (solid black) while the hero shows "Talk to sales" (solid). On desktop the header switches to "Talk to sales" after the hero; on phone it never does.
   - **Fix:** in the page, set the header ask for this route to the hero's label ("Talk to sales") at all widths. Make it quiet while the hero ask is visible, so only one solid fill is on screen. If the header ask is shared chrome, file `docs/requests/zen6-max.md` and meanwhile make the hero `Cta` the only solid on phone.
5. **Hover barely answers.**
   - The hero ask goes from `#f5f5f5` to `#fff`, which is invisible on the film.
   - The pause button has no hover at all.
   - Promise rows have no hover.
   - The sheet column header only greys its text.
   - **Fix in `ZenMax.css`:**
     - hero ask: invert to ink with a 1px white ring on hover, or add a 22px magnetic pull (fine pointer only);
     - pause: fill white 10% and grow the ring;
     - sheet `.zx-col:hover`: preview the column tint and swap the big figure above it (a number, per JAMES rule 4);
     - promise rows: a hairline that draws across on hover.
6. **The phone rack's planning chips are clipped mid-word.** "Isolate…" is cut at the card edge, and the row overflows to 629px inside a 343px card with no peek or affordance. `.zx-srv` also pokes 7px past the viewport (right edge 382).
   - **Fix in `ZenMax.css` `@media (max-width: 899px)`:** wrap `.zx-plan` onto two lines (`flex-wrap: wrap`), or make it a snap rail with a 14–18% peek and edge fade. Clamp `.zx-racks` to `max-width: 100%` with `min-width: 0` on `.zx-slot`.
7. **One console error was seen.** On the first walk, a React hydration-mismatch error and the red "1 Issue" badge appeared at both sizes. It did not reproduce in 8 later fresh loads, so it may be dev-server churn.
   - **Fix:** re-check `Count` (render the final value on the server and the first client paint) and `Sigil` (seeded, with no `Math.random` during render), then confirm 0 errors in a clean load.
8. **Minor.** The rack and sheet are the only two "big figure" moments, and both say 9,216 GB, so the second repeat costs the sheet its punch. Consider letting the sheet lead with the B200 figure growing in when B200 is picked, rather than both totals resting at full size.
