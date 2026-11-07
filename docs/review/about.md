# /about — James-eye review

Verdict: 7/10
Held (8 Nov, copy rule): the 8 Nov design pass is in (see git log), but James's copycheck run found 29 of 146 live lines missing, so not Ready until `copycheck.mjs /about` says missing 0.
First complaint: "The 'why we build' screen gives me a chart, four switches and six cards all at once, and half of them say the same thing. That's the overload I talked about. One thing comes in, one goes out."

Walked 2026-11-07 17:10 UTC, HEAD 2e1b77aa, at 1470x801 and 375x812 (isMobile, hasTouch). First screen captured at 0.2, 1, 3, 6 and 7 s plus a reload. Scrolled the whole page in 160px wheel notches with a screenshot every ~0.6 screen. Hovered, pressed and clicked the hero ask, the hero chart, 4 switches, 6 principle tiles (sheet, Esc), the Zen rows, the dark-room tabs, the runtime cards, the paper rows, the founder plates and the band ask. Tapped the same on phone. Also checked reduced motion and JS off. taste.py OK (3 files), parity 167/167 text and 36/36 links. 0 console errors and 0 page errors on either size (only canvas readback and font-preload warnings). No horizontal scroll.

## What works
- The hero is a real idea: the Pareto curve draws 2014 to 2026 under the h1 while the h1 cuts in by line. Pixels change 2.4% from 0.2 to 1 s and 6.8% from 1 to 3 s. After that, a pulsing endpoint and a marker gliding along the curve keep it alive at rest. A pointer over the chart scrubs a year readout ("2022"). A pause control sits beside it.
- Every control answers with a state change. Switches redraw the radar (Affordable cost on turns it from a triangle into a kite). The principle tiles open a sheet with its own hexagon, "03 / 06" paging and Esc to close. The Zen rows swap the big numbered panel and run a progress hairline. The dark-room tabs swap content. Runtime cards tilt about 2°. The hero ask hovers darker (no fade) and presses to scale 0.98.
- The Zen of Hanzo is a proper pinned stage: one panel changes as you scroll (apple.com). This is the page's best moment.
- Four real Hanzo renders sit together in Models & Runtimes (Kai, Zen, Enso). The commit log in the black room is a real object.
- Rooms alternate well: paper, then a black rounded room that opens to the gutters, then paper, then a black band. Eyebrows sit under headings, never above them. Reduced motion shows the drawn curve and the final state with `getAnimations()` empty. JS off is fully legible at both sizes.

## The 11 answers
1. Sells in 5 s: yes, h1 + lede + Get Started + the frontier chart. Something moves inside 1 s without input: yes, the curve draws and the h1 cuts in.
2. One-in-one-out: mostly. The Zen stage and the stats are paced. "Why we build" is three objects in one screen (radar, 4 switches with link rows, 6 tiles). The tiles repeat the switch links (Frontier Performance, Equitable Access, Ownership & Sovereignty). Phone is 15,400px, about 19 screens. The papers list and commit log read as a document there.
3. Real object per section: yes. Chart, radar, figures, founder plates (Sigil contours), Zen panel, commit log, renders, careers curve.
4. One ask: Get Started in the hero, mirrored as the header ask once it scrolls past (outlined "Try Hanzo" before that). Nothing floats except the shared cookie card. Scale has rhythm: 52px h1, 26px sections, big Air figures one at a time, 112px "100+" as the single big one. In the closing band, the header's solid Get Started and the band's solid Explore Open Roles share one viewport.
5. Hover and press: all answer, with no layout jump seen. Founder plate hover only lifts the initials 4px and darkens the contour, which is thin but present.
6. Overlaps and shift: desktop is clean. Phone hero chart: the curve runs through the "'17" of "Techstars '17". "Equitable cost" runs into the endpoint halo. "Deterministic safety" overruns the chart's right edge to x≈363 of 375. No font swap and no CLS were seen.
7. Reference: osply/hamol editorial split heads, the apple.com pinned stage (Zen), anthropic-style figures. The motion for each is actually there.
8. Different from neighbours: yes. A drawn Pareto curve hero, a radar with switches, and a pinned principle stage. No home-hero trick reused.
9. 18 parts: the visible ones are covered (one h1, data-cta on hero and band, Cta states, sheet, tabs, pause control, room rules, reduced motion, JS off). Not every part is verifiable from the browser. The sheet is a div, not a native `<dialog>` (Esc works, but it is not `:modal`).
10. Banned tells: none found. No hue, no kicker over a headline, no gradient text, no fading buttons. The 4 runtime cards are 4, not 3. The careers list is rows, not boxes.
11. Copy: untouched per parity (167/167, 36/36).

Shared (not counted): the cookie card covers the hero ask and roughly a quarter of every phone screen until dismissed. The glass header shows ghosted text under it. The x-btn hover fill is #2c2c2e / #f5f5f7.

## Fixes (in order)
1. Split "Why we build" into one idea per screen. Let the radar and switches be the one object. Move the six principle tiles to their own beat, or merge them into the switch rows so the same names do not appear twice. On phone, stack the switches one per row: the 2-column switch grid wraps "Control / over / your data" into 3 lines and orphans the "→" of "Ownership & Sovereignty".
2. Phone hero chart labels (`components/pages/About.jsx` hero chart, `About.css` `@media (max-width: 899px)`): move "Techstars '17" off the curve, pull "Equitable cost" clear of the endpoint halo, and keep "Deterministic safety" inside the plot width (right-anchor it or set it shorter on two lines).
3. Phone length: 19 screens is a document. Collapse the papers list to 2 rows plus "Papers →" on phone, and cap the commit log at 3 rows there. The detail can live behind the links that already exist.
4. Closing band: make the header ask quiet while the band's solid "Explore Open Roles" is in view, so there is one solid fill per viewport.
5. "Built with founders" (desktop y≈1280–1700): the staggered figures leave about 400px of empty white under the heading before 94+ arrives. Tighten the stagger so the first figure is in view with the heading.
6. Minor: founder plate reveal (`.xab-pic.none` clip-path circle on `view()`) leaves the lower ZK plate visibly sliced at the top-right if you stop scrolling mid-range. Finish the range earlier (for example `cover 30%`). The principle sheet should be a native `<dialog>.showModal()`.
