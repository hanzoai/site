# /telemetry: James-eye review

Verdict: 7/10
First complaint: "The little tags in the first box keep jumping up and down off the line, so it looks broken. Then once I'm in the config bit nothing moves; it's a code file sitting there with grey words I can barely read."

Reviewed: main @ `33b0215e` (last page commit `5573af4c`).
Walked 7 Nov, 16:20–16:48 UTC, on the dev server, moving, in Playwright Chromium:
- at 1470×801 and at 375×812;
- wheel-scrolling slowly, dwelling 1.8 to 6 s on every screen;
- hovering and pressing every control type, tapping on the phone;
- with a PerformanceObserver for layout shift, an h1-box sampler for the font swap, a console listener, then reduced motion, JS off, 375×667 and 320×640.

The critic keeps the frames, the frame-difference logs and the walk scripts (scratchpad `telemetry-critic/`). `scripts/motion.mjs` was not used: it is hard-wired to the Mac Chrome path.

## Since the last review (6/10)
Most of the last fix list landed, and the walk shows it:
- **The ask bar is gone.** The page sets `data-ask="off"`, and the walk found no fixed or sticky layer except the header at either width. Nothing floats over the content.
- **Type is at hanzo.ai's resting sizes.** The h1 is 52px (40 on the phone). "One hop you control", "Put it in front of your backend" and "Get Telemetry" are 26px, and the chapter titles are 21px. The largest text on any screen after the hero is 26px.
- **The phone chapters show only their own block, and each one moves.** A dot runs the strip; idle diffs are 270–540px on every chapter screen, where they were 0 before.
- **No more jump at chapter 05.** The code window keeps its 20-line height.
- **"Your config" works.** The toggles are outlined with an ink check. Hover fills them grey and nudges the check. Toggling "logs" takes the config from 22 to 18 lines and strikes "logs" through in the collector at rest above it.
- **The close ends on the page's own object,** the collector at rest beside "Put it in front of your backend".

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes, but the first thing that moves stutters.
   - Desktop first screen: "Hanzo Telemetry" at 52px, the lede, a solid "View on GitHub" and the mono caption on the right, and the collector filling the bottom half (y 338–780).
   - On the phone: the h1 at 40px on one line, the caption, the lede and the ask (bottom edge 378px at 375×667), then the collector's input panel from y 415.
   - After paint, every 150 ms frame changes (the h1 cut-in and the collector), and the collector keeps running (a 1.5 s idle diff of 41k px).
   - **The chips hop.** The lane is a grid, so while one chip exits, the next is laid out in a second row. Sampled every 50 ms, the chips sit at y 469, 541 and 612:
     - the outgoing chip floats 72px above the dotted line;
     - the incoming chip lands 72px below it, then snaps up onto the line when the old one unmounts.

     This repeats every 420 ms at both widths (frames `chip-1/4/6`, phone shot `p-s00`). It is the first motion James sees, and it reads as a glitch.
2. **One in, one out, or a document?** Mostly one in, one out on desktop, with dead air. On the phone it is a long stack.
   - Desktop: the hero copy leaves and the collector rises to the top. Around scroll 450–800, the bottom 330px of the screen is blank white, and nothing has come in yet (`d-s01`).
   - Then "One hop you control" pins the config on the left and one fact on the right, 01 to 06. Each lights its lines and its strip stage, and builder.yaml swaps in at 05.
   - At 05 the 9-line builder.yaml sits in a 20-line black box, so the bottom half of the stage is empty black (`d-s07`).
   - Then the black close: "Put it in front of your backend" and the ask, sticky on the left with roughly 600×700px of empty black under it, beside "Your config". After that come "Get Telemetry" and the "Paste and ship" prompt.
   - Phone: six stacked chapters at about 650px each, then the close. Each has an object, so it is not a wall, but it is a 10,100px page.
3. **A real object in every section?** Yes.
   - Hero: the running collector.
   - Chapters: config.yaml and builder.yaml with the pipeline strip.
   - Close: the collector at rest plus the config builder, then the agent prompt card.
   - "Get Telemetry" leans on the prompt card beside it.
4. **One ask, sticky; scale with rhythm?** Scale, yes. The ask, half.
   - Scale: one big thing per screen (the collector, then the code window, then the builder) with medium and small around it. Rest sizes are 52, 26 and 21, and nothing is in your face.
   - Nothing grows and settles back, apart from the stage settle in the hero.
   - The ask: the header's sticky ask is "Try Hanzo", a solid black pill, not the page's "View on GitHub". So on the first screen there are 2 solid black buttons with 2 different labels, at both widths (header 1357,13; hero 943,202).
   - After the hero, "View on GitHub" only comes back in the close, as a white solid on the black band.
   - This is shared header behaviour, but MASTER part 4 says the hero ask's label sits in the header, quiet.
