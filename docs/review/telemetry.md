# /telemetry: James-eye review

Verdict: 5/10
First complaint: "It's yellow, with red on top. I said greys, silvers, blacks and whites, and here the boxes, the tags, the code highlights and even the glow are yellow. There's a little label stuck on the headline again. And on my phone, after the top, it's the same code file six times with nothing moving."

Reviewed: branch `claude/laughing-hamilton-uisesd` @ `cd5ee2a` (merged to main at this commit; later branch commits only move the shared hero, chapters and close files into `v2/x-hamilton/`, which this walk did not see). Files hash: `e5edfd07ed87`
Walked 7 Nov 14:01–14:04 UTC on the dev server, moving, at 1470×801 and 375×812 (videos, frame sheets and a frame-difference motion log kept by the critic; the site loader was skipped).
Proof: `img/telemetry.jpg` (desktop first screen | phone first screen).

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** The words are clear ("Hanzo Telemetry / The collector that sits between your app and wherever the data goes"). The title is 128px on one line at line height 0.92 and cuts in by line mask. The collector under it runs by itself: spans come in one at a time, six tiles fill, a batch leaves as "6 spans · 1 request", the memory bar climbs to the ceiling and the input says "refused". That is the best hero motion in the Cloud 4 group. Desktop still misses the 1-second test: 0 of 25 frames change in the first second after paint. On the dev server the body is blank under the header for about 2 s, as on every page walked, and only then does the title cut in and the collector start (8/55 moving frames in the rest of the 3 s idle, 9/47 in the first dwell). At 1470×801 the collector starts at about y 495, so you see its top 300px. The memory bar and the ceiling, which show "a memory ceiling", sit below the fold. Phone is better: the collector's input column peeks under the button with a chip moving (11/25 moving frames in the first second, 53/59 after).
2. **One in, one out, or a document?** Desktop starts right. The hero pins, the copy fades and the collector rises and grows into the centre (s1, s2). Then the dark room "One hop you control" pins a config file on the left and one fact on the right, with that fact's block lit. That is the Apple move, but it broke in the walk:
   - The file sat on 01 for two whole screens (y 4467 and 5117; 0/45 moving frames at 4467). It then jumped to 05 at 5767 and 06 at 6417.
   - 02 "Traces, metrics and logs", 03 "Batching" and 04 "A memory ceiling" never appeared on desktop.
   - Pressing the rail's 04 moved the page 2019→3706 and the file still read 01.

   After the chapters, "Put it in front of your backend" opens on a near-empty white screen: the heading alone at the left, with the picker below the fold (s7 frames). Phone is a document: the chapters stack as six blocks, each with its own copy of the same 20-line config. From s3 to s10 nothing visibly moves (largest frame change 1.4; 3 of those 8 screens measure STILL).
3. **A real object in every section?** Mostly. The hero has the running collector: a drawn diagram of three boxes, not Hanzo product UI, but it does exactly what the copy says. The chapters have the config file, which is code in a window and is repeated six times on phone. "Your config" is a working object: the toggles rewrite the file, and Copy turns to "Copied" on phone. "Get Telemetry" has no object, only big type and two chips.
4. **One ask, sticky after the hero?** No.
   - The hero has one solid button, "View on GitHub" (magnetic). On desktop it stays only while the hero is pinned (s0–s1). From s2 on, the only sticky solid is the global header's "Try Hanzo", so no page ask follows you.
   - Phone: the header's "Try Hanzo" and the bottom bar's "View on GitHub →" are two solid asks on every screen from s2 to s11.
   - The close's solid button is a third verb, "Deploy to Cloud".
   - When on, the seven "Your config" toggles (traces, metrics, logs, gRPC, HTTP, batching, memory ceiling) are solid black pills drawn like the primary button: seven equal black buttons on one screen (s7 desktop, s10 phone).
