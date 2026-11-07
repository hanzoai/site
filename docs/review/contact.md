# /contact — James-eye review

Verdict: 7/10
First complaint: "I point at 'Developer Dispatch' and 'Subscribe to newsletter' prints right on top of it. I go for the last 'Talk to sales' and it turns dark grey and the words disappear. And it's still a page that sits there: the headline is already in place when the black lifts, the cable swings once and stops, and below that it's a black box with a clock and a list."

Walked 7 Nov, about 14:29 to 14:39 UTC. Page file at `5140e26` (`components/pages/Contact.jsx`, `Contact.css`), HEAD `96b1778`. Filmed moving at 1470×801 and 375×812, on a first visit (curtain) and a return visit: wheel scroll with a dwell on every screen, hover and press on desktop, taps on the phone. Also checked JS off, reduced motion, 320 and 375 widths, keyboard, and jack hover at 1440×900, 1280×800 and 1024×768.

Stills:
- `review/contact/desktop-walk.jpg`. Top row: the curtain uncovering a headline that has already finished its cut-in; the cable on Support mid-sweep with the Sales route still in place; hovering "Developer Dispatch" (the action prints over the name). Bottom row: the Visit room; the community plate on hover; the closing Band's "Talk to sales" on hover.
- `review/contact/phone-walk.jpg`. Sales at rest; mid-sweep, with neither visible dot lit; Press with the copy tick; the clock; the plate riding at the top over the rows; JS off.

## What works
- **The ask never moves.** Across 60 samples from load to 13s, the Sales route stays at opacity 1 and the other three at 0. Only the cable sweeps. "Talk to sales" ends at y=707 at 1470×801 and at y=744 at 375×812. This was last review's first complaint, and it is fixed.
- **The cable is one drawing.** In 14 samples taken mid-swing, the nub sits exactly on the wire's end. It swings on a spring and settles in about 0.5s. The old route lifts out and the new one rises in.
- **One contour.** The Visit map is gone. The room's object is now a 440px live clock with a readout, and the community plate is the only contour on the page. The plate drifts while idle and leans toward the pointer.
- **The additions are gone.** There are no 01–04 numerals and no mono URL lines.
- **Closing Band.** It uses Hanzo's "Bring Hanzo to your company." with one solid "Talk to sales". The ask bar hides while the Band is on screen.
- **States:**
  - JS off: all four routes are stacked and readable with their links, and hello@hanzo.ai shows. There is no plug, no cable and no 12:00 on the dial, and nothing is inert.
  - Reduced motion: no sweep, and 0 animations running after 4s.
  - The clock's name carries the time ("San Francisco, 6:31 AM PST").
  - With clipboard access blocked, nothing claims "Copied". With access, the tick draws and `role=status` says "Copied".
- **Hover, press and keys:**
  - Sales goes from #0a0a0a to #3a3a3c, and press scales it to .98.
  - "See Enterprise" underlines and its arrow moves 4px.
  - Community rows slide 10px and redraw the plate.
  - Arrow keys move and select the tab (checked from Sales to Support).
  - On the phone, a tap scrolls the chosen pill into view, and the page never scrolls sideways.
