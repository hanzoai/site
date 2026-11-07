# /grants — James-eye review
Verdict: 7/10
First complaint: "That 'what you receive' list sits there half greyed out until I scroll right past it. With JavaScript off it stays grey for good, and on the phone it's a thin column five words wide. And if I turn on reduced motion, the page throws a red error."
(walked 7 Nov 2026, HEAD d727336f (round 5 commit), at 1470×801 and 375×812, plus 375×667 and 320×700. Moving: arrival bursts at 150/400/700/1000 ms, idle hashes of the art, 400px wheel steps with 1.1 s dwells, a brisk pass with 450 ms dwells, hover and press on the hero ask, a ledger row, a sheet ask and the pause control, track taps, an empty submit, a 503 submit, reduced motion (4 loads), JS off, and a deep link to #apply. Every request to api.hanzo.ai was intercepted with a 503. One request was made and caught, and nothing real was sent.)

## What works
- **Round 5's hero fix holds.**
  - The server HTML now has `<div class="xgr-rise">` with no inline opacity.
  - At 400 ms the h1, lede and "Apply for a Grant" are all on screen; only the field is still blank.
  - By 1000 ms the field is drawn and moving: the 4 arrival hashes all differ, and the 4 idle art hashes differ.
  - Pausing it gives 3 identical hashes.
- **Hero.**
  - The h1 is 52px Zen 497 at y 280–395, with nothing above it.
  - The primary's bottom is at 606 on desktop and 447 at 375×667.
  - On phone the h1 is 40px over 3 lines.
- **The sheets stack is the real moment.**
  - Sheet 01 pins at 96 and goes to scale 0.92 with a 0.45 dim while 02 slides over.
  - 02 pins at 120.
  - 03 (white) lands last.
  - On phone the sheets lie flat.
- **The timeline.** It scrubs (scaleX 0.28 → 0.75 → 1), and the steps light 2 → 4.
- **The ledger.** It is now one #f5f5f5 sheet. Rows light and tick as they enter, and on hover a row fills #ededed and its tick redraws.
- **Every press answers.**
  - Hero ask: #0a0a0a → rgb(44,44,46) on hover, scale 0.98 on press, 0px of movement.
  - Sheet ask: the border goes to #fafafa and the arrow moves translateX(4px).
  - Track chip: glides to x 1105, 201×50 (333×44 on phone).
- **The form.**
  - An empty submit focuses `name` and shows Hanzo's line.
  - The 503 keeps "Test Person" and shows "Your application did not reach us… grants@hanzo.ai." No success appears.
- **One solid fill per screen.**
  - The desktop header goes outlined while "Submit Grant Application" shows (y 4320–5040) and is solid otherwise after the hero.
  - On phone, 0 targets are under 44px.
- **A closing proof strip now exists:** "2,137+ repositories · 122 organizations" and Explore Repositories, then the footer.
- **Layout and checks.**
  - CLS is 0.0002 on desktop (from the shared header cluster) and 0.002 on phone.
  - scrollWidth is 320 at 320.
  - Parity is 57/57 text and 5/5 links. `taste.py` passes.

## The 11 answers
1. **Sells in 5 s, moves within 1 s?** Yes. The copy and ask are visible from the server HTML, and the field draws and drifts within 1 s.
2. **One in, one out?** Yes on desktop: hero, then the timeline, the ledger, the stack, the form, the strip. Two soft spots:
   - **Ledger:** its left column is a sticky heading over about 350px of empty white beside the 4 rows.
   - **Ending:** 161.7px of Apply `padding-bottom` plus 28px sit above a 13px mono line, then 116px below it. It reads as a fizzle, not an end.
   - **Phone:** the page is about 10,360px tall.
3. **A real object in every section?** Yes: the field, the line and dots, the ledger sheet, the sheets (64px 2,137+ and chips), and the filing card plus the track control. The ledger is still mostly text, but it is now one object with a moment.
4. **One ask, sticky; scale rhythm?**
   - Scale holds: 52 / 26 / 21 / 64 / 32.
   - The desktop header swaps to "Apply for a Grant" only after rest. On the brisk pass it read "Try Hanzo" at every step from y 341 to 2858 (shared Ask timing).
   - On phone the header keeps "Try Hanzo" (the card admits this).
5. **Every hover and press answers?** Yes (measured above). No layout jump.
6. **Overlaps, font swap or layout shift?**
   - No font swap and no page-owned overlap. CLS is under 0.002.
   - **Page-owned hydration failure under reduced motion, on 2 of 2 loads** (plus the 1 from the walk): "Hydration failed because the server rendered HTML didn't match the client", with the red "1 Issue" badge. The diff is `.xgr-line i` `scaleX(0)` vs `none`, the 4 `.xgr-steps li` `""` vs `"on"`, sheet `style` `transform:none` vs `{}`, and `<i class="xgr-sheet-dim">` present vs absent. Cause: `useReducedMotion()` branches the render in `How` (`useState(calm ? 3 : -1)`, `line`) and `Sheet` (`calm ? undefined : {scale}`, `!calm && <motion.i>`).
   - With no reduced motion, 0 hydration errors in 7 loads. One attribute-mismatch warning appeared in the first walk and did not reproduce.
7. **Which reference, and is its motion there?** apple.com's chapter stack, plus a scrubbed timeline. Both are present and measured. There is still no editorial asymmetry: every head is left and the content right.
8. **Different from neighbours?** Yes: the stack, the timeline, the filing card and the ledger. The hero is the shared outlined Sigil card.
9. **All 18 parts?** The card has 3 unticked boxes it admits (`PageHero`, `Band`, token radii). Three claims are false (below).
10. **Banned tells?** None hard. The dark room is full-bleed at once rather than entering as a rounded card (MASTER 3.1), which is minor.
11. **Copy untouched?** Yes: parity is 57/57 text and 5/5 links.

## Card check (docs/coverage/grants.md)
- TRUE:
  - one h1 52px; nothing above it;
  - lede and ask rise by CSS from the server HTML (no opacity 0);
  - the field moves with a pause;
  - one solid per screen on desktop;
  - the 44px error link (no phone target under 44);
  - the track chip 201×50 glides;
  - the failed submit keeps values with no success;
  - the first bad field takes focus;
  - Privacy Policy beside the submit;
  - no scroll at 320;
  - the quiet proof strip after the form;
  - parity 57/57;
  - `taste.py` passes;
  - the `data-cta` ids.
- **FALSE**, part 3 "JS off: `NoJs` shows final states": with JS off all 4 ledger rows stay unlit. That means 0 ticks and titles in #737373 (`nojs-gets` frame, `.xgr-sheetlist li:not(.on)` = 4).
- **FALSE**, part 12 "Greys at 4.5:1+": the unlit ledger title is rgb(115,115,115) on #f5f5f5, which is 4.36:1 at 21px/497 (not large text). MASTER part 12 names #737373 as failing on #f5f5f5. Under JS off this is permanent.
- **FALSE**, part 9 "Reduced motion shows the final state": it ends there, but only after React throws away the server tree (the hydration failure above), and with a console error. The ledger's 4th row also stays unlit until scrolled fully into view.

False claims cap this at 7. Beyond the cap, the reduced-motion error alone fails DONE item 3 ("no console errors").

## Fixes (in order)
1. **Stop branching the render on `useReducedMotion()`** (fixes the hydration failure).
   - In `How`: start `useState(-1)` always and set 3 in the existing effect. Make `line` a plain `useTransform(scrollYProgress, v => clamp(v))`.
   - In `Sheet`: always pass `style={{ scale }}` and always render the dim `<motion.i>`.
   - Do the calm state in CSS: `@media (prefers-reduced-motion: reduce) { .xgr-line i, .xgr-sheet { transform: none !important; } .xgr-sheet-dim { display: none; } .xgr-steps li .xp-title { color: #0a0a0a; } .xgr-steps li .xgr-dot { background: var(--xp-accent); } }`.
   - Re-walk with `reducedMotion: 'reduce'`: 0 console errors, no badge.
2. **Ledger contrast and final state.**
   - Change `.xgr-sheetlist li:not(.on) .xp-title { color: #737373 }` to `#525252`.
   - Render `<Tick />` always, and draw it with a class (`li.on .x-tick path { animation: xgr-redraw … }`) instead of mounting it.
   - Add `html:not(.js) .xgr-sheetlist li .xp-title { color: #0a0a0a; }` and the same under `prefers-reduced-motion`.
   - Lower `useInView` `amount` from 0.9 to 0.6 so the 4th row lights on a 801px screen.
3. **Phone ledger measure.** The body column is 197px wide at 375. Under `@media (max-width: 900px)` set `.xgr-sheetlist { padding: 4px 16px !important; }` and `.xgr-sheetlist li { grid-template-columns: 28px 1fr 22px; gap: 6px 12px; }`. Or drop the tick into the number column (`.xgr-gets-t { grid-column: 1; grid-row: 2; }`) so the text gets about 260px.
4. **The ending.**
   - Cut `.xgr-apply` `padding-bottom` to `clamp(56px, 6vw, 88px)` so the strip is not marooned in about 190px of white.
   - Give the strip its figure: render "2,137+" in the `.xgr-count` style (Zen 220, 64px, tabular), with the rest of the existing line as the 12px mono caption, the way sheet 01 does. That uses the same words, so the page ends on a number, not a 13px line.
5. **The ledger's empty left column (desktop).** Let `.xgr-gets-l` hold the active row index ("01 / 04" in 64px Zen 220, mono caption) that changes as each row lights. It uses existing numbering, adds no copy, and fills about 350px of void with a moment.
6. **Header swap lag (shared, request):** swap on an IntersectionObserver for `[data-cta="grants.hero"]`, not on scroll idle. It read "Try Hanzo" for 8 brisk steps.
7. **Card:** correct parts 3, 9 and 12 after fixes 1 and 2. Record this review in part 18.
8. **Optional for 8+:** the dark room enters as a rounded card inside the gutters and opens to full width as it is reached (MASTER 3.1).
