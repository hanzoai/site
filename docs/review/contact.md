# /contact — James-eye review

Verdict: 7/10
First complaint: "I land, I see 'Talk to sales', and before I can click it the box turns into a newsletter, then support, then an email. Don't move the one button I came for. And the headline animation plays behind the loading screen, so I never see it."

Walked 7 Nov, about 14:00 to 14:15 UTC. Page file at `c250965` (`components/pages/Contact.jsx`, `Contact.css`), HEAD `521755e`. Filmed moving at 1470×801 and 375×812: wheel scroll with a dwell on every screen, hover and press on desktop, taps on the phone. Also checked a return visit with no curtain, reduced motion, JS off, and 320 and 375 widths.

Stills:
- `review/contact/desktop-walk.jpg`. Top row: Sales at rest; one second after the curtain, already on Developer Dispatch; the cable mid-swing at 210ms. Bottom row: the Visit room, the community, the plate on hover.
- `review/contact/phone-walk.jpg`. Sales; 2.5s later on Dispatch; the Press route with copy; Visit; the clock; the community.

## What works
- **Colour and headline.** Ink, greys and white only. The h1 is a real Display moment: Zen at 135px with line height 0.92.
- **Fits both screens.** At 1470×801 the h1, the lede and "Talk to sales" fit (button bottom at y=693). At 375×812 the Sales button ends at y=722.
- **The patch cable is the page's own idea.** It swings on a spring and settles in about 0.7s. The old route lifts out and the new one rises in. Arrow keys move the tab.
- **Reduced motion.** There is no auto-patch, and 0 animations are running after 4s.
- **Sticky ask.** After the hero, the "Contact · Talk to sales" bar arrives at both widths, and the header's "Try Hanzo" turns outline.
- **Every hover and press answers, with no jumps:**
  - Sales goes from #0a0a0a to #3a3a3c, and press scales it to .98.
  - "See Enterprise" and "Book a 30-minute call" underline and nudge their arrow.
  - Community rows slide 10px, the URL inks, the arrow lifts, and the plate redraws with its name springing up.
  - The copy button draws a tick and announces "Copied" through `role=status`.
- **Clock and plate.** The San Francisco clock is live and ticks only while it is on screen. The community plate drifts and leans toward the pointer.
- **Engineering checks pass:**
  - CLS is 0 at both sizes, and no console errors appeared.
  - Nothing overlaps at either size.
  - There is no sideways page scroll at 320 or 375.
  - Every phone target is 44px or more.
  - Parity is 29/29 text and 15/15 links.
  - All four primaries carry `data-cta`, and the file has its Persona/Goal/CTA header.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** The words sell: "How can we help?" and four named lines. But the ask does not hold still.
   - The auto-patch fires 2.2s after hydration and does not wait for the site curtain (2.9s here).
   - On a first visit, "Talk to sales" is on screen for about 0.5s after the curtain lifts. Then the route becomes "Subscribe to newsletter", then "Get support", then "hello@hanzo.ai". Sales only comes back about 8s later.
   - On a return visit (no curtain), Sales holds for 2.2s and then leaves for the same 7.8s.
   - Hovering the panel does not pause it, so the button you aim at can change under the pointer.
   - Movement: the h1 cut-in and the panel rise both finish under the curtain, so a first visit never sees them. What moves after the lift is the panel switching away from Sales. Between lift+1s and lift+2s, the first screen changes by 0 pixels. After about 10s it rests, and from then on the first screen is still.
2. **One in, one out, or a document?** A short document in three blocks:
   - the hero;
   - a dark "Visit" room, 896px tall for 264px of text, over a still contour, with a ticking clock;
   - a nine-row community index beside a sticky plate. This is the closest thing to a scene: the plate holds while the rows pass.

   Scroll motion is two headline cut-ins ("Visit", "Join the community"). Nothing is pinned and nothing is scrubbed.
3. **A real visual object in every section?** Yes, but the same one twice.
   - Hero: the patch panel.
   - Visit: the clock, plus a contour field.
   - Community: another contour plate.

   The Visit "map" and the community plate are the same Sigil contour language, in back-to-back sections. No Hanzo media, but none exists for this page, so this is not penalised.
4. **One ask, sticky after the hero?** Yes, at both widths ("Talk to sales" bar, header outline). In the hero itself, see 1: for most of the first 10 seconds the solid button is a different verb.
5. **Every hover and press answers, no jumps?** Yes on desktop (see What works). Phone taps answer:
   - the chosen jack scrolls into view in its row, and the page never scrolls sideways;
   - the copy tick shows.

   Small faults:
   - Jack hover only darkens the border, and tells you nothing.
   - On touch, the community plate never changes before the link leaves the page, so on a phone it is a static "Discord" card above the Discord row.
