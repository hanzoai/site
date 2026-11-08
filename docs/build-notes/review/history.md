# /history — James-eye review
Verdict: 7/10
Ready: 8 Nov, held up next to /api and /agents (no score). Years never blank on scroll (entrance marker moved to an attribute), year plates carry Hanzo's real customer logos and the KANOA and Damon photos, h1 before lede, deck greys, gentler domino entrance. copycheck missing 0 of 185; taste/unique/parity OK (text 214/214, links 42/42); 0 console errors, no overflow/overlap at 1470x801 and 375x812.

First complaint: "Twelve years are now a black box with the title written in it, and the same title again right next to it. That's not a picture, that's the text twice. Where are SKULLY, Damon, Triller? And there's still a red error badge in the corner."
(walked 7 Nov at `56bc5016`, 1470×801 fine pointer and 375×812 isMobile/hasTouch; plus 320×700, 375×667, reduced motion, JS off. Scripts and frames are in `scratchpad/critic-history-q8m2/`.)

## What works
- **Round 3 landed most of its fixes.**
  - Your year no longer jumps. `.xhi-prin` stayed at 10427 through clear, "2", "20", "202", "2024" and "2031" (0px of movement).
  - The phone links are 44px. A sweep of every `main` link, button, summary and input at 375 found 0 targets under 44px.
  - Scene figures are 26px, so the 112px year is the one big thing on each scene screen.
  - FDE step numerals are 13px mono captions, so the 10-numeral run is broken.
  - The next section peeks 72px (`.xhi-rec` top 729 of 801).
  - Only the active era shows its line.
- **The scrub is solid at a normal pace.** I jumped to all 13 years with 0.9 s dwells and saw exactly one year each time. The text ends at 497 to 546px and the rail starts at 637px. With the (+) open the text ends at 620px, still clear of the rail.
- **Alive without input.** The hero year runs from load (2018 to 2019 in 1 s at idle on desktop, 2016 to 2017 on the phone). The 44px pause works.
- **Interactions answer.**
  - The clippings throw with inertia: −586px at release, −1106px settled.
  - Hovering a principle inks its numeral and lifts it 4px.
  - `+` presses to scale .95.
  - The Band ask goes #f5f5f7 → #fff.
- **Clean basics.**
  - Parity 214/214 text and 42/42 links. `taste.py` OK.
  - 0 overflow at 375 and at 320.
  - Desktop CLS 0.019, phone CLS 0.007.
  - Reduced motion rests on 2026 with the pause hidden and 0 running animations after 3.5 s.
  - JS off: the h1 is at opacity 1 and all 13 years are visible.

## The 11 answers
1. **Sells in 5 s, moves within 1 s?** Yes on desktop: the h1 cuts in and the year runs.
   - At 500 ms the lede and links are already painted while the h1 is still masked (`d-arrive-500.png`), so the eye lands on the lede first.
   - On the phone the running year starts at y=555, and the shared cookie card (593 to 796) covers most of it on first visit.
2. **One in, one out?** Yes inside the pinned scene.
   - Under a hard flick (400px wheel every 100 ms) 7 of 24 pinned samples had no year's text above 0.5 opacity, and 2 in a row sat at 0.06. The stage blanks. Round 3 fix 7 (drop the in-delays on fast changes) was not done.
   - The rest of the page is still a document: clippings, intro, Your year, six principles, FDE.
3. **A real visual in every section?** **No.**
   - 9 image paths still 404 (`/logos/customers/*`, `/customers/kanoa/buds.webp`, `/customers/damon-motorcycles/reveal.webp`). `public/` has no `logos/` or `customers/`.
   - So 12 of 13 desktop plates are `.xhi-plate-word`: a #0a0a0a slab that repeats the h3 and badge printed 115px to its right (`d-scene-0.png`). It is varied now, but it is the text twice, not an object.
   - On the phone the images are lazy. Until each 404 returns, the plate is an empty #f5f5f5 box (`p-blank.png`, 2017 Unikrn). On load, 6 of 13 plates were in that state.
   - Your year at 2031 and other empty input: a 640px grey box with one line, "Not written yet." (`d-you-2031.png`). It no longer jumps, but it is still an empty box.
4. **One ask in the header; scale rhythm?** On desktop the header reads "Talk to Hanzo FDE" from the hero to the principles.
   - Before hydration it reads "Try Hanzo" (`d-arrive-500.png`), then swaps.
   - When the Band ask is on screen it flips back to an outlined "Try Hanzo" (`d-band-hover.png`). So the header label changes twice per visit.
   - On the phone it is "Try Hanzo" on all 8 sampled screens. The card admits this (part 4 is unticked).
   - Rhythm is now right: one 112px year, then a 26px h3 and a 26px figure. The six principles' 64px numerals remain, but they stand alone now.
5. **Every hover and press answers, no jumps?** Yes; see above.
   - `.xhi-you-in button:hover` sits outside `@media (hover:hover)` (part 8), so on touch the hover border sticks.
