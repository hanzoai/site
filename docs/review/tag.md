# /tag — James-eye review
Ready: 7 Nov 22:46, held up next to /api and /affiliate. Phone What-row art no longer collapses into a sliver, the in-focus objects (PR pill, diff, WIMSE token, Built ring) pulse at rest so no screen is still; earlier round already landed the fixed-height thread drawer, tighter sections, Built strip, FAQ in its own quiet section and drawn platform frames. taste/unique/parity OK (168/168, 10/10); 0 console errors, no overlap at 1470 and 375.

Verdict: 7/10
First complaint: "The map's lovely, but why is there a big empty black box under it, then a gap of nothing? And further down it's the same list on the left with a box on the right, twice in a row, then a dark room where everything's shouting at the same size. Tighten it up. It still feels long."

I walked it on 7 Nov 2026 with Playwright (Chromium) against the dev server, recording video.
- **1470x801:** mouse-wheel in 100px notches, 120 ms apart, with a 400 ms dwell and a frame every 400px, top to footer (21 frames).
- **375x812 (isMobile, hasTouch, DPR 2):** scrolled in 100px steps with a frame every 600px (22 frames). I also tapped the map rail.
- **Hover and press:** the hero solid, the WIMSE pill, the docs link, map nodes and the @Hanzo core, the four promise tiles, the "What" rows, the Built tabs, the "see" radios, an FAQ item, the runtime chips, the platform quadrants and the closing asks.
- **Idle:** fresh-load map crops taken 200 ms apart.
- **Console:** 5 fresh loads, the last under reduced motion.
- **Reduced motion:** at both sizes, checking `getAnimations()` after 3 s.
- **CLS:** measured across a full wheel walk.
- **Neighbour:** compared against /slack.

Working files are in /tmp/claude-0/-home-user-hanzo-site/715b2a45-dd44-5306-98d1-bc0b4d91bc34/scratchpad/critic2/tag/.

## What works
- **It sells and moves at once.** The mention map is a real, owned hero object. Rings pulse and the field differs frame to frame within 200 ms of load. Nodes light in story order (1 Code trace, then 2 Loop in design…). Clicking a node swaps the thread panel ("04 / 10 3. Decision"), and the walk resumes on its own after 9 s. The h1 cuts in by line mask. Nothing visible sits above it (the kicker is clipped to 1px).
- **Most of last round's fixes landed.**
  - Row h3s rest at 21px and no longer overprint.
  - The Built panel is a quiet `#f5f5f5` room, not black.
  - The close has one solid ask ("Connect Slack Workspace") with two text links, and the "Get Hanzo Tag" card is quiet.
  - The phone hero demotes WIMSE to an underlined text link, so the map's top shows on the first screen (map top at y=621).
- **Every section now holds an object:**
  - the PR diff card drawing in line by line (Channels);
  - the setup wire ticking 1, 2, 3, then "WIMSE Federated Identity Verified";
  - the "What" stage swapping thread, Canvas+diff and WIMSE token as you scroll;
  - the Built index following scroll;
  - the "Will Hanzo see this?" picker answering in Hanzo's own FAQ sentences;
  - the crosshair with a travelling signal (Platform);
  - the Sigil rings in the close.
- **Good mix of motion kinds:**
  - idle: map, rings, promise cycler, setup wire, picker;
  - scroll: What, Built;
  - pointer: node scale 1.1, core 1.04, More-arrow nudge 4px;
  - state: picker, tabs, FAQ;
  - arrival: line cut-in.
- **Clean and quiet underneath.** The console is clean on 5 of 5 loads; the only warning is motion.dev's reduced-motion notice. CLS is 0.0006 over the full walk. There is no horizontal scroll at 375 (scrollWidth 375). Reduced motion leaves 0 animations after 3 s and shows the final state ("10 / 10 6. Session complete", status "ok") at both sizes.
- **Hover and press answer:**
  - Hero solid: rest #0a0a0a, hover #2c2c2e, press scale .97.
  - WIMSE pill: fills #f2f2f2.
  - Promise tiles: fill #f5f5f5 on hover.
  - What rows, Built tabs, radios and FAQ: press .98.
- **No hue.** `--tg-pink` resolves to grey #9f9f9f.
- **It differs from /slack.** /slack uses a wide h1 with the lede on the right and a full black Slack app window as its hero. /tag has a narrow h1 beside the mention-map diagram, with the "see" picker and the Built index as its own sections.

## What fails (ranked, each with a concrete fix the owner can make in the page's own files)
1. **An empty black slab right under the hero.**
   - The thread panel (`.xtg-moment`) stacks every moment in one grid cell, so it always takes the height of the tallest one, which is the diff. Most moments are one or two messages, so at 1470 it is 322px tall with about 180px of empty black under "Harry Boone … what color should we use?" (frame d-s02).
   - On phone it is worse: about 400px of bare black (frame p-s02), because `@media` line 296 sets `.xtg-moment { height: 400px }`.
   - It is the first thing you see on the first scroll, and it reads as broken.
   - Fix in `Tag.css`: cap the tall moments instead of padding the short ones. In `.xtg-df pre`, show only the 5 changed lines (as `RoomArt` t1 already does), clamp `.xtg-cv` to 2 quotes, and set `.xtg-moment` to about 200px desktop and 220px phone. Better still, dock the moment inside the bottom of the `.xtg-map` card (over the legend strip) so the map and its thread are one object, not a white card plus a black card.
