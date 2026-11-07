# /customers — James-eye review

Verdict: 6/10
First complaint: "After the first big picture it's just a long list of names and numbers again. And I click 2018 and nothing happens."

Walked 7 Nov, page file at `11ec192` (`components/pages/Customers.jsx`, `Customers.css`). Filmed moving at 1470×801 and 375×812: wheel and finger scroll with a dwell on every screen, hover and press on desktop, taps on the phone, and a click on each case. Also checked a reload without the curtain, reduced motion, JS off, and widths of 320 and 375. Stills: `review/customers/desktop-walk.jpg`, `review/customers/phone-walk.jpg`. Case covers and logos are blocked in this box, so the plate shows its grey-and-Sigil fallback and the wall shows names. One run logged a hydration mismatch, but six later loads did not repeat it, so it is not counted.

## What works
- The headline is a real Display moment: 115px in Zen, line height 0.94, one h1, and nothing above it. On a load without the curtain it cuts in line by line. CLS is 0.000002 on desktop and 0.00003 on the phone, with no font swap.
- 0 UI hues. Everything is ink and greys, with one dark room. No eyebrows, no native tooltips, no browser-default controls.
- The case plate is the right object. One case at a time, with its own figure as a 162px numeral. It wipes to the other case once (1.1s, in-out) and rests. On hover the arrow fills and moves 4px. Buttons and tiles press at .98, and tabs move 1px.
- The index preview follows the pointer on a spring. When a logo fails it falls back to the launch name.
- One ask in Hanzo's words, "Talk to us", in the hero and the close (`data-thumb`, `data-cta`). The shared bar carries it at both widths once the plate has passed.
- Parity: text 72/72, links 10/10. Reduced motion leaves 0 running animations. With JS off every word is legible. On the phone no tap target in `main` is under 44px. No sideways scroll at 320 or 375. Clicking either case opens its own page.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** The words sell, and the ask is on the first screen at both sizes. But at 1470 the ask sits alone at x=1309, 650px right of the lede. Movement on the phone: yes (the plate wipes, its tab line fills, and the Sigil drifts). On desktop: no. On a first visit the headline cut-in plays under the arrival curtain. In the second after the curtain lifts, the only change is a faint Sigil sliver (6 grey levels or less, in a 165×12px strip). The plate's timer waits until 30% of its stage is on screen, and the first screen shows 27%, so nothing turns until you scroll.
2. **One in, one out, or a document?** The hero and the plate are a scene. After that, "Every launch" is 11 static rows holding 11 figures, about 2,000px at 1470 and longer on the phone. That is a document. "Backed by builders." is a still grid. Nothing comes in or goes out as you scroll. The closing headline's cut-in is the only arrival after the hero.
3. **A real visual object in every section?** Partly. Hero: the plate (with the fallback it is a dark slab at the fold, and its contour is barely visible). Index: type only, with logos at 24px and 55% opacity. Backers: seven grey tiles. Close: the Sigil.
4. **One ask, sticky after the hero?** Phone: yes. Desktop: the bar waits for the whole hero section, and that section includes the plate and its tabs. So from scroll ≈530 to ≈1,420 neither "Talk to us" is on screen, only the header's "Try Hanzo". The first screen at both widths also shows two solid black pills, "Try Hanzo" and "Talk to us". That is the site header's behaviour, against PLAN 0.9.
5. **Every hover and press answers, no jumps?** The hero ask, the plate, the tabs, the wall and the closing ask: yes. But four things fail:
   - **Year chips.** The colour changes but the list does not, at either width. 10 rows get `hidden`, but `.xcu-row{display:grid}` overrides it, so all 11 stay on screen.
   - **The year pill never shows.** It measures 0×0, because `.xcu-years button > span{position:relative}` beats `.xcu-pill{position:absolute}`.
   - **The rows' "grey sheet" never appears.** Its `::before` at `z-index:-1` paints behind the page's white (sampled: white).
   - **The preview card.** It lands at the pointer plus 28px, covers the hovered row's own name and description, and the ask bar sits on top of it. Its figure repeats the row's figure.

   Also, the case tabs ignore the arrow keys.
