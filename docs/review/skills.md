# /skills — James-eye review

Verdict: 6/10
First complaint: "The top is lovely: you watch it type Postgres and the right skill wakes up. Then it turns into a document. Six blocks of text with big grey numbers, one after another, nothing to look at. And at the bottom there's a lonely heading on one side and a black box on the other."

Walked 7 Nov against `components/pages/Skills.jsx` and `Skills.css`. Working files are in `scratchpad/critic/skills/` (videos in `video-desk/` and `video-phone/`, frames `desk-*.png`, `phone-*.png`, `rm-*.png`, `ph-*.png`).
- **Desktop:** 1470×801, recorded. Frames at 0.2, 1.0, 2.5 and 5 s with no input, then a wheel scroll in 100px notches with a 140 ms dwell and a frame every 400px, all the way to the footer (6,336px). I hovered and pressed the hero ask, the 3 thread pills, both Copy buttons, Deploy to Cloud and the card's `hanzoai` link. I clicked Redis, then API design, and pressed Copy (it said "Copied").
- **Phone:** 375×812 (isMobile, hasTouch), recorded, with the same notch walk (frames every 400px) and the thread, trade and get rooms checked on their own. I also checked 320 for horizontal scroll.
- **Also checked:** reduced motion (`getAnimations()` after 3.5 s, plus each room scrolled into view), the console and the dev badge on 5 loads, and the computed styles of every h1/h2 and the element above it.

## What works
- **The hero object is real and runs on its own.** Within about 0.5 s the prompt types "Post…". `discover-database` lights and slides 8px, two sheets drop into the context tray, then it rests and types "comptime" and `discover-zig` wakes. This is idle motion with an idea behind it, and it sells in 5 seconds on desktop.
- **Motion has more than one kind.** Idle (the wake loop and the thread auto-cycle), time (typing), scroll (the trade bars scrub and the highlighter strikes once) and state (the thread pills). Scroll is clearly under half of it.
- **The palette is clean.** It uses ink, greys and one black room. The "yellow highlighter" in the header comment has been overridden to `#e4e4e9`, and I saw no hue.
- **Nothing scrolls sideways.** `scrollWidth` equals the viewport at 1470, 375 and 320.
- **The visible kickers above headings are gone.** The `.a2-kick` labels (`hanzoai/skills`, `01 / 06`, `Follow a thread`) compute to a 1px-high box, so nothing shows above the h1 or the h2s.
- **Copy works.** The install command and the agent prompt both copy, and the label changes to "Copied".
- **The sticky ask swaps on desktop.** It reads "Try Hanzo" (outline) at the top and "View on GitHub" (solid) once the hero ask leaves the screen.

## What fails (ranked, each with a concrete fix the owner can make in the page's own files)
1. **The essay is a document wall, so the page breaks "one thing in, one thing out".**
   - `Essay` is about 2,500px of six text blocks. Each is a ghost numeral (`#ededed`, up to 200px), a 26px h2 and a 19 to 23px paragraph, separated by gaps of `clamp(96px, 11vw, 180px)`.
   - No point holds a real object apart from 03's terminal. This is what James called "an overload of information" and "a dead sort of page".
   - **Fix (`Skills.jsx` `Essay`, `.xsk-points`):** make it a pinned stage on desktop. Pin one panel on the right that reuses the hero's pieces and changes per point:
     - 01: the `hanzo.md` file;
     - 02: the shelf waking;
     - 03: the install terminal;
     - 04: the trade bars;
     - 05: the thread cards;
     - 06: a new blank file dropping onto the shelf.
   - The six texts scroll past on the left. Drop the ghost numerals, or shrink them to a 12px `01 / 06` caption below each heading. Under 900px, stack each point with its own small object. The words stay identical.
2. **Under reduced motion, two headings never appear.**
   - "Coverage costs context. / This is the trade." and "Get started / with Skills" stay at `translateY(36.9px)` (105%) inside their line mask, so they are invisible (`rm-trade.png`). The hero h1 is fine because it passes `now`.
   - **Fix (`Skills.css`):** in the existing `prefers-reduced-motion` block add `.xsk .a2-ln-in { transform: none !important; }`. Or pass `now` to those two `A2Lines` when `useReducedMotion()` is true.
