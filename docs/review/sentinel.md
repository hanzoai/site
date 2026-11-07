# /sentinel: James-eye review

Verdict: 6/10
First complaint: "It's still purple. I said greys, silvers, blacks and whites, and the rain, the bars, the buttons and the customer dots are still purple and pink, with red on top. The little label is still stuck over the headline. And after the rain it's five still pictures in a stack."

Reviewed: main @ `dfe5ff5` (last page commit `486d6d0`). Files hash: `670aa11a3d68`
Walked 7 Nov 14:19–14:21 UTC on the dev server, moving, at 1470×801 and 375×812 (videos, frame sheets and a frame-difference motion log kept by the critic; the site loader was skipped).
Proof: `img/sentinel.jpg` (desktop first screen | phone first screen).

## Since the last review
- **Done: one ask per screen.** The shared ask bar now carries "Read the docs →". On desktop it is fixed at y=734 on screens s3 to s11, and on phone it is the bottom bar on s2 to s8. While it shows, the header's "Try Hanzo" turns to an outline, so each of those screens has exactly one solid button. Last time phone had two solid buttons on every screen and desktop had no page ask at all. Still open: the close's solid button is "Deploy to Cloud", a different verb from the bar's.
- **Done: presses and JS-off.** The hero's "Read the docs" and "View on GitHub" and the close's "Deploy to Cloud" now press to 0.98. "Copy" now answers the hover and presses to 0.92. With JS off, 0 text runs are hidden (it was 8). The "hanzoai" chip still has no press.
- **Open: colour and the label.** The hue counts are exactly the same as last time: violet 65 on desktop (24 fills, 28 text, 13 borders), red 8, and violet-to-pink account dots 9. `--ac: #7a5af8` and the rain's `#9d86ff` are still in the code, and "● SENTRY.HANZO.AI" still sits 24px above the h1 at both widths.
- **Open: the ghosted hero and the late product.** The shared hero still fades the words and buttons to 16% and turns off their clicks below 20%. At s1 (y=650) both buttons sit at y=563 at 16% and ignore clicks. Because they count as "on screen", the ask bar also stays away, so that screen has no working solid button. The issue view still arrives 22% off the right edge at 1.16× size.
- **Open: everything else from last time.** The sheet pictures 02–06 still have no motion of their own (`Pic` has none). The rain still runs through the 01/06 paragraph. "03 / 06" and "05 / 06" are still 4.2:1, "Copy" and "Agent prompt" are still 13px, and the chip is still 36px tall. There are still 10 bare `:hover` rules and 2 `setInterval` timers, and there is no coverage file. The page's own files changed by 7 lines, a reduced-motion hydration fix; everything that got better came from the shared kit.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Mostly. The words are clear ("Hanzo Sentinel / Error tracking and performance monitoring"), and the live issue view sits beside the title at 1470×801. On phone its top ("4,350 events · 1 issue") shows at the fold. The page appears at about 2.0 s (the usual dev-server blank), and then the view runs itself. The count ticks up from 4,221 (4,328 by 5.5 s), the histogram shifts, and the top frame resolves from `main.3f9a.js:1:88213 · t.a()` to `checkout/cart.ts:42 · applyDiscount()`. Desktop has 10 of 51 frames moving in the rest of the 3 s idle, and phone has 14 of 25 in its first second. But on desktop the card still lands 22% off the right edge and 16% too big. At first sight its right side runs off the screen and its breadcrumbs sit under the fold, and it only settles as you scroll. The movement is small: digits and thin lavender bars.
2. **One in, one out, or a document?** Half, and the same as last time. The hero pins for 601px while the words fade and the card settles. The dark room is the real one in, one out: violet rain falls past a faint card and is pulled into it as you scroll, the count climbs to 10,000 and the "1 issue" chip lands. On phone it plays by itself every 8 s (7,315 → 8,485 → 9,031 → 10,000 in the film). Then on desktop five sheets (02–06) slide up over each other, 18px apart. Each one is a still drawing beside a paragraph, and nothing in them moves unless you tap the router in 05/06. On phone the sheets lie flat, so 02–06 read as five cards in a column. Once the count lands, the particles freeze inside the card and the dark room is still. The desktop film fell behind the walk again (about two screens by the end) and never reached the "Get Sentinel" block, so stillness is read from the phone film and the code.
3. **A real object in every section?** Hero: yes, the live issue view. Dark room: yes, the rain and the card. 05/06: yes, the alert router, still the best Beyond in this group. Every pick reads back as a sentence ("A regression goes to PagerDuty and opens the ticket in Jira"). 02/06 (trace bars) and 03/06 (release bars and the cron row) are fine drawings, but they are static. 04/06 is four rows from "account 1" to "account 4" with coloured dots: a list, not a thing. 06/06 is a grey curve with two dots, close to an icon. The close has an agent prompt with a blinking violet caret and the "Get Sentinel" type, and no object.
4. **One ask, sticky after the hero?** Nearly. The hero has "Read the docs" (solid) and "View on GitHub" (outlined). From s3 to s11 on desktop and s2 to s8 on phone, the bottom bar's "Read the docs →" is the only solid button. Three things still break it:
   - At s1 on desktop the only solid-looking buttons are the hero's two ghosts at 16%, and they ignore clicks.
   - For one screen after the hero (desktop s2, phone s1), the solid ask is the header's "Try Hanzo" before it hands over to "Read the docs".
   - The close's one solid button is a third verb, "Deploy to Cloud".
