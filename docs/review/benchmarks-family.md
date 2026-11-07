# /benchmarks/* (template) — James-eye review

Reviewed: main, page files at `c46ed13`. Members walked: `/benchmarks/gpqa` and `/benchmarks/fleet`, moving, at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

Verdict: 6/10

First complaint: "On my phone the results card keeps flipping between a list and a chart, and the page jumps every time it does."

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** It reads: "What a dormant agent costs" / "The router on GPQA-Diamond" at display size with Hanzo's summary and one ask ("Start on Hanzo Cloud"). The results card sits at the fold. On /benchmarks/fleet the card flips by itself between list and chart and rotates its figure (477 bytes ↔ 455 MB), and keeps doing so (a loop). On /benchmarks/gpqa the first screen is still.
2. **One in, one out?** Mostly: results card, then "What this does not measure", "What is measured", and the closing ask. The honest-limits section is exactly what the brief asks for (candour beside the claim).
3. **A real object in every section?** The results card and its chart; the limits and method sections are text, which is right for a method page.
4. **One ask, sticky after the hero?** Yes: "Start on Hanzo Cloud" in the hero and in the shared ask bar; `data-cta` present (2). On the phone the header's solid "Try Hanzo" shows beside the bar.
5. **Every hover and press answers?** The list/chart toggle answers; Copy presses.
6. **Overlap, font swap, layout shift?** No overlap. **Phone layout shift 0.38 on /benchmarks/fleet** (over Google's 0.1 limit): the card changes height each time it flips view, pushing everything below. Desktop 0.006.
7. **Which reference, and is its motion there?** anthropic.com launch (a benchmark as a hero figure, honest gaps, method footnotes). The structure is there; the hero figure is below the fold.
8. **Different from its neighbours?** Members differ by figures and words; layout identical.
9. **All 18 parts covered?** See below.
10. **Banned tells?** None found: greys only, nothing above the h1. The self-flipping card is a looping decoration.
11. **Copy untouched?** Yes: parity 110/110 and 59/59 text, 41/41 and 27/27 links.

## Missing from the 18 parts (PLAN-COMPONENTS 2.1–2.18, measured)
- **2.13 Layout shift:** 0.38 on the phone (fleet).
- **2.3 First impression:** the hero figure (the result) starts at the fold on both sizes; gpqa's first screen is still.
- **2.9 Motion:** the card flips views on a timer; plan says demos play once and rest, with a pause control.

## Fixes
1. Fix the card's height for both views so flipping never moves the page.
2. Flip once (list → chart) and rest; let the reader toggle after that.
3. Put the result itself (the big figure, e.g. "477 bytes") in the first screen beside the title, as the hero object.
4. On gpqa, give the first screen the same one-time move (the score landing on its rule).
