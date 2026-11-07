# /mori — James-eye review (independent critic, 7 Nov, second pass)

Verdict: 7/10
First complaint: "I scroll to the next chapter and the picture goes black. There's just an empty box, then the thing draws itself in. And on my phone the words are cut off: 'Gaussian spla…', and 'Ambient occlusion' spills out of its tile."

How I walked it: Playwright, moving, at 1470×801 (fine-pointer hover enabled) and at 375×812. The cookie bar was dismissed and there is no loader on this route. On each half-screen of the wheel walk I took two frames 1 s apart, and I recorded video. I hovered and pressed the asks, links, rail, tabs, tiles, model cards and view chips, switched the viewport between wireframe, shaded and normals, dragged the mesh and used the arrow keys.

What the checks found:
- **Parity:** `parity.py /mori` is OK (text 52/52, links 4/4).
- **Layout shift:** CLS is 0.0007 on desktop (all from the shared header's tool cluster) and 0 on phone.
- **Scroll and overlap:** no horizontal scroll at 375. No overlap found at either size.
- **Console errors:** none from the page. The one console error is a hydration mismatch in the shared `FooterHTML`, which shows the red "1 Issue" badge (shared chrome). There are also font-preload warnings (shared).
- **A reload I did not cause:** once during the desktop walk the dev server reloaded the page. That is HMR from concurrent edits, not this page.
- Proof: `img/mori-clips.jpg`. The left side shows the phone canvas text clipping. The right side shows the desktop chapter pane resting empty while the rail still says 01.

## The 11 answers

1. **Does the first screen sell in 5 s, and does something move within 1 s?** Yes. The terrain film is full-bleed from the first frame. "Mori", the lede, the `3D` pill and the white "Request access" are all in by about 1 s. On phone it settles into the cube by itself after about 2 s, and "Build worlds, not just images." plus the ask then fit the first screen. One weak spot: halfway through the desktop settle (scrollY about 360) the screen is film only, with no words and no ask.
2. **One thing in, one thing out, or a document?** On desktop it is mostly one in, one out. The pinned film closes into a cube whose near edges draw in. Then come the pinned chapters, where one panel changes, then Fits, the map, the dark viewport, the cards and the Band. The flaw is in the chapter swap. The next pane wipes up about 20% of a chapter's run before the text changes, and its drawing only starts once the text changes. So at rest between chapters you get a black, empty pane under the old chapter's words (`desk` y=2166: the rail says 01 and the pane shows only a sliver of the sphere). The same thing gives a half environments, half icosahedron split at y=2888. On phone the chapters stack, as the rule allows.
3. **Does every section hold a real visual object?** Yes, and now each one is its own:
   - topology: a quad sphere drawing in by latitude, its poles closed by triangle fans;
   - materials: six lit material spheres;
   - environments: rooms rising on a metric grid;
   - export: the formats landing beside a turning icosahedron;
   - Fits: a camera scanning a cube;
   - the turning point-cloud viewport;
   - the creative cards and Hanzo's model cards.

   The film now belongs only to the hero and the cube. In the viewport, though, the left 40% of the room is empty black: the mesh sits at x≈64% with nothing to balance it.
4. **One ask, nothing floating? Does scale have rhythm?**
   - **Desktop: yes.** The page's "Request access" is the one solid until it leaves the screen, then the header carries a solid "Request access".
   - **Phone:** the header's sticky ask is still "Try Hanzo" (solid) once Mori's own ask has gone. The bottom ask bar briefly carries "Request access" at the viewport, while "Try Hanzo" also stays solid in the header. That is shared `Ask.jsx`, but it is what a phone visitor sees on this page.
   - **During arrival:** for about the first second, the header's solid "Try Hanzo" and the film's white "Request access" are both solid.
   - **Scale:** it has rhythm. The h1 is 112px as the moment, then 44px, then 26px section heads with 13px mono under them, and the Band headline is 88px.
5. **Does every hover and press answer, with no jumps?** Mostly.
   - The hero ask deepens from #0a0a0a to #262626 and presses at translateY(1px) scale(.98).
   - The arrow on "Try it in Design" moves 4px on hover.
   - Rail items go to ink and press at .97. View chips brighten their outline and press. Map tiles and model cards tilt about 3°.
   - In the Band, "Every model →" is 15px and moves its arrow, but "Research preview" sits beside it at 20.6px and only underlines. These two sibling links don't match. (`cr-band-note` in `Creative.jsx`.)
   - The Band's "Request access" goes from #f5f5f7 to #fff on hover, which is barely visible (kit `Band`).
   - The header ask fades to opacity .88 on hover, which is the banned "button that fades" (shared `Ask.jsx`).
   - There are no layout jumps.
6. **Overlap, font swap or layout shift?** None found at either size. The only shifts come from the shared header.
7. **Which reference does it feel like, and is its motion there?** The apple.com product page: a pinned hero that settles, pinned chapters where one panel changes, the product as the object. Its motion is really there. The page has:
   - a scroll-scrubbed settle;
   - the chapter wipe;
   - self-drawing canvases;
   - an orbit you can drag, with inertia;
   - a field tour that runs itself, with a gliding tab ink;
   - card tilt;
   - the Morph close X.

   Idle, pointer, state and arrival motion are all present, so scroll is well under half the page's motion.
8. **Is it different from its neighbours?** Better than before. Mori now owns the cube, five drawn objects and the viewport. The skeleton is still the creative family's: film hero settles into a shape, four chapters, Fits, map, demo room, model cards, Band. Someone clicking Iro, then Koma, then Mori will feel that.
9. **Are all 18 parts covered?** Largely. The page has:
   - one h1;
   - the header comment with Persona, Goal, CTA, Metric, Signature and Beyond;
   - `data-cta` and `data-thumb` on the ask;
   - the pause control on the film;
   - keyboard orbit (arrow keys) and radio-group modes with a 2px focus ring;
   - kit specs;
   - JSON-LD;
   - parity at 0 missing.

   These parts are weak:
   - **Part 6 (craft at 375):** text is clipped or overflows inside the canvases.
   - **Part 1 and Part 4 (phone):** the solid sticky ask is not the page's ask.
   - **Part 3 (alternate loud and quiet):** the white run of Fits, map and cards is mostly quiet.
10. **Any banned tells?** None that belong to the page. The header's fade on hover is shared. There is no hue: the viewport's radial `#121216` is near-neutral and `taste.py` allows it. Nothing sits above a headline, there is no gradient text and no Inter.
11. **Is the copy untouched?** Yes: parity is 52/52 text and 4/4 links. The HUD strings in the viewport are Hanzo's own.

## Fixes to reach 8

1. **Never rest on an empty chapter pane.** In `MoriCap`/`Draw`, start the incoming chapter's build when its wipe starts, not when `at` changes. Or let each canvas draw its settled final frame whenever it is not `on`, so the pane that wipes in is never black. The swap should read as one object replacing another, not black and then a redraw.
2. **Fix the phone canvas text.** In `exporter()` at narrow widths, the "3D Gaussian splats" chip runs off the pane. Measure the chip widths and start `fx` so the widest chip fits, or wrap that chip onto two rows. In `materials()`, "AMBIENT OCCLUSION" is wider than its tile at 375. Fit the label to the tile (smaller tracking, or two lines), or lay the six maps out as 2×3 on phone.
3. **Balance the dark viewport.** The left 40% of the room is empty at 1470. Either centre the mesh when nothing sits on the left, or put the room's own existing words (the specs or the caption) in that space.
4. **Make the Band's two closing links one pair.** They should be the same size and treatment, both with an arrow that moves on hover. Right now one is 15px and the other is 20.6px.
5. **Keep words on screen through the hero settle.** At about a half-screen of scroll on desktop, the frame is film only. Keep the h1 or the ask in view until the settled headline arrives, so no screen is wordless.
6. **Shared, request rather than edit:** the phone header's sticky ask should carry Mori's "Request access" (as desktop does), with only one solid at a time. The header ask needs a fill change instead of the opacity fade. The footer hydration mismatch needs fixing, because it raises the red badge on every page.
