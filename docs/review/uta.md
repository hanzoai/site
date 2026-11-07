# /uta: James-eye review

Walked on main at `32406a2c` against the dev server, 7 Nov 16:05 to 16:36 UTC, under MASTER.md and JAMES.md. I walked it moving at 1470×801 and 375×812 in Playwright Chromium:
- a slow wheel scroll of half a screen per step, dwelling 2.2 s on each screen and comparing two frames to catch anything that moves without input;
- a header-ask timeline every 100 ms from navigation;
- hover and press on the asks, presets, solo, roll tap, Download MIDI, Pause, the map tabs and cards;
- a card opened into its page and Back;
- a PerformanceObserver for layout shift and `document.fonts` for the swap;
- reduced motion, JS off, 375×667 and 320.

I also ran `node scripts/motion.mjs /uta` (films in `shots/uta/`), `parity.py`, `taste.py` and `variety.py`.

Verdict: 6/10

First complaint: "On my phone the name's gone before I've read it, and the top bar keeps flicking between 'Try Hanzo' and 'Request access' and shoving the icons about. And why am I looking at the same six black cards twice?"

**Cap: false claims on the card (MASTER section 6).** `docs/coverage/uta.md` claims four things the page does not do, so the verdict is capped at 7 whatever the page scores. The page scores 6 on its own (see fixes).
1. Part 4 says "on phones the shared bar carries 'Request access' after the hero". At 375×812, with cookies rejected, no fixed bar shows at y=1500, 3000, 6000 or 8000. The phone header carries "Try Hanzo", so "Request access" never appears again on the phone until the closing Band.
2. Parts 1 and 4 say there is "one solid fill per viewport" and that "the header carries the one solid 'Try Hanzo'". At 1470 the header ask turns outlined (`rgba(10,10,10,0)`) whenever the page's outlined ask is on screen. The first screen and the headline screen therefore have **no** solid fill: the hero ask is a white outline on the film, and `uta.hero` is a white button on white paper.
3. Part 11 says "every target 44px or more". On the phone the Band's "Every model" and "Research preview" are 106×25 and 136×25. The desktop chapter rail buttons are 30px tall.
4. Part 9 says "no `setInterval`" and "0 fade-ups". `Creative.jsx:127` tours the studio map with `setInterval(…, 3200)`. The map card captions swap by opacity plus y. The Band headline reveals by `opacity:0; filter:blur(12px); translateY` (the kit `ui.jsx:52`), and MASTER part 9 says "No opacity-and-blur reveal". `variety.py` passes only because it does not see these.

## Measured
- **Console:** 0 errors and 0 warnings on every load. Once, at 375×667, the Next dev badge showed "1 Issue". I could not reproduce it in 6 more loads, so I am not counting it.
- **Layout shift:** CLS 0.0015 at 1470 and 0.000 at 375. Every desktop shift comes from the header's right cluster at 1434, 1536, 1650, 2864, 6369, 10029 and 15832 ms, because the ask label changes width. The sound, EN and Log in controls move about 37px sideways each time. That is a jump you can see.
- **Header ask timeline at 1470:** "Try Hanzo" (solid) for 0–500 ms, then "Request access" (solid) for 600–1700 ms, then "Try Hanzo" fading to outline at 1800–1900 ms. It changes twice in the first 2 seconds with no input, then again every time the page's ask enters or leaves view.
- **Fonts:** Zen and Zen Mono finished loading at 857 ms. The h1 box held at 135,459, 1200×122 through the swap, so I saw no visible swap.
- **Phone hero:** "Uta" cuts in at about 1.2 s. At **2.36 s** the stage collapses into the four stems by itself. The h1 slides under `lv-pin` and stays covered, and the first ask turns `visibility:hidden`. The name gets about 1 s on screen and never comes back on the phone.
- **No horizontal scroll:** scrollWidth equals innerWidth at 1470, 375 and 320.
- **Reduced motion:** no running animations after 3.5 s and 0 films playing. The roll freezes on a full frame, but its button still reads "Pause" and the status still reads "STREAMING ACTIVE".
- **JS off:** every heading and paragraph is visible, and the header ask is solid "Try Hanzo".
- **motion.mjs at 1470:** 12 dead hovers (the film Pause, both "Request access" asks on screen 1, and the chapter rail 01–04) and 1 still screen (y=7200). At 375: 5 dead taps, all solo or preset taps landing mid-scroll.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Desktop: yes. Uta's own film plays from frame 0, "Music generation and composition." arrives, and "Uta" cuts in at about 1.3 s at 112px. Phone: the film moves at once, but at 2.36 s the name and ask are taken away with no input. That breaks "sell in 5 seconds" on the phone.
2. **One in, one out?** Mostly. On desktop the stage settles into four rising stems beside "Compose beyond imagination.", then the piano roll, then four pinned chapters that change one at a time. After that it turns into a document: Fits (a list), "Find your field" (six black creative cards) and then Hanzo's model grid with the same six creative models again. That is two grids of the same black cards back to back, about 4 screens of them on the phone.
3. **A real object in every section?** Yes: the film, the stems, the live piano roll (the best thing on the page), the chapter films, the Fits film, the cards and the Band. But the four chapter pictures are one film at four zooms, so the "one panel changes" moment reads as the same picture four times.
4. **One ask in the sticky header, nothing floating; scale rhythm?**
   - **Ask:** fails. The header label flips between two words and two weights, and on desktop no solid fill shows while the page's own ask is visible. Hero and header use different words on the phone. The cookie card covers the 4th chapter rail item at 1470 and the headline at 375 until it is dismissed (shared chrome).
   - **Scale:** passes. 112px name alone on its screen, then a 44px headline beside medium stems, then 44px chapter titles one at a time with 16px body and 12px mono, and an 88px Band close.
