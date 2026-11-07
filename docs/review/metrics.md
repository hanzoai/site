# /metrics: James-eye review

Verdict: 6/10
First complaint: "The top is right now: calm, grey, and the chart is alive. But then it's the same table for six or seven screens and nothing moves unless I scroll, and the bottom half is exactly O11y's: same console, same 'Paste and ship', same 'Get' block. It's still a template."

Reviewed: main @ `648b7985` (last page commit `9898ac29`; `e518de25` reached main at 15:11, after this walk's checkout). Files hash: `5c6441561436`
Walked 7 Nov 15:08–15:14 UTC on the dev server, moving, at 1470×801 and 375×812 (videos, frame sheets and a frame-difference motion log kept by the critic; the site loader was skipped).
Proof: `img/metrics.jpg` (desktop first screen | phone first screen).

## Since the last review
- **Done: nothing floats any more.**
  - Desktop: no bar on any screen. From s1 to s12 the only fixed solid button is the header's "Try Hanzo", and FLOATS is empty at both widths.
  - The "Hold"/"Run" tag, the crosshair's series tag and the Logs card's "Open" are gone. The chart, the Logs card and the close's ask carry `data-cursor=""`, and the system merge removed the cursor label.
  - The traces now sit beside the chart on one flat tile instead of on top of it.
  - Phone: the slim white "View on GitHub →" bar shows only on s1–s5, over blank white, and steps aside from the dark room onward.
- **Done: the scale has a rhythm.**
  - Desktop: the h1 is 52px (was 128), "What a metric is here" 44px (was 76), the chapter titles 32px (was 52) and the dark-room heads 26px (was 56). "Get Metrics" grows from 26 to 64px as it arrives (was 128 at rest).
  - Phone: 40 / 32 / 26 / 44px.
  - The chart is now the big thing on the first screen.
- **Done: contrast, the phone overlap and the pause press.**
  - 0 low-contrast runs at 1470, 375 and 320 (was 5 at 4.1:1), because the traces card is no longer at 90%.
  - The pause no longer sits on "per-tenant": the overlap list is empty.
  - The pause presses to 0.97 (it had no press).
  - Phone CLS is 0.027 (was 0.086).
  - `Metrics.css` now holds only deck values (it had 33 literals, with Apple greys).
- **Still open:**
  - "01 / 06" still sits over each chapter title on desktop.
  - The pause is still last in the toolbar's markup, and the card still calls it first.
  - The chapters still pin on phone.
  - The chart still rewrites four SVG paths every frame.
  - After the hero, the page is still the Cloud 3 kit, now visibly the same as the walked /o11y.
  - Worse than before: the desktop chapters are now STILL as well as the phone ones (answer 2).
- **Landed after the walk (no credit):** `e518de25` at 15:11:25. It moves the chapter numbers under the titles, makes the spike land after the line draws and has chapter 04 replay the spike. It also sends a point from the prompt to the console. Re-walk to score it.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes.
   - Desktop: all of this fits inside 801px:
     - "Hanzo Metrics" (52px, one line) and "The metrics half of Hanzo O11y";
     - "View on GitHub";
     - the query toolbar with its pause, split and legend;
     - the whole chart tile with its traces (ends about y 727).
   - The first second has 4/25 moving frames, the rest of the 3 s 17/47, and s0 shotdiff is 1.42.
   - Sheet 01: the line draws in from the left, the "spike · zen" flag drops and the traces open ("traces for that window · zen") with their bars. They then close to "a spike is the start of a question" while the line streams on.
   - One glitch: for about 1.5 s (sheet 01, frames 2–5) the flag and the open traces point at a spot the line has not reached yet, so it calls a spike where there is none. `e518de25` says it fixes this.
   - Phone: the 40px h1, the lede, the ask, the toolbar and the chart are inside 812px, with 13/25 moving frames in the first second (s0 shotdiff 2.29).
2. **One in, one out, or a document?** One table for most of the page, and it only moves when you scroll.
   - "What a metric is here" opens the pinned scene beside the Datastore table. Then the six chapters swap their words while the table changes state: rows lit, PromQL ↔ builder, the label check, the spike row, the "alert rule" chip, "token · org a".
   - Stop scrolling and nothing moves. Desktop s1, s2, s3, s5, s6, s7 and s8 are STILL (shotdiff 0). Only chapter 02 changes by itself, the 2.2 s PromQL ↔ builder swap (s4, 0.281). On phone, s1 to s6 are all STILL.
   - That is 7 of the 13 desktop page screens and 6 of the 10 phone page screens, so the middle of the page is dead.
   - After that, things live again:
     - the dark room's console build and the prompt caret (s9 0.071, s10 0.027);
     - the Logs card;
     - "Get Metrics" with its drifting Sigil (s11 0.425, s12 0.587).
   - Empty white: about 300px between the hero tile and the chapters (desktop s1), and about 160px between the close and the footer (s12).
3. **A real object in every section?** Yes, but the dark room's object is not Metrics'.
   - The chart and its traces in the hero.
   - The table through all six chapters, with the label check in chapter 03 ("series = models / 1 more column").
   - The agent prompt and a console in the dark room. The console is the shared four-service one (gateway, payments-api, checkout-web "Building", docs-site), the same as /o11y's.
   - The Logs card and the close each have a Sigil.
4. **One ask, nothing floating, scale with rhythm?** Floats pass and scale passes. Two solid fills fail.
   - This walk includes the system merge (`648b7985`: header ask, phone bar, cursor label gone).
   - **Floats: none.**
     - Desktop: the only fixed solid from s1 to s12 is the header's "Try Hanzo".
     - The walker also lists per-model, per-route and per-tenant as sticky on s1–s8. They are chapter 03's label buttons inside the pinned stage, invisible except in chapter 03 (see part 12).
     - Phone: the bar covers nothing (s1–s5, blank white under it).
     - The crosshair is a line and a dot with no tag.
   - **Two solid black buttons:**
     - The header's "Try Hanzo" and the hero's "View on GitHub" are both solid on the first screen: desktop y 13 and 239, phone y 8 and 182.
     - They are both solid again at the close (desktop s12, phone s9).
     - /o11y and /playground, both walked at this commit, outline the header's button page-locally so their own ask is the one solid. So do the Mq, Pubsub, Realtime and Registry stylesheets. /metrics does not.
   - **Scale: rhythm now.**
     - Screen one rests at 52px with the chart as the big thing. Then 44px for "What a metric is here", 32px for the chapter titles, 26px in the dark room, and "Get Metrics" growing from 26 to 64px.
     - The section heads at 44 and 32px still rest above live hanzo.ai's 26px.
     - The dark room stacks two equal 26px heads ("Send a metric, then follow it" over "Paste and ship", which is a `<p>`), so that room has no medium size.
5. **Every hover and press answers?** Mostly.
   - These answer on hover and press:
     - hero "View on GitHub" (0.986);
     - Pause (0.97);
     - the chart (the crosshair reads the line, 0.98 on press);
     - chapter ticks 01 and 06 (0.98);
     - Copy (0.92);
     - "Open in the console" (0.97).
   - Dead or half-dead:
     - "hanzoai/metrics 4 stars" is DEAD (only its underline darkens) and has no press.
     - The console's "Metrics — Hanzo" title is DEAD with no press.
     - The console's Logs, O11y and Sessions links answer on hover but have no press.
     - The selected "per-model" has no hover.
   - The walker's "per-tenant" DEAD on s1 is a chapter 03 button that is invisible there (part 12).
   - Phone taps:
     - "per-tenant" and Copy answer.
     - Chapter ticks 01 and 04 logged no change. The phone film runs several seconds behind (sheet 04 still shows the intro after the walker had scrolled on), so this is unconfirmed.
6. **Overlap, font swap, layout shift?** None measured.
   - The overlap list is empty at both widths.
   - CLS is 0.001 on desktop and 0.027 on phone (the pinned copy 0.026, code 0.014).
   - The h1 box gave one reading at each width: 326×54 at y 116, and 251×42 at y 84.
   - There is no horizontal scroll at 375 or 320.
7. **Which reference, and is its motion there?**
   - apple.com product page: yes. The product is the hero, and one table changes per pinned chapter. But Apple's pinned scenes play, and this one only scrubs.
   - motion.dev: the crosshair, the spike flag, the timed wipe into the dark room and "Get Metrics" growing are there.
   - synchronized.studio: the Logs card carries `data-morph`, but the walk did not open it.
   - anthropic launch: no hero figure.
8. **Different from its neighbours?** The hero, yes; the rest, no.
   - The hero is its own. No other walked page opens on a chart tile with its traces beside it. /o11y opens on a dark trace waterfall, /search on a search box under a centred title, /stream on partition rows.
   - The shape is still the shared kit: a one-line "Hanzo X" on the left over a lede and a black button, a product strip on the fold, numbered pinned chapters, one dark room and a "Get X" block.
   - After the hero it is /o11y's page:
     - the same `PinnedChapters` dash rail with an "0N" caption over each title;
     - o11y's chapter 02 draws the same `rate(http_requests_total[5m])` line;
     - the same four-service console with "Example project. Every name in it is one you would give your own.";
     - the same "Paste and ship" prompt;
     - the same "Related capabilities" Logs card with its Sigil;
     - the same "Get X" close: Sigil card, "View on GitHub", "Deploy to Cloud", "License: Apache-2.0" and "hanzoai/x 4 stars".
   - /search's chapters use the same pattern too: words on the left with a "01 / 04" caption, the product window on the right and the dash rail below.
   - James: "It's not just a template."
9. **All 18 parts covered?** No; see below. The card has all 18 parts, each with a filled `Done here:` line and the three lines above part 1, but seven of its claims fail the walk.
10. **Banned tells?** Yes:
    - **A dead page in the middle:** 7 of 13 desktop page screens and 6 of 10 phone page screens are STILL, and the chapters move only on scroll.
    - **A label directly above a headline:** "01 / 06" to "06 / 06" (12px Zen Mono, class `lx-kick`) sits about 20px above each 32px chapter title on desktop (s3–s8). The titles are `h3` in the markup, but each is the headline of its screen. Phone hides the numbers.

    Clean:
    - no hue at either width, no floating bar or panel, and no cursor label;
    - no opacity-only hover and 0 `title=` tooltips;
    - no console errors and no overlap;
    - no audio code of its own: the page's `aria-pressed` buttons tick and its `data-cta` asks tap through the shared kit, and nothing plays on hover, scroll or load.
11. **Copy untouched?** Yes.
    - Parity is 59/59 text and 12/12 links.
    - The 27 new strings are drawn demo data (the query, rows, span names, `org a`) and labels ("series =", "1 more column", "alert rule", "open in the console ↗"), plus the shared console's demo line "a build is running from the last commit on main."
    - "traces for that window" is cut from Hanzo's chapter four sentence.
    - Nothing claims a new fact or number.

## Missing from the 18 parts (MASTER §2, measured; coverage card checked)
- **Coverage card:** `docs/coverage/metrics.md` (new template, 18 of 18 `Done here:` lines filled) makes seven claims the walk disproves:
  - **Part 1**, "counts exactly one dark solid ('View on GitHub')": the header's "Try Hanzo" is solid beside it on both first screens and at the close.
  - **Part 7**, "No label, tag, badge or pill above a headline": "01 / 06" sits over each chapter title on desktop.
  - **Part 8**, "Every control has hover, press…": two links are DEAD with no press, and three more have no press (answer 5).
  - **Part 10**, "a 44px pause, first in its toolbar": it is last in the toolbar's markup, after the split and the legend, and only drawn top-right. The last review flagged the same line.
  - **Part 12**, "Pause control on every moving item": the console's Building ↔ Ready loop (every 4.2 s, endless while seen) has none.
  - **Part 6**, "only the 12px Zen Mono capitals go smaller": "Agent prompt" is 12px in mixed case on phone, under the 14px floor.
  - **Part 9**, "Sound … n/a: the shared sound kit has not landed": it is in this commit (`lib/sound.js`, wired by `components/Sound.jsx`).
  - This caps the page at 7.
- **Part 1 / 4:** two solid fills per viewport on screen one and at the close (answer 4).
- **Part 3:**
  - The chapters are one table for seven screens, and it only moves on scroll.
  - There is about 300px of blank white before the chapters and about 160px between the close and the footer.
  - On arrival the spike flag shows before the line has drawn.
- **Part 7:**
  - "01 / 06" over the chapter titles.
  - `Frame.css`, which is in this page's file list, still paints the dark-room prompt in greys outside the deck: `#111113` box, `#a1a1a6` lede, `#86868b` label, `#1d1d20` Copy, `#f5f5f7` title. `Metrics.css` itself is clean.
- **Part 8:**
  - The repo link and the console title are dead.
  - The chart animates path geometry (`setAttribute('d')` on four paths every frame), not transform.
  - `Frame.css` holds 9 bare `:hover` rules outside `@media (hover: hover)`, most for parts this page does not render.
- **Part 9:**
  - Desktop s1–s3 and s5–s8 and phone s1–s6 are STILL, so scroll is the only motion through the whole middle.
  - `page.jsx` says a spike comes "every seven seconds" and `Metrics.jsx` says "every ten". The code gives about 9.4 s.
- **Part 11:**
  - The chapters still pin under 900px (a sticky 100svh stage with the table on top). Part 11 says stack them.
  - Phone taps on chapter ticks 01 and 04 showed no change (unconfirmed, because the phone film lags).
- **Part 12:**
  - Hidden chapters are only `opacity: 0; pointer-events: none` (`PinnedChapters.css`), so chapter 03's three label buttons stay in the tab order while invisible. The walker found "per-tenant" on s1, where nothing shows.
  - The console loop has no pause.
  - The chart's pause is last in the markup.
- **Part 13:**
  - The path rewrites showed as 1,798 DOM changes on desktop s0 and 1,604 on phone s0.
  - They reached 3,142 on phone s1, where the chart is almost off screen, because `useLive(0.15)` watches the whole hero block, not the chart.
- Passing:
  - structure: one h1, visible with JS off; 0 hidden text with JS off; one main;
  - colour and contrast: no hue at either width; 0 low-contrast runs at 1470, 375 and 320;
  - targets and tooltips: 0 targets under 44px; 0 `title=`;
  - layout: no horizontal scroll at 320; CLS 0.001 and 0.027; the h1 box steady;
  - asks and copy: 2 `data-cta` (`metrics.hero`, `metrics.close`) and 2 `data-thumb`; parity 59/59 and 12/12;
  - motion: reduced motion settles (0 running after 3 s);
  - kit parts: no raw img, video or table; a Band at the end;
  - quality: 0 console errors; sound only through the shared kit; a pause on the chart.

## Fixes (in order)
1. **Let the chapters play without a scroll.**
   - Chapter 02 already swaps PromQL ↔ builder on a 2.2 s timer while seen (`Table`, `step === 1`). Give the other five the same once-through, using the table states they already have, and then rest:
     - 01 lights the metric, then the trace, then the log rows;
     - 03 ticks per-route, then per-tenant, through the label check, until the visitor taps one;
     - 04 grows the spike row (check `e518de25`'s replay on a re-walk);
     - 05 brings the "alert rule" chip in;
     - 06 fades org b and org c.
   - Do it on phone too, where s1–s6 are STILL.
2. **Make the bottom half Metrics', not O11y's.**
   - In the black room, replace the shared four-service `LaunchConsole` with the page's own chart set dark (`Field` already has the pause, the crosshair and the traces). Then "Send a metric, then follow it" is literally that: the prompt's query lands on the line and opens its traces.
   - Keep "Send a metric, then follow it" at 26px and set "Paste and ship" at 17px, so the room has a medium size.
3. **One solid fill per screen.** Add O11y's page-local rule to `Metrics.css`: `html:has(main.mt) header[data-slot=masthead] a[href='https://hanzo.ai/signup'] { background-color: transparent; color: var(--foreground); box-shadow: inset 0 0 0 1px var(--border, rgba(0,0,0,.14)); }`.
4. **Clear the chapters.**
   - Confirm on a re-walk that `e518de25` puts "01 / 06" under each title on desktop.
   - In `PinnedChapters`, make `past` and `next` steps `inert` (or `visibility: hidden` once faded), so their buttons leave the tab order.
   - Under 900px, unpin: each chapter's table state goes above its words, with no sticky. Every word stays.
5. **Make the card true.**
   - Move `<LivePause>` above `.mt-host` in the markup (its grid area keeps it drawn top-right).
   - Stop the console's Building ↔ Ready loop after one build, or give it a pause.
   - Set "Agent prompt" at 14px on phone, or as 12px mono capitals.
   - Give "hanzoai/metrics 4 stars" and the console title a hover and a 0.97 press.
   - Then correct parts 1, 6, 7, 8, 9 (the sound kit has landed), 10 and 12.
6. **Lighten the chart.**
   - Draw each series once at twice the width and slide it with `translateX`, instead of rewriting four paths every frame.
   - Point `useLive` at the chart tile, not the whole hero block, so the loop stops once the chart leaves.
