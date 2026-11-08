# /studio — James-eye review
Ready: 8 Nov 00:20, copycheck missing 0 of 58 (captured page), Hanzo's images kept (6 of 6). The Studio badge, the six shot titles and the "Where Hanzo Design (/design) …" paragraph now read as Hanzo's own lines (the paragraph as Hanzo's plain text); See plans, from $8/month stays beside Launch studio.hanzo.ai. taste/unique/parity OK (87/87, 16/16); 0 console errors, no overlap at 1470 and 375. The agent prompt line sits in the shared A2Paste <code> (counted on Hanzo's rendered capture only).

Verdict: 7/10
First complaint: "The top is a whole editing suite at once: five rigs, six model chips, a prompt, six library tiles, four tracks, and then a list of specs under it in a big black empty space. It's the overload again. Then further down there's a row of pills with nothing telling me what they're for, and the film strip runs off the edge with the playing frame somewhere I can't see."

Walked with Playwright (Chromium) at 1470x801 and at 375x812 (isMobile, hasTouch, DPR 2), with video recorded for both (`vid-desk`, `vid-phone`).

- **Desktop walk.** Two full walks, wheel-scrolled top to footer in 100px notches with a 180–200 ms dwell, a frame saved every 3rd or 4th notch. One walk had the cookie card up and one had it accepted.
- **Fresh-load burst.** Captured the first 1.4 s. Read the playhead transform at 300 ms and at 1000 ms: it moved from 0.33% to 4.58%.
- **Hero controls.** Hovered all five rig tabs and clicked Vertigo Zolly (it jumps to Shot 03). Hovered and clicked the Oto chip (the prompt retitles and the track lights). Dragged the playhead with the cookie card gone (the hint changes to "Playhead is yours", and it lands on Shot 04). Hovered the library tiles. Hovered the primary and pressed it (scale 0.98).
- **Open Studio.** Clicked it: it scrolls to the monitor (scrollY 265) and stays on /studio.
- **Rest of the page.** Hovered and clicked a Studio/Design chip. Scrubbed the pinned reel at 11 positions (frame 0.92→1, pillar swap at each third). Hovered a graph node (the pane follows). Hovered a film-strip frame (its film plays), clicked Oto (the WebGL opener runs into /oto) and pressed Back (returns).
- **Phone.** Tapped a rig tab and a graph row, and checked the phone reel swap (01→02→03).
- **Console.** Checked 8 fresh desktop loads plus the phone runs: 0 console errors or warnings.
- **Layout checks.** CLS was 0.002 on desktop (all from the shared header) and 0 on phone. scrollWidth was 375 at 375 and 320 at 320.
- **Reduced motion.** Final state is complete, `getAnimations()` = 0 after 3.5 s, and no text is left at opacity 0.

Working files: /tmp/claude-0/-home-user-hanzo-site/715b2a45-dd44-5306-98d1-bc0b4d91bc34/scratchpad/critic3/studio/

## What works
- **The hero is the product, and it is alive with no input.** The h1 cuts in at 52px, with the lede and one solid ask on the right. The monitor runs its five camera moves by itself, the rig name rolls, the tab's progress bar fills and the playhead travels. Every control answers with more than opacity:
  - rig tabs jump shots;
  - model chips retitle the prompt and light their track;
  - the playhead can be grabbed and the hint says so;
  - the keyboard drives the slider.

  No other page has this signature.
- **The white holes from last round are closed.** Paste→What→Reel now flow, and the reel frame arrives under the Studio/Design card.
- **The reel reads now.** At 240svh, the frame grows from 0.92 to 1 over the first 15% of the pin. Each third performs a bigger move (dolly 1.25→1.70, crane ±12%, orbit with tilt). The subtitle cuts (out, then a line-mask in) instead of blending. On phone, the sticky frame swaps 01/02/03 as each caption passes.
- **The capabilities are one wired node graph.** A layoutId ring travels between nodes, the wires light behind it, and one pane holds the sentence. That is one in, one out. On phone it becomes a clean numbered list with the pane below it.
- **The card opens into its page.** A film-strip frame plays its film on hover, and a click runs the WebGL opener into the model page (synchronized.studio). Back returns. There are 4+ real model pictures on screen together.
- **The motion mix is right:** idle (film, graph pass, chip hop), pointer (scrub, hover previews, opener), state (tabs, ring, radio chips), time (caret, REC blink) and scroll (reel). Scroll is well under half of it.
- **Phone hero meets the brief.** The h1 is 36px in 3 lines, the ask sits at 345px and the monitor at 413px inside 660px. There is no overlap or horizontal scroll, and no target is under 44px.
- **The close has one solid ask** plus a text link.

