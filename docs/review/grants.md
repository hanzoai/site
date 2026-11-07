# /grants — James-eye review
Verdict: 6/10
First complaint: "I pressed Apply for a Grant and it opened another tab of the same page. Same with the three Apply buttons on the cards. And on my phone the button in the header is cut off: it says 'Apply for a Gran'."
(walked 7 Nov 2026 16:40 UTC, HEAD b593b6af (Grants files last changed in 7c62a286), at 1470×801 and 375×812, plus 375×667 and 320×700. Moving: arrival bursts at 100/300/600/1000 ms, idle hash of the canvas, wheel steps of 400px with 450 ms dwells, hover and press on every control, taps on the phone, reduced motion, JS off. api.hanzo.ai was intercepted and the one empty-form submit never left the page.)

## What works
- Round 3 landed most of the last review's fixes. The sheets now hold an object: in sheet 01, "2,137+" is 64px Zen Air with a REPOSITORIES label and a "122 organizations" chip, and it counts up once (measured 1,654+ → 2,136+ → 2,137+, true value in the SSR HTML). The empty top half is gone (`min-height: min(64svh,600px)`).
- "How grants work" is scrubbed now. The line's scaleX follows scroll (0.235 → 0.666 → 1) and the steps light one at a time (1 → 3 → 4 `li.on`). Dimmed steps are grey, lit ones are ink. This is the best "one comes in" moment on the page.
- The dead hovers answer now:
  - A ledger row fills to the quiet grey (::before opacity 0 → 1) and redraws its tick.
  - The sheet's quiet ask moves its border to ink and its arrow 4px.
  - The track radio goes from #333 to ink and presses to 0.974.
  - The hero ask darkens to rgb(44,44,46) and presses to 0.98.
  - Nothing moved by a pixel on hover or press.
