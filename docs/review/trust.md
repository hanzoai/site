# /trust — James-eye review

Verdict: 6/10
First complaint: "The top's good, the drawers are alive, then it turns into a document. Two screens of 'Where we stand' paragraphs with nothing to look at, and the black button in the header is cut off at both ends. It's not premium if the ask is clipped."

Walked on 7 Nov with Playwright (Chromium) against the live dev server at 1470×801 and at 375×812 (isMobile, hasTouch). Video was recorded at both sizes. I wheel-scrolled the whole page in 100px notches with a 140ms pause (62 notches on desktop, 96 on phone) and took a frame burst every 4 notches. I hovered and pressed the hero ask, hovered and clicked the cabinet drawers, then left the pointer resting on the cabinet for 5s. I hovered the two paper cards, typed into Find a control ("scim", then a term that matches nothing, then cleared it), and opened a group sheet with + and closed it with Esc. I also checked reduced motion and recorded console errors. The page changed while I was walking it: the coordinator's fix for the 1052px sideways overflow went in. I walked it again afterwards, and horizontal overflow is now 0 at both sizes (scrollWidth 1470/1470 and 375/375). Working files are in /tmp/claude-0/-home-user-hanzo-site/715b2a45-dd44-5306-98d1-bc0b4d91bc34/scratchpad/critic/trust/ (r2/ holds the post-fix walk).

## What works
- **First screen sells, and moves within 1 s.** The h1 "Security you can read" cuts in by line mask. Within about 650 ms the evidence cabinet starts pulling its drawers out by itself: 01/06, then 02/06, with the tray on the right swapping its big 64px index and its contents. This is a real live object and the page's own signature, and it differs from its neighbours.
- **The cabinet answers the hand.** Clicking a drawer opens it, and it stays put while the pointer rests on it (after 5s it was still on 05). The Published mark is filled ink and On request is hollow, so there is no hue.
- **Find a control is the best moment on the page.** You type "scim" and the count drops from 16 to 1. The matching control appears in place under "Getting in", and the groups that don't match grey back. This is a real "Beyond" aid built from Hanzo's own facts.
- **The detail sheet** rises from the right with a scrim, its sections are numbered, and Esc closes it.
- **Hero ask:** hover lifts it 1px and darkens it, and press scales it to 0.97. That answers the press without relying on opacity.
- **The paper cards** sit tilted and straighten and lift 6px on hover.
- **Reduced motion** shows the h1 and drawer 01 open as the final state, and `getAnimations()` is empty after 3.5s.
- **Phone hero composition:** h1, lede, ask and the top of the cabinet all fit inside the first 812px. The cabinet stacks cleanly and nothing overlaps the content.
- **Palette** is monochrome throughout, with one black room at the end.

## What fails (ranked, each with a concrete fix the owner can make in the page's own files)
1. **"Where we stand today" and "Where we stand" are two text-only sections back to back, a dead document stretch.** On desktop that is about 2.5 screens: a 26px paragraph statement, two columns of small prose, then four columns of prose (Frameworks, FIPS, Passkeys, Availability). On phone it is about 3.5 screens of paragraphs with no object at all. This is the exact "overload / document" James rejected.
   - Fix, in `components/pages/Trust.jsx` and `Trust.css`: give the stance section one object without touching the copy. Make the four "Where we stand" items a pinned stage in which one item is in focus at a time and the others are collapsed rows (the heading stays visible and the body opens), with a hollow or filled mark per item. Alternatively, put the four headings in the cabinet's drawer and tray pattern so only one body shows at once.
   - Set the "today" statement as one line-mask cut-in or a scroll word reveal, and move its two follow-up paragraphs into an inline disclosure.
   - On phone, the four items become an accordion.
2. **The header ask is clipped on desktop.** Once the hero ask scrolls away, the header button swaps to "Request a review or an enterprise deployment". It is 240px wide but the text needs 276px, so it reads "uest a review or an enterprise deploym" for the whole rest of the page. This is the page's one ask and it looks broken.
   - Fix: the header is shared, so do not edit `Chrome.jsx`. Instead, file `docs/requests/trust.md` asking the header owner to let the sticky ask size to its label (no fixed or max width, `white-space: nowrap`, width from content). Until that lands, the page should not hand a 44-character label to the header slot: pass the header the shorter existing label if `lib/cta.js` has one, or keep "Try Hanzo" there.
3. **A hydration mismatch console error and the red "1 Issue" dev badge.** This showed on fresh loads in 3 of 6 runs at both sizes: "A tree hydrated but some attributes of the server rendered HTML didn't match the client properties."
   - Fix in `Trust.jsx`: look for client-only values in the first render. Candidates are the paper cards' random or idle tilt transform, any `useReducedMotion()`-driven inline style, and `at` or drawer state set differently on the server. Initialise those deterministically, and apply the motion-dependent values in `useEffect` after mount (or behind a `mounted` flag).
4. **Large dead gaps.** On desktop there are about 250px of empty white under the cabinet and about 150px of empty white plus about 160px of empty grey above "Find a control". The "one thing in, one thing out" overlap of 40px is not happening: sections end and then air follows.
   - Fix in `Trust.css`: tighten the section padding after `.xtr` cabinet and around `.xtr-ctl` toward the deck's `clamp(72px, 11vw, 188px)` lower bound. Let the next object peek into the current screen.
5. **Drawer and + hover answer only through the border or nothing.**
   - Drawer rows change only border-color, from 10% to 30% black. The + buttons in "Find a control" show no hover change at all (bg and transform stay the same).
   - Fix in `Trust.css` (inside `@media (hover:hover)`): on drawer hover, slide the row out 4–8px (the same move the drawer makes when it opens, so hovering previews the pull) and darken its index. On `.xtr-g-btn` hover, rotate the + 90° or scale it to 1.06, and give the group row a quiet `#f5f5f5` row-hover fill.
6. **Touch targets are under 44px on phone.**
   - "Read the Data Processing Addendum →", "Read the subprocessor register →" and the four "Ask for it →" links are 32px tall. The `security@hanzo.ai` and "the security page" links in the black room are 21–22px.
   - Fix in `Trust.css` `@media (max-width: 899px)`: give `.x-arrow` in the tray `min-height: 44px; display: inline-flex; align-items: center`, and give the inline links in the dark room 44px of vertical padding via `padding-block` with a negative margin, so the line height is unchanged.
7. **Motion mix is thin past the first screen.**
   - After the cabinet, the only untouched mover is the black room's entry, which is scroll-linked.
   - The papers section and both "stand" sections are static unless you hover.
   - Fix: give the "Find a control" count an idle moment. On arrival (60% in view), type one example term from the placeholder (for example "PKCE") into the field, show the count settle, then clear it. Pause it on focus and freeze it under reduced motion. Alternatively, count the 16 up once on entry.
8. **Smaller items:**
   - Hero ask hover goes to `rgb(42,42,44)`, which is not a deck step. Use `#262626` or `#171717`.
   - While the hero ask passes under the glass header, a blurred black smear shows behind the nav. Consider letting the hero ask fade out before it meets the header, or ending the hero section above the header line.
