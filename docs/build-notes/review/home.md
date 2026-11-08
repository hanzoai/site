# /: James-eye review

Verdict: 7/10
Ready: 8 Nov, copycheck missing 0 of 229 (two runs; the slower scan 0 of 232), held up next to /api and /affiliate (James's new bar, no score). Hanzo's whole live hero day now plays in our hero after the opening: 33 scenes across the desktop app, terminal and phone, plus the company log above the app (116 entries), word for word. The platform carousel steps through every product's other live scenes. The Start panel rotates the accelerated agent as live does. Open-source figures and repo cards are as hanzo.ai shows them. The priced link "Go is $8/month" sits under the sign-up group. Fixed a reduced-motion hydration mismatch in the commit calendar. Figures now come from hanzo.ai's own sources via scripts/live.mjs (_oss, _research, _models; it exits 1 on a failed source unless HZ_LIVE_OFFLINE=1), and the hero carries live's newer labels (sidebar toggle, shipped chips, scene notes, sign-up counts). Copycheck re-run after that: 0 of 229 (fast), 0 of 232 (slow). taste/unique OK; 0 console errors (reduced motion too), no overflow at 1470 and 375. Scene colours are on the deck greys (components/home/scenes.css holds hanzo.ai's own atomic rules, greyed).
First complaint: "That's my hero now and it's calm, good. But I click Copy on the install line in the hero and nothing happens. And on my phone the frontier chart is a tiny thumbnail I can't read or drag. In the cost part two huge numbers go big at the same moment, so it's in my face again."

Reviewed: branch `claude/great-ptolemy-2vwfny`, walk started at `945b8ef` and finished on `23ecbc9b`. The tree moved while I walked: the shared system merged (the cursor label is gone and Home dropped its cursor silencer), the models and platform padding was trimmed, and the chapter stage became top-aligned. I re-shot the cards-to-platform hand-off and the chapter stage on `23ecbc9b`, and re-ran parity, taste and unique there. Files hash (Home.jsx, Hero, Models, Platform, Agents, Race, Cheaper, Pareto, Open, Pricing, Home.css, v2/Chapters, v2/Lines): `bff37fc363b0`.
Walked 7 Nov, 14:55–15:16 UTC, on the dev server. I walked it moving at 1470×801 (mouse-wheel through Lenis, pointer passes over the hero, video at full frame rate) and at 375×812 (isMobile + touch, video). I also took frame sheets, a per-half-screen sweep (solid fills, effective type size including transforms, hues, covered text, fixed layers), a hover/press diff on 29 kinds of control, a clipboard test, a keyboard crawl, and JS-off, reduced-motion and 320px passes. The arrival curtain was skipped.
Environment: hanzo.ai can't be reached from this box, so 54 proxied files return 500. These are partner and customer logos, two agent marks and the images inside the Design, Bot and Team screens. I don't count that against the page; I only judge how the page handles the failure.
Proof:
- `img/home-desktop.jpg`: the first screen next to the model cards.
- `img/home-phone.jpg`: the phone hero next to the phone frontier chart.
- `img/home-room.jpg`: the cost room's two figures at once next to the Dev screen's red and green.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** On the look, yes. This is live hanzo.ai's own hero, kept exactly:
   - the "A New Pareto Frontier" pill;
   - "Smarter, Faster, Open Source." at 52px, with "Pick all three." at 64px;
   - the lede, the Google/GitHub/email group, the app, the terminal, the phone and the "Copy setup prompt" bar;
   - the dotted field, which swells under the pointer.

   The devices turn toward the pointer, the prompt types itself, the phone answers and the roster ticks. But the words arrive late. The server HTML ships the h1 masked (translateY 105%), the lede at opacity 0 with blur(8px), and the pill and sign-up group at opacity 0. On warm loads:
   - first paint comes at 0.83–0.99 s;
   - the h1 is fully in at 2.8–2.9 s;
   - the lede is in at 3.0–3.1 s, and it is the LCP element;
   - the sign-up group is in at 3.4 s.

   For about a second the first screen is the header over an empty dotted field. With JS off, the lede stays blurred and the terminal shows only "$".
