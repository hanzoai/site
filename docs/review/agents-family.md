# /agents/* (template) — James-eye review

Reviewed: main, page files at `c0b5968` (second review; the first, at `dd80650`, scored 5/10). Members walked: `/agents/crew` and `/agents/sdk`, moving, at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

Verdict: 7/10

First complaint: "Much better, it finally looks like us. But there's a red error badge on the page every time I open it, and on my phone the 'Launch a bot' bar lands right on top of the other 'Launch a bot' button at the end."

## What changed since the first review
Fixed: no hues left (orange, green, blue and pink are gone), no eyebrow above either h1 (the label now sits under it), one solid ask per member repeated hero to close, the SDK console now plays on the phone's first screen, demos play once and settle.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes on both sizes for both members: the crew ring turns and the SDK console types. On desktop the crew ring starts a beat late (nothing changes in the first 1.3 s).
2. **One in, one out?** Yes: the ring pins while chapter two replaces the hero words, then the Bots room; on SDK the 01 / 02 / 03 cards stack. SDK's "parts" list in the middle still reads as a document.
3. **A real object in every section?** Mostly. SDK's six-part list has none.
4. **One ask, sticky after the hero?** Nearly. "Launch a bot" / "Read the docs" is the one ask on the page and follows you on desktop. But the header's solid "Try Hanzo" still sits beside it, so two solid buttons show at the top. **Phone crew:** the bottom bar only appears at the very end, and there it overlaps the close's own "Launch a bot" button.
5. **Every hover and press answers?** Not yet. Crew "Launch a bot": no hover change, no press. SDK "Read the docs" and "View on GitHub" now answer both; pip / cargo tabs and Copy still have no hover.
6. **Overlap, font swap, layout shift?** Layout shift 0 on all four walks. **A hydration error on every desktop load of both members** ("server rendered HTML didn't match the client"), so the red "1 Issue" badge sits in the corner on localhost. Phone overlap at the end of crew (answer 4). SDK console still runs off the right edge on desktop, cutting its corner.
7. **Which reference, and is its motion there?** apple.com pinned chapters: yes. Calm, greyscale, product-first: it now feels closer to the reference.
8. **Different from its neighbours?** Yes: ring vs console, and each its own Sigil.
9. **All 18 parts covered?** See below. `docs/coverage/agents-family.md` exists.
10. **Banned tells?** None left on the page itself. (The shared header's "Try Hanzo" still fades on hover.)
11. **Copy untouched?** Yes (crew 31/31, SDK 94/94). "Find an agent" is a control label.

## Missing from the 18 parts (PLAN-COMPONENTS 2.1–2.18, measured)
- **2.1 / 2.4:** two solids at the top (header + hero); 0 `data-cta`.
- **2.3 / 2.17 No-JS:** with JavaScript off, the lede and chapter two stay invisible (4 of 10 blocks on crew, 4 of 29 on SDK).
- **2.11 Mobile:** crew's phone bar appears late and overlaps the close.
- **2.13 / 2.17:** the hydration error.
- **2.16 Developer:** pip / cargo tabs and Copy have no hover; Copy is 13px.

## Fixes
1. Fix the hydration mismatch on both members (the red badge must be gone).
2. Phone crew: show the "Launch a bot" bar after the hero, and hide it when the close's own button is on screen.
3. Give crew "Launch a bot" a hover and a press (scale 0.98 or 1px down); give pip / cargo / Copy a hover.
4. Swap the header's "Try Hanzo" to the page's ask (or outline it) so only one solid shows at a time.
5. Render the lede and chapter-two text visible without JavaScript.
6. SDK desktop: keep the console's right edge on screen, or bleed it fully with no cut corner.
