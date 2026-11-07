# /auto — James-eye review

Reviewed 2026-11-07, walked moving at 1470x801 and 375x812 (Playwright, wheel 400px every 700 ms, rest shots 1 s apart, hover and press on 11 controls). Proof: `docs/review/auto/desktop-first.jpg`, `desktop-walk.jpg`, `phone-first.jpg`, `phone-walk.jpg`.

Verdict: 6.5/10

First complaint: "The editor at the top is a good idea, then the page goes quiet. A list of headings, some grey bars in a black box, letters in white tiles, four words in a row. It's tidy, but it reads like a template for a docs page, not a product you want to open."

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Mostly. At 1.0 s the two runs are already stepping (step 3/5, Postgres filled). "Hanzo Auto" plus "Workflow automation in one binary" plus the editor sells it. But at 300 ms the stage is blank white below the header. The hero spreads into three columns: h1 at left, a 17px lede stranded mid-screen at x≈747, the asks hard right. With about 230px of empty headroom above the h1 (top 298px), the eye has no path. The "record vs goroutine" difference only shows when a pod is rescheduled, every other run, so in the first 5 s you see two identical lanes stepping together.
2. **One in, one out?** No, it reads as a document. Hero, then a 6-row accordion, then a black figures room, then a tile grid, then the band. Nothing pins, nothing hands over to the next object. Between the editor and "A run that survives the restart" there is a dead white gap of about 250px with nothing in it (desktop-s01).
3. **A real object in every section?** Partly. Hero: yes, a real editor with two lanes. Accordion: the open item's visual is a toy. "Watch it live" is a black box with "server-sent events" and four grey skeleton bars, and "Durable execution" is three grey rows plus a "record" bar. Figures room: four words plus a small dashed "container" diagram, fine. Connectors: 12 white tiles with a single mono letter as the "logo" (S Slack, G GitHub, G Gmail, G Google Sheets). That is a plain box, not an object.
4. **One ask, sticky after the hero?** One solid fill per viewport holds: "Open Auto" in the hero, then "Open Auto" inverted in the band. The page bar is off, so nothing floats over content. Good. Scale: h1 52, section h2 26, the open accordion title grows to 44 in its moment, figures 64. Rhythm is there, though the figures room puts four 64px words side by side, and on phone "Apache" fills its column to the gutter edge.
5. **Every hover and press answers?** Mostly. Primary darkens and presses at 0.98. Pause, accordion, connector tiles, Copy and close all change fill or border and press at about 0.97. Weak spots:
   - "Documentation" and "Deploy to Cloud" showed no measured change in background, colour or border on hover. Only the press moves 1px; if the arrow moves, it is very small.
   - "Restart the pod" sits at opacity 0.4 most of the time, so it looks disabled. It still works when pressed (the "POD RESCHEDULED" overlay appears) and does not change on hover.
6. **Overlap, font swap, layout shift?** CLS 0.0002 on desktop and 0 on phone. No horizontal overflow at 375 or 1470. No font swap seen.
   - On the first walk (both sizes) a hydration-mismatch console error fired, along with the red "1 Issue" badge. Five later loads did not reproduce it, so it is intermittent. Check it.
   - Pause control is 36x36 on desktop.
7. **Which reference, and is its motion there?** Nearest is an apple.com product page "one idea, product as hero", but none of apple's pinned scrubbed scene is here. There's nothing from osply/hamol (no asymmetric editorial scale, no pointer-aware detail) and no tilt, magnetic or cursor-aware light. Motion kinds:
   - idle: the hero lanes;
   - state: the accordion grow, connector tiles adding to a 1-2-3 chain;
   - time: the scripted run;
   - arrival: the h1 cut-in.
   - Pointer motion is missing and nothing is tied to scroll, so the page is varied but thin.
8. **Different from its neighbours?** Only just. /automations also opens light with a mono caption under the h1, a dotted flow canvas with a pause button, and a grid of connector tiles. /auto's two-lane race is its own idea, but the rest of the page shares /automations' vocabulary (canvas, tiles, chain chips).
9. **All 18 parts covered?** The card has 18 headings, each with a Done-here line. Claims that do not match the page:
   - Part 9 says "scroll only in the pinned scene"; I found no pinned scene.
   - Part 10 says each loop has "a 44px pause button"; it is 36px at 1470.
   - Part 16 ticks "Terminal pauses and ends on a static frame", but there is no terminal.
   - Part 12 admits a measured 1.41:1 contrast run and calls it mid-transition. Re-measure at rest.
10. **Banned tells?**
    - A "lazy look" in the connector tiles: single-letter glyphs in plain white boxes.
    - Skeleton bars as the "Watch it live" visual.
    - The fake window chrome (three grey dots) on the editor is a cliché but tolerable.
    - No hue, no eyebrow above the h1 (the AUTO.HANZO.AI caption sits below it), no gradient text and no Inter.
11. **Copy untouched?** As far as I can see. Headings and body match the live wording. "Restart the pod" is used only as an aria-label and is listed as a copy question.

## Fixes (ordered, most important first)
- **Make the hero race show the difference in the first 5 seconds.** Reschedule the pod on the first run, around 2.5 s, not every other run. The goroutine lane should visibly drop back to "step 1/5" while the record lane holds "step 3/5". Replace the full grey scrim over both lanes (it blacks out the object) with a short hairline "pod rescheduled" marker across the lanes. Show "Restart the pod" at full ink, not 0.4, so people see it is pressable, and give it a hover fill.
- **Replace the toy visuals inside the accordion.** "Watch it live" needs an actual event stream: mono lines arriving one by one from the run (`step.started`, `step.done`…) built from the editor's own nodes, not 4 grey bars. "Durable execution" should show the record rows filling with a tick per step, then surviving a restart. Each open item should hold one small live object, not a static box.
- **Give the connector grid real marks.** Use the mirrored product logos (greyscale, 20–24px), or failing permission, drop the letter glyphs and make the tiles quiet text rows. Make the 1-2-3 chain at left a drawn path (hairline connectors that draw in 300 ms) so adding a tile visibly re-flows a workflow.
- **Tighten the hero and close the dead gaps.**
  - Pull the h1 baseline up to about 38% of 100svh; it sits at about 44% now, with roughly 230px of blank headroom.
  - Put the lede under the h1 in the left column, not stranded centre-screen. Keep the asks right, aligned to the h1's baseline, so the hero reads h1, then lede, then ask, then editor.
  - Cut the about 250px empty band between the editor and "A run that survives the restart" so the next section peeks into the hero (56px).
- **Add one pointer move and one scroll-tied move, then fix the small breaks.**
  - Add a pointer-aware detail, for example the editor tilting up to 2.5° or a node lighting under the cursor on fine pointers. Add one scrubbed or pinned moment, for example the figures room counting or cutting in each word as it is reached.
  - Phone:
    - Stack the two lanes so both are visible side by side as compact 5-dot rows; today only one lane fits a screen and the comparison is lost.
    - Size "Apache" down so it clears the column gutter.
  - Desktop:
    - Make the pause button 44px.
    - Chase the intermittent hydration-mismatch error and its red badge.
  - Card: correct the part 9, 10 and 16 claims.
