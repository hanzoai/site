# /zen: James-eye review (fifth walk)

Reviewed on the working tree at `c7106d43`; the last /zen change is `cc66ca92` ("zen 4 asks not 8, no invisible tab stops, scoped hover, fewer repeats"). Page files: `app/zen/page.jsx`, `components/pages/model/Zen.jsx` and `Zen.css`, and the shared `components/v2/Launch.jsx`. Walked on 7 Nov 2026 against the dev server on :4180, which was not restarted. Only the /zen index page was walked.

How it was walked: Playwright Chromium at 1470×801 and 375×812, plus 375×667.
- Arrival frames at 0.3 s, 1 s and 2.5 s. The ask states were sampled every frame for the first 7 s.
- A slow walk down the page, a quarter screen at a time, with a 1.8 s untouched dwell on every screen. Frames were compared to see what moves, and the solid fills in each viewport were listed.
- A 20 s untouched dwell on the reasoning room at all three sizes, then taps on all three tabs and five taps on Next/Replay.
- A PerformanceObserver over the whole walk. The h1 box was sampled every frame for 4 s, and font loading events were logged.
- Hover and press on every page control, reading computed styles at rest, on hover and while pressed.
- A 75-stop Tab crawl, then a forward and backward keyboard walk around the settled headline.
- Reduced motion and JS off at both widths, with full-page captures.
- Console errors on 9 fresh loads.
- `parity.py /zen` (text 23/23, links 6/6), `taste.py` and `variety.py` all pass.

Verdict: 7/10

First complaint: "On my phone the reasoning bit lights up rows on cards I can't even see. They're down below, and all I get is a black gap and a 'Next' button. And the opening still feels like Kai's opening with a different ball in it."

**Cap: one coverage claim is false, so the verdict cannot go above 7.**
- Part 12 says "Keyboard reaches every control". It does not on desktop. The settled headline's three links are `zen.hero` "Try Hanzo", `zen.hero-platform` "API Platform" and "Docs on GitHub". They stay `visibility: hidden` until scrolling settles the stage. Tab does not scroll the stage, so focus jumps from the stage's Pause (scrollY 0) straight to chapter 1's "Docs on GitHub" (scrollY 1766). Shift+Tab back goes Docs, then Pause, then Close. Those three links are never reached in either direction. A keyboard user never sees "Open models. Yours to run." settle at all. The phone is fine, because the headline shows by time there.
- Stale rather than false: Part 9 marks sound "n/a: the shared sound kit is not on main". The kit is on main (`f99df11e`) and already covers this page: trace tabs tick, the asks tap and the pause ticks through `components/Sound.jsx`. Only "a self-running demo finishing (a faint chime)" is not wired for the trace. The card's opening note also says the desktop ask bar floats over content. No ask bar floated on desktop in this walk.

Claims that checked out:
- "Try Hanzo" appears 4 times: the header, `zen.first`, `zen.hero` and `zen.band`. `zen.first` has `data-cta` but no `data-thumb`, and the card says so (requested from the shared Launch).
- The Tab crawl has 0 invisible stops. Every stop it reached had a 2px ring, in ink on white and white on the dark room. Hidden chapters keep their links out of the order.
- The chapter link hover leak is gone: "Open in Workbench" on white now underlines in ink. "API Platform" underlines on hover.
- The solid hand-off is right at rest. On desktop chapters 2-3 and in the trace room, the header carries the solid; with the headline or the band in view, the header goes quiet. On phones the header holds the solid and the headline ask is outlined.
- CLS is 0.00048 at 1470 (the shared header and the pause disc) and 0 at 375 and 375×667. That includes the 20 s trace dwell and all the taps (trace CLS 0 at every size). The trace holds 521px on desktop and 620px on the phone.
- The h1 box never moved on desktop (135/459, 1200×122, from first paint to 4 s). On the phone only y moves, with the stage settle; the height holds at 57px. No visible font swap.
- At 375×667 the arch now clears "Open models." by about 18px (arch foot about 321, h2 top 339).
- JS off shows every word with 0 hidden or blurred text at both widths, the finished trace included. Reduced motion shows the settled trace, and `getAnimations()` is empty.
- No horizontal scroll at 375 or 1470.
- Chapter 1 now uses Hanzo's own sentence ("Download the weights, or call them on Hanzo Cloud.").
- The hydration error is not this page's. It fired only when a screenshot was taken the instant `load` fired. Next's diff names the shared `FooterHTML`, which holds the "Ask Hanzo anything" input, so this is the documented `style=""` test artifact. 6 loads with the first screenshot 300 ms after load had 0 console errors and no badge.

