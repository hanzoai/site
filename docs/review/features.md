# /features — James-eye review
Verdict: 6/10
First complaint: "On my phone the Dev bit is broken. There's a tiny video stuck in the corner with the words falling out of it, and the list is squashed into half the screen. And the page keeps jumping while I'm reading it."
(walked 7 Nov 2026 at HEAD `6daba878`, 1470×801 fine pointer and 375×812 touch, plus 320, 375×667, 768, reduced motion and JS off)

Method: Playwright from Node.
- **Arrival and idle:** a 6-frame burst 180 ms apart, then 8 samples 500 ms apart.
- **Scroll:** wheel steps of 500px with 900 ms dwells on desktop, 450px on phone.
- **Rooms:** 7 s idle in each room, sampling the open row, the film's transform and origin, and video time.
- **Input:** hover and press on the ask, text link, keys, rows, film cards and band cards. I typed in the finder, did a 30-stop Tab crawl, and tapped keys and rows on the phone.
- **Measured:** layout shift (PerformanceObserver, with sources), console errors and grid geometry.

api.hanzo.ai was aborted and nothing was sent. The "1 Issue" badge in the frames is the hydration warning that only fires when screenshots are taken during hydration. Clean loads with no screenshots give 0 console errors at both sizes.

## What works
- **The hero keyboard is still the idea, and it is alive.**
  - **Autoplay:** it plays itself every 2.1 s with no input (`02 → 03 → 04 / 10` across 4 s of idle, on both widths).
  - **Hover:** hovering key 7 sets the display to "Sandboxed Execution · 07 / 10".
  - **Press:** the key travels 4px (`matrix(1,0,0,1,0,4)`).
  - **Finder:** "code" gives 5 of 10 and "image" dims all 10 keys.
- **Last round's main fix landed on desktop: the film answers the row.**
  - **Chat room:** as the rows step every 2.6 s, `.v2-mfilm` goes from scale 1.02 to 1.07, 1.12 and 1.17, and its origin moves from 207 to 357 to 506px over 500 ms. The caption names the open feature.
  - **The other rooms do the same.**
- **The three rooms now differ on desktop.** Chat is a split with the film on the right. Dev is a full-bleed black room with the Zen sphere as its ground and the caption bottom-right. Design is a wide 21:9 film over two rows side by side. The dead band after the keyboard is gone: the hero ends at 865 and the Chat heading sits at 998.
- **Hover and press answer.**
  - **Primary:** magnetic (+2.5px), fill #0a0a0b → #2c2c2e, press scale .98.
  - **Text link:** the underline goes from 30% to full ink.
  - **Chat row:** fills #f5f5f5.
  - **Film card:** the arrow moves 6px.
  - **Band card:** lifts 4px.
- **Stable where it counts on desktop.**
  - **Desktop:** CLS is 0.019 and there is no horizontal scroll.
  - **320:** scrollWidth is 320.
  - **Tap targets:** 0 under 44px in `<main>` at 375.
  - **Reduced motion:** the counter rests at `01 / 10`, `getAnimations()` is 0 and 0 videos play.
  - **JS off:** the h1 is opacity 1, one feature shows on the display, and one row is open per room.
- **Clean.** `taste.py` OK, and 0 hues measured in `<main>`. Fonts are Zen and Zen Mono only. The caption "Platform Features" sits under the h1. Rhythm is 52 / 26 / 21 / 17 / 16 / 12.

## The 11 answers
1. **5 s / 1 s.** Yes on desktop.
   - **Desktop:** the h1 (104–218), lede and ask (264–320), and the live display (372–535) are all on the first screen, and the display changes on its own within the first idle second.
   - **Fold:** the second key row (733–822) is cut by the 801 fold.
   - **Phone:** the h1 is still 4 lines at 40px. The 32px rule at ≤899px loses on specificity, because `lx-lm w2-display` wins. At 375×667 the ask is at 408–460 and the display starts at 500.
   - **Arrival:** in the first frame (d-arr0) the shared header "Try Hanzo" is a filled black pill next to the filled hero ask, so there are 2 solid fills for under a second.
2. **One in, one out?** On desktop, mostly. Each room is one screen with one idea.
   - **Phone:** each step of a room's accordion grows one row and shrinks another, which pushes everything below it. On phone the film sits above the rows, so by the time you read the rows the film's answer is off-screen (after a row tap, the film top is at −135).
3. **A real object in every section?** Yes:
   - **Hero:** the keyboard.
   - **Rooms:** Hanzo's Enso, Zen and Iro films, which now move with the open feature.
   - **Band:** three film cards (365 / 292 / 219 wide).
4. **One ask, nothing floating, scale?**
   - **Ask:** yes after arrival. The header swaps to a filled "Open Chat" after the hero (measured at scroll 899) and goes quiet while the band's ask is in view.
   - **Floating:** nothing floats over content apart from the intended sticky display on phone.
   - **Scale:** has rhythm on desktop.
5. **Every hover and press answers, with no jumps?** No: rows jump under the pointer.
   - **Chat room:** hovering row 04 opens it, row 01 collapses, and the row you are pointing at moves up 65px (top 375 → 310). The pointer ends on the description, not the row.
   - **Dev room:** row 02 moves 32px (561 → 529) and its hover fill is lost (`rgba(255,255,255,.024)` → transparent).
   - **Everything else:** keys, ask, text link, film and band answer cleanly.
