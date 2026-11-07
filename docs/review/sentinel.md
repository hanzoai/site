# /sentinel/: James-eye review
Verdict: 7/10
First complaint: "The rain is lovely, but it's falling right over the words I'm trying to read, and then the cards stack up with big empty white lids on them. It's nearly there, it just doesn't feel finished."

Walked 2026-11-07 16:10 UTC on the dev server at 1470x801 and 375x812, moving.
## The 11 answers
1. First screen sells, and it moves in time.
   - The h1 "Hanzo Sentinel" is 52px. Beside it is a live issue card: the events count ticks (4,236 to 4,458 within about 3 s), the minified frame `main.3f9a.js:1:88213 · t.a()` resolves to `checkout/cart.ts:42`, and the breadcrumbs step. Motion shows by 1.0 s; a frame diff from 300 to 1000 ms changed 85k px.
   - The h1 sits low: top 358px, bottom 418px, about 50% of 801 against the 38% target. On desktop the card runs past the fold, cut at "exception".
   - Phone: the h1 starts at 168px, the ask's bottom edge is at 362px, and the card starts at about 240px. That passes.
2. One in, one out: mostly yes.
   - The black room's rain of events collapses into a single issue card (1,026 to 8,016 to 10,000 events): the signature, and it reads.
   - Chapters 02 to 06 come as a pinned stack of cards, one idea each.
   - Dead stretches: desktop stops 7, 8, 10, 11 and 13 are still (5 of 14). Phone stops 5, 6 and 11 to 14 are still.
3. Real objects: yes, every chapter has one.
   - Trace waterfall, release bars with a cron dot strip, account rows, alert routing pills, and a fork diagram (Sentry to Sentinel).
   - The closing band has the issue card and an agent prompt.
4. The ask is split, and the scale has rhythm.
   - The header says "Try Hanzo" while the hero and closing ask say "Read the docs". The hero's ask label is not in the header.
   - Nothing floats over content except the rain field, which drifts over chapter 01's body copy. That is worst on phone (p-01: streaks through "Identical exceptions collapse…").
   - Scale has rhythm: a 52px h1, 64px figures, a 26px section head, 13-16px body. Never everything big at once.
5. Hover and press work on the main asks, but the alert pills do nothing on hover.
   - "Read the docs": the fill goes from #0a0a0a to #2c2c2e on hover, and press is scale(.98). "View on GitHub": the arrow moves 4px.
   - Alert pills (Slack, PagerDuty…): hover changes nothing, and click inverts to ink with `aria-pressed=true`. They need a hover answer.
   - Phone: 0 targets under 44px in main.
6. Overlaps and shifts:
   - In the closing band card the "source map" chip is clipped at the card edge, at both sizes ("sourc", "applyDisco" on phone).
   - The stacked cards show about 120px of empty card lid above each chapter (d-06, d-08, d-09). Mid-scroll, the incoming card cuts through "05 / 06".
   - The TOP FRAME bar is caught empty (solid black, no text) in some frames (d-01, p-01) during the swap.
   - About 250px of white sits after chapter 06 before the black band (d-10).
   - Hydration warnings, transient: one run showed a footer `__html` hydration mismatch and the red "1 Issue" badge. Three reruns showed 0 errors. It is shared chrome, not this page.
7. Reference: apple.com product page (a pinned scene, the product as hero) plus a self-running demo. The pinned stack is there. The rain-to-issue scrub is authored and earns its place.
8. Different from its neighbours: own hero medium (a live error console) and its own signature (events collapsing into one issue). Yes.
9. 18 parts: not audited from source. Visible gaps are the sticky ask label (part 4) and the closing band clip (part 7/11).
10. Banned tells: none of the hard ones. Monochrome holds, there is no eyebrow above the h1 (SENTRY.HANZO.AI sits below it as a caption), and no gradient text. A floating layer over text (the rain) is the one near-miss.
11. Copy: `parity.py /sentinel` OK, text 29/29, links 3/3.

## Fixes (in order)
1. Keep the rain off text. Mask the field behind the left column (or fade it out under the copy box). On phone, stop it before the paragraph starts.
2. Put the hero ask's label ("Read the docs") in the header ask, or make the hero primary match the header, per the sticky-ask rule. Use one label.
3. Fix the closing band card: the code row overflows and clips "source map" at 1470 and at 375. Let it wrap, or drop the chip under 600px.
4. Tighten the stack. Remove the empty top lid of each card (about 120px) so the stacked edges are thin slivers. Make sure the incoming card never cuts through the "0N / 06" caption. Close the 250px white gap after 06.
5. Never show an empty TOP FRAME bar. Crossfade the minified and resolved frames instead of clearing to blank.
6. Lift the h1 toward 38% of the viewport (about 300px), so the card's breadcrumbs end above the fold on desktop.
7. Give the alert pills a hover answer (fill to #f2f2f2 or a 1px ink outline), and fill the still stretches. Let the release bars or account rows run once when they enter view.
