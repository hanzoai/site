# /press — James-eye review

Verdict: 6/10
First complaint: "The top's nice, the press kit cards dealing themselves. Then it's grids of the same grey box over and over: nine social tiles, six partner tiles, and two empty grey cards where the team should be."

Walked 7 Nov at about 15:17 UTC, page file at `09eb239a` (`components/pages/Press.jsx` and its css), on the preview of main plus branch heads with the shared system in. Filmed moving at 1470×801 and 375×812 (wheel and finger scroll, dwell on every screen, hover and press on desktop, taps on phone), plus reduced motion and JS off. Judged by `JAMES.md` and `MASTER.md` (Story, §4.4). Stills: `review/press/desktop-walk.jpg`, `review/press/phone-walk.jpg`.

## What works
- The hero sells at once: "Press Resources.", one solid "Contact Press Team", a quiet "Download Press Kit", and the kit's three plates dealing themselves to the front once.
- The boilerplate is read word by word, faint to ink as it scrolls (the Story signature from MASTER §4.4), with the four facts (2016, San Francisco, Hanzo AI, Inc., Techstars '17) settling below at a medium size. That is real rhythm.
- The news is an index of large headlines that step back while one is in focus. The press contact is the one black room, with press@hanzo.ai big and a copy button beside it.
- Monochrome; `taste.py` passes; no labels over headlines. JS off: 0 hidden text. Reduced motion: 0 running animations. CLS 0.0002, no phone target under 44px. Parity: text 83/83, links 20/20.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes: the plates deal as the headline lands.
2. **One in, one out, or a document?** The first half yes (kit, belief line, news). The second half is a document: Brand Assets, Partner Assets, Connect With Us and Meet our team stack as four grids.
3. **A real visual object in every section?** Hero plates, logo spread, facts, news index and the email room: yes. The grids are boxes with a name and an arrow. "Meet our team" shows two empty grey cards with a faint Hanzo mark. The portraits are blocked in this box, so that is not counted against the page, but the fallback reads as broken.
4. **One ask, sticky after the hero?** Yes, shared: the header's "Try Hanzo", and on the phone a slim "Contact Press Team" bar after the hero. "Contact Press Team" is the hero's one page solid; "Request Executive Bios" closes the page.
5. **Every hover and press answers, no jumps?** Most rows answer; press on "Contact Press Team" is .97. In my walk the logo plates, the boilerplate copy icon, press@hanzo.ai and some asset links ("Download Press Kit (ZIP)", "Logo (PNG)") showed no hover change.
6. **Overlaps, font swap, layout shift?** None, beyond the hero plates stacking by design.
7. **Which reference, is its motion there?** osply and hamol: the big-headline news index with a card riding beside the row. The editorial feel is there in the top half.
8. **Different from neighbours?** Yes in the hero (dealt plates), but the asset and social grids repeat the boxy tiles of /brand and /contact.
9. **18 parts (MASTER §2)?** See the card check below.
10. **Banned tells?** Two:
    - **3 equal boxes in a row:** "Connect With Us" is a 3×3 grid of identical tiles, and Partner Assets a row of 6.
    - **A cursor-following panel:** the news card follows the pointer. It rides beside the row, not over a headline, but MASTER bans things that follow the cursor.
11. **Copy untouched?** Yes (parity clean).

## Card check (`docs/coverage/press.md`)
- **Format.** Template format with 18 `Done here:` lines.
- **Part 8 is false in part.** "Every control has hover": the plates, the copy icon, the email and some asset links gave no hover answer in my walk.
- **Part 7 vs the banned list.** It names the pointer card as a feature; under the 14:45 rule it is a fail.
- **Verdict capped at 7.** It sits at 6 on its own merits.

## Fixes (in order)
1. **Turn the grids into lists with rhythm.** "Connect With Us" as one typographic index (name large, handle small, whole-row hit area), like /contact's rows but quieter. Partner Assets as a single row of names with their download beside them. No equal boxes.
2. **Pin the news card in place.** Show the focused story's date and summary in a fixed column beside the index (it changes as you point or scroll), instead of a card that follows the pointer.
3. **Make "Meet our team" whole without the portraits.** Use the leaders' names at Display size with their roles small (from the page's text), so a blocked image never leaves two empty grey cards.
4. **Every asset answers.** Plates, copy icon, email and every download link get a hover that tells you something (the format, "SVG · PNG") and a .97 press.
