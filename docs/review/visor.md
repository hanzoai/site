# /visor: James-eye review

Walked 7 Nov 16:28–16:39 UTC on the dev server (main @ `5f1d36e`, last page commit "whole fleet console on the first screen, reserved rows"). I walked it moving at 1470×801 and at 375×812 (touch): slow scroll in 0.7-screen steps, a 2.4 s untouched dwell on every screen, hover and press on every control, a PerformanceObserver for layout shift, the h1 box tracked every frame, and console capture. I also checked reduced motion, JS off at both widths, 320 and 375×667, and a Tab crawl. `scripts/motion.mjs /visor` filmed both widths (`shots/visor/`). The site loader was skipped and the cookie card was rejected after the first frame. Proof frames are in the critic's scratchpad.

Verdict: 7/10
First complaint: "The top's right now. I can see the whole thing: one request, three clouds, the machines landing. But scroll past it and it's six dark boxes in a grid. Once they've drawn themselves nothing happens, so it's a document again. And the ending is the same 'Get started with Hanzo…' block as every other page, with nothing of Visor in it."

The cap: the coverage card makes three claims the page does not bear out (see question 9). A false claim caps the page at 7, and the page would not clear 8 without that cap either.

## Since the last review (6/10)
- **Fixed:**
  - The whole console is on the first screen at 1470×801. "launch 3 × GPU instance · prefix train", all three providers and the full inventory are readable from the first frame.
  - The inventory reserves its rows. CLS is now 0.0035 on desktop and 0.005 on phone (it was 0.088).
  - "Name a fleet" is gone, and nothing sits above any headline.
  - The tiles are 01 wide, 02|03, 04|05, 06 wide, with no row of three.
  - The words on the chips are ink on white.
  - Each tile's picture plays once as it arrives and plays again on hover.
  - The card is the kit Sheet: focus stays inside it, Escape closes it and focus goes back to the tile.
  - The hero has a 47px pause control, and pausing really freezes the sequence (state identical 4 s apart).
  - "Deploy to Cloud" is 44px tall.
  - Phone shows all three providers as rows.
  - Headings rest at 52 / 26 / 17, with "quote" at 64.
  - The coverage card exists.
- **Still open:**
  - The tile room is a document.
  - The close is the shared `Finale` with no object.
  - The first screen is still /sentinel mirrored.

## The 11 answers
1. **Sells in 5 s, moves within 1 s?** Yes on desktop, and only partly on phone.
   - **Desktop:** the h1 box sets once at 230–400 ms (845,358, 466×60) and never moves. Within the first 1.5 s, 10 of 15 frames change: the providers light "cached and priced", AWS takes the ink border, the dry-run line flashes, train-01 to 03 land, and the SSH tab goes dark with the caret. The whole console is in view.
   - **The flaw on desktop:** the line "dry run · quote returned · spends nothing" sits at 30% opacity for 17 of 20 samples. That is #4d4d4d at 0.3 on #f5f5f5, about 1.6:1, so most of the time it reads as a smudge.
   - **Phone:** the h1 (40px) cuts in, followed by the caption, the lede, "View on GitHub" (bottom at 388 on a 375×667 screen) and the request card. motion.mjs marks phone screens 1, 2 and 4 STILL. The machines land below the 812 fold, so above it only the provider rows light.
2. **One in, one out, or a document?** The hero is a scene, and the rest is a document.
   - **The hero:** it pins, and the console slides right from x 27 to x 160 as you scroll (s0 → s1).
   - **The tile room:** a 26px heading and six tiles in a 2-column grid, with nothing pinned and nothing exchanged. It reads top to bottom: s3 tile 01, s4 tiles 02–05, s5 tiles 04–06, then about 160px of empty black.
   - **The naming tool:** one quiet light screen that names its batch 01 → 02 → 03 on arrival.
   - **The close:** "Get started with Hanzo Visor" plus "Paste and ship", then "Get Visor".
   - Phone is a column of six 280px cards, which is right at that width, but it is still a list.
3. **A real object in every section?** Yes, but the tile pictures are small on big dark boxes.
   - **Hero:** the fleet console, at full size.
   - **Tile room:** each picture is real (bars, chips, a pool, "quote", RDP/VNC/SSH with a caret, audit rows).
     - On desktop they fill about a third of a 320px tile. Tile 01 is a 1150px-wide box with three thin bars, and tile 06 has two rows and a lot of black.
     - After arrival only the caret moves: dwell s4 6/6 is the caret plus the arrival; phone s6 and s7 are 0/6.
   - **Naming tool:** good. "−" and "+" step 3 → 4 → 2, the rows enter and leave with layout reflow, the prefix retypes the names ("gpu-01", "gpu-02"), and "launch" swaps the line to "metered against the organization · per provider".
   - **Close:** a text prompt only. Unlike /sentinel, /telemetry and /tunnel, Visor passes no `object` to `Finale`.