5. **Every hover and press answers, no jumps?**
   - **Answers:** the hero ask fills on hover and presses to 0.98; presets press to 0.966 and solo goes light; a tap on the roll adds a melody note (verified); Download MIDI saves `uta-sketch.mid`; the map cards tilt and play their film; and a card opened into /koe with Back returning to the same scroll.
   - **Dead:** the chapter rail and the film Pause have no hover. The header ask's hover is opacity 0.88 only, which is the banned "button that fades on hover" (shared header).
   - **Jumps:** the header cluster jumps on every label swap.
6. **Overlap, font swap, layout shift?** No font swap. Layout shift is small, but it is the visible header jump above. The × close overlaps the 4th stem during the desktop settle (s00). The cookie card covers content on both sizes (shared).
7. **Which reference, and is its motion there?**
   - **synchronized.studio:** present. The card opens into its page with Koe's picture going full-bleed, and the × on the hero.
   - **apple.com pinned chapters:** present on desktop.
   - **motion.dev:** the gliding tab pill is there.
   - **Missing:** the anthropic.com launch story has no benchmark-as-hero figure (the page has none in Hanzo's copy, which is fair).
8. **Different from its neighbours?** Partly. Its own film, stem shape and piano roll are distinct. But the room order is the same creative template as Iro, Koma, Oto, Koe and Mori: stage, demo, four chapters, fits, map, model cards, Band. So is the same 40px glyph tile on every chapter.
9. **All 18 parts covered?** The card has 18 `Done here:` lines, but four of its claims are false (cap above), and parts 1, 4, 6, 7, 9 and 11 have real gaps (below).
10. **Banned tells?**
    - The chapter "glyph" (`Creative.css:58`, `.cr-g`) is a 40px tile, radius 12, white at 14%, with an animated mark. It is an icon in a rounded box, on every chapter picture, and it is a second continuous mover beside the playing film.
    - The Band headline uses an opacity-and-blur reveal.
    - The header ask fades on hover.
    - No hue, gradient text, Inter, purple-blue or eyebrow above a headline. `taste.py` passes.
11. **Copy untouched?** `parity.py` gives text 74/74 and links 4/4. But the map adds words Hanzo never wrote:
    - The heading "Find your field" appears nowhere in `content/` or `content/ui-strings.json`.
    - The tab labels "Film", "Games" and "Design and space" are shortened from or invented beside Hanzo's own field names ("Film and trailer scoring", "Game music"). "Advertising" and "Publishing" are Hanzo's own.

## Missing from the 18 parts
- **Part 1:** no solid fill on the desktop first screen or the headline screen.
- **Part 3:** the phone hero holds the h1 for about 1 s, then removes it with no input. Rooms 5 and 6 are not "one idea per 100svh": two grids of the same six models sit back to back.
- **Part 4:** there is no phone ask bar after the hero, the header label changes twice during load, and the hero ask and the header ask differ in label on the phone.
- **Part 6:** an invented heading and tab labels. The Band links are mismatched: "Research preview" is 20.6px/400 beside "Every model" at 15px/500.
- **Part 7:** an icon in a rounded box on every chapter picture.
- **Part 8 and Part 11:** the chapter rail has no hover state and is 30px tall. The phone Band links are 25px tall.
- **Part 9:**
  - `setInterval` drives the map tour.
  - The map captions fade up.
  - The Band uses an opacity-and-blur reveal.
  - Two continuous movers share each chapter viewport (the film and the glyph).
  - Under reduced motion the roll still reads "Pause" and "STREAMING ACTIVE".

## Fixes (to reach 8)
1. **Phone hero:** do not collapse the stage on a timer. Hold the name, lede and "Request access" until the visitor scrolls (or for at least 5 s), and let the settle follow the scroll, as on desktop.
2. **Header ask:** keep one label and one width in the header, and stop the swap from moving the sound, EN and Log in controls (fixed-width slot, or a crossfade inside a reserved box). Request it in `docs/requests/` if it lives in the shared header. Make sure one solid fill shows on every viewport: either the page's first and headline asks go solid while the header goes quiet, or the header stays solid.
3. **Phone ask bar:** either make the shared bar carry "Request access" after the hero at 375, or delete the claim from the card.
4. **Repeated cards:** drop one of the two back-to-back grids of the same six creative models, or make the map a different object (for example a list with one film) so the page does not show the same cards twice.
5. **Glyph tile:** remove the 40px rounded glyph from the chapter pictures (`Creative.css:13,58`). The film is the object, and the tile is an icon in a box and a second mover.
6. **Chapter pictures:** make each one show something different (a different moment or crop of the film tied to the chapter, or the roll's stem for "Multitrack stem separation"), not one picture at four zooms.
7. **Map copy:** replace "Find your field" and the invented tab labels with Hanzo's own words (the fits' own kinds), or list them as copy questions for James and use the live labels.
8. **Map tour:** replace the `setInterval` with the page's `useLoop` or a `Demo` timer, and swap the captions without a fade-up. Request a reveal for the Band headline that is not blur (shared `ui.jsx`).
9. **Targets and hovers:** give the chapter rail a hover that changes more than opacity, and raise it to 44px. Make the Band's "Every model" and "Research preview" 44px tall and the same size and weight.
10. **Reduced motion:** the roll's button should read "Play" and the status should not claim "STREAMING ACTIVE" when frozen.
11. **Card:** rewrite `docs/coverage/uta.md` so every line is true after the fixes (parts 1, 4, 9 and 11 especially).
