# /skills — James-eye review

Verdict: 7/10
First complaint: "The top's lovely, it types Postgres and the right one lights up. But I've just read 'Cross-referenced, not duplicated' with API design, rate limiting, Redis in the panel, and then I get a big black box with the same three files again, and this time there are no words on it at all. What is that box? And everything in it is grey placeholder lines. It looks like a wireframe that hasn't loaded."

Walked 7 Nov (third critic) against `components/pages/Skills.jsx`, `Skills.css` and `skills/Lines.jsx`. Working files are in `scratchpad/critic3/skills/`: videos and notch frames in `desk/` and `phone/` (`t200/t900/t2400.png` with no input, then `s0NN.png` every 4th notch), interaction captures `int-*.png`, reduced-motion captures `rm-*.png`, and the scripts `walk.js` and `interact.js`.
- **Desktop:** 1470×801, recorded. Frames at 0.2, 0.9 and 2.4 s with no input. Then a wheel walk in 100px notches with a 140 ms dwell: 73 notches to the footer (7,170px).
- **Desktop interactions:** I sampled the hero loop every 0.5 s for 6 s. I hovered and pressed the hero ask, `hanzoai/skills`, the hero object, the install Copy, the three thread pills and Deploy to Cloud. I clicked a thread pill, sampled the stage crossfade every 80 ms, and ran a 40-stop tab crawl.
- **Phone:** 375×812 (isMobile, hasTouch, DPR 2), recorded, with the same notch walk (85 notches, 9,239px; `main` is 6,101px). I tapped the Redis pill and measured touch targets. I also checked 320×700 for horizontal scroll and 375×667 for whether the ask is above the fold.
- **Also checked:** reduced motion at both sizes (`getAnimations()` is 0 after 3.5 s, the tray sheets are in, the h1 is `none`, one scene is on), the console on 6 fresh loads plus the 2 walk loads, and the server HTML.

## What works
- **The first screen sells, and it moves within 1 s untouched.**
  - At 0.9 s the prompt is typing "P…".
  - At 2.4 s "Postgres" has woken `discover-database` and two sheets have dropped into the context tray.
  - About 3.5 s later it clears and types "comptime", which wakes `discover-zig`.
  - It is a real idle demo with an idea behind it, and it is the page's own signature. It differs at both sizes.
- **The pinned stage is a real Apple-style scene.**
  - The six points scroll on the left while one panel on the right swaps scene: frontmatter close-up, gateway pulling two files, terminal install, the trade, one file's links, a new `.md` joining the shelf.
  - Scenes 01, 02 and 06 are no longer copies of the hero.
  - The ticks now sit inside the panel and leave with it, with no orphan bar under the header (fixed since the last review).
- **Motion mixes kinds:**
  - idle: the wake loop and the thread auto-step;
  - time: typing;
  - scroll: the trade bars scrub, and the h1 settles from 112px toward 84px over the first 200px;
  - state: the stage swap and the thread pills;
  - pointer: the thread peek and the arrow nudges;
  - arrival: the h1 cut-in.
  Scroll is under half of it.
- **Every control answers, with no jump.**
  - Hero ask: the fill steps from #0a0a0a to #262626, the arrow moves 3px up and right, and press is 0.98.
  - Deploy to Cloud: the border steps from 30% to 60%, press is 0.98, and the done row slides 8px.
  - Thread pills: the hovered file now lifts 8px and scales to 1.02, and the others dim to 0.4 whatever their state (fixed since the last review).
- **The closing card is new.** It shows the install's done line (`✓ hanzo.md`), not the hero shelf a third time.
- **It is solid technically.**
  - No horizontal scroll at 1470, 375 or 320.
  - Every touch target is 44px or more, and the ask's bottom is at 350px at 375×667.
  - Copy says "Copied", and the clipboard holds exactly `npx skills add https://hanzoskills.com/hanzo.md`.
  - The tab crawl shows a 2px ring on every page stop.
  - Reduced motion shows the final state.
  - The phone hero drops the file card and caps the art (290px at y = 430).
  - The palette is clean, with no hue.

## What fails (ranked, each with a concrete fix the owner can make in the page's own files)
1. **The thread is still told twice, back to back, and the second time it has no words.**
   - Point 05 "Cross-referenced, not duplicated" shows `API design → rate limiting` in the stage.
   - About 300px later, the dark `Thread` room shows the same three files, API design, rate limiting, Redis, offset the same way.
   - The room's h2 was removed, so it is now 708px of black holding three pills and three blank cards, with no visible text that says what it is. `aria-labelledby` points at a heading the eye left a screen ago.
   - At 1470 there is also about 150px of empty black under the Redis card. At 375 the pills wrap 2 + 1, which looks ragged.
   - This is James's "too many repeats", and the page now reads as stage, then a repeat in black.
   - **Fix (`Skills.jsx`): pick one home for the thread.**
     - Best: delete `<Thread />` and make stage scene 4 the interactive one. Put the three pills (`xsk-steps`) under point 05's body copy and let them drive `.xsk-sc-link` (which file is lit, which link draws). This keeps one thing in, one thing out, and leaves one black room (the close card).
     - If the room stays: point 05's scene must become something else (for example the `→ rate limiting` link drawing out of the file's own text), and the room needs point 05's words visible inside it, so move point 05's h2 and body into `.xsk-thread-copy` and drop point 05 from the stage, ending it at five points. Then cut the room's bottom padding so the cards and pills end on one baseline, and keep the pills on one row at 375 (`flex-wrap: nowrap` with a 14px gap and 15px text, or a horizontal rail).
