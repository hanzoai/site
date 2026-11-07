# /koe — James-eye review

Verdict: 7/10
First complaint: "It's the same wave over and over. The hero, all four chapters, the 'where it fits' panel and the cards are one film. As I scroll nothing new comes in, and once it settles I can't see a black button telling me what to do."

Walked: 7 Nov 2026, about 16:40 to 17:00 UTC. Playwright Chromium at deviceScaleFactor 1.
- **Desktop 1470×801:** recorded video, wheel-scrolled in 0.6-viewport steps with a dwell and an idle frame-diff on every screen (22 screens).
- **Phone 375×812:** isMobile with touch, 23 screens.
- **Spot checks:** 320×640, 375×667 and 768×1024 for overflow; reduced motion; JS off.
- **Interaction:** hovered and pressed the hero asks, header ask, preset chips and a model card. Tapped the Games map tab, pressed the demo's Pause and checked the clock stopped, ran a 16-stop Tab crawl, and sampled frame timing while scrolling.
- **Comparison:** the neighbours /oto and /uta, for variety.
- **Not counted:** the repo `motion.mjs` was queued behind other critics' jobs and stopped unrun, so these numbers come from my own Playwright walk.
- **Shared-chrome caveat:** other pages were being edited in parallel. On my first two loads (desktop and phone walks) a red Next.js "1 Issue" badge showed a hydration-attribute mismatch ("A tree hydrated but some attributes… didn't match"). It did not come back in 8 later loads, with or without video recording. I count it as intermittent and probably shared or HMR noise, not proven to come from /koe.

## The 11 answers
1. **Does it sell in 5 seconds, and does something move within 1 s? Yes on motion, partly on selling.**
   - At 300 ms the Koe film is already running full-bleed. By 1.0 s "Koe" (112px) cuts in with its lede and Request access.
   - About 1.1 s later the film closes into a tall capsule left of "Performance in every word." (44px). On phone it becomes a pill with a sweeping playhead and a 28-bar meter that keeps breathing (idle diff above 0 at rest).
   - The h1 "Koe" is no longer visible in the settled state. It is still in the DOM at 387px but covered by the settle, so the visible headline is an h2.
   - The settled first screen has **no solid fill**: hero "Request access" is outlined and the header shows outlined "Try Hanzo" (d-s01). The header only turns solid "Request access" once the hero copy is out of view.
   - At 375×812 after the settle, the hero ask sits at y≈501 at 375×667, under the 200px cookie card.
2. **One thing in, one out? Mostly yes, on desktop.**
   - The four capability chapters pin, and the copy and the 01–04 rail change one at a time (idle diffs 20–40k on every chapter screen). The booth then arrives as the one big object.
   - Then the rhythm sags. About 300px of empty white sits between the booth caption and "Where Koe fits" (d-s11), and about 250px above "Find your field" (d-s14, idle diff 0). Those screens read as a document pause, not a quiet room.
3. **Does every section hold a real object? Yes, but nearly every one is the same object.**
   - Real objects: the film, the pinned chapter panel, the booth canvas, the "Where Koe fits" panel, the map cards, Hanzo's model grid, and the Band.
   - Media audit: the only Koe asset is `/models/koe.webm` / `koe.webp`. It shows as the hero, all four chapter panels (the same continuous film, so the "panel that changes" barely changes), the "fits" panel, the map's Koe card and the model card. That is the same white wave on black about 8 times.
4. **One ask, nothing floating, scale rhythm? Partly.**
   - **Ask:** the header ask swaps between "Try Hanzo" (outlined on the settled hero, solid at load) and "Request access" (solid after the hero). So the one solid ask is not steady.
   - **Floating:** nothing floats over text on desktop. On phone, the film's pause disc floats at the right edge over empty white under the hero (p-s00).
   - **Scale:** it has rhythm. The h1 is 112px and settles to a 44px headline, chapter h3s are 44px, section heads 26px, fits h3 21px, mono captions 12px. The closing Band rises to 88px as the end moment.
5. **Does every hover and press answer, with no jumps? Not all.**
   - **Hero "Request access" hover:** only the border alpha changes, .08 to .18, which is close to dead. Press scales to 0.98. Good.
   - **"Try it in Design →" hover:** no measurable change in colour, border, background or transform. **Dead hover.** Press is translateY(1px).
   - **Header ask hover:** background #0a0a0a to about #313131, plus opacity .88 (partly a fade).
   - **What works:** preset chips go from #d4d4d4 to white text on hover, and clicking re-performs the waveform (aria-checked flips). The map tab pill glides to Games. Model card tilt matrix3d is about 2.4°. Demo Pause stops the clock (00:02.15 held for 800 ms).
6. **Overlaps, font swap or layout shift? Clean on layout, cropped at 320.**
   - CLS is 0.0015 on desktop (the header tools row) and 0 on phone. No horizontal scroll at 320, 375 or 768 (scrollWidth equals viewport all the way down).
   - At 320 the header's "Try Hanzo" is clipped by the right edge (w320.png). That is shared chrome, but it is on this page.
   - The phone map tabs wrap to 2 rows inside the grey pill ("Publishing / Design and space"), which looks broken.
   - The booth window carries a large soft drop shadow although it is a static tile (part 7: only floating things take a shadow).
