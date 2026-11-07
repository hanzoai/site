# /skills — James-eye review

Verdict: 7/10
First complaint: "The top's great, it types Postgres and the right skill wakes up, and the pinned bit is nice. But then I get the same thing twice: the three files, API design, rate limiting, Redis, with 'Cross-referenced, not duplicated' on it, and the very next screen is a big black box with the same heading and the same three files. Then the shelf shows up again at the bottom. It starts to feel like a template repeating itself."

Walked 7 Nov (second critic) against `components/pages/Skills.jsx`, `Skills.css` and `skills/Lines.jsx`. Working files are in `scratchpad/critic2/skills/`: videos in `desk/` and `phone/`, notch frames `desk/s*.png` and `phone/s*.png`, interaction captures `int-*.png`, scripts `walk.js`, `interact.js`, `hyd2.js`.
- **Desktop:** 1470×801, recorded. Frames at 0.2, 0.9 and 2.4 s with no input, then a wheel walk in 100px notches with a 140 ms dwell, a frame every 400px, 77 notches to the footer (7,398px). I hovered and pressed the hero ask, `hanzoai/skills`, Deploy to Cloud and the three thread pills, clicked API design, and pressed Copy (the clipboard held exactly `npx skills add https://hanzoskills.com/hanzo.md`). I sampled the hero loop every 0.5 s for 10 s, the trade scrub at five scroll offsets, and the stage scene at each of the six points.
- **Phone:** 375×812 (isMobile, hasTouch, DPR 2), recorded, the same notch walk (98 notches, 10,591px), tap on the thread pills, and touch-target sizes.
- **Also checked:** reduced motion (`getAnimations()` is 0 after 3.5 s, the h1 is at `none`, every room screenshotted), the console on 9 fresh loads, `scrollWidth` at both sizes, and a tab crawl.

## What works
- **The first screen sells, and it moves within 1 s untouched.** The h1 cuts in by its line mask. The file card settles from a 1.5° tilt. The prompt types "Pos…" by about 0.5 s, `discover-database` lights, two sheets drop into the context tray, it rests, then "comptime" wakes `discover-zig`. Frames at 0.2, 0.9 and 2.4 s all differ, at both sizes. It is an idle demo with an idea behind it, and it is the page's own signature.
- **The essay is now a real pinned stage (Apple).** The six points scroll on the left while one panel on the right swaps scene at each point (I measured scene 0 to 5 switching exactly with points 0 to 5). The progress ticks fill, and a grey highlighter strikes each key line once. This fixes the last review's top complaint: it is no longer a document.
- **Motion is varied.** Idle (the wake loop, the thread auto-step), time (typing, the terminal line typing), scroll (the trade bars scrub 0 to 1 between the section entering and reaching the top), state (the stage swap, the thread pills), and arrival (the h1 cut-in). Scroll is under half of it.
- **The hero ask answers properly.** Hover steps the fill from `#0a0a0a` to `#262626` and nudges the arrow 3px up-right. Press scales it to 0.98. Deploy to Cloud gets a border step and the same arrow nudge. Nothing jumps.
- **The palette is clean,** with no hue and two dark rooms (the thread room and the closing card), not back to back.
- **It is solid technically.** No horizontal scroll at 1470 or 375. Touch targets are 44px or more. Copy says "Copied" and copies the displayed text. Reduced motion shows the final state (sheets in the tray, lit shelf row, all headings visible). The tab crawl shows a 2px ring on every stop. The page's own console is clean.
- **The phone hero is fixed.** The agent panel comes first and is moving by 0.9 s at y = 450, so the first 812px holds the h1, the lede, the ask, the repo link and the live prompt.

## What fails (ranked, each with a concrete fix the owner can make in the page's own files)
1. **The same idea and object appear twice in a row (point 05, then the thread room). The hero's pieces also come back a third time.**
   - Point 05 "Cross-referenced, not duplicated" shows the three stacked files, API design → rate limiting → Redis.
   - About 300px later, the dark `Thread` room repeats the same heading as an h2, with the same three stacked files offset the same way.
   - Live hanzo.ai prints that heading once (`content/live/skills.json`). So the page also doubles a Hanzo heading, which is close to a copy change.
   - Scene 01 is the hero's file card again and scene 02 is the hero's agent panel again. The closing card's shelf is the hero shelf a third time.
   - This is James's "too many repeats" and breaks "one thing in, one thing out".
   - **Fix (`Skills.jsx`):** pick one home for the thread.
     - Either (a) delete the `Thread` section and make stage scene 4 the interactive one: move the three pills (`xsk-steps`) under point 05's copy, and let them drive `.xsk-sc-thread` (`at`, `peek`).
     - Or (b) keep the dark room but give point 05 a different object, and drop the duplicate h2 in the room (`aria-labelledby` can point at the point 05 heading).
     - In the closing card, swap the repeated `<Shelf />` for something not yet seen, such as the terminal's done line with `hanzo.md` and the tick, or the new-file `.md` sheet from scene 6.