2. **Dead air between sections.**
   - About 300px of blank white after the hero (d-s03).
   - About 300px between the Channels safe line and the Setup room (d-s05/s06).
   - About 120px of empty `#fafafa` above the Setup heading.
   - About 250px after the What rows (d-s11).
   - About 250px before the close (d-s20).

   The hero alone is 1291px tall. "One in, one out" becomes "one in, wait, one in". Fix in `Tag.css`:
   - Cut `.xtg-hero` bottom padding (line 317/377: `clamp(96px,10vw,150px)`) to about 56px, so the next section peeks as MASTER part 3 asks.
   - Use the low end of the section clamp on `.xtg-chans`, `.xtg-setup`, `.xtg-what` and `.xtg-plat` (about 72 to 96px).
3. **The same layout twice in a row, and the same "timer bar" four times.**
   - "What it is" (rows left, stage right, follows scroll) is immediately followed by "Built" (list left, panel right, follows scroll). On desktop they read as one pattern run twice.
   - The thin progress underline is used on the promise tiles, the What rows, the Built tabs and the See radios, so by the fourth it is a template tic.

   Fix in `Tag.jsx`/`Tag.css`:
   - Give Built a different shape, for example a horizontal numbered strip with the panel below (`01 / 06` caption), or a 2x3 sheet whose hover opens the line.
   - Drop the timer bar from `.xtg-quad` and `.xtg-see-l`, and keep it only where scroll drives it.
4. **The dark room is "everything big at once" and says things twice.**
   - Inside `.xtg-see` there are three big heads stacked: the h2 "What can Hanzo Tag see in Slack?" at 32px, the verdict "Reads and responds" at about 42px, and the h3 "Questions" at 38px. The verdict and the h3 are bigger than the section h2.
   - The `.xtg-see-qh` line-height computes to 21.6px on a 38px face.
   - The FAQ then repeats, word for word, the answers the picker has just quoted. The first FAQ item even opens by default, with the same sentence as the first verdict card.

   Fix in `Tag.css`:
   - Set `.xtg-verdict` to `clamp(1.3rem,2vw,1.6rem)` (about 21 to 26px).
   - Set `.xtg-see-qh` to 17px Book with `line-height:1.2`, or make it a 12px Zen Mono caption set *below* a hairline.
   - In `Tag.jsx`, start `A2Faq` collapsed and move the FAQ out of the black room into its own Quiet (#f5f5f5) section after Platform. The black room then holds only the picker, its one moment.
5. **Platform frames are grey wireframe placeholders.** The four `.xtg-frame` thumbnails are bars and boxes in #e5e5e5. They look like skeleton loaders, not product, and James's "lazy look" applies. Fix in `Tag.jsx`/`Tag.css`: draw each surface from data the page already owns.
   - Tag: a 2-line `Msg` of `ASK` at 0.5 scale.
   - Team: the `WINDOW.groups` channel list.
   - Bot: one `SESSION` line.
   - Chrome: the `VIEW` before/after button.

   Or replace them with four Sigil marks seeded per product. Also set `.xtg-cross-i h3` `line-height:1.15`; it is 24px on 21.6px today and will overprint if it ever wraps.
6. **The phone is 17 screens long and the scroll-follow index loses its panel.**
   - scrollHeight is 14,171px at 375.
   - The four promises become a stacked wall of 18px text (p-s04).
   - The Built panel sits under all six tabs, so the active tab changes while its panel is off screen (p-s10).
   - The map's channel labels clip at both edges ("incident-alert" loses its "#", "tryon-3d-lookb…").
   - The bar title truncates to "Slack — Ka…".

   Fix under `@media (max-width: 899px)` in `Tag.css`:
   - Make `.xtg-quad` a horizontal snap rail (`scroll-snap-type:x proximity`, 82% cards).
   - Make `.xtg-idx-l` a sticky horizontal pill rail above the panel.
   - Move `NAMED` labels inward (or hide `.xtg-chan` under 600px).
   - Hide the `WINDOW.title` span on phone and keep only the status chip.
7. **Hover answers are thin in two places.** The platform quadrants (`.xtg-cross-i`) change nothing on hover or press. The runtime chips (`.xtg-rt`) fill on hover but have no press. Fix: on `.xtg-cross-i:hover`, lift the frame's scale to 1.03 and run the cross signal to that quadrant; add `.xtg-rt:active { transform: scale(.97) }`.
8. **Off-deck neutrals in page CSS.** `#0f0f12` (moment), `#fbfbfd` (map), `#9f9f9f` (`--tg-pink`), `#808080` (canvas icon gradient) and `#86868b` are not on the deck ramp. Fix: use `#0f0f0f` or `#171717`, `#fafafa` or `#fbfbfb`, `#a3a3a3` and `#737373` from tokens.

Not counted (shared chrome or dev, not this page's files):
- The red "1 Issue" dev badge appears on `/` as well, so it is not this page's error.
- The phone header keeps "Try Hanzo" after the hero ask leaves view instead of "Set up Hanzo Tag", although desktop swaps correctly.
- The phone cookie card is about 200px; it covers the bottom quarter of every frame until it is dismissed.
- A runtime-chip click navigated away despite a captured `preventDefault` (the shared `A` uses router push).
