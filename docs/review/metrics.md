# /metrics: James-eye review

Verdict: 6/10
First complaint: "The grey is right now and the live chart is a good start. But the title is enormous and every heading after it is big too, so nothing stands out. A little 'Hold' tag chases my mouse round the chart, and once I scroll a pill bar sits on top of the page, over the text. I said nothing floats over content."

Reviewed: main @ `cb11693` (last page commit `c9784eb`). Files hash: `8b91cf41953e`
Walked 7 Nov 14:35–14:44 UTC on the dev server, moving, at 1470×801 and 375×812 (videos, frame sheets and a frame-difference motion log kept by the critic; the site loader was skipped).
Proof: `img/metrics.jpg` (desktop first screen | phone first screen).

## Since the last review
- **Done: the orange, the green and the eyebrow.** The walk found no hues at either width (it was orange throughout). The three series are now an ink line, a dashed grey line and a dotted light line, and the "api" tag in the dark room is grey. Nothing sits above the h1 any more: "metrics.hanzo.ai" has moved into the chart's toolbar.
- **Done: the product is the first screen.** At 1470×801 the one-line title, the lede, "View on GitHub", the toolbar and the whole live chart (curve, spike and traces card) fit inside 801px. With JS off the h1 shows and 0 text runs are hidden (it was 21). Also done: 0 `title=` tooltips (was 8), 0 phone text under 14px (was 32), 0 phone targets under 44px, 2 `data-cta` (was 0), Persona, Goal, CTA and Metric are in the header, and `docs/coverage/metrics.md` exists.
- **Half done: one ask.** "View on GitHub" is now the solid button in the hero, in the sticky bar and at the close. "Deploy to Cloud" is a text link, and the bar steps aside for the close's own button (desktop s12, phone s9). But the bar now floats over content at both widths, which James has banned since the last review (answer 4).
- **Half done: every control answers.** The hero ask now changes on hover and presses to 0.98 (it was dead). "per-route" presses to 0.97, and the opacity-only hover on the chapter dots is gone. Still failing: the pause button never presses, "Deploy to Cloud" only darkens its underline, and tapping a chapter tick on phone changed nothing (answer 5).
- **Still open: the template, and contrast.** The hero is its own now, but after it the page is the Cloud 3 kit again (answer 8). Low contrast has improved from about 3:1 to 4.1:1, but 5 text runs are still under 4.5:1.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes once it has loaded. Desktop arrival is unproven.
   - Desktop: "Hanzo Metrics" (128px, one line), "The metrics half of Hanzo O11y", "View on GitHub" and the chart all sit inside 801px. During the first stop the chart streams, a spike rises about every 9 s, the "spike · zen" flag drops in and the traces card opens beside it (sheet 02).
   - The desktop film shows the lede, the ask and the toolbar at 0.5 s, but no title and no chart line until about 6 s, and it logs 0 moving frames in the 3 s after paint.
   - The phone, walked second, cut the title in on its very first frame, and the source is a CSS animation. So I read the desktop gap as the dev server's first compile plus a frozen recorder, not the design, and I don't score it.
   - Phone: the title, lede, ask, toolbar and live chart are all on the first screen, with 13 of 25 frames moving in the first second.
2. **One in, one out, or a document?** One in, one out, as far as the chapters go.
   - "What a metric is here" opens the pinned scene beside the Datastore table. Then the six chapters swap one at a time while the table changes: PromQL ↔ builder, the label columns light up, the "alert rule" chip, then "token · org a" with the other orgs faded.
   - The dark room wipes in on a timer, the Logs card follows, then "Get Metrics".
   - On phone, the four chapter screens s3 to s6 are STILL (shotdiff 0): they only change when you scroll.
   - Evidence caveat: the desktop grabs at s4, s5-a, s7-b and s8-a came back blank or nearly blank below the header. Over the same stretch the desktop film shows whole white frames with even the header missing. So the desktop chapter "moves" readings are not reliable. I judged the chapters from the good shots (s3, s5-b, s6-a, s7-a, s8-b) and the phone.