2. **Almost every object is grey placeholder lines, so the page reads as a skeleton.**
   - The trade bars, the stage's five pulled files, the zoom's lines 5 and 6, the link file, the new `.md` sheet, all three thread cards, and the close card's terminal (`$ ▬▬▬▬`) are all `<i>` bars at #d4d4d4 or white 10%.
   - Only the hero card and the zoom carry real text.
   - Seen moving, it looks like content that has not loaded. That is James's "lazy look", and close to a loading state on a page that is meant to look finished.
   - **Fix (`Skills.jsx` and `Skills.css`):** keep the drawn lines, but put Hanzo's own words where a real file would have them. All of these are already on the page:
     - each thread card's first line is its title, and the `→ next` link is already there; add the point 05 sentence fragment as the card's one text line;
     - the close card's `$` line should print the real `CMD` string, typed once when the card arrives (the same idea as scene 03, ending on `✓ hanzo.md`);
     - the stage's pulled files in scene 02 should carry `discover-database`'s name on the two pulled ones.
     Aim for at most one blank-line object per screen.
3. **The first paint has no h1 and no hero object.**
   - In the server HTML the h1 is `translateY(105%)` and `.xsk-hero-obj` is `opacity:0`. Both wait for hydration.
   - At 0.2 s the first screen is a lede and a button on an empty page. On a slow phone that lasts until JS runs.
   - MASTER part 3 says no `opacity:0` on the LCP element.
   - **Fix (`Skills.jsx`/`Skills.css`):**
     - Drive the hero h1's cut-in and the hero object's arrival with a CSS `@keyframes` (700 ms, ease-emphasis, 200 ms delay) on the server-rendered classes, so they play on first paint without waiting for React.
     - Or start `.xsk-hero-obj` at `opacity:1` with only the y and rotate offset (`initial={{ y: 40, rotate: 1.5 }}`).
4. **The hero object ignores the pointer.**
   - Hovering the file card and agent panel changes nothing.
   - The card sits at a fixed -1.2° tilt, with the same matrix at rest and on hover.
   - The one place the eye goes first has no pointer answer, even though JAMES asks for "tilt, cursor-aware light" there.
   - **Fix (`Skills.jsx`):** on fine pointers only, tilt `.xsk-file` up to 2.5° toward the pointer and ease it flat on leave (ease-out, 300 ms). Optionally, let hovering a shelf row light it and drop its sheets, as a preview of the loop. Turn it off under reduced motion and on touch.
5. **The stage crossfade overlaps two scenes.** Mid-switch (`desk/s028.png`), the terminal and the bars sit on top of each other at half opacity for about 150 ms, and the terminal's `$` line runs through "one monolithic guide". **Fix (`.xsk-scene` in `Skills.css`):** make the outgoing scene leave before the incoming one arrives. Use `.past` to translate it −16px and fade it in 150 ms, and delay `.on` by 120 ms. Or swap with a `clip-path: inset()` wipe instead of a pure crossfade.
6. **There is a white gap before the footer.**
   - About 160px of empty white sits between the closing card and the footer at 1470 (`desk/s064.png`), and about 145px at 375.
   - MASTER part 3 says to end on the `Band`, then the footer with no gap.
   - **Fix (`.xsk-get` in `Skills.css`):** set its bottom padding to 0, or to the 44px step.
7. **Smaller points.**
   - The trade heading sits low-left with about 250px of empty paper above it, while its bars float top-right. Bottom-align them on the 8/5 grid (`align-items: end` on `.xsk-trade-grid`), so the heading's last baseline meets the `CONTEXT` label.
   - The phone page is still about 7.5 screens of `main` (6,101px). It is better than 10.6k, but with the thread room folded into point 05 (fix 1) it drops by another screen.

## Not counted against the page (shared)
- **The red "1 Issue" badge (hydration mismatch)** appeared on both walk loads but on none of 6 further fresh loads. Earlier critics traced it to the shared footer's `__html`.
- **The header** shows a grey glass smear over content while scrolling (`desk/s004.png`, `s012.png`, `s064.png`).
- **The phone header ask** stays "Try Hanzo", while desktop swaps to "View on GitHub".
- **The cookie card** is about 200px at 375 and covers the hero tray on first load.
- **The `Copy` button** (shared `ui.jsx`) has no hover change: the computed style is identical at rest and hover.
- **"Paste and ship"** (`A2Paste`) is shared v2.
