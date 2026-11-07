# /features — James-eye review
Verdict: 7/10
First complaint: "The keyboard is great, that's the idea. Then it's the same block three times: a list on one side, a black video on the other, flipped. When a feature lights up, the picture doesn't change. Only a little number does. And there's a big empty white gap after the keyboard."
(walked 7 Nov 2026 on the dev server at HEAD `915e945a`, 1470×801 fine pointer and 375×812 touch, plus 320, 375×667, reduced motion and JS off)

Method: Playwright from Node.
- **Arrival and idle:** bursts of 5 to 6 frames, 180 ms apart, then 8 samples 500 ms apart.
- **Scroll:** wheel steps of 500px with 900 ms dwells on desktop; 450px steps on phone.
- **Rooms:** 7 s idle per product room.
- **Input:** hover and press on the ask, text link, keys, rows, film cards and band cards. I typed in the finder, did a 45-stop Tab crawl, tapped keys and rows on the phone, and clicked one film card to see the transition.
- **Measured:** layout shift (PerformanceObserver) and console errors.

api.hanzo.ai was aborted; nothing was sent. The "1 Issue" badge in my frames is a hydration warning that only appears when Playwright screenshots during hydration. A clean load with no screenshots gives 0 console errors on both sizes.

## What works
- **The hero keyboard is alive and answers.**
  - **Autoplay:** it plays itself every 2.1 s with no input: `01 / 10` → `02` at ~1.0 s after idle → `03` at ~3.1 s, on both widths.
  - **Hover:** hovering key 7 with the mouse sets the display to "Sandboxed Execution · 07 / 10".
  - **Press:** the key travels 4px (`matrix(1,0,0,1,0,4)`).
  - **Finder:** "code" gives 5 of 10; "image" gives 0 of 10 and dims all 10 keys.
- **Last round's big problems are fixed.**
  - **Phone rooms stack:** film, then heading, then rows. Nothing pins over text.
  - **Real Hanzo media:** the Enso, Zen and Iro films are in.
  - **Rooms open their product.** Clicking the Dev film runs a black title stage with "Hanzo Dev" and lands on /dev.
  - **Phone ask:** the header swaps to a filled "Open Chat" from scroll 450 to the end. It is outlined while the hero ask is on screen, and back to quiet while the band ask is in view.
- **Rooms step by themselves.** In each room one row opens every 2.6 s while it is in view (01 → 02 at 2.9 s → 03 at 5.5 s), and the film card's counter and progress bar follow. Hovering row 3 opens it and sets the film counter to `03 / 04`. A tap on phone does the same (row 4 gives `04 / 04`).
- **Hover and press answer.**
  - **Primary:** magnetic, fill #0a0a0b → #2c2c2e, press scale .98.
  - **Text link:** the underline goes from 30% to full ink.
  - **Film card:** the video scales to 1.03 and the arrow moves 6px.
  - **Band cards:** they lift.
- **Stable.**
  - **CLS:** 0.00024 desktop, all from the shared header cluster; 0 on phone.
  - **Width:** scrollWidth 320 at 320.
  - **Tap targets:** 0 targets under 44px in `<main>` at 375.
  - **Films:** at most 2 play at once.
  - **Reduced motion:** the counter rests at `01 / 10`, `getAnimations()` is 0 and 0 videos play.
  - **JS off:** the h1 is opacity 1, one feature shows on the display, and one row is open per room.
- **Scale has rhythm.** On desktop the sizes are 52 (h1, once) / 26 (display name, h2s) / 21 lede / 17 / 16 / 14 / 13 / 12 mono. There is one big thing, and the rest is medium and small.
- **Clean.** `taste.py` OK and 0 hues measured in `<main>`. Fonts are Zen and Zen Mono only. Nothing sits above the h1: "Platform Features" is a caption under it.

## The 11 answers
1. **5 s / 1 s.** Yes.
   - **Desktop:** the h1 (124–238), lede, ask (284–340) and the live display (392–555) are all on the first screen, and the display changes on its own at about 1 s after idle.
   - **Gaps:** the second key row ends at 838–842, past the 801 fold. On a first visit the shared cookie card (716–785) covers the first key row's labels.
   - **Phone:** the h1 is 4 lines at 40px (MASTER asks for 3). The ask sits at 416–468, and the display starts at 508, so 159px of product is visible at 375×667.
2. **One in, one out?** Mostly. Each room is one ~751px screen with one idea, and white, quiet grey and white alternate.
   - **Dead band:** there is about 230px of empty white between the keyboard and "Hanzo Chat": `.xft-hero` padding-bottom 116 plus `.xft-prod` padding-top 116 (frame d-s01).
   - **Repeats:** the feature names still appear three times (keycap, display, room row), and the product names four times (cluster label, h2, film caption, band card).
3. **A real object in every section?** Yes:
   - **Hero:** the keyboard.
   - **Rooms:** Hanzo's films.
   - **Band:** three film cards.

   But the films are abstract model art (Enso ring, Zen sphere, Iro mountains), not the product. They don't change with the open row: only the `NN / 04` caption and the bar move. Each film shows the same frame whichever feature is open.
4. **One ask, nothing floating, scale?**
   - **Ask:** yes. One solid fill per viewport ("Open Chat" in the hero, then in the header, then in the band with the header quiet).
   - **Floating:** nothing floats over content. On phone the sticky display (64–284) slides over the keys above it by design, and the tapped key stays in view below it (key 9 top at 383).
   - **Scale:** OK.
5. **Every hover and press answers?** Yes for the keys, rows, ask, text link, film cards, band cards and pause. Two gaps:
   - **Row hover:** it changes no background (`rgba(0,0,0,0)` before and after). Only the row opening tells you.
   - **Finder:** a 1406px-wide empty white bar with only a magnifier and no visible words. With focus it gets a 1px ink ring, which reads as a lazy plain box.
