# /about — James-eye review

Verdict: 7/10
First complaint: "The frontier line draws itself and then the page just stops. Give it five seconds and nothing is alive any more. And where are the founders? Two big empty grey boxes with initials in them."

Walked 7 Nov 2026 16:39 UTC, HEAD cde7df43, at 1470x801 and 375x812 (isMobile, hasTouch). First screen filmed at 0.2/1/3/6/7 s with pixel diffs, plus a reload. Scrolled the whole page in 200px (desktop) and 160px (phone) notches with 0.7 s dwell. Hovered and pressed every control in `main`, toggled the four switches, opened and closed (Esc) a pillar tile dialog, switched the dark-room tabs, clicked the Zen list. Also ran reduced motion, JS off (desktop and phone), `taste.py` (OK) and `parity.py /about` (167/167 text, 36/36 links).

## What works
- The hero object is right for the page: a Pareto curve drawn 2014 to 2026 with Techstars '17 marked and the four axes (Intelligence, Speed, Deterministic safety, Equitable cost) fanning into one point. It tells the story, not decoration.
- The h1 cuts in by line mask; the curve starts drawing inside the first second (diff 1.7% by 1 s, 10% by 3 s).
- Pillar tiles each hold their own radar SVG; the tile opens a real dialog (focus goes to Close, Esc closes, focus returns to the tile).
- The four "pick two" switches actually toggle (`aria-checked` flips, the thumb moves).
- Figures (100+, $1B+, 2024) count up and render their true values with JS off and under reduced motion.
- The Zen of Hanzo is a proper pinned stage: list on the left, one numbered panel changing on the right with a progress hairline. One in, one out.
- A dark room (Verifiable code) with real commit rows; a block of 4 model media cards (Kai, Zen Multimodal, Hanzo Engine, Enso Router) on screen together.
- Header ask hands over cleanly: quiet "Try Hanzo" while the hero ask is visible, solid "Get Started" once it leaves. Primary press is scale 0.98.
- Monochrome throughout; no eyebrow above any h1/h2 (Zen Mono labels sit below headings). No horizontal scroll at either size. Reduced motion: 0 running animations, final state shown. JS off: everything legible.

## The 11 answers
1. Sells in 5 s: yes on desktop (h1, lede, Get Started, curve). Moves within 1 s: yes. But it goes dead: 6 s to 7 s pixel change is 0% at both sizes; after the draw nothing idles. On phone the curve is pushed below the lede and three links, so only its tail shows above the fold.
2. Mostly one in, one out: hero, pick-two, pillars, proof figures, founders, Zen stage, dark room, research, careers, band. The research list (papers) and the toggle row read more like a document.
3. Every section has an object, except the founders: two large contour placeholders with "AW" / "ZK", no portrait, staggered so a big blank area sits beside each. The weakest screen on the page.
4. One ask (Get Started, `data-cta="about.hero"`), in the sticky header after the hero. Nothing of the page floats over content (the cookie card is shared chrome). Scale has rhythm: 52px h1, 26px section heads, 64px+ figures only in the proof moment.
5. Primary changes fill and presses. Pillar tiles show no visible hover change on the tile (background, transform and shadow identical; only the + button). Text links in the pick-two row and "Read Our Full History" / "Customer Stories" show no hover change at all. Founder links underline. Zen list items darken on hover.
6. A 14px shift in the hero: at 0.2 s and 1 s the lede and asks sit at y=143/306, at 3 s at y=129/292 (desktop) as the h1 settles. No overlaps (the overlapping paragraphs measured in the Zen stage are the inactive stacked panels, hidden). No clipping at either size.
7. Feels like the anthropic.com launch story (figure as hero, the curve) with an apple-style pinned Zen stage. Both motions are present; no synchronized.studio card-to-page open from the model cards.
8. Different from neighbours: a drawn chart hero rather than a film or product UI. Own signature (the frontier curve, echoed again in Careers).
9. 18 parts: header/footer, one h1, one primary with `data-cta`/`data-thumb`, dialog, tabs, switches, stats, closing band all present. Phone first screen is h1 + lede + asks; the hero object misses the "80px+ of product" in 660px.
10. Banned tells: none seen. No hue, no gradient text, no pill above a headline, no 3 equal boxes (toggles are 4, pillars uneven 2-up, models 4).
11. Copy untouched: parity 167/167 text, 36/36 links.

Shared (not counted): one intermittent hydration-attribute mismatch on the very first cold load (no stack into About files; six further loads at desktop, phone and reduced motion had 0 console errors). A parse error naming `components/pages/BlogIndex.jsx` came from another page's concurrent edit.

## Fixes (in order)
1. Keep the first screen alive after the draw: let the frontier end-point breathe, or have the four axis lines drift/settle slowly toward the point on a loop, or a pointer-aware read-out along the curve (year under the cursor). Idle motion, not more scroll.
2. Founders: give the section a real object. Use real portraits if Hanzo has them; otherwise make the contour art earn it (it should react to pointer or draw in) and tighten the staggered layout so there is no dead half-screen beside each card.
3. Remove the 14px hero shift: reserve the h1 box from first paint so the lede and asks do not jump up as the cut-in settles.
4. Make every tap answer: pillar tiles need a hover change on the tile itself (a tilt to 2.5°, the radar redrawing, or the point moving), and the pick-two text links, "Read Our Full History" and "Customer Stories" need a visible hover (underline or arrow move).
5. Phone: bring part of the curve into the first 660px (put the curve above the secondary links, or shorten the hero gap) so the hero object is seen, not just its tail.
6. Optional: model cards could open into their pages (Morph) to bring the synchronized.studio moment in.
