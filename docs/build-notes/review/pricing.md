# /pricing — James-eye review
Ready: 2026-11-07, slice D — one morphing plan panel (one data-thumb, so one solid fill on every tab), the model art answers the plan picked, plan names roll through a clipped slot (no overlap while the Pro row walks), phone "How we bill" folds to its first line (API tab 11,454 → 9,552px), card corrected; Go/Pro asks verified on /pay/confirm/card?plan=go and ?plan=pro-2x

Verdict: 7.5/10
First complaint: "Better, I know the price straight away and the model art moves now. But it's still a price table with three little pictures stuck in the corner that have nothing to do with the plans. And on Team and API there are two black buttons again."

Walked 7 Nov 2026 (16:30 UTC) on the local dev server, page files `components/pages/Pricing.jsx` and `Pricing.css` at `dba2ca82`. Playwright with video, 1470×801 and 375×812 (isMobile, hasTouch), 13 frames over the first 6 s untouched, then a slow wheel scroll (desktop) and smooth-scroll steps (phone) through the whole page. I hovered and pressed the plan columns and asks, clicked Go to select it, set the Pro ladder to 15x, opened "Compare plans" (desktop and phone), switched Personal/Team/API, pressed the Team stepper, opened the API model groups and the FAQ "Read more + 22". Also: a 50-stop Tab crawl, a `#team` hashchange in place, direct `#api`/`#team` loads, reduced motion, JS off and 320px on all three tabs. Non-localhost POSTs were blocked. Four critics shared the machine. Stills: `review/pricing/desktop-first-screen.jpg`, `review/pricing/phone-first-screen.jpg`, `review/pricing/compare-sheet.jpg`.

