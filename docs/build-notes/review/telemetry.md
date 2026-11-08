# /telemetry: James-eye review (round 3)

Ready: 8 Nov 23:27, copycheck missing 0 of 23 (captured page), Hanzo's images kept. Hanzo's Iro art was missing; it now sits beside 'One hop you control' (above it on phones). taste/unique/parity OK (29/29); 0 console errors, no overlap at 1470 and 375.

Reviewed: main @ `9b547607` (last page commit `4df4f37b`).

Walked 7 Nov, 17:00–17:14 UTC, on the dev server, moving, in Playwright Chromium:
- at 1470×801 (wheel, 70% of a screen per step in 10 ticks) and at 375×812 (touch, deviceScaleFactor 2), dwelling 2.7 s on every screen and diffing frames 2 s apart;
- the first second after load at 110 ms frames; the hero chips sampled every 50 ms for 3 s;
- each desktop chapter held 6 s, the strip diffed every 500 ms; each phone chapter held 4.7 s;
- hover and press on every control type, taps on the phone, a Tab crawl from the top to the footer;
- a PerformanceObserver for layout shift, an h1-box sampler for the font swap, a console listener, 3 clean fresh loads per width for the red badge;
- contrast and small text on every visible text node at each 500px (560px phone) step;
- reduced motion, JS off, 375×667 and 320×640; `parity.py`, `taste.py`.

The critic keeps the scripts, frames and logs (scratchpad `telemetry-critic3/`). `scripts/motion.mjs` was not used.

Verdict: 7/10
First complaint: "It's alive now, but after the first box there's a big empty white strip before anything comes in. The middle is a code file with a tiny dot crawling along a line, and it's the same layout as the billing page. And at the end the config box cuts its words off on the right."

The cap: two claims on the card are false against the page (see "False claims"). Without them this page would sit on the 7/8 line, not over it. What holds it back is the sameness of the frame and how small the movement is in the middle. The defects are few.

## Since the last review (7/10)
All of the last fix list landed, and the walk confirms each one:
- **The chips no longer hop.** Sampled every 50 ms for 3 s, the hero chips sit at y 541–542 only (were 469/541/612). The phone's collector column holds at y 634 (was dropping 39px).
- **The desktop chapters keep moving.** At all six chapters, the strip changed in 9–10 of 11 frame pairs over 6 s. The flow dot is at opacity 1 in each (it was 0 in 02–06). Each phone chapter also changes on its own.
- **Contrast fixed.** The lowest text found was 6.29:1 on desktop (a line number on the lit row) and 4.53:1 on the phone (the "log" chip). Nothing is under 4.5.
- **The rail is off the window.** Numbers sit at x 943–1213, and the window ends at x 821.
- **Chapter 05 is full.** builder.yaml sits over a dimmed config.yaml.
- **Collector at rest is 13px / 14px.** 0 runs under the floor at either width.
- **The header carries "View on GitHub"** (solid) once the hero's ask leaves. On the first screen the header's "Try Hanzo" is outlined. One solid per screen at both widths.
- **The red badge is gone on clean loads.** 0 console errors and no visible badge on 3 of 3 fresh loads at each width. The walk script that screenshots straight after `load` still triggers the known false footer hydration error, which is the testing artifact, not the page.

## The 11 answers
1. **Sells in 5 seconds; moves within 1 second?** Yes.
   - Desktop: "Hanzo Telemetry" 52px bottom-left (box 159,228 760×55), the lede and the solid "View on GitHub" on the right, and the collector filling y 338–780. Frames change from the second frame after load.
   - The collector keeps running (a 1.5 s idle diff of 63k px): a chip slides in on the dotted line, the batch cells fill, the memory bar climbs and hatches at the ceiling, and OTLP out slides a batch in.
   - Phone: the h1 at 40px, the caption, the lede and the outlined ask (bottom 378px at 375×667), then the collector from y ≈ 415.
2. **One in, one out, or a document?** On desktop, mostly one in, one out, with one dead strip.
   - As the hero object rises, a blank band up to **232px tall (29% of the screen)** opens under it before "One hop you control" arrives (scroll 293, `d-gap.png`). MASTER part 3 asks old and new to overlap by 40px.
   - Then the pinned scene: config.yaml on the left, one fact on the right, 01 to 06, with the lit lines writing in and the strip dot running.
   - Then the black close and "Get Telemetry".
   - Phone: six stacked chapters, about 570px each, then the close, 9,600px in all. Each chapter has its own object and motion, so it is long but not a wall.
