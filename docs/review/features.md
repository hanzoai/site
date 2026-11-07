# /features — James-eye review
Verdict: 6/10
First complaint: "The keyboard at the top is the idea and it finally works. Then I scroll and it turns into the same page again: a list of the same ten feature names, next to boxes that show those names a fourth time, blank pills on a dotted grid and grey bars. There's no real Hanzo product in it. On my phone the picture sits on top of the words while I'm trying to read them."
(walked 7 Nov 2026 on the dev server at HEAD `f244a55c`, 1470×801 fine pointer and 375×812 touch, plus 320, 375×667, reduced motion and JS off)

Method: Playwright bursts on arrival (6 frames, 150 ms apart) and at idle (8 to 10 frames with frame diffs). I scrolled in 400 to 600px steps with dwells, then hovered and pressed the ask, the text link, the keys and the pause, typed in the finder, did a 40-stop Tab crawl and tapped on the phone. I logged layout shift with a PerformanceObserver and captured console errors. api.hanzo.ai was blocked; nothing was sent.
- **The "1 Issue" badge in my frames was my own test.** A console.error (hydration mismatch) appears only when Playwright screenshots during hydration, because it injects `caret-color` into `.xft-find input`. The same thing happens on /tabs. A clean load of /features gives 0 errors and no badge.

## What works
- **The hero keyboard is a real instrument.**
  - It plays itself every 2.1 s. The counter reads `01 / 10` → `02` → `03`, and it ran on both widths with no input.
  - Hovering a key with the mouse previews its feature on the display (key 7 → "Sandboxed Execution"). Hovering also stops the autoplay.
  - Press travels 4px (`matrix(…,0,4)`), and the lit key stays down in silver.
  - The keys 1–0 on the keyboard play the keys.
  - The finder works: "voice" gives 1 of 10, "code" gives 5 of 10, and Enter plays the first match.
- **The display bug from the last review is fixed.** The name is `#fafafa` at 26px, and the counter reads `NN / 10`.
- **The phone display is sticky.** Tapping key 9 left the display at 64–298 and the key at 378–479, so the tap answers in view.
- **The h1 is right.** It is 52px desktop and 40px phone, cut in by line mask, with nothing above it. "Platform Features" sits below it as a caption.
- **One solid fill on desktop.** On desktop the header swaps "Try Hanzo" → "Open Chat" (quiet) once the hero ask leaves (by 600px). The closing band repeats the ask, and the footer follows with no gap.
- **The primary answers.** Hovering it: magnetic offset (2.5, 1.25), fill #0a0a0b → #2c2c2e and the arrow nudges 3px. Press: scale .98. The text link's underline goes to full ink.
- **Stable, and it degrades well.**
  - CLS is 0.0002 on desktop (all from the shared header) and 0.0001 on phone.
  - There is no horizontal scroll at 320 (scrollWidth 320).
  - Under reduced motion the counter stays at `01 / 10` and no animations run.
  - With JS off, one feature shows on the display and the h1 is at opacity 1.
- **Copy is clean.** All 30 page units (live indices 10–39) are in `<main>`, with links /chat?skip=login and /dev. `taste.py` and `unique.py` both pass.

## The 11 answers
1. **5 seconds, 1 second.** Yes on desktop: the h1 cuts in by 918 ms and the display swaps within about 2 s. Two gaps:
   - **Desktop keys.** The first key row spans 731–835 against an 801 fold, so only the keycap numbers show. The key names are below the fold, and the cookie card covers them on a first visit.
   - **Phone.** The h1 is 4 lines (MASTER asks for 3 at 40px). The display starts at 585, so 82px of product is visible at 375×667.
2. **One in, one out?**
   - **Hero, desktop chapters, band:** yes. Each chapter lights one row at a time while the visual answers.
   - **But it repeats.** Each feature name still appears four times: keycap, display, chapter list, and the chips or terminal line inside the visual. Each description appears twice.
   - **Dead space.** There is about 250px of empty white between the keyboard and "Hanzo Chat" on desktop (frame s02), and a full screen holding only a lone pause button on phone (scroll 3700).
3. **A real object in every section?**
   - **Hero:** yes.
   - **Chapters:** no. They are drawn word-mocks:
     - the Chat visual is a "Ask Hanzo anything" bubble over four chips repeating the list;
     - the Dev visual is a tick list of the same four names;
     - Design & Cloud is five empty outlined pills on a dotted grid, plus three grey bars.
   - **Band:** three product names in grey.
   - **Media:** no Hanzo media anywhere except the 36px Enso avatar.
4. **One ask, nothing floating, scale rhythm?**
   - **Desktop:** yes. The header carries "Open Chat" after the hero.
   - **Phone:** the header stays "Try Hanzo" all the way down. The page's "Open Chat" bottom bar appears only in a ~150px window, around scroll 3150, then vanishes. For about 2,500px the page ask is absent.
   - **Scale:** OK. 52 / 26 / 21 / 16 / 13 on desktop: one big thing, the rest medium and small.
