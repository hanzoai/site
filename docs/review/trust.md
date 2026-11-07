# /trust — James-eye review

Verdict: 7/10
First complaint: "On the phone the drawers pull themselves out but I can't see what's in them, because the contents are a whole screen further down. Then the paper cards tell me the same two paragraphs again. Desktop is nearly there; the phone is still a long read."

Walked on 7 Nov (second critic pass, after the owner's fixes from the 6/10 review) with Playwright Chromium against the dev server.
- **Sizes:** 1470×801, and 375×812 (isMobile, hasTouch, DPR 2).
- **Recording:** video at both sizes, and a frame every 4–5 wheel notches while wheel-scrolling the whole page in 100px notches with a 140ms dwell (76 notches on desktop, 96 on phone).
- **Idle:** frames at 0.1–4.5s with no input.
- **Hover and press:** with the cookie bar dismissed, I hovered and pressed the hero ask, the drawers, the paper cards, the group + buttons and rows, the stance buttons and the closing ask.
- **Opening things:** I clicked drawer 05, watched the "Find a control" demo type by itself, typed "scim" and opened its answer into the sheet, closed it with Esc, typed a no-match term, scrubbed through the pinned "Where we stand" stage in 6 steps, and tapped the phone accordion.
- **Checks:** console on 4 fresh loads per size, horizontal overflow at both sizes, reduced motion at both sizes, and a sticky-header track over 80 notches.
- **Not counted against the page:**
  - The red "1 Issue" badge was a Build Error in another chat's file (`components/pages/model/ZenMax.jsx`, then `ZenCatalog.jsx`). It blanked one phone walk, which I re-ran once it cleared.
  - /trust's own loads logged 0 console errors and showed no hydration mismatch.

Working files are in /tmp/claude-0/-home-user-hanzo-site/715b2a45-dd44-5306-98d1-bc0b4d91bc34/scratchpad/critic2/trust/ (r2/ holds the clean phone walk).

## What works
- **The first screen sells and moves within 1s.**
  - The h1 cuts in by line mask (52px desktop, 40px phone) and sits at about 34% height.
  - At 1.0s, drawer 01 has already slid out 28px and the tray shows its big light "01", title and contents. By 4s it moves on to 02/06.
  - It is a real object, it is the page's own signature, and it pauses under the hand.
  - Phone: h1, lede, ask and the top of the cabinet all fit inside 812px.
- **The last review's fixes landed:**
  - **Header ask:** the header now carries the full "Request a review or an enterprise deployment" with no clipping (scrollWidth equals clientWidth, 313px).
  - **Console:** no hydration error on 8 fresh loads.
  - **Hero hover:** the hero ask hovers to `#262626`, a deck step.
  - **Touch targets:** none under 44px on phone.
  - **Overflow:** none at either size (scrollWidth 1470/1470 and 375/375).
- **"Where we stand" is now a pinned stage on desktop.**
  - The section holds while you scroll, and one stance is in focus at a time: 01 → 02 → 03 → 04 with a scrubbed 4-segment rail.
  - The list on the left lights its row with a filled or hollow dot.
  - This is the "one in, one out" James asked for. On phone it is an accordion with 44px+ ± buttons, and `hidden="until-found"` bodies.
- **"Find a control" shows itself working.**
  - About 400ms after it is 60% in view, it types "PKCE" by itself. The 64px count drops from 16 to 1, non-matching groups grey back, and then it clears.
  - Typing "scim" gives 1 match, and its answer opens the "Getting in" sheet scrolled to the control. Esc closes it.
  - A no-match term shows Hanzo's own "ask" line with a link.
  - This is the best Beyond aid in the set.
- **The "today" statement inks in word by word against scroll.** That gives the grey room a moment instead of a block of type.
- **Every hover answers, with no layout jump:**
  - Drawers preview the pull (translate 6px, the border goes to 30%, the index darkens).
  - The group + rotates 90° and scales to 1.06, and the stance title slides 4px.
  - Paper cards straighten and lift 6px.
  - The search field fills `#ededed`.
  - Presses scale to 0.97–0.98.
- **The motion mix is real:**
  - arrival (cut-in)
  - idle (cabinet)
  - time (typing demo)
  - state (drawers, sheet, accordion)
  - scroll (word ink, pinned stage, the dark room opening from a rounded panel to full bleed)

  Scroll-linked effects are about half of it.
- **Reduced motion** shows the final state: h1 in place, drawer 01 open, every word at opacity 1, no demo, and 0 running animations after 3s.
- **Palette:** monochrome, one black room at the end, and the Published/On request status shown as filled or hollow shape, never hue.

## What fails (ranked, each with a concrete fix the owner can make in the page's own files)
1. **On phone the cabinet's payoff is off-screen.**
   - The locker is 1069px tall at 375. Six drawers each wrap to 2–3 lines with the chip underneath, and the tray sits below all six.
   - So when a drawer pulls itself out, its contents are about 600px further down. You watch a box nudge right and learn nothing.
   - The open drawer's 28px slide also pushes it against the panel's right edge (356 of 359px), so it looks jammed.
   - Fix in `Trust.css` `@media (max-width: 899px)` plus a small branch in `Locker()`:
     - Render the open drawer's tray panel inline, directly under that drawer (accordion-style, one open).
     - Or keep the tray first and make the drawers a horizontal snap rail of chips above it.
     - Set the phone slide to `x: 8` (or a 0.98→1 scale) instead of 28.
     - Put the chip on the title's line, right-aligned in mono 12px, so each drawer is one row of about 56px.
2. **The same two paragraphs appear twice in a row.**
   - The DPA and subprocessor descriptions show in the cabinet tray (drawers 01 and 02 open themselves first), and then again on the two paper cards one screen later.
   - On the cards they are also line-clamped mid-sentence ("Still a draft pending…"), which reads as cut copy.
   - That is the "overload" James complained about.
   - Fix in `Trust.jsx` `Docs()`: drop `xtr-paper-d` from the papers. Path, title and arrow are enough, and the words still live in the tray, so parity holds. Alternatively, show the description only on hover or focus as the "preview" and never clamp it.
3. **The desktop stance stage is a grey box with a paragraph in it.**
   - Inside the 685px stage card, about 200px of empty grey sits between "01 / 04" and the light "01". The body then reads as a text card, and it repeats the tray's big-light-index device a third time (tray, stage, count).
   - The section is also 2123px tall for four short answers, so each notch of scroll buys very little.
   - Fix in `Trust.css`:
     - Shorten `.xtr-facts` to about 3 screens' worth.
     - Bottom-align less: move the big index up into the empty band and let it grow from 64px to about 84px as its stance enters, then settle. That gives the "start small and grow" rhythm instead of a static figure.
     - Or give each stance one drawn mark from its own words: a filled or hollow seal-free tick for "compatible with SOC 2", a struck-through key shape for "not inside an external module", a hollow passkey glyph. Use ink lines only.
4. **The phone controls list wastes a third of the width.**
   - The number column (01), the 44px + and then the title make three indents. Titles break into two lines ("What a / credential reaches") with about 110px of empty gutter on the left.
   - Fix in `Trust.css` mobile:
     - Hide `.xtr-grp-n`, or set it inline before the title in 12px mono.
     - Move the + to the row's right edge.
     - Let the title and lede run the full 343px.
5. **"Where we stand today" on phone is still about 1.3 screens of plain paragraphs** after the statement (m-030: two body paragraphs in a grey room, no object). Desktop survives on the statement's word ink; phone does not.
   - Fix in `Trust.css`/`Trust.jsx`: on phone, put the two follow-up paragraphs behind one inline disclosure under the statement (`hidden="until-found"`, Hanzo's words unchanged), so the room is the inking statement plus one line.
6. **The hero and closing asks wrap to a 2-line, 70px pill at 375.** A two-line full-radius pill looks broken rather than designed.
   - Fix in `Trust.css` mobile (page-scoped, not the shared button): `.xtr .pf-btn.solid { border-radius: 16px; text-wrap: balance; min-height: 56px; }`, so the two-line block reads as an intended slab. Alternatively, 15px type with 16px side padding.
7. **Smaller:**
   - The hero section leaves about 150px of white under the cabinet before the papers, and there is about 200px of white above the pinned stage. Trim `.xtr-hero` bottom padding and the gap before `.xtr-facts`, so the next object peeks into the screen.
   - The motion technique count (cut-in, word ink, pinned stage, typing demo, room wipe, on top of the signature) is over MASTER §9's "one signature + 3 supporting". Run `scripts/variety.py`. If it flags the page, drop the room wipe, since the black room can simply be there.

Noted, not counted (shared chrome or another chat):
- the ZenMax/ZenCatalog build-error badge;
- the cookie card covering the lower content on both sizes until dismissed;
- the phone header keeps "Try Hanzo" and has no sticky page ask or ask bar on /trust;
- frame captures caught the glass header mid-transition a couple of times, but its live position stayed at top 0 throughout.
