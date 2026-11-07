# /buying-specialist — James-eye review

Verdict: 7/10
First complaint: "The hero's lovely, then I scroll and the middle section is grey bars. It looks like a loading screen, not a product. And once I ask it something I get two price cards with different numbers and a wall of buttons. Which one am I meant to press?"

Walked 2026-11-07 16:28 UTC, HEAD 1a12c7f5, at 1470x801 and 375x812 (touch). Took idle frames at 0.2/1/3/6/7.5 s, scrolled the whole page in 200px wheel steps (300px on phone) with a 0.7 s dwell, and reloaded for a return visit. Hovered and pressed a chip and the primary ask. Clicked a chip on desktop and tapped one on phone, with all non-GET requests aborted so nothing was sent. Moved the seat slider by keyboard, typed in the composer without sending, and checked reduced motion and JS off. `taste.py`: OK. `parity.py`: 20/20 text, 1/1 links.

## What works
- The hero is alive without input. The seat sheet sweeps 10 → 50 → 10 by itself: 23% pixel change from 0.2 to 1 s and 25% from 1 to 3 s. The h1 cuts in by line. The 25-dot member grid, slider and both prices all move together.
- The seat slider is a real control. Arrow keys take it from 10 to 15 seats and update the members, annual and monthly prices, and the billed line live. The sheet stays sticky beside the chat as the thread grows.
- Chat works offline. With the API blocked, a chip still produces a full, formatted answer and a plan card, with no error state and no console error.
- The "why" section is a pinned stage. The list sits on the right with one active square marker, and the left panel changes as each item takes focus. This gives Apple-style one-in-one-out on desktop, and the stage stays sticky on phone too.
- Scale has rhythm. The h1 is 52px, the dark sheet is the one big object, the list rows are medium, and the black band's 88px line is the moment before the footer.
- Hover and press answer. Chip hover changes the fill, darkens the border and lifts 1px; press scales it to 0.975. The primary goes from #f5f5f7 to #fff on hover and scales to 0.98 on press. Nothing fades.
- Reduced motion shows the final state, with no animations running after 3 s. JS off is fully legible: h1, sheet at 10 seats and prices all render.
- No overlap, off-screen element or horizontal scroll at either size. No page console errors.

## The 11 answers
1. **Sells in 5 s; moves within 1 s:** Yes on desktop. The h1, a self-running price sheet and four prompt chips together say "configure and buy here". On phone, the compact "10 members $200/mo" strip moves, but the primary ask "Start Team Plan" is not on the first screen: it sits at y≈1687.
2. **One in, one out:** Mostly. The pinned stage swaps one panel at a time. Hero, stage and band are three distinct beats, not a document.
3. **A real visual object in every section:** Partly. The hero sheet is a real product UI. The stage's first panel (seat grid + $200) is real. The other panels I saw (chat bubbles, form fields) are flat grey skeleton bars that read as placeholders. The band has type only, which is fine for a closing band.
4. **One ask, sticky header, nothing floating; scale rhythm:** Mixed. The header ask says "Try Hanzo" at the top and changes to "Start Team Plan" once scrolled, so two labels compete for the same slot. The phone bottom ask bar is allowed by MASTER, but it covers the sheet's slider while you use it. After one chat answer, the first screen holds up to 8 asks: Continue with Hanzo Team, Book a Call, Start Personal/Team/Enterprise Plan, Sales Question, and the sheet's two. Scale rhythm is good.
5. **Every hover and press answers, no jumps:** Yes for the chips, the primary and the slider. A chip click scrolls you to the composer, so the question you just asked scrolls out of view (on phone as well).
6. **Overlaps, font swap, layout shift:** No overlaps. The annual and monthly price tiles are misaligned by about 12px: "ANNUAL RATE (RECOMMENDED)" wraps to two lines, so $200 sits lower than $250. At 801px the sheet runs past the fold, and "Start Enterprise Plan" is cut at the bottom edge. Shared (not counted): the cookie card covers the hero ask and composer on first visit.
7. **Reference and its motion:** It feels like the apple.com product page (a configurator with a sticky price) and the chatgpt.com enterprise page (calm list of promises). The pinned scene is there. The scrubbed or count-up moment is the hero's idle seat sweep, and it is good.
8. **Different from neighbours:** Yes. The hero medium is a live chat plus seat configurator, and the signature is the self-sweeping seat grid. Nothing else on the site looks like it.
9. **18 parts:** Mostly covered: one h1, `data-cta` on the primary, Privacy link by the composer, reduced motion and JS off pass, chat failure falls back gracefully. Gaps: the primary is not above the fold on phone (Part 4 and Part 11), the header ask label does not match the hero ask (Part 4), and the in-chat plan card duplicates the sheet in a different style (Part 7).
10. **Banned tells:** After a chat answer, the follow-up row "Start Personal Plan / Start Team Plan / Start Enterprise Plan" is 3 equal pill buttons in a row. The square list markers look like unchecked browser checkboxes. No hue: monochrome only, taste passes. No gradient text, no pill above an h1 or h2. "SAVE 20% ANNUALLY" sits under a card title, not above a headline.
11. **Copy untouched:** Parity is 20/20 text and 1/1 links. Question for James: the Enterprise card shows "SAVE 20% ANNUALLY" while the annual and monthly rates are both $400/mo.

Shared (not counted): the cookie card covers the hero ask on first visit. The "1 Issue" hydration badge seen on phone is a test artifact: the diff is `caret-color: transparent` on `#xbs-ask`, which Playwright's screenshot injects mid-load. It did not appear on 5 clean loads.

## Fixes (in order)
1. Replace the grey skeleton panels in the pinned stage with real renders of the page's own UI: the actual chat bubbles with a real answer line, the actual plan card, and the actual seat sheet. The first panel (seat grid + $200) shows the standard.
2. Make the chat's plan card and the side sheet one object. When an answer proposes a plan, drive the sticky sheet to that seat count and plan instead of printing a second, differently styled card (light tiles, bold mono numerals) with different numbers beside it.
3. Cut the post-answer ask pile to one solid ask and one text link. Fold "Start Personal/Team/Enterprise Plan" (3 equal pills) and "Sales Question?" into a single quiet secondary row, or hand them to the sheet.
4. Phone: put "Start Team Plan" on the first screen. Make the compact seat strip carry the ask, or show the hero ask under the lede. Keep the bottom bar from covering the slider while the slider is in view.
5. Use one header ask label: the hero's "Start Team Plan" from the top, not "Try Hanzo" then a swap.
6. Align the rate tiles. Give both labels the same line box, or keep "(RECOMMENDED)" on one line, so $200 and $250 share a baseline. Trim the sheet's padding so "Start Enterprise Plan" clears the fold at 801px.
7. After a chip click, keep the user's question in view: scroll to the new message, not the composer.
8. Draw the list markers as solid ink dots or a line that grows, not hollow squares that read as checkboxes.
