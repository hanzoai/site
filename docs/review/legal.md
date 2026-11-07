# /legal (index): James-eye review

Verdict: 7/10
First complaint: "Much better. It's an index now, and I can find a document in a second. But the paper still doesn't go to the back: the next sheet just pops in front. On my phone the stamps stick out of the sheets in little bits, with the pause button sitting on the pile. And under the hero the list doesn't come in, it's just there."

Reviewed: branch `claude/youthful-gauss-hiiqm9`, walked at `9e2c486`. The page files last changed in `30e721f` (rhythm pass: h1 52px, no springs, `main#main`); before that, `2daa8e8` ("legal: stack deals real sheets…"). Files hash (LegalIndex.jsx, LegalIndex.css, legalData.js, app/legal/page.jsx): `8e5b538d13f0`. While I wrote this, HEAD moved to `2eb72b7`. That commit only touches shared files (NoJs refactor, rail-title wrap, slider CSS). The working tree also has one uncommitted Rhythm.css line. None of it changes the findings below.
Walked: 7 Nov, 14:45–15:14 UTC, on the dev server, moving, at 1470×801 and 375×812 (touch emulation), plus 320 wide, JS off and reduced motion. I kept:
- 10-frame load bursts and idle bursts;
- a half-screen walk with a solid-button count at each stop;
- a 15fps screencast of the deal;
- a screencast scroll through the lower half;
- entrance sampling every 100ms;
- a fine-pointer hover and press log;
- a deep-link test (`/legal#policies`);
- a row-to-document open filmed at 10fps.

The cookie note was skipped.
Proof: `img/legal.jpg` (desktop first screen | phone first screen).

Since the last review (6/10 at `303ba52`):
- **These landed:**
  - Every sheet prints Hanzo's own line for its document, so there are no grey bars.
  - Sheets stay mounted.
  - The pile fits 1470×801: the top sheet ends at y≈770, not 848.
  - The 12 grey boxes became a ruled index. Each row has a 13px mono group label, a 28px title, Hanzo's sentence at 16px and an arrow disc. On hover the row fills #f2f2f2, shows `hanzo.ai/legal/<slug>`, and the arrow inverts and moves 3px.
  - The chips are sticky (top 60px). The selected chip is an ink ring on white, not a second black pill.
  - `#agreements`, `#policies` and `#notices-and-registers` select their chip and scroll to it. `/legal#policies` lands with Policies pressed and 5 rows.
  - The status blockquote has margin 0.
  - The mail links are 44px tall.
  - There are 12 `data-cta`.
  - "How these fit together" and "Contact" cut in when first scrolled to.
  - The ladder grows (scaleY 0.3 → 1, 80ms stagger, about 800ms).
  - The page is 5,621px on desktop (was 6,123) and 8,944px on phone (was 10,188).
- **These did not land:**
  - The deal still reads as a cut.
  - The phone stamps and the pause on the pile.
  - The index rows rising.
  - The group h2s.
  - The aria-labels "Show" and "Documents" in the register.
  - The pause hidden with JS off.
  - Print CSS.
  - The stale "sepia" comments (LegalIndex.jsx line 3, LegalIndex.css line 1).
  - The bare chip `:hover` (LegalIndex.css line 41).

## The ask: still right to keep it off
- `data-ask="off"` follows PLAN-COMPONENTS 2.4 ("none on legal and careers").
- Since 15:01, MASTER 3.2 rule 6 says the one solid ask lives in the sticky header. The header's "Try Hanzo" is that ask here: solid and on screen at 15 of 15 stops on desktop and 23 of 23 on phone, and the only solid button at each one. Nothing floats over the content.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes.
   - **Desktop:** the h1 "Legal & / Trust Center" is 52px (the Rhythm.css resting size, down from 120px) at y 280–389. "LEGAL" sits under it in mono, then the 21px lede, and the paper pile on the right is the big thing.
   - **Phone:** the h1 sits at 164–248, then the lede, then the top two-thirds of the front sheet (pile 541–915).
   - **Moves:** the h1 cuts in at first paint (CSS LineMask; mid-cut in the 554–603ms frames). The deal starts at 2.4s.
   - **Squint:** the pile and the h1 are the two masses, and "Try Hanzo" is the only black pill.
2. **One in, one out, or a document?** Better, but still five blocks in a row.
   - **The blocks:**
     - the hero;
     - the statement (38px, 7 lines) and the status card;
     - the index (about 1,150px on desktop);
     - "How these fit together" with the ladder;
     - Contact.
   - **What arrives:** the two h2 cut-ins and the ladder.
   - **What doesn't: the index rows.** Their `initial={{ y: 24 }}` is cancelled by `AnimatePresence initial={false}`, so the transform is `none` at every scroll position, sampled every 100ms through the catalogue.
   - **The ladder triggers late:** `amount: 0.6` on bars already scaled to 0.3 means they sit as stubs until the ladder's top is about 35% down the screen.
