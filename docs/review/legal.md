# /legal (index): James-eye review

Verdict: 6/10
First complaint: "The first screen's fine: big title, the paper moves. But the paper has grey bars where the words should be, so it looks like it's still loading, and the top sheet just blinks out instead of going to the back. After that it's a dead document: a paragraph, twelve grey boxes in rows of three, a bar chart that doesn't move, a list of emails. Nothing comes in as I scroll."

Reviewed: branch `claude/youthful-gauss-hiiqm9` @ `303ba52` ("legal: JAMES.md pass"). Files hash (LegalIndex.jsx, LegalIndex.css, legalData.js, DocNodes.jsx, app/legal/page.jsx): `ffa4d97758f6`
Walked 7 Nov 14:05–14:28 UTC on the dev server, moving, at 1470×801 and at 375×812 (touch emulation). I used load bursts, per-frame logs of the stack, a filter re-flow trace, hover and press probes, a card-open trace, JS off, reduced motion, and 320/375 width checks. The cookie note was skipped.
Proof: `img/legal.jpg` (desktop first screen | phone first screen).
Note: at 14:30, after this walk, another chat left uncommitted edits in two shared pieces this page uses: `components/v2/Settle.jsx` and `components/v2/x-gauss/LineMask.jsx`. Both change only the reduced-motion path, so the findings below stand.

## The ask: is `data-ask="off"` right? Yes.
- PLAN-COMPONENTS 2.4 says "none on legal and careers".
- The persona is a reviewer trying to reach one document. On a phone, a sales bar under the thumb would sit over the very list they came to tap.
- The page still has one solid ask in Hanzo's words. The header's "Try Hanzo" stayed solid and on screen at every scroll position I checked: 9 on desktop and 14 on phone. On this page the sticky header does the job of JAMES.md #5's "sticky after the hero". No `data-thumb` is needed.
- What is still missing is measurement, not an ask. The header declares "Metric: document open", but no card carries `data-cta` (fix 6).

## The 11 answers
1. **Does it sell in 5 seconds, and does something move within 1 second?** Yes on both.
   - **What it is:** "Legal & Trust Center" at 120.5px with line height 0.92, the lede, and a fanned pile of paper.
   - **Within 1 second:** the h1 lines cut in (frames 1–3 of the load burst) and the lede rises. The pile deals its first sheet about 2.4s after it comes into view.
   - **But the hero object is cut and fake:**
     - At 1470×801 the top sheet ends at y=848, 47px under the fold. That is Settle's 1.08 scale plus its 50px lift. The "draft · pending counsel" stamp sits on the fold line, and the 5th sheet runs to x=1475.
     - At 375 the pile starts at y=500. The stamp wraps to two lines ("draft · pending / counsel") and the fold cuts it. The address is truncated to "hanzo.ai/legal/priva…".
     - Each sheet shows 5 grey bars (`.lgi-sheet-l i`) instead of words, so it reads as a loading skeleton.
2. **One in, one out, or a document?** A document.
   - Page height is 6,123px on desktop and 10,188px on phone.
   - Below the hero there are four static blocks:
     - intro, 778px: a 38px statement plus a status card;
     - catalogue, 1,679px on desktop and 3,232px on phone;
     - "How these fit together", 881px;
     - Contact, 780px.
   - Nothing is pinned. No element below the first screen has any entrance, not even a fade. The h2s "How these fit together" and "Contact" are static, and the ladder and the mail rows are just there.
3. **A real object in every section?** 2 of 5.
   - **Hero:** the paper pile (yes, with skeleton bars).
   - **"How these fit together":** the ladder, four bars at 176/264/352/440px with the first one inverted. It is an object, but it is static.
   - **Intro:** no object, just a paragraph and a grey card with a dot that pings twice.
   - **Catalogue:** chips and 12 grey text cards. The only graphic is a 40px arrow disc.
   - **Contact:** type only.
4. **One ask, sticky after the hero?** Yes, by design: the header's "Try Hanzo" (see above). Per viewport:
   - The only other ink-filled pill is the selected "All 12" chip. It shares the screen with "Try Hanzo" at y≈1442 on desktop and from 1462 to 2192 on phone.
   - It is a selected state, not an ask, but at squint it is a second black pill.
5. **Does every hover and press answer?** Mostly.
   - **Card hover answers well:** the card lifts 4px, the fill goes #f2f2f2 → #ececf0, and the arrow disc turns ink and nudges 3px.
   - **Card press: nothing.** The transform stays at `translateY(-4px)`, with no scale and no 1px drop.
   - **Chips:** hover turns the border ink, and press is scale 0.98 (from the shared button rule).
   - **Mail links:** the underline draws in from 0 to 100%. No press state.
   - **Pause:** press is 0.94.
   - **Pointer on the hero:** none. The pile has no hover or tilt and cannot be clicked.
   - **Bare `:hover`:** the chip, card, card-arrow and mail hovers are not wrapped in `@media (hover:hover)`, so on a phone a tapped card stays lifted when you come back.
