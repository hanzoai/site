# /agents/* (template) — James-eye review

Reviewed: main, page files at `fca5513` (third review; earlier: 5/10 at `dd80650`, 7/10 at `c0b5968`). Members walked: `/agents/crew` and `/agents/sdk`, moving, at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

Verdict: 8/10 — ready

First complaint: "This is right now. One small thing: on my phone, once I scroll past the top, the black button at the top says 'Try Hanzo', not 'Launch a bot'."

## What changed since the last review
Fixed: "Launch a bot" now answers on hover (the fill lightens) and on press (scale), the SDK console sits inside the grid with no cut corner, the phone no longer stacks a bar on top of the close's own button, and the SDK "parts" section and both closes now carry an object.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes on both sizes: the crew ring passes the turn (Maya → Nora → Vi) and the SDK console runs a real request ("Add rate limiting to the payments API." → "Read 14 files…" → "Wrote gateway/limit.go…").
2. **One in, one out?** Yes: the ring pins while chapter two replaces the hero words, then the dark Bots room, then "Or build your own."; SDK stacks its 01 / 02 / 03 cards, then parts, code and the close.
3. **A real object in every section?** Yes.
4. **One ask, sticky after the hero?** Desktop yes ("Launch a bot" / "Read the docs" follow you; the header outlines). Phone: the header's "Try Hanzo" turns solid after the hero instead of the page's ask.
5. **Every hover and press answers?** Yes on the asks (checked frame by frame on "Launch a bot"), the seats and the links.
6. **Overlap, font swap, layout shift?** None; layout shift 0 on all four walks.
7. **Which reference, and is its motion there?** apple.com pinned chapters; calm, greyscale, product first.
8. **Different from its neighbours?** Yes: ring vs console.
9. **All 18 parts covered?** `docs/coverage/agents-family.md` exists; text reads with JavaScript off (0 hidden blocks).
10. **Banned tells?** None.
11. **Copy untouched?** Yes (crew 31/31, SDK 94/94).

## Fixes (polish, not blocking)
1. Phone: mark each member's hero button with `data-thumb` so the ask bar carries "Launch a bot" / "Read the docs" instead of the header's "Try Hanzo".
