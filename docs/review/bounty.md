# /bounty — James-eye review

Verdict: 7/10
First complaint: "Turn the animations off and the page throws a red error at me. And once you're past the leaderboard, the big black button in the header changes to 'Try Hanzo'. Which one am I meant to press?"

Walked 2026-11-07 16:30 UTC, HEAD 8817130a, at 1470x801 and 375x812 (isMobile, hasTouch). First screen captured at 0.2/1/3/6 s plus a reload. Scrolled the whole page in 200px wheel notches (160px on phone) with 1 s dwell. Hovered and pressed every control in main (calculator steppers, deck bars, issue rows, links). Also checked reduced motion, JS off, 320px width, taste.py (OK) and parity.py (text 102/102, links 5/5). GitHub is blocked in the sandbox and the snapshot fallback rendered cleanly.

## What works
- The hero object is the product: a live list of real open bounties with repository refs and `starter` pills. The front issue gets "taken" (count 10 → 9 → 10), so the first screen keeps breathing without input. The h1 cuts in within 1 s.
- Every section holds a real object:
  - a rewards calculator with steppers that recompute pts and credits and move a marker along a #1/#2/#3 track;
  - the standings rows, with figures that count up;
  - an awards deck that deals every 5 s, pauses under the pointer and can be picked from its bars;
  - a log-scale token race scrubbed by scroll, where @hanzo's figure grows from 52 to 84px and settles;
  - a pinned "How a bounty is taken" stage, where three steps fill and the issue card turns black with a tick.
- The motion is mixed: idle (hero list, deck), time (count-ups), state (steppers, deck), scroll (race, pin). It is not all scroll.
- Colour is monochrome only, with no hue in main. Zen and Zen Mono only, no Inter.
- Scale has rhythm: h1 52, h2 26, figures about 64, one 84 moment.
- Nothing overlaps at either size, and there is no horizontal scroll at 375 or 320. JS off renders the full hero and list legibly.

## The 11 answers
1. Mostly. The headline and live issue list sell "take an issue" at once. The h1 moves inside 1 s, but the sub, the ask and the list only land at about 1.5 to 3 s. At 1 s the screen is still just the headline on white.
2. Partly. The hero, rewards and pinned stage are one-in-one-out. The middle is still two long lists back to back: standings (3 rows plus the deck) and then a 10-row dark token table about 1,700px tall. That stretch reads like a document.
3. Yes. Every section has a real object (see above). The closing "Propose a bounty" card is the weakest.
4. One ask, "Every open bounty", sits in the sticky header and has the page's single solid fill. It does not hold, though. On a slow walk the header ask flipped back to "Try Hanzo" from the dark token section (walk 1) or from the pinned stage (walk 2) to the end. On a fast scroll it stayed "Every open bounty". The scale rhythm is good.
5. Mostly. The steppers fill, issue rows fill, the deck bars darken and the links underline, all with no jumps. A few targets give nothing on hover: `security@hanzo.ai`, the last half-hidden issue row, and the `Company` header button (shared). In the pinned stage the active step's text nudges about 6px sideways as it changes state.
6. No overlaps, font swap or layout shift at either size. On phone the "160 –" / "560" range in the calculator band wraps onto two lines, and the #2/#3 labels stack tightly.
7. It feels like apple.com: a pinned stage where one panel changes, plus a scrubbed strip. Both motions are there. The synchronized.studio card-to-page open is absent, which is acceptable here.
8. Yes. /leaderboard uses a podium and "how #1 adds up". /bounty leads with an issue list and has the calculator and the take-it pin as its signatures.
9. Mostly covered. The weak spots are part 17 (states: the reduced-motion render is broken, see Fixes) and part 3 (narrative: there is no closing band, and the page ends on a half-empty row).
10. No banned tells in the page: no eyebrow above the h1 or h2s, no hue, no three equal boxes (rewards is an alternating 2x2), and no fade-on-hover buttons. The cookie banner floats over content, but that is shared chrome.
11. Yes. Parity is 102/102 text and 5/5 links. The odd standings order (#2 has 192 pts, #3 has 252) is in Hanzo's own copy.

Console: with reduced motion, a hydration mismatch in `Bounty.jsx` shows the red "1 Issue" badge (detail under Fixes).
Shared (not counted):
- A generic attribute hydration mismatch showed the badge once on the first phone load, but did not repeat on two more phone loads or on desktop.
- An HMR parse error from `components/About.jsx` came from another page's edit.
- The `?_rsc` aborted prefetch is not a page error.

## Fixes (in order)
1. Fix the reduced-motion hydration error. In `Volume()` (`components/pages/Bounty.jsx` about line 333), `useReducedMotion()` is null on the server and true on the client. So `p` maps to 1 on the client's first render: the server sends `scale(0.62)` and `scaleX(0)`, and the client wants `none`. Gate on a mounted flag, or put the reduced-motion final state in CSS (`@media (prefers-reduced-motion)`) rather than in the first render.
2. Keep one ask all the way down. The header must say "Every open bounty" from the hero to the footer, never flipping back to "Try Hanzo" after the dark section or the pin. Check what the page publishes to the shared header's ask (it looks like the in-view CTA tracking loses the page CTA once the hero link is far off screen).
3. Make the middle one-in-one-out. Let the 10-row token race pin and play as one scene (rows rising into place while the figure counts), so it is not a 1,700px table you scroll past. Or cap it to the top rows and open the rest from the existing "View global token & bounty leaderboard" link.
4. Fix the ending. "A security issue goes to security@hanzo.ai…" sits flush against the bottom edge of the "Propose a bounty" card in an otherwise empty right column. Give it its own row under the card, or set it inside the card's foot, and close on a proper band with the page ask.
5. Land the hero ask with the headline. The sub, the "Every open bounty" ask and the issue list should arrive by about 0.8 s, not 1.5 to 3 s, so the first second sells and not only the headline.
6. Polish:
   - give `security@hanzo.ai` and the last issue row a hover state;
   - stop the 6px sideways nudge of the active step text in the pinned stage;
   - on phone, keep the calculator range "160 – 560" on one line, using a smaller figure or a non-breaking en dash.
