# /uta: James-eye review (third walk)
Ready: 8 Nov 00:55, copycheck missing 0 of 55 (captured page), Hanzo's images kept (2 of 2: the monitor shows Hanzo's uta-splash.jpg with its alt, word for word, while the roll plays; Uta's still stands in if hanzo.ai can't serve it). "96 BPM · D MINOR" and "CHORUS [BAR 17-32]" read as Hanzo's lines. taste/unique/parity OK (74/74, 4/4); no overlap at 1470 and 375; the only console error is the splash from hanzo.ai, blocked in this sandbox.


Walked on main at `54289c8b` (page last changed in `5f423b08`) against the running dev server, 7 Nov about 16:45 to 17:10 UTC, under MASTER.md and JAMES.md. Playwright Chromium, moving, at 1470×801 and 375×812:
- a slow wheel scroll (an eighth of a screen per tick), dwelling on every screen and comparing two frames 1.5 s apart to catch what moves without input;
- the header ask and every solid fill sampled every 40px of scroll from the top, with and without the cookie card;
- hover and press read from computed styles on every control (asks, film Pause, presets, solo, Pause/Play, Download MIDI, Sound, chapter rail, Band links); the piano roll tapped at both sizes; a model card opened into its page and Back;
- a Tab crawl with an opacity/visibility check up the ancestor chain;
- a PerformanceObserver for layout shift, a 100 ms timeline of the h1 box and `document.fonts`;
- reduced motion, JS off at both sizes, 320×640 and 375×667;
- `node scripts/motion.mjs /uta` (films in `shots/uta/`), `parity.py`, `taste.py`.

Verdict: 7/10

First complaint: "It's much better, and the piano roll is lovely. But as I scroll past the name, the button top right goes 'Try Hanzo', then 'Request access', then 'Try Hanzo' again, and the icons next to it jump each time. For a second there are two black buttons on screen. Pick one and keep it still."

**Cap: false claims on the card (MASTER section 6).** The page alone scores 7, and two lines on `docs/coverage/uta.md` are untrue, so 7 is also the ceiling:
1. Part 8 says "Focus ring visible on every stop of a Tab crawl". At 1470, from the top of the page, the 2nd and 3rd Tab stops in `main` are the settled headline's "Request access" and "Try it in Design". They sit at y=504 inside `.lv-acts` at `opacity: 0`, under the hero film. The ring is drawn but nobody can see it: two invisible stops on the first screen (screenshot `tab-1`).
2. The line above part 1 says "The page shows Hanzo's words only". The studio's "Download MIDI", "Sound off" / "Sound on" and "Play" are in neither `content/live/uta.json`, `content/pages/uta.html` nor `content/ui-strings.json`. Of these labels only "Pause" is in the register. MASTER gate 4 says new UI strings come only from `ui-strings.json`.

Part 1's "one solid fill per screen, measured" is also only nearly true. From y≈560 to y≈740 the header's solid black ask and the headline's solid "Request access" (`uta.hero`) are on screen together. On load, at about 1.0 s, the header shows a solid "Request access" beside the white hero ask.

## Measured
- **Console:** 0 errors on 4 clean loads at each size. A red "1 Issue" badge appeared only on runs that took a screenshot right after `load`. That error was a hydration mismatch on the footer's `__html`, and it does not occur without the early screenshot, so it is the known Playwright artifact and not counted. The Treasury parse error in the log names another page's file.
- **Layout shift:** CLS 0.0012 at 1470 and 0.0000 at 375. Every desktop shift is the shared header's right cluster: at 1.3, 1.4, 1.5, 2.8, 7.6 and 12.5 s it widens or narrows by 37.6px as the ask label changes, and the Sound, EN and Log in controls slide sideways each time.
- **Header ask while scrolling the first 1450px at 1470:**
  1. y 0–100: "Try Hanzo", outlined, beside the solid white `uta.first`.
  2. y 140: "Request access", solid.
  3. y 560–740: still solid, and `uta.hero` is solid too. **Two solid fills.**
  4. y 710–920: "Try Hanzo", solid, then outlined.
  5. y 1350: "Request access", outlined.
  6. y 1430: "Request access", solid.

  That is four changes of label or weight in about one and a half screens (shared header, requested in `docs/requests/`).
