# /grants — James-eye review
Verdict: 7/10
First complaint: "After the hero it goes quiet: a row of text steps and a list of ticks with big white gaps between them, and then three huge sheets that are mostly empty space with a number in the corner. Where's the thing to look at? And on my phone there are two black buttons at the top."
(walked 7 Nov 2026, HEAD f244a55c, 1470×801 and 375×812 (plus 375×667, 320×700), moving: arrival bursts, idle, wheel steps with dwells, hover/press, taps, reduced motion, JS off; api.hanzo.ai intercepted, the one test submit got a fake 500)

## What works
- Clean monochrome, no hue anywhere; `taste.py` OK, parity 57/57 text, 5/5 links, `unique.py` silent.
- Arrival is right: the h1 (52px Zen 497) cuts in by line mask, then the lede and ask rise; the contour canvas draws and keeps drifting (canvas pixels change within 1 s untouched) and has a 44px pause button that works.
- Desktop header ask behaves: outlined "Try Hanzo" while the hero ask is on screen, then becomes solid "Apply for a Grant" after the hero. No floating bar on desktop.
- The signature lands at 1470: the three sheets pin at 96/120/144px and the one underneath shrinks to 0.92 and darkens as the next slides over. It feels like an apple.com chapter stack.
- The form is good: the track chip glides (layoutId, ease-emphasis), the filing card fills in as you type, an empty submit focuses the first bad field (`summary`) with a plain message, and a failed POST keeps every value and shows Hanzo's line with grants@hanzo.ai. It never claims success.
- CLS 0.0008 on desktop (all from the shared header), 0 on phone. No horizontal scroll at 320. No overlaps found on phone.

