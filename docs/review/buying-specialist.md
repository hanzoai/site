# /buying-specialist — James-eye review

Verdict: 8/10
First complaint: "On the phone it's the same black price box again and again: the little bar card, then the full sheet, then a black card under every row. And the slider you can actually play with is a screen and a half down."

Walked 2026-11-07 16:56 UTC, HEAD ef3bd40e, at 1470x801 and 375x812 (isMobile, hasTouch). First screen captured at 0.2/1/3/6 s and again at 7.5/9 s idle, plus a reload. Scrolled the whole page in 400px (desktop wheel) and 300px (phone) steps with a 0.9 s pause, screenshotting each step. Hovered the header ask, the sheet's Start, chips and ledger rows. Dragged the seat slider and used the arrow keys on it. Clicked or tapped a suggestion chip with every non-GET request and every api.hanzo.ai request aborted. Also loaded the page with reduced motion and with JS off. `taste.py` OK (3 files), `parity.py` OK (text 20/20, links 1/1).

## What works
- The hero sells in under 3 s. The h1 cuts into its lines by 1 s. The black "Hanzo Team Configuration" sheet rises at about 1.5 s and then plays itself: seats sweep 50 → 25 → 4, the 100-dot seat grid fills and empties, and both prices roll. It was still moving at 9 s on desktop. This is a real product object, not decoration.
- The slider is real. Dragging it to 82 gives $1,640/mo annual and $2,050 monthly, and ArrowRight steps it to 83. Once you touch it, autoplay stops and does not take over again.
- Chips answer on hover (fill #fff → #f5f5f7, border goes ink) and press (scale 0.97). The ledger rows switch the pinned stage on hover and focus, and on phone tapping a row switches it.
- With the API blocked, a chip still produces a full, well-set answer (bold figures, nested lists, "Start Team Plan" and "Sales Question? Book at cal.com/hanzo →"). The sheet follows the chat to 10 members. The h1 stays in the DOM as an sr-only heading.
- Desktop "why" section: a sticky black stage on the left and a six-row ledger on the right. As you scroll, one row lights up and its matching scene (rates, seat bar, chat, sales hand-off, composer typing) replaces the previous one, with pips counting 1–6. That is a true one-in-one-out pinned stage.
- After the hero, the header ask becomes "Start Team Plan →" on desktop: one ask, in Hanzo's words, in the sticky header.
- No hue in the UI; computed colours in main are all neutral. No horizontal scroll at 375. Reduced motion settles on the final frame (10 members, $200/$250). With JS off, both sizes are legible and the full sheet is shown.

## The 11 answers
1. Yes. The h1 cut-in moves before 1 s, and the self-running configurator is the 5-second sell. On phone the mini bar card counts down and settles at about 6 s, which is within the "run once, then settle" rule.
2. On desktop, yes: hero, then a pinned stage where one panel changes, then the band. On phone, partly. The stage becomes a black card under each of the 6 rows, so it reads as row, card, row, card. That is one-in-one-out, but it is repetitive.
3. Yes. Hero: the configurator. Why: a scene per promise. Band: the ask.
4. Yes, one ask: the header swaps to "Start Team Plan →" on desktop, and the phone keeps "Try Hanzo". Nothing of the page's own floats over content. Scale is mostly rhythmic (52px h1, a large Air figure in the sheet, 17px rows). The closing band's 88px "The fastest path in." is the one big moment and is acceptable, but it is the largest type on the page, at the end.
5. Mostly. Chips, rows and the slider answer. On the sheet's "Start Team Plan →", hover only lifts the fill from #f5f5f7 to #fff: no transform, and nothing it tells you.
6. I saw no overlap, layout shift or font swap at either size. The desktop hero is tight at the fold: the composer sits at y 713–769 and the legal line at about y 793 of 801.
7. A mix of the Apple configurator (a product you size, with live prices) and the chat calm of chatgpt.com/business/enterprise. Apple's pinned scene is genuinely there on desktop.
8. Yes. A chat-first hero with a live seat sheet is its own medium and signature, unlike the neighbouring pricing and contact pages.
9. As far as is visible: one server-side h1, `data-cta` on the primaries, parity and taste pass, reduced motion and JS-off pass, no 375 overflow, and states for loading ("Finding the best plan for your team..."), answer and fallback. I could not check performance budgets or the coverage card from the walk.
10. None of the page's own. "SAVE 20% ANNUALLY" is a pill next to the sheet title, not above a headline. The ✦ avatar is a glyph in chat, not a heading. There are not 3 equal boxes: the hero chips are 2+1+1 and the ledger is 6 rows.
11. Yes. Parity is 20/20 text and 1/1 links. (The band repeats the first ledger line, "The fastest path in.", which I take to be Hanzo's own copy.)

Shared (not counted): the header "Try Hanzo" hover only drops opacity to 0.88, which is a "fades on hover" tell, but it lives in shared header chrome. The cookie banner covers the hero composer at both sizes until it is dismissed. A motion.dev reduced-motion console warning appears (informational). With JS off, the mini-bar fill shows full width even though the SSR inline style is `scaleX(0.1)`, which points to a shared no-JS transform reset. No page errors. The only console errors were the `ERR_FAILED` lines from requests I blocked.

## Fixes (in order)
1. Phone: cut the repeated black boxes. Either let the six ledger rows share one sticky scene card, the same way desktop's stage does (pinned, one panel changing), or show the per-row scene only for the active row. Bring the interactive slider up: let the mini card expand into the full sheet on tap, rather than placing the sheet a screen and a half below the composer.
2. Give the sheet's primary "Start Team Plan →" a hover that tells you something, such as the live total or a small arrow travel, plus a 1px or 0.98 press. Today it is a fill change only.
3. Desktop hero: lift the chat column by about 24px or tighten the chip gap, so the composer and "By continuing…" line are not pinned to the last 10px of the 801 viewport.
4. With reduced motion, show the sheet at full opacity on first paint rather than mid-fade at 0.4 s, and ask whoever owns the no-JS reset to exempt `.xbs-mini-bar b` so the JS-off bar shows 10%, not 100%.
