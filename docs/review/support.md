# /support — James-eye review

Verdict: 6/10
First complaint: "I click into the search to try it and a square box draws itself inside the round pill. Then the first letter I type tells me to email support. Searching is the only thing this page does, so it has to feel finished. And on my phone the big number runs straight through 'Documentation'."

Walked 7 Nov, about 14:33 to 14:50 UTC. Page file at `e512a64` (`components/pages/Support.jsx`, `Support.css`), HEAD `127b2e2`. Filmed moving at 1470×801 and 375×812 on a first visit (with the curtain) and a return visit: a wheel scroll with a dwell on every screen, hover and press on desktop, taps and typing on the phone. Also checked 320 wide, JS off, reduced motion, and a phone return visit at 4× CPU.

Stills:
- `review/support/desktop-walk.jpg`. Top row: one second after the curtain, the pill typing; the demo on Documentation, with two list rows indented; one letter "g" typed, showing the square focus box in the pill and the answer already "Email us". Bottom row: the Community row hovered, previewing in the card; "refund xyz" with no match, as an email with the words for its subject; the dark room.
- `review/support/phone-walk.jpg`. The demo typing; "System Status" running into "03"; "Documentation" across "02" and the focus box, at 320; "billing" with "06" under the words; the dark room with the ask bar.

## What works
- **The idea is right, and it is this page's own.** You get one line of display type ("How can we help?" in Zen at 132px, line height 0.92), a search pill and the answer under it. Type "api key" and the card becomes Documentation with "API" marked. "discord" gives Community, "bug" gives GitHub and "status" gives System Status. Words that match nothing turn the card into "Email us", with your words as the subject (`mailto:support@hanzo.ai?subject=refund%20xyz`). It is the clearest page in the company family.
- **Fits both screens.** At 1470×801 the h1, the pill, the card and "Open Help Center" all fit (button bottom at y=686), with the lede and all six rows beside them. At 375×812 the order is h1, lede, pill, then card, and the button ends at y=672.
- **Something moves without input.**
  - The six rows fade in 0.6–1.0s after the curtain starts to lift, and the pill starts typing at about 0.95s.
  - Between lift+1s and lift+2s the first screen changes by about 25,600 px.
  - The dark room's contour field drifts slowly (about 5,700 px/s) and it is the only continuous mover there.
- **State and pointer motion.**
  - The list re-orders on a spring as you type.
  - The giant numeral springs to the door shown.
  - Pointing at a row previews that door in the card. The row inks, slides 6px and nudges its arrow 4px.
- **Press and hover on the buttons.** The solid goes from #0a0a0a to #3a3a3c, and press scales it to .98. Rows also press to .98. The enterprise link's underline brightens on hover.
- **Colour.** Ink, greys and white only. Matched words get a light grey fill with an ink underline.
- **Sticky ask.** After the hero, the "Support · Open Help Center" bar arrives at both widths, and the header's "Try Hanzo" turns outline.
- **States.**
  - JS off: all six answers are stacked and readable with their buttons, then the list and the enterprise line (0 hidden, 0 inert).
  - Reduced motion: no demo, no arrivals, and 0 animations running after 4s.
  - The demo has a Pause control, and pressing or focusing the pill stops it.
- **Engineering checks pass:**
  - No sideways scroll at 320 or 375.
  - Every phone target is 44px or more (rows are 64px).
  - No font swap. CLS is 0.014 on a desktop first visit and 0.002 on the phone (see 6).
  - Parity is 24/24 text and 6/6 links.
  - Every answer button carries `data-cta` (support.answer.1–6), plus support.enterprise.
  - Both files have the Persona/Goal/CTA header.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** The words sell, and things move. Two faults:
   - **The h1 cut-in plays under the curtain.** `MaskLines` starts on `hz-arrived`, which is the moment the curtain begins to lift. The curtain's edge uncovers the h1 about 560–700ms later, when at most 2px of the 128px rise is left. A first visit never sees the headline cut in. Only the card's rise is half-seen as the black uncovers it.
   - **The ask does not hold still.** The demo types "support ticket", then "API references", then "incident history", and the card follows. On a first visit:
     - the solid reads "Read the docs" from about 5.0s to 8.2s after the lift;
     - then it reads "View status" from about 9.2s to 12.2s;
     - it rests on "Open Help Center" at about 12.3s.

     So for about 6 of the first 12 seconds the one solid is a different verb. A pointer resting on the button found three different links in 13s, and hovering the card or the button does not pause the demo. This is the /contact complaint again, softened because the visitor can see the pill causing it.
2. **One in, one out, or a document?** Neither. It is a tool, then one closing line, then the footer.
   - On desktop the page has two screens: the hero, then the dark enterprise room.
   - Scrolling brings nothing in. The enterprise line has no entrance, and the room's only motion is the contour drift.
   - Nothing is pinned and nothing is scrubbed.

   Short is right for a help page, but the one scroll moment is dead.
3. **A real visual object in every section?** Yes.
   - Hero: the pill, the answer card with its giant numeral, and the live list. All of it is product UI that works.
   - Dark room: the Sigil contour canvas.

   No Hanzo media exists for this page, so this is not penalised.