6. **Overlap, font swap, layout shift?**
   - **Layout shift:** CLS is 0.0000 on both desktop and phone.
   - **Font swap:** none seen in the 8-frame load burst; the h1 paints in Zen with its box steady.
   - **Horizontal scroll:** none at 320 or 375.
   - **Overlap:** on phone the pause disc (top 8, right 8 of `.lgi-stack`) sits on the fanned corners of the sheets.
   - **Fold:** the pile is cut by the fold at both widths (see 1).
7. **Which reference, and is its motion there?**
   - **chatgpt.com/business/enterprise (calm trust):** the closest. But "proof listed quietly" is undercut by the 3-up grey boxes, which are louder than the statement.
   - **apple (one idea per screen):** only the hero has it.
   - **synchronized.studio (card opens into its page):** the wiring is there. The card title carries `data-morph`, and LegalDoc's h1 is the `data-morph-target`. I could not see the open in this walk: on the dev server, clicking "Privacy Policy" at scrollY 1639 scrolled the old page back to 0 over about 700ms, and /legal/privacy arrived about 3.5s later (see the shared-system notes). Re-check on a build.
8. **Different from its neighbours?** Partly.
   - The paper pile is its own object.
   - The composition matches /security's: a two-line h1 on the left and a stack of thin plates on the right. /trust is centred, and /legal/* opens on a numbered chapter card.
   - The catalogue's grey 3-up cards look like most catalogue pages.
9. **Are all 18 parts covered?** No; see below. `docs/coverage/legal.md` exists and is accurate, apart from two claims:
   - "the top sheet slides to the back" (it unmounts; see 10);
   - "a card opens into its document" (not verified here).
