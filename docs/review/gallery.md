# /gallery: James-eye review

Verdict: 5/10
First complaint: "It's called Gallery and there's nothing hanging in it. Six frames of the same grey contour lines, no template, no app, not even the Zen card Hanzo already has on this page. The light that's meant to walk the wall, I can only see it on the two black frames. On my phone I get a title, two buttons and a label card, and then nothing moves."

Reviewed: branch `claude/youthful-gauss-hiiqm9` @ `14f1655`. The page files last changed in `30e721f` (Rhythm: h1 rests at 52px). Files hash (Gallery.jsx + Gallery.css + page.jsx): `a71c23c2344d`.
Walked 7 Nov 14:22–14:56 UTC on the dev server, moving, at 1470×801 and 375×812. I used screencasts, frame-difference logs, hover and press probes with a fine-pointer Chromium, a layout-shift observer, JS off, reduced motion, and 320 and 375 widths. The cookie note was skipped.
- **The page and the standard changed during the walk.** The page went from `955c559` to `14f1655`: the h1 dropped from 191px to 52px, the hero copy no longer starts at opacity 0, and the h1 cut-in became CSS. The shared ask bar also changed. `JAMES.md` changed at 14:41 ("scale has rhythm", "nothing floats over content").
- **Every finding below was re-checked on `14f1655`.** Findings that the later commits fixed are left out.

Proof: `img/gallery.jpg` (desktop first screen | phone first screen, at `30e721f`/`14f1655`).

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?**
   - **Desktop, motion:** yes. The 52px "Gallery" cuts in at first paint (0.5–1.3s). After that, the contour pictures drift and the spotlight steps every 2.6s.
   - **Desktop, selling:** not as a template showcase. Every frame holds a generative contour map, not a template.
   - **Desktop, the walk:** half of the 15.6s cycle is spent on frames 04–06, which are below the fold at 801. The plaque heading is cut by the fold at y≈790, and the counter ("0X / 06") sits under it.
   - **Desktop, the light:** on the light frames it barely shows. Measured mean luminance, lit against unlit:

     | Frames | Change (out of 255) |
     |---|---|
     | 01, 03, 05, 06 (light) | +2 to +4: invisible |
     | 02, 04 (black) | +35 to +45: visible |

     On the first screen that leaves one frame, 02, where you can see the signature.
   - **Phone:** the first screen holds the title, the URL, the lede, two stacked buttons and the "Get Gallery" label card with its "Deploy to Cloud" button. No frame shows. After the 2.8s arrival nothing moves: frame difference is 0 from 2.8s to 10s. The spotlight walks frames below the fold.
2. **One in, one out, or a document?** A document after the wall.
   - The wall's Settle (scale 1.04 to 1, 30px lift) is the only scroll move.
   - The rest is three equal white cards, a prompt box that types once, and a dark close of type and two buttons.
   - Nothing pins and nothing leaves as the next thing arrives. Below the hero no heading cuts in.
3. **A real object in every section?**
   - **Wall:** yes as an object, the asymmetric hang, but its pictures are Sigil contours in two looks: grey on white, and white on black. The viewer opens to the same map, larger.
   - **No Hanzo media anywhere.** The live page's "Start from a Working App" is Hanzo's black Zen model card (`/models/zen.webp`; `zen.webm` is in `public/models`). The rebuild made it a text plaque, so the page lost its only real Hanzo media and is grey from top to bottom (JAMES 6 and 11).
   - **Moves:** 112px mono "01 / 02 / 03" over 17px titles. That is type, not an object.
   - **Paste:** the prompt box, a light object.
   - **Close:** nothing. At `14f1655` it is a full-width black room holding a 26px heading, one line and two buttons.