## The 11 answers

1. **Does the first screen sell in 5 seconds, and does something move within 1 second?** Yes.
   - Desktop: Zen's sphere film is playing by 0.3 s, and "Zen" cuts in by about 1 s. The white "Try Hanzo" rises at 1.4 to 1.7 s.
   - Phone: the name lives for about a second (the cut-in ends around 2.2 s, and the settle starts at 2.3 s). Then the film closes into the arch and "Open models. Yours to run." rises with its outlined ask. The settled state sells well (`mst-first-clean`).
   - Small flaw: for about 1 s on arrival there are two solid "Try Hanzo"s, the black header and the white first-screen ask. The header only goes quiet at 2.35 s on desktop. On the phone both are solid until the name leaves (about 1.5 to 2.3 s).

2. **One thing in as one goes out, or a document?** On desktop it is a sequence: stage → arch with headline → figures → three pinned chapters on a numbered rail → the dark reasoning room → family tiles → Hanzo's model grid → band. The gap before the model grid is down to about 150px.
   - Repeats are much lower but still there. In visible text, "Packed ternary, 5.95 GB" appears 4 times (the Zen 6 Flash art card, a trace tab, a trace step and a card pill). "Download the weights" appears 3 times (the lede, chapter 1 and trace step 1).
   - The phone reads more like a document in the trace room. The trace reserves 620px, but its two cards sit below it, off screen. While it runs you see 1 to 2 steps, a dashed empty slot, about 130 to 170px of black, then "Next" at y 692 (`mst-trace1`). The signature is "the row lights up on the card", and on a phone you never see the trace and its lit card together.
   - Desktop room: the console is 521px inside an 844px room, so about 162px of plain black sits above and below it. The room is taller than the 801px screen.

3. **Does every section hold a real visual object?** Yes:
   - Zen's film in the stage, the arch and each chapter, with a white model card on it.
   - The 64/26px figure strip.
   - The trace with its two live cards.
   - The Sigil family tiles.
   - Hanzo's model grid: 9 real films.

4. **One ask in Hanzo's words, in the sticky header, nothing floating? Does scale have rhythm?**
   - Ask: "Try Hanzo" appears 4 times, with one solid per screen at rest. The exceptions are the arrival overlap in answer 1, and the band, where the closing ask is solid and the header goes quiet, which is correct.
   - Floating: no page-owned float. The shared cookie card covers the bottom of the arch on desktop. On the phone it covers 203px, including the settled headline's asks (`sst-first7s`). That is shared chrome.
   - Scale has rhythm: h1 112, settled h2 44, figures 64 with 26 beside it, section and chapter heads at 44 and 26, the family hero tile at 64, and the band at 64.

5. **Does every hover and press answer, with no jumps?** Yes, now:
   - First-screen ask: #fafafa → #e5e5e5, press 0.98.
   - Headline ask: #0a0a0a → #2c2c2e, press 0.98.
   - "API Platform", "Docs on GitHub" and the chapter links: underline on hover, press 1px down.
   - Pause: border to 60%, press 0.94.
   - Close: rotates 90°.
   - Rail: ink on hover, press 0.97.
   - Trace tabs: border and colour, press 0.96.
   - Next/Replay: press 0.97.
   - Trace card links: underline, press 0.97.
   - Family tiles: fill step and arrow slide, press 0.98.
   - Model cards: 3° tilt.
   - "Explore model pricing": underline.
   - Band ask: press 0.98.

   No layout jump anywhere.

6. **Do overlaps, a font swap or layout shift appear?**
   - Font swap: none.
   - CLS: about 0 at all sizes.
   - Overlap: none at rest at 1470×801, 375×812 or 375×667. The 375×667 arch overlap is fixed.
   - Console: clean apart from the test artifact above.
   - Desktop only, cosmetic, shared: the header's glass shows a grey smear at its right end over the arch and the chapters (`d-s01b`, `d-s04b`).

