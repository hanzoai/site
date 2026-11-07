# /history — James-eye review
Verdict: 7/10
First complaint: "Twelve of the thirteen years are the same grey squiggle. Where are the customers? SKULLY, Damon, Triller: I want to see them. And the first screen is still a wall of text next to a big number."
(walked 7 Nov at `c95ee691`, 1470×801 fine pointer and 375×812 isMobile/hasTouch; plus 320×700, 375×667, reduced motion, JS off. Scripts and frames are in `scratchpad/critic-history-r3k7/`.)

## What works
- **The stage no longer goes blank at a normal pace.** In a slow walk (one year at a time, 1.1 s dwell) all 13 years show exactly one year, its text and its plate.
  - A hard flick test (400px wheel every 100 ms, about 4,000 px/s) gave 19 pinned samples: 0 doubles. One sample was fully empty (2025, text 0.00 / year 0.00) and three had the year fully out of its mask. Round 2 was blank at much slower speeds.
- **The scene is now short.** Title, badge (under the h3), figure, first line and links. The rest sits behind a 44px (+) `<details>`. Opened, the text ends at 629px and the year rail starts at 637px, so it still fits.
- **One solid per screen.** "Explore Our History" is now a text link (underline plus arrow +4px on hover). The page's one ask, "Talk to Hanzo FDE", is in the desktop header and the Band. No desktop ask bar floats over content any more (the only fixed layer is the shared cookie card).
- **Scale is back on the deck.** The hero year is 111.7px, the scene year 111.7px, the h1 52px and the scene headings 26px.
- **The phone stacks the 13 years** (659 to 775px each). It has no sideways rail any more, 0 overflow at 375 and at 320, and the ask's link sits at 424px on 375×667.
- **Alive without input.** The hero year runs 2017 → 2019 in 3 s on arrival. The 44px pause holds it (`aria-pressed=true`, 2020 still 2020 after 2 s).
- **The drag rail throws with inertia** (−600px at release, −980px settled). A hovered clipping straightens and lifts 6px. The clippings' ring is gone, so they are only raised now.
- **Reduced motion and JS off work.** Reduced motion rests on 2026 with the pause hidden, and 0 running animations after 3.5 s. JS off shows the h1 at opacity 1 and all 13 years stacked, with 0 hidden.
- **Clean scripts.** Parity 214/214 text and 42/42 links. `taste.py` OK. Phone CLS 0.

## The 11 answers
1. **Sells in 5 s, moves within 1 s?** It moves (the year runs from load), but the first screen is still wordy.
   - The 5-line lede plus four eras, each with a title, a span and a 2-line description, comes to about 20 lines beside the h1.
   - The next section peeks 16px (`.xhi-rec` top 785 of 801), not 56px.
   - The lede and links arrive as a plain 1 s opacity fade (`motion.div` opacity 0→1, delay 0.5 s). That is a fade-up the card does not count.
2. **One in, one out?** Yes in the pinned scene. Elsewhere it reads as a document: clippings, intro, Your year, six principles and four FDE steps.
   - On the phone the 13 stacked years are about 9,400px of the 19,394px page.
3. **A real visual in every section?** **No, not in the scene.**
   - 9 of the 10 plate images 404 on localhost: `/logos/customers/{skully.png,bellabeat.svg,unikoin-gold.svg,casper-blockchain.svg,trillerfest.png,keek-social.svg}`, `/customers/kanoa/buds.webp` and `/customers/damon-motorcycles/reveal.webp`. `public/` holds only `fonts/` and `models/`.
   - So 12 of 13 years show the same Sigil contour on #f5f5f5. Only 2026 (`/models/zen.webp`) is real Hanzo media.
   - The clippings are text-only paper cards, with 150 to 200px of empty middle (`d-clips-drag.png`).
4. **One ask in the header; scale rhythm?** On desktop the header ask is "Talk to Hanzo FDE": good.
   - On the phone the header ask reads "Try Hanzo" on every screen I took, and nothing sticky carries "Talk to Hanzo FDE".
   - **Rhythm.** Each scene screen holds two big things: the 112px year and the 44px Air metric ("120k ETH Raised · Acquired", "$2.4B+ ATH Market Cap"). The scene year never settles to a resting size.
   - **Numeral run.** The 10 Air numerals in a row (principles 01–06 at 64px, then FDE 01–04 at 64px) are unchanged. FDE is four equal columns.
5. **Every hover and press answers, no jumps?**
   - Hover and press: yes. The text links underline and their arrows move 4px. Clippings straighten. Principle numerals ink and rise 4px. The Band ask goes #f5f5f7 → #fff. ± press to .94.
   - **Your year jumps.** Typing "2024" keeps the box at 360px for 3 keystrokes, then it grows to 622px on the 4th. The principles below move from 648 to 910 (+262px).
   - The empty states ("Not written yet.", "Type a year.") are still one line at the top of an empty 360px grey box (`d-you-2031.png`).
6. **Overlap, font swap, layout shift?** No overlap and no font swap.
   - Desktop CLS was 0.13, almost all from the Your year height change (0.064 + 0.065, sources `.xhi-prin`). Part of that comes from Playwright `fill()` not counting as input, but the real-typing probe confirms the 262px move.
   - **A red "1 Issue" dev badge** (a hydration mismatch, "attributes of the server rendered HTML didn't match") showed on 2 of 7 loads, at both sizes (`d-idle.png`, `p-idle.png`). I could not reproduce it in 5 more loads, and another chat had uncommitted shared edits (`usePhoneAsk.js`), so the cause is not attributed. It must be clean before "ready".