4. **One ask, sticky; nothing floating; scale with rhythm?** Yes, mostly.
   - **The ask:**
     - There is one solid button per screen: "View on GitHub" in the hero (`data-cta="primary"`, `data-thumb`, `target=_blank` with `rel`) and again in the close.
     - Between them the only solid is the header's "Try Hanzo".
     - No ask bar shows, and nothing floats at either width (the only fixed element besides the header is the cookie card, until it is rejected).
   - **Scale:** one big thing per screen.
     - Desktop: h1 52; tile room 26 + 17; "quote" 64; count 44; close 32 + 26.
     - Phone: h1 40.
     - The weak spot is the close, which carries two headings (32 and 26) on one screen.
5. **Every hover and press answers?** Yes.
   - "View on GitHub": hover #0a0a0a → #2c2c2e, press 0.98.
   - Tiles: hover #171717 → #262626, the "+" disc fills #fafafa with a black "+", and the picture replays. Press is 0.97.
   - "Fewer" and "More": the border goes to ink on hover, press 0.97.
   - "dry run" / "launch": hover adds a 55% white fill and ink text.
   - "Copy": "Copied" holds for 1.6 s.
   - Pause: `aria-pressed` toggles.
   - The sheet's Previous and Next step 02 → 03.
   - motion.mjs logged 7 "dead" hovers on desktop (tiles 02, 04, 05, Fewer, prefix, the close ask, Copy). Computed styles and frames show the tiles and Fewer do change. Its pixel threshold misses the #171717 → #262626 step, which is a sign that the hover is faint.
6. **Overlap, font swap, layout shift?** None of the three.
   - No overlap at either width. The pause button sits clear of the command text.
   - Overflow is 0 at 1470, 375 and 320.
   - The h1 box never moves, and Zen and Zen Mono load with no swap seen.
   - CLS is 0.0035 on desktop (0.0026 from `.vs2-name-r` when the batch names itself) and 0.005 on phone (the provider `em` labels).
   - 0 console errors from this page at either width.
     - One walk showed a red "1 Issue" hydration badge. It was Playwright's screenshot caret-hiding injecting `caret-color` into the prefix input. With `caret: 'initial'` it does not occur.
     - Another chat's broken `UiPage.jsx` HMR errors appeared in one session and are not this page's.
7. **Which reference, and is its motion there?**
   - **apple.com:** the pinned hero with the product settling as you scroll. Yes.
   - **motion.dev:** the inventory layout reflow. Yes.
   - **synchronized.studio:** no. The tile opens a side drawer from the right on desktop and a bottom sheet on phone. The tile's title and picture are redrawn, not carried across.
   - **anthropic.com launch:** no hero figure.
8. **Different from its neighbours?** Only by its middle.
   - The first screen is still `StageHero look="side"`, the same as /sentinel, with `flip`: a 52px title on one side and a live panel on the other, with a mono caption under the h1.
   - The close is the shared `Finale` ("Get started with Hanzo X / Paste and ship / Get X / License chip / hanzoai / Deploy to Cloud"), the same as /sentinel, /telemetry, /tunnel, /world, /search and others. Here it is barer than theirs because it has no object.
   - **What is Visor's own:** the launch console and the naming tool.
9. **All 18 parts covered?** The card has all 18 headings with a `Done here:` line, but three claims are false on the page:
   - **Part 6:** "0 runs under 13px on desktop (mono capitals excepted)". Measured: 3 lowercase Zen Mono runs at 12px in the hero ("cached and priced", the "train-01" console tab, "launched · console opened · org · project"). They are lowercase, so the mono-capitals exception does not cover them.
   - **Part 4:** "[x] Sticky ask in header and bar after the hero, same label". The header's ask is "Try Hanzo" and the hero's is "View on GitHub", and the bar is off (`data-ask="off"`). The tick claims a bar and a matching label, and neither is there.
   - **Part 8:** "[x] Dialogs are native". The open card is a `DIV role=dialog` (`:modal` is false), not `<dialog>.showModal()`. It does keep focus (a Tab cycle of Previous → Next → Close) and returns it to the tile, so the behaviour is right but the claim is not.
   - **Overstated (Part 12):** "Lowest measured text contrast 6.67:1". That holds for the settled state. The dry-run line spends about 85% of the loop at about 1.6:1, and the providers start at 45% opacity. Both are `aria-hidden`, but James sees them.
10. **Banned tells?**
    - None of the hard ones: 0 hues (`taste.py` OK), nothing above any headline, no floating pill or cursor label, no opacity-only hover, no `title=` tooltips, no springs, no Inter, no gradient text.
    - **A dead stretch:** the tile room is dead once its arrivals finish. A caret is its only mover.
    - **Close to "one template":** the close.
11. **Copy untouched?** Yes.
    - Parity is 29/29 text and 2/2 links.
    - The demo labels are lifted from Hanzo's own sentences.
    - Hanzo's "Volumes and images" is used twice as a heading (tile 02 and the naming tool's h2). Those are the same words, but a heading now appears where the live page has only a tile.