7. **Which reference does it feel like, and is its motion there?**
   - apple.com product page: the pinned stage closes into an arch, then the pinned chapters with a numbered rail.
   - synchronized.studio: the close (×) runs the film back into its card, and the model cards open through the WebGL opener.
   - Idle motion is real. The trace runs itself through all three needs in about 20 s untouched, lights the card row it reads and lands the answer chip on its card.
   - Motion mix: arrival, scroll, idle, pointer (tilt) and state. Scroll-linked motion is less than half (`variety.py` OK).

8. **Is it different from its neighbours?** Only partly. The first two screens use the shared `v2/Launch` (film → name → settle into a shape → headline), as /kai, /enso, /iro and the rest do. The arch and the reasoning room are Zen's own, but James's first five seconds look like a sibling's.

9. **Are all 18 parts covered?** Not as claimed. Part 12's "Keyboard reaches every control" is false on desktop (see the cap). Part 9's sound line is stale. Part 18's two `V2:` lines still disagree: `app/zen/page.jsx` says 7/10 and `Zen.jsx` says 6/10.

10. **Any banned tells?** None found:
    - Deck greys only: no hue, no gradient text, no blur reveal.
    - Nothing above the h1. The REASONING pill sits below the name, as on Hanzo's card.
    - The grid's "FLAGSHIP MODEL" pill is Hanzo's own card per SPEC.

11. **Is the copy untouched?** Yes. Parity is text 23/23 and links 6/6, and chapter 1 is Hanzo's own sentence again. The trace's tab names, "Next" and "Replay", and the h1/h2 choice are listed for James on the card. They are questions, not defects.

## Missing from the 18 parts (measured)

- **Part 1 and Part 4:** about 1 s of two solid asks on arrival, at both widths. `zen.first` has no `data-thumb` (requested from Launch).
- **Part 3:** the phone trace shows a black void and hides the cards it lights. The desktop room carries about 162px of empty black above and below the console.
- **Part 6:** "Packed ternary, 5.95 GB" appears 4 times and "Download the weights" 3 times.
- **Part 7:** the first two screens are the shared Launch, not Zen's own.
- **Part 9:** no "demo finished" chime when the trace lands its answer. The card's sound line is stale.
- **Part 12:** the settled headline's three links can't be reached by keyboard on desktop.
- **Part 18:** the two `V2:` lines disagree, and the card's Part 9 and Part 12 lines need correcting.

## Fixes

1. **Keyboard path to the headline (lifts the cap):** when anything inside `.ze-head .lv-acts` takes focus, or when Tab leaves the stage, scroll the stage to its settled point so `data-on` is set. Otherwise keep the links focusable, then scroll and settle on `focusin`. A forward and a backward crawl must both reach "Try Hanzo" (`zen.hero`), "API Platform" and "Docs on GitHub".
2. **Arrival hand-off:** quiet the header's ask the moment `zen.first` starts to rise, not 600 ms after. On the phone, either make `zen.first` outlined while the header is solid, or quiet the header during the name state. There should never be two solids, even for a second.
3. **Phone trace:** put the two cards beside or above the steps in a compact form, for example the two price/size rows as a strip above the steps, so the lit row is on screen with the step that reads it. Also cut the reserved height so "Next" sits about 16px under the answer row, with no black void.
4. **Desktop room:** trim the room's padding so the room (not just the console) fits in 801px, with no 162px black bands.
5. **Repeats:** show "Packed ternary, 5.95 GB" in the trace once, as the pill or the step, not both alongside the tab. Consider dropping trace step 1's "Download the weights…", which already sits in the lede and chapter 1, in favour of the card's "Open weights" row alone.
6. **Own opening:** give Zen's first screen one move the other Launch pages don't have. For example, the arch draws while the film is still full-bleed, or the sphere stays still while the ripples settle into the arch, so the first five seconds are Zen's alone.
7. **Sound:** dispatch `hz-sound` with `chime` when the self-running trace lands its answer (once per run, never while muted). Update Part 9 on the card.
8. **Handover:** make the two `V2:` lines agree, correct Parts 9 and 12 on the card, add `data-thumb` to `zen.first` when Launch allows it, and ask for a fresh walk.
