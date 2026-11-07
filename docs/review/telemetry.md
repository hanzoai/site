# /telemetry: James-eye review

Verdict: 6/10
First complaint: "The colours are right now, but the title's enormous and so is every heading after it. And that little pill at the bottom sits right on top of the code. On my phone, once you're past the top it's the same code file six times and nothing moves."

Reviewed: main @ `2106935` (last page commit `175356b`). Files hash: `54069e1a99ff`
Walked 7 Nov 14:47–14:51 UTC on the dev server, moving, at 1470×801 and 375×812 (videos, frame sheets and a frame-difference motion log kept by the critic; the site loader was skipped).
Proof: `img/telemetry.jpg` (desktop first screen | phone first screen).

## Since the last review
- **Done: the colour and the eyebrow.** There are 0 hues at either width. Before, amber showed in 75 text, 14 background and 8 border uses, plus red. The batch tiles now fill white on black. "refused" is a dashed ink word. The full memory bar hatches grey, and the glow under the config window is white. "telemetry.hanzo.ai" is now a caption under the button on desktop and under the h1 on phone. Nothing sits above any headline.
- **Done: the first screen, JS off and the chapters.** On desktop, 6 of 25 frames move in the first second after paint (it was 0/25). The memory bar and its ceiling now sit inside 1470×801 (they were below the fold). With JS off nothing is hidden (it was 8 runs, the lede and the ask among them). All six chapters now play on desktop, in order (02–04 were skipped). 04 "A memory ceiling" falls between two screen stops, but the film shows it with memory_limiter lit.
- **Done: one verb, presses, coverage.** "View on GitHub" is the solid button in the hero, the ask bar and the close. "Deploy to Cloud" is a text link. There are 3 `data-cta` and 1 `data-thumb` (it was 0). The hero button and "hanzoai" press to 0.98, and the rail ticks answer on hover (they were dead or opacity-only). The header names Persona, Goal and CTA, and `docs/coverage/telemetry.md` exists.
- **Still open in this walk:**
  - The phone chapters still print the whole 20-line config six times, and nothing moves from s2 to s11.
  - The seven "Your config" toggles are still solid black pills with dead hovers.
  - Desktop CLS is worse: 0.213 (it was 0.119).
  - The first screen and the close are still the Cloud 4 kit.
  - The copyable config is still the builder's text, and it is not listed as a question for James.
- **Not walked yet:** `ad2351f` and `d1a2614` reached main through `c3615cd` at 14:52, after this walk started at 14:47. `ad2351f` adds the compact phone config, outlined toggles with checks and fixed heights. `d1a2614` sets h1 52 and heads 26. The coverage card already describes them. On paper they answer fixes 2–5 below; a fresh walk decides.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes.
   - Desktop: "Hanzo Telemetry" is 116px on one line (top 173, bottom 287). To its right sit the lede, "View on GitHub" and the caption.
   - The collector fills the rest of the screen from about y 342 to 796, with the memory bar and "ceiling" at about y 765.
   - The body is blank for about 1.5 s (the dev server, as on every page). Then the title cuts in by line mask and the collector runs by itself: spans come in, the six tiles fill, a batch leaves as "6 spans · 1 request", the bar climbs, hatches at the ceiling and the input says "refused".
   - Desktop motion: 6/25 moving frames in the first second and 18/47 in the rest of the 3 s.
   - Phone: the h1 is two lines at 53px, then the caption, the lede, the button and the collector's input panel from about y 385, with a chip moving. Phone motion: 11/25 moving frames in the first second and 55/58 after.
