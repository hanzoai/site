# /grants — James-eye review
Verdict: 7/10
First complaint: "Half that page is a grey list with a big empty hole beside it, and when I get to the dark bit there are two white buttons shouting at me at once. And switch JavaScript off and the ticks turn into little dots and the steps all go grey."
(walked 7 Nov 2026, HEAD 4315006f (round 6 is 965b0add), at 1470×801 and 375×812, plus 375×667 and 320×700. Moving: arrival bursts at 150/400/700/1000/1500 ms, 4 idle art hashes, 400px wheel steps with 1.1 s dwells, a brisk pass with 450 ms dwells, phone steps of 600px with 0.9 s dwells, hover and press on the hero ask, a ledger row, a sheet ask and the pause control, track click and tap, an empty submit, a 503 submit, reduced motion (2 loads, plus 1 for animations), JS off, and 12 more loads to chase the "1 Issue" badge. Every request to api.hanzo.ai was intercepted with a 503. One request was made and caught, and nothing real was sent.)

## What works
- **Round 6 fixed the reduced-motion hydration failure.** 2 of 2 reduced-motion loads gave 0 console errors. CSS shows the final state: 4 of 4 steps lit, the line drawn (`none`), the ledger titles #0a0a0a, and the ticks at opacity 1.
- **The hero sells.**
  - At 400 ms the h1 is cutting in and the lede and "Apply for a Grant" are on screen.
  - By 1000 ms the contour field is drawn. The 5 arrival hashes all differ, and the 4 idle hashes differ.
  - Pausing gives 3 identical hashes.
  - The h1 is 52px Zen 497 at y 280–395, with nothing above it, and the ask's bottom is at 606.
  - On phone the h1 is 40px over 3 lines, and the ask's bottom is at 447, at both 375×812 and 375×667.
- **The stack is the real moment.**
  - Sheet 01 pins at 96 and goes to scale 0.92. Sheet 02 pins at 120, and 03 (white) lands last.
  - On phone the sheets lie flat.
- **The timeline scrubs.** scaleX goes 0.42 → 0.89 → 1, and the steps light 2 → 4.
- **The ledger rows light.** They light at 60% in view: 1 → 3 → 4 by y 1542. On hover a row's fill goes #f5f5f5 → #ededed (opacity 0 → 1).
- **Every press answers, with 0px of layout movement.**
  - Hero ask: #0a0a0a → rgb(44,44,46) on hover, and scale 0.98 on press.
  - Sheet ask: the border goes to #fafafa and the arrow moves translateX(4px).
  - Track chip: glides to x 1105, 201×50 (333×44 on phone).
- **The form.**
  - An empty submit focuses `name` and marks name, email and summary `aria-invalid`.
  - The 503 keeps "Test Person" and shows "Your application did not reach us… grants@hanzo.ai." No success appears.
  - Clicking "Apply for Research Credits" selects "Academic / PhD Research Credits" and lands #apply at 76px.
- **The ending is fixed.** "2,137+" is now a 64px Zen 220 figure with a mono caption, and the gap above it is shorter.
- **One solid on desktop at the form.** The header outlines while "Submit Grant Application" shows (y 4422–4782).
- **Checks.**
  - Desktop CLS is 0.0005, all from the shared header cluster.
  - scrollWidth is 320 at 320.
  - Parity is 57/57 text and 5/5 links. `taste.py` passes.
  - The phone ledger body is now 229px wide (it was 197).

## The 11 answers
1. **Sells in 5 s, moves within 1 s?** Yes. The copy and ask come from the server HTML, and the field draws and drifts by 1000 ms.
2. **One in, one out?** Mostly. The hero, timeline, ledger, stack, form and figure each hold their own screen. The ledger is the weak screen: the left column is a 149px sticky head over **432px of empty white** beside the 697px list. The phone page is 10,273px tall.
3. **A real object in every section?** Yes: the field, the line and dots, the ledger sheet, the sheets (64px 2,137+ and chips), the filing card with the track control, and the closing figure. The ledger is still text with ticks.
4. **One ask, sticky; scale rhythm?**
   - Scale holds: 52 / 26 / 21 / 32 / 64.
   - **Two fills in the dark sheet.** Every quiet sheet ask is `background: #fff`. On #171717 (sheet 02) "Apply for Research Credits" is a white solid pill. Meanwhile the header's ask has a light fill of rgb(245,245,247) in the dark room. That makes two filled buttons in one viewport, at both sizes (desk y 487, phone y 420).
   - The desktop header swaps to "Apply for a Grant" by y 822 at rest. On the brisk pass it swapped by y 1060, two steps late (shared Ask).
   - The phone header keeps "Try Hanzo" (the card admits this).
5. **Every hover and press answers?** Yes (measured above). No jump.
6. **Overlaps, font swap or layout shift?**
   - No page-owned overlap, and no font swap.
   - **The "1 Issue" badge is not the page's.** It came only on loads where Playwright took screenshots during hydration (6 of 6). Its diff was the summary textarea's `style` (caret-color, injected by the screenshot) and the shared `FooterHTML` innerHTML. 6 clean loads gave 0 errors.
   - Phone CLS read 0.24 when `fill()` typed the first field. On phone the filing card appears above the form and pushes it 214px. Scroll anchoring holds the field still (630 → 629), and real typing counts as input, so this is not seen. But the card does appear above where you type.