5. **Every hover and press answers?** No.
   - "View on GitHub" (hero): the hover answers (magnetic), but there is no press state.
   - Chapter rail "01": dead hover. Rail "04": opacity-only hover (banned: "buttons that fade on hover"). Both press to 0.98, and pressing jumps the page by 1,700px.
   - Config pills "traces", "metrics", "gRPC" and "memory ceiling": dead hover. They press to 0.96.
   - The "hanzoai" chip and "Deploy to Cloud": the hover answers, but there is no press.
   - Phone taps on "traces", "logs" and "Copy" all answer.
   - Apart from the two magnetic buttons, nothing follows the pointer.
6. **Overlap, font swap, layout shift?** Layout shift on desktop: CLS 0.119, over CANON's 0.1 fail line (the lab target is 0.02). The shift comes from the hero's batch list (0.065), the config window (0.059), the memory bar (0.051) and the signal tags (0.051). Phone CLS is 0.007. The h1 box is steady (one reading: 940×123 at top 218 on desktop, 343×108 at 216 on phone). No overlaps were measured, and there is no horizontal scroll at 375 or 320.
7. **Which reference, and is its motion there?** apple.com product page: the stage that settles as you scroll and the pinned file with one block lit per fact. Both are there, but on desktop half the chapters were skipped. motion.dev: the magnetic primary and the "OTLP OUT" list sliding as batches land. anthropic launch: no hero figure. synchronized.studio card-open: absent, because nothing opens into its page.
8. **Different from its neighbours?** No. It is the Cloud 4 kit:
   - The hero is the same `StageHero look="split"` as /billing.
   - The first screen matches /tunnel: a 128px "Hanzo X" on the left, the lede and a black button on the right, a product strip under them. /metrics and /ledger have the same strip on the fold.
   - The "01 / 06" pinned chapters in one dark room are the same `PinScenes` as /search and /billing.
   - The "● X.HANZO.AI" eyebrow is the same as on /search, /sentinel and /metrics.
   - The close (Paste and ship, Get Telemetry, licence chip, hanzoai chip, Deploy to Cloud) is the same as on every Cloud 4 page.

   Amber is what tells it apart, and /treasury uses the same amber (hue 45). James: "We don't want every page being the same."
9. **All 18 parts covered?** No; see below. `docs/coverage/telemetry.md` is missing.
10. **Banned tells?** Yes:
   - Amber UI hue throughout, declared in the file as "Accent: OTel amber" (`--ac: #f2a900`). It colours the collector tiles, the "trace" chip and tag, the first batch card, the chapter numbers, the pipeline strip, the lit config lines and keys, "YOUR CONFIG", the agent prompt's caret and the eyebrow dot. Desktop counts: 75 text, 14 background and 8 border uses. This breaks JAMES.md rule 7.
   - An amber glow under the config window in the dark room.
   - Red: the "refused" chip, the memory bar when full, and the "ceiling" word and line.
   - A "● TELEMETRY.HANZO.AI" eyebrow above the h1 (22px above on desktop, 24px on phone).
   - Opacity-only hover on the chapter rail, and dead hovers on rail 01 and four config pills.
   - The same amber as /treasury ("repeated colours across pages").
11. **Copy untouched?** Yes. Parity is 29/29 text and 2/2 links. The 35 added strings are demo data and labels: YAML keys, "otlp in · grpc · http", "6 spans · 1 request", "your config", "signals", "protocols", "builder.yaml", "my-collector". None is a new sentence or claim. One caution: config.yaml and builder.yaml are the builder's own text (Telemetry.jsx: "a standard OpenTelemetry collector config with placeholders, not a Hanzo default"), and the Copy button hands them to visitors as if Hanzo had published them.

