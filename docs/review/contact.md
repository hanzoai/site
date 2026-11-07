# /contact — James-eye review

Verdict: 7/10
First complaint: "I click Support, then Press, and now there are two black buttons on screen: 'Try Hanzo' up top and the route's own. On my 1280 laptop I point at 'Press & General' and it prints 'hello@hanzo.a', with the email cut off. Once the cable has done its one lap it just hangs there. On the phone nothing moves at all, and on a smaller phone I can't even see 'Talk to sales' without scrolling."

Walked 7 Nov, about 15:00 to 15:22 UTC. The page file is at `124ebd0` (`components/pages/Contact.jsx`, `Contact.css`); HEAD was `c082fb4`.
- **Filmed moving** at 1470×801 and 375×812 (touch). Each size was walked on a first visit and on a return visit (`hz-arrived` set). Desktop: wheel scroll with a dwell on every screen, plus hover and press. Phone: taps.
- **Also checked:** 320, 375×667, 1024, 1280 and 1440; JS off; JS on but the app bundle blocked; reduced motion; a Tab crawl; idle motion measured by pixel diff and wire geometry.

Stills:
- `review/contact/desktop-walk.jpg`.
  - Top row: mid-sweep with the cable on Support; the hero at rest after the sweep (it stays this way, see 1); after Support, then Press, then Support, with the header's "Try Hanzo" solid beside "Get support".
  - Bottom row: jack hover at 1024 ("newslette", "hello@har") and at 1280 ("hello@hanzo.a"); the Visit room; the black room arriving as a hard full-bleed edge.
- `review/contact/phone-walk.jpg`, left to right:
  - 375×812 at rest;
  - 375×667, where the first screen ends above "Talk to sales";
  - after tapping Support, then Press, then Support: the header's "Try Hanzo" is solid beside "Get support";
  - the clock;
  - the plate riding over the rows;
  - JS on with the bundle blocked: the h1 alone, with no lede, panel or ask.

## What works
- **Last review's two hover breaks are fixed at the widths James uses most.**
  - At 1440 and 1470, hovering a jack fades the name to 0 and puts the action in the same slot. There is no text on text.
  - The closing Band's "Talk to sales" goes from light to white on hover and keeps its black label. The page's dark hover is now scoped to the hero (`#0a0a0a` to `#262626`, with a .98 press).
- **The ask never moves.** Across 40 samples from load to 11s, the routes read 1,0,0,0 the whole time. Only the cable sweeps:
  - Dispatch about 1.0s after `go`, then Support, then Press, 0.6s apart;
  - back on Sales about 2.2s after the sweep began.

  The plug sits on the wire and stays hidden until the wire is drawn (`data-wired`).
- **The arrival works without the curtain.**
  - The curtain is now home-only (and skips headless browsers), so on /contact a first visit and a return visit are identical. Last review's "h1 finishes under the curtain" no longer applies.
  - The h1 cuts in by CSS about 0.55s after first paint, before hydration, so something moves within 1s.
  - The panel rises 24px at +150ms after hydration, and the lede follows at +300ms.
- **The phone has a cable now.** A short wire drops from the chosen pill into its route. Tapping a pill scrolls the row (never the page), and the wire follows the pill within a frame or two.
- **The other rooms are alive and correct.**
  - The clock reads 7:04 AM PST at 15:04 UTC, and the second hand ticks.
  - The Sigil plate drifts while idle and redraws on hover, focus and scroll.
  - Rows slide 10px. The copy button writes exactly "hello@hanzo.ai", and `role=status` says "Copied". With the clipboard blocked, it stays silent.
- **States:**
  - JS off: all four routes are readable, and the cable, plug, plate and copy button are hidden (0 hidden texts).
  - Reduced motion: 0 running animations at 3.5s, with the h1 in place.