## The 11 answers
1. **Sells in 5 s, moves within 1 s?** Yes. The h1, lede and ask are all inside 606px at 1470; the canvas moves untouched. On phone the ask's bottom is at 447px at 375×667 (above the fold).
2. **One in, one out?** Only half the time. Hero, then about 290px of empty white, then "How grants work" (4 text columns on a line), then about 250px of white, then "What Grant Recipients & Interns Receive" (a text ledger in an outlined box). Both read as a document. The dark sheet stack is the one real in-and-out moment, and then comes the form.
3. **A real object in every section?** Hero: the contour canvas, but it's decoration in a boxed grey card, not Hanzo's product. How: a hairline with 4 dots. Receive: 4 ticks next to text. Sheets: text only, with the left 4/12 column empty apart from a grey 64px numeral. Form: the filing card. So 2 of 5 sections have an object worth looking at.
4. **One ask, sticky; scale rhythm?** Desktop yes, as described above. **Phone fails.** At 375 the header "Try Hanzo" is solid `rgb(10,10,10)` while the hero "Apply for a Grant" is also solid, so there are two solid fills in the first screen. The phone header never switches to "Apply for a Grant", and there is no bottom ask bar. Scale: 52 / 26 / 21 / 64 / 32 has some rhythm, but nothing grows or shrinks except the sheets.
5. **Every hover and press answers?** Hero ask: hover darkens the fill to `rgb(44,44,46)` and press scales it to 0.98. The link underlines and its arrow moves 4px. Step dot: fills ink on hover. **Dead:** the "Receive" rows (no change at all) and the sheets' quiet asks ("Apply as OSS Contributor" and the other two: background, border, colour and transform identical before and during hover).
6. **Overlap, font swap, layout shift?** None from the page. The red "1 Issue" badge is a hydration mismatch in the shared `FooterHTML`, not this page.
7. **Which reference, and is its motion there?** apple.com stacked chapters (present and measured: scale 1 to 0.92, dim 0 to 0.55). The osply/hamol editorial asymmetry isn't there; sections are a plain heading-left, list-right layout.
8. **Different from neighbours?** Yes: the stacked sheets and the line timeline are its own. The contour-in-a-card hero is the same Sigil treatment as other pages.
9. **All 18 parts?** No `Band` or proof strip at the end (the page ends on the form, then the footer). No Privacy link by the submit. No offline state. Details in the card check below.
10. **Banned tells?** None hard. Close calls: the hero object is a boxed card with an outline (it moves, so it isn't a static boxed hero). The darkened sheet 01 turns a muddy `#777` grey at 0.55 black.
11. **Copy untouched?** Yes: parity 57/57 and 5/5.

Reduced motion: the canvas freezes (true), and h1 opacity is 1. But after 3.5 s `getAnimations()` still lists 3 `xgr-sheet-dim` animations as running, and the sheets still scale with scroll (sheet 01 measured at `matrix(0.960…)`).
JS off: every heading and paragraph is visible. The hero canvas is an empty grey box with "GRANTS & RESEARCH" in it.
Tab crawl: the focus ring shows on every link and button. The five text inputs report `outline: none`; check that the kit `Field` draws its ring some other way.

## Card check (docs/coverage/grants.md)
- TRUE: one h1, 52px; sheet numbers 64 and titles 32; parity 57/57; something moves within 1 s; a pause control on the field; the field freezes under reduced motion; a failed submit keeps its values and shows grants@hanzo.ai; no overflow at 320; the desktop header carries "Apply for a Grant" after the hero; `data-cta` ids present.
- **FALSE**, part 5 "Privacy link and owner line beside every submit": the only links in `#apply` are `mailto:careers@hanzo.ai` and the error's `mailto:grants@hanzo.ai`. There is no Privacy link.
- **FALSE**, part 1 "One solid fill per viewport": at 375×812 the header's "Try Hanzo" and the hero ask are both solid.
- **FALSE**, part 4 "Sticky ask in header and bar after the hero, same label": there's no bar, and the phone header keeps "Try Hanzo".
- **FALSE**, part 7 "no literal hex outside tokens": `Grants.css` has 11 lines with literal hex (`#f5f5f5`, `#171717`, `#fff`, `#000`, `#0a0a0a`, `#a3a3a3`).
- **FALSE**, part 17 "Loading, empty, error and offline states designed": there's no offline handling (no `navigator.onLine`, no banner, no disabled submit).
- **FALSE**, part 18 "Review read: verdict 8 or more": the previous review was 6/10.
- **Partly false**, part 9 "Reduced motion shows the final state": the sheets still scale with scroll, and 3 animations are running at 3.5 s.
- **Partly false**, part 11 "Every target 44px or more": the inline `careers@hanzo.ai` link is 19px tall at 375 (inline text, so it's a minor point).
The false claims cap the verdict at 7.

## Fixes
1. **Give the sheets an object.** In `.xgr-sheet`, the left `4fr` column holds only `.xgr-sheet-n`. Put each way's own real thing there, built from its existing copy. For 01, render "2,137+ repositories · 122 organizations" as a 64px count-up figure (true value in the HTML, `min-width` in `ch`). For 02 and 03, set their meta lines as a figure/chip stack. Also cut `min-height: min(78svh,740px)` to about 64svh so the empty top half goes.
2. **Fill the gap between the hero and the sheets.** Cut the white: `.xgr-hero` padding-bottom `clamp(96px,12vw,180px)` → `clamp(56px,7vw,116px)`, and use `xp-sec tight` on `.xgr-gets`. Make "How grants work" scrubbed: drive `.xgr-line i` scaleX and each `.xgr-dot` fill from that section's `useScroll` progress instead of a one-shot 0.5 s `whileInView`, so the steps light up one at a time as you pass.
3. **Make the dead hovers answer.** For `.xgr-gets-g li` inside `@media (hover:hover)`, use a row hover fill (`background: var(--hz-50)`) and draw its tick again. For the sheets' quiet `Cta` (`.xgr-way-a .xp-ghost`), on hover the border goes to the room ink and the label's arrow moves 4px. Press is already 0.98.
4. **Phone ask.** At ≤899px the header ask must not be solid while `[data-cta="grants.hero"]` is on screen (request it in `docs/requests/grants.md`, as /affiliate did). After the hero, the header label becomes "Apply for a Grant".
5. **Reduced motion.** Under `useReducedMotion()`, don't bind `scale` and `dim` to `scrollYProgress` in `Sheet`: render scale 1 and dim 0 so `getAnimations()` is empty after 3 s.
6. **Part 5/12.** Put the Privacy link and owner line next to `.xgr-send` (the shared Privacy register string).
7. **Part 17.** Add an offline state: listen to `online`/`offline`, disable `grants.apply`, and show a register line.
8. **Part 7.** Replace the literal hex in `Grants.css` with tokens (`var(--hz-100)`, `var(--hz-900)`, `var(--paper)`, and so on).
9. **Fix the card.** Correct parts 1, 4, 5, 7, 9, 17 and 18 so every tick is true.
10. **JS off.** Give `.xgr-art` a static SVG contour (Sigil's SSR poster) so the hero card isn't an empty grey box.
