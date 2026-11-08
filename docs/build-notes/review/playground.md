# /playground: James-eye review (independent critic, 7 Nov, walked live)

Verdict: 8/10
First complaint: "When the window lands on Chat or Completions the answer is just grey bars, which looks like a loading skeleton, not a playground. And there's a big empty gap under the hero before anything else comes in."

How it was walked: headless Chromium. At 1470x801 desktop hover was turned on (fine pointer). At 375x812 it ran as a touch phone with the cookie bar accepted. Frames were taken about 1 s apart on each screen. The wheel scroll was recorded with a layout-shift observer running. I hovered and pressed the kind tabs, the anatomy phrases, curl/python, Copy (the clipboard was read back), the wall tiles and both asks, and did a Tab crawl. `parity.py /playground`: OK, text 48/48, links 7/7. `taste.py` on Playground.jsx/.css: OK. No horizontal scroll at 375. CLS: desktop 0.0025 to 0.013, phone 0.012 to 0.013. Proof: `img/playground-hero.jpg`, `img/playground-request.jpg`.

## The 11 answers

1. **Sells in 5 s, moves within 1 s?** Yes. On desktop "Try a model, then ship it" sits left at 52px with the live Playground window on the right. Iro's picture develops tile by tile from 0.2 s, and the window then changes kind every 3.8 s by itself: Video (Koma's film plays), Audio (Oto's film with a waveform), Vision (Kai, "found" box), then Chat and the rest. A timer line under the lit tab shows the turn. On the phone the h1, lede, primary and the top of the window (from y≈445) all fit inside 660px.
2. **One in, one out, or a document?** Mostly one in, one out. Hero window → a pinned grey scene where "A key, a model name, and a message is the whole first request." lights one phrase at a time. The same token lights in the curl request, then the panel swaps to Python. → A black room (agent prompt + a wall of nine model films). → Related → Close. The weak spot is the join between hero and scene: at 1470x801 the screen after the hero is about 40% empty white and grey (hero bottom padding up to 200px plus the scene's centred stage). Nothing overlaps there; one thing leaves before the next arrives.
3. **A real visual object in every section?** Yes. Hero: the running window. Scene 2: the real curl and Python request with live marks and a caret. Dark room: nine of Hanzo's own model films, one playing at a time. Related: drifting Sigil art. Close: the shared Sigil card.
4. **One ask, nothing floating, scale rhythm?** On the page: one solid "Open the Playground" in the hero and the ghost "Read the API" beside it. Below the hero the header carries "Open the Playground" (shared chrome swaps it in). Nothing page-owned floats over content. Scale rhythm is good: h1 52, window medium, mono meter small. The anatomy sentence grows to 44px only while it is the moment, under a 26px h2. The dark-room heading is medium and the close headline is 64px. Never everything big at once.
5. **Every hover and press answers, no jumps?** Yes, and the hovers tell you something:
   - Hovering a kind previews its run, and the Model chip and meter change.
   - Hovering a phrase marks its token in the code ("a message" → `"Hello"`).
   - Hovering a wall tile plays that model's film, with a ring and the name pill turning light.
   - The primary darkens to #262626 and its arrow moves 4px. The ghost fills 4% with an ink border. Deploy to Cloud leans and its underline thickens.
   - Presses are .97/.98/1px.
   - Copy copies exactly the shown pane (Python after the swap) and says "Copied".
   - Clicking "is the whole first request." scrolls to the Python state.
   - The focus ring is a 2px outline on every stop.
6. **Overlap, font swap, layout shift?** No overlap at either size, and the h1 does not move. Small shifts:
   - The Vision "found" box animates `left/top/width/height`, which logs a 0.001–0.002 layout shift every cycle on the phone. Part 8 allows only transform, opacity and clip-path.
   - A 27px text nudge as the curl pane gives way to the Python pane (0.0017).
   - Both are under 0.02, but the first is a rule break.
7. **Which reference, and is its motion there?** apple.com product page: the product is the hero, and the pinned scene changes one panel as you scroll. The pinned scrub is genuinely there. synchronized.studio shows up only as `data-morph` on the wall tiles into model pages. The window's tab pill glides (layoutId, 300 ms, ease-emphasis).
8. **Different from its neighbours?** Yes. /registry is a dark terminal and registry split with the h1 on the right. /tunnel is a type-led h1 over a black URL band. /playground is copy left and a light app window right with eight media-led kinds. The window as signature is not reused nearby.
9. **18 parts?** On the page I checked:
   - One h1 (SSR).
   - `data-cta` on both primaries and `data-thumb` on the hero ask.
   - Hanzo links only.
   - Pause controls on both live loops (window and wall).
   - APG-style tablist with arrow, Home and End keys, and a roving tabindex.
   - A `prefers-reduced-motion` block.
   - A JS-off fallback for the scene (`data-live`).
   - 44px phone targets.
   - Media through `Img`/`Film`, with at most one window film plus one wall film playing.
   - Shared parts reused: ClipWipe, LaunchClose, RelatedCards.

   I did not audit the coverage card (by instruction).
10. **Banned tells?** None on the page:
    - no hue (greys plus Hanzo's own greyscale model media);
    - no label above an h1 or h2 ("RUN · IMAGE" and "ONE REQUEST" are captions inside objects);
    - no three equal boxes (Related is 7/5 with one tall card);
    - no Inter, no gradient text, no buttons that fade.
11. **Copy untouched?** Parity: 48/48 text, 7/7 links. The meter shows proportions only, with no invented numbers.

## Polish (the page is at 8; these would take it higher)
1. Give Chat and Completions something to read instead of grey bars. The meter is honestly unlabelled, but the answer bubble reads as a loading skeleton. Show the request's own existing words, typed or streamed in (the `"Hello"` the input already shows, and the lede's own words), or lead the turn order with the media kinds so text-less kinds never sit on screen for long.
2. Animate the Vision box with `transform` (translate and scale from a fixed box) or `clip-path` instead of `left/top/width/height`. This removes the per-cycle layout shift on the phone.
3. Tighten the join under the hero at 1470x801. Reduce `.pg-hero` bottom padding and start the pinned stage so the scene's heading peeks about 56px into the first screen, so the empty band disappears.
4. Make the dark room one idea. Either title or caption the wall, or let it answer the prompt (for example, the wall tile for the kind last lit in the hero leads). Right now "Paste and ship" and the nine films sit side by side unrelated.
5. The `mark` on `HANZO_API_KEY` (`margin: 0 -3px`) clips into the `$` before it. Drop the negative margin or include the `$` in the mark.

## Shared-chrome notes (not counted against this page)
- **Red "1 Issue" dev badge on every load:** a hydration mismatch in `FooterHTML` (`data-x-shell="footer"` `dangerouslySetInnerHTML` differs between server and client). It is the only console error.
- **Header ask styling:**
  - Desktop: while the hero ask is in view the header "Try Hanzo" is outlined (solid for the first ~0.5 s, then outlined), and it becomes a solid "Open the Playground" once the hero ask leaves.
  - Phone: the header "Try Hanzo" stays solid beside the solid hero primary, so there are two solid fills in the first viewport.
  - Desktop at the close: the header's solid "Open the Playground" and LaunchClose's solid primary share the viewport.
- On the phone the bottom ask bar ("Open the Playground") rises over the pinned scene's lower empty area. It does not cover content.