4. **One ask, sticky after the hero?** Yes, the bar and the header outline at both widths. In the hero itself, see 1: the solid changes verb during the demo. With JS off there are six stacked solids, which is a fair fallback.
5. **Every hover and press answers, no jumps?** The buttons and rows do (see What works). The faults are all in the signature:
   - **The preview can't be acted on.** Leaving the list resets the card. So moving from the "Community" row to its "Join the community" button arrives on "Open Help Center" (https://hanzo.help).
   - **The first letter answers.** One letter ("g") is not a search term, so the card jumps to "Email us" with "g" as the subject and the solid becomes "Email support@hanzo.ai". At "gi" it becomes GitHub, so every query opens with a flash of the no-match state.
   - **Answers flicker mid-word.** "status pa" shows Help Center ("pa" matches "path"), then "status pag" goes back to System Status.
   - **Plurals miss.** "tickets" gives "Email us", because only the query's prefix is matched, so "tickets" fails on "ticket".
   - **The ↵ circle is not a button.** It looks like a 56px submit button (48px on the phone) and inks when there is a match, but it is an `aria-hidden` `<kbd>`. Clicking or tapping it does nothing, and on the phone the tap even takes focus away from the field.
   - **The pill has no hover.** Its border stays at 10% black; only focus answers.
   - **Two rows marked best.** During the demo, Help Center and the shown door both get the ink and the 6px indent (`top = (hit && at === 0) || i === best`).
   - **The answer's own row looks disabled.** With no match, the "Email us" row is dimmed to 38% like the rows that missed.
6. **Overlaps, font swap, layout shift?**
   - **Phone: the numeral collides with the answer.**
     - At 375 the numeral spans x 251–337. "Documentation" ends at x=287 and "System Status" at x=275, so both run into "02"/"03".
     - The Help Center and Email us descriptions run across "01" and "06".
     - At 320 the numeral spans x 196–282, and four of the six titles cross it.

     On desktop the numeral sits clear of the words.
   - **The search's focus ring.** `.xsp :focus-visible` (0,2,0) beats `.xsp-search input { outline: none }` (0,1,1). Clicking or tapping the field therefore draws a 2px ink, 8px-radius rectangle with a 5px white halo around the input. The result is a square box inside the round pill, with its halo cutting the pill's border, on top of the pill's own focus-within ring. It shows at both widths, every time someone uses the page.
   - **Layout shift from the demo's marks.**
     - CLS is 0.014 on a desktop first visit.
     - Its biggest shift (0.012) comes from the demo: each mark adds 2px of padding on each side. Marking "incident history" pushes "Check" down to the next line.
     - The phone is 0.002. No font swap.
   - **Before hydration, a tap opens email.**
     - The hidden panes are `opacity:0` but stacked in one grid cell, and the last one (Email us) is on top.
     - So until hydration sets `inert`, a tap on the visible "Open Help Center" hits the invisible `mailto:support@hanzo.ai`.
     - On a phone return visit at 4× CPU this lasted from first paint (574ms) to 1,722ms.
   - **The h1 waits for JS.** On a return visit, the server HTML has it at `translateY(105%)` (MaskLines), so it is blank until hydration and LCP waits for JS.
   - **Console.** Clean in nine of the ten runs that logged it. The tenth, a desktop return visit, logged one React hydration-attribute mismatch that four reruns did not repeat. It is not attributed to this page.
7. **Which reference, and is its motion there?**
   - Its true kin is support.apple.com's "How can we help?" with search, which is not on his list.
   - The osply/hamol micro-motion is there: the numeral spring, the list re-order spring and the row slide.
   - Apple's persistent ask is there (the bar).
   - Apple's pinned or scrubbed scenes are not.
   - synchronized.studio's card opening into its page is not: all six doors leave the site in a new tab.
8. **Different from its neighbours?** Mostly yes. /contact, /contact-sales, /press and /careers each set a 2–4-line h1 on the left with an object card on the right. /support is one full-width line over a search pill, with its own signature. It shares two kit pieces with them: a white 28px shadowed card (title, line, solid) and a dark room over a contour field. /contact opens on the same sentence, "How can we help?". That is Hanzo's copy, so it is James's call, but two pages now greet him identically.
9. **18 areas (PLAN-COMPONENTS)?** See below. `docs/coverage/support.md` exists, but several claims are wrong or overstated:
   - **"Cuts in … after the site's arrival curtain lifts."** It starts as the lift starts and is done before the h1 is uncovered.
   - **"Each re-ranks the list."** The demo only dims the list; the order never changes (by design, per the code comment).
   - **"There is one solid per viewport."** True at rest, but during the demo that solid is three different asks.
   - **"Typing writes straight to the input (no state per character); state changes only on whole words."** True for the demo only. Your own typing sets state on every key and re-ranks from the second letter, and the first letter alone turns the answer into "Email us".
   - **"Pointing at … a door previews it in the answer card."** True, but the preview is dropped before the pointer can reach its button.
   - **"The focus ring is ink with a white halo."** On the search field, that ring is the square box inside the pill.
   - **Nothing mentions** the numeral overlap at 375 or 320, or the tap that lands on the hidden mailto before hydration.
