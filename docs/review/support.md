# /support — James-eye review

Verdict: 7/10
First complaint: "It's tidy now. But after the little typing it's an empty box and a list, and then it's over. Where's the moment?"

Walked 7 Nov at about 15:05 UTC, page file at `24d2adc5` (`components/pages/Support.jsx`, `Support.css`), on the preview of main plus branch heads. Filmed moving at 1470×801 and 375×812 (wheel and finger scroll, dwell on every screen, hover and press on desktop, taps on phone), plus reduced motion and JS off. Judged by `JAMES.md` and `MASTER.md` (Utility, §4.5). Stills: `review/support/desktop-walk.jpg`, `review/support/phone-walk.jpg`. This replaces the 6/10 review of `e512a64`.

## What works
- The earlier complaints are fixed: no square focus box inside the pill, one letter no longer jumps to "email support", and the giant numerals that cut through "Documentation" on the phone are gone.
- The demo is honest. Once the headline lands, the pill types Hanzo's own "support ticket", underlines those two words in the Help Center card, then clears and rests. The ask stays "Open Help Center" the whole time, and the pill has a pause button.
- Scale has rhythm: h1 84px, the answer title about 52px, the six ways at 26px, the lede small. One big thing, the rest medium and small.
- The hero frame finally differs from the other Company pages: one full-width line over a search pill and a live list, not a left headline beside a card.
- It ends on a Band ("On an enterprise plan or need a dedicated channel?" with one "Email support@hanzo.ai"), then the footer.
- Monochrome; `taste.py` passes. JS off: 0 hidden text. Reduced motion: 0 running animations. CLS 0.0002, no tap target under 44px. Parity: text 24/24, links 6/6.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes: "How can we help?", a search pill, the best answer and the six ways, all on the first screen. The h1 cuts in at once; the typing follows about a second later.
2. **One in, one out, or a document?** Two screens: the search room and the Band. Not a document, but very short and quiet.
3. **A real visual object in every section?** The working search UI and the Band. At rest the pill is an empty white box with only a magnifier (the repeated placeholder was rightly removed), so the hero's main object looks blank once the demo ends.
4. **One ask, sticky after the hero?** No. The answer card's "Open Help Center" is the ask, but after the hero only the header's "Try Hanzo" stays; on desktop no ask follows you. Under the 14:45 rule the page's ask should live in the sticky header.
5. **Every hover and press answers, no jumps?** Yes. Pointing at a row previews its door; press on "Open Help Center" is .98; the pill border inks on hover.
6. **Overlaps, font swap, layout shift?** None at either size.
7. **Which reference, is its motion there?** apple.com support calm, plus "answer as you type". It works, but the demo never shows the answer changing (it keeps the Help Center), so a visitor does not see the magic unless they type.
8. **Different from neighbours?** Yes, now.
9. **18 parts (MASTER §2)?** See the card check below.
10. **Banned tells?** None found.
11. **Copy untouched?** Yes (parity clean).

## Card check (`docs/coverage/support.md`)
- **Format.** Template format with `Done here:` lines on all 18 parts.
- **Part 4 is false at 1470.** It ticks "Sticky ask in header and bar after the hero, same label". On desktop no bar appeared and the header ask stays "Try Hanzo".
- **Verdict capped at 7.** It would sit at 7 anyway: correct, calm and short of a moment.

## Fixes (in order)
1. **Put "Open Help Center" in the sticky header** at every width (solid once the answer card leaves view). No floating bar.
2. **Let the demo show the answer moving, once.** After "support ticket", type one more of Hanzo's own words that re-ranks the list (for example "status"): System Status rises into the answer card, then the demo clears and the card settles back on the Help Center. It runs once and pauses on pointer or focus, as now.
3. **Do not leave the pill blank at rest.** Leave the last typed phrase dimmed in the field, or show the six ways' names as quiet chips under it, using words already on the page. No new copy.
4. **Give the Band a small object.** For example, the six doors as a quiet row of Hanzo's own destinations, so the closing room is not text and a button only.