2. **One in, one out, or a document?** Desktop, yes; phone, a document.
   - Desktop: the hero pins for a screen and a half while the copy fades and the collector rises and grows (s1).
   - The dark room "One hop you control" then pins the config on the left and one fact on the right. Each fact lights its block and its stage in the strip, and the chapter titles crossfade: 01 (s2–s3), 02, 03, 04 (between stops), 05 on builder.yaml, then 06.
   - At 05 the stage jumps: the shorter builder.yaml re-centres, so the strip drops from y 81 to y 214 (133px) and jumps back at 06.
   - After that, "Your config" on silver, then the black close: "Put it in front of your backend" with the ask and the agent prompt, then "Get Telemetry".
   - Phone: the six chapters stack, each with its own tab row and the full 20-line file.
   - Every phone screen from s1 to s11 measures STILL (shot difference 0). s1 is partly the walker's doing: it tapped Pause at 6.6 s, which froze the collector. But s2–s11 have nothing that runs.
3. **A real object in every section?** Yes, apart from the close.
   - Hero: the running collector (a drawn diagram rather than Hanzo product UI, but it does exactly what the copy says).
   - Chapters: the config file and the builder manifest.
   - "Your config": a working builder. The toggles rewrite the file, and taps answer on phone.
   - Close: the agent prompt card.
   - "Get Telemetry" is still type and two chips, with no object.
4. **One ask, sticky after the hero; scale with rhythm?** The ask has one verb, but it floats over content, and desktop type is big everywhere.
   - "View on GitHub" is the one solid on the first screen. The ask bar carries it from s1 to s9 at both widths, the header's "Try Hanzo" turns to an outline, and the bar steps aside for the close's solid button. That part is right.
   - **The bar floats over content.** Desktop s1: it covers the h2 "One hop you control" ([544,727 383×54]). s2: it covers the ends of config lines 18–20 ("→ [otlp" cut off). s9: it sits on the "Your config" code.
   - On phone the bar sits on the h3 "OTLP in, OTLP out" (s1) and on "A memory ceiling" (s5). It covers the config at s2, s3, s6, s7 and s8, and the gRPC and HTTP toggles at s9.
   - On s9 the seven "Your config" toggles are solid black, so desktop shows 8 solid fills on one screen.
   - **Scale:** the desktop h1 rests at 116px (the rule is 52). "One hop you control" is 56px, the chapter titles are 40px, "Put it in front of your backend" is 74px and "Get Telemetry" is 88px (the rule is 26 for section headings).
   - Each screen does have one big thing, but nothing rests at hanzo.ai's sizes and nothing grows and then settles back. That is the "big h1 beside 56px heads" pattern.
   - Phone sizes are close to the rule: 53, 36, 28, 40 and 42px.
5. **Every hover and press answers?** Mostly.
   - Hero "View on GitHub": the hover answers, and it presses to 0.98.
   - Pause: it grows to 1.06 on hover (the walker logs this as a jump; it is a scale, not a layout move), and it presses to 0.977.
   - Rail "01" and "03": the hover answers, and they press to 0.98.
   - Copy: the hover answers, and it presses to 0.93.
   - "hanzoai": the hover answers, and it presses to 0.98.
   - **Dead: the "Your config" toggles.** The hover is dead on traces, metrics, batching and memory ceiling, though they press to 0.98. Their hover only darkens the border, and an "on" toggle's border is already ink.
   - Phone taps on traces, logs, batching, memory ceiling and Copy all answer. The walker logged "no visible change" for the Pause tap, but the film shows the icon turning to ▶ and the collector stopping at 6.4 s, so it works.
   - Nothing follows the pointer: the magnetic primary was deleted (the card says so).
6. **Overlap, font swap, layout shift?** There is layout shift on desktop.
   - CLS is 0.213, over the 0.1 fail line (the lab target is 0.02), and worse than the 0.119 before.
   - Sources: the chapter window 0.116 (the 133px drop at 05, visible in the shots), the OTLP out list 0.106, the signal tags 0.078 and the memory bar 0.076.
   - Phone CLS is 0.007. The h1 box is steady (one reading at each width).
   - No overlaps were measured apart from the bar's floats (answer 4). There is no horizontal scroll at 375 or 320.
