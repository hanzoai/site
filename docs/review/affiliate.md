# /affiliate — James-eye review

Reviewed: main, page files at `501fb8c` (second review; the first, at `d6275ed`, scored 6/10). Walked moving at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

Verdict: 8/10 — ready

First complaint: "Good. Now it looks like us. If I'm picky, the address bar is cut off at the bottom of my laptop screen, so the first thing I see is mostly white."

## What changed since the first review
Fixed: no eyebrow over the h1, no orange (grey deck only), the invented step labels are gone (Hanzo's own sentences carry the steps), "Apply" is the one solid ask from hero to close and follows you after the hero, the address bar types the link once and rests, and "Apply" now answers on hover and press.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes. "Refer customers to Hanzo", Hanzo's line, "Apply", and the address bar typing `https://hanzo.ai/?aff=<code>` once.
2. **One in, one out?** Yes: the four steps pin on the left (01 / 04 … 04 / 04) while one card on the right turns from the request into the reply, the link and the org landing "attributed to you"; then the dark room states the rule at display size; then the closing "Apply to become an affiliate."
3. **A real object in every section?** Yes: address bar, step card, dark statement, the link again in the close.
4. **One ask, sticky after the hero?** Yes: "Apply" in the hero, in the shared ask bar after it, and in the close; the header's "Try Hanzo" turns outlined. Two `data-cta` tags.
5. **Every hover and press answers?** Yes on "Apply" (hover and press). Copy answers.
6. **Overlap, font swap, layout shift?** None; layout shift 0 on both sizes.
7. **Which reference, and is its motion there?** apple.com pinned chapter with one changing object, and grubogrubo's big closing statement. Both there.
8. **Different from its neighbours?** Yes: the address bar is its own object.
9. **All 18 parts covered?** `docs/coverage/affiliate.md` exists; the measured gap below is small.
10. **Banned tells?** None found.
11. **Copy untouched?** Yes: 15/15 text. The one "missing" link is Cloudflare's email-protection rewrite of hello@hanzo.ai; the page links the address directly.

## Missing from the 18 parts (PLAN-COMPONENTS 2.1–2.18, measured)
- **2.3 First impression:** at 1470×801 the address bar (the hero object) shows only its top edge.

## Fixes (polish, not blocking)
1. Pull the address bar up so it sits fully inside the first screen on desktop.
