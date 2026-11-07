# /pricing — James-eye review

Verdict: 7/10
First complaint: "It's clean and I know the price straight away, but it's a price table. On my phone nothing moves, there are two black Try Hanzo buttons, and the API tab is a wall of tables."

Walked 7 Nov 2026 (16:00 UTC) on the local dev server at `37309968`, page files `components/pages/Pricing.jsx`, `Pricing.css`, `app/pricing/page.jsx`. I used Playwright and filmed at 1470×801 and 375×812 (isMobile, hasTouch), with 12 frames over the first 6 s untouched. Then I scrolled slowly on all three tabs: wheel on desktop, smooth steps on phone. I hovered and pressed the plan columns, the asks, the Pro ladder chips, "Compare plans", the tabs, the Team steppers and the FAQ. I also did a 45-stop Tab crawl, a reduced-motion load, a JS-off load, deep links (`#api`, `#team`) and a 320px check, with non-localhost POSTs blocked. Three other critics were sharing the machine. Stills: `review/pricing/desktop-first-screen.jpg`, `review/pricing/phone-first-screen.jpg`, `review/pricing/compare-sheet.jpg`.

## What works
- **Clear in five seconds.** At 1470×801 the first screen holds "Pricing", the lede, the Personal/Team/API pill, and three plan columns with their prices and asks. All three asks sit level at y=613, measured within 1px. Free is the default and the only solid fill, and once the page hydrates the header's "Try Hanzo" drops to outline. The page follows MASTER 4.5 to the letter.
- **The plan sheet works as a picker.** Clicking Go moves the solid fill to Go's ask and outlines Free's, with no layout jump. Press is a 0.98 scale.
- **The Pro ladder is the page's one idle moment, and it behaves.** From about 1.5 s it walks 3x/$15 → 5x Dev/$45 → 15x Max/$95 → ∞ Ultra/$195, then stops by about 4.5 s. Holding the pointer on the Pro column froze it at 3x. The odometer rolls only between real prices.
- **"Compare plans" is the best thing on the page.** A white sheet grows out of the column you pressed and lights that plan (Max, after I picked 15x). It shows Hanzo's own lines side by side, Esc closes it and focus returns to "Compare plans". On phone it becomes one plan at a time behind a segmented switch, which reads well.
- **The API tab's completion-window stair** (immediate / priority / loose) is a real drawn object. It is the one diagram on the page.
- **Clean checks:**
  - parity 100/100 text and 5/5 links; `taste.py` OK; `unique.py` OK.
  - CLS 0.0006 desktop and 0.0005 phone.
  - No horizontal scroll at 375 or 320 on any tab.
  - Reduced motion leaves 0 running animations after 3.5 s.
  - With JS off the whole sheet is legible and Pro shows as Pro.

## The 11 answers
1. **Does it sell in 5 s, and does something move within 1 s?**
   - **Desktop:** it sells. The h1 cut-in finishes before the first frame, and nothing else moves until the Pro ladder's first step at about 1.5 s. That is past the 1 s mark, but close.
   - **Phone:** after the cut-in, frames 1 to 11 (0.5–6 s) show no change except the cookie card arriving. The Pro column, which carries the only idle motion, sits about 1,500px down. On phone the first screen is dead.
2. **One in, one out, or a document?**
   - **Personal:** short and calm, with three screens: the sheet, the trust links and FAQ, then the Band.
   - **API:** the tab is 9,086px of model tables (Enso, Zen, Embedding, Kai, tools), one after another, with STARTER/PRO/ULTRA pills on every row. That is the "overload of information" James named. The stair is the only break.
3. **Does every section hold a real visual object?**
   - **Yes:** the sheet, the compare sheet and the stair.
   - **No:** the FAQ is type only, as is the trust-link row. On Team the Enterprise column is mostly empty white at the first screen, with one 26px line and a sentence.
4. **One ask in the sticky header, and does scale have rhythm?**
   - **The ask:** on desktop, yes. The header is outlined while Free's solid ask is on screen and turns solid once it scrolls away. On phone the header's "Try Hanzo" stays solid at rest, so the first screen shows two solid "Try Hanzo" buttons, the header's and Free's, 470px apart. Nothing floats over content apart from the consent card, which is allowed.
   - **Scale:** good on Personal. The 52px h1, the 64px Air prices and a 26px "No card needed" give big, medium and small. The Band's heading jumps to display size, which is fine as the closing moment.
5. **Does every hover and press answer, without jumps?**
   - **What answers:** column hover previews, and click selects. The asks press at 0.98, the chips and tabs answer, and the steppers press.
   - **Weak spots:**
     - The FAQ's "+ 22" control has no hover detail, and its visible label is a bare number.
     - Pressing a solid ask flashes `rgb(44,44,46)`. That comes from the kit `Cta`; it is not on the deck ramp.
6. **Overlaps, font swap or layout shift?**
   - **None found:** no overlap at either size, no font swap, no shift over 0.001.
   - **The badge:** the red dev "1 Issue" badge (a hydration-attribute mismatch) appeared on both walks under the 4-critic load. It did not appear on a quiet reload. As in `_shared.md` §3, I do not hold it against the page.