7. **Which reference, and is its motion there?**
   - apple.com product page: yes. The stage settles as you scroll, and the pinned file lights one block per fact, now all six.
   - motion.dev: the OTLP out list slides as batches land, the memory bar eases, and the chapter titles crossfade.
   - Pointer motion (JAMES rule 9): none.
   - synchronized.studio card-open: absent.
   - anthropic launch: no hero figure.
8. **Different from its neighbours?** Only in the object. The frame around it is the Cloud 4 kit:
   - **First screen:** the same as /tunnel's, a one-line 116px "Hanzo X" on the left with the lede, a black button and a mono caption on the right, and the product strip on the fold. /search, /sentinel and /stream use the same `StageHero` with the identical 116.145px h1 at line height 0.94.
   - **Chapters:** the dark room with "01 / 06" under each chapter title and the object on the other side is the same `PinScenes` as /sentinel and /tunnel.
   - **Close:** "Put it in front of your backend" at 74px, the agent prompt, then "Get Telemetry" at 88px with the licence and hanzoai chips. /stream, /visor and /tunnel measured the same 74px and 88px close.
   - What is its own: the running collector and reading the facts through the config file.
   - James: "It's not just a template."
9. **All 18 parts covered?** No; see below. The card exists, but four of its claims fail this walk.
10. **Banned tells?** Yes:
    - **Something floating over content:** the site-wide ask bar covers headings, code and two toggles at both widths. The fix may be shared (it was requested in `docs/review/SYSTEM.md` at 14:55), but the page still fails.
    - **Everything big:** the 116px h1 and 56, 74 and 88px section heads, with none resting at hanzo.ai's 52 and 26.
    - **A dead page on phone:** 11 of the 12 page screens are STILL.
    - **Layout shift:** desktop CLS 0.213, and the stage jumps 133px at chapter 05.
    - **Three or more equal buttons:** the seven solid black toggles (JAMES rule 5).

    Clean: no hue, nothing above any headline, no opacity-only hover, no `title=` tooltips, no sound.
11. **Copy untouched?** Yes. Parity is 29/29 text and 2/2 links.
    - The 35 added strings are YAML keys and labels: "otlp in · grpc · http", "6 spans · 1 request", "your config", "signals", "protocols", "builder.yaml", "my-collector". None is a new sentence or claim.
    - The same caution as before: config.yaml and builder.yaml are the builder's own text (Telemetry.jsx says "a standard OpenTelemetry collector config with placeholders, not a Hanzo default"). Copy hands them out as if Hanzo had published them, and the card does not list this as a copy question.

## Missing from the 18 parts (MASTER §2, measured; coverage card checked)
- **Part 1, strategy:**
  - The "Your config" screen shows 8 solid fills on desktop (the bar plus seven black toggles) and 6 on phone s9.
  - The metric id sits inside the CTA line, so the check finds no metric line.
  - No copy questions are listed: the copyable config is not Hanzo's text.
- **Part 3, narrative:**
  - The phone middle is a document. Six stacked chapters each repeat the full file, and s2–s11 are STILL.
  - "Get Telemetry" has no object.
- **Part 4, conversion:**
  - The sticky ask is a floating pill over content (§3.2.6).
  - There are 4 raw `.x-btn` uses.
- **Part 6, content:** "Copy" is 13px at both widths; the phone floor is 14px.
- **Part 7, visual system:**
  - Telemetry.css writes 13 literal greys that are not on the deck ramp, instead of tokens: #f5f5f7, #e8e8ed, #e3e3e8, #d1d1d6, #a1a1a6, #8e8e93, #6e6e73, #5f5f64, #3a3a3c, #1f1f22, #1c1c1f, #111113 and #0b0b0c.
  - The config window is outlined and glows (`0 60px 140px -60px`, white 14%), though it does not float ("raise or outline, never both").
  - It is not different from its neighbours (answer 8).
- **Part 8, components:**
  - The 4 tested config toggles have dead hovers.
  - There are 9 bare `:hover` rules.
  - Pause scales to 1.06 on hover, which is not one of James's hover transforms.