3. **A real object in every section?** Yes.
   - Hero: the running collector.
   - Chapters: config.yaml / builder.yaml with the pipeline strip.
   - Close: the collector at rest plus the config builder.
   - "Get Telemetry": the agent prompt card.
4. **One ask, sticky; scale with rhythm?** The ask, yes. Scale, mostly.
   - Desktop: the hero's solid "View on GitHub", then the header's solid "View on GitHub", which turns outlined while the band's white twin is on screen.
   - Phone: the header keeps Hanzo's solid "Try Hanzo", and the page's two asks are outlined. The shared bar showed twice (scroll 560 and 3080), both times over empty margin.
   - Scale: 52, then 26, then 21, with one big object per screen. Nothing is in your face.
   - Nothing grows and settles back, apart from the stage settle. Chapter 05 lights all five strip stages in solid ink: a row of five black pills beside the header's black button. These are state, not buttons, but they read as loud.
5. **Every hover and press answers?** Yes; all press without a layout jump.

   | Control | Hover | Press |
   |---|---|---|
   | Hero "View on GitHub" | fill changes | 0.98 |
   | Band "View on GitHub" | answers | 0.98 |
   | Hero Pause | answers | 0.97 |
   | Chapter Pause | answers | 0.97 |
   | "Your config" toggles | grey fill, check nudges | 0.98 |
   | Copy | answers | 0.92 |

   - Copy then reads "Copied", and the clipboard equals the display.
   - Toggling "logs" takes the config from 22 to 18 lines and strikes "logs" through in the collector at rest.
   - Hero signals: hovering "logs" makes only log chips flow in, but the cursor stays `auto`, so nothing invites the hover.
   - Phone: tapping Pause sets `aria-pressed=true` and freezes the hero. 0 targets under 44px.
6. **Overlap, font swap, layout shift?** No font swap and no overlap. Small shift. One clipped panel.
   - Font swap: the h1 box was a single sample from first paint at both widths (159,228 760×55; 16,168 343×46).
   - CLS on the slow walk: 0.0107 desktop, 0.0000 phone. The desktop shifts are the hero's OTLP-out `li` rows (`layout` on the list) at scroll 440–500. That is under the 0.02 target but above the card's 0.0009.
   - **Clipped text:** in the close, the "Your config" `pre` is 341px wide with 380px of content. "processors: [memory_limiter, batc" is cut at the right edge on every pipeline (`d-close.png`). It scrolls, but James sees cut words.
   - The hero's OTLP-out column also cuts its 4th batch card mid-text at the bottom edge, with no fade (`d-gap.png`).
   - No horizontal page scroll at 375 or 320. No fixed layer over content on desktop.
7. **Which reference, and is its motion there?**
   - apple.com product page: a pinned stage where one panel changes. Present.
   - motion.dev: the OTLP-out list, the memory bar, the line write-in by clip-path. Present.
   - Kinds of motion: idle (the collector, the strip dot), pointer (hover a signal), time (write-in, caret), state (the config builder). Scroll is only the pinned scene.
   - Weak: the idle motion in the middle is a 9px grey dot on a hairline. It is there, but it is the smallest thing on the screen.
   - synchronized.studio card-open: absent (no cards). Anthropic launch: no hero figure (Hanzo prints none here).
8. **Different from its neighbours?** In the object, yes. In the frame, no.
   - /billing is still `StageHero look="split"` + `PinScenes` + `Finale`, and /search uses the same pinned-scene kit.
   - /tunnel, /visor, /sentinel, /world and /stream end on the same `Finale`: "Get X", licence and hanzoai chips, "Paste and ship".
   - Its own: the running collector, the config file read as you scroll, and the config you assemble.
9. **All 18 parts?** No; see below. Two card claims are false.
10. **Banned tells?** No outright fail.
    - Risk: the lit code lines carry a 3px white `inset` bar down their left edge (a stripe down a block).
    - Risk: the close's collector at rest is three boxes in a row, though joined by lines and unequal in height.
    - Risk: five solid ink pills at chapter 05.
    - Clean:
      - no hue (`taste.py` OK);
      - nothing above any headline (the mono caption sits under the h1);
      - no floating pill or cursor label on desktop;
      - no opacity-only hover;
      - no `title=` tooltips;
      - no Inter, no gradient text.
11. **Copy untouched?** Yes. `parity.py /telemetry`: text 29/29, links 2/2.
    - The added YAML and labels (config.yaml, builder.yaml, "signals", "protocols", "processors", the stage names) are listed on the card as questions for James, which is right.

## Missing from the 18 parts (MASTER §2; card checked against the walk)
- **Part 3, narrative:**
  - A 232px blank band under the hero object before the chapters arrive. The new object does not overlap the old.
  - Phone page about 9,600px.