## What fails (ranked, each with a concrete fix the owner can make in the page's own files)
1. **The hero is an overload, then a dead black band.** At 1470x801 the first screen and a half holds the full editing suite:
   - monitor with 4 HUD labels;
   - 5 rig tabs;
   - 6 model chips;
   - prompt;
   - 6 library tiles;
   - 4-track timeline.

   Then come three long spec rows in a 780px-wide column with a 360px-wide empty right column. The only thing in that column is a grey note at its bottom (frames d-walk-008, b/w-009). That is about 450px of black with only text in it before the white page starts. This is James's "overload of information… instead of one thing comes in, one goes out".

   Fix (`Studio.jsx` `Hero`/`Cinema`, `Studio.css`):
   - Move the `xst-specs` list into the inspector column below the library, or set it as one compact 3-up row of 13px mono-numbered lines directly under the timeline with no extra band. Put `.xst-note` inline at the list's end rather than alone in an empty column. Cut `.xst-foot` padding so the dark room ends about 72px after the desk.
   - Consider collapsing the library to 3 tiles on desktop (the other 3 are the same stills as the clips), so the inspector is not a second wall.
2. **The film strip hides two models, and its playing frame runs off-screen.** At 1470 the frames sit at x=1447 and x=1799, so Uta and Mori are past the right edge. `.xst-film` has `overflow-x:auto` with the scrollbar hidden and no drag, so a vertical wheel leaves scrollLeft at 0 (measured) and a mouse user never reaches them. The `setInterval` auto-advance moves `.on`, and its film, onto those off-screen frames. On phone the rail never follows either: the Iro card is in view while Koma (off to the right) is the one lit and playing (b/p-strip).

   Fix (`Studio.jsx` `Strip`, `Studio.css`), either of:
   - when `on` changes from the timer (not hover), call `ref.current.querySelector('.xst-fr.on')` → `parentElement.scrollIntoView({inline:'center', block:'nearest', behavior: calm?'auto':'smooth'})` on the `ul`;
   - on desktop (≥1200px), size the frames to fit all six (`width: calc((min(100vw,1440px) - 48px - 60px)/6)`) and keep the rail only under 1200px.

   Also add a drag-with-inertia or two 44px prev/next buttons for fine pointers.
3. **The "Studio or Design?" chooser has no visible label, and the What section leaves a white hole above its heading.** The `a2-kick` "Studio or Design?" is visually hidden (shared rule), so on desktop the card is 8 pills with no question, hopping on their own. The section is bottom-aligned, so the left column has about 250px of empty white above "Production-grade AI film direction" (d-walk-016). The answer card also puts a second solid fill (`Go solid` "Launch studio.hanzo.ai") in the same viewport as the header's solid ask.

   Fix (`Studio.jsx` `Which`, `Studio.css`):
   - give the label `className="a2-kick show"` (it sits above a radiogroup, not a heading, so it is allowed) or render it as a 13px caption inside the card;
   - set `.xst-what .a2-grid { align-items: start }`, or centre the copy against the card;
   - render the answer CTAs as `Go` without `solid` (text link with arrow), so the hero and the close stay the only solid page asks.
4. **The graph ring's wrap-around flight looks like a glitch.** When the pass goes from 06 back to 01 (and on any long hover jump), the `layoutId` ring tweens its box straight across the canvas over nodes 03–05. Mid-flight it draws a black, distorted rectangle across the wires (b/w-045). In b/w-042 it sits offset half off node 06.

   Fix (`Studio.jsx` `Graph`): make the ring's transition `duration: 0` (a cut) when `|from − to| > 1`, or drop `layoutId` and fade the ring in place per node (opacity plus scale 0.96→1, 300 ms ease-emphasis).
5. **The reel frame is still half black.** The stills are portrait art on black with the subject on the right, so the left 35–40% of the 2.39:1 frame stays empty at every scroll position (d-reel-0, d-reel-6). The moves are bigger now but act on the right half only.

   Fix (`Studio.css` `.xst-frame img`): `object-position: 70% 50%` with `object-fit: cover` (or a translateX(-12%) base in `REEL`), so the subject sits in the centre third. Alternatively, lay the pillar subtitle over the empty left third with a gradient under the text, so the frame's dead side carries the words.
6. **The close's object is a static black card.** "Get Studio" is text, a REC dot and a link in a black box. It is the only section without a live object, and the page ends quietly on it.

   Fix (`Studio.jsx` `Chair`): put a small still of the monitor's last frame, or a 2.39:1 thumbnail of the reel's final still, at the top of the card, with the REC dot over it. Alternatively, let the card's background run the monitor's current shot at low scale (one rAF, paused off-screen).

Not counted against the page (shared):
- The phone header ask stays "Try Hanzo" for the whole walk at 375. Desktop swaps to "Launch studio.hanzo.ai" correctly once the hero ask leaves view.
- The cookie card (about 203px at 375) covers the monitor's timeline on first load at both sizes.
- The kickers are visually hidden by `A2.css` (`.a2-kick:not(.show)`), so Hanzo's "Hanzo Studio · AI Cinema & Production Engine", "What is Hanzo Studio" and "Capabilities" captions exist only for screen readers. MASTER part 7 says to keep the words visible as a caption below the heading. The owner can opt in with `.show` placed under the h1/h2.
- A red "1 Issue" dev badge appeared once, in a session that re-navigated mid-load. It did not reproduce on 5 further fresh loads, which had 0 console errors. It is likely the shared footer hydration mismatch noted last round.