6. **Overlaps, font swap, layout shift?** At rest: no overlaps at either size, no swap, CLS ≈0. On hover: the preview covers the row and the ask bar covers the preview. Mid-wipe, for a few frames, the plate reads "$8M+ IN BIKES SOLD IN 30" beside "KANOA". While a logo is pending, its slot shows a grey bar (the `.x-media` fill under the invert filter); this is on the phone's first screen.
7. **Which reference, is its motion there?** The plate feels like an Apple product tile, and the index with its pointer preview feels like osply or hamol. synchronized.studio is claimed: the picture carries `data-morph` and the case cover carries `data-morph-target`. But only the picture flies. The title (28px, bottom right) and the $8.4M figure do not land on the destination h1. In this box every View Transition aborts (it does the same from /solutions), so the screen holds and then cuts, and the open could not be judged moving. The route is correct.
8. **Different from neighbours?** The hero, yes. /investors has a figure card, /enterprise a device, /press a stack of kit cards and /about a curve; a full-width case plate is this page's own. The close is the third Sigil room in the company pages, after /investors and /press.
9. **18 areas (PLAN-COMPONENTS)?** See below. `docs/coverage/customers.md` makes three claims that are false here: "the year pill glides", "rows lift onto a grey sheet" and "a tap narrows the index".
10. **Banned tells?** None, strictly. The nearest is the backers wall: seven plain grey boxes, which is the "lazy look".
11. **Copy untouched?** Parity is clean. But four things are new on this page:
    - $8.4M with "in bikes sold in 30 days", and $7M+ with "raised in preorders". These are verbatim from the case pages, so they trace to Hanzo's copy.
    - "01" and "02" on the tabs.
    - A bare "—" for undated launches, with no accessible name.

    So the coverage claim "no new visible words" is not quite true.

## Missing from the 18 areas
- **2.3 Scroll story:** after the plate, no screen brings in one thing and takes one out. Desktop's first screen is idle.
- **2.3 Morph:** the title does not land within 12px of the destination h1, because only the picture is tagged.
- **2.4 Conversion:** about one screen of desktop scroll (the plate) has no "Talk to us" on screen.
- **2.5 Claim integrity:** the backers wall ships without documented permission (PLAN 1.3 #3: "ships only for names with documented permission"). Its `BACKERS` array is local to this page and duplicates `Investors.jsx`, where the plan asks for one shared array.
- **2.6:** the "—" has no accessible name from the register, and the "01"/"02" numerals are new marks.
- **2.8:** the case tabs are hand-rolled (no arrow keys, no tabpanel) although kit `Tabs` exists. The pill and the row sheet are broken by CSS.
- **2.9:** the plate timer's threshold is missed on the first screen. The preview sits over the text it previews.
- **2.15 Catalogue:** the year filter does not filter.
- **2.17:** a grey bar shows while a logo is pending. With JS off, the blocked images show broken-image icons, and the cover's alt text spills above the plate (minor; remote images).

## Fixes (in order)
1. **Make the years work.** Add `.xcu-row[hidden]{display:none}`. Fix the pill by giving `.xcu-years button > .xcu-pill` `position:absolute`, or by scoping the relative rule to `> b, > .xcu-dots`. Then let the list close up with a layout animation, so a tap visibly narrows the index. Retest at 375.
2. **Turn the index into a scene.** Pin a stage beside the rows. As each row crosses the middle, the stage shows that launch's logo and first figure at display size; this is the hover preview, made scroll-driven and moved off the text. On the phone, use a sticky figure strip over the rows. Same copy. This gives the middle its "one in, one out", and the preview stops covering the row.
3. **Fix the hovers.** Give `.xcu-row` `isolation:isolate` so its sheet shows. Keep the preview in the figure column, never over the name or description, and above the ask bar (or let the bar step aside while the preview shows).
4. **Wake the desktop first screen.** Start the plate at `amount: 0.2`, or as soon as its top is in view. Move the 01/02 tab line onto the plate's top edge, so the "it will turn" cue is visible together with the plate. Fade the outgoing text before the wipe edge crosses it, so no "$8M+" frame appears. Put "Talk to us" beside the lede instead of at x=1309.
5. **Close the desktop ask gap.** End the hero section after the ask (the plate becomes its own section), so "Talk to us" stays on screen from scroll ≈530.
6. **Housekeeping.**
   - Use kit `Tabs` for the cases.
   - Give the "—" its register name, and drop "01"/"02" or get James's yes.
   - Hold the backers wall until permission exists, import one shared `BACKERS`, and show the logos without the seven tiles.
   - Correct the coverage doc.
   - Re-film the case open on a CI build, because this box aborts every View Transition.
