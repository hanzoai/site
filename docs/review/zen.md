# /zen: James-eye review (third walk)

Reviewed on main at `f244a55c`, page files `app/zen/page.jsx`, `components/pages/model/Zen.jsx` and `Zen.css`, and the shared `components/v2/Launch.jsx`. Walked on 7 Nov 2026 against the dev server on :4180, which was not restarted. Only the /zen index page was walked.

How it was walked: Playwright Chromium, moving through the page at 1470×801 and at 375×812. At each screen I made a wheel scroll in four quarter-screen steps and then dwelt for 1.5 s, comparing frames to see what moves without input. I took arrival frames at 0.3 s, 1 s and 2.5 s. I hovered and pressed every page control and read its computed style at rest, on hover and on press. A PerformanceObserver measured CLS through the scroll, through a 25 s untouched dwell on the reasoning trace at 375, and through taps on the trace tabs and "Next step". I also checked the h1 box across font load, ran a Tab crawl, loaded the page with reduced motion (both widths) and with JS off (both widths), and recorded console errors. `taste.py` and `variety.py` pass, and `parity.py /zen` reports text 23/23 and links 6/6. I did not run `scripts/motion.mjs` because it is hard-wired to the macOS Chrome path, so I used my own walk.

Verdict: 6/10

First complaint: "You told me the phone jumping was fixed. It isn't: every time that little reasoning box adds a line, everything under it jumps. And it tells me the same two prices five times on one page."

**Cap: a coverage claim is false, so the verdict cannot go above 7.** Part 13 of `docs/coverage/zen.md` says the trace "now reserves its tallest state (620px): re-measured 0.000 at 375 on a slow walk". What I measured at 375:
- A slow scroll scored **0.025**.
- A 25 s untouched dwell on the trace scored **0.071**.
- With tab and step taps added, the total reached **0.134**. That count leaves out the 500 ms after each tap.

Every shift comes from `li.ze-wait` (0.008 to 0.012 each) and `button.ze-step` (about 0.002 each). `.ze-steps` holds its 300px minimum, but the dashed "··" wait row and the `margin-top:auto` step button still move inside the trace on every step. Desktop measured 0.0034 from the same `ze-wait`, against a claimed 0.000.

There is a second false claim. Parts 3 and 17 say "JS off: legible" and "JS off shows every word". With JS off, the closing Band headline "Open models. Yours to run." renders at `filter: blur(12px)` on every word (`nojs-band`).

## The 11 answers

1. **Does the first screen sell in 5 seconds, and does something move within 1 second?** Movement, yes: Zen's sphere film plays at 0.3 s and "Zen" cuts in by about 1 s. Selling, only partly. The first screen sells the home model card ("Zen / Deep reasoning for complex problems. / REASONING"), not this page's own hero. Live /zen's h1 is "Open models. Yours to run.", and here it is an h2 that only arrives after the stage settles. There is also no solid fill on the first screen at rest. At 2.5 s both the header "Try Hanzo" and the hero "Try Hanzo" are outlined (`d-t2500`). The header ask is solid at 0.3 s and 1 s, then turns quiet.

2. **One thing in as one goes out, or a document?** Mostly one thing in, one out on desktop: stage, arch, figures, three pinned chapters, the trace room, the family tiles, the model grid, then the Band. But the same facts come round again and again:
   - $2.28 / $7.26 appears in the figure strip, in each chapter body, in each chapter's art card, in both trace cards and in a trace step.
   - "Packed ternary, 5.95 GB" appears in the figures, in chapter 1's overlay, in chapter 2's art card, in its pills, in the trace card and in a trace step.

   On the phone this reads as the overload James named. Desktop also has a dead band of about 400px of empty white after the arch (`d-s02`), with the grey film-pause disc floating alone on the white.