3. **The thread cards overlap each other's text, at both sizes.**
   - The inactive cards sit later in the DOM, at `opacity: .25`, on top of the active ones. The faded "Redis" label prints through the body of the "rate limiting" card (`desk-s040.png`, `ph-thread.png`).
   - **Fix (`.xsk-f`):** make the card fill opaque and fade only its contents (`.xsk-f > * { opacity: .25 }` when not `.on`). Give the cards `z-index: calc(3 - var(--i))` so earlier cards sit on top, or reverse the offset so no label lands on another card's lines.
4. **Hover barely answers.**
   - The hero ask on hover changes only its border, from `#0a0a0a` to `#2c2c2e`, which you cannot see on a black fill.
   - Deploy to Cloud and the card's `hanzoai` link don't change at all.
   - On the thread pills, hover makes the grey text 7% lighter.
   - Nothing tells you anything.
   - **Fix:**
     - Give the hero ask and Deploy a visible hover in the page CSS (an inner arrow or label nudge of 4px, or the fill stepping to `#262626` / `#e5e5e5`), keeping the 0.98 press.
     - Make the thread pills preview: hovering "Redis" lifts its file card to full opacity before the click.
     - Give `.xsk-get-meta a` a 1px underline, offset 3px, that appears on hover.
5. **On the phone, the first screen goes still after the h1.**
   - At 375 the moving part (`.xsk-agent`) starts at y = 950, below the fold. The first screen holds the h1 at 96px, the lede, the ask and the top of a static file card. Its frames at 1.5 s and 3 s are identical.
   - **Fix (`@media (max-width: 900px)`):** put the agent panel first in `.xsk-wake` (`order: -1` on `.xsk-agent`), and hide the file card's prose, or move it after. Bring `.xsk-h1` down to about 72px so the typing prompt and the lit shelf row land inside 812px.
6. **The hero sheets overshoot, and springs are banned.**
   - `.xsk-sheet` uses `cubic-bezier(.34, 1.4, .64, 1)`, a visible bounce. The shelf and essay timings are ad hoc (`.4s`, `.5s`, `.7s`, `1.1s`).
   - **Fix:** use the deck's `ease-emphasis` `cubic-bezier(.16,1,.3,1)` at 300 to 500 ms for the sheets and shelf. The highlighter can stay a scene move at 900 ms.
7. **The closing room is two things that don't talk.**
   - "Get started / with Skills" (32px) sits alone in seven empty columns. Opposite it, a black card's h2 "Get Skills" (44px) outranks it.
   - Two solid fills are on screen at once: the header's "View on GitHub" and the card's "Deploy to Cloud".
   - **Fix:**
     - Put the heading directly above or inside the card's column, or bottom-align them on the 8/5 split with the card as the object.
     - Set the card's h2 to 26px or lower so the section heading leads.
     - Make "Deploy to Cloud" the quiet (outline) style here, since the page's one solid ask is GitHub.
8. **The trade room is mostly empty paper.**
   - About 800px of `#fafafa` holds a 32px heading and two bars. The five "reads" are blank squares.
   - **Fix:** tie it to the hero. Size the bars against the context-tray width, or label the five squares with the shelf's style of blank rows so it reads as five small files against one long one. Cut the top padding so the bars arrive with the heading.
9. **An intermittent hydration mismatch shows the red "1 Issue" badge.**
   - I saw it on 2 of 5 loads. The phone console logged "A tree hydrated but some attributes of the server rendered HTML didn't match the client properties".
   - **Fix:** load with the overlay open to find the attribute. Check the hero `motion.div` `initial` (`rotate: 1.5`) and the shelf `className` string, which renders `' blank'` with a leading space and `'on'` without a separator. If it comes from the header, file `docs/requests/skills.md`.
10. **The hero h1 is 191px at 1470.** The resting h1 is 52px, and 112px is the top of the deck scale. "Skills" is one word and it is the one big thing, so this is lower priority. Still, `clamp(88px, 13vw, 200px)` should cap at 112px, which also helps fix 5.
11. **Smaller points.**
    - The repo link `hanzoai/skills` is in a 1px-high kicker, so a real link is effectively invisible. Per part 7, set it below the lede as a 13px caption link.
    - On the phone, the header ask stays "Try Hanzo" while desktop swaps to "View on GitHub". If that comes from `data-thumb`, check that the phone header reads it too.
    - The point 05 heading "Cross-referenced, not duplicated" appears again as the thread room's h2. Keep the copy, but consider making the thread room the visual for point 05 (see fix 1) so it reads once.