## Missing from the 18 parts (PLAN-COMPONENTS §2.1–2.18, measured)
- **2.1 Strategy / 4 Common gate:** no `Persona:`, `Goal:`, `CTA:` or metric id in the page header. Phone shows two solid asks on every screen, and the page uses three verbs.
- **2.3 First impression:** with JS off, the h1 shows but 8 text runs are hidden: the lede, "View on GitHub", the eyebrow and the collector labels. Plan 2.3 is P1. On desktop the walk skipped chapters 02–04. "Put it in front of your backend" opens on an empty white screen. No card opens into its page (Morph row).
- **2.4 Conversion:** 0 `data-cta`. The thumb bar's verb ("View on GitHub") differs from the close's ("Deploy to Cloud"). 4 raw `.x-btn` uses (plan: `Cta` only).
- **2.6 Content:** "Copy" is 13px at both widths and "Agent prompt" is 13px on phone (phone floor: 14px). Phone prints the same 20-line config six times.
- **2.7 Visual system:** the amber, the red and the amber glow break the 0-hue override, and the amber is the same as /treasury's.
- **2.8 Components:** 9 bare `:hover` rules. The rail and config pills have dead or opacity-only hovers. "View on GitHub", "Deploy to Cloud" and "hanzoai" have no press state.
- **2.9 Motion:** 2 `setInterval` timers (Frame.jsx). The running collector has no pause control (2.12, WCAG 2.2.2). A rail press jumps the page instead of scrubbing the chapter. The phone chapters never move. Reduced motion is good: everything comes to rest.
- **2.11 Mobile:** the "hanzoai" chip is 111×36, under 44px.
- **2.12 Accessibility:** "Your config" measures 1.8:1 contrast. The collector has no pause control.
- **2.13 Performance:** desktop CLS is 0.119, over the 0.1 fail line in `budgets.json`.
- **2.16 Developer experience:** the copyable config is not Hanzo's text. James must approve it, or it comes out of the Copy button.
- **Coverage:** `docs/coverage/telemetry.md` is missing on the branch.
- Passing: one h1, one main, no horizontal scroll at 320, no raw img/video/table, no native selects or `title=` tooltips, reduced motion comes to rest (0 running after 3 s), phone CLS 0.007, h1 box steady.

## Fixes (in order)
1. **Take out the amber and the red:**
   - Fill the collector tiles with white or silver on the black panel.
   - Make the "trace" chip and tag and the first batch card grey.
   - Show the chapter numbers, the pipeline strip and the lit config lines in white, with a white left rule.
   - Make "YOUR CONFIG" grey and the caret ink.
   - Delete the amber glow under the config window.
   - Make "refused" an inverted ink chip, and draw the ceiling line and the full memory bar in white or ink. The word "ceiling" carries the meaning.
2. **Delete the "● telemetry.hanzo.ai" eyebrow above the h1.** Keep the address inside the collector panel, beside "COLLECTOR", so parity holds. Render the lede and "View on GitHub" visible in the server HTML.
3. **Fix the chapters:**
   - Desktop: every screen of scroll must move the file to the next fact, 01 to 06, with none skipped. A rail press scrubs to that chapter in place instead of jumping the page.
   - Phone: pin the config once at the top of the dark room and light each chapter's block, instead of printing the 20-line file six times. Let the lit block slide between lines so the phone middle moves.
4. **One ask.** Put "View on GitHub" in the hero, in a desktop sticky bar after the hero, in the phone bar, and as the one solid button in the close. "Deploy to Cloud" becomes the text link beneath. Draw the "Your config" toggles as outlined pills with an ink check when on, so they stop reading as seven black buttons.
5. **Make every control answer, and stop the shift:**
   - Rail ticks: on hover the tick widens and shows its chapter title (no opacity fade).
   - Config pills: the border turns ink on hover.
   - "View on GitHub", "Deploy to Cloud" and "hanzoai": press to scale 0.98.
   - Give the "OTLP OUT" list and the memory bar fixed heights, so desktop CLS drops from 0.119 to under 0.02.
6. **Break the template.** Give /telemetry a first screen that /billing and /tunnel don't have. For example, run the collector the full width of 1470×801 (your app at the left edge, the backend at the right) with the title over it and the memory ceiling in view. Fill the empty "Put it in front of your backend" screen by moving the "Your config" picker beside the heading.
