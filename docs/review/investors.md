# /investors — James-eye review
Verdict: 6/10
First complaint: "The numbers are broken. Under 732,288 it says '7' and then '8,421' on the next line, '1' then ',263', tiny. That's the commit record an investor reads. And on my phone every bar is full again: 200× is as long as 400×, and every model in the code chart looks the same."

(Walked 7 Nov 2026, HEAD `63e56e7e`, 1470×801 fine pointer and 375×812 touch. Also 320 and 375×667, reduced motion, JS off.)

## What works
- **The desktop story now moves.** The thesis pins and the outgoing title clears before the next rises. Sampled every 80 ms: "Smarter" 86→66→2→0 px inside its mask, then "Faster" 0→42→86. They never overlap now.
  - On desktop, 400× is twice 200× against the 1× dot.
  - The results room is a real pinned scene: one giant figure at a time. It shows 16 lit dots, the LiveCodeBench bars drawn in proportion (343/366 px for 93.7%), 152 of 159 dots, Kai's 0.3/0.4/0.8 ms bars, Dev's interval and the Zen Sigil.
- **The stack layers.** The slabs are sticky and stack 03 → 02 → 01, with the black slab last.
- **Sticky ask on desktop.** After the hero, the header's solid becomes "Contact investor relations" (rgb 10,10,10), white on black in the results room. The close's single solid is `ir@hanzo.ai`.
- **The hero holds.** The h1 cut-in starts at first paint (FCP 0.76–0.99 s; the h1 is moving by then). The lede, asks and counter follow at 2.0–2.3 s from navigation, and the counter rolls on its own.
  - Fit: the hero CTA ends at y=573 at 1470×801, the counter card at y=784, and the CTA at y=428 at 375×812 and 375×667.
- **Clean basics.**
  - Reduced motion: 0 running animations after 3.5 s.
  - JS off: lede, CTA and counter at opacity 1 at both sizes, with every pinned scene stacked.
  - Width: no horizontal scroll at 320 (scrollWidth 320).
  - CLS: 0.0026 on desktop and 0.0014 on the phone.
  - Parity: 131/131 text and 43/43 links. `taste.py` passes.