2. **The phone page is long and stacked: 10,591px, about 13 screens.**
   - The hero art is 738px, twice the 45svh budget (365px), because the file card is stacked under the agent.
   - Then each of the six points carries its own full-size object (`.xsk-pt-vis`, around 500 to 600px each), and four of them repeat objects already seen in the hero.
   - **Fix (`Skills.css`, `@media (max-width: 899px)`):**
     - Hide the file card in the hero on phone (`.xsk-hero .xsk-file { display:none }`), since point 01 shows it.
     - Cap `.xsk-hero-obj` at `max-height: 45svh`.
     - Cap `.xsk-pt-vis` at about 280px with `transform: scale()` on the scene inside, cropped at true size (or show only the three scenes that are not hero repeats: 03 terminal, 04 bars, 06 new file).
3. **The thread room is mostly empty black, and its hover tells you almost nothing.**
   - At 1470 the copy is a 26px h2 and three pills floating mid-left, with about 350px of empty black under it and ragged empty space above the cards.
   - Hovering a pill that is already pressed (API design, rate limiting) changes nothing visible, neither the pill nor the card (computed styles identical at rest and hover). Only Redis previews.
   - The room also enters with a hard horizontal edge, where MASTER 3.1 has a black room enter as a rounded card inside the gutters and open to full width.
   - **Fix:** if the room stays (see 1b):
     - Cut its padding so the cards and copy share a bottom-aligned 8/5 block.
     - Make `peek` always do something: scale the peeked card to 1.02 and lift it 8px, and dim the others to 0.4, whatever their `on` state.
     - Wrap the room in a `clip-path: inset(0 var(--g) round 24px)` that scrubs to `inset(0)` as it reaches the top.
4. **The stage's progress ticks are left behind.** After point 06 the sticky stage unpins and the six tick bars ride up alone under the header, over 170px of empty white, before the dark room (`desk/s048.png`). **Fix (`.xsk-stage`/`.xsk-ticks`):** end the sticky stage with its scenes (put the ticks inside `.xsk-stage-in`'s bottom edge), and trim `.xsk-essay`'s bottom padding so the next room follows directly.
5. **The scale runs large for a resting page.**
   - The h1 is 112px at 1470 and 72px at 375. The deck's resting h1 is 52px, and the phone brief is 40px.
   - "Skills" is one word and it is the moment, so it is acceptable on desktop. But nothing settles back down, and at 72px on the phone it pushes the live object down.
   - **Fix (`.xsk-h1`):** on phone use `clamp(52px, 14vw, 64px)`. On desktop, optionally scale it from 112px to 84px over the first 200px of scroll (a transform on `.xsk-hero-copy`), which gives the "starts big and shrinks" rhythm James asked for.
6. **Smaller points.**
   - `Follow a thread` (kicker) and `The thread` (`aria-label`) are not in Hanzo's copy or in `content/ui-strings.json`. The kicker is a 1px box, so it is invisible, but it is still invented text in the DOM. Remove it, or take the string from the register.
   - Mid-flight, the tray sheets cross the `CONTEXT` label (`desk/t2400.png`). Start their path below the label, or raise the label's `z-index`.

## Not counted against the page (shared)
- **The red "1 Issue" badge** on most loads is a hydration mismatch in the shared footer's `__html` (`<footer class="is_View _paddingInline-...">`), not this page's tree. I confirmed this on 5 of 6 domcontentloaded loads. Another chat's `ZenCatalog.jsx` parse error also surfaced once.
- **The phone header ask** stays "Try Hanzo", while desktop swaps to "View on GitHub" once the hero ask leaves the screen.
- **The header** shifts a few px vertically while scrolling.
- **"Paste and ship"** (`A2Paste`) is shared v2.
- **The cookie card** is 203px at 375.
