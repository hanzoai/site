# /contact — James-eye review

Verdict: 7/10
First complaint: "The top's good now. But the bottom half is a list of giant names, big, big, big, nothing small. And on my laptop 'Talk to sales' is gone the moment I scroll."

Walked 7 Nov at about 14:45 UTC (after the 14:45 refresh), page file at `94acb12` (`components/pages/Contact.jsx`, `Contact.css`), on main plus the Company branch. Filmed moving at 1470×801 and 375×812 (wheel and finger scroll, dwell on every screen, hover and press on desktop, taps on phone), plus reduced motion and JS off. Judged by `JAMES.md` and `MASTER.md` (Utility, §4.5). Stills: `review/contact/desktop-walk.jpg`, `review/contact/phone-walk.jpg`. This replaces the 6/10 review of `f33ebae`.

## What works
- The recolour is clean: ink, greys and white only, with no labels over the headlines (`taste.py` passes).
- The patch panel is still the page's own idea. After the curtain, the cable sweeps the four sockets once and lands back on Sales, and the Sales route never moves. The routes no longer switch by themselves.
- At 1470×801 the h1, lede and "Talk to sales" sit above the fold (button at y=655). On the phone the jacks are a swipe row, so the Sales route and its button fit the first screen.
- "Visit" is a real object: the address beside a big live San Francisco clock in the one dark room. The page now ends on a closing Band, "Bring Hanzo to your company." with one solid "Talk to sales".
- JS off: 0 hidden text (it was 11 of 19). Reduced motion: 0 running animations. No layout shift, no tap target under 44px. Parity: text 29/29, links 15/15.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes. "How can we help?", four lines and the cable sweeping once. After the sweep the hero rests; only the clock keeps time further down.
2. **One in, one out, or a document?** Better: panel, dark clock room, community, Band. But the community section is one long list of nine giant names, which reads as a list, not a scene.
3. **A real visual object in every section?** Yes: panel, clock, contour plate, Band.
4. **One ask, sticky after the hero?** Phone: yes, a slim "Talk to sales" bar, though it sits over the community rows (it covers "GitHub" and "X" as they pass). Desktop: no. After the hero the only solid is the header's "Try Hanzo", a different ask. Under MASTER §3.2 rule 6 the page's ask must live in the sticky header at every width.
5. **Every hover and press answers, no jumps?** Yes on desktop: a jack hover shows its line's action, and press is .98. On the phone the copy button shows nothing visible when tapped.
6. **Overlaps, font swap, layout shift?** None at 1470. On the phone, the community plate rides at the top while the rows slide under it, and it shows the same word as the row beneath ("Discord" over "Discord"), so the big word appears twice.
7. **Which reference, is its motion there?** grubogrubo and hamol: whole-row contact links and playful, restrained micro-motion. Yes.
8. **Different from neighbours?** The object is its own. The hero frame (left Display headline, right object) is still shared with /contact-sales, /support, /press, /investors, /brand and /careers.
9. **18 parts (MASTER §2)?** See the card check below.
10. **Banned tells?** One, plus a token break:
    - **Everything big at once** in the community section: nine names at about 40px, one per row, with nothing medium or small beside them. The mono address lines that gave it a small layer were deleted.
    - **Token break:** the cable and the plate name use springs (`stiffness 140, damping 16` overshoots). MASTER §3.1 says no springs, no overshoot.
11. **Copy untouched?** Yes (parity clean).

## Card check (`docs/coverage/contact.md`)
- **Format.** The card is 18 numbered paragraphs, not the template's `## 1.` to `## 18.` headings with `Done here:` lines, so the board cannot count it as 18 of 18.
- **Part 4 is false at 1470.** It claims the ask bar rises "after the hero at every width". On desktop no bar or header ask appeared; only "Try Hanzo".
- **Part 9 conflicts with MASTER §3.1.** "Seats it in the next on a spring" breaks the no-springs rule.
- **Part 12 is unverified.** "Reports through `role=status`": no visible confirmation on a phone tap.
- **Verdict capped at 7** for the false Part 4.

## Fixes (in order)
1. **Put "Talk to sales" in the sticky header** at every width (the page's `data-thumb` label in the header slot, solid once the hero button leaves). Drop the floating bar on desktop. On the phone, keep the slim bar only if the page reserves space so it never covers a row.
2. **Give the community list rhythm.** Bring the names down to the section-heading size (26px). Let only the row you are on grow, then settle back. On the phone, drop the duplicate name from the sticky plate (or the plate itself) so "Discord" is not shown twice.
3. **Replace the springs** on the cable and the plate name with `ease-emphasis` at 300 to 400ms. The plug still seats; it just does not bounce.
4. **Show "Copied"** (or a tick) when hello@hanzo.ai is copied on a phone, using the register string.
5. **Rewrite the card in the template format** (`## 1.` to `## 18.`, each with a `Done here:` line) and correct Part 4.
