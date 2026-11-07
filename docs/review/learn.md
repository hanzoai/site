# /learn — James-eye review

Reviewed: main at `648b798` (page files at `57dfa0a`; shared ask fix `d2b5ab8c` in), 7 Nov 15:18 UTC, under MASTER.md. Earlier: 6/10 at `84c407e`. Walked moving at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

Verdict: 6/10 (no card; a document after the map)

First complaint: "The map at the top is good. After it, it's a pile of cards, a banner, a list of blog posts and questions. It goes on and on."

**Cap: part card (MASTER section 6).** There is no `docs/coverage/learn.md`. Capped at 7 until the card is copied from `docs/coverage/_TEMPLATE.md` with 18 `Done here:` lines true on the page.

**Floats over content (MASTER 3.2 rule 6):** passes; nothing fixed over content on either size.

**Scale (MASTER 3.1):** no screen is everything big at once. But after the hero nothing is big at all: card titles, the University banner and the blog titles sit at the same medium size for six screens, so there is no rhythm either. Give each section one thing that leads.

## What changed since the last review
Fixed: the teal is gone (stops, train, pills and arrows in greys), "• LEARN" no longer sits above the h1, and the section pills are gone from above the headlines. The lede now sits beside the h1 (8/5 split).

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes: "Learn Hanzo", "Get started", and the transit map whose train rides the Start-here line by itself (Getting started → CLI → API reference → Agents → MCP).
2. **One in, one out?** Only for the map. After it: numbered cards (01–06), the "Hanzo University" banner, "From the blog", "Read the thinking", "Questions". A document.
3. **A real object in every section?** The map, yes. The rest are text cards and lists.
4. **One ask, sticky after the hero?** The sticky header carries a solid "Try Hanzo"; the page's "Get started" is solid on the first screen too (the shared header, see `_shared.md`). "Get started" itself does not follow you.
5. **Every hover and press answers?** The map stops and cards answer. "Hanzo University" (the hero link) does not change on hover.
6. **Overlap, font swap, layout shift?** None; layout shift 0.0002 and 0.0005.
7. **Which reference, and is its motion there?** hamol.studio numbered catalogue and an Apple-style self-running demo. Present for the map only.
8. **Different from its neighbours?** Yes: the transit map is its own.
9. **All 18 parts covered?** No card (cap above).
10. **Banned tells?** A document after the hero (six sections of cards and links).
11. **Copy untouched?** Words unchanged since parity 69/69 text, 26/26 links; the route words flagged last time are gone.

## Missing from the 18 parts (MASTER, measured)
- **Part 3 narrative:** one idea per screen after the hero; detail behind clicks.
- **Part 4 conversion:** 0 `data-cta` on desktop, 1 on the phone.

## Fixes
1. Write the 18-part card (lifts the cap).
2. Fold the sections after the map into two: the 01–06 cards as one rail, the blog and "Read the thinking" as one row; questions stay collapsed.
3. Give each remaining section one big moment (a figure, a film still or the University film) so the scale has rhythm.
4. Add `data-cta` to "Get started" on desktop and give "Hanzo University" the kit hover.
