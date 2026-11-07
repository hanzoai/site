# /about — James-eye review

Verdict: 6/10
First complaint: "I land on it and it's just a white page with some grid lines. Where's the headline? Then the one button in the black section is white on white, so you can't read it."

Walked 2026-11-07 16:20 UTC, HEAD fc751a9a (8f134455 at the start of the walk), at 1470x801 and 375x812 (isMobile, hasTouch). What I did:
- Took first-screen shots at 0.2, 1, 3 and 6 s, then reloaded.
- Scrolled the whole page in 400px wheel steps with a 0.9 s dwell (34 desktop screens, 45 phone screens).
- Hovered and pressed the hero ask, the frontier chart, the tiles and the sheet (arrow keys, Esc), the four switches, the Open-source tabs, the runtime cards and the career rows. On phone I tapped them.
- Checked reduced motion, JS off, console errors and failed requests. Ran taste.py (OK) and parity.py (text 167/167, links 36/36).

Note: the dev server hot-reloaded once during the desktop walk, and another page's parse error (BuyingSpecialist.jsx) showed in the phone walk. I ignored both.

## What works
- The hero object is good and belongs to this page. The Pareto line draws itself from 2014 to 2026, the hand travels along it, and "Techstars '17" pins on the way. On desktop the pointer reads off a year ("2016") with a crosshair. It is alive without input once it starts.
- The "pick two" switches answer: all four turn on, and the summary line "Chasing the Pareto frontier means advancing every axis at once…" lands. This is a real idea, not decoration.
- The six principle tiles each carry their own radar SVG. Hovering a tile turns the + ink and shows a peek sentence. Opening a tile morphs it into a sheet with ←/→ stepping and a 01/06 counter, and Esc closes it. This is the synchronized.studio move, and it works on phone too.
- "The Zen of Hanzo" is a proper pinned stage. One panel changes (01 to 06) with a progress hairline, the same idea as Apple's pinned scenes.
- The track record figures settle by count-up (95+ to 100+) on a staircase of hairlines. That makes one big moment between quieter screens.
- Career rows answer on hover by nudging and lighting their own track on the frontier chart. The runtime row shows 3 real model renders plus one Sigil.
- The palette is pure monochrome. The captions sit under the headings, not above them. There is no horizontal scroll at either size. Reduced motion shows the drawn final state.

## The 11 answers
1. **Sells in 5 s / moves in 1 s:** No at the 1 s mark. The server HTML ships the h1 lines at `translateY(108%)` and the lede and asks at `opacity:0`, so nothing shows until hydration. Measured: the first change came at 1.77 s and the h1 settled at about 3.0 s. At 0.2 s and 1 s both sizes show only grid lines and a dot at 2014. Once it is in, it sells well.
2. **One in, one out:** It is partly a document. The Zen stage and the sheets do one-in-one-out. The rest is long stacked sections (12.5k px on desktop, 17k px on phone) with about 230px of dead white between them (section padding is 116px top and bottom). The Open-source room is a text column and a commit log side by side.
3. **A real object per section:** Mostly yes: the chart, the switches, the radar tiles, the figures, the pinned panel, the commit log, the model renders and the track chart. The founders get Sigil contours with "AW"/"ZK" monograms instead of photos, which is a weak object for a "people" section.
4. **One ask, sticky header, rhythm:** The rhythm is good: 52px h1, 26px heads, big figures only in the record moment. The ask is the problem:
   - On phone the header keeps a solid black "Try Hanzo" next to the hero's solid "Get Started". That is two solid fills with two labels in the first viewport, and the phone header never swaps.
   - On desktop the header starts outlined "Try Hanzo" and swaps to "Get Started" after the hero, which is right.
   - The cookie card covers content at the bottom (shared chrome).
5. **Hover and press answer:**
   - The hero ask darkens and presses to 0.98. The tiles, switches, career rows and chart answer.
   - The runtime cards show no visible hover change.
   - **"View Open Source Dashboard" is illegible:** a white fill with `#f5f5f5` text, about 1.1:1, with no hover change.
6. **Overlaps, font swap or layout shift:**
   - No overlaps at either size.
   - The sheet footer's "01 / 06" sits about 13px above the baseline of its ← / → links.
   - With JS off, the hero hand dot is stranded at the top-left, off the line.
7. **Reference:** synchronized.studio (tile to sheet) and an Apple pinned stage (Zen) are genuinely there. The hero chart reads like an Anthropic-launch figure. Nothing from osply or hamol, and there is no pointer detail beyond the chart crosshair.
8. **Different from neighbours:** Yes. A drawn Pareto chart as the hero, radar tiles and a pinned principle stage are its own.
9. **18 parts:**
   - Covered: one h1, `<main>`, `data-cta`/`data-thumb` on the hero, a closing band, JS-off legibility.
   - Gaps:
     - the hero is invisible before hydration (parts 3 and 13);
     - the phone header ask mismatch (part 4);
     - an illegible control (parts 8 and 12);
     - 2 animations are still running after 3.5 s under reduced motion (part 9).
10. **Banned tells:**
    - No hue, no gradient text, no label above a headline.
    - The three figures (100+, $1B+, 2024) sit in a row. They are staggered on hairlines, not boxes, so this is borderline but acceptable.
    - The console showed a React hydration-mismatch error and the red "1 Issue" badge on the first load at both sizes. It comes from the shared `FooterHTML`, not this page, but it shows on this page.
    - One unidentified 404 on the first desktop load. It did not reproduce on the second run.
11. **Copy untouched:** Yes, parity is 0 missing.

## Fixes (in order)
1. **Show the hero before hydration.** Render the h1 lines at rest and the lede and asks at full opacity in the server HTML. Run the cut-in from a class added by JS, and only when the page is not already late. Something must move by 1 s: start the frontier line drawing from CSS, not after React mounts.
2. **Fix the dark-room quiet button.** `.xab-open` sets `--ink: #f5f5f5` (About.css:165), and the kit's quiet `.x-btn` uses `--ink` for its text on a white fill. Give the button in `.xab-log-f` ink text, or use the dark-room quiet variant, and give it a hover change.
3. **Phone header ask.** Make the phone header match the hero ask ("Get Started") and keep it quiet while the hero ask is on screen. Only one solid fill per viewport.
4. **Clear the hydration-mismatch error and the "1 Issue" badge** (shared `FooterHTML`; ask its owner). Confirm no 404s on a cold load.
5. **Tighten the long middle.** Cut the double 116px gaps between sections so each screen holds one thing. In the Open-source room, let the tab panel and the commit log hand over (one in, one out) instead of sitting side by side as a text wall.
6. **Give the runtime cards a hover that tells you something,** such as the render drifting or the tag line lifting, and replace the founders' monogram contours with real photos if Hanzo has them.
7. **Polish:**
   - Align "01 / 06" in the sheet footer to the ← / → baseline.
   - Pin the hero hand to the line's end with JS off.
   - Stop the 2 running animations under reduced motion.
