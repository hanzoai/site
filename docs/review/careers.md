# /careers — James-eye review

Verdict: 6/10
First complaint: "Why is it orange everywhere? I said black, white and greys. And on my laptop I can't even see the button."

Walked 7 Nov, page file at `a6b414d` (`components/pages/Careers.jsx`, `CareersBoard.css`, `careers/`). Filmed moving at 1470×801 and 375×812 (wheel and finger scroll, dwell on every screen, hover and press on desktop, taps on phone), plus reduced motion and JS off. Stills: `review/careers/desktop-walk.jpg`, `review/careers/phone-walk.jpg`.

## What works
- The headline is a real Display moment: 112px, line height 0.92, cuts in by line. CLS 0, 60fps, fonts load under the arrival curtain, so no swap.
- The "How we hire" card turns itself every few seconds with a filling bar. Something moves without input.
- The roles are a deck: each sheet rises over the last as you scroll. That is "one comes in, one goes out".
- The filters and "Match what you know" chips change the list in place. Every desktop hover answered; press scales to .98.
- Parity: text 76/76, links 13/13. Reduced motion leaves 0 running animations.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** The words sell. But at 1470×801 the ask "View Open Positions" sits at y=798, under the fold, and the lede is cut in half. Movement: yes (line cut-in, card turning), once the 2.4s site curtain lifts.
2. **One in, one out, or a document?** Half and half. The role deck is a scene. "How the team actually works" is a plain list, and "Academic Internships" is two boxes of paragraphs.
3. **A real visual object in every section?** No. Hero card and giant numerals, yes. The perks list, the "Open Positions" header and the dark close have nothing to look at. No Hanzo imagery anywhere.
4. **One ask, sticky after the hero?** Phone: yes, a "View Open Positions" bottom bar. Desktop: no sticky ask; only the site header's "Try Hanzo", a different ask. And the page has many solid buttons: 7 black "Apply for this role", plus "Apply for Research Internship" and "Apply for Credit Grant" side by side as two equal solids.
5. **Every hover and press answers, no jumps?** Desktop yes. Phone: tapping "Copy direct link" shows no confirmation. 7 copy buttons use the browser's native `title` tooltip.
6. **Overlaps, font swap, layout shift?** No shift, no swap. But the hiring card cross-fades its step text, so for a moment two step titles sit on top of each other. Phone tap targets under 44px: "Read the history" and every "View Details" (21px). JS off: 6 of 23 text blocks stay invisible.
7. **Which reference, is its motion there?** synchronized.studio is claimed, but the white sheet you click lands on a dark, monospace, typewriter card with a blue cursor (the role page). The card does not become the next page's hero. The deck feels like Apple; the type feels like osply.
8. **Different from neighbours?** Only partly. Same build as /affiliate: mono kicker top left, Display headline left, object right, orange accent, dark closing room. Two pages in a row that look like one template.
9. **18 areas (PLAN-COMPONENTS)?** See below. No `docs/coverage/careers.md`.
10. **Banned tells?** Yes:
    - an eyebrow over the h1 ("CAREERS") and over headlines ("BENEFITS & PERKS", every role's category, "SUBMIT OPEN APPLICATION");
    - UI colour: orange (`#ff5b1f`) on the 01–07 numerals, kickers, progress bars, the card glow and the email link (JAMES.md: 0 UI hues);
    - native tooltips.
11. **Copy untouched?** Yes (parity clean; "2,137+" traces to the live careers page).

## Missing from the 18 areas
- **2.3 First impression:** h1, lede and primary do not fit 1470×801. No closing Band in Hanzo's words with one solid button (the close has a white solid plus an orange email link).
- **2.3 Morph:** the title does not land on the destination h1. The clicked sheet and the role hero look like different objects.
- **2.4 Conversion:** one solid per viewport fails (deck sheets, academic pair). No desktop sticky ask.
- **2.7 Visual system:** the orange accent breaks the 0-hue rule and repeats /affiliate's colour.
- **2.8 Components:** native `title=` tooltips; copy confirmation missing on tap.
- **2.10 Media:** no image or film at all.
- **2.11 / 2.12:** 21px tap targets on phone; hidden text with JS off.
- **2.18 Measurement:** no `Persona:` / `Goal:` / `CTA:` header lines, no `data-cta`.

## Fixes (in order)
1. **Strip the eyebrows.** Delete the "CAREERS" kicker over the h1, and the mono labels over "How the team actually works.", over "Don't see a position…" and over each role title. Put the role category in the meta row beside "Remote / SF · Full-time".
2. **Take the orange out of the UI.** Numerals 01–07 in ink (or a silver alpha step), progress bars white on the dark card, no orange glow, careers@hanzo.ai in white with an underline. Colour may only come from a Hanzo image.
3. **Fit the hero to 1470×801.** Cap the h1 so the lede and "View Open Positions" sit above the fold (about 96px, or let it break into 3 lines). Then add the desktop sticky "View Open Positions" once the hero button leaves (phone already has it).
4. **One solid button per screen.** On the sheets, "Apply for this role" becomes outlined or a text link (the sheet itself is the click). In Academic, keep one solid and make the other a text link.
5. **Make the click continuous.** The role page's hero should be the same white sheet: same title type, same numeral, landing where it was. Or restyle the sheet to match the role hero. Today it flies into a different object.
6. **Give the quiet sections an object, and fix the card fade.** Pin the four perks so one comes in as the last goes out, each with its giant numeral in ink. In the hiring card, swap the cross-fade for a mask slide so two step titles never overlap. Make tap targets 44px, and show "Copied" when the link is copied.
