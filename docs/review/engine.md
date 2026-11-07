# /engine — James-eye review

Ready: 8 Nov, held up next to /api and /agents (no score). The terminal now streams Hanzo's own sentence token by token above the fold, chapters vary (02 and 05 panel left, 04's quant grid takes eight columns and grows then settles), one panel fully leaves before the next arrives, phone silicon cards stack and the grid fits, chapter numbers preview their title on hover, and the close types the command you wrote. taste/unique/parity OK (text 29/29, links 2/2); 0 console errors, no overflow/overlap at 1470x801 and 375x812. Shared, not this page: the phone header ask lives in components/Ask.jsx (the phone thumb bar carries View on GitHub).
7 Nov, critic pass on `claude/modest-rosalind-d8d1e2` (dev server :4182). Walked moving at 1470x801 and 375x812 (phone: isMobile, hasTouch) with Playwright: frames at 0, 1 and 3 s with no input, wheel scrolls one screen at a time with a 1.5 s dwell, a finer 400 px walk through the pinned chapters, hover and press on every control in `main` on desktop, tap-size audit on phone. I measured CLS, horizontal overflow, fixed elements and console output.

Verdict: 7/10

First complaint: "The chapters are nice, the little squares going from 8 to 2 is the one bit I'd stop on. But it's six of the same box with text on the left. And the terminal at the top is just grey blobs, it's not saying anything. On my phone the CUDA card breaks the words in half."

## The 11 answers
1. **Sells in 5 s, moves within 1 s: yes, after a beat.** At 0 s only "Hanzo Engine" shows with a ghosted grey terminal; by 1 s the lede "The inference engine, in one binary", View on GitHub and the meta line are in and the terminal is black and streaming. The terminal (run / serve / bench tabs, `$ hanzo engine run <model>`) is the one big thing, but its output is rows of grey pills, not tokens, and it runs below the fold. Header outlines "Try Hanzo" once the hero solid is up (good).
2. **One in, one out: yes on desktop.** Six pinned chapters (4,806 px): text left, one panel right that changes per chapter, a 01–06 index under it. 04 is the signature: a grid of weights collapsing in shade while a marker slides from 8 to 2. Others: verbs list, modality fan-in to "one process", CUDA / Metal / CPU cards, the /ui sketch. On phone the chapters stack (text then card) and run by themselves while seen; acceptable, but 14 screens.
3. **A real object in every section: yes.** Terminal, six chapter panels, the verb builder (tabs, model field, /ui toggle, generated line), the close's agent prompt.
4. **One ask, nothing floating; scale: mostly.** Header carries "View on GitHub" on desktop after the hero. On phone the header stays "Try Hanzo" all page. Nothing page-owned floats. Scale is flat: 52 px h1, then six 26 px chapter heads in the identical left-text/right-card layout; only the 8→2 figure is large.
5. **Hover and press: mostly.** Primary, verb tabs, Copy and the toggle answer. The 01–06 chapter index buttons have no hover change ("01" dead in my probe); the hero "run" tab has no press change.
6. **Overlap, font swap, layout shift: small ones.** CLS 0.0016 desktop / 0.0005 phone, no overflow, h1 box holds. On phone the CUDA card breaks words mid-word ("FlashAtte / ntion", "parallelis / m"), and the quantization grid's bottom row is clipped by its card. On desktop, a frame 700 ms after a wheel caught chapter 04's "8 —— 2" header sitting over chapter 05's CUDA card mid-swap.
7. **Reference: apple.com product page.** The pinned stage where one panel changes is genuinely there, and the scrub is a real Apple-style moment. No count-up, no type moment.
8. **Different from its neighbours: yes.** Terminal + pinned chapters with a quantization scrub; distinct from /edge and /cloud/*.
9. **18 parts: card 18/18** (`docs/coverage/engine.md`). Hydration-mismatch error on every load (diff in `<Head>`, shared, seen on every page; not counted).
10. **Banned tells: none.** Monochrome, Zen fonts, no gradient text, no eyebrow over the h1 ("GET STARTED WITH HANZO ENGINE" and "RUN, SERVE, BENCH" sit under their heads).
11. **Copy: untouched.** `parity.py /engine`: text 29/29, links 2/2.

Tools: `taste.py Engine.jsx` OK. `unique.py`: signatures unique (exit 1 only for Contact.jsx).

## Fixes, in order
1. **Let the terminal say something.** Stream real tokens (Hanzo's own run/serve/bench lines) instead of grey pills, and fit the window so its output is above the fold at 1470.
2. **Break the six identical chapters.** Let 04's grid grow to the one big thing (wider, text receding) while it is the moment, then settle; vary the panel side or size in at least two chapters.
3. **Phone CUDA card.** No mid-word breaks: stack the three silicon cards or let the CUDA caption wrap on words (`overflow-wrap: normal`, wider card).
4. **Phone quant grid.** Fit the grid inside its card (no clipped bottom row).
5. **Chapter swap.** Fade the outgoing panel fully before the next arrives so 04's header never sits over 05.
6. **Phone header ask.** "View on GitHub" in the header after the hero on phone.
7. **Hovers.** 01–06 index buttons (preview the chapter title), hero tab press.
8. **Close.** The graphite "Get Engine" band is short and quiet; give it the generated command typing in once as its payoff.
