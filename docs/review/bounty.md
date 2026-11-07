# /bounty — James-eye review

Verdict: 8/10
First complaint: "On my phone the button up top still says Try Hanzo, and the live bounty list is under the fold, so the first screen is just words and a black button."

Walked 2026-11-07 16:45 UTC, HEAD 10953462, at 1470x801 and 375x812 (isMobile, touch). First screen captured at 0.2/1/3/6 s plus a reload; scrolled the whole page in 400px wheel notches (300px on phone) with about 1 s dwell; hovered and pressed every link, stepper, issue row and the awards rail; reduced motion and JS off checked; console, page errors and failed requests collected. Live GitHub answered in this run (the count went 9 to 10), so the snapshot-to-live swap was seen as well.

## What works
- The hero object is a live "Open bounties" card that runs by itself: rows cycle in with a highlighted current row within about 1 s (the 1 s to 3 s frame diff is about 10% on desktop), real issue titles, repo#number and "starter" tags. The count updates when GitHub answers, and nothing jumps.
- Rewards are four cards in a 2x2 grid of unequal widths (not 3 equal boxes). The figures count up (+49 rolls to +50), and each card has a stepper. Together they drive a black result strip ("240 – 640 PTS", "+$65 AI credits") with a rank rail (#3/#2/#1). That is a real "Beyond" aid built from the page's own numbers, and every −/+ press changed it.
- The standings are big Air figures (1,510 / 192 / 252) on hairline rows. The "Recent verified bug reports & awards" rail is a stacked card whose 3 tabs switch it (aria-pressed moves correctly).
- The dark token leaderboard counts 0 up to 106,039,884 as it is reached, and the neutral bars draw in. It is the one black room, entered at the right moment.
- "How a bounty is taken" is a pinned stage: the issue card stays, the three steps tick on in turn, and the header turns ink on the last step. One thing changes while the rest holds.
- The closing band repeats the h1 and the one ask, centred, as the brief says.
- On desktop the header ask swaps to "Every open bounty" once the hero ask leaves, so there is one solid fill per viewport. Primary press is scale 0.98; hover darkens the fill and is not an opacity fade. Issue rows fill #f2f2f2 on hover.
- No console errors, no page errors, no hydration warning from page files, no horizontal scroll at either size. taste.py OK (2 files). parity: text 102/102, links 5/5.
- Reduced motion shows final values (106,039,884, all steps ticked). With JS off the page is fully legible: the snapshot list, all 3 awards stacked and the steps listed.

## The 11 answers
1. Desktop: yes. The h1, lede and ask read at once, and the live list is moving by 1 s. Phone: the h1 and ask sell, but the live card starts at about y 510 and the shared cookie sheet covers it, so the moving thing is barely on screen.
2. Mostly one-in-one-out: count-ups and draws on entry, a pinned steps stage, and a rail. The standings list and the h2-left/lede-right head repeated on each section edge toward a document in places.
3. Yes: live issue list, reward cards with calculator, standings figures, awards rail, bar leaderboard, steps stage, band.
4. One ask ("Every open bounty") in Hanzo's words. On desktop it moves into the sticky header. On phone the header keeps "Try Hanzo" (solid once scrolled), so the phone has two asks. Nothing page-owned floats over content. Scale has rhythm: 52px h1, 64px-class figures one per screen, 26px h2, small mono.
5. Yes. Every stepper, rail tab, row and link answered, and the primary pressed to 0.98. No jumps seen.
6. No overlap, font swap or layout shift seen at 1470x801 or 375x812. One small wrap: on phone the card's status dot sits on its own line above "Bounties & Rewards".
7. Apple product page (pinned scrubbed steps, figures as heroes) plus the calm of chatgpt enterprise in the standings. The pin and the count-ups are really there.
8. Yes. The hero medium is a live issue feed, and the signature is the reward calculator plus the pinned "take an issue" stage. Nothing here matches the home, pricing or developer heroes.
9. Largely covered (states: snapshot fallback, live, reduced motion, no-JS; a11y aria-pressed; mobile stacks). No gap was visible in the walk.
10. None seen. No hue (taste OK), no gradient text, no eyebrow above an h1 or h2 (the mono label sits inside the card header), no 3 equal boxes, no fade-on-hover. The leaderboard bars use a grey-to-white neutral sheen, which is not a hue.
11. Untouched (parity 102/102, 5/5).

Shared (not counted): the cookie consent sheet covers the bottom of every first screen (on phone about 40% of the viewport). The header's frosted fade band. The font preload warnings.

## Fixes (in order)
1. Phone: make the sticky header ask "Every open bounty" once the hero ask scrolls away, as on desktop. Right now the phone shows "Try Hanzo" solid next to the page's own ask.
2. Phone: move the live "Open bounties" card higher, or shorten the lede and ask block, so at least two cycling rows are on the first screen at 375x812.
3. Phone: keep the status dot inline with the "Bounties & Rewards" label in the card header (it wraps onto its own line).
4. Optional polish: the stretch between the result strip and "Top bug hunters & contributors" is about 350px of empty paper on desktop. Let the standings figures count up or rise as they arrive, so that screen has an entry moment.
