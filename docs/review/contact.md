# /contact — James-eye review

Verdict: 6/10
First complaint: "There's a little blue word sitting on top of the headline again. I said no labels over titles, and blue isn't us."

Walked 7 Nov, page file at `f33ebae` (`components/pages/Contact.jsx` and its css), on main plus the Company branch. Filmed moving at 1470×801 and 375×812 (wheel and finger scroll, dwell on every screen, hover and press on desktop, taps on phone), plus reduced motion and JS off. Stills: `review/contact/desktop-walk.jpg`, `review/contact/phone-walk.jpg`.

## What works
- The patch panel is a real idea, not a template. Four jacks; the cable swings on a spring from the jack you pick into its route, and the route card swaps cleanly. Left alone, it patches each line in turn, so the hero moves without input.
- The dark room is a real object: "1 Ferry Building" set huge over a contour map, with a ticking San Francisco clock and "8 hours behind you". That is time-based motion done well.
- "Join the community" is a big typographic index with whole-row hit areas (grubogrubo's contact rows). Every hover answered; press on a jack scales to .98.
- No layout shift, 60fps, and reduced motion leaves 0 running animations. Parity: text 29/29, links 15/15.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes on desktop: "How can we help?", the four routes and the cable moving. On the phone the first screen is headline, lede and jacks, but the route card with its button falls under the fold.
2. **One in, one out, or a document?** Calm and short (3 sections), not a document. But nothing is chaptered: it is hero, dark room, list, footer.
3. **A real visual object in every section?** Hero: yes (panel). Visit: yes (map and clock). Community: big type only, which is acceptable for an index.
4. **One ask, sticky after the hero?** No. Desktop has no sticky ask, only the site header's "Try Hanzo". The phone shows a "Talk to sales →" bar mid-page that drops away before the end. The page ends straight into the footer with no closing ask.
5. **Every hover and press answers, no jumps?** Desktop yes. On the phone, tapping "Copy address" shows no confirmation.
6. **Overlaps, font swap, layout shift?** No shift, no swap. While a route swaps, the outgoing and incoming text briefly sit on top of each other ("02 / 04" over "03 / 04"). JS off: 11 of 19 text blocks stay invisible.
7. **Which reference, is its motion there?** grubogrubo and hamol: playful but restrained micro-motion, plus whole-row contact links. That is there. No card opens into a page here.
8. **Different from neighbours?** The object is different. The frame is not: the kicker over a left Display headline with an object on the right is the same as /contact-sales, /support, /press, /investors, /brand and /careers. Seen in a row, the Company pages read as one template in eight colours.
9. **18 areas (PLAN-COMPONENTS)?** See below. No `docs/coverage/contact.md`.
10. **Banned tells?** Yes:
    - an eyebrow over the h1 ("CONTACT") and over "1 Ferry Building" ("VISIT");
    - a blue UI hue (`#0a84ff`) on the kicker, the jack dots, a cable segment and the clock hand (JAMES.md: 0 UI hues; `docs/review/SYSTEM.md` now gives grey tokens for this).
11. **Copy untouched?** Yes (parity clean).

## Missing from the 18 areas
- **2.3 Page endings:** no closing Band. The community list runs into the footer.
- **2.4 Conversion:** no desktop sticky ask; the phone bar is not there at the end; no `data-cta`.
- **2.7 Visual system:** blue accent instead of the grey deck.
- **2.8 Components:** "Copy address" has no visible "Copied" state on tap.
- **2.11 Mobile:** the phone hero hides the route card's button below the fold.
- **2.17 States:** most text is invisible with JS off.
- **2.18 Measurement:** no `Persona:` / `Goal:` / `CTA:` header lines.

## Fixes (in order)
1. **Delete the kickers** "CONTACT" over the h1 and "VISIT" over "1 Ferry Building".
2. **Turn the blue into ink.** Jack dots, the cable highlight, the kicker and the clock's second hand go to grey and silver tokens (`var(--room-ink)` and the silvers in `app/system.css`).
3. **Give it an ending and a sticky ask.** After "Join the community", add a closing Band that repeats "Talk to sales" as the one solid button. Keep that ask sticky after the hero at both widths: a desktop bar and the phone bar all the way down.
4. **Phone hero.** Put the chosen route's button above the fold at 375×812, for example by making the four jacks a single row of chips so the route card rises.
5. **Clean swap and copy feedback.** Mask-slide the route text instead of cross-fading it so two labels never overlap, and show "Copied" when the address is copied.
6. **Break the shared frame.** This page's moment is the cable, so let the panel lead: make it larger and centred, with the headline set over or beside it in a different arrangement from the other Company pages.
