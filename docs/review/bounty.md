# /bounty — James-eye review

Reviewed: main, page files at `c2fa6e5`. Walked moving at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped). The desktop film was lost to a second tab the walk opened; desktop is judged from the dwell screenshots and the motion log.

Note (7 Nov 14:12): a hydration error seen in the first walks came from the shared shell and is gone on main; it is not counted against this page. Text is now legible with JavaScript off (shared fix at 14:05, re-checked).

Verdict: 6/10

First complaint: "Green tags, green dots, a purple dot, and a green label sitting on the headline. Hanzo is black and white. And once the list loads, the first screen just sits there."

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** It sells: "Take an issue. Ship the fix." beside a real list of Hanzo's open GitHub bounties is the right object. Something moves in the first second (headline cut-in, the list arriving), then the first screen goes still (0.04% change over 4 s on desktop, 0.14% on phone). On the phone the list starts below the buttons.
2. **One in, one out?** Partly. The rewards tiles and the dark token race (bars race out as you scroll) are good scenes. "Recent verified bug reports & awards" and "How a bounty is taken" read as a document: a list of sentences, then a timeline of sentences.
3. **A real object in every section?** Hero (live list), podium with "How #1 adds up", token race: yes. The awards list and the propose-a-bounty card are text only.
4. **One ask, sticky after the hero?** Yes on desktop: a floating bar with "Every open bounty" follows you, and the header's "Try Hanzo" turns outlined after the hero. That is the right pattern. On the phone, header "Try Hanzo" stays solid beside the bottom bar.
5. **Every hover and press answers?** Hovers answer on the ask and the text links. No press state on "Every open bounty" or "Leaderboard".
6. **Overlap, font swap, layout shift?** No overlap, no sideways scroll. Layout shift 0.022 on desktop, 0 on phone.
7. **Which reference, and is its motion there?** anthropic.com launch (a hero figure, "1,510 pts", with how it adds up) and the scrubbed token race. Both are there.
8. **Different from its neighbours?** Yes: live GitHub list, podium, race.
9. **All 18 parts covered?** See below. No `docs/coverage/bounty.md`.
10. **Banned tells?** Yes:
    - Eyebrow above the h1 ("• BOUNTIES & REWARDS", green dot, mono caps).
    - **Green** UI: issue dots, "starter" chips, "+50 pts · +$20 AI credits" lines, the arrows on text links, the live dot. Purple on the "Merged" step. JAMES.md allows 0 UI hues and bans green outright.
11. **Copy untouched?** Yes: parity 102/102 text, 5/5 links. The issue titles and "starter" labels are live GitHub data.

## Missing from the 18 parts (PLAN-COMPONENTS 2.1–2.18, measured)
- **2.6 Content:** 10 pieces of text at 13px on the page (request counts, meta).
- **2.4 / 2.18:** 0 `data-cta`; no press states.

## Fixes
1. Remove "• BOUNTIES & REWARDS" from above the h1.
2. Take every green and purple out: dots, chips, points, arrows and the timeline go to ink and greys (weight or a filled ink dot can say "open" / "merged").
3. Give the first screen one quiet idle move after it loads (for example the newest bounty arriving at the top, once).
4. Turn the awards list and the "How a bounty is taken" steps into one object each (a pinned step that changes, or the PR itself), so they stop reading as paragraphs.
5. Add a press state (scale 0.98 or 1px down) to "Every open bounty".