7. **Which reference, and is its motion there? apple.com product page, partly.**
   - There: the pinned chapter stage, the product as the hero, and the film-to-capsule settle.
   - Not there: synchronized.studio card-to-page. Clicking a map card or model card navigates, and I saw no morph into /koe's own hero.
   - Headless frame timing while scrolling was median 33 ms and p95 150 ms (16 of 57 frames over 50 ms). That is software rendering, so treat it as a soft flag and not as proof of jank.
8. **Different from its neighbours? Weakly.**
   - /oto and /uta use the identical section list: stage, scene, caps, fits, map, mc, Band. Koe only moves the chapters ahead of the scene.
   - The hero trick (full-bleed film settling into a shape) is the family's shared move. Only the shape (capsule, jagged waveform, bars) and the demo differ.
   - The booth is a genuinely own signature. The rest is the template.
9. **Are all 18 parts covered? Mostly. Gaps listed below.**
10. **Any banned tells? None from MASTER 3.3 found.**
    - Checked and absent: hue, gradient text, Inter, a pill above a heading (the "VOICE" pill sits under the h1), and a cursor glow.
    - The header ask's .88 opacity on hover rides on a background change, so it is not a pure fade.
    - Watch-item: a big dead white gap and a dead hover come close to "lazy".
11. **Is the copy untouched? Yes.** `parity.py /koe` gives text 58/58 and links 4/4. "TTFT: 180ms", "< 200ms", "3.0s Clean Sample" and "Research preview" all trace to `content/live/koe.json`. `taste.py` passes on Koe.jsx and Koe.css.

**Motion kinds present (5):**
- Idle: the film, the phone pill meter, and the booth demo looping.
- Time: the phonemes lighting in step and the timecode.
- State: presets re-performing, the gliding tab pill, Pause.
- Pointer: model card tilt.
- Arrival: the h1 cut-in and the stage settle.

Scroll-linked effects (chapter pin, settle) are under half. This is the page's strongest side.

## Missing from the 18 parts
- **Part 1/4, one solid fill:** the settled first screen has none, and the header ask's label and weight flip between "Try Hanzo" and "Request access". The coverage card says the one solid fill is the header "Try Hanzo", but the walk shows it outlined on the settled hero and solid "Request access" further down.
- **Part 3, Morph:** no card-to-page open seen into or out of this page. The h1 does not stay the visible headline after the settle.
- **Part 7, surfaces:** the drop shadow on the static booth tile.
- **Part 8, control states:** the dead hover on "Try it in Design →" and the near-dead hover on the hero ask.
- **Part 10, media:** one asset repeated about 8 times. No block of 4+ *different* Koe visuals (the only 4+ block is the model grid of other models).
- **Part 11, mobile:** the map tabs wrap to two rows on phone, the pause disc floats over white, and the hero ask is hidden under the cookie card at 375×667.
- **Part 17, states:** the coverage card says reduced motion "shows the settled stage". The walk shows the full-bleed film state with "Koe" (rm-top). That is legible, but it is not what the card says.

## Fixes (in order)
1. **Stop repeating the one wave.**
   - Give each `.lv-ch.cr-caps` chapter its own panel state. Drive the film's `currentTime` to 4 distinct frames per chapter, or crop it (scale and object-position) so the four panels visibly differ.
   - Or replace a panel with a booth-derived object: a phoneme strip for viseme dubbing, two waveforms for cross-lingual cloning, a watermark line for likeness rights.
   - In `.cr-fits`, swap the tall koe film panel for the booth's waveform in miniature, or drop it, so Koe's wave appears at most 3 times.
2. **One steady solid ask.** On the settled hero, make `[data-cta="koe.hero"]` the solid fill (`<Cta kind="solid">`). Have the header show the quiet "Request access" from first paint (not "Try Hanzo"). Then have the header go solid once the hero ask leaves view, as part 4 describes. Never zero solid fills on a screen.
3. **Make every hover answer.**
   - `[data-cta="koe.hero-design"]`: on hover, move the arrow 4px to the right and add a 1px ink underline (offset 3px), 150 ms ease-out.
   - Hero quiet Cta: on hover, fill #f5f5f5 and set the border to black 18%, not just alpha.
4. **Close the dead white gaps.**
   - Cut the gap between the booth caption and `.cr-fits` heading to about 116px; it is about 300px now.
   - Cut the space above `.cr-map` "Find your field" to about 116px.
   - Move the "HANZO CREATIVE AI" / "IN PRODUCTION" mono captions under their headings per part 7. They float mid-row now.
5. **Keep the h1 visible.** After the settle, let "Koe" (h1) stay readable: for example, set it at 52px above "Performance in every word." beside the capsule, or render the settled headline as the h1's second line. Do not leave the h1 hidden behind the capsule.
6. **Phone.**
   - Let `.cr-map` tabs scroll horizontally in one row (`scroll-snap-type:x proximity`, 14–18% peek) instead of wrapping in the grey pill.
   - Dock the film pause disc to the settled pill's corner, not the free white at the right.
   - Make sure Request access clears the cookie card at 375×667 (y≈501 under a 200px card).
7. **Remove the drop shadow** on `.ko-booth`'s Studio window. A static tile gets a flat fill, per part 7.
8. **Add the Morph:** the map/model Koe card should open into the /koe hero film (600 ms, title within 12px of the h1), and the cards here should open into their pages.
9. **Shared, file a request:** fix the header ask clipping at 320px, and track down the intermittent hydration-attribute mismatch that raised the red "1 Issue" badge on two loads.
