# /sentinel/: James-eye review
Verdict: 8/10
First complaint: "That's alive now, the rain falling into one error is the moment. But on the phone the error title's two lines are sitting on top of each other, and the same error card shows up three times. By the end it's a repeat, not a payoff."

Walked 2026-11-07 16:36 UTC (run 3) on the dev server at 1470x801 and 375x812, moving.
## The 11 answers
1. Sells in 5 s and moves inside 1 s.
   - At 300 ms the h1 is already cutting in by line mask. Then the live issue card arrives: the events count ticks (4,350 to 4,457 across one scroll stop), the bar histogram grows, the top frame resolves from `main.3f9a.js:1:88213 · t.a()` to `checkout/cart.ts:42`, and the breadcrumbs step through.
   - The h1 still sits low: top 358px, bottom 418px (52% of 801, the target is 38%). The hero is 1,262px tall, so the card is cut at "exception" and nothing of the next section peeks.
   - Phone: h1 40px, lede and ask, then the card top, all inside 812px.
2. One in, one out: yes, all the way down now.
   - The signature works. In the black room the rain of events falls into one card and the count goes 1,026 → 8,016 → 10,000, ending on "1 issue".
   - Chapters 02 to 06 stack as sheets, and each one brings in a new object. Desktop walk: 12 of 13 stops moving (only the footer is still). Phone: 10 of 15 stops moving, and 4 of the 5 still ones are footer.
3. Real object in every section: trace waterfall, release bars with a cron dot strip, account rows, an alert router you can play with, the Sentry→Sentinel fork line, the closing issue card and the agent prompt.
4. Ask and scale.
   - Desktop: the header starts with a quiet "Try Hanzo" and switches to "Read the docs" once the hero ask leaves view. Nothing floats over content on desktop.
   - Phone: the header "Try Hanzo" is solid next to the hero's solid "Read the docs". This is shared chrome, already requested in docs/build-notes/requests/sentinel.md, so I have not scored it against this page.
   - Scale on desktop is mostly right: 52px h1, 26px chapter heads, 13-16px body. On the first screen, though, two 64px figures and a 32px card title sit next to the 52px h1, so the numbers outshout the name. On phone, the 40px h1 sits under a 3-line 32px card title and 64px figures.
5. Hover and press.
   - "Read the docs": #0a0a0a goes to #2c2c2e on hover, and press scales it to 0.98. "View on GitHub": the arrow moves 4px. Alert pills: #fff goes to #f2f2f2 on hover; a click sets #262626 and rewrites the sentence ("A spike goes to Slack and opens the ticket in Jira.").
   - Account rows (04): hover changes nothing. Background, transform and border are identical before and after.
   - Copy puts exactly the displayed prompt on the clipboard. No "Copied" state was visible at 150 or 300 ms.
6. Overlaps, shifts, errors.
   - Console: 0 errors on 4 of 4 cold loads, and no red badge (the run-2 hydration mismatch is gone). No horizontal scroll at 375. Phone: 0 targets under 44px.
   - Phone: the rain-room card title is set 26px on a 21.6px line height (0.83), so "properties / of undefined" collide (p-02).
   - Phone: the trace labels still wrap ("service / a", p-03).
   - Desktop, chapter 02: the sheet's bottom edge dissolves just under the profile row (about y=355 at scroll 3500), with no bottom corners. About 130px of empty white follows before sheet 03. It looks unfinished.
7. Reference: an apple.com product page (a pinned scrub, the product as hero) plus a self-running console. The rain-to-issue scrub is authored and is actually there.
8. Different from its neighbours: /search is a pinned chat panel and /stream is an offset rail, while Sentinel is a live error console with a rain scrub and stacked sheets. Yes.
9. 18 parts: not audited from source. Visible: one h1, a pause control on both movers (47px), copy matches the display, nothing above the h1. The closing has two endings back to back ("Get started with Hanzo Sentinel" then "Get Sentinel").
10. Banned tells: none seen. No hue, no gradient text. SENTRY.HANZO.AI is a caption below the h1, not above it.
11. Copy: `parity.py /sentinel` gives OK, text 29/29, links 3/3.

## Fixes (in order, polish)
1. Phone rain-room card title: line height of 1.1 or more (26px on 28.6px, as the closing card already does).
2. Give the closing band its own object, or the resolved state of the issue (for example "resolved", the fixed frame), rather than a third copy of the same TypeError card. Then the end pays off the rain instead of repeating it.
3. Close chapter 02's sheet properly: a real bottom edge and corners, sized to its content, and no 130px dead gap before 03.
4. Account rows: make hover tell you something (row fill to #f5f5f5 plus the environment pill going ink), with no layout jump.
5. Hero scale: settle the card figures below the h1 at rest (44px, counting up to 64 only while live), lift the h1 toward 38%, and let the next section peek 56px.
6. Phone trace labels on one line ("service a" at 12px mono or a narrower label column). Show a visible "Copied" state on the prompt copy.