## Missing from the 18 parts (measured)
- **Part 1, Strategy and conversion:** the `V2: 8/10` in `Visor.jsx` is the builder's own score. The critic's is 7.
- **Part 3, First impression:**
  - Under 900px the hero's best moments (machines landing, the SSH console) happen below the 812 fold, so the phone's first screen barely moves.
  - At 1470×801 the next section does not peek above the fold.
  - Cards do not open by Morph; they open a drawer.
  - The close has two headings.
- **Part 4, Conversion system:** no sticky ask with the hero's label (see question 9). Either name the header's "Try Hanzo" as the sticky ask on the card, or say why the bar is off. Do not tick "same label".
- **Part 6, Content:**
  - 3 lowercase mono runs at 12px on desktop.
  - The audit line wraps to leave "· project" alone on the last line at 1470.
  - Only the open tile's paragraph is in the live DOM (the others are in `<noscript>`), so find-in-page cannot reach five of Hanzo's six paragraphs. MASTER asks for `hidden="until-found"`.
- **Part 8, Components:**
  - The Sheet is not a native `<dialog>`.
  - The prefix input's focus is a 3px black-12% box-shadow plus an ink border, not the one 2px ink ring with white halo.
  - "View on GitHub" presses to 0.98 (the kit's), not 0.97.
- **Part 9, Motion:**
  - After the hero no scene changes with scroll, and the tile room has no idle life beyond a caret.
  - Three carets blink forever (hero console, tile 05, close prompt) with no pause of their own. The hero's pause stops its sequence, not the tile caret.
- **Part 12, Accessibility:** the 1.6:1 dry-run line for most of the loop, and the providers at 45% opacity.
- **Part 13, Performance:** JS and CSS budgets are not measured (the card says so).
- **Passing:**
  - one h1 and one `main#main`;
  - JS off is legible at both widths (0 hidden runs, the six tile paragraphs in `noscript`);
  - reduced motion shows the final frame with 0 running animations;
  - the primary ask is above the fold at 375×667 (bottom 388);
  - no horizontal scroll at 320;
  - 0 targets under 44px on phone;
  - CLS 0.0035 / 0.005;
  - 0 console errors;
  - parity 29/29;
  - `taste.py` OK.

## Fixes (in order)
1. **Make the tile room one thing in, one thing out.** Pin the dark room on desktop (stack under 900px, as now).
   - Show one tile's picture large at the left of the stage and the six titles as a numbered list (`01 / 06`) at the right.
   - As you scroll, or after about 4 s idle while in view, the next title takes the ink fill and its picture swaps in, played at full size.
   - Tapping a title still opens the Sheet with Hanzo's paragraph.
   - That gives one big object per screen instead of six two-thirds-empty boxes, and the room is alive without input.
   - If a pin is too much, at least grow each picture to fill its tile (tile 01's bars across the full width and 3× thicker, tile 06's three rows filling the height) and stop the room from going dead after arrival.
2. **Give the close a Visor object.** Pass `object={<…/>}` to `Finale`, as /sentinel, /telemetry and /tunnel do.
   - The obvious one is the settled inventory from the naming tool: the prefix the visitor typed and their count, showing the batch they named.
   - That puts Visor's own thing in the close instead of the generic prompt alone.
3. **Fix the false claims on `docs/coverage/visor.md`:**
   - Part 6: raise `.vs2-prov em`, `.vs2-con p` and `.vs2-audit` to 13px, or say they are 12px.
   - Part 4: untick "bar … same label" and write what is true: the header ask is "Try Hanzo", and the bar is off by the 15:00 note.
   - Part 8: write "kit Sheet (div role=dialog, focus held and returned)", or ask the Sheet owner for native `<dialog>` in `docs/requests/visor.md`.
   - Part 12: re-measure contrast across the loop, not only at rest.
4. **Lift the hero's resting greys.**
   - Rest `.vs2-dry span` at `opacity: .6` or more, or at full `#737373` (4.5:1 on #f5f5f5 needs #525252), and keep the flash as the ink step.
   - Start `.vs2-prov` at 0.7, not 0.45.
   - Give `.vs2-audit` `grid-column: 1 / -1` so "· project" does not wrap alone.
5. **Make the phone's first screen move.** Under 900px, run the machines' arrival inside the fold. Either reorder so the inventory sits right under the request card, with the providers as one compact row of three chips, or start the sequence at the step where train-01 lands. Something product-shaped then moves in the first 812px.
6. **Set the hero apart from /sentinel.** Pick a `StageHero` look no Cloud 4 neighbour uses (not side, split, rise or frame), or let the console be the full-width object with the title over its top edge. The left/right split must not be the first thing both pages say.
7. **Small control fixes:**
   - Give the prefix input the one focus ring (2px ink, white halo) and drop the box-shadow.
   - Let the hero pause also stop the hero caret.
   - Make the tile hover read at a glance. The #171717 → #262626 step is too faint for the filmer, so let the "+" disc fill plus the picture replay carry it, and lift the tile title to ink-white on hover.
   - Keep the six paragraphs findable with `hidden="until-found"` copies.
