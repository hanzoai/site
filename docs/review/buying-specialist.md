# /buying-specialist — James-eye review

Reviewed: main, page files at `29e299e`. Walked moving at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

Verdict: 6/10

First complaint: "It's blue. The dot over the headline, the send button, the seats, the sliders, the numbers. Our colours are black and white. And on my phone the quote never shows up on the first screen, so nothing happens."

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Desktop yes: the greeting plus a dark quote sheet that re-prices itself (56 members, $1,800 → 4 members, $160 → 18 members, $440). That is a strong live object. **Phone no:** the first screen is the greeting, three suggestion chips and the input; the quote sheet is below the fold and the only motion is a pulsing dot (0.2% change).
2. **One in, one out?** It is only two screens: the desk, then the rail of six promises. The rail is a row of grey boxes you can drag.
3. **A real object in every section?** The desk, yes. The promises rail is six text cards with a "#1"–"#6" number; no object.
4. **One ask, sticky after the hero?** No. The page's ask is "Start Team Plan", but it lives inside the dark sheet; nothing sticky carries it after the first screen, and there is no phone bottom bar. The header's "Try Hanzo" is the only sticky button.
5. **Every hover and press answers?** Mixed. Two of the four suggestion chips answer on hover; "Looking for dedicated VPC & HIPAA" and "Compare Team vs Enterprise" do not. "Send message" and "Start Team Plan" have no hover change (they do press).
6. **Overlap, font swap, layout shift?** None. Layout shift under 0.001; no console errors.
7. **Which reference, and is its motion there?** chatgpt.com/business/enterprise (calm desk with the price in front of you). The self-pricing sheet is the motion; it is good.
8. **Different from its neighbours?** Yes.
9. **All 18 parts covered?** See below. No `docs/coverage/buying-specialist.md`.
10. **Banned tells?** Yes:
    - A pulsing blue dot above the h1 (a badge over the headline).
    - **Blue UI** throughout: send button, seat squares, slider fills, the "#1" numbers, focus outline on chips. JAMES.md allows 0 UI hues.
    - "Three equal boxes in a row" in the promises rail.
11. **Copy untouched?** Mostly: parity 20/20 text. The quote sheet adds labels not in Hanzo's captured page ("Hanzo Team", "members", "Billed yearly / monthly", "Start Team Plan", "#1"–"#6"). They need James's yes or Hanzo's own words.

## Missing from the 18 parts (PLAN-COMPONENTS 2.1–2.18, measured)
- **2.4 Conversion:** no sticky ask; no phone bottom bar (`data-thumb` absent); 0 `data-cta`.
- **2.3 / 2.17 No-JS:** with JavaScript off, the seat prices line and "More than 100 people? Start Enterprise Plan" stay invisible.
- **2.12 Accessibility:** 2 inputs without a label (the slider and the message box rely on placeholder text).
- **2.11 Mobile:** first screen still; the hero object is below the fold.

## Fixes
1. Remove the blue dot from above the h1, and turn every blue to ink and greys (seats filled in ink, sliders in ink, send button in ink).
2. Phone: put the quote sheet on the first screen (a compact version under the greeting) so the price moves where the thumb is.
3. Carry "Start Team Plan" as the one sticky ask after the first screen, with a phone bottom bar.
4. Give the promises rail one object instead of six text boxes (for example the sheet changing to show each promise), or collapse it.
5. Label both inputs; give every chip a hover.
6. Replace the added labels with Hanzo's own words, or get James's yes.
