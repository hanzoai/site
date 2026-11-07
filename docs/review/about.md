# /about — James-eye review

Verdict: 7/10
First complaint: "On my phone the commit dates run down the screen one letter at a time. And halfway down the desktop page there are two huge empty grey boxes where the founders should be. It's beautiful at the top, then it turns into a long document."

Walked 7 Nov at `9afbb4b` (`components/pages/About.jsx`, `About.css`, `story.css`, `StorySheet.jsx`, `StoryClose.jsx`). Working files are in the `critic2/` scratch folder.
- **Desktop film:** 1470×801, 91 s (`vid-about/about.webm`, sheets `sheets/about-01…12.jpg`). Wheel in 100px notches with a 1.5 s dwell per screen. Pointer swept across the frontier. Hovered and pressed the hero links, all 4 switches, 6 tiles, the Zen index, both dark-room tabs, a commit, 4 model cards, 4 papers, 3 roles and the Band ask. Clicked tile 01, pressed → twice, Tab ×5, Esc.
- **Phone:** 375×812 (isMobile, hasTouch), 25 screens (`sheets/about-phone-01…05.png`).
- **Also checked:** reduced motion on every screen (still after 3 s), JS off (full page), console and failed requests, and a Tab crawl.

## What works
- **The signature is real.** Tile 01 grows into its sheet in about 600 ms (`fr/about-morph.jpg`, 0.4–1.0 s).
  - → twice turns it to "Equitable Access".
  - Tab stays inside the sheet: Transparent pricing → ← Frontier Performance → Open Source → → Close → back to the start.
  - Esc closes it, focus returns to the tile, and the page scroll unlocks.
- **The first screen sells and moves.**
  - The h1 is 52px/497 and is cut in by line.
  - The frontier draws itself in about 4 s, and Techstars '17 lands as the head passes 2017.
  - A sweeping pointer reads the year under the hand (2026 at x = 1400).
  - It looks like osply or hamol: confident asymmetry, with an 8 and 5 split.
- **Scale has the rhythm James asked for in Track Record.** The three figures rest at 64px Air and grow ×1.75 while they are the moment (`matrix(1.75…)` measured, `about-d-figs-moment.png`). They count 44+ → 93+ → 99+ → 100+ once, and the server HTML carries "100+".
- **Many kinds of motion:**
  - time: the curve draws, the commits land oldest first;
  - pointer: year under the hand, tile peek with a rotating radar, switch knobs that lean toward the click, role tracks that light;
  - state: tile → sheet, the tabs, the switches;
  - arrival: the h1 cut-in.
