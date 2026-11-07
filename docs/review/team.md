# /team — James-eye review

Verdict: 6/10
First complaint: "The top is great, the little cursors doing the work. Then it's section after section of little boxes with a sentence under each. I lost the thread halfway down."

Walked 7 Nov at about 15:07 UTC, page file at `94b550d0` (`components/pages/TeamPage.jsx` and its css), on the preview of main plus branch heads with the shared system in. Filmed moving at 1470×801 and 375×812 (wheel and finger scroll, dwell on every screen, hover and press on desktop, taps on phone), plus reduced motion and JS off. Judged by `JAMES.md` and `MASTER.md` (Launch, §4.1). Stills: `review/team/desktop-walk.jpg`, `review/team/phone-walk.jpg`. This replaces the 6/10 review written before the shared system landed.

## What works
- The hero is the best on the Company pages. "The playground for humans + AI" on the left, the ask on the right (an 8/5 split), and below them the live Hanzo Team canvas, tilted and settling. Zoe, Dev and Qa's cursors walk one card from report to Done by themselves, with a Pause.
- The dark workflow room and the code-channel window are real product UI at a readable size: the #bugfix crew, the automated workflow ticking off, and the artifacts pane with the diff.
- Monochrome; `taste.py` passes; no labels over headlines. Scale has rhythm in most sections: h1 84px, section heads medium, UI text small. JS off: 0 of 104 text blocks hidden. Reduced motion: 0 running. Parity: text 242/242, links 20/20.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes: headline, lede, "Create your team", and the canvas starting its story as the curtain lifts.
2. **One in, one out, or a document?** The three pinned chapters do it. After them it turns into a document: the six handoffs ("Coding", "Support", "Email"…) each with a sentence, then a bento of six rooms each with a sentence, then the workflow room, the code window, leaders and the spec. Fifteen thousand pixels on desktop, twenty thousand on the phone.
3. **A real visual object in every section?** Mostly. But the chapter mocks are grey placeholder bars (the "Channels" panel is a list beside empty grey lines), and the six handoffs are text with two initials, so those screens look unfinished.
4. **One ask, sticky after the hero?** Yes, shared: the header's "Try Hanzo" at every width, and on the phone a slim "Create your team →" bar once the hero button has gone. Hero and close carry "Create your team" as the one page solid.
5. **Every hover and press answers, no jumps?** Not everywhere. Hovering the handoff tiles ("Email", "Release Ops"), the channel rows (#bugfix, #research, #finance), the code-window steps ("1. Code trace"…) and "Open →" changed nothing. Press on "Create your team" is .98.
6. **Overlaps, font swap, layout shift?** No swap or overlap. Layout shift on the phone is 0.020 (the board's columns widening, `xtm-col` / `xtm-card`) and 0.006 on desktop. Phone tap targets under 44px: Pause (36px), "Open →" (21px), "Open Hanzo Team" (22px).
7. **Which reference, is its motion there?** apple.com product page: the product as the hero, tilt-and-settle, pinned chapters. Yes for the top third.
8. **Different from neighbours?** Yes: a product-launch page with a live canvas, unlike the other Company pages.
9. **18 parts (MASTER §2)?** See the card check below.
10. **Banned tells?** Clutter: an explaining sentence under every tile, twice in a row (handoffs, then rooms).
11. **Copy untouched?** Yes (parity clean).

## Card check (`docs/coverage/team.md`)
- **Format.** Template format with 18 `Done here:` lines.
- **Part 11 is false.** "Every target 44px or more" and "Arrow links are 44px": Pause is 36px, "Open →" 21px and "Open Hanzo Team" 22px on the phone.
- **Part 13 is false.** "Transform and opacity only": the phone board widens its column (`1.7fr`), which moves layout (CLS 0.020).
- **Part 9 is false in part.** "Every control answers": the channel rows and code steps give no hover answer.
- **Verdict capped at 7.** It sits at 6 on its own merits.

## Fixes (in order)
1. **Make the middle a scene, not two lists.** Put the six handoffs in one pinned stage: the hero canvas stays, and each handoff plays on it in turn (the board card changes, the right person and agent light up), with the sentence beside it. One comes in as one goes out. The bento of rooms can then sit quieter: one big room at a time, the other five small.
2. **Replace the grey placeholder bars** in the chapter mocks with Hanzo's real channel content already on the page (the #bugfix thread, the PR line) so nothing looks unloaded.
3. **Every row and step answers.** Give the channel rows and code steps a hover state that previews their content (for example, the row fills and its crew's initials appear), plus a .98 press.
4. **No layout motion on the phone.** Widen the active column with a transform (scaleX on a backing, or a cross-fade between two fixed layouts) instead of animating `fr`, so CLS stays 0.
5. **Phone targets to 44px.** Pause, "Open →" and "Open Hanzo Team" (padding or an `::after` hit area).