7. **Reference and its motion?**
   - Apple pinned scrub: there, and robust now.
   - grubogrubo/osply drag rail with inertia: there.
   - What is missing is the image-led half of osply and hamol: the scene is type plus contour drawings.
8. **Different from its neighbours?** Yes. The running year and the year-cut scene are its own (About: curve; Blog: cover). It still closes on the shared StoryClose band.
9. **18 parts?** Mostly covered. See the card check: four claims are false.
10. **Banned tells?** None outright.
    - Borderline: the "01 / 06" counter still sits above each clipping's figure.
    - The page CSS keeps literal colours: #f5f5f5, #a3a3a3, rgba(0,0,0,.1/.18/.25/.3) and rgba(255,255,255,.16) (part 7 says tokens only).
11. **Copy untouched?** Yes: parity 214/214 and 42/42.
    - The open question from round 2 ("1,600+ repositories" against "1700+ repos" on the same page) is still not listed on the card.

## Card check (docs/coverage/history.md)
- **False:** Part 11, "44px links". At 375 the hero links "Explore Our History", "About Hanzo" and "Open Source" and "Explore the full Zen manifesto" are 21px tall (156×21, 110×21, 111×21, 229×21).
- **False:** Part 4, "Sticky ask: the shared bar carries Talk to Hanzo FDE". There is no ask bar on desktop (the header carries it), and the phone header says "Try Hanzo".
- **False:** Part 10, "customer photos and logos from Hanzo's case studies". 9 of 10 image paths 404, so 12 of 13 plates are the Sigil fallback.
- **False:** Part 18 says "all six fixes pushed", and the page's `V2:` line says "all fixed". Round 2 listed 9 fixes. Fix 8 (the Your year empty state) is not done, and the 10-numeral run and the 01 / 06 placement are unchanged.
- **Imprecise:** Part 9, "0 fade-ups". The hero side is an opacity fade.
- **True:**
  - one h1;
  - parity 214/214 and 42/42;
  - `taste.py` passes;
  - JS off stacks all 13 years;
  - reduced motion holds 2026 and hides the pause;
  - a 44px pause with `aria-pressed`;
  - the phone stacks the years;
  - no overflow at 320;
  - `data-cta="history.band"` and `data-thumb`;
  - kit `Cta` links;
  - the disclosure is in the HTML.
- A false claim caps this verdict at 7.

## Fixes (in order)
1. **Real plates.**
   - Mirror the 9 missing files into `public/` at the paths `historyData.js` already uses (`/logos/customers/skully.png`, `bellabeat.svg`, `unikoin-gold.svg`, `casper-blockchain.svg`, `trillerfest.png`, `keek-social.svg`, `/customers/kanoa/buds.webp`, `/customers/damon-motorcycles/reveal.webp`), from Hanzo's own live assets. If `public/` is shared, file `docs/requests/history.md`.
   - Until they exist, vary the Sigil per era (its seed alone is not reading as different), so the 12 plates are not one squiggle.
2. **Phone tap targets.** Give `.xhi-hero .v2s-acts a` and `.xhi-prin-h a` `display:inline-flex; align-items:center; min-height:44px`. Check that all four links measure 44px or more at 375.
3. **Your year must not jump.**
   - Give `.xhi-you-a` one fixed height equal to the filled card (about 622px at 1470), with the plate always present.
   - For empty or out-of-range input, keep the plate (Sigil) and set the message in the `.v2s-title` slot where the year title sits.
   - Do not collapse while a 4-digit year is still being typed: show the last valid year until 4 digits are in.
   - Target: `.xhi-prin` top does not move while typing.
4. **Thin the first screen.**
   - Show only the active era's description (`.xhi-eras li:not(.on) p { display:none }`, or a clip-path reveal on `.on`). That cuts about 6 lines.
   - Shorten `.xhi-hero` so the next section peeks 56px (min-height `calc(100svh - 76px - 40px)`, measure until `.xhi-rec` top is about 745 at 801).
   - Replace the hero-side opacity fade with the line mask, or no motion.
5. **One big thing per scene screen.**
   - Drop `.xhi-yr-fig` from 44px to 26px (or move it into the `<details>`), so the 112px year is the only big thing.
   - Let `.xhi-odo-w .xhi-cut` rest at 84px and grow to 112px only during the cut.
6. **Break the numeral run.** Set the FDE step numerals (`.xhi-fde-l li > span`) as 13px Zen Mono captions, or the principles' as 26px, so the page does not stack 10 Air 64px numerals across two screens.
7. **Flick-proof the last gap.** Remove the in-delays (`.xhi-cut > span.on` .1s; `.xhi-yr.on` .08s/.06s) whenever the index changes less than 200 ms after the previous change (a `.fast` class on `.xhi-scrub`). Re-run 400px per 100 ms flicks: 0 samples with both text and year under 0.5.
8. **Phone ask.** The phone header shows "Try Hanzo" on /history. Make `usePhoneAsk` (or a request to its owner) put "Talk to Hanzo FDE" there, as on desktop.
9. **Tokens only in History.css.** Replace #f5f5f5, #a3a3a3 and the literal rgba borders and shadows (lines 32, 44, 47, 68, 107, 124, 132, 133, 135, 136) with `tokens.css` variables. Move "01 / 06" under the clipping figure.
10. **Hydration badge.** Reload /history cold 10 times with the dev overlay open and fix the mismatched attribute if it is page-owned (suspects: `inert` on the inactive `.xhi-yr` articles, and the motion values in `Hero`).
11. **Correct the card and the `V2:` line:**
    - parts 4, 9, 10, 11 and 18;
    - list the "1,600+ repositories" against "1700+ repos" copy question.
