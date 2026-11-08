# /trust — James-eye review

Ready: 8 Nov 01:10, live copycheck missing 0 of 70 against hanzo.ai, Hanzo's images kept (live /trust shows none beyond the header). The 16 control titles, which lived only inside the closed sheets, now show as a quiet numbered index under each group's lede; each row opens its sheet at that control. taste/unique/parity OK (87/87, 6/6); 0 console errors, no overlap at 1470 and 375.

Verdict: 8/10
First complaint: "The top is right now: the drawers pull themselves out, the papers look like papers, the search shows itself working. But from 'Where we stand' down it turns back into paragraphs in boxes, a grey box of text and then a black box of text. And on the phone the open drawer has a big empty hole in it before 'Ask for it'."

Walked on 7 Nov (third critic pass) with Playwright Chromium against the dev server on :4180.
- **Sizes:** 1470×801, and 375×812 (isMobile, hasTouch, DPR 2), plus a spot check at 320×700.
- **Recording:** I recorded video at both sizes and wheel-scrolled the whole page in 100px notches with a 140ms dwell (68 notches on desktop, 76 on phone). I took a frame every 4 notches and idle frames at 0.1, 0.5, 1, 2 and 4 s with no input.
- **Console and cycling:** I ran 3 fresh loads per size for console errors, plus 6 more loads to try to reproduce a hydration warning. On 3 fresh desktop loads, with the pointer off the cabinet, I tracked the cabinet's open drawer once a second for 12 s.
- **Hover and press:** I measured computed styles on the hero ask, drawer 05, the first paper, the group +, a control row, a stance button and the closing ask.
- **Opening things:** I clicked drawer 05, waited for the "Find a control" self-typing demo, typed "argon2id", opened group 01 and a control row into the sheet (Esc closes it), clicked a stance on the pinned stage, and tapped drawer 03 at 320.
- **Layout checks:** horizontal overflow at 1470, 375 and 320; touch targets at 320; the reduced-motion final state at both sizes.
- **Copy:** `scripts/parity.py /trust` gives OK, text 87/87 and links 6/6.

Working files: /tmp/claude-0/-home-user-hanzo-site/715b2a45-dd44-5306-98d1-bc0b4d91bc34/scratchpad/critic3/trust/ (desk/, phone2/, phone3/, int/).

## What works
- **The first screen sells, and something moves inside 1 s.**
  - The h1 cuts in by line mask: 52px on desktop with its top at y=163, and 40px on phone.
  - By 1.0 s drawer 01 has slid out with its tray filled. With no input the cabinet goes 01 → 02 at about 5 s and 02 → 03 at about 9 s on all 3 loads.
  - It waits under the hand: the pointer on the cabinet pauses it.
  - At 375 the h1, lede, ask and the top of the cabinet all fit inside 812px.
- **Most of the last review's fixes landed:**
  - **Phone tray:** the tray now rides directly under the open drawer (transform only, no reflow), and the open drawer's nudge is 8px. You see what the drawer holds.
  - **Papers:** they no longer repeat the tray's paragraphs. They are now drawn papers (path, title, ruled lines, arrow) tilted about 1.5°. On hover they straighten and lift 6px, and on press they scale to 0.97. This is a real object, not a text card.
  - **Desktop stance stage:** the empty grey band is gone, and the section is down from 2123px to about 1585px. It is a proper pinned stage: one stance in focus, a list with a filled or hollow mark, and a scrubbed 4-segment rail.
  - **Phone controls list:** it runs full width with the + at the right edge, with no triple indent.
  - **Phone hero and closing asks:** they are now an intended 64px slab with a 16px radius, not a broken two-line pill.
- **"Find a control" is the best Beyond aid in the set.**
  - It types "PKCE" by itself when reached, the 64px Air count drops 16 → 1, and the non-matching groups grey back.
  - Typing "argon2id" gives 1 match and lights the group's dot.
  - Rows and groups open the native sheet, and Esc closes it.
- **The motion mix is real, and scroll is no more than half of it:**
  - arrival: the cut-in;
  - idle: the cabinet;
  - time: the typing demo;
  - state: drawers, sheet, phone accordions;
  - scroll: word ink, the pinned stage, and the black room opening from a rounded card to full bleed.
- **The header ask hands over.** Once the hero ask leaves view, the desktop header's "Try Hanzo" becomes the solid "Request a review or an enterprise deployment". Only one solid fill shows at a time.
- **Every hover answers, with no layout jump:**
  - The hero ask goes to #262626 and lifts 1px, and press scales it to 0.97.
  - Drawers preview the pull with a 6px translate, the border goes to 30% and the handle nudges. Press scales the title.
  - Stance titles ink from #737373 to #0a0a0a.
  - The closing ask lifts 1px.