3. **Does every section hold a real visual object?** Yes:
   - Zen's own film (stage, arch, chapter art).
   - The figures.
   - The trace with its two live cards.
   - The Sigil family tiles.
   - Hanzo's model-card grid of 9 films.

4. **One ask in Hanzo's words, in the sticky header, nothing floating? Does scale have rhythm?**
   - Ask: "Try Hanzo" is the only ask and is in the header. But the header's solid fill switches off whenever a page "Try Hanzo" is on screen, and the page's own asks are quiet. Several viewports therefore have no solid fill at all (`d-t2500`, `d-s01`, `d-s04`, `d-s05`).
   - Nothing page-owned floats. The cookie card (shared) covers the foot of the arch on desktop and the trace's answer on the phone.
   - Scale: improved since the last walk. 5.95 GB now leads at 64px, with 27.3B and $2.28 at medium on both widths.
   - It is still in your face in the chapters. The art card sets "Packed ternary, 5.95 GB" at about 44px beside a 40px chapter title, so two big things share one screen. At 375 that phrase stacks into three lines of about 40px type.

5. **Does every hover and press answer, with no jumps?** Mostly yes:
   - First-screen ask: fill 12% and border to full on hover, press 0.98.
   - Pause: border brightens on hover, press 0.95.
   - Close (×): rotates 90° on hover and fill steps up.
   - Trace tabs: colour and border change on hover, press 0.97.
   - "Next step": colour and border change on hover, press 0.98.
   - Family tile: the arrow slides 5px and the background steps, press 0.98.
   - Model cards: tilt about 1.8°.

   Two weak spots:
   - The trace card links (`.ze-l`) answer with an underline only and have **no press state** (transform `none`).
   - The settled headline's "Try Hanzo", "API Platform" and "Docs on GitHub" are in the tab order while still invisible at the top of the page: the Tab crawl reaches them straight after the first-screen ask.

   Jumps: the trace makes everything below it jump on the phone (see the cap).

6. **Do overlaps, a font swap or layout shift appear?**
   - Font swap: none. The h1 box held at 459/122/1200px from 0.4 s to 3.5 s on desktop, and at 57px tall on the phone.
   - Overlap: no page-owned overlap at rest.
   - Layout shift: yes on the phone, 0.025 to 0.134 depending on the walk (see the cap).
   - Console: a hydration-mismatch error ("A tree hydrated but some attributes of the server rendered HTML didn't match…") fired on the first fresh load at both widths. Next's red "1 Issue" badge sat on screen for the whole walk. It did not recur on the four later fresh loads, so it is intermittent.

7. **Which reference does it feel like, and is its motion there?** apple.com product launch: yes, with the pinned stage closing into the arch and three pinned chapters with wipes and a numbered rail. synchronized.studio: yes for the close (× runs the film back into its card) and for the model cards opening through the WebGL opener.

8. **Is it different from its neighbours?** It shares the `v2/Launch` frame with /kai, /enso, /iro and the other model pages. The arch shape and the reasoning trace are its own, so it passes, but only just: the first two screens of every Launch page read alike.

9. **Are all 18 parts covered?** The card shows 18 of 18, but two claims are false (Part 13 CLS, and the JS-off claim in Parts 3 and 17), and Part 1's line "The page shows Hanzo's words only" is also false (see 11).

10. **Any banned tells?** Yes, two, and both are in the closing Band (shared `Band` → `Words` in `components/ui.jsx`):
    - An opacity-and-blur word reveal (MASTER part 9: "No opacity-and-blur reveal").
    - A 12px blur, against the 4px maximum (part 8).

    With JS off, that blur stays on screen. There are no hues, no gradient text and no eyebrow above the h1. The REASONING pill sits below the name, as the home card has it.

