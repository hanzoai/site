# /zen: James-eye review (sixth walk)

Ready: 7 Nov 22:45, held up next to /api and /affiliate. Walked the rebuilt page (particle swarm, trace, parts, family): one solid "Try Hanzo" per screen at both widths (desktop hero ask white on the film with the header quiet, ink beside the settled headline, header solid from the swarm on; phone header solid, page asks outlined), the sphere film is no longer the object four screens running, the trace tabs read as words (the chip's flex gap no longer opens between the cascading letters), the chosen tab answers hover, and the phone film Pause rides inside the arch instead of floating on white. Coverage parts 1, 4, 8, 9 and 11 rewritten to the page as it is. taste/unique/parity OK (23/23, 6/6); 0 console errors, no overlap at 1470 and 375; no still screen above the footer.

I reviewed the working tree at `4df4f37b` ("zen keyboard reaches the settled headline, header carries the one solid, trace done sound, tighter room"). Page files: `app/zen/page.jsx`, `components/pages/model/Zen.jsx` and `Zen.css`, and the shared `components/v2/Launch.jsx` (unchanged since the last walk). I walked it on 7 Nov 2026 against the dev server on :4180, which I did not restart. Only the /zen index page was walked.

How I walked it, in Playwright Chromium at 1470×801, 375×812 and 375×667:
- **Arrival.** The h1 box and every opaque button on screen were sampled every 150 ms for the first 4 s.
- **Slow walk.** I went down the page half a screen at a time, with a 2.2 s untouched dwell on every screen. I compared frames to see what moves and listed the solid fills in each viewport.
- **Trace room.** I dwelled on it at 1470 and 375 (six samples, 1.6 s apart), logging which card row is lit and whether it is on screen. Then I tapped all three tabs and pressed Next/Replay five times.
- **Shift and fonts.** A PerformanceObserver ran over the whole walk, and font `loadingdone` events were logged.
- **Hover and press.** I read the computed style at rest, on hover and while pressed for 15 page controls.
- **Keyboard.** A full Tab crawl from the top to the footer at 1470 (34 stops) and 375 (32 stops), waiting 800 ms per stop. Then a Shift+Tab walk back from chapter 1.
- **Reduced motion and JS off** at both widths, with full-page captures and a hidden/blurred-text scan.
- **Console errors** on 7 fresh loads.
- **Scripts.** `parity.py /zen` (text 23/23, links 6/6) and `taste.py` both pass.

Verdict: 7/10

First complaint: "Where's the button? I land on Zen and nothing is solid. The Try Hanzo up top goes white after a second and the one on the film is just an outline. Then it's the same ball four screens in a row."

**Cap: two coverage claims are false, so the verdict cannot go above 7.**
- **Part 4 is false.** It says "The header's 'Try Hanzo' is the one solid fill from arrival to the closing band at both widths."
  - At 1470 the header ask is solid black only until about 1.7 s. Then the shared `Ask.jsx` sets `html[data-ask=quiet]`, because a "Try Hanzo" twin (`zen.first`) is visible, and the header turns white with an outline.
  - `zen.first` is outlined too (transparent, `rgba(250,250,250,.6)` border). So the desktop first screen at rest has **0 solid fills** (`d-w00`).
  - The same happens at scrollY 1203, where the outlined `zen.hero` is still in view and the header has gone quiet again (`d-w03`): 0 solids.
  - The header is solid only with the headline settled at scrollY 881, and from the figures onward.
  - At 375 the claim holds: the header stays solid, because the phone branch of `Ask.jsx` does not run.
- **Part 4 is also stale.** It still says "The settled headline's links stay out of the tab order (`visibility: hidden`) until the headline shows." That CSS was removed, and the links are now in the tab order, which is the right fix.
- **Part 1 is false.** It says the first-screen ask is "solid (white on the film) … while the header ask stays quiet, solid beside the settled headline". Both page asks are now outlined (`kind="quiet"`). Parts 1 and 4 of the card contradict each other.

Claims that checked out:
- **Keyboard (last walk's cap) is fixed.** At 1470 the Tab order is `zen.first` → `zen.hero` → `zen.hero-platform` → "Docs on GitHub". Focus scrolls the stage to its settled point (scrollY 881), so all three links show at y 487 with full opacity (`d-tab1`). Then come Close, Pause, chapter 1, the rail, the trace and the band.
  - Shift+Tab back from Close reaches Docs, then API Platform, then Try Hanzo.
  - The crawl had 0 invisible, faded, covered or under-header stops at both widths. Every page stop had a 2px ring.
  - The footer input shows no outline. That is shared.
- **The room fits one screen.** The desktop dark room is now 665px, with the console 521px inside it. The 162px black bands are gone.
- **Sound.** `play('done')` fires once when the trace lands its answer (`Zen.jsx:64`).
- **The two `V2:` lines agree** at 7/10.
- **CLS** is 0.00048 at 1470 (the shared header at 1.3 s and the pause disc) and 0 at 375×812 and 375×667. That includes the trace dwell and all the taps.
- **Fonts and the h1.** Fonts finished loading at 740 ms (desktop) and 1.4 s (phone). The h1 box never changed size: 135,459 at 1200×122 from the first sample to 4 s on desktop. On the phone only y moves, with the time settle, and the height holds at 57.
- **JS off:** 0 hidden or blurred text at both widths, h1 "Zen". **Reduced motion:** 0 running animations after 3 s and 0 hidden text.
- **No horizontal scroll** at 375 or 1470. Console: 0 errors on all loads.
- **Repeats:** "Download the weights" is down to 2 (the lede and chapter 1).

## The 11 answers

1. **Does the first screen sell in 5 seconds, and does something move within 1 second?** It moves, but it does not fully sell.
   - Zen's sphere film is playing at first paint, and "Zen" cuts in within about 1 s at both widths.
   - On desktop, the ask on screen after 1.7 s is a thin outline on a dark film. The header's ask has also gone white, so nothing on the first screen says "press me" (`d-w00`).
   - On the phone it sells better: the header is solid, and the arch with "Open models. Yours to run." settles by about 2.6 s. The shared cookie card covers about 218px of it on first visit.

2. **One thing in as one goes out, or a document?** On desktop it is a sequence: stage → arch and headline → figure strip → three pinned chapters on a numbered rail → the dark trace room (one screen now) → family tiles → Hanzo's model grid → band.
   - **Weak spot: repetition.** Zen's sphere film is the object on four consecutive screens: the stage, then chapters 1, 2 and 3 at zoom 1.1, 1.35 and 1.7. Chapter 3's film was still for a full 2.2 s dwell (`d-w08`).
   - **"Packed ternary, 5.95 GB"** still shows in 4 places: chapter 2's card, a trace tab, trace step 3, and the card pill.
   - **Trace step 01 reads "Open weights"**, the same words as the selected tab directly above it. That step reasons nothing.
   - **Phone:** the trace is better, because no step slot sits empty for long and "Next" sits right under the answer. But the room is still 1436px tall, with the cards 590px below the trace's top. For steps 1 and 3 the lit card row is off screen (measured at y 919 and 1263 on an 812 screen). Only step 2's row peeks in at the bottom edge (`p-trace1`).

3. **Does every section hold a real visual object?** Yes:
   - the film in the stage, the arch and each chapter;
   - the 64/26 figure strip;
   - the trace with its two live cards;
   - the Sigil family tiles;
   - Hanzo's grid of 9 real films.

4. **One ask in Hanzo's words, in the sticky header, nothing floating? Does scale have rhythm?**
   - **Ask.** "Try Hanzo" appears 4 times. The desktop first screen and the screen just past the headline have 0 solid fills (see the cap). On the phone there is one solid on every screen, plus the band's.
   - **Floating.** Nothing floats that the page owns. The shared cookie card sits over the stage foot and the arch, and on the phone over the headline's asks.
   - **Scale has rhythm:** h1 112 → h2 44 → figures 64 with 26 beside them → chapter heads 44 → family hero tile 64 → band 64. Big, medium and small alternate.

5. **Does every hover and press answer, with no jumps?** Yes. These were measured:
   - `zen.first`: fill to white 12%, press 0.98.
   - `zen.hero`: border 8% to 18%, press 0.98.
   - "API Platform" and "Docs on GitHub": underline, press 1px down.
   - Pause: border 24% to 60%, press 0.94.
   - Close: rotates 90°.
   - Rail: press 0.97.
   - Trace tabs: #d4d4d4 to white with a border step, press 0.96.
   - Next: press 0.97.
   - Card links: underline, press 0.97.
   - Family tile: #000 to #0a0a0a, press 0.98.
   - Model card: 3D tilt.
   - Band ask: #f5f5f7 to #fff, press 0.98.

   No box moved on hover. Two of these are weak: the `zen.hero` hover is only a border tint, and the family tile's step from #000 to #0a0a0a is almost invisible.

6. **Do overlaps, a font swap or layout shift appear?**
   - Font swap: none.
   - CLS: below 0.0005 everywhere.
   - Overlap: none from the page at 1470×801, 375×812 or 375×667.
   - Shared, cosmetic: the header glass shows a grey smear at its ends over the film and the family tiles (`d-w03`, `d-w12`).

7. **Which reference does it feel like, and is its motion there?** It feels like an apple.com product page:
   - the pinned stage closes into an arch;
   - pinned chapters run on a numbered rail;
   - a self-running demo plays in a dark room.

   synchronized.studio shows in the close (×) running the film back into its card, and in the WebGL opener on the model cards. The motion mix is arrival, scroll, idle (the trace runs itself), pointer (tilt) and state (tabs), so it is not scroll-only.

8. **Is it different from its neighbours?** Only partly. The first two screens are the shared `v2/Launch` (film, name, settle into a shape, headline), as on /kai, /enso, /iro and the rest. Only the arch outline is Zen's. The trace room is Zen's own, but it arrives on screen 5 to 6.

9. **Are all 18 parts covered?** Not as claimed. Part 4 is false and stale, and Part 1 is false (see the cap). Part 18 now agrees with itself.

10. **Any banned tells?** None found:
    - deck greys only;
    - no gradient text and no blur reveal;
    - nothing above the h1 (the REASONING pill sits below the name, as on Hanzo's card);
    - no Inter.

11. **Is the copy untouched?** Yes. Parity is text 23/23 and links 6/6. The h1/h2 choice, the trace's tab names and "Next"/"Replay" are listed on the card as questions for James. They are not defects.

## Missing from the 18 parts (measured)

- **Part 1 and Part 4:**
  - At 1470, no solid primary on the first screen, and none at scrollY around 1200.
  - The card describes asks that do not exist.
  - `zen.first` has no `data-thumb`. That is the shared Launch's doing.
- **Part 3:** the same sphere film is the object for 4 screens in a row. On the phone the trace still lights card rows that are off screen.
- **Part 6:** "Packed ternary, 5.95 GB" appears 4 times. Trace step 01 repeats its own tab's words.
- **Part 7 and Part 8 (variation):** the opening two screens are the shared Launch, not Zen's own.
- **Part 11:** on phone first visit the shared cookie card (about 218px) covers the settled headline's asks. That is shared.

## Fixes

1. **One solid on the desktop first screen (lifts the cap together with fix 2).** Pick one of these:
   - (a) Make `zen.first` solid white on the film and leave the header quiet. That is the old behaviour, and the header then goes solid when `zen.first` leaves.
   - (b) Keep the page asks outlined and ask the `Ask.jsx` owner (`docs/requests/zen-names.md`) to quiet the header only when the visible twin is solid.

   Then check frames at 0.5, 2, 5 s and at scrollY 0, 881 and 1203. Each must show exactly one solid "Try Hanzo".
2. **Correct the card.** Part 1 must describe the asks as they are now. Part 4 must say which one is solid on each screen at each width, and drop the stale `visibility: hidden` sentence.
3. **Break the sphere repeat.** Give each chapter a different picture from what the page has: Hanzo's own model-card art, the open-weights card list on a quiet room instead of the film, or the film's poster as a still crop. The sphere then lives on the stage and the arch only. At least keep one chapter's film playing, so no pinned screen sits still.
4. **Phone trace.** Put a compact strip of the two cards' rows above the steps, so the lit row is on screen with the step reading it. Or pin the cards and scroll the steps. Cut the room from 1436px toward one screen.
5. **Trace words.** Step 01 should read a fact the tab does not already say, for example the card's "Open weights" pill lighting with the description as the step. Show "Packed ternary, 5.95 GB" in the trace once, not as tab, step and pill together.
6. **Own opening.** Give Zen's first five seconds one move no other Launch page has. For example, the ripples draw the arch outline before the clip closes, or the sphere holds still while the frame closes around it.
7. **Small hovers.** Make the `zen.hero` hover tell more than a border tint (fill to #f5f5f5), and make the family tile's hover visible (the Sigil drifts or brightens, not #000 to #0a0a0a).
8. **Handover.** Ask for a fresh walk once fixes 1 and 2 are in.