5. **Every hover and press answers?**
   - **Yes:** the keys, the primary, the text link and the pause (fill #171717 → #0a0a0a).
   - **No:** the chapter rows react to nothing on hover (no class, background or cursor change), and the chapter visuals are inert. The "image" search dims all 10 keys and says only "0 of 10".
6. **Overlap, font swap, shift?**
   - **No swap and no shift:** Zen is loaded and the h1 holds.
   - **Phone overlap:** the chapter visual is sticky at 68–558 (490 of 812px), and the list text scrolls underneath it. I measured 108px of overlap at every step from scroll 1800 to 3700, leaving about 250px to read in.
   - **Phone mismatch:** at scroll 2700 the visual already shows Design & Cloud while the text beneath still reads "Instant Headless API".
   - **Phone truncation:** the display label truncates Hanzo's words to "HANZO CHAT · DE…" and "HANZO DEV · CLI…".
7. **Reference.** It feels like an apple.com pinned chapter with a progress rail (01–03), and that is there on desktop. synchronized.studio is absent: nothing opens into its page, and no chapter or key links to /chat, /dev or /design by Morph. There are no product renders or films, as the anthropic.com and apple.com references would have.
8. **Different from neighbours?** The hero medium and signature are its own (a keyboard instrument). Below the hero it is still the Business 2 frame (LineMask, PinChapters 01–03 rail, magnetic pill, band) shared with /tabs, /risk, /sign, /treasury and /ui.
9. **18 parts.** The card has all 18 parts with evidence. Two claims are false (see below), and part 18 stays unchecked.
10. **Banned tells.** None in `<main>`:
    - 0 hues;
    - no eyebrow above a heading;
    - no `title=`;
    - no fade-on-hover;
    - no gradient text;
    - no springs.

    The one borderline item: the chapter pause buttons float detached about 56px below their visual (`.xft-vis` padding-bottom 56). On phone one floats alone on an otherwise empty screen.
11. **Copy untouched?** Yes. All 30 units are present, in order, apart from "Platform Features" moving below the h1. The hero's second "Try Hanzo" removal matches live, which has only "Open Chat" and "Launch Dev" in the hero. "Ask Hanzo anything" is in `content/pages/features.html`. The display label is visibly truncated on phone (see 6).

## Card check (docs/coverage/features.md)
- **True:**
  - header comment fields;
  - one h1;
  - one solid fill per viewport on desktop;
  - `data-cta` and `data-thumb` on both primaries;
  - hover previews the feature;
  - keys travel 4px;
  - JS off shows one feature;
  - reduced motion rests;
  - the 44px page targets;
  - primary above the fold at 375×667 (bottom 542);
  - no scroll at 320;
  - blocked network gives 0 console errors;
  - finder states;
  - `aria-live` off while autoplaying;
  - one decorative `Img`.
- **Half-true:**
  - **Part 3, "the display and the top row of keys sit on the first screen at 1470×801".** The key row is cut at 801 (731–835), and its labels are below the fold.
  - **Part 18, "`V2:` line in `app/features/page.jsx`".** It is there but carries no `<score>/10`.
- **False:**
  - **Part 4, "Sticky ask 'Open Chat'".** On phone, "Open Chat" is absent from the header at every scroll position, and the bottom bar shows only around y≈3150.
  - **Part 11, "375×812 ... pass with no overlap".** The sticky chapter visual covers list text by 108px from scroll 1800 to 3700.
- **Minor:** the card says page units are "indices 10–38, 29". They are 10–39, 30. All are present.
- These false claims cap the verdict at 7. The page earns 6 on its own.

## Fixes (in order)
1. **Phone chapters: stack, don't pin** (MASTER part 11: pinned scenes stack under 900px). Under `@media (max-width: 899px)`, make the chapter visual `position: static` (override the PinChapters sticky on `#xft-products`) and render each chapter as visual, then heading, then its four rows. The text must never pass under the visual, and the visual must never show the next chapter early.
2. **Real Hanzo product in the chapters, not words.** Replace `ChatUI` chips, `DevUI` tick list and `CanvasUI` blank pills and bars with Hanzo's own product renders or films, via kit `Pic` or `Film`: the Hanzo Chat app, the Dev CLI or web, the Design canvas. That brings 4 or more real visuals on screen and the page's only colour. Each visual should answer the lit row with a state of the product, not the feature name again. Then each name appears at most twice (key and display, or list and visual).
3. **Open into the product.** Make each chapter's visual (and its h2) an `A` to /chat, /dev and /design that opens by Morph (card → page hero). The keys stay play-only.
4. **Phone ask.** "Open Chat" must be the persistent ask on phone. Either let the header swap to "Open Chat" past the hero, as it does on desktop, or keep the `.x-ask` bar visible from the hero's exit to the band, except while the band's own ask is in view. Kill the 150px flash around scroll 3150.
5. **Tighten the first screen and the gaps.**
   - **Desktop:** pull the board up about 60px (cut `.xft-hero` top padding from 100 to about 72, and `.xft-top` margin-bottom) so the first key row and its labels clear 801. Remove the ~250px dead band between `.xft-hero` and the chapters (`.xft-hero` padding-bottom and the PinChapters top padding).
   - **Phone:** let the h1 sit at 3 lines. Drop `.xft-h1` to 38px or loosen `max-width` so "Everything you need to" holds one line, and lift the display so it is above 560.
6. **Phone display label.** Do not truncate Hanzo's words. Drop `white-space: nowrap` and the ellipsis on `.xft-screen-top > span:first-child` and let it wrap to 2 lines, or move `· Default` / `· CLI + Web` under the name.
7. **Chapter rows answer.** Make `.xft-ch-list li` buttons that light their row and drive the visual on hover (`@media (hover:hover)`), tap and focus, and pause the 1.8 s autoplay while touched. Move the chapter pause into the visual's top-right corner (`.xft-vis .w2-pause { top: 12px; right: 12px; bottom: auto }`, and drop the 56px padding-bottom) so it never floats alone.
8. **Band object.** The three grey names are not an object. Give the band one quiet live piece: for example the keyboard's display, settled on the last feature played, or the product render from fix 2 at small size. Keep the one ask.
9. **Housekeeping.** Swap the 36 hex lines and 19 `rgba()` literals in `Features.css` for tokens. Add `V2: <score>/10` to `app/features/page.jsx`. Correct the card's part 4 and part 11 claims, and the "10–38 / 29" note.
