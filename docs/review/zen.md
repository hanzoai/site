# /zen: James-eye review (fourth walk)

Reviewed on main at `013a6e3a`; the last /zen change is `6692973c`. Page files: `app/zen/page.jsx`, `components/pages/model/Zen.jsx` and `Zen.css`, and the shared `components/v2/Launch.jsx`. Walked on 7 Nov 2026 against the dev server on :4180, which was not restarted. Only the /zen index page was walked.

How it was walked: Playwright Chromium at 1470×801 and 375×812, plus spot checks at 375×667, 390×700 and 320.
- Arrival frames at 0.3 s, 1 s and 2.5 s.
- A slow walk down the page: a quarter screen at a time, then a 1.8 s dwell per screen, comparing frames to see what moves untouched. I also listed the solid fills in each viewport.
- A 20 s untouched dwell on the dark reasoning room at both widths, then taps on all three tabs and five taps on Next/Replay.
- A PerformanceObserver over the whole walk. The h1 box was sampled every frame for the first 4 s.
- Hover and press on every page control, reading computed styles at rest, on hover and on press.
- A 45-stop Tab crawl.
- Reduced motion and JS off at both widths, with full-page captures.
- Console errors on 13 fresh loads.
- `parity.py /zen` (text 23/23, links 6/6), `taste.py` and `variety.py` all pass.

Verdict: 7/10

First complaint: "I put my mouse on 'Try Hanzo' under Zen 6 Flash and it vanished. And there are eight 'Try Hanzo's on this page. On my phone two of them are black at once, and on the chapters there isn't a solid one at all. Which one am I meant to press?"