- **Engineering checks pass:**
  - CLS is 0 on desktop and phone, on both first and return visits.
  - No console errors or warnings.
  - No sideways scroll at 320 or 375.
  - Every phone target is 44px or more.
  - Parity is 29/29 text and 15/15 links.
  - The hero buttons are the kit `Go`, and every primary has its `data-cta`.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** It sells: the question, the four lines and a "Talk to sales" that stays put. But the arrival is still mostly spent where no one sees it.
   - **First visit.** The curtain starts lifting at t=2.11s, and the h1 cut-in starts at the same moment (0.8s). The curtain wipes upward from the bottom over 1s, so the top half of the screen is uncovered last. "we help?" appears at about lift+0.5s and "How can" at about lift+0.55s, and both are already seated (top-left frame). What you actually see moving is the lede fading, the panel rising 48px, then the cable: Dispatch at lift+0.72s, Support at +1.35s, Press at +1.98s, back to Sales at +2.6s, at rest by about +3.2s.
   - **After that, the first screen is dead.** Two screenshots taken 1.5s apart are byte-identical.
   - **Phone.** There is no cable, so the "sweep" is an 8px dot hopping to Dispatch and then into two pills that are off-screen. For about 1.8s neither visible dot is lit (Sales's own dot goes grey), then Sales lights again. It reads as a flicker, not a move.
   - **Return visit** (dev server, slow hydration, so weigh this lightly). The lede and panel are in by about 1.0s while the h1 slot is still blank, and the plug floats with no wire until hydration at about 1.3s. Then the h1 cuts in, last.
2. **One in, one out, or a document?** Still a short document:
   - the hero;
   - a dark Visit room, 854px tall: the word, the address, and the clock;
   - a nine-row index beside a sticky plate;
   - the Band.

   Scroll motion is the two headline cut-ins, the clock hands fading in, and the plate following the row. Nothing is pinned and nothing is scrubbed. Last review's fix 3 (a scroll story) was not taken.
3. **A real visual object in every section?** Yes: the patch panel and cable, the live clock, and the contour plate. They are three different media now. The Band is type and one button, which is what the kit Band is.
4. **One ask, sticky after the hero?** Yes:
   - The hero viewport has one solid button.
   - The "Contact · Talk to sales" bar arrives after the hero (y≈1080 on desktop, y≈1136 on the phone), and the header's "Try Hanzo" turns outline.
   - The Band repeats the ask.

   Note that the Band's headline is the Sales route's h2 word for word, so the same sentence opens and closes the page.
5. **Every hover and press answers, no jumps?** No. There are two visible breaks:
   - **Jack hover collides.** The action label sits 12px above the jack's bottom edge, and the name lifts only 6px. So the two-line "Developer Dispatch" gets "Subscribe to newsletter" printed over "Dispatch": a 17px overlap at 1470, 1440 and 1280. At 1024 it overlaps by 34px, and "Press & General" collides by 17px too. This is text on text in the hero card, on the first thing anyone hovers.
   - **The closing ask goes blank on hover.** The page's `.xct .x-btn.solid:hover { background: #3a3a3c }` also catches the kit Band's white button, which keeps its black text. Hover turns it into black on #3a3a3c, and the label all but disappears (bottom-right still).
   - **Small:** on the phone, once the row has scrolled, a sliver of the previous pill ("n") shows at the card's left edge.
6. **Overlaps, font swap, layout shift?**
   - The jack hover overlap is the only overlap (see 5).
   - No font swap, CLS 0, and no overlap between hero, buttons and nav at either size.
   - **Tiny:** on a first visit, the panel is measured under the curtain's `scale(.985)`, so during the sweep the plug sits about 6px off-centre on Press.
   - **JS off leftovers:**
     - the community plate is an empty grey box labelled "Discord";
     - the copy button is a dead control;
     - at 1470 the h1 drops to y≈580, beside the tall stack of routes.
7. **Which reference, and is its motion there?**
   - The cable spring is osply/hamol "playful but restrained micro-motion", and it is better now that the plug rides the wire.
   - The calm is Apple's, but none of Apple's pinned or scrubbed scenes are here.
   - The pointer-led details are the plate's lean and the jack's action label.
8. **Different from its neighbours?** Partly.
   - /support has moved on: a full-width h1, a search pill and a list.
   - /contact-sales still has the same skeleton as this page: a Display h1 on the left and a white shadowed card on the right. /support still uses the same h1 words.
   - The cable is this page's own signature on desktop, but the phone loses it.
9. **18 areas (PLAN-COMPONENTS)?** `docs/coverage/contact.md` is mostly true now. Verified true:
   - Sales never moves, and the 707 and 744 fits.
   - The numerals and URLs are gone.
   - The JS-off routes.
   - The nub sits on the wire.
   - The hero uses `Go`.
   - The clock's name, the reduced-motion behaviour and parity.

   Wrong or overstated:
   - "Arrival waits for the curtain… so a first visit sees them". True for the lede and panel, false for the h1, which is seated before it is uncovered.
   - "Hovering a jack shows that line's own action". It does, on top of the name, for two-line labels.
   - "The Band's button is the kit's". It is, but the page's CSS breaks its hover.
   - "The cable sweeps the four sockets". Not on the phone, where there is no cable and the lit dot leaves the screen.
   - "Scroll (the only scroll-linked part): the community plate". The two headline cut-ins are scroll-triggered too.
10. **Banned tells?** None:
    - no eyebrow;
    - no hue;
    - no gradient text;
    - no Inter;
    - no `title=` tooltips.

    No button fades on hover, though the Band button going dark-on-dark is the nearest thing to one.
11. **Copy untouched?**
    - Parity is 29/29 and 15/15. The numerals and URL lines are removed.
    - The only generated string is the clock readout, which is data.
    - The jack hover prints Hanzo's button words a second time, which adds no new words.
    - The Band reuses "Bring Hanzo to your company." and "Talk to sales". These are Hanzo's words, but now they appear twice on the page.

## Missing from the 18 areas
- **2.3 First impression:**
  - The h1 cut-in still finishes under the curtain on a first visit.
  - The first screen goes still at lift+3.2s.
  - On the phone the arrival is a flickering dot.
- **2.3 Scroll story.** A document, with no scene where one thing comes in as another goes out.
- **2.6 / 2.8 Hover.** The jack's action label collides with two-line names at every desktop width tested (1024–1470).
- **2.4 / 2.8 Conversion.** The closing ask's hover is broken by a page CSS leak (`.xct .x-btn.solid:hover`).
- **2.7 Visual.** The hero skeleton is still shared with /contact-sales.
- **2.11 Mobile.** The page's signature (the cable) does not exist under 900px.
- **2.17 States.** With JS off the plate is empty and the copy button is dead. On a return visit the plug shows before its wire.

## Fixes (in order)
1. **Fix the two hover breaks.**
   - Scope the dark hover to the hero (`.xct-route .x-btn.solid:hover`), so the Band keeps the kit's hover.
   - Give the jack's action label its own line: put the name and the label in one bottom-aligned column, with the label taking space when shown (or lift the name by the label's real height). Check "Developer Dispatch" and "Press & General" at 1024, 1280, 1440 and 1470.
2. **Let a first visit see the headline.** Start the h1 cut-in, and the lede and panel after it, once the curtain has cleared the top of the screen, not when it starts lifting: about 550ms after `hz-arrived` (or on the curtain's `transitionend`). The cable sweep comes after the h1 lands. On a return visit, hold the lede and panel until the h1 has started, and hide the plug until the wire is drawn.
3. **Give the scroll something to do** (carried over). Use the cable as the thread down the page, ending in the clock, or make the Visit room a short pinned scene (the room cuts in and the clock face scrubs to the hour). That way the three rooms hand over to each other instead of stacking.
4. **Give the phone its signature.** Draw a short cable from the chosen pill down to the route, or drop the phone sweep. Never let Sales's dot go dark while the lit dot is off-screen. Fade the edges of the jack row instead of slicing a pill.
5. **Finish the states.** With JS off, draw a static contour in the plate (or hide the plate) and hide the copy button.