6. **Overlaps, font swap, shift?**
   - **Desktop:** clean (CLS 0.019, no font swap).
   - **Phone CLS:** 0.107 with no input at all, from 5 room dwells of 6 s with only the rooms stepping themselves. It was 0.137 over the full walk. Both are past Google's 0.1 fail line. The sources are `li.on`, `LI|LI|LI`, `xft-film-cap` and `xft-prod p1/p2`.
   - **Phone overlap, Dev room broken:** `.xft-prod.p1 .xft-prod-in { grid-template-columns: minmax(0,5fr) minmax(0,8fr) }` (CSS line 112, outside any media query) beats the phone rule `.xft-prod-in { grid-template-columns: minmax(0,1fr) }` (line 159). At 375 the film is 120×90px in the top-left corner, its caption (97px tall, "04 / 04 Inst… Hea… API") spills out of it, and the rows are squeezed into a 191px column. The same happens at 768: the film is 268px wide beside 429px of rows.
7. **Reference?** It feels like apple.com feature rows (a list beside a product film with a progress bar), and the film now changes per feature, so the move is there on desktop. On phone the move happens off-screen.
8. **Different from neighbours?** Yes. A keyboard instrument as the hero is its own medium and signature, and the three rooms now differ from each other on desktop.
9. **18 parts.** All 18 headings have evidence, but part 11 makes a false claim (see the card check). Part 18's "review 8 or more" box is honestly unchecked.
10. **Banned tells.** None:
    - 0 hues;
    - no eyebrow above a heading;
    - no gradient text, Inter or springs;
    - no fade-on-hover;
    - no 3 equal boxes.

    On the edge: `Features.css` now has 50 lines with literal hex or `rgba()`, up from 39 (MASTER part 7 says tokens only).
11. **Copy untouched?** Yes.
    - **Parity:** `parity.py /features` misses only shared header and footer units (44 text, all chrome).
    - **Page copy and links:** every feature string is present, and /chat?skip=login and /dev are present.

## Card check (docs/coverage/features.md)
- **False:**
  - **Part 11, "the product rooms stack on phones (film, then rows), nothing pins over text" and "375×812 … pass with no overlap".** The Dev room does not stack at 375 or 768: it stays two columns, with a 120px film whose caption overflows it. Per the brief, the verdict is capped at 7.
  - **Line 5, "no visible placeholder".** The input has `placeholder="Find a feature"`, and it shows in the frames. This is stale, and harmless in itself.
- **True:**
  - header comment fields; one h1; one solid fill per viewport after arrival;
  - `data-cta` and `data-thumb` on `features.hero` and `features.close`;
  - the film moves to a new crop (scale and origin, 500 ms) as rows step every 2.6 s, and hover, tap or focus takes over;
  - keys travel 4px; hover previews the feature on the display;
  - the display and the top key row are on the first screen at 1470×801 (row 1 bottom 724);
  - the phone header ask swap;
  - JS off shows one feature; reduced motion rests;
  - 0 targets under 44px at 375; scrollWidth 320 at 320;
  - a blocked network gives 0 console errors on a clean load;
  - `taste.py` passes; the `V2:` line is present; no `data-morph`.
- **Unproven:** part 13's "LCP in budget". Not measured here, and the card does not give a number.

## Fixes (in order)
1. **Fix the phone Dev room.**
   - **Change:** inside `@media (max-width: 899px)` in `Features.css`, add `.xft-prod.p1 .xft-prod-in { grid-template-columns: minmax(0, 1fr); }`. This must match the specificity of line 112 to win.
   - **Re-check at 375 and 768:** the film should be full width at 4:3, the caption should sit inside it, and the rows should take the full width below.
   - **Card:** correct part 11.
2. **Stop the rooms shifting the page (phone CLS 0.107 idle).**
   - **Problem:** the self-stepping accordion changes the height of `.xft-rows` on every step.
   - **Fix:** make the open description not change the room's height. For example, render the four descriptions stacked in one grid cell (`grid-area: 1/1`, like `.xft-screen-body`) in a fixed panel under the row list, and show only the open one with opacity and translate. Alternatively, give `.xft-rows` a `min-height` equal to its tallest open state, and let the closing row's description overlap the opening one rather than collapse.
   - **Target:** CLS under 0.02 on phone across a full idle walk.
3. **No row jumps under the pointer (desktop).**
   - **Problem:** hovering a row must not move it.
   - **Fix:** once the height is fixed (fix 2), rows stay put. If you keep the accordion, open on click and focus only and let hover give just the fill (`#f5f5f5`, or `rgba(255,255,255,.08)` in `.p1`).
   - **Check:** row 04 in Chat should keep `top` 375 under hover.
4. **On phone, keep the film's answer in view.**
   - **Problem:** the film sits above the rows, so its crop change happens off-screen.
   - **Fix:** at ≤599px, set `.xft-film { aspect-ratio: 16/9 }` and `.xft-prod { padding-block: 44px }`, so the film and the open row share one 812px screen. Or move `.xft-film-w` after `.xft-rows` on phone.
5. **Phone h1 to 3 lines.**
   - **Problem:** `.xft-h1 { font-size: 32px !important }` inside the 899px query never applies (the h1 measures 40px).
   - **Fix:** raise its specificity to `.xft-hero h1.xft-h1` and pick a size that gives 3 lines at 375. 36px with `letter-spacing: -.02em` holds "Everything you need" on one line. Then the display starts above 480.
6. **Clear the second key row at 801.** It ends at 822. Trim 22px: `.xft-top { margin-bottom: 8px }` and `.xft-find { margin: 8px 0 }`, or `.xft-key { min-height: 76px }`.
7. **One solid fill on arrival.** The shared header "Try Hanzo" paints filled for under 1 s before `usePhoneAsk` and the shared Ask outline it. Set the outlined state on first paint (server class), or request it in `docs/requests/features.md` if it is shared.
8. **Housekeeping.**
   - Swap the 50 literal hex and `rgba()` lines in `Features.css` for tokens.
   - Correct line 5 of the card: the placeholder is visible.