5. **Every hover and press answers?** Yes, all but one.
   - Hero "View on GitHub": the fill goes from `#0a0a0a` to `#2c2c2e` (a kit value that is not on the deck ramp), and it presses to 0.98.
   - Pause: the hover answers and it presses to 0.97.
   - "Your config" toggles: a grey fill and the check nudging 2px on hover; press to 0.98.
   - Copy: the hover answers; press to 0.92; it then reads "Copied", and the clipboard equals the display exactly.
   - Chapter rail 01–06: the focus ring shows.
   - Hero signal pills: hovering "metrics" makes only metrics flow in (a real pointer moment). The cursor stays `auto`, though, so nothing invites the hover.
   - Phone: tapping Pause sets `aria-pressed=true` and freezes the hero (identical frames). Tapping a toggle rewrites the config. No target is under 44px.
   - No layout jump on press.
6. **Overlap, font swap, layout shift?** No font swap, small layout shift, one overlap, and a red badge.
   - Font swap: the h1 box was steady from the first sample at both widths (159,228 760×55 on desktop; 16,168 343×46 on the phone). Zen and Zen Mono finish loading at 0.65–1.1 s.
   - Clean-load CLS over a full scroll: desktop 0.012 (twice), phone 0.012 and 0.023. That is under the 0.1 fail line but at or over the 0.02 lab target.
   - CLS was higher under the heavy filming walk: desktop 0.029, phone 0.108. On the phone, the hero's collector column dropped 39px four times and snapped back 150px in the first 4 s (`tl2-col core`, `tl2-sig`), from chips piling up in the lane.
   - **Overlap:** the PinScenes rail numbers ("01"…"06", y 705–709) sit inside the bottom edge of the config window (bottom 722) on every desktop chapter screen (`d-s03`, `d-s05`, `d-s07`).
   - **Red "1 Issue" badge:** a hydration mismatch in the shared `FooterHTML` (`dangerouslySetInnerHTML` differs between server and client) fired on 3 of 4 fresh desktop loads, and on 4 of 4 on /tunnel. It is not this page's code, but the badge sits on this page.
   - The other dev error seen (`UiPage.jsx` parse error) is another chat's HMR break.
   - No horizontal scroll at 375 or 320.
7. **Which reference, and is its motion there?**
   - apple.com product page: the pinned stage where one panel changes, yes.
   - motion.dev: the OTLP out list slides and the memory bar eases and hatches at the ceiling.
   - Pointer: hover a signal. State: the config builder. Time: the write-in and the caret.
   - **But the desktop chapters die after the arrival.** At chapters 02–06, the strip area changed in 0 of 11 frame pairs over 6 s; the flow dot sat at opacity 0, unpaused. Only the caret blinks 5 times and stops. Chapter 01 does run (10/11).
   - synchronized.studio card-open: absent (no cards).
   - anthropic launch: no hero figure (Hanzo prints none here).
8. **Different from its neighbours?** In the object, yes; in the frame, no.
   - /billing is the same `StageHero look="split"` + `PinScenes` + `Finale`.
   - /tunnel, /visor, /sentinel and /world end on the same `Finale`: a 26px head, the ask, "Get X" with licence and hanzoai chips, and the "Paste and ship" agent prompt card.
   - Its own: the running collector, reading the facts through the config file, and the config builder with the collector at rest.
9. **All 18 parts covered?** No; see below. Five card claims are false against this walk.
10. **Banned tells?**
    - Low-contrast text: the strip's unlit stages are `#a3a3a3` on white, at 2.52:1. MASTER limits `#a3a3a3` to black.
    - Two black solids on the first screen (answer 4).
    - Overlap: the rail numbers inside the window edge.
    - A dead desktop middle: 5 of 6 chapter screens are still after the arrival.
    - Risk, not a fail: the lit code lines carry a 3px white `inset` bar down their left edge, and the close's collector at rest is three equal boxes in a row (joined by lines, so it reads as a diagram).
    - Clean: no hue (`taste.py` OK), nothing above any headline, no floating pill, no cursor label, no opacity-only hover, no `title=` tooltips, no Inter, no gradient text.
11. **Copy untouched?** Yes. `parity.py /telemetry` reports text 29/29 and links 2/2.
    - Added strings are YAML and labels: "Your config", "signals", "protocols", "processors", "OTLP in", "collector", "OTLP out", "batch", "batching", "memory ceiling", "config.yaml", "builder.yaml".
    - The copyable config is the builder's own text. The card lists it as a question for James, which is right.

## Missing from the 18 parts (MASTER §2; the card checked against the walk)
- **Part 1, strategy:** 2 solid fills on the first screen ("Try Hanzo" in the header, "View on GitHub" in the hero).
- **Part 3, narrative:**
  - Desktop has a half-blank screen between the hero and the chapters.
  - The empty bottom half of the stage at chapter 05.
  - About 600×700px of empty black beside the closing builder.
- **Part 4, conversion:** the sticky ask in the header is not the page's label, and there is no bar (by design). The card says "same label".
- **Part 6, content:** the collector at rest uses 12px lowercase Zen Mono at both widths (9 runs: "traces", "batching", "memory ceiling", "OTLP in"…). The floor is 13px on desktop and 14px on the phone.
- **Part 7, visual:**
  - Telemetry.css writes the deck values as literal hex (`#f5f5f5`, `#0a0a0a`, `#a3a3a3`, `#262626`…) rather than tokens. `taste.py` passes; MASTER says no literal hex in page CSS.
  - The frame is still the Cloud kit's (answer 8).