- **Engineering checks pass:**
  - CLS is 0 on desktop and phone.
  - No sideways scroll at 320, 375, 1024 or 1470, and no text overlap at rest at those widths.
  - Every phone target is 44px or more.
  - Parity 29/29 and 15/15; `taste.py` OK; `unique.py` and `variety.py` OK.
  - The focus ring is 2px ink with a white halo on every stop in `main`, and arrow keys move and select the tabs.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** On desktop it sells, and the h1 moves by about 0.55s. Then:
   - **The hero goes still.** After the sweep (about 4.4s from load on the dev server), the "sway" moves the wire 1.7px horizontally and 0.6px vertically over 8s, measured at 30% of its length. You cannot see that; it reads as a dead first screen.
   - **The phone is fully still.** It has no sweep and no sway, because the sway waits for `held`, which only the desktop sweep sets. Two screenshots 2s apart at +5s are byte-identical.
   - **375×667:** "Talk to sales" sits at y=665–713. The first screen ends 2px into it, and no ask bar covers for it, since the bar waits until the hero ask has scrolled away.
   - **Bundle fails** (JS on, app scripts blocked): the lede and the whole panel stay at opacity 0 indefinitely. Their entrance is paused until React sets `data-go`, and there is no CSS failsafe. The first screen is the h1 on white with no ask.
2. **One in, one out, or a document?** There are four rooms, one idea each: hero, Visit and its clock, the community index and plate, and the Band. MASTER 4.5 says Utility has "no scroll theatre", so I don't count the missing pinned scene against it (last review did). The scroll motion is the two section cut-ins and the plate following the row.
3. **A real visual object in every section?** Yes: the patch panel and cable, the live clock, the contour plate, and the Band's type and button.
4. **One ask, sticky after the hero?** Mostly:
   - **Working:**
     - the "Contact · Talk to sales" bar arrives at y≈866 on desktop and y≈1040 on the phone;
     - the bar yields to the Band;
     - the header's "Try Hanzo" is outline while the hero ask shows.
   - **Broken: two solid fills.** From the second route switch onward, the header's "Try Hanzo" turns solid while the route's own solid button is on screen. It stays that way until the page scrolls. Reproduced on every run, desktop and phone:
     - Sales, then Support: one fill;
     - then Press: "Try Hanzo" and "hello@hanzo.ai";
     - then Sales: "Try Hanzo" and "Talk to sales";
     - a 3px scroll clears it.
   - **Cause.** The shared Ask layer re-checks on the DOM change, while the old route is already inert and the new one is still under opacity .6. Nothing re-checks once the new route has faded in.
5. **Every hover and press answers, no jumps?** Not at every width.
   - **The jack's action is clipped.** It got its own slot, but the slot has `overflow:hidden`:
     - at 1280, "hello@hanzo.ai" needs 110px in a 106px slot and shows "hello@hanzo.a";
     - at 1024 the slot is 74px: "hello@har", and "Subscribe to newsletter" breaks to three lines ending "newslette".

     1280 is a common laptop width, and what prints is Hanzo's email, cut.
   - **Everything else answers:** the hero ask, See Enterprise (underline plus a 4px arrow), copy, the rows, the plate and the Band.
6. **Overlaps, font swap, layout shift?**
   - Desktop and phone: no overlap at rest, no font swap and CLS 0.
   - The clipped hover label is the visible break (see 5).
   - JS off, carried over: at 1470 the h1 still drops to y=609–785 beside the stacked routes, with the lede below the fold. The four jacks show as buttons that do nothing.
7. **Which reference, and is its motion there?**
   - The cable lap is osply/hamol micro-motion, and it is clean: the plug rides the wire and nothing else moves.
   - The calm is Apple's.
   - The idle half of the idea, a cable that hangs and sways, is invisible at 1.7px.
8. **Different from its neighbours?** Partly.
   - /support has moved away: a full-width h1, a search pill, a card and a list.
   - /contact-sales and /press still share this page's skeleton: a Display h1 on the left and a framed object on the right.
   - /contact's object (the patch panel) is its own.
9. **18 parts?** `docs/coverage/contact.md` is mostly true. Verified true:
   - the routes never move;
   - the nub on the wire, and the plug hidden until wired;
   - the Band hover;
   - the JS-off plate and copy button;
   - reduced motion, parity and CLS.

   Wrong or overstated:
   - **Part 11, "Primary ask above the fold at 375×667":** false (665–713).
   - **Part 1, "One solid fill per viewport":** false after any second route switch.
   - **Part 6, "Checked at 1024, 1280 and 1470… the action sits inside the jack":** it is clipped at 1024 and 1280.
   - **Parts 3 and 9, "then it sways while idle":** it does, by 1.7px. On phones it does not sway at all.
   - **Part 3, "550ms after the curtain starts lifting":** there is no curtain on /contact. This is harmless, but the card describes a path that never runs.
   - **Part 17, "a thrown island does not blank the page":** a failed bundle blanks everything under the h1 (see 1).