- **Layout is clean:**
  - no horizontal scroll at 1470, 375 or 320;
  - 0 targets under 44px at 320;
  - no overlap between hero, ask and nav at either test size.
- **Reduced motion shows the final state** at both sizes: drawer 01 open and the cabinet not cycling, nothing below 0.5 opacity, and 0 running animations after 3.5 s.
- **Palette and copy:**
  - The palette is monochrome. Published and On request are shown as filled and hollow shapes, and there is one black room.
  - "Trust" is set as a caption below the h1, not above it.
  - The copy is untouched (parity OK).

## What fails (ranked, each with a concrete fix the owner can make in the page's own files)
1. **The bottom half goes back to words in boxes.**
   - The "Where we stand" stage card is a #f5f5f5 box holding a light index and a paragraph.
   - The black "Found something" room is a 26px heading on the left, with about 500px of empty black under it, and two paragraphs on the right.
   - So after the "Find a control" moment, the page has two rooms in a row with no object. It also repeats the big light index device a third time: the tray "01", the stage "01" and the count "16".
   - Fix in `Trust.jsx`/`Trust.css`:
     - **The dark room.** Give `Close()` one object made from its own words: the `/.well-known/security.txt` record drawn as a small mono file (`Contact: mailto:security@hanzo.ai`, RFC 9116 line). Set it in Zen Mono at 13.5px on graphite in the empty left column, with its lines typing in once when 60% in view. It should be static under reduced motion and use only words already in the room.
     - **The stance stage.** Drop the light "0N" figure there and let the active stance title grow from 21px to 32px as it enters, then settle. That gives the "start small, grow" rhythm without repeating the tray device.
2. **On the phone the open drawer has a dead hole.**
   - The tray is a stacked grid, so every panel is as tall as the tallest one.
   - `.xtr-tray-p .x-arrow { margin-top: auto }` pushes "Ask for it" to the bottom. Drawer 05 shows about 110px of empty white between its text and the link, and drawer 03 at 320 shows even more.
   - Fix in `Trust.css` `@media (max-width: 899px)`: set `.xtr-tray-p .x-arrow { margin-top: 0; padding-top: 10.5px; }` so the link sits right under the text.
   - If the white box still looks oversized, set the stacked panels `align-self: start` and drop the tray's fixed-height look by removing its border, leaving a tile fill only. Per MASTER §7 a surface is raised or outlined, never both, and it currently has a border plus the shadow from the open drawer above.
3. **On the phone, "Where we stand today" is still 1.3 screens of plain paragraphs.**
   - After the inking statement come the two follow-up paragraphs. They now have a grey left rule, but that only makes them read as a quote block.
   - Fix in `Trust.jsx` `Stand()` plus mobile CSS: put the two paragraphs behind one inline disclosure under the statement (`hidden="until-found"`, Hanzo's words unchanged), and drop the left rule. The room is then the statement plus one line.
4. **At 320 the drawer titles break mid-word** ("subprocess / or register", "questionnai / re, answered"), because the chip takes the right column.
   - Fix in `Trust.css`: add `@media (max-width: 359px) { .xtr-drawer { grid-template-columns: 20px minmax(0,1fr); } .xtr-chip { grid-column: 2; justify-self: start; margin-top: 4px; } }`, so the chip drops under the title. Also set `overflow-wrap: normal; hyphens: none` on `.xtr-dr-t`.
5. **Intermittent hydration warning** (2 of about 15 loads, both in recorded walks).
   - The page's own part of the diff is `<input id="xtr-q">`: the server HTML carried `style={{caret-color:"transparent"}}` and the client did not. The current source has no caret-color, so this is probably stale HMR from an in-progress edit.
   - Fix: make sure nothing in `useDemo` sets style on the input during render, and only toggle a `data-typing` attribute after mount (CSS can own the caret colour). Then reload 5 times clean.
6. **Smaller:**
   - **Group + hover.** Hovering `.xtr-g-btn` showed no computed change on the button itself. Make sure the hover rotate or scale lives on the button, inside `@media (hover:hover)`, so the + answers.
   - **Cabinet pace.** The first drawer change takes about 5 s (650 ms + 3.4 s after hydration). A first-time visitor who stays on the hero sees one pull, then a wait. Try 2.6 s between drawers.

Noted, not counted (shared chrome or another chat):
- Next's "1 Issue" dev badge sits over the cookie card's "Reject all" at 375. Part of the hydration diff is in the shared `FooterHTML`.
- The cookie card is about 200px tall at 375 and covers the lower content until it is dismissed.
- On phone the header keeps "Try Hanzo" and /trust has no sticky page ask. At 320 the "Try Hanzo" pill is clipped at the right edge.
- Frame captures caught the glass header offset by about 8px while scroll smoothing ran.
