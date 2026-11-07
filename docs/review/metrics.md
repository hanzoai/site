# /metrics: James-eye review

Verdict: 7/10
First complaint: "It opens on two grey boxes, and half of the big one is four empty bars. The bit that should sell it, the spike opening its traces, happens for about a second while the title is still coming in, then I wait nine seconds to see it again. And when I click to hold it, it calls a flat line a spike."

Reviewed: branch `claude/elegant-johnson-b2vx1q` @ `9898ac2` ("/metrics to MASTER"). Files hash: `cff889445647` (sha256 of `Metrics.jsx`, `Metrics.css` and `app/metrics/page.jsx`).
Walked 7 Nov 14:15–15:05 UTC on the dev server, moving, at 1470×801, 375×812 and 390×664 with iPhone 13 touch emulation, plus 320 wide. The page and the standard both changed during the walk: `998e143` became `9898ac2` at 14:54, and JAMES.md and MASTER.md changed at 14:37–14:41. Everything below was measured again on `9898ac2` against the current JAMES.md and MASTER.md. The once-per-visit loader was skipped. Videos, frame sheets and scripts are kept by the critic.
Proof: `img/metrics.jpg` (desktop first screen | phone first screen, both 3 s after load, which is the state most visitors see).

## What the rework fixed (checked, not assumed)
- **Orange and green:** gone. No page element has chroma; `taste.py` passes. The one hue on screen is a blue social icon in the shared footer.
- **Eyebrow over the h1:** gone. `metrics.hanzo.ai` now sits in the toolbar.
- **The h1:** it is in the server HTML, cuts in by CSS at first paint and reads with JS off. It sits at 52px / 497, the new resting size.
- **One solid per viewport:** held at all 26 desktop stops and all 31 phone stops. The header's "Try Hanzo" turns to an outline while either "View on GitHub" is on screen. Nothing floats over content.
- **JS off:** the h1, all six chapters, the Paste prompt and the close all read. Only UI state is hidden.
- **Reduced motion:** `getAnimations()` is empty at 3 s, on the composed frame (spike under the cursor, traces open).
- **Small fixes:** contrast passes, except the deliberately faded rows in chapter 06. There are 0 `title=` in the page, 0 bare `:hover` and 0 `setInterval`, and a 44px pause control with `aria-pressed`. There is no horizontal scroll at 320. Desktop CLS is 0.0005.
- **Parity:** I re-ran it: 59/59 text, 12/12 links.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Mostly.
   - Movement: at 1470×801 the title, lede, ask, toolbar and the whole chart tile (y 327–727) fit, and the line moves from 0.5 s.
   - The problem: the sale is the spike opening its traces. That plays from 0.5 to 1.7 s, while the h1 is still cutting in and the line is still drawing, then not again until about 9.4 s.
   - Measured: the open state lasts about 1 s in every 9.4 s. The code comments say "every seven seconds" in `page.jsx` and "every ten seconds" in `Metrics.jsx`.
   - For the other ~8 s the right third of the hero (443×400) is a grey panel of four empty bars under "A SPIKE IS THE START OF A QUESTION".
   - Phone: 375×812 shows the chart and the top of the traces panel. At 390×664 the whole chart fits.
