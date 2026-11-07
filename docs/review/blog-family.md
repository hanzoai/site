# /blog/* (template) — James-eye review

Verdict: 7/10
First complaint: "For the first second there's no headline, just a back link and a black box. Then the middle turns into an essay: two whole chapters of plain text with nothing to look at."

Walked 2026-11-07 16:13–16:40 UTC, HEAD abcbf980, at 1470x801 and 375x812 (isMobile, touch). Pages: /blog/pareto-frontier/ and /blog/kai-decision-models/ in full, /blog/synthesis/ looked at. On each I took first-screen frames at 0.2/1/3/6 s plus a reload, scrolled the whole page in 180px wheel steps with a 0.7 s dwell, hovered and pressed the hero ask, clicked the code tabs and Copy, tapped the chart points and the phone chapter bar, and clicked a next-post card to check the Morph. I also checked reduced motion, JS off, and 320px width, and ran taste.py (OK) and parity.py (pareto 77/77, kai 110/110).

## What works
- The hero film breaks out of its rounded card into a full-bleed black room. On Kai that room carries four large figures (<1 ms, 0 tokens, $0.021, 32,768) with small captions. There is one big moment, and the rest is medium and small.
- Sticky chapter rail: a large `02 / 04` counter, "3 min left" counting down, and a dot track that fills. On phone it becomes a slim bar under the header that opens into the chapter list (tested). The reading-progress hairline sits in the header.
- The Pareto GPQA chart is a real object. Points answer hover and tap with a readout card ("Fable 5 82.8%… $14.95 per 1,000"). A source chip row sits under it.
- /blog/synthesis has a Game of Life demo you can run (Pause, Step, Glider, Clear, Turn counter). Each member gets its own hero art (ring film, stacked planes, contour lines), so the members don't look identical.
- Clicking a next-post card runs the Morph: the title flies into the destination h1, then the page settles. The card image scales to 1.04 on hover with no box jump.
- Hero ask hover changes the fill (#0a0a0a to #2c2c2e), and press scales to 0.98. The code tabs switch with aria-selected. Copy puts the displayed Python text on the clipboard exactly.
- Reduced motion shows the final state (h1 present, film paused on its poster, getAnimations() empty after 3 s). With JS off the phone page reads cleanly. There is no horizontal scroll at 320, 375 or 1470.

## The 11 answers
1. The page sells in 5 s, but nothing moves in the first second. Frames at 0.2 s and 1.0 s are pixel-identical at both sizes. The h1 sits translated 57px under its mask until hydration (about 1.0–1.2 s here), and the film starts about 1.2 s. On phone the film is below the fold, so the first screen is type only.
2. Mostly one-in-one-out at the top: hero, then the film room, then chapter 01. Mid-page it becomes a document. Pareto chapters 01 and 03 and Kai chapters 01 and 03 ("Limits") are text columns with only the rail moving.
3. No. The hero, film room, chart, code block, next cards and Band hold objects. The text-only chapters listed above have none.
4. The ask is in Hanzo's words ("Hanzo Gen", "How to use Kai") and the desktop header swaps to it once the hero ask leaves. On phone the header keeps "Try Hanzo" solid while the page's own ask sits outlined below it, so the page's ask loses. Scale has rhythm: 52px h1, 26px chapter heads, large figures only in the black room. The closing Band headline is the one oversized moment.
5. Mostly yes: ask, cards, tabs, chart points and the chapter bar all respond. The TOC counter lags: it showed "02 / 03 · Finished" while "03 Limits" was mid-screen.
6. No page overlaps. A red "1 Issue" dev badge appeared in two of five loads: a hydration mismatch in the shared `FooterHTML` (`dangerouslySetInnerHTML` differs), which is intermittent and not the template's own code. The closing Band headline breaks to a one-word last line at 1470 ("Start with the agent you / have").
7. It feels like an anthropic.com launch post (the figures as hero, the story in chapters) with an apple.com pinned film room. The synchronized.studio card-to-page Morph is actually there.
8. Yes. Each member differs by its hero art and its own object (chart, figures, Life demo), and the template differs from /blog index and the home page.
9. Not verified line by line. Parts 1, 3, 4, 6, 9, 10, 11, 12 and 14 showed evidence in the walk. I did not audit the rest.
10. No hue, no gradient text, no 3 equal boxes, no pill above an h1 (the meta line sits under the h1), and no fading buttons. The cookie card is shared chrome.
11. Copy is untouched (parity 0 missing on both).

## Fixes (in order)
1. Make the first second alive without waiting for hydration. Run the h1 line-mask cut-in as a CSS animation from first paint (keep `html:not(.js)` as the fallback) and start the film poster drifting immediately. On phone, pull 80px+ of the film into the first screen (there is about 140px of empty space above "Back to Blog").
2. Give each text-only chapter one object built from its own words. Examples: Pareto 01 as the better/cheaper/slower curve drawn as an SVG; Pareto 03 "Kai makes the small calls" with its 0.27 ms / $0.021 figures; Kai 01 as a decision-vs-generation strip; Kai 03 "Limits" as a 1,024 vs 32,768 bar. This keeps one-in-one-out going through the middle of the page.
3. On phone, use the page's ask in the header (as desktop already does) so "Try Hanzo" solid does not outrank "Hanzo Gen" or "How to use Kai".
4. Balance the closing Band headline so it never ends on one word, and make the chapter counter switch when a chapter's heading crosses the rail line, so it never reads "02 / 03 · Finished".
5. Route the intermittent footer hydration mismatch (`FooterHTML` innerHTML differs server/client) to the shared-chrome owner. It shows a red dev badge on this family.