3. **A real object in every section?** Yes:
   - the live chart in the hero;
   - the table through all six chapters, with the label check in chapter three ("series = models / 1 more column");
   - the Paste prompt and a console that builds (`checkout-web` "Building") in the dark room;
   - the Logs card with its Sigil;
   - the Sigil card at the close.
4. **One ask, nothing floating, scale with rhythm?** No on both counts.
   - **Floats, desktop:** from s2 to s11 a pill bar ("Hanzo Metrics | search | View on GitHub") is fixed at the bottom centre. At s9 it sits on the right edge of the agent prompt box and across the console's sidebar. At s10 and s11 it sits on the Logs card.
   - **Floats, phone:** the bottom bar covers the console's sidebar at s7, the "Logs" title on the related card at s8 (only the lower half of the word shows under it), and the footer's "Open source" at s10.
   - **Floats, hero:** the chart has its own cursor label, "Hold" (it becomes "Run" once held), set by the page's `data-cursor`. It is still stuck at the right edge on s1, after the chart has gone. The crosshair carries a second tag ("zen · kai · enso"), and both are cut off by the screen edge in the s0 shot. The Logs card adds the kit's "Open" label.
   - **Floats, traces card:** the traces card sits on the left third of the live chart. It is at 90% opacity, so the ink line shows through it behind "chat.completion".
   - **Two solid fills:** on phone the header's "Try Hanzo" and the hero's "View on GitHub" are both solid black for the first 2.5 s (p-sheet-01, frames 1–5).
   - **Scale, desktop:** everything is big. The h1 rests at 128px and never settles. "What a metric is here" is 76px, the six chapter titles are 52px, "Send a metric, then follow it" is 56px, and "Get Metrics" is 128px again. Live hanzo.ai rests at 52 / 26 / 64. Nothing on the page is set at 26px, and nothing starts big and shrinks. On the first screen the title, not the chart, is the big thing.
   - **Scale, phone:** better: 56 / 40 / 28 / 56px.
   - Note: `c9784eb` (14:33) came after this walk's commit. It only moves `data-ask-name` onto the hero section, and the bar already shows here.
5. **Every hover and press answers?** Mostly. Pointer and press results:
   - Hero "View on GitHub": answers on hover and presses to 0.98.
   - "per-route": answers and presses to 0.97.
   - Copy: answers and presses to 0.92.
   - "Open in the console": answers and presses to 0.98.
   - Chapter tick 04: answers.
   - Pause: grows to 1.04 on hover (logged as a jump) and never presses. Its hover `scale(1.04)` comes after `:active { scale(.94) }` in `LivePause.css`, so the hover wins while you press.
   - "Deploy to Cloud": logged DEAD. Its only hover is the underline going from 30% to full ink, and it has no press.
   - The console's "Metrics — Hanzo" title: dead, no press.
   - The selected "per-model" tab: no hover.
   - Phone taps: "per-route" and Copy answer. The chapter ticks 01 and 04 showed no change on tap.
   - Pointer: the crosshair reads the line under the mouse, which is good. But its tag only names the series ("zen · kai · enso"), not a value.
6. **Overlap, font swap, layout shift?**
   - Phone: on the first screen the pause button sits on the end of the split control, over "per-tenant" (27×11px, visible in the shot). That fails DONE.
   - Phone CLS is 0.086: the dark-room console 0.044, the related section 0.044 and the chapter copy 0.042. Desktop CLS is 0.
   - Desktop: the chart is one full-bleed `<button>` under the lede, the ask and the split tabs. Nothing collides on screen, but any click in the empty hero holds the chart.
   - The h1 box is steady (one reading at each width). There is no horizontal scroll at 375 or 320.