- **Fonts:** fonts finished loading by 0.6 s. The h1 box held at 135,459, 1200×122 through the swap. No visible swap.
- **Phone hero:** the hold is real. "Uta", the lede and an outlined "Request access" stay over the full-bleed film until the first scroll. With no input, at 6 s the film eases into the four stems, the name slides under the stage and the hero ask goes `visibility:hidden`. The headline's asks are on the next screen.
- **No horizontal scroll** at 1470, 375 and 320. At 375×667 the first ask sits at y 575–619. At 320×640 it sits at y 568–612.
- **Targets:** none under 44px in `main` at 1470, 375, 320 or 375×667.
- **Reduced motion:** 0 running animations and 0 playing films after 3.5 s, and none after scrolling to the Band. The roll's button reads "Play" and "STREAMING ACTIVE" is hidden.
- **JS off:** 0 hidden text elements at 1470 and 375. Name, lede and ask are on the film, and the Band is legible.
- **Dwell:** every desktop screen changes without input down to the footer. On the phone two screens are still: the studio's spec tail at y≈2030, and the "Where Uta fits" list at y≈4870 (text only, its film is below the fold).
- **motion.mjs:** at 1470, 0 still screens, CLS 0.001, and 137 of 392 scroll frames over 50 ms (headless, relative). Phone: 4 of 338. It flags 14 "dead" hovers (film Pause, the hero asks, rail 01/04). My computed-style probe contradicts most of these:
  - The film Pause scales to 1.08 and lightens.
  - The hero ask goes `#e5e5e5`.
  - Rail 02 inks and slides 4px.

  Its dead "Request access" at y=0 is the invisible headline ask above.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes at both sizes. Uta's film plays from frame 0, "Music generation and composition." is there, and "Uta" (112px, 52px on phone) cuts in by about 1.2 s. The phone now holds the name until you scroll, which fixes the last walk's complaint. The cookie card (shared) covers the phone's lede and ask on a first visit, and it covers "Uta" itself from y=593.
2. **One in, one out?** Yes on desktop: the film settles into four rising stems beside "Compose beyond imagination.", then the studio, then four pinned chapters that change one at a time, then Fits, then Hanzo's model grid once (the duplicate map is gone), then the Band. On the phone it reads more like a stack: chapters are picture then words, and Fits is a text list.
3. **A real object in every section?** Yes. The film, the stems, the live piano roll, four different chapter pictures (the whole fan, a playhead crossing three cuts, the film cut into four stems, a lit D-minor keyboard), the Fits film, the nine model cards and the Band. On the phone the Fits screen is text until its film arrives below.
4. **One ask in the sticky header, nothing floating; scale rhythm?**
   - **Ask:** not yet. The desktop header changes its label and weight four times in the first 1.5 screens, and shows two solid fills for about 180px of scroll. On the phone the solid ask is "Try Hanzo" while the page's own ask is an outlined "Request access", so the hero ask's label is not the header's (MASTER part 4). On the phone the film Pause (a 44px grey disc) sits in the white page beside "MUSIC · UTA 1" after the settle, where it reads as a floating control.
   - **Scale:** passes. 112px name alone, a 44px headline with medium stems, 26px section heads with 44px chapter titles one at a time, 16px body and 12px mono, then a 64px Band head.
5. **Every hover and press answers, no jumps?** Nearly.
   - **Answers:**
     - The asks fill on hover and press to 0.98.
     - Presets brighten and press to 0.96. Solo inks and presses.
     - A roll tap adds a melody note at both sizes, and a second tap removes it.
     - A preset re-voices the roll, and solo dims the other stems (pixel-verified).
     - Download MIDI saves `uta-sketch.mid` (289 bytes, `MThd`).
     - The rail slides 4px. The Band links underline and press.
     - The Koe card tilts and opens through the WebGL opener with Koe's picture full-bleed, and Back returns within about 270px of where I was.
   - **Dead:** "Try it in Design" has no hover change. The header ask's hover is `opacity .88` only, a fade-on-hover (shared header).
   - **Jumps:** the header cluster jumps 37.6px on every label swap.
6. **Overlap, font swap, layout shift?**
   - No font swap.
   - Small CLS, but it is the visible header jump.
   - The cookie card (shared) covers the 4th chapter rail item at 1470, and the phone hero name until dismissed.
   - During the desktop settle the × close sits over the 4th stem for a moment.