6. **Overlaps, font swap, layout shift?** No overlap, no swap (Zen loads under the curtain) and CLS 0 at both sizes. Two flaws:
   - **During the swing:** the cable's top end slides across the jack row while the jack's nub jumps instantly. For about 300ms the wire hangs from empty air (still 3 in the desktop strip).
   - **JS off:**
     - Dispatch, Support and Press stay at opacity 0, and their jacks are dead, so three of the four routes (and hello@hanzo.ai) cannot be reached.
     - The clock's hands read 12:00.
     - The cable plug floats with no wire.
     - Both plates are empty grey boxes.
7. **Which reference, and is its motion there?**
   - The cable spring is the osply/hamol "playful but restrained micro-motion", and it is really there.
   - The calm, one-idea-per-screen feel is Apple.
   - But none of Apple's pinned or scrubbed scenes are here. The pointer-aware plate is the only cursor-led detail.
8. **Different from its neighbours?** Only partly. The cable is its own signature, but the frame is the company-kit frame shared by /contact-sales, /support, /careers and /press: a Display headline on the left and a white shadowed card on the right. /support even has the same h1 words, and a mono-URL channel list much like this page's community index.
9. **18 areas (PLAN-COMPONENTS)?** See below. `docs/coverage/contact.md` exists, but three claims are wrong or overstated:
   - "Talk to sales sits above the fold". True for about 2s, then gone for about 8s.
   - "No wrong server time". The server HTML draws the hands at 12:00.
   - "The '01 / 04' route counters are gone". 01–04 now sit on the jacks.
10. **Banned tells?** None of the list:
    - no eyebrow over any headline;
    - no hue;
    - no gradient text;
    - no Inter;
    - no `title=` tooltips;
    - no button that fades on hover.

    Borderline: the mono "01–04" over each jack label reads as small kickers.
11. **Copy untouched?** Nothing lost (29/29, 15/15). Things added that are not on hanzo.ai/contact:
    - the "01"–"04" numerals;
    - nine mono URL lines under the networks ("discord.gg/XthHQQj" and the rest);
    - the clock readout.

    The live clock is the kind of object JAMES.md asks for. The numerals and URLs are new visible text and need James's yes. `parity.py` is one-way and does not catch additions.

## Missing from the 18 areas
- **2.1 / 2.4 Conversion:**
  - The page's one primary leaves the hero 2.2s after arrival and is replaced by three other solid verbs for 7.8s.
  - There is no pause while the pointer is over the panel.
- **2.3 First impression:**
  - The arrival (h1 cut-in, panel rise, first patch) is spent under the curtain.
  - **Page ending:** there is no closing Band. The page ends on the Instagram row and drops into the footer.
- **2.3 / 2.17 No-JS and states:**
  - three routes are invisible and unreachable;
  - the clock reads 12:00;
  - the plug floats;
  - the plates are empty.
- **2.6 Content:** the numerals and URL lines are added text.
- **2.7 Visual:**
  - the contour graphic appears twice in a row;
  - the hero skeleton matches the neighbouring pages.
- **2.8 Components:**
  - A page-local tablist instead of the kit `Tabs`.
  - Raw `.x-btn` instead of `Go` (§4 gate 2).
  - No `Band`.
- **2.9 / 2.12 Motion and accessibility:**
  - The route swap runs by itself for about 10s, with only "pick a jack" as a stop (WCAG 2.2.2 territory).
  - The cable end detaches from the jack mid-swing.
  - The plate redraw is a hard cut, not a morph.
  - The clock's accessible name is only "San Francisco", so screen readers never get the time.

## Fixes (in order)
1. **Never take "Talk to sales" off the screen.** Keep the arrival flourish, but make it the cable alone: one sweep across the four jacks (each lights as the plug passes) that lands back on Sales, while the Sales route stays put. If routes must swap, pause on `pointerenter` or `focusin` on the panel, and stop for good after one pass.
2. **Start the arrival after the curtain.** Gate MaskLines `now`, the `.xct-in`/`.xct-in2` keyframes and the patch timer on the `hz-arrived` event (or `html:not(.x-arriving)`), so a first visit sees the h1 cut in and the panel rise.
3. **Give the page its own scroll story.** Use the cable as the thread: one wire that runs down the page as you scroll, plugs into the clock in the Visit room, then into the community index. That gives "one comes in, one goes out" and a page /contact-sales and /support do not have. It also lets you drop one of the two contour fields:
   - either keep the map in Visit and let the index rows carry the hover preview inline;
   - or keep the plate and make the Visit room the clock alone, with the room cut down from 896px.
4. **Close with the kit `Band`.** Use Hanzo's own words ("Bring Hanzo to your company." with one solid "Talk to sales"), so the page does not end on a link row.
5. **Remove the additions.** Take off the 01–04 jack numerals and the mono URL lines, or get James's yes. The jack's hole and its name are enough.
6. **Fix the states and the cable:**
   - With JS off, show all four routes stacked (`html:not(.js)`), hide the dial's hands until the first tick, and hide the plug when there is no wire.
   - Move the jack's nub with the cable's end, so the plug lifts out of one socket and seats in the next.
   - Build the hero buttons with `Go`.
