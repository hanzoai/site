# /learn — James-eye review

Reviewed: main, page files at `84c407e`. Walked moving at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

Note (7 Nov 14:12): a hydration error seen in the first walks came from the shared shell and is gone on main; it is not counted against this page. Text is now legible with JavaScript off (shared fix at 14:05, re-checked).

Verdict: 6/10

First complaint: "Teal pills, teal dots, and a little teal label on top of 'Learn Hanzo'. Hanzo is black and white. And after the map it's a long list of cards and links, it goes on and on."

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes on both sizes. "Learn Hanzo", "Get started", and a transit map whose train rides the Start-here line by itself (Getting started → CLI → API reference → Agents → MCP), each stop opening its guide. That is a good live object, and it works on the phone too.
2. **One in, one out?** Only for the map. After it the page is a document: "Pick what to try" cards, "Hanzo University", "Go further" cards, "From the blog", "Read the thinking", then "Questions". Six sections of cards and links in a row.
3. **A real object in every section?** The map and the dark "Your route" panel, yes. The rest are text cards with numbers and arrows.
4. **One ask, sticky after the hero?** No. "Get started" follows you, but the header's solid "Try Hanzo" is beside it, so two solid buttons are on screen after the hero on both sizes.
5. **Every hover and press answers?** Most map stops and route chips answer on hover and press. "Hanzo University" does not change on hover. "A first request" has no hover. "Get started" has no press.
6. **Overlap, font swap, layout shift?** None; layout shift 0.005.
7. **Which reference, and is its motion there?** hamol.studio numbered catalogue (01 / 05) and an Apple-style self-running demo. Present for the map only.
8. **Different from its neighbours?** Yes: the transit map is its own.
9. **All 18 parts covered?** See below. No `docs/coverage/learn.md`.
10. **Banned tells?** Yes:
    - Eyebrow above the h1 ("• LEARN", teal dot, mono caps). Teal pills ("START HERE", "TRY") also sit above section headlines.
    - A UI hue: teal on pills, stops, the train, numbers and arrows. JAMES.md allows 0 UI hues.
11. **Copy untouched?** Mostly: parity 69/69 text, 26/26 links. The route picker adds words not in Hanzo's copy ("Your route", "A first request", "From the terminal", "An interface").

## Missing from the 18 parts (PLAN-COMPONENTS 2.1–2.18, measured)
- **2.4:** two solid buttons after the hero; 0 `data-cta`.
- **2.6 Content:** five card and link sections after the map; plan says one idea per screen, detail behind clicks.

## Fixes
1. Remove "• LEARN" from above the h1 and the teal pills from above the section headlines.
2. Take the teal out: stops, train, pills, numbers and arrows in ink and greys.
3. Make "Get started" the only solid button after the hero (outline or swap the header's "Try Hanzo").
4. Fold the five sections after the map into one or two: for example "Pick what to try" and "Go further" as one rail, the blog and "Read the thinking" as one row, questions collapsed.
5. Replace "Your route" and the three route labels with Hanzo's words, or get James's yes.