7. **Which reference, and is its motion there?**
   - synchronized.studio: yes, the card opens into its page.
   - apple.com: yes, a pinned stage that settles and pinned chapters where one panel changes.
   - motion.dev: the line-mask cut-ins.
   - anthropic.com launch: no benchmark hero, fairly, because Hanzo's copy has none.
8. **Different from its neighbours?** Partly. Its own stem shape, its own studio (the piano roll), and its own chapter pictures. But the room order is still the creative template shared with Iro, Koma, Oto, Koe and Mori: stage, demo, four chapters, Fits, model cards, Band.
9. **All 18 parts covered?** The card fills all 18, but two claims are false (cap above), and parts 1, 4, 8, 9 and 11 have real gaps (below).
10. **Banned tells?**
    - The header ask fades on hover (shared).
    - The chapter-04 keys animate `background` (`Uta.css:92-93`), and MASTER part 8 says animate only transform, opacity and clip-path.
    - Each chapter viewport runs two continuous movers (the film plus the playhead or the keys), and the studio runs the roll, the timecode and the monitor film together. MASTER part 9 says at most one per viewport.
    - No hue, gradient text, Inter, purple-blue, icon box or label above a headline. "MUSIC" and "CAPABILITIES" sit below their headings. `taste.py` passes.
11. **Copy untouched?** Hanzo's copy is untouched: `parity.py` gives text 74/74 and links 4/4, and the studio's labels ("STREAMING ACTIVE", "Abbey Road Master", "TIMELINE FLOW") trace to `content/live/uta.json`. But "Download MIDI", "Sound off/on" and "Play" are our words and are not in the register.

## Missing from the 18 parts
- **Part 1:** two solid fills on screen for about 180px of scroll past the headline, and for about 1 s on load.
- **Part 4:**
  - The header label swaps four times while the first screens pass, and moves its neighbours.
  - On the phone the header's solid ask is "Try Hanzo", not the hero ask's label.
- **Part 6 / gate 4:** three control labels are not in `content/ui-strings.json`.
- **Part 8 / Part 12:** two invisible Tab stops (the settled headline's asks, while `.lv-acts` is at opacity 0 under the film). "Try it in Design" has no hover.
- **Part 9:**
  - Two continuous movers per chapter viewport, and three in the studio.
  - The keys animate `background`.
- **Part 11:** the phone film Pause sits loose in the white page after the settle. Two still screens on the phone (the studio spec tail, and the Fits list).
- **Shared chrome, judged on the page:**
  - The cookie card covers the phone hero name and ask, and the 4th rail item at 1470.
  - The header ask fades on hover.

## Fixes (to reach 8)
1. **Header ask (shared, chase the request):** one label and one width per page, with no swap that moves Sound, EN and Log in (a fixed slot or an in-place crossfade). Make the quiet/solid hand-off happen when the page ask actually enters view, not about 180px late, so only one solid fill is ever on screen. Give it a hover that is not an opacity fade.
2. **Invisible Tab stops:** while `.lv-acts` is hidden under the film, take its two links out of the tab order (`inert` on the hidden headline block until it settles). Alternatively, make focus on them settle the stage. Then re-crawl and correct part 8 of the card.
3. **Control labels:** use register strings for "Download MIDI", "Sound off/on" and "Play", or request them in `content/ui-strings.json` and list them as copy questions for James. Fix the card's "Hanzo's words only" line.
4. **One mover per viewport:** in the chapters, stop the film while the playhead or keys run (or drop the overlay motion and let the film be the mover). In the studio, let the monitor film rest as a poster while the roll plays.
5. **Keys:** animate the chapter-04 keys with opacity on a white layer, not `background`.
6. **"Try it in Design":** give it a hover that tells you something (the arrow moving 4px, or an underline), as the Band links have.
7. **Phone details:**
   - Move the film Pause inside the stems' box (or the stage foot) after the settle, so it does not float on white paper.
   - Bring the Fits film above or beside the list at 375, so that screen has an object.
8. **Neighbours:** give /uta one room-order difference from the other creative pages. For example, put Fits before the chapters, or end the chapters on the roll itself.
9. **Card:** rewrite `docs/coverage/uta.md` so every line is true after these fixes (the line above part 1, and parts 1, 4, 8 and 9).