- **Hovers mostly answer.** The arrow appears on 732,288 and on each stat. The tick circle half-draws its check (#a3a3a3 to #525252, dashoffset 16 to 8). The exec arrow moves 3,-3. Wall tiles fill #f5f5f5. The asks darken to #2c2c2e and press at .98.

## The 11 answers
1. **Sells in 5 s, moves within 1 s?** Yes on a warm load. The h1 masks in from first paint (~0.8 s), the counter's fill line runs, and the frame changes within 1 s at idle (two shots 1 s apart differ). On the first cold walk the page was blank white until 2.2 s, and the lede did not arrive until ~4 s.
2. **One in, one out?** On desktop, yes for the thesis, the stack and the results. After them it is a document: commit record, wall, people, Read the source. On the phone every pinned scene stacks (as specified), so it reads as a long scroll of 17,495 px, about 21.5 screens.
3. **A real object in every section?** Yes. The counter, the Sigil, 200×/400× bars, the slabs, dots, bars, interval, the heatmap, the logo wall, the 51% org line, portraits (Sigil fallback) and the 0/7 counter.
4. **One ask, sticky; scale rhythm?**
   - **Desktop:** yes, the header carries "Contact investor relations".
   - **Phone:** no. The header's solid stays "Try Hanzo" (rgb 10,10,10 at y=1600), and no ask bar appears after rejecting cookies. The investor's ask disappears once the hero scrolls away.
   - **Scale:** it has rhythm. The h1 is 84px on desktop and 41px on the phone, the giant figures 112px, the rest 16–21px.
5. **Hover and press answer, no jumps?** Mostly; no hover jumps were measured.
   - No press state on any link: the slabs, stats, commit rows, wall tiles, dd rows and exec rows all show `transform: none` while pressed.
   - The Backed-by names do not change colour on hover (#737373 stays).
   - The Legal/Security/Press links have no hover change.
6. **Overlaps, swap, shift?**
   - **Swap and shift:** none (CLS ≤ 0.0026).
   - **Broken render: the five commit stats.** `.xin-stats span:first-child` (16px, #525252) also matches every `.xin-roll-m`/`.xin-roll-c` inside `RollFig`. Each digit is forced to 16px, and the first digit drops onto its own line. Settled after 3 s, it reads "Merges / 7 / 8,421", "Commits / 1 / ,263", "73 organizations / 1 / ,733", "5 / ,125", "3 / ,617", at both sizes.
   - **Badge:** a red "1 Issue" dev badge sat bottom-left through the first desktop and phone walks. The phone walk logged a hydration-mismatch console error. Three later loads were clean, so it is intermittent.
7. **Reference?** anthropic.com launch (benchmarks as hero figures) plus Apple pinned scenes. On desktop that motion is really there. On the phone and under reduced motion the benchmark truth breaks: see 10.
8. **Different from neighbours?** Yes. Its own signature (the rolling figure counter), a black results room as a pinned figure scene, and layering slabs. The Sigil close still echoes /press and /contact.
9. **18 parts?** The card covers all 18, but some claims are false (below).
10. **Banned tells?**
    - **No:** no hue, gradient text, Inter or eyebrow over the h1.
    - **Truth fails (the "unverifiable claims" rule).** Under 899px and under reduced motion, `.xin-pin-s * { transform: none !important }` wipes the `scaleX` on every bar.
      - **Phone:** all six LiveCodeBench bars measure 131/131 px (78.3% draws as long as 93.7%). The Kai bars are 131/131 too, and 200× and 400× are both full (257/257).
      - **Reduced motion, desktop:** 428/428, 388/388, then 246/246 ×6 and 231/231 ×3.
    - **Minor:** the inline `--acc: #1d1d1f` on `<main>` is not a deck value.
11. **Copy untouched?** Yes. Parity is 131/131 and 43/43.

## Card check (docs/coverage/investors.md)
- TRUE: one solid in the hero; parity 131/131 and 43/43; the ask ends at y≈428 at 375; no overflow at 320; JS off shows the lede, asks and counter and stacks the scenes; the slabs layer; the thesis title clears before the next; the tick previews its check; the wall names wrap at 375 with no collision; reduced motion shows 0 animations; `taste.py` passes.
- FALSE: part 5, "bars on a zero baseline… 400× is twice the length of 200×". This holds only on desktop with motion on. At 375 and under reduced motion every bar is full length.
- FALSE: part 11, "every target 44px or more". The 7 counter steps are 36×44 at 375 (38×44 on desktop).
- FALSE: part 4, "sticky ask in header and bar after the hero, same label". On the phone the header keeps "Try Hanzo" and no bar appears.
- MISLEADING: part 9 and the V2 line say "the commit stats roll in one at a time". They roll in broken (see 6).
- The false claims cap this page at 7. The broken stats and the phone bars take it to 6.

## Fixes (in order)
1. **Stats render.** In `Investors.css`, scope the label rule:
   - `.xin-stats span:first-child` → `.xin-stats a > span:first-child`.
   - Check that `.xin-stat-v` shows 78,421 / 1,263 / 1,733 / 5,125 / 3,617 on one line at 28–40px, at both sizes.
2. **Bars tell the truth at every size and under reduced motion.** Stop resetting the bars' transforms in the stacked mode. In both the `@media (max-width: 899px)` block and the `prefers-reduced-motion` block:
   - Change `.xin-pin-s * { transform: none !important }` to exclude the bars: `.xin-pin-s *:not(.xin-bars b):not(.xin-big-bar i)`.
   - Better: render the final `scaleX(v/max)` in CSS from a per-row custom property with an `xin-` prefix (e.g. `style={{'--xin-s': v/max}}` + `transform: scaleX(var(--xin-s))`), so the stacked, reduced-motion and JS-off states draw true lengths.
   - Do the same for the 200×/400× bars (0.5 and 1).
   - Re-measure: 93.7/93.1/91.4/80/80/78.3 of the track at 375, and 400× = 2 × 200×.
3. **Phone ask.** Make `usePhoneAsk` actually raise the "Contact investor relations" thumb bar after the hero ask leaves view (once the cookie card is answered). Or, if the header ask is the only one, have the phone header carry "Contact investor relations" as desktop does. "Try Hanzo" must not be the solid an investor sees from y=900 down.
4. **Counter step targets.** Make the 7 step buttons hit 44×44 at 375:
   - drop the `gap: 6px` on `.xin-roll-n` and give each `li` a `min-width: 44px`;
   - or wrap them two rows / let the 3px line sit inside a wider button.
5. **Press states on links.** Add `:active { transform: translateY(1px) }` (90 ms) to `.xin-slab`, `.xin-stats a`, `.xin-lead`, `.xin-commits a`, `.xin-wall a`, `.xin-dd-go` and `.xin-exec`. Give `.xin-gov-l a` a hover (`text-decoration-thickness: 2px`). Make `.xin-backed a:hover .xin-logo-n` actually reach #0a0a0a; it measured unchanged.
6. **Housekeeping.** Find the hydration mismatch behind the intermittent "1 Issue" badge (seen on the first desktop and phone loads). Drop `--acc: #1d1d1f` from `<main>` or use `#171717`. Correct the coverage card's parts 4, 5, 9 and 11, and the V2 line.