7. **Which reference, and is its motion there?**
   - apple.com product page: yes. The product is the hero, and one table changes per pinned chapter.
   - motion.dev: the crosshair, the spike flag and the timed wipe into the dark room (s9-a caught it mid-wipe) are there.
   - synchronized.studio: the Logs card is set up to open into its page (`data-morph`), but the walk did not open it.
   - anthropic launch: no hero figure.
8. **Different from its neighbours?** The hero, yes; the rest, no.
   - No other walked page leads with a live chart full-bleed under a one-line title, and /ledger no longer matches it.
   - But /sign has the same one-line 128px "Hanzo X" with an object strip on the fold and pinned "0N / 05" chapters, and /ui and /treasury also use a one-line 128px "Hanzo X".
   - After the hero it is the Cloud 3 kit, shared with /mq, /network, /node, /o11y, /playground, /pubsub, /realtime, /registry and /s3:
     - the same `lx-display` 128px `LineMask` title;
     - `PinnedChapters` with "0N / 06" and the tick rail (9 of 10 pages);
     - a `ClipWipe` dark room with Paste and a console (10 of 10);
     - `RelatedCards`;
     - the `LaunchClose` "Get X" with its Sigil card (10 of 10).
   - None of those pages has been walked, so this comparison is from source. James: "It's not just a template."