- Reduced motion is clean. At 3.2 s `getAnimations()` returns [], the sheets have transform `none`, there are no dim layers, all 4 steps are lit, the count shows 2,137+ and the h1 opacity is 1.
- JS off: nothing is hidden. The lede's ancestors have opacity 1, the still contour SVG shows in the hero card (display block), and the count reads 2,137+.
- The phone's first screen has one solid fill: the header "Try Hanzo" is outlined while the hero ask is on screen, and it becomes "Apply for a Grant" after the hero (desktop does the same once it settles).
- The form is good. The track chip glides and the filing card fills as you type. An empty submit focuses `summary` and shows a plain dashed-ink message. "Privacy Policy" sits beside "Submit Grant Application", and the offline listener is wired.
- CLS: desktop 0.0017 (every shift comes from the shared header's right-hand cluster), phone 0. No horizontal scroll at 320 or 375. Parity 57/57 text and 5/5 links. `taste.py` OK, `variety.py` OK.

## The 11 answers
1. **Sells in 5 s, moves within 1 s?** Yes. At 1000 ms the h1 (52px, cut in by line mask), lede and ask sit at y 280–606 at 1470, and the contour canvas changes between frames untouched. Phone: h1 40px in 3 lines, ask bottom at 447px at 375×667. On a first phone visit the shared cookie card (top 593) covers most of the moving field (field top 559).
2. **One in, one out?** Better. The scrubbed timeline and the stacked sheets (01 scales to 0.92 and dims to 0.43–0.49 while 02 slides over) are real in-and-out moments. The ledger section still reads as a document: a heading on the left and 4 text rows in an outlined box, with about 180px of white above "How grants work" and about 120px below the ledger.
3. **A real object in every section?** Hero: the contour field in a grey outlined card. That is decoration, not Hanzo's product, but it moves and pauses. How: the line and dots. Receive: ticks beside text, which is the weakest. Sheets: figure plus chips. Apply: the filing card. On desktop, before you type, that card is a tall grey box of 7 "—" rows at 0.55 opacity.
4. **One ask, sticky; scale rhythm?**
   - The header carries "Apply for a Grant" after the hero.
   - **At 375 the header ask overflows:** the button runs x 262 → 395 on a 375 viewport, so 20px are clipped and it reads "Apply for a Gran". At 320 it runs 75px off the edge.
   - Desktop, in the form viewport: the header's solid "Apply for a Grant" (rgb 10,10,10) and the solid "Submit Grant Application" are on screen together, two solid fills.
   - Scale: 52 / 26 / 21 / 64 / 32. But inside sheets 02 and 03 the fact line ("PhD students", "Remote / SF") is 32px Zen 497, the same size as the sheet title under it. That gives each of those sheets two headlines.
5. **Every hover and press answers?** Yes on every control I measured (see What works). **But pressing the hero ask and the three sheet asks opens a new tab.** The server HTML renders `<a href="#apply" target="_blank" rel="noopener noreferrer" data-cta="grants.hero">`, and the same for `grants.oss`, `.academic` and `.internship`. A real click gave 2 pages (`/grants/` and `/grants/#apply`) with JS on and with JS off. The cause is kit `A`: any href that does not start with `/` or `https://hanzo.ai` is treated as external, `#apply` included.
6. **Overlap, font swap, layout shift?** No font swap (the h1 box holds through the cut-in). Layout shift is negligible. **Overlap: yes**, the phone header ask clipped at 375×812 (point 4). In 2 of my 6 loads the red "1 Issue" dev badge showed a hydration-attribute mismatch ("A tree hydrated but some attributes… didn't match"). It did not reproduce in 3 dedicated loads; the last review traced it to the shared `FooterHTML`.
7. **Which reference, and is its motion there?** apple.com chapter stack (sheets pinned at 96/120/144px, scale 1 → 0.92, dim 0 → 0.55): present and measured. The scrubbed timeline is apple-like too. There is no osply/hamol editorial asymmetry: every section is the same heading-left, content-right grid.
8. **Different from neighbours?** Yes: the stacked sheets and the scrubbed timeline are its own. The contour-in-a-grey-card hero is the shared Sigil treatment.
9. **All 18 parts?** Mostly. There is no `Band` or proof strip at the end (the page ends on the form, then the footer); the card leaves that open. The card has stale or false lines (below).
10. **Banned tells?** None hard. Close calls: the hero is a boxed, outlined card (but it moves). The dimmed sheet behind turns a muddy mid-grey band at the top of the stack (visible in the 02-over-01 frame).
11. **Copy untouched?** Yes: parity 57/57 text, 5/5 links.

## Card check (docs/coverage/grants.md)
- TRUE:
  - one h1, 52px; sheet numbers 64/44 and titles 32/26;
  - parity 57/57;
  - moves within 1 s, with a pause control;
  - reduced motion shows the final state (0 running animations, sheets flat);
  - JS off is legible with a still contour;
  - Privacy Policy beside the submit;
  - offline listener present;
  - a failed submit keeps its values and the first bad field takes focus;
  - the count-up's true value is in the HTML;
  - the desktop header carries "Apply for a Grant" after the hero;
  - `data-cta` ids are present;
  - `taste.py` passes;
  - no scroll at 320.
- **FALSE**, part 1 "Done here: One solid per screen": at 1470, in the form viewport, the header's solid "Apply for a Grant" and the solid "Submit Grant Application" are both on screen.
- **FALSE**, part 11 "375×812 and 1470×801 pass with no overlap": the header ask is clipped at 375 (right edge 395px).
- **FALSE**, part 9 "Sound n/a: the shared sound kit is not on main yet": `lib/sound.js` and the header mute toggle are live (the speaker icon is in every desktop frame).
- **Partly false**, part 7 "Radii, shadows and sizes from tokens": `Grants.css` still has literal radii (24px, 20px, 12px, 999px) and literal hex (#f5f5f5, #171717, #737373, #525252, #a3a3a3, #0a0a0a, #fff, #fafafa). The card admits the greys; the radii are not mentioned.
- **Partly false**, part 2 "Every link through A…": it is through `A`, but `A` turns `#apply` into a new-tab link, so 4 links have the wrong behaviour.
- Stale: part 1's unticked phone note ("the shared header keeps a solid Try Hanzo") no longer holds, because the phone's first screen now has one solid.

The false claims cap the verdict at 7. A primary ask that opens a duplicate tab takes it to 6.

## Fixes
1. **Stop the asks opening a new tab.** In `Grants.jsx`, change `to="#apply"` to `to="/grants#apply"` on `grants.hero` (line 41) and on the sheet `Cta` (line 177). `A` then renders a Next `<Link>` with no `target`. Better still, file `docs/requests/kit.md` asking `A` in `components/kit.jsx` (line 26) to treat `h.startsWith('#')` as internal. Re-test: one page after a click, and `#apply` in view.
2. **Phone header ask clipped.** At ≤899px "Apply for a Grant" (133px wide) does not fit beside the logo, search and EN. Request in `docs/requests/grants.md` (shared header) that the swapped label either drops the EN switcher into the sheet below 400px or caps the button at `max-width: calc(100vw - <left cluster> - 16px)`. Re-measure: the button's right edge ≤ 359 at 375 and ≤ 304 at 320.
3. **One solid at the form.** While `[data-cta="grants.apply"]` is in view, the header ask should go back to quiet. Add it to the same request as /affiliate's ("outline while the page's own ask is on screen"); the rule must cover the submit, not only the hero ask.
4. **Sheet facts must not rival the title.** In `.xgr-fact-big` (non-`num`), drop 32px to 21px (or set it as the 12px mono caption and keep only the chips), so each sheet has one big thing (the 64px numeral or 2,137+) and one 32px title.
5. **Give "Receive" a reason to look.** `.xgr-gets-g` is an outlined box of text rows. Remove the box outline (rows divided by hairlines only, per part 7). Then make the rows answer scroll the way "How" does: tick each row as it crosses 60% of the viewport, driven by `useScroll` on `.xgr-gets`, instead of the one-shot `Tick delay`. Cut `.xgr-how` bottom space so the white gap is under about 120px.
6. **Desktop filing card before typing.** Show only "Program Track" plus the first two rows, and grow rows in as fields fill (as the phone already does with `dl > div:not(.on)`), so the first view is not a tall box of 7 em dashes.
7. **Tokens.** Replace the literal radii in `Grants.css` (24px → the tile token, 20px → the art token, 12px, 999px → pill) and the remaining literal hex with tokens where they exist.
8. **Fix the card.** Correct parts 1, 2, 7, 9 and 11 as listed above, and note the sound kit is live (`data-sound="tick"` already works through it).