**Cap: two coverage claims are false, so the verdict cannot go above 7.**
- Part 8 says "Focus ring visible on every stop of a Tab crawl". It is not. After chapter 1's "Docs on GitHub", the next **6 Tab stops are invisible**: "Try Hanzo", "Open in Workbench" and "Docs on GitHub" in the Zen 6 Flash and Zen 6 chapters, all at opacity 0. Focus lands on chapter panels that are not shown, and the page stays on "Open weights" (`tab-5.png`). MASTER part 12 asks for "0 invisible stops".
- Parts 1 and 4 say there is one solid "Try Hanzo" per screen, and that "the header turns solid only once the page's ask leaves view". This is false on the phone. At 375×812 and 375×667, the header's "Try Hanzo" (#0a0a0a) and the settled headline's "Try Hanzo" (#0a0a0a) are both solid on the first screen (`m-clean-first.png`, `first-375x667.png`). On desktop the opposite happens. On the Zen 6 Flash and Zen 6 chapters and in the reasoning room, the header goes quiet because a *text link* "Try Hanzo" is in view, so **no solid ask is on screen** (`d-s03`, `d-s04`, `d-s05`, `d-chlink-hover.png`).
- Smaller: Part 4 claims `data-thumb` on every primary. `zen.first`, the solid white first-screen ask, has `data-cta` but no `data-thumb`.

Claims that checked out:
- CLS is 0.00048 at 1470 (shared header and the pause disc) and 0.00000 at 375, through the scroll, the 20 s dwell and the taps. The trace held 521px on desktop and 620px on the phone.
- JS off shows every word, and the closing band is unblurred (transform `none`, no filter).
- Reduced motion shows the finished trace, and `getAnimations()` is empty after 3 s.
- The settled headline's links stay out of the tab order until the headline shows.
- No horizontal scroll at 320.
- The model-card pills are 11px.
- The h1 box never moved: 135/459/1200×122 from 0.14 s to 4 s on desktop. On the phone its height held at 57px; only y moved, with the stage settle.

## The 11 answers

1. **Does the first screen sell in 5 seconds, and does something move within 1 second?** Yes on desktop.
   - Zen's sphere film is playing at 0.3 s, "Zen" cuts in by 1 s, and the white "Try Hanzo" sits under the name at 2.5 s (`d-t2500`).
   - On the phone the name lives for only about 1.2 s. The film then closes into the arch, and "Open models. Yours to run." rises with its ask. That second state sells well.
   - At 375×667 the settled arch's foot covers the top of "Open models." by about 18px (`first-375x667.png`; film bottom about 357px, headline top 339px). At 390×700 the two just touch.

2. **One thing in as one goes out, or a document?** On desktop it is one thing in, one out:
   - stage → arch with headline → figures → three pinned chapters with a numbered rail → the dark reasoning room → family tiles → Hanzo's model grid → band.

   Two problems remain:
   - **Repeats.** "Packed ternary, 5.95 GB" appears 7 times: the figure note under "5.95 GB" in the same tile, chapter 1 art, chapter 2 art, chapter 2 pill, a trace tab, a trace step and a trace card pill. "Open weights" appears about 9 times. "Try Hanzo" appears 8 times. Price repeats are down to 3, which is better.
   - **Dead white.** About 350px of empty white sits between the family tiles and "Frontier AI for everything you build." on desktop (`d-family`, `d-grid`).

   On the phone, the trace's reserved 620px shows one step with a large black void and "Next" far below while it runs (`m-clean-04`). It reads as broken, not calm.

3. **Does every section hold a real visual object?** Yes:
   - Zen's own film in the stage, the arch and each chapter.
   - The figure strip.
   - The trace with two live cards, whose rows light as it reads them.
   - The Sigil family tiles.
   - Hanzo's model grid: 9 cards.

4. **One ask in Hanzo's words, in the sticky header, nothing floating? Does scale have rhythm?**
   - Ask: the label is right ("Try Hanzo") and it is in the header, but it appears 8 times on the page, against MASTER part 4's "at most three times". The solid-fill hand-off is wrong both ways (see the cap).
   - Floating: nothing page-owned floats. The shared cookie card covers the first-screen ask's row on desktop and a quarter of the phone screen until it is dismissed. The film pause now rides inside the arch, which is fixed.
   - Scale: much better. 5.95 GB leads at 64px with 27.3B and $2.28 at medium. The chapter art figure is down to 26px under a 44px chapter title. The h1 is 112px, the settled h2 44px, section heads 26px and the band 64px.

5. **Does every hover and press answer, with no jumps?** Mostly yes:
   - First-screen ask: fill to #e5e5e5, press 0.98.
   - Headline ask: #2c2c2e on hover, press 0.98.
   - Pause: border to 60%, press 0.94.
   - Rail: press 0.97.
   - Trace tabs: press 0.96.
   - Next: press 0.97.
   - Trace card links: underline, press 0.97, which is now fixed.
   - Family tile: arrow slide and fill step, press 0.98.
   - Model cards: tilt.
   - Band ask: press 0.98.

   **One real bug:** the chapter links ("Try Hanzo", "Open in Workbench", "Docs on GitHub" under Zen 6 Flash and Zen 6) turn **white on white** on hover. `.ze-l:hover { color: #fff }` was written for the dark room and leaks onto the white chapters, so the hovered word disappears (`d-chlink-hover.png`, computed colour rgb(255,255,255)). "API Platform" has no hover change at all. It does have a 1px press.

6. **Do overlaps, a font swap or layout shift appear?**
   - Font swap: none.
   - CLS: about 0 at both sizes.
   - Overlap: the arch over the h2 at 375×667 (see 1). None at 375×812 or 1470×801 at rest.
   - Console: the intermittent hydration-mismatch error is still there. It fired on 2 of 13 fresh loads (the first walk's fresh load at both widths), and Next's red "1 Issue" badge sat on screen for that whole walk (`d-t2500`, `m-t2500`). The other 11 loads were clean.

7. **Which reference does it feel like, and is its motion there?**
   - apple.com product launch: the pinned stage closes into the arch, then three pinned chapters with a numbered rail.
   - synchronized.studio: the close (×) runs the film back into its card, and the model cards open through the WebGL opener.
   - Idle motion is real. The trace runs itself through all three needs in 20 s untouched, lighting the card row it reads and landing the answer chip on its card.

8. **Is it different from its neighbours?** Just. It shares `v2/Launch` with /kai, /enso, /iro and the rest, so the first two screens read like a sibling. The arch and the reasoning room are its own.

9. **Are all 18 parts covered?** Not as claimed. Parts 1, 4 and 8 have false lines (see the cap), and Part 18's `V2:` line disagrees with itself: `app/zen/page.jsx` says 8/10 and `Zen.jsx` says 6/10.

10. **Any banned tells?** None found:
    - No hues, no gradient text, no blur reveal (the band now uses a line mask).
    - No eyebrow above the h1. The REASONING pill sits below the name, as on the home card.

    The model grid's "FLAGSHIP MODEL" pill above "Enso" is Hanzo's own card per SPEC.

11. **Is the copy untouched?** Nearly:
    - The trace now uses only Hanzo's card rows. Its tab names and the register's "Next" and "Replay" are listed for James on the card.
    - One new composed sentence remains. Chapter 1's body reads "Open weights: download the weights, or call them on Hanzo Cloud." That sentence is not in `content/`: Hanzo's line is "…Download the weights, or call them on Hanzo Cloud." after "The open-weight family behind Hanzo." The pill label has been glued onto the lede, lower-cased.

## Missing from the 18 parts (measured)

- **Part 1, Strategy:** one solid fill per viewport fails, with 2 on the phone's first screen and 0 on desktop chapters 2-3 and the trace room. One composed sentence in chapter 1.
- **Part 3, First impression:** the arch overlaps the h2 at 375×667. Dead white of about 350px before the model grid on desktop.
- **Part 4, Conversion:** "Try Hanzo" appears 8 times (limit 3). `zen.first` lacks `data-thumb`.
- **Part 6, Content:** the same size fact appears 7 times, including twice in one figure tile.
- **Part 8, Components:** chapter links vanish on hover. "API Platform" has no hover change.
- **Part 12, Accessibility:** 6 invisible Tab stops in the pinned chapters.
- **Part 17, States:** the intermittent hydration error and red issue badge (2 of 13 loads).
- **Part 18, Handover:** the two `V2:` lines disagree (8/10 against 6/10). The card's ticks for Parts 1, 4 and 8 are false.

## Fixes

1. **Chapter link hover:** scope `.ze-l:hover { color: #fff }` to the dark room (`.ze-live .ze-l:hover`). On the white chapters, keep ink and the underline. Give "API Platform" a hover change.
2. **Focus in pinned chapters:** make inactive chapter panels `inert` (or `visibility: hidden`) while they are not shown, or move the pinned scroll to the panel whose link takes focus. A Tab crawl must show 0 invisible stops.
3. **One solid ask:**
   - Count only solid page asks (`data-cta`) when deciding to quiet the header, not text links.
   - On the phone, quiet the header while the settled headline's solid ask is on screen.
   - Re-check the first screen, chapters 2-3 and the trace room at both widths.
4. **Fewer "Try Hanzo":** drop "Try Hanzo" from the two chapter bodies and the two trace cards; keep "Open in Workbench" and "Docs on GitHub" there. The primary then appears in the hero, the headline and the band.
5. **375×667:** size or place the phone arch so its foot clears the h2 by at least 16px on short phones (base it on `svh`, or lower the h2).
6. **Repeats:** remove the figure note that repeats its own value ("Packed ternary, 5.95 GB" under "5.95 GB"; "27.3B dense" under "27.3B"), or show the value once. Keep the size on one chapter art card, not both.
7. **Copy:** restore chapter 1's body to Hanzo's own sentence ("Download the weights, or call them on Hanzo Cloud."), or list the composed line as a copy question for James.
8. **Phone trace:** let the reserved height read as designed. Show all three step slots as dim placeholders from the start, and keep "Next" directly under the answer row, so the room never shows a black void.
9. **Desktop gap:** close the empty white of about 350px between the family tiles and the model grid.
10. **Hydration:** find the attribute that differs between server and client on a cold first load. Run a fresh browser right after a dev recompile and read the diff Next prints. The red badge must never show.
11. **Handover:** add `data-thumb` to `zen.first`, make the two `V2:` lines agree, and correct Parts 1, 4 and 8 on the card to what the page does. Then ask for a fresh walk.