7. **Which reference, and is its motion there?** apple.com's chapter stack, plus a scrubbed timeline. Both are there, with two problems:
   - The stack's dim does not hold. Sheet 01's dim peaks at 0.43 (y 2900), then **falls back to 0 by y 3500** while it stays at scale 0.92. The sheets beneath end bright, not settled.
   - The dims run as 3 WAAPI animations that are still `running` after 3 s under reduced motion (MASTER part 9: `getAnimations()` is empty after 3 s). They are hidden by `display:none`, so nothing shows.
8. **Different from neighbours?** Yes: the stack, the timeline, the filing card and the ledger. The hero is the outlined Sigil card.
9. **All 18 parts?** The card admits 4 unticked boxes: `PageHero`, `Band`, sticky ask on phone, and token radii. One claim is false (below).
10. **Banned tells?** None hard.
    - The dark room is still full-bleed at once rather than entering as a rounded card (MASTER 3.1).
    - The light sheets' quiet asks are white pills with an 8% outline on a #f5f5f5 surface, which is raised and outlined at once (part 7). This is minor.
11. **Copy untouched?** Parity is 57/57 and 5/5. The closing strip repeats sheet 01's line "2,137+ repositories · 122 organizations". These are Hanzo's words, used twice.

## Card check (docs/coverage/grants.md)
- TRUE:
  - one h1 at 52px, with nothing above it;
  - the CSS rise from the server HTML;
  - the field moves, with a pause;
  - reduced motion hydrates with 0 console errors, and CSS shows the final state;
  - unlit ledger titles are #525252 (#737373 is gone);
  - rows light at 60%;
  - the phone ledger is roomier (229px);
  - 2,137+ is the closing figure, static at 64px;
  - the track chip is 201×50 and glides;
  - the failed submit keeps its values, with no success;
  - the first bad field takes focus;
  - Privacy Policy sits beside the submit;
  - the 44px error link;
  - no scroll at 320;
  - parity 57/57;
  - `taste.py` passes;
  - the `data-cta` ids;
  - the desktop header outlines at the form.
- **FALSE**, part 3: "JS off: `NoJs` shows final states" (and part 12's "with JS off every row shows lit"). With JS off:
  - **The ledger ticks render as 1px dots.** The Tick's SSR `pathLength` is 0 (`stroke-dasharray: 0 1`), so with opacity 1 each row shows a stray dot at the right (`nojs-gets` frame).
  - **The timeline is full but unlit.** The line is fully drawn, yet all 4 dots are hollow and all 4 step titles are #737373 (`nojs-how`). That is a half state, not the final one.
- Minor wording, part 9: "sheets shrink and dim as the next slides over". They dim, then the dim undoes itself as the stack completes (answer 7).

The false claim caps this at 7. Without the cap it would sit at about 7.5. The ledger void, the double fill in the dark sheet and the dim that undoes itself keep it short of 8.

## Fixes (in order)
1. **JS-off final state** (lifts the cap).
   - Ledger: add `html:not(.js) .xgr-sheetlist .x-tick circle, html:not(.js) .xgr-sheetlist .x-tick path { stroke-dasharray: none !important; stroke-dashoffset: 0 !important; }`. Or render a static tick SVG with no `pathLength` in the server HTML, and let `Tick` take over after mount.
   - Steps: add `html:not(.js) .xgr-steps li .xp-title { color: #0a0a0a; } html:not(.js) .xgr-steps li .xgr-dot { background: var(--xp-accent); }` (the same as the reduced-motion block).
2. **One fill in the dark sheet.** `.xgr-sheet.s1 .xgr-way-a .xp-ghost { background: transparent !important; color: #fafafa; border-color: rgba(255,255,255,.3) !important; }`, with hover going to `border-color: #fafafa`. The header's light fill is then the only fill. On the light sheets, drop the white fill too (`.xgr-sheet:not(.s1) .xgr-way-a .xp-ghost { background: transparent !important; border-color: rgba(0,0,0,.14) !important; }`), so the pill is outlined, not raised plus outlined.
3. **Make the stack's dim hold.**
   - Motion is running the dim opacity as an accelerated scroll animation whose range does not clamp. Give `useTransform` for `dim` an explicit clamp, or drive it from a non-accelerated value (`useTransform(p, v => Math.min(.55, Math.max(0, (v - i/n) * n * .55)))` for i < n-1).
   - Then verify sheet 01's dim is about 0.55 at y 3500, and that `document.getAnimations()` has nothing `running` 3 s after a reduced-motion load.
4. **The ledger's empty left column (desktop, carried over).** Fill `.xgr-gets-l` under the lede with the active row's index as a figure: "01 / 04" in 64px Zen 220, tabular, ticking to the row that last lit. This uses existing numbering and adds no copy. Or let the list start level with the h2 and sticky-stack the head beside it, so there is no 432px void.
5. **Phone filing card.** Mount it *below* the form on phones (`@media (max-width: 899px) { .xgr-apply-l { order: 2; } }`, with `.xgr-apply-in` as a flex or grid column), so the form never moves when typing starts.
6. **Header swap lag (shared, request):** swap on an IntersectionObserver for `[data-cta="grants.hero"]`, not on scroll idle. On the brisk pass it read "Try Hanzo" up to y 700.
7. **Card:** correct the part 3 and 12 JS-off claims after fix 1, and part 9's dim wording after fix 3. Record this review in part 18.
8. **Optional for 8+:** the dark room enters as a rounded card inside the gutters and opens to full width as it is reached (MASTER 3.1).