10. **Banned tells?** None: no eyebrow, hue, gradient text, Inter, `title=` or fading button.

    One taste note: the hero object is boxes inside boxes. An outlined card holds four outlined jack tiles above a filled route tile. MASTER 3.1 says "raise a surface or outline it" and "tiles are flat fills with no outline".
11. **Copy untouched?** Parity is 29/29 and 15/15. The one problem is the jack hover, which prints Hanzo's button words truncated ("hello@hanzo.a") at 1280 and below.

## Missing from the 18 parts
- **Part 1 / 4, one solid fill.** The header ask turns solid beside the route's button after route switches.
- **Part 3, first impression:**
  - The hero is still after about 4s on desktop, and still from the start on phones.
  - The h1 baseline sits at about 62% of the screen at 1470×801, against MASTER's "near 38%", and the next section does not peek.
  - With JS on and the bundle failed, only the h1 shows.
- **Part 3 / 11, phone fit.** "Primary inside 660px" and "ask above the fold at 375×667" both fail (the ask is at 665–713).
- **Part 6 / 8, hover.** The jack action is clipped at 1024 and 1280.
- **Part 7, rooms.** The Visit room arrives as a hard full-bleed edge. MASTER 3.1: "A black room enters as a rounded card inside the gutters and opens to full width as it is reached."
- **Part 7, type.** "Visit" is set at the h1's 84px (Display) and the address at 64px. The deck's section heading is clamp(36px, 5.3vw, 64px). With the 32px readout and the 21px city, that screen holds 4 sizes; MASTER allows 3.
- **Part 17, states.**
  - JS off at 1470: the h1 drops to y=609, and the jacks are dead buttons.
  - Bundle failure: the ask is invisible.

## Fixes (in order)
1. **Keep one solid fill after a route switch.** Once the new route has faded in (about 400ms), make the Ask layer look again. For example, dispatch a `scroll` event when the route's animation completes, which a 3px scroll proved is enough. Check Sales → Support → Press → Sales at 1470 and 375: the header must stay outline. If it needs a layer change, write `docs/requests/contact.md`.
2. **Make the jack's action fit at every width.**
   - "hello@hanzo.ai" needs 110px, and the slot is 106px at 1280 and 74px at 1024. Below about 1400px, either keep the name and let hover answer with the border, the dot and the wire's lean, or print the action as one line under the jack row.
   - Never clip or break the email.
   - Check 1024, 1280, 1440 and 1470.
3. **Fit the phone's first screen.** "Talk to sales" must end above 660px at 375 wide, so it needs about 55px back. Take it from the hero's 88px top padding, the 40px margin above the panel and the route's top padding. Then check 375×667 and 375×812.
4. **Give the hero a visible rest, on desktop and phone.**
   - Make the sway one slow, visible drift (the wire's belly moving about 8–12px), still the viewport's one continuous mover.
   - Start it on phones too, after the entrance (set `held` there).
   - Keep it off under reduced motion.
5. **Don't hang the ask on hydration.** With the curtain gone from /contact, run the lede and panel entries on a CSS delay like the h1, or add a CSS failsafe that shows them by about 2.5s. Test with the app scripts blocked.
6. **Smaller items:**
   - Let the Visit room enter as a rounded card inside the gutters that opens to full width.
   - Set "Visit" at the section-heading size.
   - With JS off, top-align the hero so the h1 sits on the first screen, and make the jacks anchor links to their routes, or hide them.
   - Correct the coverage card (parts 1, 3, 6, 9, 11 and 17).

Not this page's (mentioned because they touch it):
- The kit `Go` wraps each link in a `motion.span` whose `whileTap` makes it focusable, so every `Go` is two Tab stops ("Talk to sales" twice in the hero and twice in the Band).
- With the ask bar up, tabbing to the X, Reddit and TikTok rows leaves them partly under the bar (shared `scroll-padding-bottom`).
- A hydration-mismatch badge appeared twice, at 15:06 and 15:12, while other chats were pulling and rebuilding. It did not come back in 14 clean loads, so it is not counted.
