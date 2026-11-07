# /features — James-eye review
Verdict: 7/10
First complaint: "On my phone, when I scroll down the keyboard, that black box sits on top of the keys and hides half of them, with a big empty black gap at its bottom. Then the three product bits underneath are all the same layout, one after another."
(walked 7 Nov 2026 at HEAD `49183125`, 1470×801 fine pointer and 375×812 touch, plus 320, 375×667, 768, reduced motion and JS off)

Method: Playwright from Node, api.hanzo.ai aborted, consent preset to "reject" so the cookie card did not block the pointer.
- **Arrival and idle:** 6 frames 180 ms apart, then 8 samples 500 ms apart.
- **Scroll:** wheel steps of 500px (450px on phone) with 900 ms dwells.
- **Rooms:** 6 s in each room, sampling `--r`, the film transform, video time and the geometry of the film, rows and description.
- **Input:** hover and press on the ask, text link, keys, rows, films and band cards; the finder ("code", "image"); a 30-stop Tab crawl; key and row taps on phone.
- **Measured:** CLS (PerformanceObserver with sources), console errors, LCP, fonts, tap targets, scrollWidth at 320.

The red "1 Issue" badge in the frames is the hydration warning that only fires when screenshots are taken during hydration. Two clean loads per size with no screenshots gave 0 console errors.

## What works
- **The keyboard is still a real idea, and it plays itself.**
  - **Autoplay:** `01 → 02 → 03 / 10` over 4 s of idle at both sizes.
  - **Hover:** hovering key 7 shows "Sandboxed Execution · 07 / 10".
  - **Press:** the key travels 4px (`matrix(1,0,0,1,0,4)`).
  - **Finder:** "code" gives "5 of 10" with 5 keys dimmed; "image" gives "0 of 10" with all 10 dimmed.
- **Every round-4 fix landed.**
  - **No row jumps on hover:** Chat row 04 holds at 490 under hover and only fills (`#f5f5f5`). Dev row 02 holds at 398 and fills at white 8%.
  - **Hover no longer opens rows.** The open row changes on click and focus only.
  - **Phone rooms stack:** at 375 and 768 the film is full width (343×257, 736×552) with the rows below.
  - **Phone CLS is gone:** 0.0027 over 18 s idle across the three rooms, and 0.0041 over the full phone walk. Desktop is 0.0004.
  - **Phone answers stay in view:** after a row tap in Dev, the film (76–334) and the description (703–772) are both on the 812 screen.
- **The film answers the row.** As the rows step every 2.6 s, `.v2-mfilm` goes from scale 1.02 to 1.07, 1.12 and 1.17, with the origin moving. A click on Chat row 04 gives scale 1.17 and the caption "Bidirectional Voice".
- **Desktop rooms differ:** Chat is a split with the film on the right (830×519, 16:10). Dev is a full-bleed black room with the Zen sphere as its ground. Design is a 21:9 film over two side-by-side rows.
- **Hover and press answer.**
  - **Ask:** magnetic +2.5px, fill `#0a0a0b` → `#2c2c2e`, press scale .98.
  - **Text link:** the underline goes from 30% to full ink.
  - **Film:** the arrow moves 6px and the crop grows to 1.21.
  - **Band card:** lifts 4px.
- **One solid ask.** On arrival the hero "Open Chat" is the only solid fill, and the header "Try Hanzo" is outlined. After the hero, the header becomes a solid "Open Chat". It goes clear while the band's ask is in view.
- **Clean.**
  - `taste.py` OK. Fonts are Zen and Zen Mono only.
  - LCP is 556 ms (the lede).
  - scrollWidth is 320 at 320, and 0 targets under 44px in `<main>` at 375.
  - Reduced motion rests at `01 / 10` (still `01` 3 s later), with 0 running animations and 0 videos playing.
  - JS off: h1 opacity 1, one feature on the display, one description per room.

