# /sentinel: James-eye review

Verdict: 6/10
First complaint: "It's black and white now, good. But everything is shouting: a giant title, a giant number and a giant heading on every card. That little bar at the bottom sits right on top of the words and the buttons. And once the rain is done, nothing moves."

Reviewed: main @ `cb11693` (last page commit `4b53974`). Files hash: `be9701ade340`
Walked 7 Nov 14:40–14:48 UTC on the dev server, moving, at 1470×801 and 375×812 (videos, frame sheets and a frame-difference motion log kept by the critic; the site loader was skipped).
Proof: `img/sentinel.jpg` (desktop first screen | phone first screen).

## Since the last review
- **Done: the colour.** There are 0 hues at either width. Last time desktop had violet 65 times, red 8 and pink 9. Now the rain is light grey, the selected router chips are ink, the bad release is an ink bar, the missed cron is a dashed ink ring, and the account dots are a grey ramp.
- **Done: nothing above a headline, plus the small stuff.**
  - "SENTRY.HANZO.AI" is now a 13px mono caption under the h1 at both widths, and every "0N / 06" sits under its heading.
  - 0 text runs are under the size floor and 0 are under 4.5:1. Before, "Copy" was 13px and "03 / 06" measured 4.2:1.
  - The "hanzoai" chip now presses (0.98) and is 44px tall.
  - The close's one solid button is now "Read the docs" (it was "Deploy to Cloud"), with Deploy as a text link.
  - `docs/coverage/sentinel.md` exists, and the header has Persona, Goal and CTA.
- **Still open: the hero.** At 1470×801 the issue view still arrives 12% off the right edge at 1.08× size. Its right side, its Pause and the fourth breadcrumb are off the screen. At s1 (y=650) the words and both buttons still hang at about 20%: the darkest pixel of the h1 is 206 of 255. They also ignore clicks.
- **Still open: the back half is still.** The rain still falls through the 01/06 paragraph at both widths. The five sheet pictures have no motion of their own: phone s3–s7 have a shotdiff of 0. The dark room stops once the count lands: desktop s5 has a shotdiff of 0.
- **New since then:**
  - The shared ask pill now covers words and controls on desktop. On phone the pill is gone, and the header's "Try Hanzo" carries the ask.
  - The new scale rule fails the desktop sizes.
  - **Not in this walk:** page commit `aa30dc4` (14:40:03) reached main after the walk started. It adds sheet pictures that play once, a trickle after the count, a mask behind the 01/06 text and a resolved issue in the close. The walked `Sentinel.jsx` is the earlier file (blob `413d760`). `aa30dc4` does not change the sizes, the pill or the hero, so this verdict stands either way.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes on phone, half on desktop.
   - **Desktop:** the page paints at 0.68 s. The h1 cuts in (4 of 25 frames move in the first second), then the issue runs itself: 12 of 42 frames move in the rest of the 3 s. The count ticks from 4,211 to 4,507 over the first 13 s, the histogram shifts, and the top frame flips between `main.3f9a.js:1:88213` and `checkout/cart.ts:42`.
   - **But the desktop object is cut off.** The issue view starts at x≈726 and runs past 1470. The "source map" chip shows only its "s", and "exception" is cut by the fold.
   - **Phone:** the page paints at 0.16 s, and 15 of 25 frames move in the first second. The h1 (52px, one line), the caption, the lede, "Read the docs" and the issue's count and histogram all fit inside 812.
2. **One in, one out, or a document?** One in, one out down to the count, then a stack of still cards.
   - **Desktop dark room:** it pins for 260svh. Rain is pulled into one card as you scroll, and the count climbs: 390 at s2, 6,312 and then 7,061 at s3, 10,000 with "1 issue" at s4. That part is the page's moment.
   - **After the count lands, nothing moves.** s5 has a shotdiff of 0. Then five sheets stack 18px apart. Each holds a drawing that does not move: in s6–s9 the only change is the next sheet creeping 1–2px as the scroll settles.
   - **Phone:** the room plays by itself every 8 s (p-sheet-02/03). The sheets lie flat, and 10 of the page's 14 phone screens read STILL.
   - The phone s2 reading is the walker's fault: it tapped the rain's Pause at s1, and the room froze at "4 events".
3. **A real object in every section?** Yes, apart from the close.
   - Hero: the issue view.
   - Dark room: the rain and the card.
   - Sheets: the trace waterfall (02), the release bars with the cron row (03), four account rows (04, a list rather than a thing), the alert router (05, still the best Beyond in the group) and the fork line (06).
   - Close: Hanzo's "Paste and ship" prompt beside "Get started with Hanzo Sentinel", then "Get Sentinel" and its chips. It has no product object.