- **Clean numbers.**
  - 0 hues in `<main>`.
  - Parity 167/167 text and 36/36 links. `taste.py` and `variety.py` OK.
  - CLS 0.0002, and that shift is in the shared header.
  - Reduced motion: 15 of 15 screens identical after 3 s, with the curve drawn.
  - JS off is legible (`sheets/about-nojs.png`).
  - No sideways scroll at 375.
  - The only console errors are the two blocked founder portraits (500).

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes at both sizes: the curve starts drawing at about 0.1 s.
   - But on the phone the hero object is a 60px hairline (`about-p375x812-first-4s.png`). The 1600-wide SVG is scaled to 375, with every label (years, axes, Techstars '17) hidden.
   - It is shrunk to fit, not cropped at true size.
2. **One in, one out, or a document?** Mostly a document with good islands.
   - 12,350px at desktop (15 screens) and 16,989px on the phone (21 screens).
   - Why We Build alone is 2,249px: switches, then 128px of air, then six 368px tiles. Research is 2,042px.
   - There is no pinned scene anywhere, and between the islands it is scroll and read.
3. **A real visual object in every section?** Yes except the founders.
   - On a failed portrait, each founder is a 470×587 blank #f5f5f5 slab with "AW"/"ZK" in the corner (`about-d-record-1.png`, frames 39.5–43 s).
   - Two of them, offset, so one screen is mostly empty grey.
   - MASTER parts 7 and 10 name the Sigil as the designed image fallback.
4. **One ask in the sticky header, nothing floating; scale rhythm?**
   - **The asks.** The page has three different solid labels: "Get Started" (/pricing), "Start Building" (/pricing again, different words) and "Explore Open Roles". They are not on one screen, but the ask keeps changing.
   - **Rhythm on the founders screen.** The names are h3s at 52px (the h1's size) beside a 112px monogram, so two big things share one screen.
   - **Rhythm elsewhere** is good: 26px heads, 17px titles, 64→112 figures.
5. **Every hover and press answers, no jumps?** Yes.
   - The tile radar rotates −8° and the "+" turns ink and rotates 90°, while the peek line rises.
   - Paper titles slide 8px, model art scales 1.04, and buttons press to .97 (text links to translateY 1px).
   - The roles light their track (`role1: xab-track on`).
   - No layout jump.
6. **Overlaps, font swap, layout shift?** No font swap or shift, and the desktop is clean. The phone breaks:
   - **The commit log's date column is 23px wide** (`cols: 128px 23px 128px`). "Nov 6, 05:53 UTC" stacks into 8 lines, about 160px tall, on every one of the 6 commits (`about-p-log.png`).
   - Cause: `.xab-open-g .xab-log li` (About.css:163) outranks the phone rule `.xab-log li` (About.css:297).
   - **The dark-room tablist is 466px wide in a 343px box.** "Deterministic Safety Bounds" is cut at the right edge (it scrolls, with no cue).
7. **Which reference, is its motion there?**
   - synchronized.studio: yes, the tile → sheet morph.
   - osply and hamol: the type and asymmetry.
   - Apple's pinned, scrubbed scene: absent.
   - The intended "four ghost axes drawing under the curve" never draws. `.xab-ghost { stroke-dasharray: 2 6 }` (About.css:18) overrides motion's `pathLength` dash, so the ghosts are complete and solid from the first frame (300 ms shot, `about-d-first-300.png`; computed dasharray `2px, 6px` with `pathLength=1`).
8. **Different from its neighbours?** Mostly.
   - The hero object (a drawn frontier) is its own.
   - But the masthead layout (h1 on the left 8 columns, lede and ask on the right, bottom-aligned) is the same as /blog's.
   - It closes on the same StoryClose band as /history and /blog.
9. **The 18 parts?** See below.
10. **Banned tells?** None of the page's own. The tiles opt into the shared "Open" cursor label (`data-cursor="Open"`); noted under shared chrome.
11. **Copy untouched?** Yes: parity is clean.
    - Copy question for James: the lede and pillars say "1700+" repositories, while the page's own meta description and /history say "1,600+".

## Missing from the 18 parts
- **1 Strategy:** three different solid labels for one metric. "Start Building" shares /pricing with "Get Started" under different words.
- **3 First impression:**
  - No 56px peek at 1470×801: the hero ends at 785 on white padding.
  - The phone hero object is under 80px and stripped of labels.
  - Two long sections (2,249px and 2,042px).
- **6 Content:** the dark-room tab labels overflow at 375.
- **7 Visual:**
  - The founders' fallback is a plain grey slab, not Sigil.
  - The dark room does not enter as a rounded card (only the close does).
  - `.xab-log` is both outlined (`0 0 0 1px`) and raised (`0 60px 120px -40px`), with literal rgba shadows in page CSS.
- **8 Components:**
  - The sheet is not a native `<dialog>` (the card admits it).
  - The three role rows are `tabIndex=0` stops that do nothing but light a line.
- **9 Motion:** the ghost axes do not draw.
- **10 Media:** the image fallback is not Sigil.
- **11 Mobile:**
  - The commit-log column collapses.
  - The tablist is clipped.
  - "github.com/hanzoai" is a 151×18 target.
- **18 Coverage card:** it claims "375×812 and 1470×801 pass with no overlap" and "Targets 44px (… commit links)". Both are false on the phone.

## Fixes (in order)
1. **Mend the phone commit log.**
   - Inside `@media (max-width: 900px)` add `.xab-open-g .xab-log li { grid-template-columns: minmax(0, 1fr) auto; }` so the date sits on one line after the repo.
   - Give the dark-room tablist `flex-wrap: wrap` (or two equal tabs at 50%) so neither label is cut.
   - Give `.xab-log-h a` `min-height: 44px`.
   - Check at 320 and 375: "Nov 6, 05:53 UTC" on one line, no tab cut.
2. **Design the founders' fallback.**
   - When the portrait fails, fill the 4:5 box with `<Sigil seed={p.name}>` (ink on #f5f5f5). Shrink the monogram to a 26px corner mark.
   - Set the names at the 26px heading size, not 52px, so the founders screen has one big thing.
   - Cut the 270px gap above the portraits.
3. **Shorten it to one idea per screen.**
   - Bring `.xab-picks` margin-top (128px) and `.xab-tiles` margin-top (140px) down to 72px.
   - Bring the figures' staircase offsets (`nth-child(1)` 220px, `nth-child(2)` 110px) down to about 116 and 60.
   - Bring `.xab-papers-h` (160px) down to 72px.
   - Aim for no more than 10,500px at 1470 wide.
4. **Let the ghost axes draw.** Remove `stroke-dasharray: 2 6` from `.xab-ghost`, or dash them with a mask, so the four axes draw with `pathLength` under the frontier instead of appearing complete at 0 s.
5. **Crop the phone hero, do not shrink it.**
   - At 900px and below, render the frontier SVG at about 2× (for example `width: 220%`, anchored right) so the head, the curve and the "Techstars '17" mark stay at true size.
   - Keep at least 120px of art inside the first 660px.
6. **One solid label.** Make "Start Building" a text link (`v2s-tlink`). The page then shows "Get Started" in the hero and "Explore Open Roles" in the Band only.
7. **Correct `docs/coverage/about.md`** to what ships (phone overlap, targets, ghost axes, fallback).

**Shared chrome (not scored):**
- The tiles' "Open" cursor label is on the banned list (`data-cursor="Open"` on `.xab-tile`).
- The header shows "Try Hanzo" solid beside the hero's "Get Started" at 1 s.
- The bottom ask bar never rose on /about at either size.
