# /world — James-eye review

Verdict: 7/10
First complaint: "The globe's lovely and the room finally moves one thing at a time. But look at Eval Dashboards: it's a grey brick and a black brick. Latency is three grey bars with no labels. And Multi-Cloud has a big black slab that looks like a button. It reads unfinished, not premium."

I walked it live on http://localhost:4180/world/ with Playwright Chromium (third pass, after the rework that added idle beats, the phone rail and the earlier hero exit).
- **Desktop, 1470x801:** a mouse-wheel walk in 100px notches with 110ms dwell, top to footer, with a recorded video and a frame every 4 notches. I then ran frame bursts at 80ms through the monitor 01 to 02 swap, and settled on each monitor via the rail.
- **Phone, 375x812** (isMobile, hasTouch, DPR 2): a 100px-notch walk with video and frames. I then swiped the room's snap rail through all six cards, checking the rolling counter at each stop.
- **Idle:** frames at 300ms and 1000ms after first paint, plus a 14-frame arrival burst at 100ms intervals, with no input.
- **Hover and press:** computed-style diffs on the hero ask (hover, press, release off the button), Documentation, Pause, the rail stops, the topology nodes, the replay scrub (drag, then a 3s hold) and the Finale Copy.
- **Reduced motion** (1470): `getAnimations()`, a still-frame check, and the stage and panel geometry.
- **Overflow:** scrollWidth at 375 and 320.
- **Console:** about 20 fresh loads across 5 browser launches.

Working files are in /tmp/claude-0/-home-user-hanzo-site/715b2a45-dd44-5306-98d1-bc0b4d91bc34/scratchpad/critic3/world/.

## What works
- **The first screen sells and is alive within 1s.** The h1 "Hanzo World" is 52px (40px on phone) with nothing above it, and "world.hanzo.ai" sits below it as a mono caption. Next come the lede and one light-filled ask with a text link. The dotted globe turns, arcs draw to ringed GPU hubs, and the latency panel ticks. The 300ms and 1000ms frames differ with no input. It is monochrome throughout.
- **The hero now visibly hands off.** The stage holds about 400px of scroll, and across its last stretch the globe slows, shrinks toward 0.9 and rises. The panel clears the 801 fold (its bottom is at 792).
- **The control room is the Apple-style pinned stage.** One large monitor is on air at a time. The 64px figure rolls 01 to 06, and the numbered rail's hairline fills with progress. Clicking rail stop 05 smooth-scrolls to Multi-Cloud. This is "one comes in, one goes out" at last.
- **Idle beats on the monitor on air:**
  - the topology route swaps zen and kai every 2s;
  - the latency bars re-draw in their lanes;
  - the drift ring pulses;
  - v2 nudges;
  - the sources signal in turn;
  - the replay steps itself, and it held at "6 / 6 model output" for 3s after I dragged it, so touching it stops it.
- **Every control answers, with no layout jump:**
  - The hero ask leans magnetically (8px, -4.5px measured), darkens its fill and scales to 0.98 on press. Releasing off the button does not navigate.
  - The Documentation arrow nudges 4px.
  - Rail titles slide 6px and turn ink.
  - Hovering the kai node relights its path and sets aria-pressed.
  - Pause freezes the globe (pixel-identical frames) and sets aria-pressed.
- **The phone room is a rail now, not a document.** Cards are 293px wide with about a 16% peek and `scroll-snap-type: x`. The 01 / 06 figure rolls with each swipe (checked at all six stops), and each card plays its moment as it arrives.
- **There is no horizontal scroll** at 375 (scrollWidth 375) or at 320 (scrollWidth 320). The globe's 8px bleed is clipped on purpose.
- **The phone first screen** holds the h1, the lede, the primary (bottom at y=328) and the globe from y=308, with the panel below it.
- **Reduced motion:** 0 running animations after 3.5s and a still frame. The room un-pins into a stacked grid with all six monitors on.
- **Copy** put exactly the displayed prompt on the clipboard.

## What fails (ranked, each with a concrete fix the owner can make in the page's own files)
1. **Three of the six monitors look like placeholders, not product UI.**
   - **Eval Dashboards** is two flat slabs, a grey 68% and a black 82%, each 64 to 104px tall with radius 14. It reads as two bricks, not a dashboard.
   - **Latency + Cost** is nine unlabelled grey and black bars. The hero panel labels P50 / P95 / P99, but this monitor does not, so it means nothing on its own.
   - **Multi-Cloud** ends in a full-width `#0a0a0a` "One unified view" slab. In a viewport where the header's "Try Hanzo" is already the solid fill, it reads as a second solid button.
   - The overcorrection from the last review (bigger objects) went to "big boxes", not "a real monitor".

   Fix in `World.css` and `World.jsx`:
   - Evals: thin the bars to 14 to 18px (`.pinned .wd2-ev i { height: 16px; border-radius: 8px }`). Show the two as score rows with a tabular mono value at the bar end, using the same `rnd` beat, and a 1px baseline tick.
   - Latency: reuse the hero panel's `em` P50/P95/P99 labels on each lane (`.wd2-lc i::before`, or a small mono row over the three bars) so it reads as a chart.
   - Multi-Cloud: make `li.one` an outlined or hairline frame (`background: transparent; box-shadow: inset 0 0 0 1px var(--ink)`) or an ink rule with the label above it, not a filled slab. Then the room has no solid fill.
