# /benchmarks/* (template) — James-eye review

Ready: 7 Nov 21:50, held up next to /api and /affiliate (James's new bar, no score). Phone tables no longer break words (System column fixed, rest scrolls); 860px detail sheet; tableless chapters show runs as nested squares. taste/unique/parity OK on gpqa, fleet, kai-ag-news; 0 console errors, no overflow at 1470 and 375. Shared, not this template: FamChapters crossfade, FamNext three equal cards, consent card over hero.
Reviewed: 2026-11-07 16:35 UTC, members walked: `/benchmarks/gpqa` and `/benchmarks/fleet`, at 1470x801 and 375x812 (touch phone). How: filmed moving with `scripts/.cloud/motion.mjs` (`shots/benchmarks_gpqa/`, `shots/benchmarks_fleet/`). I also ran my own Playwright walks, saved in `/tmp/claude-0/critic-bench/outB/` (scripts `walkB.js`, `probeB.js`, `idleB.js`). They cover:
- shots at 150 ms, 1.15 s and 4 s, then screen by screen as I scroll;
- 18 s idle;
- a hover-diff on every control in `main`, and a press on the ask;
- opening the "Read more" sheet and pressing "Read the run";
- phone CLS over 15 s idle;
- JS off at both widths;
- reduced motion on the phone;
- `parity.py`.

Verdict: 5/10
First complaint: "Open it on my phone and the results table is broken: 'enso r… un', 'gpt- 5.6- sol run', one letter per line. That's the proof, and it looks like nobody checked it. And there's a red '1 Issue' badge sitting in the corner on every screen."

## The 11 answers
1. **Does it sell in 5 seconds, and does something move in 1 second?** Yes on desktop: the h1, the lede, the ask and the board with **enso 92.9%** are all in view. Within 1 s the h1 cuts in, a contour Sigil drifts and the bars grow. The hero figure now stays on Hanzo's own row for 18 s idle (fixed since the last review). On the phone you get the h1, lede, ask and the 92.9% figure, but the 203px cookie card and the red dev badge cover the figure on the first screen.
2. **One thing in, one thing out, or a document?** Still a document. Two problems:
   - **gpqa** prints the same 13 runs twice: the board's bars, then the full table in the pinned chapter. Around them sit a 4-column dataset strip, a pinned two-chapter stage, a black API room, three related cards, a link list, the Band and the footer.
   - **fleet** says 477 bytes and 455 MB four times: lede, board, results table and the lines inside the bars.
   
   The pinned chapter crossfade shows both chapters' text on top of each other mid-scroll ("What is measured" ghosting under "What this does not establish", gpqa s04). There are big empty bands: about 250px of white above "What is measured" (gpqa) and about 200px above "Results" (fleet). Together these read as gaps, not as rhythm.
3. **Does every section hold a real visual object?** No. The board, the table and the terminal are real. Three are not:
   - The honest-gaps chapter's object is a decorative contour card that prints its own heading again ("What this does not measure" appears twice on screen at once).
   - The three related cards are contour lines plus a title.
   - The API room's response pane is an empty black box with 130px or more of padding until you press play.
4. **One ask, nothing floating, and does scale have rhythm?**
   - **Desktop is right.** The header ask is quiet "Try Hanzo", then becomes a solid "Start on Hanzo Cloud" once the hero ask leaves.
   - **The phone is wrong.** A solid black "Try Hanzo" sits in the header next to a solid black "Start on Hanzo Cloud" in the hero: two fills and two labels in one viewport, and the header never swaps.
   - **Scale has rhythm.** The h1 is 44px, the figure 84px (gpqa) or 64px (fleet), and the mono labels 12px.
5. **Does every hover and press answer, with no jumps?** Press works everywhere: scale 0.98 and a darker fill, with no jump. Hover on a board row puts that row's value into the hero figure, which is good. These hovers are DEAD:
   - the "Benchmarks" breadcrumb;
   - the Table/Chart toggle (both pages);
   - the active "Accuracy" tab;
   - the chapter "— —" steps;
   - the second "+" note;
   - "LoCoMo · subject scope";
   - the fleet "601 bytes…" link;
   - "What a Dormant Agent Costs" (the second instance).
6. **Overlaps, a font swap or layout shift?** CLS is fine: 0.0037 and 0.0007 on desktop, 0 on the phone over 15 s idle. There is no font swap. The page is still broken in these places:
   - **The phone results table** squeezes the System column until names break by letter: "enso r/un", "enso-/ultra r/un", "gpt-/5.6-/sol run". On fleet, "dormant/agents/written per/second" takes four lines.
   - **The desktop table** wraps "184 of / 198" and "frontier · 2026- / 07-19" into two lines on every row.
   - **In the bars view** the value list overflows its column (696 in 686px), and the first rows' "92.9%" drops below the bar, between two rows.
   - **A hydration mismatch** puts Next's red "1 Issue" badge on screen on both members, at both widths.
   - **JS off, the fleet h1 is clipped to "What"** on the phone (the line-mask start state is in the HTML). gpqa is legible.
   - **The cookie card** sits over the hero figure on the phone and over the bars on desktop.
7. **Which reference does it feel like, and is its motion there?** It is the anthropic.com model launch, and the substance is right: Hanzo's figure is the hero, the method is in "Read more", and there is a "What this does not establish" chapter. The telling is not anthropic's. Anthropic sets one clean chart and a tidy table, then the caveats, quietly. Here the proof is a squeezed table, a repeated list and a decorative card. There is no figure that grows into the moment and settles, and the pinned stage is a crossfade between two text blocks.
8. **Different from its neighbours, with its own hero medium and signature?** Within the family, members differ only by data and Sigil seed, which is acceptable. The template's grammar is the site's common kit:
   - left text, right card, a pinned two-chapter stage;
   - a black API room;
   - three Sigil cards.
   
   The board (figure plus auto-cycling bars) is its only own signature.
9. **Are all 18 parts covered?** The gaps:
   - **Part 3:** the fleet h1 fails with JS off; there are dead bands.
   - **Part 4:** two solid fills on the phone, and the header label differs from the hero ask.
   - **Part 6:** the table does not stack or pin-scroll under 720px; it squeezes instead.
   - **Part 8:** dead hovers on the toggles and tabs.
   - **Part 11:** the phone table is broken.
   - **Part 17:** a console hydration error.
   
   What passes: reduced motion (0 running animations at 3.5 s), no horizontal page scroll, CLS, the press states, and the "Read more" sheet, which now clears the header.
10. **Any banned tells?** Yes:
   - three equal boxes in a row (the related cards);
   - a panel floating over content (the cookie card over the hero figure on the phone);
   - an explaining sentence on every pill ("+ What the router adds is…").
   
   No hues, no gradient text, no Inter.
11. **Is the copy untouched?** Yes. `parity.py`: gpqa text 110/110 and links 41/41; fleet text 59/59 and links 27/27.

## Fixes (ranked)
1. **Fix the results table on the phone and at 1470.**
   - Under 720px, stack each run as one block: name and tag on line 1, then accuracy (large), correct and cost in mono on line 2.
   - Or pin the System column and scroll the rest with a right-edge fade.
   - On desktop, give "Correct" and "Tag, date" `white-space:nowrap` and widen the card or drop the tag to a row detail. No cell should wrap.
2. **Kill the hydration mismatch** so the red "1 Issue" badge never shows, on both members and both widths.
3. **Fix the fleet h1 with JS off.** Apply the line-mask start state only under `html.js`, so the server HTML shows the whole h1. Check the 375 width, where it wraps to three lines.
4. **Say each figure once.** Drop the second full 13-row table from the gpqa chapter, or the bar list: the board's Table/Chart toggle already shows both. On fleet, keep 477 bytes and 455 MB in the board and the table only. Give the honest-gaps chapter a real object built from the page's own facts (the "a dash means…" rule, or the dataset strip), not a contour card that repeats the heading.
5. **Make the pinned chapters a cut, not a crossfade.** Line-mask the outgoing text out before the incoming text comes in, so there are never two paragraphs on screen at once. Label the "— —" steps ("Method / Gaps") and give them hover and focus states.
6. **Fix the bars view value column.** Reserve a fixed `ch` width for the value so "92.9%" never wraps under its bar.
7. **Phone ask.** Make the header ask quiet (outline) with the hero's label while the hero ask is on screen, and solid only after the hero ask leaves. Keep the cookie card off the hero figure: dock it below the first screen's figure, or defer it until the first scroll.
8. **Close the dead bands.** Remove the roughly 250px of white above the gpqa chapter and the roughly 200px above the fleet Results. In the API room, show the first lines of the transcribed response at rest, so the right pane is never an empty black box.
9. **Related rail.** Replace three equal Sigil cards with a 14 to 18% peek rail or two cards of different sizes. Each card should show its own hero number on hover (for example "LoCoMo-Conv: <figure>"). Fix the first card's left-pointing arrow. Align the "Related in runtime" block to the same 1152px edge as the rest (it stops at 1139).
10. **Make every dead hover answer:** the breadcrumb, the Table/Chart toggle, the active tab, the chapter steps, and "LoCoMo · subject scope".