6. **Overlap, font swap, layout shift?** No overlap, no font swap, CLS under 0.02.
   - **The red "1 Issue" badge shows on 6 of 6 loads that are watched from the first paint, at both sizes** (`d-idle.png`, `p-idle.png`). It is a hydration mismatch.
     - Page-owned part: React's diff marks `- style={{}}` on the `<input>` in `.xhi-you-in`. The server HTML has a `style` attribute that the client does not.
     - Shared part: `FooterHTML`'s `__html`.
   - Separately, another chat's `Gallery.jsx` parse error appeared once in the console (not this page's).
7. **Reference and its motion?**
   - Apple's pinned scrub: there.
   - grubogrubo's thrown rail: there.
   - The image-led half of osply and hamol is still missing.
8. **Different from its neighbours?** Yes. The running year and the year-cut scene are its own.
9. **18 parts?** Mostly. See the card check: part 18 is stale and false.
10. **Banned tells?** None outright.
    - "01 / 06" still sits above each clipping's figure (it is `.xhi-clip`'s first child), a counter-over-headline pattern.
    - History.css still has 19 lines with literal colours: #0a0a0a, #fff, #f5f5f5, #a3a3a3, #737373 and rgba(0,0,0,.1/.18/.25/.3) and rgba(255,255,255,.16/.55). Round 3 fix 9 was not done.
11. **Copy untouched?** Yes: 214/214 and 42/42. The 1,600+ against 1700+ question is now on the card.

## Card check (docs/coverage/history.md)
- **False:** Part 18, "Done here: critic round 2: 7/10; all six fixes pushed". This is stale. Round 3 listed 11 fixes, and these are not done:
  - 7: flick-proof the scene;
  - 9: tokens only, and "01 / 06" moved under the figure;
  - 10: the hydration badge, which shows on every watched load.
- **Imprecise:** Part 17, "Image failure shows the year's figure". It shows the title and badge as a wordmark, and on the phone it shows an empty grey plate until the 404 arrives.
- **Imprecise:** Part 3 and part 9, "moves within 1 s". True on desktop. On the phone the moving year starts at y=555, under the shared cookie card.
- **True:**
  - part 4 is honestly unticked (the phone header shows "Try Hanzo");
  - part 9: no fade-up (the hero side is a 12px rise only);
  - part 10: wordmark plates, with the request filed (`docs/requests/history.md` exists);
  - part 11: 44px links, 0 overflow at 320;
  - part 1: the copy question listed;
  - part 14: the doubled title "History & Track Record — Hanzo AI — Hanzo AI" is left untouched;
  - one h1; parity; `taste.py`;
  - JS off and reduced motion;
  - the 44px pause with `aria-pressed`;
  - `data-cta="history.band"` with `data-thumb`.
- A false claim caps this verdict at 7.

## Fixes (in order)
1. **Kill the hydration badge.**
   - Find what writes `style` onto `.xhi-you-in input` before hydration. The likely cause is a shared or global script that pins input font size; the page also has `.xhi-you .xhi-you-in input { font-size: 64px !important }`. Either stop that script touching this input, or add `suppressHydrationWarning` to that one `<input>`.
   - File the `FooterHTML` mismatch with its owner.
   - Check: 10 loads watched from the first paint, 0 "1 Issue".
2. **The plates must be pictures, not the title twice.**
   - First choice: mirror the 9 files into `public/logos/customers/` and `public/customers/` (the request is filed; chase it).
   - Until then, stop repeating the h3 on `.xhi-plate-word`. Set the year's figure or badge large, at 44px Air (e.g. "$5.8M Raised", "120,000 ETH"), or the customer name alone. Then drop `.xhi-yr-fig` from the text column so nothing is said twice.
   - On the phone, render the wordmark from the start and fade the image in over it on `load` (the `.ok` rule already hides the word). Do not leave an empty #f5f5f5 box while the request is pending.
3. **Your year empty state.** For out-of-range or empty input, keep the last plate in place, dimmed with a gradient only, and set "Not written yet." or "Type a year." in the `.v2s-title` slot. No more 640px box with one line in it.
4. **Flick-proof the scene.** Add a `.fast` class on `.xhi-scrub` when the index changes less than 200 ms after the last change. Under `.fast`, set `transition-delay: 0` on `.xhi-yr.on .xhi-yr-t`, `.xhi-yr.on .xhi-plate` and `.xhi-cut > span.on`. Re-run the 400px per 100 ms flicks: 0 samples with every `.xhi-yr-t` under 0.5.
5. **Arrival order.** Hold `.xhi-hero-side` at `opacity` 1 but start its rise after the h1's last line has landed (delay of about 0.3 s plus 2×60 ms), or cut the lede in with `Lines`. The h1 must be the first thing seen at 500 ms.
6. **One header label.** Do not swap the desktop header back to "Try Hanzo" when the Band ask is in view: keep "Talk to Hanzo FDE" outlined. Request this in `usePhoneAsk` or Ask.
7. **Tokens only in History.css.** Replace the literals on lines 2, 32, 44, 47, 68, 69, 106, 107, 117, 119, 121, 123, 134, 142 to 147 with `tokens.css` variables. Wrap `.xhi-you-in button:hover` in `@media (hover:hover)`. Move `.xhi-clip-k` after `.xhi-clip-f` (as a caption).
8. **Correct the card.** Part 18: round 3, 7/10, and which fixes are open. Part 17: the wordmark, not the figure. Also update the `V2:` line.