9. **All 18 parts covered?** No; see below. The card has all 18 parts, but four of its claims fail the walk.
10. **Banned tells?** Yes:
    - cursor-following labels ("Hold"/"Run" on the chart, the crosshair's series tag, "Open" on the Logs card);
    - a floating pill bar over content on desktop, and the phone bar over text;
    - everything big at once (128 / 76 / 56 / 52 / 128px);
    - an overlap (pause × "per-tenant" on phone);
    - "01 / 06" to "06 / 06" in 13px mono set directly above each 52px chapter title (desktop).

    Clean: no hues, nothing above the h1, no opacity-only hover, no tooltips, no sound, and no console errors at either width.
11. **Copy untouched?** Yes. Parity is 59/59 text and 12/12 links. The 28 added strings are drawn demo data (the query, rows, span names, `org a`), labels ("series =", "1 more column", "alert rule") and the shared console's demo line "a build is running from the last commit on main." "a spike is the start of a question" is cut from Hanzo's own chapter four sentence. Nothing claims a new fact or number.

## Missing from the 18 parts (MASTER §2, measured; coverage card checked)
- **Coverage card:** `docs/coverage/metrics.md` covers all 18 parts as numbered paragraphs, but four claims are false:
  - Part 12, "Text contrast is 4.5:1 or better": 5 runs measure 4.1:1 at 1470, 375 and 320 ("a spike is the start of…", "gateway", "chat.completion", "datastore.query", "model.generate").
  - Part 9, "A pause control … sits first in the chart's toolbar": it comes last, after the split and the legend.
  - Part 8, "Every press scales to .97–.98": the pause never presses, and "Deploy to Cloud" has no press.
  - Part 13, "Motion is transform, opacity and clip-path only": the chart rewrites four SVG `d` attributes every frame.
- **Part 1 / 4, the sticky ask:** the bar floats over content on desktop (s2 to s11) and covers text on phone (s7, s8, s10; answer 4). On phone, "Try Hanzo" and "View on GitHub" are both solid for the first 2.5 s.
- **Part 6 / §3.1, scale:** the desktop rests at 128 / 76 / 56 / 52 / 128px against live hanzo.ai's 52 / 26. Nothing grows and then settles.
- **Part 7, the visual system:**
  - "01 / 06" sits directly above each chapter heading.
  - The table, the toolbar and the traces card are each outlined (a 1px ring) and raised (a 40–100px shadow). Part 7 says one or the other, and that only floating things take a shadow.
  - `Metrics.css` holds 33 literal hex values, most of them Apple greys outside the deck (`#1d1d1f` ×10, `#f2f2f4`, `#6e6e73`, `#8e8e93`, `#c7c7cc`), and 22px radii that are not on the token list.
- **Part 8, components:** the pause has no press. "Deploy to Cloud" and the console title barely answer. The chart animates path geometry, not transform.
- **Part 9, motion:** the cursor labels above. On phone, four chapter screens in a row (s3 to s6) do not move untouched.
- **Part 11, mobile:**
  - The chapters still pin on phone (a sticky 100svh stage with the table on top). Part 11 says stack them under 900px.
  - The pause overlaps "per-tenant".
  - Phone CLS is 0.086.
- **Part 12, accessibility:** the 5 runs at 4.1:1, all inside the traces card, which sits at `opacity: .9` until a spike. `.mt-h1 { white-space: nowrap }` on desktop, which part 12 bans. The pause is last in the toolbar's DOM.
- **Part 13, performance:**
  - The chart's per-frame path rewrites showed as 2,828 and 2,454 DOM changes on the first two desktop stops and 7,306 on phone s1.
  - The walker's grabs on the first three stops took 13–61 s at both widths (2 s for every later stop).
  - A page walked at the same time also slowed once (/iam, one 57 s stop), so part of this is the machine. Still, this is the heaviest pack so far.
- Passing:
  - structure: one h1, visible with JS off; 0 hidden text with JS off; one main;
  - layout: no horizontal scroll at 320; no text under 13/14px; no target under 44px; 0 `title=`;
  - asks and copy: 2 `data-cta` and 2 `data-thumb`; parity 59/59;
  - colour and motion: no hues; reduced motion settles (0 running after 3 s);
  - stability: the h1 box steady; desktop CLS 0; no console errors;
  - kit parts: no raw img, video or table; a Band at the end; gallery proof in `docs/gallery/metrics/`.

## Fixes (in order)
1. **Take the labels off the pointer.**
   - Set `data-cursor=""` on the chart button in `Metrics.jsx` (now "Hold"/"Run") and on the Logs card, either through a `RelatedCards` prop or `data-cursor=""` on its link.
   - Delete the crosshair's tag (`.mt-x b`, "zen · kai · enso"). Keep the line and the dot that ride the curve; the legend in the toolbar already names the series.
2. **Get the ask bar off the content.** Write `docs/requests/metrics.md` for the shared ask bar:
   - no bar at 900px and up, because the header already carries the ask;
   - on phone, keep it hidden from the dark room to the end of the page, because the close has its own "View on GitHub". Today the bar covers the console, the "Logs" title and the footer's "Open source".

   The page fails until this lands, so chase it.
3. **Give the type a rhythm.**
   - Rest the h1 at 52px. It may cut in large and settle to 52px as the chart draws, so the chart becomes the big thing on screen one.
   - Set "What a metric is here", the six chapter titles and "Send a metric, then follow it" to 26px, and "Get Metrics" to 52px. Override them in `Metrics.css` under `.mt`.
   - Drop `white-space: nowrap` from `.mt-h1`.
4. **Clear the headings and the toolbar.**
   - Move "01 / 06" below each chapter title (same words, as a caption), or into the tick rail.
   - On phone, take the pause out of the split row so it no longer sits on "per-tenant".
   - Put the pause first in the toolbar's markup.
   - Add `.mt .lx-pause:hover:active { transform: scale(.94) }` to `Metrics.css` so it presses.
5. **Make the card true.**
   - Remove `opacity: .9` from `.mt-traces` (keep the 12px lift). That brings the five 4.1:1 runs over 4.5:1 and stops the line showing through the card.
   - Pick outline or shadow for the table, the toolbar and the traces card, not both.
   - Then correct the card's lines for parts 8, 9, 12 and 13.
6. **Lighten the chart and the chapters.**
   - Draw each series once at twice the width and slide it with `translateX`, instead of rewriting four paths every frame.
   - Stack the chapters on phone (each chapter's table state above its words), as part 11 asks. Every word stays.