2. **One in, one out, or a document?** On desktop it is one in, one out:
   - The hero lifts away as the cards rise.
   - The platform pins, and nine real product screens wipe up one over another beside an index.
   - The dark room opens like a door, the races run, the room closes again.
   - The year's commits arrive large and settle.

   Agents is the one flat stretch: a wall of 26 marks plus a console, and nothing moves there untouched. On the phone it is a document: 24,648px (about 30 screens), including 6,379px of nine product chapters stacked one after another. MASTER 4.1 asks for a pinned scene to become 3 static panels on phone.
3. **A real object in every section?** Yes:
   - the live hero devices;
   - nine model films over their posters;
   - real product screens;
   - the agent wall and console;
   - race lanes at true speed;
   - cost lanes with the question-count slider;
   - the GPQA frontier with a budget line;
   - the commit calendar and the repo rail;
   - the plans;
   - the logo walls (names stand in here);
   - the Band.

   On the phone, though, the frontier chart is drawn at 343×140. Its labels render 4–5px tall, its dots are 3px and its drag handle is 13px wide. It is there, but it doesn't work.
4. **One ask, sticky, nothing floating; does scale have rhythm?** One ask: "Try Hanzo" is the solid ask in the sticky header at every width. The ask bar is off, the cursor label is gone, and nothing floats over content (only the header glass and real menus). The first screen keeps live's own fills (header ask, "Continue with email", the phone mock's "Download App" and the "Open App" chip). That is accepted under James's hero exception.

   Scale: the big fix has landed.
   - All 8 section headings are 26px at weight 497, and sublines are 16px.
   - Figures rest at 64px in Zen Air (measured).
   - Figures grow only in their moment: 3.02× and 9.6× reach 102px while their races run, 14.2× and 530× reach about 90px while crossing mid-screen, and 805,254 arrives at 112px and settles to 64px.

   Two misses:
   - In the cost room the two figures sit side by side and grow at the same scroll position, so two big numbers own one screen.
   - At 1470×801 the 3.02× race (9.5 s) is still big when the 9.6× race starts, so both read 102px at y≈7,200.
5. **Does every hover and press answer?** Most do:
   - Google/GitHub lift 2px and darken their border, then press to .97.
   - The pill scales.
   - Chapter buttons take a border and a shadow, then press .98.
   - Tabs and segments ink and then press.
   - Arrow links nudge the arrow.
   - Logos un-grey and show their name.
   - The Band button fills.
   - Replay spins.

   The gaps:
   - The hero terminal's **"Copy" is a `<span>`** with no handler. It has no hover and no press, and the clipboard was unchanged after a click.
   - "Continue with email" has no hover.
   - On the model cards the tilt is right, but a press shows nothing, because the inline tilt transform overrides the `:active` scale. On the dev server the card then sat still for about 2 s before the WebGL lift began.
   - Repo cards have no press.
6. **Overlap, font swap or layout shift?**
   - Overlap: none found at 1470×801 or 375×812. The covered-text sweep found only intended stacking: live's phone mock over the app's input, and inactive chapter screens under the active one.
   - Sideways scroll: none at 320, 375 or 1470.
   - Fonts: Zen and Zen Mono only. The Kufi face is limited to the Arabic range.
   - Layout shift: CLS over the full walk was 0.010 on desktop and 0.004 on phone. One real move: at hydration (about 2.4 s) the hero stage height recomputes from 590 to 522, and the h1 box jumps 22px up (shift 0.009).
   - On the phone, the Google and GitHub buttons have 0 inner padding at 375, so their icon and text touch the pill's edge.