5. **Every hover and press answers?** Mostly, now. These hover and press to 0.98: "Read the docs", "View on GitHub" and "Deploy to Cloud". "Copy" hovers and presses (0.92). The router pills show a border on hover, press to 0.96 and update the sentence. Phone taps on "New issues", "regressions", "GitHub" and "GitLab" all answer. The "hanzoai" chip hovers but has no press. "email" and "GitHub" read DEAD at s10 only because the 06/06 sheet had slid over the router and the pointer landed on it. The magnetic pull on "Read the docs" and "Deploy to Cloud" is the only thing that follows the pointer: no tilt, no preview, no cursor-aware light.
6. **Overlap, font swap, layout shift?** None measured. CLS is 0 at both widths. The h1 box changes once (439 ms on desktop, 542 ms on phone, its cut-in) and then holds. There is no horizontal scroll at 375 or 320. Two visual clashes the walker does not measure:
   - The rain falls straight through the 01/06 paragraph, so the body text is read through a curtain of violet dashes.
   - On desktop the new ask bar's "Read the docs →" sits on the bottom-left corner of the "Paste and ship" card at the close.
7. **Which reference, and is its motion there?** apple.com product page: the pinned, scrubbed dark room is there, and it is the page's moment. anthropic.com launch: the 120px "10,000 events / 1 issue" is a real hero figure. synchronized.studio (a card opens into its page) is absent; the close has no related card at all. The stacked sheets are a scroll trick from the kit, not from a reference.
8. **Different from its neighbours?** Less than last time.
   - /visor now uses the same side stage mirrored: a product panel arriving from the edge on one side and a two-line 128px "Hanzo X" on the other.
   - /search centres its title over a blue search box, /telemetry puts the lede beside the title with an amber collector under it, and /tunnel puts an orange terminal on the fold.
   - After the hero it is the kit: the "● X" eyebrow with a coloured dot (all five pages), one dark room with "01 / 06", numbered chapters to 06, and the "Get started with Hanzo X / Paste and ship / Get X / Deploy to Cloud" close.
   - What tells the pages apart is one colour each: violet here, blue /search, amber /telemetry, orange /tunnel, pink /visor. That is the one-accent-per-page rule James replaced. James: "It's not just a template."