4. **One ask in the sticky header, nothing floating, scale with rhythm?** No on all three.
   - **Desktop, s2 to s10, the floating pill:** the site's pill ("Hanzo Sentinel | search | Read the docs →", x 553–916, y 727–781) floats bottom centre over the page.
     - At s6 it covers the 03/06 paragraph ("…a regression shows [up in] / …a support queue [on]…").
     - At s8 it covers the router's "New issues" chip and half of "regressions". The walker's hover on "New issues" landed on the pill.
     - At s13 it sits on the footer wordmark.
   - **Desktop s1:** the header's "Try Hanzo" is solid next to the ghost "Read the docs".
   - **Phone:** there is no bar at all. From s1 to s7 and from s10 to s13, the only solid button is the header's "Try Hanzo", a different verb from the page's "Read the docs".
   - **Scale on desktop is everything big** (this pack has no `scale` field; sizes are from the CSS at 1470 and the shots). Live hanzo.ai rests at h1 52px, section heads 26px and figures 64px.
     - h1: 116px.
     - Dark room: a 56px h2 beside a 118px "10,000".
     - Every sheet heading: 48px.
     - Close: the band head at 74px, then "Get Sentinel" at 56px.
     - Nothing settles back. The h1 only fades, the card scales just 0.94 → 1, and the 118px number stays at 118px.
   - **Phone is closer:** the h1 is 52px, headings are 32–36px, and the figure is 64px.
5. **Does every hover and press answer?** Mostly.
   - **Answer on hover and press:**
     - "Read the docs": hover, and a press to 0.98.
     - "View on GitHub": hover, and a 1px press.
     - Router "spikes", "email" and "GitHub": hover, and a press to 0.98.
     - "Copy": hover, and a press to 0.94.
     - The "hanzoai" chip: hover, and a press to 0.98.
   - **Pause:** it grows to 1.06 on hover (the walker logs JUMP; this is a scale, not a layout move), but it has no press. `.l2-pause:hover` comes after `:active` and wins.
   - **Read DEAD:** "New issues" (under the pill) and "Slack" and "Opsgenie" (under the 06/06 sheet, which had slid over the router).
   - **Phone taps:** "New issues", "regressions" and "Copy" answer. The rain's Pause stopped the rain, though the walker saw no change on the button.
   - Nothing follows the pointer.
6. **Overlap, font swap, layout shift?** None measured: CLS is 0.015 on desktop (the dark-room card) and 0 on phone. The h1 box changes once (529 ms and 441 ms, its cut-in), and there is no horizontal scroll at 375 or 320. Clashes the walker does not count:
   - the pill over text and over the router (desktop);
   - the rain through the 01/06 paragraph (both widths);
   - on phone, rain dashes spilling onto the white page under the dark room (p-shot-02, y≈670–730).
7. **Which reference, and is its motion there?**
   - apple.com product page: yes, in the pinned, scrubbed dark room.
   - anthropic.com launch: the "10,000 events / 1 issue" is a real hero figure.
   - synchronized.studio card-open: absent. No card opens into a page.
   - The stacked sheets are a scroll trick from the kit, not from a reference.
8. **Different from its neighbours?** No, and less so now that the colours are gone.
   - /visor is this page mirrored: a product panel cut off by the left edge, with a two-line 116px "Hanzo Visor", a mono caption and one black button on the right.
   - /search, /telemetry, /tunnel and /stream have the same 116px "Hanzo X", the same mono caption under it ("HYBRID SEARCH + RAG", "KAFKA WIRE PROTOCOL", "HANZO SHARE") and the same black pill button.
   - They all end on the same "Get started with Hanzo X / Paste and ship / Get X / Deploy to Cloud" band.
   - Last time one colour per page told them apart. Now that all are grey, the template shows. James: "It's not just a template."
9. **All 18 parts covered?** No; see below. The card exists, but two of its claims fail the walk.
10. **Banned tells?** Yes:
    - **Floating over content:** the ask pill covers the 03/06 text and the router's chips on desktop. The fix is shared, but the page fails.
    - **Everything big at once on desktop:** a 116px h1, 48–56px section heads, a 118px figure, and a 74px and a 56px heading back to back at the close.
    - **Dead buttons:** at s1 the hero's "Read the docs" and "View on GitHub" stay on screen at about 20% while ignoring clicks.
    - **A dead back half on phone:** the five sheets and the close never move without input.

    Clean: no hue, nothing above any headline, no opacity-only hover, no title tooltips, no sound, no model cards.
11. **Copy untouched?** Yes. Parity is 29/29 text and 3/3 links. The 27 added strings are the same demo data and labels as last time: the error and its frames, counts from 4,211, "service a" to "d", "account 1" to "4", and "when", "goes to", "opens a ticket in". "10,000" is Hanzo's "ten thousand events" in figures. For James: Hanzo's 06/06 says "Functional Source License", but the "Get Sentinel" chip says "License: BSL-1.1".

## Missing from the 18 parts (MASTER §2, measured; coverage card checked)
- **1. Strategy:**
  - The metric id sits inside the CTA line ("Metric: cta_click:sentinel.primary"), not on its own line, so the check finds none.
  - On phone, the solid ask after the hero is "Try Hanzo", not "Read the docs".
  - The licence question is not listed for James.
- **3. First impression:**
  - At 1470×801 the hero object starts cut by the right edge and the fold.
  - At s1 the hero's words and buttons hang at about 20%.
  - No card opens into a page (Morph).