2. **Under reduced motion, the hero object overlaps the next section at 1470x801.** The stage shrinks to 625px (it ends at y=685), but `.wd2-world` stays `min(590px, 70svh)`. The latency panel and the bottom of the globe hang 60px past the black stage onto the white room, and the globe is cut by the section edge (rm-hero.png). That is the "overlap" fail. Fix: in `World.css`, add `@media (prefers-reduced-motion: reduce) and (min-width: 901px) { .wd2-world { height: min(520px, 62svh); } }`, or give the stage's hero object a `margin-bottom` equal to the overhang, so the panel ends inside the dark room.
3. **Ghosting on every monitor swap.** In the plain 100px-notch walk, 2 of 16 frames caught both monitors half-faded on top of each other. Frame s024 shows the 02 and 03 headers stacked over a washed-out latency chart. Frame s028 shows the v1/v2 labels over the drift line, with the caption text bleeding through. At normal scroll speed you see a muddy crossfade, not a cut. Fix in `World.css`:
   - Make the outgoing monitor leave fast and alone: `.pinned .wd2-mon:not(.on) { transition: opacity .15s var(--eo), transform .3s var(--eio); }`.
   - Delay only the incoming one's opacity by about 120ms.
   - Hide the outgoing caption and header at once: `.pinned .wd2-mon:not(.on) :is(header, .wd2-cap) { visibility: hidden; }`.
4. **Three numbering systems say the same thing.** On desktop the left column shows the 64px "01 / 06" figure and the rail's "01 Live Topology", and the monitor itself shows "01 / 06" in its header. That is three counters for one fact. It is clutter, and it is one more grey mono line on a quiet stage. Fix: drop the monitor's own `<header>` counter while pinned (`.pinned .wd2-mon header span { display: none }`), and keep its hairline as the progress line. The phone rail still needs it, so keep it under 900px.
5. **Multi-Cloud's first row is three equal boxes.** Hanzo Cloud, AWS and GCP sit as three equal white tiles in a row, which is a banned tell, with Azure and self-hosted as two below. Fix: let the chips size to their text (`flex: none`, left-aligned, wrapping), or stagger them on the `GATHER` offsets so they never form a 3-up grid.
6. **The phone cards are mostly empty.** Every card takes the height of the tallest (Replay), so Drift, Evals and Latency show a small drawing at the top and about 250px of blank grey above the caption (p-rail2.png). Fix: under 900px, set `.wd2-pic { min-height: 0; flex: 1; align-items: center }` and `.wd2-mon { display: flex; flex-direction: column }`, so each drawing centres in its card. Alternatively, cap the rail card height and scale the Replay track down.
7. **The hero panel holds a dead strip for two thirds of the time.** About 90px under "enso" is reserved for the drift line, which shows only on beats 6 to 8 of 9. Most of the time the panel has an empty black bottom (desk-t1000.png, phone-t1000.png). Fix: keep the drift line always present, in grey at white 30% when idle and white at 92% when firing. Alternatively, fold its slot into the bottom padding and let it rise in with `clip-path` when it fires.
8. **An intermittent hydration warning** ("A tree hydrated but some attributes… didn't match") showed the red "1 Issue" badge on 2 of about 20 loads, both on the first load of a cold browser at `domcontentloaded`. It did not reproduce on 6 targeted cold loads. The trace stops at `__next_root`, so it cannot be pinned to this page. If the owner can reproduce it, check that `useMagnet`'s inline `translate` and the `useMedia` branches only ever run after mount.

**Shared, not counted:**
- On a first visit the cookie bar covers the on-air monitor's caption at 1470x801, and covers half the room at 375x812.
- The shared StageHero fades its asks in. They are still at about 30% at 1.0s on a cold dev load (a-02.png), and the hero is pure black for the first ~700ms on a cold dev compile.
- The header's ask is "Try Hanzo", not "Open World Monitor". The page sets `data-ask="off"`, so the page's own ask never reaches the header or the ask bar. Check with the header owner whether that matches part 4.
- The header bobs by a few px and grows a top progress line while scrolling, and its glass shows the room's h2 bleeding through on phone.
- The Finale Copy button still read "Copy" 300ms after a successful copy.