- **Part 6, content:** the close's config `pre` clips lines horizontally (380px of text in 341px).
- **Part 7, visual:**
  - Telemetry.css has 63 literal hex values and only 27 `var(--…)` references. MASTER: "No literal hex, radius or shadow in page CSS."
  - Radii 10px (strip stages, batch cells), 14px (OTLP-out rows, memory bar) and 18px ("Your config" output) are off the deck's radius set (6, 8, 12, 16, 20, 24, 28, full).
  - The frame is still the shared Cloud kit's (answer 8).
- **Part 8, components:** transitions use ad hoc durations (.12s, .2s, .25s, .35s), not the deck's 90/150/300/400/500.
- **Part 9, motion:**
  - Nothing grows and settles back.
  - The chapter idle is a 9px dot.
  - The signal hover has no pointer cursor.
- **Part 13, performance:** walk CLS 0.0107 on desktop (the hero OTLP-out `layout` rows). That is under target, but not the 0.0009 the card states.
- **Part 16, developer:** the config window and the builder output are raw `<pre>`, not `CodeBlock`/`Code`. The card ticks "One CodeBlock".
- **False claims on `docs/coverage/telemetry.md`** (each caps the verdict at 7):
  1. Part 7: "Radii 6, 8, 12, 16, 20, 24 (28 on the search composer only)". Telemetry.css also sets 10px (lines 21, 41), 14px (27, 28, 32) and 18px (69).
  2. Part 7 tick: "no literal hex outside tokens". The page CSS writes 63 literal hex values. They are deck values, but they are literals, which is what MASTER forbids.

  Also inaccurate, but not material:
  - Part 9: "every transition is 300 ms … or shorter". The strip stages, the memory bar and the OTLP-out rows run 400 ms.
  - Part 12: "lowest 7.11:1 on desktop". Measured 6.29:1 (still passing).
  - Part 13: the CLS figure (above).
- **Passing:**
  - One h1 and one main, with the skip link.
  - JS off: the h1 at opacity 1 and 0 hidden runs at both widths.
  - Reduced motion: 0 running animations, hero and chapters frozen, every lit line shown.
  - No overflow at 375 or 320, and 0 targets under 44px.
  - The ask's bottom edge at 378px on a 667px screen.
  - Copy equals display.
  - Tab crawl: 27 stops in main, every one visible with a ring and none under the header.
  - 7 Pause buttons on one switch.
  - 0 console errors on clean loads.
  - `taste.py` and `parity.py` OK.

## Fixes (in order)
1. **Close the blank band under the hero (desktop).** Shorten the stage hold below 125svh, or start "One hop you control" and the strip while the collector is still leaving, so old and new overlap by about 40px and no strip of empty white passes.
2. **Stop the close clipping its config.**
   - Let the "Your config" `pre` wrap (`white-space: pre-wrap` with a hanging indent), or give it the width it needs: 380px of text in a 341px column.
   - Fade the hero's OTLP-out column at its bottom edge, or show 3 rows, so no batch card is cut mid-text.
3. **Make the middle's idle motion visible.**
   - The 9px grey dot on a hairline is the only thing moving once a chapter has arrived. Let the lit stage pill carry it: the dot lands and the pill ticks a count, or the lit block's first line re-writes.
   - Give the hero signal pills `cursor: pointer` (fine pointers) so the pointer moment is found.
4. **Calm chapter 05.** Five solid ink pills read as five buttons. Light them with an ink outline, or ink only the "build" stage.
5. **Tokens, then correct the card.**
   - Swap Telemetry.css's 63 literal hex values for the `tokens.css` variables.
   - Snap radii 10 to 8 or 12, 14 to 12 or 16, and 18 to 16 or 20.
   - Move durations to the deck's 150/300/400.
   - Then rewrite the Part 7 and Part 9 lines on the card, and re-measure the contrast floor (6.29:1) and the walk CLS.
6. **CLS from the hero list.** Drop `layout` on the OTLP-out `motion.li` (slide with transform only) so its rows stop registering shifts (0.004 each at scroll 440–500).
7. **Differ from /billing.** The object is its own, but the frame (split StageHero, PinScenes, Finale) is shared. One structural difference would separate it:
   - the config window entering as a black room that opens to full width as it is reached (MASTER 3.1), or
   - the hero collector docking into the chapter stage instead of scrolling away.
8. **Shared, request only:** the footer hydration false-positive when a tool touches the input before hydration (already in `docs/requests/telemetry.md`).