6. **Overlaps, font swap, shift?** No font swap (Zen loaded, h1 box holds), and no shift above 0.0003. Nothing overlaps at 1470×801 or 375×812 apart from the intended sticky display on phone.
7. **Reference?** It feels like apple.com feature rows, with a list beside a product film and a progress bar.
   - **synchronized.studio is half there.** The film card opens into /dev through a title stage, but the stage title "Hanzo Dev" does not land on /dev's h1 ("Describe the change. Dev ships it.", top 219), so it is a page transition, not a card that becomes the hero.
   - **anthropic.com and apple.com are missing their key move:** the product changing state as each feature lights.
8. **Different from neighbours?** The hero medium (a keyboard instrument) and signature are its own. The rooms (numbered accordion rows beside a black media card, mirrored) are a common pattern and read as one block repeated three times.
9. **18 parts.** The card has all 18 with evidence. No false claim found (see below). Part 18's "review 8 or more" box is honestly unchecked.
10. **Banned tells.** None found:
    - 0 hues;
    - no eyebrow above a heading;
    - no gradient text, Inter or springs;
    - no fade-on-hover;
    - no 3 equal boxes (band cards measure about 365 / 292 / 219 wide).

    On the edge: `Features.css` still has 39 lines with literal hex or `rgba()` (MASTER part 7 says tokens only).
11. **Copy untouched?** Yes.
    - **Parity:** `parity.py /features` reports only the shared header and footer units as missing (44 text, 40 links, all chrome).
    - **Page links:** /chat?skip=login and /dev are present.
    - **Display label:** it wraps on phone instead of truncating.

## Card check (docs/coverage/features.md)
- **True:**
  - header comment fields; one h1; one solid fill per viewport;
  - `data-cta` and `data-thumb` on `features.hero` and `features.close`;
  - phone ask swap (measured at 450 px and onward);
  - rooms stack on phone; films via `ModelFilm`, at most 2 playing;
  - rows step every 2.6 s and drive the film counter; hover previews the feature; keys travel 4px;
  - JS off shows one feature; reduced motion rests;
  - 0 targets under 44px at 375; scrollWidth 320;
  - blocked network gives 0 console errors; finder states; `taste.py` passes;
  - the display and first key row are on the first screen at 1470×801 (bottom 744; second row is below);
  - the `V2:` line is in `Features.jsx`.
- **Half-true:**
  - **Part 3, "the card's title carries `data-morph`".** The attribute is there, but the morph lands on a different h1 (not within 12px of the destination title).
  - **The parity note.** It is right about chrome-only misses.
- **Stale, not on the card but worth fixing:** `app/features/page.jsx` line 1 still says "three pinned product chapters".
- **False:** none found. The verdict is not capped.

## Fixes (in order)
1. **Make each room's picture answer the feature.**
   - **What changes:** when a row opens, the film card must visibly change, not only `.xft-film-cap .x-mono`. For example, give each row its own crop or time of the film. Set `video.currentTime` to a per-row offset with a 300 ms crossfade, or step `object-position` / scale (1 → 1.08) per row on `.xft-film video` with ease-in-out at 400 ms.
   - **Better, if Hanzo has them:** show the product's own UI frame per feature via `Pic` (Chat window, Dev CLI, Design canvas).
   - **Why:** this is the one thing keeping the rooms from feeling alive.
2. **Break the three-identical-rooms pattern.** Keep the copy and give each room its own layout and move:
   - **Chat:** keep the current split.
   - **Dev:** a full-bleed black room with the film as background and the rows on it in `#fafafa`. This is one of the 2 allowed black rooms, entering as a rounded card that opens to full width.
   - **Design & Cloud** (2 features): a wide film over its two rows side by side.
3. **Close the dead band.** `.xft-hero { padding-bottom: 44px }` and `.xft-prod.p0 { padding-top: 72px }`, so the Chat room peeks into the first scroll. Pull `.xft-inst` up about 40px (`.xft-hero` padding-top 64 → 44, or a smaller `.xft-top` margin) so the second key row clears 801.
4. **The finder is a blank box.** Shrink `.xft-find` to the board's first column (about 360px) or set it inline right of the cluster labels, with a visible hint. The hint needs a `content/ui-strings.json` entry (request it), or reuse the existing "Find a feature" aria-label text as the placeholder. A 1406px empty bar reads as unfinished.
5. **Phone h1 to 3 lines.** At ≤599px, set `.xft-h1` to 38px with `max-width: none` (or `letter-spacing: -0.02em`), so "Everything you need to" holds one line. Then lift the display above 480.
6. **Morph lands true.** Either send the film-card title into /dev's h1 position and size (within 12px), or drop `data-morph` from `.xft-film-cap b` and call it a page transition on the card.
7. **Row hover fill.** Inside `@media (hover:hover)`, set `.xft-rows button:hover { background: #f5f5f5 }` (`#ededed` in the grey room `.p1`), so hover answers before it opens.
8. **Cut one repeat of the product name.** Drop the visible `<b data-morph>` name from `.xft-film-cap` (keep it for the morph via `aria-hidden` and visually hidden), since the h2 sits right beside it.
9. **Housekeeping.**
   - Swap the 39 hex/`rgba()` lines in `Features.css` for tokens.
   - Update `app/features/page.jsx` line 1's stale `V2:` text.
   - Set `aria-hidden` band cards to `tabIndex={-1}` plus `role="presentation"`, or make them real labelled links. Right now they are tappable links hidden from assistive tech.