- **4. Conversion:**
  - The shared pill floats over the sheets on desktop (s6, s8).
  - There is no sticky ask for the page on phone.
  - Desktop s1 shows two solid buttons: the header and the ghost.
- **6. Content:** the desktop sizes are off the deck scale (44, 52, 64, 84, 112): 116, 118, 74, 56 and 48px.
- **7. Visual system:**
  - Everything is big at once on desktop.
  - Each sheet has both a 1px outline and a shadow (`.sn2-sheet`), and the rule is raise or outline, never both.
  - It does not differ from /visor (mirror) or the rest of Cloud 4.
- **8. Components:**
  - Pause has no press.
  - The family's `Frame.css` (in this page's file list) holds 9 bare `:hover` rules and 4 raw `.x-btn` uses. `Sentinel.css` itself is clean.
- **9. Motion:**
  - The sheet pictures 02–06 do not move.
  - The dark room is still once the count lands.
  - The hero's tick runs on `useEvery`, a 140 ms `setInterval` (2 in `Frame.jsx`), not the one rAF scheduler.
- **11. Mobile:**
  - Three phone targets are 21px tall: "View on GitHub" 127×21 (twice) and "Deploy to Cloud" 132×21.
  - The router chips are 40px tall (`min-height: 40px`).
  - Rain spills onto the white under the dark room.
- **12. Accessibility:**
  - The hero's Pause sits inside the issue view's `aria-hidden="true"` wrapper, so a focusable control is hidden from screen readers.
  - The rain runs through the 01/06 body text.
- **13. Performance:** the desktop walker crawled through the dark room: 22–51 s per 2.2 s dwell on s1–s5, against 4–8 s on s6–s13. Other pages walked at the same time were slow too, so some of this is machine load. Still, 900 particles redraw every frame at up to 2× density while the room is on screen.
- **Coverage:** `docs/coverage/sentinel.md` exists in the older format: 18 numbered paragraphs, all present. Two claims are false:
  - Part 1 says "carried by the ask bar after the hero", but at 375 there is no bar, and "Try Hanzo" is the solid from s1 to s7.
  - Part 11 says "targets ≥44px", but three phone links are 21px and the router chips are 40px.

  The card also lacks the three lines above part 1 (copy questions, requested shared changes, forks deleted). Part 9's sheet motion and trickle describe `aa30dc4`, which this walk did not include. They are unverified, not counted false.
- Passing:
  - 0 hues; nothing above any headline; one h1; one main.
  - JS off has 0 hidden runs, and reduced motion settles.
  - CLS is 0.015 and 0, and the h1 box is steady. No horizontal scroll at 320.
  - 0 runs under the size floor, 0 low contrast, 0 title tooltips.
  - 5 `data-cta` and 1 `data-thumb`; no raw img, video or table.
  - No console errors. The rain's Pause works.
  - The close's one solid button is "Read the docs".
  - Parity is 29/29 and 3/3.

## Fixes (in order)
1. **Bring desktop back to Hanzo's rhythm.** Add page-local overrides under `.sn2`:
   - Set the h1 to 52px, the dark-room h2 and the sheet headings to 26px, the band head to 52px and "Get Sentinel" to 26px.
   - Let "10,000" be the one big thing. It climbs at 112px while the events fall, then settles to 64px when "1 issue" lands.
2. **Nothing over the words.** Put `data-ask-hide` on the sheets section and the dark room so the shared pill steps aside there. The request to retire the desktop pill is already in `docs/review/SYSTEM.md`. On phone, make "Read the docs" the sticky ask after the hero, not the header's "Try Hanzo". If the shared bar won't carry it, add that to `SYSTEM.md`.
3. **Start the product whole, and never ghost the hero.** Pass `travel={{ x: ['0%', '0%'], s: [1, 1] }}` to `StageHero`. Then the issue view, its Pause and all four breadcrumbs sit inside 1470×801 from the first frame. Main's `StageHero` now keeps side copy at full strength (`d5d6f10`). Confirm it at s1: a 20% button that ignores clicks must never show.
4. **Make the back half move, and keep the rain in its room.** `aa30dc4` adds the sheet pictures playing once, the trickle after the count and the black mask behind the 01/06 text. Check them on the next walk: phone s3–s7 and desktop s5 must stop reading STILL. On phone, clip the canvas to the dark room so no dashes land on the white below.
5. **Small fixes:**
   - Give the "View on GitHub" and "Deploy to Cloud" text links and the router chips 44px hit areas.
   - Give Pause a press: declare `.sn2 .l2-pause:active` after the hover rule.
   - Move the hero's Pause out of the `aria-hidden` wrapper.
   - Drop the 1px border on `.sn2-sheet` and keep its shadow.
6. **Make the card true.**
   - Rewrite parts 1 and 11 to match the walk.
   - Add the three lines above part 1, with the licence question for James: "Functional Source License" in 06/06 against the "BSL-1.1" chip.
   - Put the metric id on its own line in the header.