10. **Banned tells?**
    - **3 equal boxes in a row, with an explaining sentence under every tile.** These are on the clutter reject list. The catalogue is 4 rows of 3 equal grey cards. Each is `min-height: 300px`, and its title is pushed down by `margin-top: auto`, which leaves about 120px of empty grey between the mono label and the title. The sentences are Hanzo's and must stay; the box grid is the problem.
    - **A lazy, browser-default look.** The status note is a `<blockquote>` that keeps the browser's `margin: 14px 40px`. Its text column is squeezed to 183px inside a 343px card on phone, and to 290px of 450px on desktop.
    - **A broken signature.** The deal is a blink, not a deal. The per-frame log shows "Terms of Service" (z 10) removed from the DOM in one frame at 763ms; the other sheets then spring forward one step. The cause is that `k > 4 → return null`, with no exit animation, so the top sheet never travels to the back as the header comment says.
    - **Clean on the rest of the list:**
      - 0 UI hues on the page (the only hue is the shared footer's "Privacy choices" icon, #0072ce);
      - no eyebrow: the "LEGAL" mono line sits 20px below the h1;
      - no green, no gradient text, no fading buttons, no Inter.
11. **Copy untouched?** Yes. Parity is 62/62 for text and 16/16 for links.
    - **Decorative, `aria-hidden` additions:**
      - the sheet addresses, "hanzo.ai/legal/<slug>", follow Hanzo's own "hanzo.ai/legal/<name>";
      - the stamp "draft · pending counsel" re-punctuates "Status: draft, pending counsel.";
      - the ladder numerals 01–04 are added; its words come from Hanzo's sentence.
    - **New aria-labels:** "Show" (the chip group) and "Documents" (the catalogue section) are not in `content/ui-strings.json`.

## Missing from the 18 parts (PLAN-COMPONENTS §2.1–2.18, measured)
- **2.1 Strategy.** `Persona:`, `Goal:`, `CTA:` and `Metric:` are in the header of `LegalIndex.jsx`. But the goal is "reach the right document in one step", and the documents start at y=1628 on desktop and y=2114 on phone, two to three screens down, behind the statement.
- **2.2 Navigation.** The anchors are kept, but `/legal#policies` lands on the chip row without selecting "Policies".
- **2.3 First impression.** The hero is 790px at 801 high, so the next section does not peek. The hero object is cut by the fold at both widths.
- **2.4 Conversion.** `data-ask="off"` is correct. `data-cta` count: 0.
- **2.5 Legal typesetting.** The plan row asks for a "sticky index"; there is none. The chip row scrolls away.
- **2.6 Content.**
  - The 3-up box grid and the blockquote margins (see 10).
  - Phone text floor: passes, with 0 runs under 14px. Desktop meta is 13px mono, which is within CANON.
- **2.7 Visual system.**
  - Radii 12, 20 and 28 are off CANON (6/10/16/24/32).
  - Literal hex values: `#efefF2`, `#ececf0`, `#a1a1a6`, `#c7c7cc`.
  - Three stale "sepia" comments: `LegalIndex.jsx` line 3, `LegalIndex.css` line 1, `app/legal/page.jsx` line 1. The colour itself is ink.
- **2.8 Components.**
  - 4 bare `:hover` rules.
  - The card has no press state.
  - Transitions use literal `.3s` and `.45s` instead of `--dur-*`.
- **2.9 Motion.** The mix is good on the first screen and in the catalogue:
  - arrival: the h1 cut-in and the lede rise;
  - idle: the deal and the dot ping;
  - scroll: Settle;
  - state: the chip filter re-flows with a layout spring in about 200ms;
  - pointer: card hover.

  Scroll-linked motion is well under half. What is missing:
  - nothing arrives below the catalogue;
  - the hero object ignores the pointer;
  - the signature's exit is a cut.
- **2.11 Mobile.**
  - The mail links are 22px tall (the plan asks for 44px).
  - Hover stays stuck after a tap.
  - The stamp wraps to two lines.
  - The pause disc sits over the sheet corners.
- **2.12 Accessibility.**
  - Hanzo's three group h2s (Agreements, Policies, Notices and registers) now exist only as button text, so heading navigation cannot reach a group.
  - "Show" and "Documents" are not in the register.
  - With JS off, the pause button still renders and does nothing.
- **2.18 Measurement.** There is no `data-cta` on the document links, so "document open" cannot be counted.
- **Passing:**
  - one h1 and one `main`;
  - JS off legible at both widths, with 0 hidden text runs (the pile collapses to one sheet);
  - reduced motion: 0 running animations after 4s, and the pile and dot hold still;
  - one timer (`useEvery`), which stops off screen and while paused;
  - the filter keeps hidden cards in the HTML (`ul[hidden]`, 7 when Policies is on);
  - no raw `img`, `video` or `table`;
  - no horizontal scroll at 320.

## Shared-system notes (not the page's fault, but they hurt it)
- **The card open on the dev server.** Morph's 700ms cut-over calls `scrollTo(0)` on the old page. The click at y=1639 therefore showed the /legal hero again before the document arrived. This may be dev-compile slowness only; check on a build.
- **The header at 320 wide.** "Try Hanzo" is clipped at the right edge.
- **The only hue on the page** is the footer's "Privacy choices" toggle icon, #0072ce.

## Fixes (in order)
1. **Make the signature a real deal on real paper.**
   - **Keep the leaving sheet mounted.** Render the outgoing top sheet until its exit finishes: `AnimatePresence`, or render k ≤ 5 and only hide at k = 5. Animate it out and down-left (x −40, y +30, rotate −6), then back under the pile at z 0, so it visibly goes to the back.
   - **Print words, not bars.** Replace the 5 grey bars with the document's own first line. That is Hanzo's lede for each doc, already read by `legalDoc(slug).lede`; keep it `aria-hidden` like the titles.
   - **Fit the pile on the first screen.** At 1470×801 the bottom must be at 780 or less, not 848: lower Settle's `lift` to 0 and/or move `.lgi-sheet` from `top: 14%` to about 6%.
   - **Phone fixes.** Keep the stamp on one line at 375, either with `white-space: nowrap` or a 13px stamp inside the 14px floor rule. Move the pause disc off the fan (bottom-left of the stack).
2. **Replace the 12 grey boxes with a ruled index.** "Proof listed quietly", as on chatgpt enterprise:
   - One row per document: the title at 28–30px on the left, Hanzo's sentence at 17px on the right, a mono group label and an arrow, on hairlines, with rows of about 88px.
   - On hover, the arrow slides and the row shows its `hanzo.ai/legal/<slug>` address, so the hover tells you something.
   - This keeps every word, removes the "3 equal boxes" reject, and roughly halves the catalogue (1,679px to about 1,000px on desktop, 3,232px to about 1,700px on phone).
   - Make the chip row `position: sticky; top: 60px` inside the catalogue. That is the plan's sticky index.
   - Let `#agreements`, `#policies` and `#notices-and-registers` select their chip.
3. **Make the lower half arrive: one thing in per section.**
   - The ladder bars grow from 0 on first view: `scaleY` from the bottom, 80ms stagger, 800ms, `--ease-out-expo`.
   - "How these fit together" and "Contact" cut in with `LineMask`, like the h1.
   - The index rows rise once as a list.
   - The mail hairlines draw left to right.
   - Under reduced motion, everything shows its final state.
4. **Fix the status card.** Set `.lgi-status blockquote { margin: 0 }` so the note uses the card's full width, and align the dot to the first line.
5. **Make every tap answer on touch.**
   - Press: `.lgi-card:active` gets `scale(.98)`, or `translateY(1px)` on index rows.
   - Wrap the chip, card and card-arrow hovers in `@media (hover:hover)`.
   - Mail links on phone: at least 44px tall (`display: inline-block; padding: 11px 0`), up from 22px.
6. **Measurement, register and outline.**
   - Put `data-cta="legal.<slug>"` on each document link so "document open" exists.
   - Add "Show" and "Documents" to `content/ui-strings.json`, or drop those aria-labels.
   - Give each group a visually hidden h2 with Hanzo's group title, so heading navigation still reaches Agreements, Policies, and Notices and registers.
   - Hide `.lgi-stack .w2-pause` in the `NoJs` sheet.
7. **Tidy.**
   - Make the selected chip an ink ring on white, not a solid ink pill, so "Try Hanzo" stays the only solid pill on screen.
   - Move radii to CANON values.
   - Swap the literal hex values for tokens.
   - Delete the three stale "sepia" comments.