3. **A real object in every section?** 3 of 5, which is enough for a utility page.
   - **Hero:** the paper pile, now printed with real lines.
   - **Index:** the ruled list is itself the object, and its hover preview tells you something.
   - **"How these fit together":** the ladder.
   - **Statement and status:** no object, only a dot that pings twice.
   - **Contact:** type only (32px addresses on hairlines).
4. **One ask in the header, nothing floating, scale with rhythm?**
   - **The ask:** yes; see above.
   - **Rhythm:** mostly. Each screen has one big thing:
     - the pile;
     - then the 38px statement (MASTER's statement step is 32px);
     - then the 28px row titles;
     - then the ladder;
     - then the 32px addresses under a 26px "Contact".
5. **Every hover and press answers?** Mostly.
   - **Rows:** the fill, the address and the arrow all answer. Press is `scale(.995)`, which you cannot see (the standard is 0.98 or a 1px drop).
   - **Chips:** the border goes to ink, press 0.98. The hover is a bare `:hover` (line 41), so it sticks after a tap on phone.
   - **Mail:** the underline draws in, press 1px.
   - **Pause:** it inverts to ink, press 0.94.
   - **The pile:** it does not answer the pointer at all.
6. **Overlaps, font swap, layout shift?**
   - **Clean:**
     - CLS 0 on phone and 0.0002 on desktop (from the shared header);
     - no font swap;
     - no horizontal scroll at 320 or 375.
   - **The phone stamps overflow their sheets.** `.lgi-sheet-s` is `white-space: nowrap`, and its rotated box runs past each sheet's right edge:
     - front stamp at 53–284 against its sheet's 13–280;
     - the back sheets' stamps at 84–305, 115–326 and 146–347.

     So fragments ("el" and stamp corners) poke out to the right of and below the front sheet. They are visible in the proof's phone panel.
   - **The phone pause sits on the pile:** 320–366 × 526–571, on the 4th sheet's corner (114–358 × 541–822).
   - **The desktop pause floats:** 1421–1468, 2px from the viewport edge and apart from the pile's corner.
   - **The sticky chip bar is see-through:** `rgba(255,255,255,.96)`, so the rows scrolling under it ghost through (the "Terms of Service" title shows behind the chips at y≈80).
7. **Which reference, and is its motion there?**
   - **chatgpt.com/business/enterprise (calm trust):** yes now. A ruled index listed quietly, with the status beside the statement.
   - **apple (one idea per screen):** only the hero has it.
   - **synchronized.studio (a card opens into its page):** not seen. `data-morph` is on the row title, and the target is LegalDoc's h1. On the dev server a click on "Privacy Policy" faded /legal to white, held white for about 2.5s, and then /legal/privacy's h1 slid in. The title did not fly into the h1. This is shared Morph and dev-server speed; re-check on a build.
8. **Different from its neighbours?** Partly.
   - **Its own:** the printed pile and the ruled index.
   - **Shared with /security:** the first screen is still a two-line h1 on the left and a stack of thin plates on the right.
9. **All 18 parts covered?** No; see below. `docs/coverage/legal.md` is stale:
   - it uses the old numbered format, not MASTER §6's 18-heading card;
   - it still describes "cards" that "re-flow" and "the top sheet slides to the back".
10. **Banned tells?**
    - **Clean:**
      - 0 UI hues (the only hue is the shared footer's privacy icon, rgb(0,114,206));
      - no eyebrow over the h1 ("LEGAL" sits 20px under it);
      - the 3-up box grid is gone;
      - no fades, no green, no gradient text;
      - nothing floats over content.
    - **Remaining:**
      - **Overlap on phone:** the stamp fragments and the pause on the pile. MASTER 3.3 bans overlap.
      - **Repeated labels on phone:** every row repeats a 14px mono group label directly above its title, 12 times. MASTER allows tags that are not over an h1 or h2, but the chip above already says it.
    - **`taste.py` passes.** The off-deck literals are #0a0a0b ×2 and #c7c7cc, plus a 10px radius on the stamp.
11. **Copy untouched?** Yes. Parity 62/62 text and 16/16 links.
    - **Decorative, `aria-hidden` additions:** the sheet addresses, the stamp "draft · pending counsel" and the ladder numerals 01–04.
    - **Not in `content/ui-strings.json`:** the aria-labels "Show" (the chip group) and "Documents" (the section).

## Missing from the 18 parts (PLAN-COMPONENTS §2.1–2.18 and MASTER §2, measured)
- **2.1 Strategy:**
  - Persona, Goal, CTA, Metric, Signature and Beyond are in the header.
  - But lines 3–7 still describe a "sepia accent", "cards that re-flow" and a top sheet that "slides to the back".
  - There is no Ledger entry.
- **2.3 First impression:** a hand-written hero, not `PageHero`. No Band ending, which is right for legal.
- **2.5 Legal typesetting:** the sticky index is there. Print CSS is not (0 `@media print` rules for `lgi-`).
- **2.6 Content:** the statement is 38px over 7 lines (MASTER's statement step is 32px).
- **2.8 Components:**
  - The row press is 0.995.
  - The chip hover is bare.
- **2.9 Motion:**
  - The rows never arrive.
  - The ladder triggers late.
  - The deal is a cut: on the 15fps screencast, "Terms of Service" is on top in one frame and "Data Processing Addendum" is fully in front 67ms later. The outgoing sheet then fades behind the pile; you never see it travel to the back.
- **2.11 Mobile:**
  - The stamp fragments.
  - The pause on the fan.
  - The address truncated to "hanzo.ai/legal/priva…".
- **2.12 Accessibility:**
  - Hanzo's three group h2s (Agreements, Policies, Notices and registers) still exist only as chip text, so heading navigation reaches only "How these fit together" and "Contact".
  - "Show" and "Documents" are not registered.
  - With JS off the pause renders (display grid) and does nothing.
  - A hydration error is logged under reduced motion (shared Settle).
- **2.18 Measurement:** there are 12 `data-cta`, but each id repeats "legal" (`legal.doc.legal.terms`).
- **Passing:**
  - one h1 and one main;
  - JS off is legible at both widths (0 hidden text runs; the ladder shows at full height);
  - reduced motion: 0 running animations, the h1 and pile hold still;
  - one timer, which stops off screen and while paused;
  - hidden rows stay in the HTML while a filter is on;
  - no raw img, video or table;
  - deep links select their chip.

## Shared-system notes (not the page's fault, but they touch it)
- **The row-to-document open** showed a white hold of about 2.5s on the dev server, and the title did not land in the destination h1 (see 7).
- **The header changed:** since 15:01 it is always solid and carries a sound toggle. Here that is the intended single ask.
- **Settle** logs a hydration mismatch under reduced motion.

## Fixes (in order)
1. **Make the deal a deal.**
   - Keep the leaving sheet on top while it travels out: x −110%, rotate −8°, 450ms ease-emphasis.
   - Only then drop its z-index and slide it in under the pile.
   - Bring the next sheet forward after that, with a 200ms delay, not in the same frame.
   - Under reduced motion it stays a cut.
2. **Clean up the pile on phone, and seat the pause.**
   - Keep the stamp inside its sheet: allow it to wrap at 375, or give `.lgi-sheet` `overflow: hidden`.
   - Show the stamp on the top sheet only.
   - Move the pause off the fan, to the stack's bottom-left or inside the front sheet's top-right corner.
   - On desktop, bring the pause in from the viewport edge to the pile's own top corner.
3. **Let the index arrive once.**
   - Drop `initial={false}` on the `AnimatePresence`, or move the rise to the list: rows 16px → 0, 400ms, 60ms stagger, once.
   - Lower the ladder's `amount` to about 0.25 so it grows as it enters.
   - Under reduced motion, show the final state.
4. **Make every tap visible.**
   - Make the sticky chip bar opaque #fff, with a hairline under it while stuck.
   - Wrap `.lgi-chips button:hover` in `@media (hover: hover)`.
   - Change the row press to `translateY(1px)` or a scale of 0.98.
5. **Fix the outline and the register.**
   - Add a visually hidden h2 per group, with Hanzo's group titles.
   - Register "Show" and "Documents", or drop them.
   - Hide `.lgi-stack .w2-pause` in the NoJs sheet.
   - Add print CSS for the index (one column, no pile, no chips).
6. **Calm the middle.**
   - Set the statement at the 32px statement step.
   - On phone, drop the repeated mono group label above each row title (the chip already says it), or move it under the sentence.
7. **Housekeeping.**
   - Delete the stale comments.
   - Rewrite `docs/coverage/legal.md` as MASTER's 18-heading card.
   - Swap #0a0a0b and #c7c7cc for deck values.
   - Change `data-cta` to `legal.doc.<slug>`.
   - Add the Ledger line.