- **Part 9, motion:**
  - Desktop chapters 02–06 have no idle motion. The six chapter Pause buttons pause nothing that is moving.
  - The hero's chips hop between rows.
- **Part 12, accessibility:**
  - Strip text at 2.52:1.
  - Line numbers and the `${CEILING}`, `${BACKEND}` and pipeline values in `#737373` at 4.04:1 on `#0f0f0f`, and 3.35:1 on the lit `#222`.
- **Part 13, performance:**
  - Phone CLS reached 0.023 on a clean load, over the 0.02 lab target.
  - The shared footer hydration error raises the red badge.
- **False claims on `docs/coverage/telemetry.md`** (each caps the verdict at 7):
  1. Part 12: "Lowest measured text contrast 7.11:1 (0 runs flagged)." Measured 2.52:1 (strip) and 3.35 to 4.04:1 (code greys).
  2. Part 6: "0 runs under 13px on desktop, 0 under 14px on the phone." The collector at rest is 12px lowercase.
  3. Part 4: "Sticky ask in header … same label." The header says "Try Hanzo", the page's ask is "View on GitHub", and part 1's "One solid fill per viewport" fails on the first screen.
  4. Parts 9 and 10, plus the header comment: the chapter span "keeps running it until Pause", with a pause beside each chapter "(the chapter strip's running span)". On desktop it runs only in chapter 01.
  5. Open copy questions: "Each is in `content/ui-strings.json` as needs_james; until approved the control is icon-only." Neither config.yaml nor builder.yaml is in that file, and "config.yaml", "signals", "protocols" and "processors" render as visible text.

  Also stale: Part 13's "0 console errors at both widths". The shared footer's hydration error shows on this page today.
- **Passing:**
  - One h1 and one main; the skip link.
  - JS off: the h1 is at opacity 1 and 0 runs are hidden, at both widths.
  - Reduced motion: 0 running animations after 3.5 s, hero and chapters frozen, and every lit line shown.
  - No overflow at 375 or 320.
  - No target under 44px on the phone.
  - The ask's bottom edge at 378px on a 667px screen.
  - Copy equals display; Copied only on success.
  - Every Tab stop in main shows a 2px ring (ink on light, white on the black band).
  - 7 Pause buttons on one switch.
  - `taste.py` OK and `variety.py` OK.
  - Title and canonical as claimed.

## Fixes (in order)
1. **Stop the chips hopping.**
   - Put the lane's chips in one grid cell (`.tl2-lane > * { grid-area: 1 / 1; }`), or make the exiting chip `position: absolute`, so the outgoing and incoming chips share the dotted line.
   - Pass `mode="popLayout"` to its `AnimatePresence` or use the absolute exit; either clears the 72px hop and the phone's 39px column drops.
2. **Make the desktop chapters keep moving.**
   - Find out why the `flow` span never starts after the first chapter. The `Config` remounts by `key={at}` inside the pinned stage, its `useInView` box never reports in view, and the dot sits at opacity 0.
   - Bind the flow to the chapter index rather than a fresh in-view check, so every chapter's strip runs until Pause, as the card says.
3. **Fix the contrast.**
   - Unlit strip stages: `#525252` on white, or `#737373` text with a hairline outline.
   - Code line numbers and placeholder values: `#a3a3a3` (8.1:1 on `#0f0f0f`), not `#737373`.
   - Re-measure, and correct the card's 7.11:1.
4. **Move the rail numbers off the window.** Give the PinScenes rail at least 12px under the config window (or drop the numbers on this page, since "01 / 06" already sits under each title), so "01"–"06" never sit inside its edge.
5. **Fill the dead air.**
   - Shorten the hero's pinned hold (or let the "One hop you control" head arrive while the collector rises), so no screen is half blank.
   - At chapter 05, fit the window to builder.yaml's 9 lines with a fixed height for that chapter, or show config.yaml dimmed under it.
   - In the close, let the sticky "Put it in front of your backend" column carry the collector at rest (moved out of the builder card), so the left half is not empty black.
6. **Collector at rest to 13px desktop, 14px phone.**
7. **Correct the coverage card.**
   - The ask: either the shared header carries "View on GitHub" quietly (request it in `docs/requests/telemetry.md`), or the card says the header ask is the site's "Try Hanzo" and lists the first screen's two solids.
   - Add config.yaml, builder.yaml and the builder labels to `content/ui-strings.json` as needs_james, or reword the claim.
   - Use literal-hex tokens in Telemetry.css, or say why not.
8. **Shared, request only:** the `FooterHTML` hydration mismatch (the red "1 Issue" badge on this page and /tunnel) belongs to the footer owner. Log it in `docs/requests/telemetry.md` so the badge is not counted against the page twice.
