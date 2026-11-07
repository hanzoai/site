# /world — James-eye review

Verdict: 7/10
First complaint: "Better, it finally comes in and goes out. But each monitor is a big empty grey box with a little chart in the middle that plays once and then just sits there. The globe's alive, the room isn't. And on my phone it's still six grey cards with a sentence under each."

I walked it live on http://localhost:4180/world/ with Playwright Chromium, re-reviewing after the 16:34 rework of `World.jsx` and `World.css`.
- **Desktop, 1470x801:** a wheel walk in 100px notches at 140ms dwell (video and frame bursts), then a second walk at 400ms dwell through the pinned room. I also settled 1.8s on each of the six monitors.
- **Phone, 375x812** (isMobile, hasTouch): a 100px-notch walk with video and frame bursts.
- **Idle:** 6 frames over 1.2s from first paint, with no input.
- **Hover and press:** computed-style diffs on the hero ask, Documentation, pause, rail stops, monitors, topology nodes, the replay scrub and Copy. I also clicked a rail stop and checked that it jumps.
- **Reduced motion:** checked at both sizes (`getAnimations`, a still-frame check).
- **Overflow:** a scrollWidth and clipping sweep at 375.
- **Console:** 9 fresh loads in total.

Working files are in /tmp/claude-0/-home-user-hanzo-site/715b2a45-dd44-5306-98d1-bc0b4d91bc34/scratchpad/critic2/world/.

## What works
- **The first screen sells and moves.** The h1 is 52px with nothing above it, and "world.hanzo.ai" sits below it as a mono caption. The lede, the ask and the dotted globe are all alive. Arcs draw to ringed GPU hubs, and the latency panel ticks. 5 of 5 frames in the first 1.2s differed with no input. It is monochrome.
- **The control room is now a real stage.** It pins on desktop, and scroll swaps which monitor is on air: one large monitor, while the others leave upward and arrive from below with a clip. The left side holds a 64px figure that rolls 01 to 06, and a numbered rail whose hairline fills with progress. This is the "one in, one out" James asked for, and it reads as Apple-like.
- **Each monitor's drawing plays once as it arrives:**
  - the topology draws in, then its nodes appear;
  - the latency bars grow, then the spike blips;
  - the drift line draws, then its alert dot pops and blinks;
  - the v2 eval bar fills, then "pinned" appears;
  - the multi-cloud chips gather into "One unified view";
  - the replay track staggers in.
- **Every control answers:**
  - The hero ask changes fill to #e4e4e7, leans magnetically (translate 3.6px/1.25px measured) and scales to 0.985 on press.
  - Rail stops slide their title 6px on hover and scale to 0.98 on press. Clicking stop 05 smooth-scrolls the stage to monitor 05.
  - Hovering a monitor draws the hairline across its header.
  - The topology's kai and zen nodes flip to ink and relight their path.
  - The replay range steps by arrow key and by click, and the "n / 6" readout crossfades.
  - Pause freezes the globe (verified with a pixel-identical frame) and sets aria-pressed.
- **The replay labels no longer truncate.** "model output" wraps to two lines in the tile.
- **Reduced motion is right.** The room un-pins into the stacked grid with all six monitors on and whole, there are 0 running animations, and the frame is still, at both sizes.
- **There is no horizontal scroll at 375** (scrollWidth 375). The globe's 8px bleed is clipped on purpose.
- **The phone first screen holds** the h1 (40px), the lede, the primary at y=280, and the globe from y=308.
- **The console was clean** on 7 of 9 fresh loads. Copy put exactly the displayed prompt on the clipboard.