7. **Which reference does it feel like, and is its motion there?**
   - **apple.com:** the calm and the plan sheet feel like Apple's compare page, and the sheet opening out of its column is a decent nod to synchronized.studio.
   - **Missing:** there is no pinned scene or scrubbed moment. On phone, none of the reference motion arrives.
8. **Is it different from its neighbours?**
   - **Yes:** the odometer ladder and the column-sheet are taken by no other page (`unique.py` OK).
   - **But:** at rest it reads as a well-made generic SaaS pricing grid. It has no Hanzo object: no model art, no product, no Sigil.
9. **Are all 18 parts covered?** 18/18 in MASTER format. See the card check below.
10. **Any banned tells?**
    - **No pill above a headline:** "-20%" sits beside "Annual / Monthly", not above.
    - **The closing Band's heading reveals with a blur:** "configuring the right plan?" comes in blurred. MASTER part 9 bans opacity-and-blur reveals. This is shared `Band` behaviour, but it shows on this page.
    - **Inline trust links are 21px tall on phone:** "How Hanzo is secured", "Trust center", "Read the Privacy Policy" and "Contact our engineering team". They are under the 44px target.
11. **Is the copy untouched?** Yes. Parity is 100/100, and "pro-2x" in the Pro ask matches Hanzo's outline.

### Money-page axes (MASTER §1.5)
| Axis | Score | Why |
|---|---|---|
| Clarity | 4 | Every price is readable in the first screen, the tabs are obvious, and the compare sheet answers "what do I get". The only blemish is the API tab's depth. |
| Hierarchy | 4 | The h1 is 52px, prices are 64px Air, and there is one solid ask on desktop. Phone loses a point in spirit with two solid fills. |
| Craft | 4 | The asks are aligned, the odometer only rolls between real prices, and the sheet morph is good. Small misses: "+ 22", the 21px tap targets, a doubled Tab stop on the Band ask (SPAN then A), and a hash change that doesn't switch the tab in place (`#api` → `#team` stays on API). |
| Motion | 3 | One idle ladder, the odometer, the sheet growing and the tab pill. Phone is still after the cut-in, there's no motion past the first screen on desktop, and the Band uses a blur reveal. |
| Distinctiveness | **3** | The ladder is clever, but the page could be any SaaS pricing page with Hanzo's words. There is no Hanzo image, product or Sigil anywhere. **This is below the required 4.** |
| Action | 4 | The default plan is the one solid ask, plan asks are level, trust links sit beside them, and the header ask follows. Phone's double solid is the only fault. |

The page fails the money-page gate on Distinctiveness, which must be 4 or more.

## Card check
`docs/coverage/pricing.md` exists, uses the MASTER format, has 18/18 `Done here:` lines filled and lists its copy questions. I checked its claims on the page:
- **True:**
  - plan asks level (613/613/613);
  - Free the default solid ask;
  - the ladder ends within 5 s and stops under the hand;
  - the compare sheet traps focus and returns it on Esc;
  - JS off shows Pro only;
  - no horizontal scroll at 320;
  - parity 100/100;
  - "+ 22" with the answers kept in the HTML;
  - reduced motion leaves a static final state;
  - the free ask's bottom is at 534 on 375×812 (the card says 601; either way it is above the fold).
- **Overstated:**
  - **Part 3, "something moves within 1 s":** true on desktop only at about 1.5 s, and false on phone.
  - **Part 11, "every target 44px or more":** the inline trust links measure 21px on phone.
  - **Part 2, "tabs sync to `#team` and `#api`":** on load, yes. A hash change inside the page does not switch the tab.
  - **Part 1, "one solid fill per viewport":** not true on phone, where the header and the Free ask are both solid.

None of these is a false claim on the scale that caps a page, but parts 3 and 11 need the evidence corrected.

## To reach 8
1. **Give the phone first screen life.** Something must move within 1 s at 375×812. Either bring the Pro ladder into the first phone screen (put the Pro column first or second in the stack, or show a compact Free/Go/Pro picker above the stack), or let the Free column's figure carry a one-shot odometer. Then outline the header ask while Free's solid ask is on screen, as desktop already does, so phone has one solid fill.
2. **Raise Distinctiveness to 4.** Give the sheet a Hanzo object. One option is for the selected plan's column to show what the tier unlocks as a real thing: the model marks or `SPEC.md` model-card art for "Every model, including Enso Ultra and Kai", or a Sigil seeded per plan, running quietly behind the price. As it stands, nothing on the page says Hanzo except the words.
3. **Tame the API tab.** Keep every row (copy is frozen), but show one model group open by default and collapse the other groups behind their headings, with their row counts and "from" prices. That way the stair, then one table, is the scroll, not 9,000px of tables.
4. **Fix the small faults:**
   - Give the "+ 22" disclosure a hover state and the register's "Read more" visibly beside the count.
   - Make the inline trust links 44px tall on phone.
   - Listen for `hashchange` in the tabs.
   - Remove the duplicate focus stop on the Band ask.
   - Request a Band reveal without blur from the shared owner (line mask, per part 9).
5. **Correct the card's evidence** for parts 1, 3 and 11 to match the measurements above.
