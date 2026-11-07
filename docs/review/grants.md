# /grants — James-eye review
Verdict: 7/10
First complaint: "After the steps there's a big empty gap, and then 'what you receive' is just a list of text with little ticks. There's nothing to look at. And at the end you fill in the form and it goes straight into the footer. It just stops."
(walked 7 Nov 2026, HEAD 3ce53893 (grants files unchanged since d7ce999c), at 1470×801 and 375×812, plus 375×667 and 320×700. Moving: arrival bursts at 150/400/700/1000 ms, idle hashes of the hero field, wheel steps of 400px with 450 ms dwells and again with 1.1 s dwells, hover and press on the asks, the pause control, the ledger and the sheet asks, a 30-stop tab crawl, reduced motion, JS off, offline. api.hanzo.ai was intercepted with a 503, so the only submits were an empty one that stopped at validation and one that failed on the 503.)

## What works
- **Round 4's two blocking bugs are fixed.**
  - The track chip is now 201×50 at 1470 and 333×44 at 375, `position: absolute`.
  - Clicking track 3 glides it x 695 → 782 → 1023 → 1088 → 1105 in about 300 ms.
  - The selected track reads at a glance: a white chip with an ink outline (`d-form.png`).
- **The desktop header ask swaps.** With 1.1 s dwells, the header reads "Try Hanzo" (outlined) over the hero, then "Apply for a Grant" (solid #0a0a0a) from y 720 on. It turns outlined again while "Submit Grant Application" is on screen (y 4320 to 5040). That is one solid fill per screen.
- **Arrival.**
  - The h1 is 52px Zen 497 at y 280–394 and nothing sits above it.
  - The ask's bottom is at 606 on desktop and at 447 at 375×667.
  - The contour field changes on every idle frame (4 of 4 hashes differ). Paused, it holds still (4 of 4 hashes the same).
- **The scrubbed timeline.** The line goes scaleX 0.24 → 0.69 → 1, and the steps light 1 → 3 → 4.
- **The stacked sheets.**
  - Sheet 01 pins at 96 and goes to scale 0.92 with a 0.50 dim while 02 slides over it.
  - 02 pins at 120, then 03 lands at 61.
  - On phone the sheets lie flat and the dim layer crosses 0 → 0.55 → 0.
- **Every press answers.**
  - Hero ask: #0a0a0a → rgb(44,44,46) on hover, scale 0.98 on press, 0.4px of movement.
  - Sheet ask: the border goes to ink on hover and the arrow moves.
  - Pause control: fills to rgb(245,245,247), scale 0.97 on press.
  - Ledger row: `::before` 0 → 1 on hover, and the tick redraws.
- **The form.**
  - An empty submit focuses `name` and shows "Please fill in your name, email, and project / research summary."
  - A 503 keeps "Test Person" in place and shows "Your application did not reach us… grants@hanzo.ai." No success appears.
  - Offline disables the submit and shows the same line.
  - The filing card fills as you type.
- **Reduced motion:** the sheets have transform `none`, there are 0 dim layers, all 4 steps are lit, 0 animations are running, and the field is still.
- **JS off:** 0 headings, paragraphs or links are hidden.
- **Layout:** CLS is 0.0011 on desktop (all from the shared header cluster) and 0 on phone. scrollWidth is 320 at 320.
- **A hero ask click:** 0 new tabs, `#apply` lands at top 89.

## The 11 answers
1. **Sells in 5 s, moves within 1 s?**
   - Yes, the field moves untouched.
   - But in server HTML, the lede and primary wrapper (`style="opacity:0;transform:translateY(16px)"`) and `.xgr-art` (`opacity:0`) wait for hydration. On this dev box they became visible 1.5 to 3.0 s after commit (4 loads).
   - At 1 s the first screen is the h1 alone on an empty left half (`d-arrive.png`).
2. **One in, one out?** Mostly yes: the timeline, then the stack. Two air pockets break it:
   - 232px between "01 / 04" and "What Grant Recipients & Interns Receive" (How `padding-bottom` 116 + Gets `padding-top` 116).
   - About 300px of black above sheet 01 (Ways `padding-top` 161.7 + head + stack margin).
3. **A real object in every section?**
   - Hero: the field.
   - How: the line and dots.
   - Sheets: the 64px "2,137+" and the chips.
   - Apply: the filing card and the track control.
   - **Receive is still text rows with 18px ticks**: the weakest screen, and James would call it a list.
   - Sheet 01's left column is two-thirds empty between "01" and "2,137+".
4. **One ask, sticky; scale rhythm?**
   - The desktop header carries "Apply for a Grant" after the hero, but only once the scroll settles: with brisk 450 ms dwells it read "Try Hanzo" from y 339 to y 5621, all the way down.
   - The phone header keeps "Try Hanzo" (solid after the hero), which the card admits.
   - Scale holds: 52 / 26 / 21 / 64 / 32.
5. **Every hover and press answers?** Yes, the track chip included now. On desktop, "Explore Repositories" and "Research Access Questionnaire" are 40px tall (fine pointer, acceptable).
6. **Overlaps, font swap, layout shift?**
   - No font swap and no page-owned overlap.
   - The shared cookie card covers about 50% of the 375 screen on a first visit (shared).
   - The dev "1 Issue" hydration badge showed in 2 of 9 loads and did not reproduce in the 7 dedicated ones. The last review traced it to the shared footer.
7. **Which reference, and is its motion there?** Yes: the apple.com chapter stack (pinned sheets scaling 1 → 0.92 and dimming) and an apple-like scrubbed timeline, both measured. There is no editorial asymmetry: every section is heading-left, content-right.
8. **Different from neighbours?** Yes: the stack, the timeline and the filing card. The hero (a contour field in an outlined grey card) is the shared Sigil look.
9. **All 18 parts?** No. There is no proof strip or `Band` before the footer (the card admits this), and one card line is false (below).
10. **Banned tells?** None hard.
    - The hero is an outlined card, but it is not static.
    - The dark room is full-bleed at once rather than entering as a rounded card.
11. **Copy untouched?** Yes. Parity is unchanged since d7ce999c (57/57 text, 5/5 links), and the files are unchanged.

## Card check (docs/coverage/grants.md)
- TRUE:
  - one h1 at 52px; sheet numbers 64, titles 32;
  - track chip 201×50 at 1470, and it glides;
  - nothing above the h1;
  - the field moves and has a pause;
  - reduced motion shows the final state;
  - JS off is legible;
  - Privacy Policy sits beside the submit;
  - the first bad field takes focus;
  - a failed submit keeps its values and shows no success;
  - offline disables the submit and shows the grants@hanzo.ai line;
  - no scroll at 320;
  - in-page asks stay in the tab;
  - one dark room;
  - the `data-cta` ids are present.
- **FALSE**, part 11 "Every target 44px or more": the `grants@hanzo.ai` link inside `.xgr-err` measures 114×19 at 375 (touch).
- **Partly true**, part 4 (unticked) "desktop: the header carries 'Apply for a Grant' after the hero": true once the scroll settles about 1 s; under continuous scrolling it still reads "Try Hanzo".
- **Missing**, part 3 "JS off: no `opacity:0` on the LCP element": the lede and primary are `opacity:0` in server HTML until hydration. JS off is covered by `NoJs`, but the slow-JS arrival is not.

The false part 11 line caps this at 7. Beyond the cap, the Receive screen, the air pockets and the missing ending also keep it under 8.

## Fixes (in order)
1. **Error link target:** in `Grants.css`, add `.xgr-err a { display: inline-block; padding: 12px 0; margin: -12px 0; }` (the same trick as `.xgr-mail a`) so `grants@hanzo.ai` is 44px tall. Re-measure at 375.
2. **Hero arrival without JS gating:** replace the `motion.div initial={{ opacity: 0, y: 16 }}` around the lede and asks, and the one on `.xgr-art`, with a CSS keyframe (`animation: xgr-in .5s cubic-bezier(.16,1,.3,1) .3s both`), so the primary is visible from server HTML. Freeze it under reduced motion and under `html:not(.js)`.
3. **Air:** `.xgr-how { padding-bottom: clamp(40px, 5vw, 72px) !important; }`, which takes the How → Receive gap from 232 to about 188. Trim `.xgr-ways` `padding-top` to `clamp(72px, 8vw, 116px)`.
4. **Give Receive an object:** without new copy, make the ledger one thing to look at. For example, the four rows as a single `#f5f5f5` sheet (radius 24, no outline) whose rows light in sequence with the timeline's ink. Or keep `.xgr-gets-l` sticky and let the left column hold a large row index (`01 / 04` in 64px Zen 220) that counts with the active row as you scroll. Either way it should be something with a moment, not text rows.
5. **Ending:** after `#apply`, add one quiet proof strip in the page's own words ("2,137+ repositories · 122 organizations", from `WAYS[0][2]`), or note on the card why there is no `Band` and accept the cap on part 3.
6. **Sheet 01's empty column:** move `.xgr-facts` up under the number (`.xgr-sheet-o { justify-content: flex-start; }`), or let the figure grow from 44 → 64px as the sheet pins, so the column has a moment instead of a void.
7. **Header swap lag (request, shared):** the shared Ask settles only after about 1 s of rest. Ask its owner to swap on an IntersectionObserver for `[data-cta="grants.hero"]` instead of on scroll idle.
8. **Card:** correct part 11 (after fix 1), note the hydration-gated hero in part 3 (after fix 2), and record this review in part 18.
9. **Optional, for 8+:** the dark room enters as a rounded card inside the gutters and opens to full width as it is reached (MASTER 3.1).