## What fails (ranked, each with a concrete fix the owner can make in the page's own files)
1. **The monitors are empty stages with small, dead-after-arrival drawings.** The on-air monitor is about 690x660, but the Latency bars, the Eval bars and the Multi-Cloud chips are only 90 to 130px tall, floating in the middle of grey. After their arrival beat (about 1.5s), nothing on the stage moves until you scroll again. So scale has no rhythm inside the room (a big box, a small object), and the room fails "idle and ambient". Fix in `World.jsx` and `World.css`:
   - Size each drawing to the stage: `.pinned .wd2-lc i { height: 14px }` with 24px row gaps, `.pinned .wd2-ev i { height: 64px }`, `.pinned .wd2-mc li { font-size: 21px; padding: 16px 22px }`, and let `.pinned .wd2-pic` centre a drawing that fills about 70% of the height.
   - Give the on-air monitor one idle beat, gated on `on` and paused when hidden, using the existing `useTick`:
     - Latency: re-randomise the bar widths every 1.2s, like the hero panel.
     - Drift: the alert dot pulses slowly.
     - Eval: the v2 score bar nudges.
     - Replay: auto-advances one step every 1.5s until the visitor touches the range.
2. **The phone room is still a document:** six stacked grey cards, each with an h3 and a two-line sentence. The cut-ins play, but it scrolls like a list. Fix: under 900px, turn `.wd2-grid` into a horizontal snap rail (`scroll-snap-type: x proximity`, cards at 84vw for a 16% peek) with the rolling `01 / 06` figure above it. Alternatively, keep the stack but show `.l2-body` only on the card in view (fade the others to just the h3), so one card speaks at a time.
3. **Dead air in the pinned left column.** About 200px of blank space sits between "See Every Model, Everywhere" and the 64px figure, because `.pinned .wd2-side` uses `justify-content: space-between` and the count has `margin: auto 0 32px`. The heading floats alone at the top of an empty half-screen. Fix: drop `margin-top: auto` on `.wd2-count` and set the figure 44px under the h2. Then sit the rail directly below it, and let the column bottom-align as a block (`justify-content: flex-end`), so the heading, figure and rail read as one unit beside the monitor.
4. **The hero hand-off is invisible.** The globe stays `transform: none` until y=600 and only reaches scale 0.977 at the hero's end. Nobody sees the "goes out". Also, the panel's bottom edge sits at 809px, cut by the 801 fold. Fix: start `box.current.a` earlier (`end - innerHeight * 1.4`), so the scale-down and rise run across the last 60% of the hero. Set `.wd2-world { height: min(600px, 72svh) }` so the panel clears the fold.
5. **The drift alert dot reads as a smudge.** At rest, the `.al` circle is #a3a3a3 sitting on top of the 2px ink line on #f5f5f5. It looks like a grey blot, not an alert. Fix: make it a hollow ink ring (`fill: #f5f5f5; stroke: var(--ink); stroke-width: 2`) at the line's end point, pulsing with the blip.
6. **Brief two-monitor overlap on quick flicks.** On fast wheel bursts, a frame or two shows the outgoing and incoming captions half-faded on top of each other (for example, "Hanzo Cloud" over the v1 bar). This happened in 3 of 34 frames at 400ms dwell. Fix: drop the `.1s` `transition-delay` on `.pinned .wd2-mon.on`, give the outgoing monitor `opacity .15s`, and hide `.wd2-cap` on the non-active monitor immediately (`.pinned .wd2-mon:not(.on) .wd2-cap { visibility: hidden }`).
7. **An intermittent hydration warning.** 2 of 9 loads logged "A tree hydrated but some attributes… didn't match" and showed the red "1 Issue" badge. Both coincided with another page's compile error (Skills.jsx), and it did not reproduce on 7 clean loads. Re-check after the tree is green. If it persists, the `Replay` range is already mount-gated, so look at the inline `style` that `useMagnet` writes on the hero ask.

**Shared, not counted:**
- On a first visit at 1470x801, the cookie bar covers the on-air monitor's caption.
- The StageHero "Documentation" link shows no measurable computed change on hover.
- The Finale Copy button still read "Copy" 400ms after a successful copy, which may be a timing issue in the probe.
- The shared header gains a top progress line while scrolling.
