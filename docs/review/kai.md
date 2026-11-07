# /kai — James-eye review

Reviewed: main, page files at `d3752c2`. Walked moving at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

Verdict: 7/10

First complaint: "The film is beautiful and the interface finally stays black and white. But the first screen has no button, and on my phone the page jumps while it loads."

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Moves, strongly: Hanzo's own Kai film (stacked diamonds of light) fills the screen under "Kai" and "Precise decisions and structured reasoning." It sells the name, not yet the use, and there is **no ask on the first screen**; "Explore models" and "Open Decisions" arrive when the film settles into its diamond beside "Kai. Made for decisions."
2. **One in, one out?** Yes on desktop: the film settles into the diamond, then "A state goes in. Answers come out." shows a request and its answers, then the Kai models, then "One endpoint. Three kinds of question." On the phone most screens after the hero are still.
3. **A real object in every section?** Yes: film, request and answer, model cards, question types.
4. **One ask, sticky after the hero?** Two near-equal asks: "Explore models" (solid) and "Open Decisions" (outlined), plus "Docs on GitHub". After the hero, desktop shows "Explore models" and "Open Decisions" both sticky; the phone bar carries "Open Decisions". Pick one.
5. **Every hover and press answers?** Hero links answer; "Copy request" presses.
6. **Overlap, font swap, layout shift?** No visible overlap. **Phone layout shift 0.127** (over Google's 0.1) while the film settles into the diamond; desktop 0.001.
7. **Which reference, and is its motion there?** synchronized.studio (the model card opens into this page, with a close) and the anthropic model launch. Both there.
8. **Different from its neighbours?** Yes: its own film and the decision request.
9. **All 18 parts covered?** See below.
10. **Banned tells?** None in the interface: greys only, the breadcrumb ("Hanzo / Kai") is the only line above the headline on the phone, which is fine. The blue lives only in Hanzo's film.
11. **Copy untouched?** Yes as measured (parity clean).

## Missing from the 18 parts (PLAN-COMPONENTS 2.1–2.18, measured)
- **2.1 / 2.4:** no ask on the first screen; two competing asks after it; 0 `data-cta`.
- **2.13 Layout shift:** 0.127 on the phone.
- **2.6 Type floor:** the 11px "LOGIC" chip.
- **2.10 Media:** one raw `<video>`; 3 of 4 images without width and height.

## Fixes
1. Put one solid ask on the first screen over the film (Hanzo's "Explore models" or "Open Decisions", one of them), the other as a text link.
2. Reserve the diamond's box on the phone so the settle never moves the page.
3. Raise the chip to 13px; give images width and height; play the film through the kit `<Film>`.