9. **All 18 parts covered?** No; see below. `docs/coverage/sentinel.md` is missing.
10. **Banned tells?** Yes:
    - Violet UI hue throughout, declared in the file as "Accent: issue violet" (`--ac: #7a5af8`, rain `#9d86ff`). It colours:
      - the TypeError tag, histogram and "exception" dot;
      - the rain, the card's glow and the "1 issue" chip;
      - the chapter numbers, and the trace, profile and release bars;
      - the cron dots, the selected router pills and the prompt caret.
      Counted 65 times on desktop and 24 on phone (h255). JAMES.md rule 7: the UI has 0 brand hues.
    - Red (#e5484d) on the bad release bar and the missed cron dot (h360, 8 counts).
    - Violet-to-magenta-to-pink account dots (`hsl(255…321)`; h270/h300/h315, 9 counts).
    - The "● SENTRY.HANZO.AI" eyebrow 24px above the h1, at both widths.
    - Dead buttons: the hero's two buttons stay on screen at 16% while ignoring clicks.
11. **Copy untouched?** Yes. Parity is 29/29 text and 3/3 links. The 27 added strings are demo data and UI labels, the same set as last time:
    - the error, frames and breadcrumbs, and counts from 4,211;
    - "service a" to "service d", "account 1" to "account 4", production/staging;
    - "when", "goes to", "opens a ticket in", "1 issue".
    "10,000" is Hanzo's own "ten thousand events" in figures, and the fork label lifts Hanzo's 06/06 sentence. None is a new claim. For James, not the builder: Hanzo's 06/06 says "Functional Source License", while the "Get Sentinel" chip says "License: BSL-1.1". Both are on the page and they disagree.

## Missing from the 18 parts (PLAN-COMPONENTS §2.1–2.18, measured)
- **2.1 Strategy / 4 Common gate:** no `Persona:`, `Goal:`, `CTA:` or metric id in the page header. The solid ask changes verb three times down the page: "Try Hanzo" for one screen, then "Read the docs", then "Deploy to Cloud".
- **2.3 First impression:** at 1470×801 the hero object starts cut off by the right edge and the fold. For one screen after the pin, the hero's words and buttons hang at 16%. No card opens into its page (Morph).
- **2.4 Conversion:** 0 `data-cta`. The close's solid button ("Deploy to Cloud") differs from the bar's verb ("Read the docs"). On desktop the bar covers the corner of the "Paste and ship" card.
- **2.6 Content:** "Copy" is 13px at both widths and "Agent prompt" is 13px on phone (floor 14). In `Sentinel.css` the "release 1" to "release 6" labels and the "source map" chip are 12px on desktop. The rain crosses the 01/06 paragraph.
- **2.7 Visual system:** violet, red, magenta and pink break the 0-hue override. A violet glow sits under the dark-room card.
- **2.8 Components:** 10 bare `:hover` rules and 4 raw `.x-btn` uses in the page's files. The "hanzoai" chip has no press.
- **2.9 Motion:** 2 `setInterval` timers (`Frame.jsx`). The sheet pictures 02–06 have no motion of their own, and the desktop dark room is still once the count lands. Reduced motion is good: everything comes to rest.
- **2.11 Mobile:** the "hanzoai" chip is 36px tall (111×36), under 44px.
- **2.12 Accessibility:** "03 / 06" and "05 / 06" in violet measure 4.2:1, under 4.5:1. The ticking issue and the rain have no pause control (WCAG 2.2.2).
- **2.13 Performance:** the step into the dark room took 5.7 s to paint, against 1.0–2.1 s for the others (it was 8.4 s). The desktop film fell about two screens behind the walk. The canvas still redraws 900 particles every frame at up to 2× density while the room is on screen.
- **Coverage:** `docs/coverage/sentinel.md` is missing.
- Passing: one h1, one main, no horizontal scroll at 320, no `title=` tooltips, no native selects, no raw img/video/table. JS-off is legible (0 hidden runs), reduced motion settles, CLS 0 and the h1 box is steady. There is one solid ask per screen through the body at both widths.

## Fixes (in order)
1. **Take the violet, red and pink out.**
   - Set `--ac` to ink.
   - Draw the histogram, the trace, profile and release bars and the cron dots in greys. Mark the slow span, the bad release and the missed cron with ink weight or a hatched fill.
   - Make the rain white at low alpha and the "1 issue" chip an inverted ink chip.
   - Fill the selected router pills with ink and make the account dots grey.
   - Drop the violet glow under the card and the violet caret.
2. **Delete the "● SENTRY.HANZO.AI" eyebrow above the h1** (drop the `kick` prop on `StageHero`). The address already sits in the issue view's toolbar.
3. **Never leave a ghost button, and start the product whole.** Either keep the hero buttons at full strength until they scroll away, or fade them fully out at the end of the pin so the "Read the docs" bar takes over on the next screen. Never leave a 16% button that ignores clicks. Pass `travel` to `StageHero` so the issue view starts at its settled size and fully on screen at 1470×801.
4. **One verb to the end.** Give the "Get Sentinel" block "Read the docs" as its one solid button, with "Deploy to Cloud" and "View on GitHub" as the outlined row. Put `data-ask-hide` on the "Paste and ship" block so the bar stops covering its corner. Give the "hanzoai" chip a press of 0.98 and a 44px hit area.
5. **Make each sheet's picture play once when it lands, then hold.**
   - The slow span grows across the trace.
   - Release 5 drops while the others stand.
   - The cron row ticks and misses one.
   - The four accounts arrive one by one.
   - The fork line draws itself.
   After the count lands, keep a slow trickle of new events falling into the card so the dark room stays alive.
6. **Keep the rain off the words, fix the small stuff, write the coverage.**
   - Mask the canvas behind the 01/06 copy so the paragraph sits on clean black.
   - Make the "0N / 06" numbers ink (this also fixes the 4.2:1).
   - Set "Copy" and "Agent prompt" to 14px.
   - Add `docs/coverage/sentinel.md`.