## What works
- **Sells in 5 seconds at both sizes.** "Pricing", the lede, the tab pill and the Free/Go/Pro sheet with prices and asks fill the first desktop screen. On phone the Free ask's bottom sits at 626 of 812.
- **Something moves within 1 s now, on phone too.** Hanzo's Enso, Zen and Kai art deals in at about 0.2 s (grey to black in frames t00 to t02), then each card lifts in turn. On desktop the Pro ladder also walks 3x/$15 to ∞/$195 and settles back on Pro. This fixes the last review's dead phone first screen.
- **The picker works.** All six plan asks sit at y=690 within 1px. Free is the only solid by default. Clicking Go moves the solid fill to Go with no jump, and pressing scales to 0.98. Hovering a column gives it a quiet fill.
- **The compare sheet is still the best moment.** It grows out of the column you pressed, lights the plan you picked (Max after 15x), and has focus in it. Esc returns focus to "Compare plans". On phone it is one plan at a time behind a segmented switch.
- **The API tab is tamed on desktop.** The model families fold (Enso open, then Zen 7, Embedding 1 and Kai 3 closed with counts), and "How we bill" is a numbered 01/02/03 list. The completion-window stair (immediate, priority, loose) is a real drawn object. The desktop API tab is 7,779px, down from 9,086px.
- **Fixes since the last review are real:**
  - `hashchange` switches the tab in place (`#team` selected Team);
  - the FAQ shows "Read more + 22" with a hover fill (transparent to #f5f5f5) and a 56px row;
  - the phone probe found no in-page target under 44px.
- **Clean checks:**
  - parity 100/100 text and 5/5 links; `taste.py` OK; `unique.py` OK;
  - CLS 0.0006 on desktop and 0 on phone;
  - no horizontal scroll at 320 on any tab;
  - reduced motion leaves 0 running animations after 3.5 s;
  - JS off keeps every word legible (the only hidden h2 is the closed compare sheet's);
  - Tab crawl: 50 stops, all visible, all with a focus ring.

## The 11 answers
1. **Does it sell in 5 s, and does something move within 1 s?** Yes at both sizes. The art strip arrives at about 0.2 s and the ladder runs from about 1 s on desktop.
2. **One in, one out, or a document?**
   - **Personal:** three calm screens: the sheet, then the trust row and FAQ, then the Band. Between the trust row (bottom 1236) and the FAQ heading (1402) there is 166px of empty white with nothing in it.
   - **API on phone:** 11,454px, mostly prose ("How we bill", "The rates") and tables in one long column. It is better than before but still reads as a document on a phone.
3. **Does every section hold a real visual object?**
   - **Yes:** the plan sheet, the compare sheet, the stair and the art strip.
   - **No:** the FAQ and the trust row are type only. On Team, the Enterprise column is a 26px sentence and a paragraph in a mostly empty half.
4. **One ask in the sticky header, and does scale have rhythm?**
   - **The ask, Personal on desktop:** correct. The header "Try Hanzo" is outlined while Free's ask is on screen.
   - **The ask, Team and API on desktop:** wrong. The first screen shows two solid fills: the header's "Try Hanzo" and "Get API Key" (API), or "Chat with buying specialist" (Team, after a short scroll). The cause is page-side. `Ask.jsx` watches the first `[data-thumb]` in `<main>`, and that is Free's ask inside the hidden Personal panel. The page sets `thumb` on asks in every tab, hidden or not.
   - **The ask on phone:** two solid "Try Hanzo" buttons at rest (the header and Free). This is shared and already asked for in `docs/requests/pricing.md`, so it is not held against the page.
   - **Scale on desktop:** good. The h1 is 52px, prices are 64px Air and "No card needed" is 26px.
   - **Scale on phone, Team tab:** two 64px figures ($40 and $20) in one screen.
5. **Does every hover and press answer, without jumps?**
   - **Yes:** the columns, the asks (0.98), the ladder chips, the tabs, the steppers, the FAQ disclosure and the API group toggles all answer.
   - **The press colour:** pressing a solid ask flashes `rgb(44,44,46)`. That comes from the kit `Cta` and is not on the deck ramp (shared).
   - **The art strip:** it answers nothing. Hover and selection don't touch it.
6. **Overlaps, font swap or layout shift?**
   - **None from the page.** No overlap, no font swap, no shift over 0.0002.
   - **The consent card:** at 375×812 it covers Free's ask until it is dismissed. It is the shared consent card (203px, under the 220px cap) and is not held against the page.
   - **The badge:** the red dev "1 Issue" badge (a hydration-attribute mismatch) appeared on the first cold loads under 4-critic load, but not on the later networkidle loads. It is not held against the page.
7. **Which reference does it feel like, and is its motion there?**
   - **apple.com compare page:** the calm sheet and the compare sheet.
   - **synchronized.studio:** the sheet opening out of its column.
   - **Missing:** there is still no pinned or scrubbed moment. That is acceptable for a Utility page (MASTER 4.5: "no scroll theatre").
8. **Is it different from its neighbours?** Yes by `unique.py`: the odometer ladder and the column-sheet are its own. But the art strip is a loose garnish. It is three thumbnails top-right, unrelated to the plan you pick, and it goes still by about 4 s. At rest the page is still a well-made generic SaaS grid with Hanzo's words.
9. **Are all 18 parts covered?** The card has 18/18 headings with "Done here" lines. See the card check below.
10. **Any banned tells?**
    - **The Band's blur reveal:** the closing Band's heading still comes in blurred. It is shared and already requested, so it is not held against the page.
    - **Nothing else:** no pill above a headline ("−20%" sits beside the billing switch), no hue, no Inter.
11. **Is the copy untouched?** Yes. Parity is 100/100 text and 5/5 links.

### Money-page axes (MASTER §1.5)
| Axis | Score | Why |
|---|---|---|
| Clarity | 4 | Every personal price is in the first screen, the tabs are obvious, the compare sheet answers "what do I get", and the API groups fold. Phone API is still long. |
| Hierarchy | 4 | The 52px h1, 64px prices and one solid ask hold on Personal. Team and API show two solids on desktop (page-fixable), and phone Team has two 64px figures in one screen. |
| Craft | 4 | Level asks, odometer between real prices only, sheet morph, hashchange, 44px targets, clean focus crawl. Small misses: the thumb on hidden tabs, the 166px dead gap above the FAQ, and the empty Enterprise half. |
| Motion | 4 | Arrival (h1 cut-in, art deal-in), idle (ladder), state (tab pill, sheet growing, selection, odometer). It now moves on phone within 1 s. Nothing moves past the first screen, which is fine for Utility. |
| Distinctiveness | **3** | The art strip adds Hanzo imagery but is decoration in a corner, disconnected from the picker. The page's own idea is still "pricing grid with an odometer". **This is below the required 4.** |
| Action | 4 | The default plan is the one solid ask, plan asks are level, and trust links sit beside them. The double solid on Team and API loses some. |

The page fails the money-page gate on Distinctiveness, which must be 4 or more.

## Card check
`docs/coverage/pricing.md` exists in MASTER format with 18/18 headings and filled `Done here:` lines, open copy questions, requests and deleted forks.
- **True:**
  - asks share one y (690, six of six);
  - Free is the default solid;
  - the art deals in within 0.2 s;
  - the ladder settles;
  - the compare sheet traps focus and returns it;
  - the API families fold to one open;
  - "Read more" is visible;
  - no phone target under 44px;
  - hashchange works;
  - JS off is legible;
  - no horizontal scroll at 320;
  - parity 100/100.
- **Overstated:**
  - **Part 1, "the lowest plan … is the page's only solid ask":** true on Personal only. On Team and API the header stays solid beside the tab's own solid ask on desktop, because `thumb` is set on asks inside hidden tab panels.
  - **Part 11, "the API tab no longer runs 9,000px":** true on desktop (7,779px), but on phone the API tab measures 11,454px.
  - **Part 13, "No images or films":** the page now ships three `Img` art cards (part 10 says so), so part 13's tick contradicts part 10.
- **Part 18:** it is honestly left unticked for the review.

## To reach 8
1. **Make the art strip part of the picker (Distinctiveness to 4).** Let the selected plan light the art its own lines name, with no new words:
   - Free lights "Enso Free and Zen Free";
   - Go and above light "Every model, including Enso Ultra and Kai";
   - Pro's ladder steps give the strip a small lift on each step.

   Or move the strip into the sheet as the head of the Go/Pro columns. Then the Hanzo object answers your choice instead of sitting top-right. Right now it is the "icon alone" James rejects, just prettier.
2. **One solid fill on every tab.** Pass `thumb` only to the asks in the active tab (`thumb={tab === 'api'}` and so on), so `Ask.jsx` watches a visible ask and the header steps aside on Team and API as it does on Personal.
3. **Shorten the phone API tab.** At ≤899px, fold "How we bill" items 02 to 05 and "The rates" table behind their headings (keep the words in the HTML, `hidden="until-found"`), so the phone API scroll is the plan pair, the stair, one open model family and the Band.
4. **Close the dead gap and fill the empty half.**
   - Pull the FAQ up so the trust row and the FAQ heading are about 72px apart, not 166px.
   - On Team, give the Enterprise column its "What's included" list at the same y as Team's seats, so the half isn't white at the first screen.
5. **Correct the card** for parts 1, 11 and 13 as above.

Not held against the page (already in `docs/requests/pricing.md`): the phone header's solid ask, the Band's blur reveal and its doubled keyboard stop. Also not held against it, as shared kit: the `Cta` press colour `rgb(44,44,46)`.