2. **One in, one out, or a document?** Half.
   - The six points are one pinned table, the right Apple move, but the table barely changes. The intro and 01/06 show the identical table, because `Table` ignores the intro flag.
   - 01→02 only greys some rows, and 04 ("The number leads somewhere", the page's own signature idea) only tints row one. That is about 5.5 screens of scroll with one object changing by row weight.
   - After it, the page stacks a black room, a card and the close.
3. **A real object in every section?** Yes, but two of them are not this product.
   - The hero has the chart and traces, and the chapters have the table.
   - The black room's object is the shared `LaunchConsole` with gateway / payments-api / checkout-web / docs-site. /cloud/ai-metrics uses the same four projects as its hero. Nothing in "Send a metric, then follow it" sends or follows a metric.
   - "Related" and the close are two grey Sigil tiles back to back.
4. **One ask in the sticky header, nothing floating, scale with rhythm?**
   - **Ask: half.** One solid per screen and no floating bar, but the sticky header carries "Try Hanzo" (signup) while the page's ask is "View on GitHub". MASTER part 4 says the hero ask's label also sits in the header. The page has filed this as a request (`docs/requests/metrics.md` #1). The metric id `api_key_created` matches neither ask.
   - **Scale: yes.** h1 52, chapter intro 44, chapter titles 32, room heading 26, and "Get Metrics" grows from 26 to 64 as you reach it. On the first screen, though, the one big thing is a flat grey tile that is half empty.
5. **Every hover and press answers?** Mostly. These do not:
   - Clicking the chart scales the whole 709×400 chart to .98, through the global `:where(button):active` rule: a jolt on the hero object.
   - The crosshair is a hairline and a dot that tell you nothing. They name no series, show no preview and change nothing in the traces.
   - "Hold" freezes the chart but keeps the flag and "traces for that window" at the fixed 62% cursor, even over a flat stretch of line. Seen at both widths, it says "spike · zen" over nothing.
   - The console's "Metrics — Hanzo" link has no hover and no press: Frame's `:hover` colour is beaten by LaunchConsole's colour. The console icons and the close's text links have no press.
   - Rail ticks widen on hover and press, and a click scrolls smoothly, which is fine.
6. **Overlap, font swap or layout shift?**
   - Desktop is clean: CLS 0.0005, no overlap at 1470×801 now that the crosshair label is gone, and the h1 box is steady.
   - **Phone:** in chapter 03 the object grows from 344 to 379px, so the words drop 35px and jump back at 04. CLS on the 375 walk is 0.027 (0.014 + 0.012, both `lx-pin-copy`).
   - Chapter crossfades on the phone briefly overlay the old and new titles.
7. **Which reference, and is its motion there?**
   - apple.com: the pinned table is there, but its panel change is too faint to carry the scene.
   - synchronized.studio: "Logs" is a real link with `data-morph`, but /cloud/logs' hero (big "Logs" and a black terminal) is not the grey Sigil card you clicked. On the dev server the click showed white for about 0.9 s, then the page, and I could not see a flight.
   - No anthropic-style hero figure.
8. **Different from its neighbours?** In idea, yes. On screen, not enough.
   - The skeleton is the Cloud 3 kit's: a 52px "Hanzo X" top left, ask under it, then a flat #f5f5f5 tile, the same as /mq and /o11y.
   - /dashboards, its own family neighbour, opens on a line chart in a tile with mono pill tabs.
   - The black room's console is the same one /cloud/ai-metrics opens with.
9. **All 18 parts covered?** Not yet. The card is present and ticks 18/18, but several ticks overstate (see below).
10. **Banned tells?** Two small ones:
    - "01 / 06" … "06 / 06" in 12px mono capitals sits 16px above each chapter headline. MASTER bans "an eyebrow above a headline", and /realtime moved its numbers under the headline.
    - The empty traces panel reads as a plain grey box ("a lazy look") for most of each cycle.
    - Clear of the rest: no hue, no green, no Inter, no floating bar, no cursor label, no fade-only hover.
11. **Copy untouched?** Yes: parity 59/59 and 12/12. The added UI strings are not in `content/ui-strings.json`: "a spike is the start of a question", "spike · zen", "1 more column", "series = models", "In a time-series database", "Here", "one query" and "kept as a rule". "traces for that window" and "org from your token" are Hanzo's.

## Missing from the 18 parts (MASTER part 2, measured on 9898ac2)
- **1 Strategy:**
  - The header ask, "Try Hanzo", differs from the page ask, "View on GitHub".
  - The metric `api_key_created` is fed by neither ask.
- **3 First impression:**
  - The signature beat lands while the h1 is still arriving, then holds an empty panel for ~8 s.
  - The intro and chapter 01 show the same object.
  - There is no proof strip before the close.
  - The morph destination's hero is not the card.
- **4 Conversion:**
  - The sticky ask is not the page's label (a shared request is open).
  - `lib/cta.js` does not exist (shared).
- **6 Content:**
  - Phone text under 14px: the close facts are 13px ("License: Apache-2.0", "hanzoai/metrics 4 stars"). The Paste labels and the "Copy" button label are 12px.
  - The 12px mono capitals elsewhere are allowed by the deck.
  - Eight UI strings are outside the register (answer 11).
- **7 Visual:** a kicker sits over each of the six chapter headlines.
- **8 Components:**
  - The chart's press is the global .98 scale.
  - The crosshair hover tells nothing.
  - The console title link has no hover or press.
  - The text links have no press.
- **9 Motion:**
  - The signature runs for ~1 s in 9.4 s.
  - The hold shows a false "spike".
  - No sound (the shared kit is not built yet, JAMES 10).
- **11 Mobile:**
  - The chapter-03 jump of 35px.
  - The phone table hides the `kind` column, so "One store, not four" shows name / value / tenant only, and the metric/trace/log point is lost.
- **12 Accessibility:** the faded "other tenants" rows in chapter 06 are 1.3:1 text, 12 runs. Mark them removed (`aria-hidden`, or a strike at 3:1+) rather than leave them as faint text.
- **13 Performance:** phone CLS 0.027 from the chapter-03 jump.
- **17 States:** every load shows the red dev "1 Issue" badge. It is a hydration mismatch in the shared `FooterHTML`, also on /ledger, not this page's code, but it fails DONE #3 until the owner fixes it.
- **Coverage card overstates:**
  - "Sticky ask in header and bar after the hero, same label": it is "Try Hanzo", and there is no bar.
  - "No other page in the group opens on a chart": /dashboards does.
  - "Every control has hover, press…": not the console title or the text links.
  - "Title lands within 12px": not verified.
- **Passing:**
  - One h1 and one main.
  - `data-cta` on both asks, and `data-thumb`.
  - No raw img, video or table.
  - Taste OK, parity OK.
  - No h-scroll at 320.
  - Targets of 44px or more at 375.
  - JS off legible.
  - Reduced motion settles.
  - Desktop CLS ≈ 0.

## Fixes (in order)
1. **Make the signature land and stay true.**
   - Start the first spike after the line has drawn (about 1.6 s). Hold the traces open about 3 s, and cycle every 5–6 s, not 9.4.
   - Never show blank bars: between spikes, keep the last spike's traces in place, dimmed, as "the last question".
   - On click, hold the moment under the pointer: scrub so the nearest spike lands under the cursor, or move the cursor to it. The flag must never say "spike" over a flat line.
2. **Give the hover something to say without floating.**
   - When the crosshair is over a series, light that series in the toolbar legend (zen / kai / enso goes ink).
   - Preview that window's traces in the right panel, faint, until you click.
   - Exempt `.mt-field` from the global press scale and let the flag answer the press instead.
3. **Make the pinned table change once per chapter, visibly.**
   - Intro: the rows arrive.
   - 01: metric, trace and log rows sort into one store.
   - 02: the query morphs into pills (this one works).
   - 03: a column slides in per label.
   - 04: replay the hero beat. Row one's spike opens the same trace waterfall inside the table.
   - 05: the query lifts into the "alert rule" chip.
   - 06: other tenants' rows collapse away.
   - Move the "0N / 06" numbers under the headlines.
4. **Fix the phone chapter jump and keep the point on phones.**
   - Give `.mt-tab` one fixed height at ≤899px, equal to its tallest state, so the words never move.
   - Keep the `kind` column on phones and drop `value` instead.
   - Raise the close facts and the Paste labels to 14px.
5. **Break the template where it shows.**
   - Give the black room a Metrics object: the agent prompt runs `hanzo metrics query` and the hero's chart receives the point, instead of the shared four-project console /cloud/ai-metrics also opens with.
   - Make the first screen differ from /dashboards and /mq: for example, the chart tile full width with the traces opening under the spike, not a fixed side panel.
6. **Settle the ask.** Either the header carries "View on GitHub" (request #1 to the `Ask.jsx` owner) or the page decides its Launch ask is "Try Hanzo". Then make the metric id match the ask. Correct the coverage card's overstated ticks and the two comments about the spike timing.