- **Part 9, motion:**
  - After the hero, nothing runs by itself at either width except the prompt's caret.
  - The walker marks the desktop chapters "moves", but lining up each pair of shots shows a 1px page drift. After that, s3, s4, s5 and s11 differ in under 75 pixels.
  - Nothing answers the pointer.
  - There are 2 `setInterval` timers (Frame.jsx).
- **Part 11, mobile:**
  - "Deploy to Cloud" is 132×21, under 44px.
  - The bar covers h3s, the code and the gRPC/HTTP toggles.
- **Part 13, performance:** desktop CLS is 0.213, over the 0.1 fail line.
- **Part 16, developer experience:** the copyable config is builder-written. James must approve it, or it comes out of the Copy button.
- **Coverage card:** `docs/coverage/telemetry.md` covers 18 numbered parts in the older format. It has no `Done here:` lines and no copy-questions or shared-requests lines; it has only a closing "Ledger (deleted)" line. Four claims are false against this walk:
  - Part 4: "one solid per viewport" (desktop s9 shows 8).
  - Part 8: "outlined `aria-pressed` pills with an ink check" (the walk shows solid black pills with no check).
  - Part 11: "each showing only its own config block" and "text ≥14px" (every phone chapter shows the full file, and "Copy" is 13px).
  - Part 13: "fixed heights (no layout shift)" (desktop CLS 0.213).

  The card was rewritten in `ad2351f`, which reached main after this walk. Capped at 7 until a walk shows these claims hold.
- **Passing:**
  - One h1 and one main.
  - 0 hues at both widths, and nothing above any h1 or h2.
  - JS off shows every word (0 hidden), and reduced motion settles (0 running after 3 s).
  - 0 low-contrast runs, 0 `title=` tooltips, and no raw img, video or table.
  - No horizontal scroll at 320.
  - 3 `data-cta` and 1 `data-thumb`.
  - A 44px Pause that works on tap.
  - Phone CLS 0.007.
  - Parity 29/29 and 2/2, no console errors, no sound.

## Fixes (in order)
1. **Get the ask bar off the content.**
   - Desktop: the shared fix already requested in `docs/review/SYSTEM.md` drops the floating pill. Until it lands, put `data-ask-hide` on the dark room's stage and on "Your config", so the bar never sits on lines 18–20 or the config code.
   - Phone: give each stacked chapter and "Your config" a bottom padding of the bar's height plus its gap, about 64px, so it never covers an h3, the code or the gRPC/HTTP toggles.
2. **Bring the type down to hanzo.ai's resting sizes.**
   - h1 52px, "One hop you control", "Put it in front of your backend" and "Get Telemetry" 26px, chapter titles 17–21px.
   - If the hero title should be the moment, let it arrive large and shrink to 52px as the stage settles, so the collector is the one big thing.
   - `d1a2614` claims this; it needs walking.
3. **Make the phone middle move, and stop repeating the file.**
   - Show only each chapter's own lit block (`ad2351f` claims this).
   - Let the hero's ink "trace" chip travel along the chapter's pipeline strip and stop on the lit stage, looping while in view and stopping with the hero's Pause, so s2–s9 are no longer STILL.
   - On desktop the same chip can run along the strip above the pinned file.
4. **Stop the jump and the shift.**
   - Give the config window a fixed 20-line height, so builder.yaml no longer re-centres the stage (the 133px drop at 05).
   - Give the OTLP out list four fixed slots and the collector row a fixed height, to bring desktop CLS from 0.213 to under 0.02.
5. **Fix "Your config".**
   - Draw the toggles outlined, with an ink check when on, so they stop reading as seven black buttons.
   - Give them a hover that shows when on, such as a grey fill or the check nudging.
   - Raise "Copy" to 14px on phone, and make "Deploy to Cloud" a 44px row.
   - List the copyable config on the card as a question for James.
6. **Break the Cloud 4 template where it is cheapest.** The close is the shared Finale at 74 and 88px with no object. Put the collector at rest, in its final state, beside "Get Telemetry", so the page ends on its own object rather than the kit's chips.
