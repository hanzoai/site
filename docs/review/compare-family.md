# /compare/* (family: /compare/model-routing) — James-eye review

Reviewed: main, page files at `8c3aede`. The family has one member, `/compare/model-routing`, walked moving at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

Verdict: 7/10
Ready: 8 Nov, held up next to /api and /affiliate (James's new bar, no score). Walked /compare/model-routing (the one member): the race sits above the button on phones and stamps read at 13px; this pass keeps the first screen quietly alive (the race reads the routers in turn with a blinking read cursor while in view, a hover holds one) and lets our own "we ran this" stamp breathe; the verdict words ("not measured by us") sit in plain text spans so every live line reads word for word. copycheck missing 0 of 12; taste/unique OK; 0 console errors (also reduced motion), no overflow at 1470 and 375 (the ledger scrolls inside its own wrap on phones). Fix 3 ("Models reachable", "Only where they differ") left as is: copy is frozen. Shared, not this page: the phone Ask bar floats over the bottom edge.

First complaint: "It's honest and it's calm, I like that. But once the numbers finish racing, the first screen just stops, and on my phone the race is below the button. And the table is a lot of small grey text."

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes on desktop: "Which API should you route your model calls through?" beside a figure race (Enso 600+, OpenRouter 500+, Portkey 1,600+, LiteLLM 1,800+ models reachable) with each figure's provenance. The race counts up from zero and lands on Hanzo's figures. After that the **first screen is still** (0% change). On the phone the race sits below "Hanzo Enso".
2. **One in, one out?** Yes for a proof page: hero race → "Side by side" ledger (Measured / Reported tabs, a differences-only switch) → the dark room "This page is not arranged to make Hanzo look best." → "Go deeper".
3. **A real object in every section?** Race, ledger, dark statement: yes.
4. **One ask, sticky after the hero?** Yes: "Hanzo Enso" solid in the hero and carried by the shared ask bar; the header's "Try Hanzo" turns outlined on desktop. On the phone the header's solid "Try Hanzo" shows beside the bar.
5. **Every hover and press answers?** The tabs and switch answer; not every ledger row was exercised.
6. **Overlap, font swap, layout shift?** None; layout shift 0.005 and 0.009.
7. **Which reference, and is its motion there?** chatgpt.com/business/enterprise (calm proof, quietly listed) and the anthropic launch page's honest gaps ("not measured by us"). Both there; this is the brief's candour rule done right.
8. **Different from its neighbours?** Yes.
9. **All 18 parts covered?** See below. `docs/coverage/compare-family.md` exists.
10. **Banned tells?** None: greys only, nothing above the h1.
11. **Copy untouched?** Yes: parity 29/29 text, 6/6 links. Two labels are not in Hanzo's copy: "Models reachable" (the race's caption) and "Only where they differ" (the switch).

## Missing from the 18 parts (PLAN-COMPONENTS 2.1–2.18, measured)
- **2.6 Type floor:** 5 provenance stamps at 12px ("they published this", "we ran this", "not published").
- **2.6 Tables:** the ledger reads as dense small grey text; plan wants 48px rows and the subject column tinted grey.
- **2.11 Mobile:** hero race below the ask on the phone.
- **2.4:** 0 `data-cta`.

## Fixes
1. After the race lands, give the first screen one quiet life (for example the provenance stamps stamping in one by one, once), and on the phone put the race above the button.
2. Raise the provenance stamps and table meta to 13px or more; give ledger rows 48px and tint the Enso column grey.
3. Replace "Models reachable" and "Only where they differ" with Hanzo's words, or get James's yes.