## The 11 answers
1. **5 s / 1 s.** Yes on desktop.
   - **First screen:** the h1 (104–218), lede and ask (261–320), the display (360–523) and the top key row all fit in 801.
   - **Within 1 s:** the h1 cut-in and the stage settle play on arrival.
   - **First idle move:** the first self-press is about 2.1 s after hydration. Nothing in the hero is ambient before that.
   - **Phone:** h1 30px on 2 lines, ask at 303–355 (inside 667), display at 383.
2. **One in, one out?** Mostly on desktop: the Chat and Dev rooms are one screen each.
   - **Design room (desktop):** 1001px tall. Its h2 sits below the film (h2 at about 717 when the film fills the screen), so the title arrives after the object and the rows fall past the fold.
   - **Phone:** the three rooms are the same stack (film, h2, tag, four rows, description), so it reads as a repeated template.
3. **A real object in every section?** Yes:
   - **Hero:** the keyboard.
   - **Rooms:** the Enso, Zen and Iro films, which move with the open row.
   - **Band:** three film cards.

   The first screen has no Hanzo media: it is greys and ten white keys. The colour and films start below the fold.
4. **One ask, nothing floating, scale?**
   - **Ask:** one solid ask throughout (see above).
   - **Floating (phone):** the sticky black display (`.xft-screen`, `top: 64px`, 222px tall) slides over the keyboard while you scroll it. At scroll 700 it covers key rows 1–2 (keys at -13 and 87 under a display ending at 284). It also carries about 90px of empty black under the text, because it reserves the tallest description.
   - **Scale:** has rhythm on desktop: 52, 26, 21, 17 and 12.
5. **Every hover and press answers, with no jumps?** Yes, measured above. The finder's focus is a 1px ink ring on the form, thinner than the 2px rule.
6. **Overlaps, font swap, shift?**
   - **Shift:** none (CLS 0.0004 on desktop, 0.0041 on phone), and no font swap.
   - **Overlap:** only the phone sticky display over the keys (item 4).
   - **Desktop Dev room:** 753px tall in a 741px view under the header. When the room is centred, its caption and progress bar sit on the fold line (caption at 770, bar at about 800).
7. **Reference?** apple.com feature rows: a list beside a product film with a progress bar, where the film changes per feature. The move is there, though subtle: a crop of +0.05 per step.
8. **Different from neighbours?** Yes. A self-playing keyboard instrument as the hero is its own medium and signature.
9. **18 parts.** All 18 have evidence, but one claim is false (see the card check). Part 18 honestly leaves "review 8+" unticked.
10. **Banned tells.** None:
    - 0 hues;
    - no eyebrow above a heading ("Platform Features" sits below the h1);
    - no gradient text, Inter or springs;
    - no fade-on-hover;
    - no 3 equal boxes.

    On the edge: `Features.css` has 54 lines with literal hex or `rgba()` (MASTER part 7 says tokens only).
11. **Copy untouched?** Yes.
    - **Page copy:** all 10 features, the h1, the lede and "Platform Features" are present.
    - **Parity:** `parity.py` misses only shared header and footer units, as the card says.
    - **Links:** /chat?skip=login and /dev are present.

## Card check (docs/coverage/features.md)
- **False:** part 11, "the product rooms stack on phones (a 16:9 film, then rows…)". At 375 and 768 all three films measure `aspect-ratio: 4 / 3` (343×257 and 736×552). The later `@media (max-width: 899px)` block (CSS lines 160–190) overrides the round-4 block (lines 146–158), which set 16:9 for `.xft-film` and `.xft-prod.p1 .xft-film`. It also sets Dev's top padding to 0 (measured `0px 72px`). Per the brief, the verdict is capped at 7.
- **True:**
  - idle phone CLS 0.0027 (measured 0.0027 over 18 s);
  - rows open on click or focus only, with no jump;
  - the display and the top key row are on the first screen at 1470×801;
  - one h1; `data-cta` and `data-thumb` on `features.hero` and `features.close`;
  - the phone header ask swap (outlined during the hero, solid "Open Chat" after);
  - at most 2 films playing (max measured: 1);
  - headings are 44px links; scrollWidth 320 at 320; 0 targets under 44px;
  - JS off shows one feature; reduced motion rests;
  - a blocked network gives 0 console errors on a clean load;
  - `taste.py` passes; the `V2:` line is present; no `data-morph`.
