# /visor: James-eye review (round 3)

Walked 7 Nov 16:58–17:06 UTC on the dev server (page files last touched in `d970b219`, "visor wip"). I walked it moving at 1470×801 and at 375×812 (touch). I scrolled by wheel in 0.6-screen steps and dwelt 2.4 s untouched on every screen, comparing frames at 0, 0.5 and 2.4 s. I hovered and pressed every control in `main` and Tab-crawled the whole page with 0.9 s settles. I opened, stepped and closed the card Sheet with the keyboard, and drove the naming tool. A PerformanceObserver logged layout shift, and the h1 box was tracked every frame for 4 s. I also checked font loading, console errors, reduced motion at both widths, JS off at both widths, 320×640 and 375×667. I compared the hero with /search, /machines and /sentinel. `scripts/motion.mjs` could not be used here because it launches a hard-coded macOS Chrome path, so the walk is Playwright Chromium (scripts and frames are in the critic's scratchpad, `visor-critic3/`). Consent was pre-set so the cookie card did not cover frames.

Verdict: 7/10
First complaint: "Right, the middle's alive now, I like the list with the big picture changing. But it's the same thing three times: train-01, 02, 03, gpu-pool, cluster at the top, again in the naming bit, again at the end. And most of the time the top box has an empty grey slab where the console should be. It's starting to feel like it's repeating itself instead of going somewhere."

**The cap:** the coverage card still makes claims the page does not bear out (question 9), so the page is held at 7. Without the cap it sits at about 7.5. The repetition and the hero's dead grey block keep it under 8.

## Since the last review (7/10)
- **Fixed:**
  - **The tile room is one pinned room on desktop.** The six titles are a numbered list, with one picture large on the stage and a "01 / 06" figure at 64px. Scroll walks 01 → 06. At rest it steps on by itself: 01 → 02 → 03, measured at 4.5 s and 8.7 s with no input. Hovering a row previews it (row 04 → stage "04 / 06"), and so does Tab focus. Every desktop dwell in the room changed frames.
  - **The close has a Visor object:** the inventory lands row by row, and an SSH tab opens with a caret.
  - **The hero's resting greys are legible.**
    - The dry-run line rests at #525252 (about 7:1 on #f5f5f5) and flashes to ink. I sampled it 20 times through the loop and it never faded.
    - The providers sit at opacity 1 at every sample.
  - **The phone's first screen moves.** train-01, 02 and 03 land at about 2.4–3.6 s inside the first 812px, and the console opens at about 4.8 s.
  - **The six paragraphs are findable.** All six carry `hidden="until-found"` with JS on and are shown in place with JS off.
  - **The prefix input has the one ring:** a 2px ink outline plus a 2px white halo.
  - **The hero pause stops the caret too:** `vs2-blink` goes to `paused`, and the frames are identical 2.5 s apart.

## The 11 answers
1. **Sells in 5 s, moves within 1 s?** Yes, at both widths.
   - **Desktop:**
     - The h1 box is set at 292 ms (159,100, 271×55) and never moves.
     - All 7 frame pairs in the first 2 s differ: the providers light up, AWS takes the ink border, the dry-run line flashes, and the machines land in their reserved slots.
   - **Phone:** the h1 at 40px, the caption, the lede and "View on GitHub" (bottom 381) all sit in the first screen, and the machines land inside it.
   - **The flaw:** the console column. For about 65% of the loop (13 of 20 samples) it is a 25%-opacity grey slab with ghost "SSH / train-01" text, a dead block on the first screen at both widths.
   - **The card also has empty cells.** Under the request card on desktop there is about 120px of empty grey.
   - **Ragged wraps:**
     - The dry-run line breaks as "dry run · quote returned / · spends nothing", so the second line starts with a separator.
     - The audit line breaks as "launched · console / opened · org · project", splitting "console opened".
2. **One in, one out, or a document?** Mostly a scene now on desktop.
   - **Hero:** the console rises as you scroll.
   - **Pinned room:** one picture swaps at a time, so one thing comes in as another goes out.
   - **Naming tool:** a quiet light screen that names its batch on arrival, then sits still (dwell "moving, then still").
   - **Close:** the inventory lands.
   - **Phone:** the room is a column of six cards whose pictures play once. That is right below 900px, but phone screens 6, 7 and 11–16 were still on the dwell.
3. **A real object in every section?** Yes.
   - **Hero:** the fleet console.
   - **Room:** the bars, the volume and machines, the pool grid, "quote", RDP/VNC/SSH with a caret, and the audit rows, each drawn large.
   - **Naming tool:** the live inventory.
   - **Close:** the landing inventory.
   - **The weakness is sameness, not absence.** The inventory list (machines plus `gpu-pool` plus `cluster`) is the object of the hero, the naming tool and the close: the same rows three times on one page. The close even hard-codes `train` instead of the prefix the visitor just typed.
   - Stage 06 is three short rows in a 300px box, about half empty.
4. **One ask, sticky, nothing floating; scale with rhythm?** Yes.
   - **The ask:** one solid per screen.
     - "View on GitHub" in the hero carries `data-cta="primary"`, `data-thumb`, `target=_blank` and `rel`.
     - The close repeats it with `data-cta="close"`.
     - The header's "Try Hanzo" is the only solid in between.
   - **Nothing floats.** The only fixed elements besides the header are the 2px progress line and the room's own pin.
   - **Scale:** h1 52 (40 on phone), then 26 for sections, the room figure at 64, the room title at 17 and the count at 44.
   - **The weak spot is the close:** two headings on one screen, "Get started with Hanzo Visor" at 32 and "Get Visor" at 26. That is the shared `Finale`.
5. **Every hover and press answers?** Yes.
   - **"View on GitHub":** hover goes #0a0a0a → #2c2c2e and press scales to 0.98. That is the kit `Cta`, not 0.97.
   - **Rows:**
     - Hover lifts the text from white 55% to #fafafa.
     - The plus disc fills at white 14% and turns 90°.
     - The stage swaps to that row's picture, so the hover tells you what it opens.
     - Press scales to 0.97.
   - **"More" and "Fewer":** the border goes to ink on a #f5f5f5 fill, press is 0.97, and the count steps 3 → 4 → 2.
   - **"launch":** fills with white 55% and ink text, and swaps the line to "metered against the organization · per provider".
   - **Prefix:** typing `gpu` renames the batch to gpu-01 and gpu-02.
   - **Copy:** the clipboard equals the displayed prompt.
   - **Pause:** `aria-pressed` toggles and the sequence freezes.
   - **Sheet:**
     - It opens on press.
     - Tab cycles Previous → Next → Close inside it.
     - Next steps 04 → 05.
     - Escape closes it and returns focus to row 04.
6. **Overlap, font swap, layout shift?** None.
   - No overlap at 1470, 375 or 320.
   - Horizontal overflow is 0 at 1470, 375 and 320.
   - Zen and Zen Mono finish at 313 ms on desktop and 252 ms on phone, and the h1 box never moves.
   - CLS is 0.0011 on desktop (one 0.0009 shift from `.vs2-name-r` as the batch names itself) and 0.0000 on phone.
   - **Console errors:** 0 from this page.
     - A red "1 Issue" badge appears only when Playwright's default screenshot hides the caret: it injects `caret-color` into the prefix input, and that run also reports the known shared `FooterHTML` mismatch.
     - With `caret: 'initial'` there are 0 errors and no badge at either width.
7. **Which reference, and is its motion there?**
   - **apple.com:** the pinned room, where one panel changes while the list stays. Yes, and it is the best moment on the page.
   - **motion.dev:** the inventory layout reflow in the naming tool. Yes.
   - **synchronized.studio:** no. A row opens a side drawer on desktop and a bottom sheet on phone. The stage picture is redrawn in the drawer, not carried into it.
   - **anthropic.com launch:** no hero figure.
8. **Different from its neighbours?** Partly.
   - **The hero** is `StageHero look="rise"`, the same as /search: title, mono caption, lede and ask stacked over one full-width rounded grey console card, with a 44px pause disc at its top right. Visor's title is left-set and /search's is centred, and that is the main difference on the first screen.
   - **The close** is the shared `Finale` frame used across Cloud 4.
   - **Visor's own:** the pinned numbered room, the pipeline console and the naming tool.
9. **All 18 parts covered?** The card has 18 headings, each with a `Done here:` line, but some claims are false on the page:
   - **Part 7**, "[x] No label, tag, badge or pill above a headline": false when a row is opened. The page passes `kicker="04 / 06"` to the Sheet, which sets a 12px mono label directly above the sheet's `h2` (screenshot `i-sheet-open.png`, and on phone "02 / 06" above "Volumes and images").
   - **Part 8**, "press is scale .97 in 90 ms": the primary "View on GitHub" presses to 0.98 (the kit `Cta`). This was flagged last round and is still claimed.
   - **Part 6**, "(11-12px mono capitals excepted; none on the page)": the hero caption "HANZOAI/VISOR" is 12px mono capitals. That is allowed, but "none on the page" is untrue.
   - **Part 9**, "`motion.mjs` desktop: 2 still screens of 9": cannot be reproduced. The script is hard-wired to `/Applications/Google Chrome.app`, so name the tool that actually measured it.
   - **The page file's header comment** still says "CTA: … (hero, ask bar, close)", but the bar is off (`data-ask="off"`).
10. **Banned tells?**
    - **One:** an eyebrow over a headline, the "NN / 06" kicker above the Sheet's h2.
    - **Otherwise clean:**
      - `taste.py` OK and 0 hues.
      - No gradient text, no Inter and no `title=` tooltips.
      - No hover that only fades.
      - Nothing floating over content.
      - No three equal boxes.
    - **Owned by the shared kit:** the Sheet opens on `SPRING.sheet`, a spring with stiffness 300 and damping 34 (`lib/motion.js`). It is near-critically damped, so it does not visibly overshoot, but MASTER says "no springs".
11. **Copy untouched?** Yes.
    - Parity is OK: text 29/29, links 2/2.
    - "Volumes and images" is still used as a second heading (the naming tool's h2) where the live page has it only as a tile title. Those are Hanzo's words in a new role, so list it as a copy question for James rather than deciding it.

## Missing from the 18 parts (measured)
- **Part 1, Strategy:** `V2: 8/10` in `Visor.jsx` is the builder's own score. The critic's is 7. The header comment names an ask bar that is off.
- **Part 3, First impression:**
  - At 1470×801 the next room does not peek: the hero card ends at y 727, with plain white to 801.
  - The dark room arrives full-bleed, not as a rounded card that opens to full width.
  - The close carries two headings.
  - JS off: the hero's audit line is at opacity < 0.2 (it is `aria-hidden` demo text, so this is minor).
- **Part 6, Content:** the dry-run line and the audit line wrap badly in the hero at 1470 (see question 1).
- **Part 7, Visual system:**
  - The Sheet kicker sits above an h2.
  - The hero is the same `rise` frame as /search.
  - The console's off state is a 25% grey slab, which reads as a placeholder, not a designed state.
- **Part 8, Components:**
  - The primary presses to 0.98, not 0.97.
  - The Sheet is a `div role=dialog`, not a native `<dialog>`. The card now says this honestly, and the behaviour is right: focus is held and returned, and Escape closes it.
- **Part 9, Motion:**
  - The naming tool is still after its arrival.
  - The phone room goes still once its cards have played.
  - Three carets blink (hero, room 05, close); only the hero's has a pause.
- **Part 13, Performance:** JS and CSS budgets are not measured (the card says so).
- **Part 15 / reference:** no card-to-page or picture-to-sheet carry (synchronized.studio).
- **Passing:**
  - One h1 and one `main#main`, with the skip link to `#main`.
  - JS off is legible at both widths (h1 at opacity 1, all six paragraphs in place).
  - Reduced motion shows the final frame (train-01 to 03 landed, console open), 0 running animations and the room unpinned, at both widths.
  - Ask bottom at 374 on a 375×667 screen.
  - 0 targets under 44px in `main` at 375 and 320.
  - No horizontal scroll at 320.
  - Tab crawl: 17 stops in `main`, all visible, all with a 2px ring (ink on light, #fafafa on dark).
  - Title and canonical match, og:url equals the canonical, and 2 of 2 JSON-LD blocks parse.
  - `taste.py` OK and parity OK.

## Fixes (in order)
1. **Stop showing the same inventory three times.**
   - **Close:** make it the payoff of the naming tool. Lift `prefix`, `count` and `dry` to the page and have the close land *the visitor's* batch (`gpu-01…gpu-0N` if they typed `gpu`), with the line "metered against the organization · per provider" once they chose launch. It then reads as "your fleet", not a third copy.
   - **Or:** give the close a different Visor object, such as the SSH console at size with the audit row writing itself under it.
2. **Fix the hero's dead block and empty cells.**
   - Draw the console's off state as a real waiting terminal: a #0a0a0a frame with "SSH · train-01" at full contrast and an idle `$`. Do not use a 25%-opacity slab; let the "opened" step light the tab and start the caret.
   - Put the dry-run line directly under the request card, inside the empty cell, so the pipeline reads request → quote → providers → inventory.
   - Keep "dry run · quote returned · spends nothing" on one line (widen its column or allow it to span), and give `.vs2-audit` `grid-column: 1 / -1` so "console opened" does not split.
3. **Remove the eyebrow over the Sheet's h2.**
   - Drop `kicker` from `<Sheet>`. The list already numbers the rows. If the number must show, set "04 / 06" under the title as a caption, as part 7 says.
   - Then part 7's tick is true.
4. **Correct the coverage card.**
   - Part 6: name the 12px "HANZOAI/VISOR" caption.
   - Part 7: say the kicker is gone, or untick.
   - Part 8: "primary presses 0.98 (kit `Cta`); request .97 from the kit owner in `docs/requests/visor.md`".
   - Part 9: say which tool counted still screens.
   - Header comment: drop "ask bar".
5. **Give the naming tool a moment of its own after arrival.** On first arrival, type the prefix into the field letter by letter (time, about 60 ms per letter) as the names update under it, then rest. Or let "dry run" → "launch" flip once on its own with the line swapping, then return. Something should still answer the eye after the batch names itself.
6. **Let the next room peek at 1470×801.** Trim the hero's bottom padding or the console height so the dark room's top edge shows about 56px above the fold. Have the room enter as a rounded card inside the gutters that opens to full width, per MASTER's rooms.
7. **Make the open carry the picture (synchronized.studio).** Give the stage picture and the Sheet picture one `layoutId`, so opening a row grows the picture you were looking at into the card instead of redrawing it in a drawer.
8. **File shared requests** (`docs/requests/visor.md`):
   - `Finale` renders two h2s on one screen.
   - The kit `Sheet` uses a spring (`SPRING.sheet`).
   - The kit `Cta` press is 0.98.
   - List "Volumes and images" used as the naming tool's h2 as a copy question for James.