10. **Banned tells?** None of the list:
    - no eyebrow ("Support" is now the search landmark's name);
    - no hue;
    - no gradient text (the dark room's gradient only dims behind the text, which is allowed);
    - Zen, not Inter;
    - no `title=` in the page;
    - no button that fades on hover.

    Borderline: the input's square focus box reads like a browser-default control.
11. **Copy untouched?** Nothing lost (24/24, 6/6). The demo phrases are Hanzo's own words from the descriptions. Visible things that are not on hanzo.ai/support:
    - **The giant numerals "01"–"06".** They are decorative and `aria-hidden`, but /contact's 01–04 were flagged, so they need James's yes too.
    - **The ↵ glyphs.** One sits in the pill and one in every answer button.
    - **The placeholder.** It repeats the h1, so once the demo rests, "How can we help?" is on the first screen twice.

    `parity.py` is one-way and does not catch additions.

## Missing from the 18 areas
- **2.1 / 2.4 Conversion:**
  - The demo changes the one solid for about 6s of the first 12s, with no pause on hover.
  - The hover preview's button can't be reached.
  - The first letter of any query flashes "Email support@hanzo.ai".
- **2.3 First impression:**
  - The h1 cut-in is spent under the curtain.
  - **Page ending:** there is no closing Band. The enterprise line is the last word but arrives without an entrance and carries no solid.
- **2.6 Content:** the 01–06 numerals, the ↵ glyphs, and the placeholder that repeats the h1.
- **2.7 Visual:**
  - the numeral collides with the titles and descriptions at 375 and 320;
  - the square focus box in the pill;
  - two rows marked best during the demo;
  - the answer's own row is dimmed when nothing matches.
- **2.8 Components:**
  - Six raw `.x-btn solid` instead of `Go`/`Cta` (§4 gate 2).
  - No `PageHero` or `Band`.
  - The ↵ `<kbd>` is styled as a control but is not one.
- **2.9 Motion:**
  - The marks' padding re-flows the text (one shift of 0.012).
  - The answer flickers within a word.
- **2.11 Mobile:**
  - The numeral overlaps (see 2.7).
  - Tapping the ↵ circle is dead and drops focus from the field.
- **2.12 Accessibility:**
  - The solid changes by itself with no hover pause. Pause exists, but only as a button in the pill.
  - With no match, the live region says nothing (`hit ? … : ''`), so screen readers never hear that the answer became "Email us".
  - The focus indicator on the field is a ring inside a ring.
- **2.13 Performance:**
  - On return visits the h1 is masked in the server HTML until hydration.
  - The "no state per character" claim does not hold for real typing.
- **2.17 States:** before hydration, the invisible Email pane takes taps meant for "Open Help Center".

## Fixes (in order)
1. **Fix the field's focus.** Add `.xsp-search input:focus-visible { outline: none; box-shadow: none }`. Let `.xsp-search:focus-within` carry the only ring: the ink border plus a halo, concentric with the pill.
2. **Keep the numeral off the words on the phone.** At 900px and below, move it to the bottom-right corner of the card beside the button, or reserve room for it (`padding-right` on the title and description equal to its width). Check all six at 320.
3. **Make typing calm.**
   - Ignore a one-letter query: keep the current answer.
   - Re-rank on finished words, as the coverage says, or after about 300ms idle.
   - Show the "Email us" fallback only when a finished word matches nothing.
   - Let a query word also match when it starts with a page word (so "tickets" finds "ticket"), with a minimum of 4 letters.
4. **Don't change the ask under the pointer.** Pause the demo on `pointerenter`/`focusin` anywhere in `.xsp-main` and the list. Start the h1 cut-in when the curtain has cleared, not when it starts to lift (for example, on `#x-arrive`'s `transitionend`, or about 650ms after `hz-arrived`), so a first visit sees the headline cut in.
5. **Keep the preview reachable.** Reset `peek` on leaving the whole hero grid, not the list, so "Join the community" can be clicked once it is shown.
6. **Make ↵ honest.** Either make it the form's real submit button (icon-only, with an aria-label from `ui-strings.json`) or drop the circle so it reads as a key hint.
7. **Stop the marks from moving words.** Draw the mark with `box-shadow` (or a background with no side padding), so "Check" stays on its line.
8. **Fix the states:**
   - Give inactive panes `pointer-events: none` in the server HTML (and `visibility: hidden` once faded), so an early tap hits what is visible.
   - Mark only `i === best` as best.
   - Keep the answer's row ink when nothing matches.
   - Have the live region name "Email us" on no match.
9. **Give the ending a moment.** Let the enterprise line cut in on scroll (MaskLines without `now`), so scrolling brings one thing in. Build the buttons with `Go`/`Cta`.
10. **Ask James.** Get his yes on the 01–06 numerals, the ↵ glyphs and the placeholder that repeats the h1. Otherwise remove them.