4. **One ask in the sticky header, nothing floating, scale with rhythm?**
   - **The ask:** yes.
     - "Browse the Gallery" is solid in the hero, with `data-thumb` and `data-cta="gallery.hero"`.
     - The header's "Try Hanzo" turns to an outline while it is in view.
     - The shared bar carries "Browse the Gallery" from y≈720 at both widths.
     - In the close the header steps aside while the band's same-words button is on screen, so there is one solid on screen (checked at 1470 and 375).
   - **Floating:** the frames set `data-cursor="View"`. Per `Cursor.jsx:17` that wins even on a button, so a label rides beside the pointer over the frames and their captions. MASTER 3.3 bans this.
   - **Shared bar (not this page's fault, but it lands on this page):** on desktop it is a pill floating at bottom centre, which 3.3 now bans. On phone, at y≈1460 it covers the "Fork it" title of card 01.
   - **Scale:** fixed in `30e721f`. The h1 rests at 52px and the wall is the big thing on the first screen. The moves then repeat one big thing three times (three 112px numerals in a row), and the close has no big thing at all.
5. **Every hover and press answers, no jumps?** Mostly.

   | Element | Hover | Press |
   |---|---|---|
   | Hero ask | fill #0a0a0b → #2c2c2e, arrow nudges 3px, magnetic pull about 5px | .98 |
   | Ghost buttons | 4% veil and ink border | .98 |
   | Frames | holds the light, deepens the shadow, scales the picture 1.025 | none ✗ |
   | "hanzoai" | none, and no underline, so it does not read as a link ✗ | none ✗ |
   | Move links | arrow nudges 4px | none ✗ |
   | Viewer arrows | border 8% → 20% | .94 |

   - **Opening a frame** is a 600ms morph into the viewer. ← → and Esc work, Tab stays inside, and focus returns to the frame.
   - **Closing after stepping jumps (filmed).** After ← or →:
     1. Two titles show as a see-through double image over the wall.
     2. Frame 02 leaves a hole.
     3. Frame 02 pops in oversized over frames 01 and 03.
     4. It flies back into place.
   - **The viewer is a dead end:** it shows the same sentence and offers no link onward.
6. **Overlap, font swap, layout shift?**
   - There is no static overlap, the h1 box holds, and nothing scrolls sideways at 320 or 375.
   - **The typed prompt resizes its box and moves the close and the footer while they are on screen:**

     | Width | Box height while typing | Layout shift |
     |---|---|---|
     | Phone | 224 → 148 → 173 → 199 → 224px | 0.03 to 0.12 across clean runs |
     | Desktop | 192 → 168 → 192px | 0.009 |

     Both widths go over the 0.02 budget on phone, and MASTER 3.3 bans layout shift.
   - **The close-after-step glitch** (answer 5) is an overlap in motion.
7. **Which reference, and is its motion there?**
   - **osply.co / hamol.studio:** the salon hang has the confident asymmetry, the pointer-held light and the magnetic ask. It is the best part of the page.
   - **synchronized.studio:** the frame-to-viewer morph has the 600ms in-out timing, but it opens into a modal with the same words, not into a page.
   - **apple.com:** one idea per screen holds only for the wall. Nothing is pinned or scrubbed.
8. **Different from its neighbours?** Half.
   - **Own medium:** no other page hangs frames, and `unique.py` passes.
   - **Shared composition:** the first screen is the Business 2 layout shared with /templates and /tabs (filmed side by side). A title on the left, a lede and solid ask on the right, then a rounded grey stage from y≈380 with a 44px pause disc at its top right.
   - **Shared ending:** below the hero comes the same kit run: numbered steps, an "Agent prompt" box with Copy, and a dark close with two buttons.
   - **Wrong way round:** /templates shows real template previews in browser windows, while /gallery, the template showcase, shows none.
9. **All 18 parts covered?** No; see below. `docs/coverage/gallery.md` exists but claims three things that are not true: "frames lean" (there is no tilt code), "targets 44px", and "one solid per viewport" (that last one only became true through the shared bar change at 14:34).
10. **Banned tells?** Yes:
    - three equal boxes in a row (the moves: three equal white cards, same anatomy);
    - layout shift (the typing box);
    - a cursor-following label (`data-cursor="View"`);
    - a dead phone first screen after 2.8s.

    There is no hue in the page CSS (`taste.py` OK). The one blue mark, rgb(0,114,206), is the shared footer's Privacy choices icon. Nothing sits above a headline ("gallery.hanzo.ai" is under the h1), and no button fades on hover.
11. **Copy untouched?** Yes: `parity.py /gallery` gives text 32/32 and links 5/5.
    - **Unregistered UI strings:** the viewer shows a visible "Close". The register entry `close` is `needs_james: true`, so until James approves it the button should be an icon with that aria-label. "Previous template", "Next template", "Play", "Pause" and "View" are not in `content/ui-strings.json`.
    - **For James, a copy question and not a page fault:** in the hero the wall label reads "Image + video gallery" next to "Curated template showcase for Hanzo products". Both are Hanzo's words, and they disagree.

## Missing from the 18 parts (PLAN-COMPONENTS §2.1–2.18, measured)
- **2.1 / Gate:**
  - The header has `Persona:`, `Goal:`, `CTA:` and the metric, and `page.jsx` has `Signature:` and `Beyond:`.
  - `Gallery.jsx` line 3 still says "amber accent" and scores itself "V2: 8/10".
  - The first screen carries four actions: Browse the Gallery, Documentation, Deploy to Cloud and hanzoai.
- **2.3 First impression:**
  - There is no `PageHero` and no `Band`: the hero is hand-written and the close is `.xga-band`.
  - The phone fold shows no frame, because the "Get Gallery" label card comes first.
  - The close has no object.
- **2.4 Conversion:** the viewer, the page's one state change, has no ask in it.
- **2.6 Content:** wall captions are clamped to one or two lines with an ellipsis (for example "Every template ships…"), which cuts Hanzo's sentence mid-phrase on the wall itself. The phone text floor now passes (14px).
- **2.7 Visual system:**
  - No colour arrives from Hanzo's media, because the Zen card was dropped.
  - Several greys are literals that are not deck values: #f5f5f7, #ececf0, #f2f2f4, #3a3a3e, #e8e8ed. The deck's are #f5f5f5, #ededed, #f2f2f2, #404040.
  - The frames use 4px and 2px radii; the deck sets art cards at 20px.
  - `filter: saturate(.6)` on grey pictures does nothing and is left over from the amber version.
- **2.8 Components:**
  - The viewer is a hand-rolled `role=dialog`; the plan asks for a native dialog or the kit Sheet. Its trap and focus return do work.
  - The frames have no press state.
  - Two `:hover` rules are bare, not inside `@media (hover: hover)`: `.xga-frame:hover .xga-art` and `.xga-move-a:hover i`.
- **2.9 Motion:**
  - The wall's pause button stops only the spotlight. The six Sigils keep drifting, because none gets `still={paused}`, so WCAG 2.2.2 is not met.
  - Up to four continuous movers share one viewport (three visible Sigils and the spotlight), against "at most one".
  - Below the wall the only motion is one typing run. The close-after-step glitch is in this area too.
- **2.10 Media:** there is no Film or Pic, and the Zen film is unused although it is local.
- **2.11 Mobile:** "hanzoai" is 271×20 and the three move links are 287×22; the plan asks for 44px. The shared phone bar covers "Fork it" at y≈1460.
- **2.12 Accessibility:** the counter has `aria-live="polite"` and changes by itself every 2.6s, so a screen reader hears "03 / 06", "04 / 06"… without end while the wall is in view.
- **2.13 Performance:** six canvases each run their own rAF; the plan asks for one scheduler and at most 2 loops.
- **2.15 Catalogue:** a frame opens into a modal with the same text. There is no link to the template and no "Browse the Gallery" inside.
- **2.18 Measurement:** `data-cta` is on both asks. The ledger entry (what the page deleted) and the contact sheet and rubric (gate lines 7 and 8) are missing, and the coverage card overclaims.
- **Passing:**
  - One h1 and one main.
  - JS off is legible: all text shows, and the frames are empty boxes.
  - Reduced motion settles: 0 animations after 3.5s, frame 01 lit, h1 in place.
  - No horizontal scroll at 320 or 375.
  - 0 hues; parity clean; `unique.py` OK; no console errors.
  - The viewer handles the keyboard and returns focus.

## Fixes (in order)
1. **Hang real things.**
   - Put Hanzo's own black Zen model card back as the lead piece of the wall ("Start from a Working App"), copied to `SPEC.md`, with its film through `ModelFilm slug="zen"`. The page's colour arrives through it.
   - Give each of the six frames a product render built only from that frame's own words, as /templates does with its windows. For example: a chat window for RAG Chatbots, an agent run, the deploy button, the repo tree, the filter bar, and a PR for Submit Yours.
   - Keep Sigil only as the fallback.
2. **Make the light read on every frame and on the first screen.**
   - Dim the unlit frames' pictures with opacity or contrast, not saturate on grey. Bring the lit frame up to full ink, with its number and caption answering.
   - Walk only the frames you can see at 801, or lift the plaque and counter into view.
   - Under 900px, move the "Get Gallery" label below the frames so a frame is on the phone's first screen. Keep the light walking the frames that are visible there.
3. **Replace the three equal cards with one thing that changes.** For example, a single stage where the lit template goes fork → deploy → submit (repo, then deploy button, then PR), pinned on desktop and stacked on phone. Give the close an object, such as the wall in miniature or the Zen card.
4. **Fix the close after stepping.** Keep one `layoutId` for the frame the viewer opened from and crossfade the content on ← and →, so closing morphs back with no hole and no frame flying across its neighbours. Put the ask in the viewer as a "Browse the Gallery" text link.
5. **Stop the typed prompt moving the page.** Reserve the final height: lay the full prompt in invisibly and type over it. Phone CLS should go from 0.03–0.12 to 0.
6. **Nothing floating, and a full pause.**
   - Set `data-cursor=""` on the frames.
   - Pass `still={paused}` to every Sigil.
   - Drop `aria-live` from the counter that walks by itself; announce only the steps a person makes.
7. **Taps and labels.**
   - Make "hanzoai" and the move links 44px on touch, and give them the ink underline.
   - Add press .98 to the frames and translateY(1px) to the links.
   - Wrap the bare `:hover` rules in `@media (hover: hover)`.
   - Make "Close" icon-only with its aria-label until James approves it, and register the other labels.
8. **Housekeeping.**
   - Use deck values for the literal greys and the frame radius, and delete `saturate(.6)`.
   - Remove "amber accent" and the "8/10" self-score from `Gallery.jsx`.
   - Correct the coverage card (no lean, 20/22px targets), and add the ledger entry and contact sheet.
   - Shared-system request: the desktop pill bar and the phone bar covering card titles now break MASTER 3.3.