- **Unproven:** part 12, "the display announces only keys the visitor presses". That is true of the display, but each room's `.xft-desc` has `aria-live="polite"` permanently. It therefore announces a new description every 2.6 s while the rows step by themselves, which the card does not mention.

## Fixes (in order)
1. **Make the card's phone film true, and remove the fighting media blocks.**
   - **Merge:** fold `Features.css` lines 160–190 into the block at 146–158 so that one `@media (max-width: 899px)` remains.
   - **Pick one ratio:** `.xft-film, .xft-prod.p1 .xft-film, .xft-prod.p2 .xft-film { aspect-ratio: 16 / 9 }`, or change the card to 4:3. Either way, card and CSS must agree.
   - **Dev padding:** give Dev the same top padding as the other rooms: `.xft-prod.p1 { padding: 44px 0 72px }`.
   - **Dead code:** delete the unused `.xft-row-d` rules (lines 71–74, 120, 129–131 and 187), since no element has that class any more.
2. **Phone: stop the display covering the keys.**
   - **Unstick it:** drop `position: sticky` on `.xft-screen` at ≤899px. A tap already answers in view: the key and the display are both on screen in the first 812px.
   - **If you keep it sticky:** cap it at 140px (feature name plus a 2-line clamp) and give `.xft-board` `padding-top` equal to the display height, so no key ever slides under it.
   - **The empty gap:** on phone, size `.xft-screen-body` to the current feature, not the tallest. Use `.xft-feat:not([aria-hidden="false"]) { position: absolute; inset: 0 }` and keep the active one in flow. To keep CLS at 0, give the body `min-height: 7.5em`.
3. **Phone: give each room its own composition, as desktop does.**
   - **Chat:** keep film then rows.
   - **Dev:** keep the black room, but put the h2 and rows first, with a 16:9 film strip after them. That mirrors desktop, where the rows read over the film.
   - **Design:** put the h2 first, then the two rows as a 2-up swipe rail (`scroll-snap-type: x proximity`, 85% cards, each card a 4:3 film crop with its row title). This uses the pattern MASTER part 8 names.
4. **Desktop Design room: title before object, and one screen tall.**
   - **Title:** put `.xft-prod.p2 .xft-prod-h` above the film (`.xft-prod.p2 .xft-prod-w { order: -2 }` or move the h2 out of `xft-prod-w`). That way the h2, the film and the rows read in order.
   - **Height:** cap the film at `max-height: 52svh` (`aspect-ratio: 21/9` gives 609 now; about 420 fits) so the room fits in 801.
5. **Desktop Dev room fits under the header.** Set `.xft-prod.p1 { padding: clamp(88px, 9vw, 140px) 0 }` (176 now), so that the room is 741px or less and the caption and bar (bottom 800) sit inside the view when it is centred.
6. **Something in the hero moves within 1 s, untouched.** Start the keyboard's first self-press at about 900 ms (a first-run timeout of 900, then 2100). Or let the display's progress hairline run across the 2.1 s gap: a `scaleX` 0→1 on `.xft-screen-top`, paused with the page pause and off under reduced motion.
7. **Room descriptions must not chatter.** Set `aria-live={mine ? 'polite' : 'off'}` on `.xft-desc`, as the display already does.
8. **Housekeeping.**
   - **Tokens:** swap the 54 literal hex and `rgba()` lines in `Features.css` for tokens.
   - **Finder focus:** give it a 2px ring (`.xft-find:focus-within { box-shadow: 0 0 0 2px #0a0a0a }`).
   - **768 label:** at 768 the shared header shows a solid "Try Hanzo" rather than "Open Chat" after the hero, so `usePhoneAsk` stops short of 899. If that is shared, request it in `docs/requests/features.md`.