11. **Is the copy untouched?** No. Parity reports 0 missing, but the trace adds words Hanzo never wrote. None of these exist in `content/live/zen.json`, `content/pages` or `content/ui-strings.json`:
    - The tab labels "Runs on my machine", "Reads video" and "Lowest price".
    - "What you need", "Reasoning", "Answer" and "Next step".
    - The sentences "Its weights: Packed ternary, 5.95 GB.", "Zen 6 Flash reads Text and images.", "Zen 6 reads Text, images and video." and "The same price: either one."

    The "Lowest price" run even ends on a non-answer. The first screen also uses home's card copy ("Deep reasoning for complex problems.") and demotes the live h1. That is a hero change, and it should be listed as a copy question for James rather than decided here.

## Missing from the 18 parts (measured)

- **Part 1, Strategy:** the trace's new strings break "copy frozen" and "new UI strings only from `content/ui-strings.json`". The live h1 is demoted without a copy question on the card.
- **Part 3, First impression:** with JS off, the Band headline is blurred. The first screen leads with the home card copy, not the page's hero.
- **Part 4, Conversion:** viewports with no solid fill (the header goes quiet while the page's asks are quiet).
- **Part 6, Content:** the same price and size facts repeat 5 or 6 times, which is clutter.
- **Part 9, Motion:** the Band's blur-and-opacity word reveal is banned, and its blur is 12px against a 4px maximum.
- **Part 12, Accessibility:** the settled headline links are focusable while invisible. The trace card links have no press state.
- **Part 13, Performance:** CLS at 375 is 0.025 to 0.134, against the 0.02 target and the claimed 0.000.
- **Part 17, States:** the JS-off claim is false (the Band is blurred). A hydration error showed the red issue badge on the first load.
- **Part 18, Handover:** the `V2: 8/10` line in `app/zen/page.jsx` is not supported by this walk.

## Fixes

1. **Trace (phone and desktop):** stop the trace moving anything.
   - Render all of a need's step slots from the start at a fixed height, and fill them in by opacity or clip.
   - Drop the in-flow `ze-wait` row, or overlay it absolutely.
   - Pin `.ze-step` to a fixed position instead of `margin-top:auto`.
   - Re-measure at 375 with a 25 s untouched dwell plus taps, and correct the Part 13 line with the real number.
2. **Trace copy:** use only Hanzo's own strings. Show the card rows themselves lighting up, using only Hanzo's words (desc, size, mods, price), and drop the composed sentences, the invented tab labels and "The same price: either one". If the tabs or labels must stay, request them into `content/ui-strings.json` and list them as copy questions for James.
3. **Band (shared, via `docs/requests/`):** replace the `Words` blur reveal with the line-mask cut-in, with no blur. Make the JS-off and server state the final state (no inline `filter`/`opacity` without `html.js`). Until the shared fix lands, close this page with a page-local band that uses `Lines`.
4. **Repetition:** say each fact once where it is the moment.
   - Keep the figures strip and the trace cards.
   - Cut the price and spec repeats from the chapter art overlays, or from the chapter bodies.
   - Bring the art-card "Packed ternary, 5.95 GB" down from about 44px to medium, so the chapter title is the one big thing.
5. **Solid ask:** make sure one solid "Try Hanzo" is visible in every viewport. Either keep the header ask solid, or make the hero and settled asks solid while the header goes quiet; do not leave both quiet. Re-check `d-t2500`.
6. **Hero:** list "h1 = Zen with the home card line, live h1 demoted to h2" as a copy question on the card, or make "Open models. Yours to run." the h1 again.
7. **Desktop gap:** close the empty white band (about 400px) between the settled arch and the figures. Unpin the pause disc together with the stage so it never floats alone on white.
8. **Focus:** take the settled headline's links out of the tab order (`inert`) until `data-on` is set. Give the trace card `.ze-l` links a press state (scale 0.97).
9. **Hydration:** find the attribute mismatch behind the intermittent hydration error (on the first fresh load at both widths) and fix it. The red issue badge must never show.
10. **Coverage card:** correct Parts 1, 3, 13 and 17 to what the page actually does, then ask for a fresh walk.
