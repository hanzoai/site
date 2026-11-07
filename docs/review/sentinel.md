# /sentinel/: James-eye review
Verdict: 7/10
First complaint: "Top right says Try Hanzo, the big black button says Read the docs, and on the phone they're both shouting at once. Which one do you want me to press? And those stacked cards are heavy grey slabs with half of each one empty."

Walked 2026-11-07 (run 2) on the dev server at 1470x801 and 375x812, moving.
## The 11 answers
1. Sells in 5 s and moves inside 1 s.
   - h1 "Hanzo Sentinel" 52px beside a live issue card: the events count ticks (4,350 to 4,457 within one scroll stop), the frame resolves from `main.3f9a.js:1:88213 · t.a()` to `checkout/cart.ts:42`, and breadcrumbs step. Frames 300 ms and 1000 ms after load differ.
   - The h1 still sits low (top 358px, about 50% of 801, not 38%), and on desktop the card is cut at "exception" at the fold.
   - Phone: h1 40px at 168px; the ask and the top of the card are inside the first screen.
2. One in, one out: yes for the first half, then a document.
   - Signature: the black room's rain of events collapses into one issue card (1,026 to 8,016 to 10,000). It reads, and it is still moving 3 s after you stop.
   - Chapters 02 to 06 are five sticky sheets, all the same shape (heading left, object right, 560-600px tall). Still stops: desktop 5 of 14 (7, 8, 10, 12, 13), phone 6 of 15.
3. Real objects: yes in every section: trace waterfall, release bars with a cron strip, account rows, an alert router, a fork diagram, and the closing issue card with the agent prompt.
4. The ask is split. Scale has rhythm.
   - Desktop header at the top: "Try Hanzo" (quiet). The hero, closing band and later header say "Read the docs". The label in the header changes as you scroll.
   - Phone: the header "Try Hanzo" is a solid #0a0a0a fill, and so is the hero "Read the docs": 2 solid fills with 2 labels on the first screen. Then a bottom bar adds a third: "Read the docs".
   - Rain no longer crosses the left column copy on desktop (fixed since run 1).
   - Scale: 52px h1, 64px figures, 26px heads, 13-16px body. One big thing per screen.
5. Hover and press answer.
   - "Read the docs": #0a0a0a to #2c2c2e on hover, scale(.98) on press. "View on GitHub": the arrow moves 4px.
   - Alert pills now answer (hover fill #f2f2f2 plus ink border), and a click re-routes the sentence below.
   - Account rows (04): hover changes nothing (UL bg and transform unchanged).
   - Copy did not falsely say "Copied" when the clipboard was blocked. Phone: 0 targets under 44px.
6. Overlaps, shifts, errors.
   - CLS 0.0008. No horizontal scroll at 375.
   - Hydration mismatch on cold load in 1 of 5 loads, with the red "1 Issue" dev badge on screen (acc1.png). 4 loads were clean. This fails DONE item 3 while it can still happen.
   - Sheets: each one is 560px tall, but its content ends about 180px above the bottom (d-06 "Did this release make it worse"), under a 0 -30px 80px shadow. The peeled edges behind are grey slabs, not thin slivers.
   - Phone trace labels wrap ("service / a", p-03), and the issue card title sets "properties / of undefined" with the lines touching (p-02).
7. Reference: apple.com product page (a pinned scene, the product as hero) plus a self-running demo. The rain-to-issue scrub is authored and is the moment.
8. Different from its neighbours: own hero medium (a live error console) and own signature. Yes.
9. 18 parts: not audited from source. Visible gaps: part 4 (the sticky ask label), part 7 (literal `rgba`, `#fff` and shadow values in `Sentinel.css` lines 49 and 61; `.sn2-card` is both outlined and shadowed).
10. Banned tells: no hue, no gradient text, nothing above the h1 (SENTRY.HANZO.AI sits below as a caption). The closing card's soft white under-glow (`0 60px 160px` white) is close to a glow.
11. Copy: same words as run 1; no rewrite seen.

## Fixes (in order)
1. One ask. Put "Read the docs" in the header from the first frame at both widths (quiet while the hero ask is on screen, solid after it leaves), and on phone never show the header fill and the hero fill together. Drop the bottom bar if the header already carries it.
2. Lighten the stack. Size each sheet to its content (no 180px empty floor), cut the shadow to the deck's floating shadow or none, and let the stacked edges be 8-12px hairline slivers.
3. Break the sameness of chapters 02 to 06. Give at least two a different layout or a self-run (release bars drop on entry and settle; account rows light in order; the router plays one route by itself), so desktop stops 7 to 13 are not still.
4. Kill the intermittent hydration mismatch (find what renders differently on server and client on a cold load) so the red badge never shows.
5. Move literal colours and shadows in `Sentinel.css` to tokens; pick outline or shadow for `.sn2-card`, not both.
6. Phone polish: keep "service a" on one line (shorter label column or 12px mono), and give the card title line height 1.15+. Lift the desktop h1 toward 38% so the hero card ends above the fold.