7. **Which reference, and is its motion there?**
   - apple.com: the pinned product chapters with wipes and an index are there, and they are the best stretch.
   - anthropic launch: benchmarks as hero figures are there (a race at true speed, cost lanes, a frontier with a draggable budget).
   - chatgpt enterprise: the calm proof walls are there.
   - synchronized.studio: half there. The picture lifts and bends to fill the screen, but the title doesn't travel into the destination h1, and the black hold lasted about 2.5 s on the dev server (the cap is 700 ms).
8. **Different from its neighbours?** Yes. It has its own hero (live's), the SPEC cards and the argument room, and `unique.py` passes.
9. **Are all 18 parts covered?** All 18 `Done here:` lines are filled, but several claims don't hold on the page (see below).
10. **Banned tells?** None of the hard ones: no eyebrow over an h2, no gradient text, no Inter, nothing floating, and no fade-up-only motion. Risks James may call out:
    - Colour inside the platform's product screens: red and green diff lines with a green "✓ 14 passed", green "POST", red/amber/green window dots, and blue chat bubbles and links.
    - Blue Google and DeepSeek marks on an otherwise ink agent wall and in the "Copy setup prompt" bar. The hero's own Google icon is already grey.

    These are Hanzo's own product markup and third-party marks, so `taste.py` passes. But MASTER says status is "a shape or a word", and sibling reviews failed green status in panes. The agent marks also sit in rounded boxes with a hairline and a shadow, which is both an icon in a rounded box and a raised-and-outlined surface.
11. **Copy untouched?** Yes. Parity is 570/570 text and 132/132 links.

## Rubric (money page)
- **Clarity 4.** It sells in 5 s with live's hero, and the order reads as one argument: models → platform → agents → why it's faster and cheaper → open → price.
- **Hierarchy 4.** The 26/64 rhythm is right, with one big thing on almost every screen. The cost room shows two at once.
- **Craft 3.** The hero Copy is dead; the hero words are hidden in server HTML; the phone chart is shrunk; phone targets fall under 44px; the hero box jumps 22px; failed media shows broken-image glyphs; 44 dead classes remain.
- **Motion 4.** It mixes idle, pointer, time, state, arrival and scroll motion. The opener holds too long, and the title doesn't travel.
- **Distinctiveness 4.** Live's hero, the exact cards and the dark argument room are the page's own.
- **Action 3.** The page's own leading metric, `install_copy`, can't fire from the hero (the console's Copy does work). Chapter actions on the phone are 40px. Fix 1 and 5 and this is a 4.

## Missing from the 18 parts (measured)
- **3 First impression:**
  - With JS off, the hero lede is blurred (inline `filter: blur(8px)`) and the terminal is empty.
  - The LCP element (the lede) ships at opacity 0, and the h1 is masked until hydration.
  - The card-to-page open carries the picture but not the title.
- **4 / 16 Conversion and developer:** the hero terminal's "Copy" is dead. The card says the copy buttons are "live's own"; on live it copies.
- **6 Content:**
  - On the phone, `.hv-addr` is 13px (9 runs).
  - The frontier's ticks and point labels render 4–5px on the phone.
- **7 Visual:**
  - The console and chapter frame use a hairline and a long shadow together.
  - The agent marks sit in rounded boxes.
  - Hues show inside the product screens and on two agent marks (answer 10).
- **8 Components:**
  - The model card shows no press.
  - "Continue with email" has no hover.
  - The terminal Copy is dead.
  - The repo cards have no press.
- **10 / 17 Media and states:** when a mark fails, the agent wall shows a broken-image glyph (here Antigravity and Muse). The logo walls get a name fallback; this wall doesn't. The Design screen shows a black box with a broken-image glyph.
- **11 Mobile:**
  - Targets under 44px: chapter titles 31px tall, addresses 17px, Download/Open/Learn more 40px, frontier source links 22px, the budget handle 13px wide, Terms/Privacy 17px. The card claims 44px.
  - The nine platform chapters stack instead of becoming 3 panels.
  - The phone page is 24,648px.
- **12 Accessibility:** the hero demo loops for good (it types, answers, the roster ticks every 0.7 s and steps every 2.2 s) with no pause control (WCAG 2.2.2). The cards have one. The keyboard crawl was clean: 76 stops, every one with a ring, none under the header.
- **13 Engineering:**
  - The h1 box moves 22px at hydration.
  - 44 `hv-` classes in `Home.css` are unused (the old hero, install line and spine; about 140 of 596 lines).
- **9 Motion:** the card says "No springs", but `Hero.jsx` keeps three (bubble, roster, pointer). That is live's port and fine to keep, but the card should say so.
- **Passing:**
  - one h1, one main;
  - model cards to SPEC: grid 361 + 4×180.5 = 1131px, 220px rows, 12px gap, #000, 20px radius, no shadow or border, titles 22/500/-0.44 and Enso 44/500/-0.88, description 13/18 at 80%, pills 10px mono with a 1px 20% border, film over poster with a .6 s crossfade, tilt with perspective 900 and .3s cubic-bezier(.2,.8,.2,1), heading 635px below the hero headline;
  - reduced motion shows the final state;
  - no sideways scroll at 320;
  - no JS errors;
  - parity, taste and unique all pass.

## Fixes (in order)
1. **Make the hero terminal's Copy real.** Use the kit `Copy` so it copies exactly `curl -fsSL https://hanzo.sh | sh`. "Copied" goes in `role="status"`, with a 44px hit area, a hover and a press. It's live's hero, and on live it works. This is the first click a developer makes.
2. **Give the phone its own frontier.** Below 600px, draw the chart at a usable size: either a taller phone viewBox with ≥12px rendered labels, 8px dots and a 44px budget handle, or a pin-scroll region at true size with a 14–18% peek. The 343×140 thumbnail fails "a composition, not a shrunk desktop".
3. **One big figure per screen in the argument room.**
   - Stagger the cost moments: Enso's 14.2× grows as it crosses, then settles before Kai's 530× grows. Or stack them like the race, figure and lanes, then flipped.
   - In the race, settle 3.02× when its row leaves the middle of the screen, not when its 9.5 s run ends.
4. **Ship the hero's words visible.** The h1 lines, pill, lede and sign-up group should be in their final state in the server HTML. Animate from a state that is already readable, or start the cut-in from a class set before first paint. Remove the blur from the lede's initial state. The look stays live's; slow loads and JS-off then show the sentence.
5. **Phone targets and type.** Give 44px min-height to:
   - chapter titles and addresses;
   - Download, Open and Learn more;
   - the frontier source links;
   - Terms and Privacy.

   Set `.hv-addr` to 14px on the phone, and give the Google and GitHub buttons inner padding at 375 (or stack them).
6. **Shorten the phone.** Turn the nine platform chapters into a swipe rail, or into 3 static panels as MASTER 4.1 asks. That cuts about 5,000px of the 24,648.
7. **Add a pause for the hero demo.** Use the same 44px pause as the cards, first in the DOM before the devices.
8. **Make every tap answer.**
   - Fold a .98 press into the card's tilt transform on pointerdown.
   - Give "Continue with email" an ink-shift hover.
   - Give repo cards a press.
   - In `docs/build-notes/requests/home.md`, ask the shared owner to cap the opener's hold at 700 ms and carry the card title into the h1 (MASTER part 3).
9. **Take the colour out of the product screens and marks.** Grey the red and green diff lines, the green "POST", the window dots and the blue bubbles and links; `+`, `−` and `✓` already carry the state. Grey the Google and DeepSeek marks, as the hero's Google icon already is. If live's colours are to stay, note it on the card as a decision for James.
10. **Handle failed media.** Give the agent wall the same name fallback as the logo walls, and give product-screen images a Sigil or aspect-ratio box instead of a broken-image glyph.
11. **Stop the hero box moving.** Reserve the stage height in CSS at its fitted scale, so the h1 doesn't jump 22px at hydration.
12. **Housekeeping.** Delete the 44 unused `hv-` classes, and correct the card's claims in parts 3, 6, 8, 9, 11 and 16 to match the page.
