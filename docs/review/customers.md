# /customers — James-eye review

Ready: 2026-11-08 scale now rests at h1 52 / statement 22–34 (medium, was 44) / section heads 26 / row names 21 / row figures 32, with the plate figure and the close's sliding figures as each screen's one big thing; fixed "Every launch" and the year filter never appearing (a fully clipped box never fired its observer: they now rise when the section enters), row figures fade-rise whole once the row is up the screen instead of showing sliced in their masks, the hero lens only opens over the headline's words (no blank disc), plate figure label spacing; filter 11→3→11, plate doorway and Back, reduced motion 0 running animations. taste OK, parity 72/72 + 10/10, unique OK, check.mjs desktop 0 overlaps, phone 0 errors / no h-scroll; its phone overlap flags are the opaque sticky year rail passing over rows (by design, checked in the screenshots). 500s are the blocked hanzo.ai media.

Verdict: 7/10
First complaint: "It's all shouting. The headline is huge, the number under it is even bigger, every section heading is massive, and the index names are big too. Where's the small and the medium? One big thing per screen, then let it settle."

Walked on build `9eec64ee` (the page files are unchanged since `70d1547e`) on the dev server at http://localhost:4180/customers/. I used my own Playwright scripts with a real mouse, not the film tool's headless hover check:
- **Desktop 1470×801:** recorded on video. I watched the first screen with no input and probed the arrival timeline every ~95 ms. I wheel-scrolled the whole page in 200 px steps with dwells, and hovered and pressed both asks, the plate, the case tabs, index rows, year chips and backer links. I filtered by year and cleared it, and opened the Damon plate (doorway) and came back.
- **Phone 375×812** (isMobile, hasTouch): recorded on video. I touch-dragged the whole page in 260 px swipes, tapped a year chip, tapped the KANOA tab, measured tap targets and watched for any bottom bar.
- **Also checked:** reduced motion and JS off at both sizes, layout shift (PerformanceObserver), console errors across about 22 loads, `scripts/parity.py /customers` (OK, text 72/72, links 10/10) and `scripts/taste.py` on `components/pages/Customers.jsx` and `.css` (OK).
- **Stills:** `docs/review/customers/desktop-walk.jpg` and `docs/review/customers/phone-walk.jpg`.

Remote hanzo.ai covers and logos are blocked in this sandbox, so I judged the fallbacks: a Sigil line drawing on the plate, and names in place of logos.

## What works
- **The launch stage is a real signature.** On desktop, wheel-scrolling the index swaps the pinned stage one launch at a time: SKULLY → STONED Audio → Unikrn → Casper → Triller → Personas, with exactly 1 layer each time. Pointing at a row answers at once: Arca gave $500M, Palladium €150M, Triller 169M, and the row's quiet `#f5f5f5` fill comes up behind it. This is the "pinned stage where one panel changes" from his list. It is the page's own, and it tells you something on hover.
- **Phones get their own scene.** A sticky year rail and a 64px figure strip sit under the header, and the strip swaps through every launch as you swipe (always 1 layer). Row names go from grey to ink and the figures roll up once. It is not a shrunk desktop.
- **Arrival is authored.** The h1 line mask starts at first paint (translateY about 103px down to 0 by +1.4 s). The lede and ask follow at about +1.0 s, the plate at about +1.2 s. The plate's progress line then fills over 5.2 s, the plate wipes Damon → KANOA → back to Damon, and then it rests. Something moves inside 1 s.
- **Every control answers, with no jump:**
  - Hero ask: `#0a0a0a` → `#262626`, press scale .97.
  - Close ask: white → `#e5e5e5`, press .97.
  - Plate arrow: fills white and slides 4px.
  - Case tab: grey → ink.
  - Backer names: `#737373` → ink.
  - Year chip: gliding pill, 111×48. Filter 11 → 3 → 11 rows, with one `role=status` line.
- **The plate opens into its page.** The ink grows from the plate, and the Damon case page is up by about 1.2 s. Back returns to /customers.
- **It is clean:**
  - Layout shift 0.0003 on desktop and 0 on phone.
  - No horizontal scroll at either size.
  - 0 phone tap targets under 44px.
  - No hue; taste passes.
  - Nothing sits above an h1 or h2. "Case studies" is a mono caption under the plate.
  - JS off stacks both cases readably at both sizes with 0 faint text.
  - Reduced motion leaves 0 running animations, and only the inactive case panel is hidden.
- **The desktop header ask works.** After the hero it turns into a solid "Talk to us" (outline while the hero ask shows). There is no floating bar on desktop. The phone's slim bar shows only between the index and the close and never covers the page's own ask.

## The 11 answers
1. **First screen sells in 5 s; something moves in 1 s? Yes.** The h1, lede, "Talk to us" and the $8.4M plate are all on the first screen at 1470×801. The h1 cut-in starts at first paint. After the arrival, the only motion for 5 s is a 2px progress line, which is quiet but alive.
2. **One in, one out, or a document? Mostly one in, one out.**
   - The index is a scene on both sizes.
   - Weak spot: during a continuous wheel scroll the desktop stage is empty in about 20% of samples (6 of 30). That is the exit-then-enter gap.
   - Phone weak spot: the strip shows the same figure as the row right under it ($135K in the strip and $135K in the row, on one screen).
3. **A real visual object in every section? Yes, with fallbacks.** The objects are the plate, the stage, and the dark close with its figure rows. "Backed by builders" falls back to grey names because the logos are blocked. On the plate, the logo fallback prints the case name, and the h3 below prints it again, so "Damon Motorcycles" shows twice on the plate at both sizes.
4. **One ask, nothing floating, and scale rhythm? The ask passes; scale fails.**
   - The ask is "Talk to us": in the hero, then in the header, then in the close.
   - Scale is the failure. I measured:
     - h1 84px with the plate figure at 112px on the same first screen;
     - section h2s at 64px ("Every launch", "Backed by builders."), against the 26px resting size;
     - index names at 40px;
     - stage figure 84px;
     - close headline 84px over figure rows at 176px.
   - Little is medium and nothing grows into the moment and settles; it is big everywhere. JAMES.md rule 1 says one big thing per screen, with resting sizes h1 52, sections 26, figures 64.
5. **Every hover and press answers, no jumps? Yes.** All measured with a real mouse (see above). The case tab, row, chip and backer hovers change colour or fill rather than opacity. Press is .97 everywhere.
6. **Overlaps, font swap, layout shift? None from the page.**
   - Layout shift is about 0.
   - The cookie card covers the plate figure at both sizes, but that is shared chrome.
   - Once, in about 22 loads (the first desktop run), React logged "A tree hydrated but some attributes of the server rendered HTML didn't match" and the dev "1 Issue" badge showed. I could not reproduce it in the other 21 loads, so I cannot pin it on this page. Worth one check of the plate's `inert` and `aria-hidden` attributes and of `useCalm`.
7. **Which reference? Apple's pinned stage where one panel changes; synchronized.studio's card that opens into its page (the doorway); chatgpt enterprise's calm proof listing.** All three are actually present in motion. The Apple-style "huge type" has been applied to every heading, not just the moment.
8. **Different from its neighbours? Yes.** The hero medium is a turning case plate, the signature is the pinned launch stage, and it adds a year index. The black close with sliding figures is its own.
9. **All 18 parts covered? Yes.** The card has 18 `## N.` headings, each with a `Done here:` line.
10. **Banned tells? No hue, eyebrow-over-headline, gradient text, Inter or glow.** The one hit is from the rejected list: "everything big at once" (see 4).
11. **Copy untouched? Yes.** Parity is 0 missing (72/72 text, 10/10 links).

## Card check
The card follows the 18-part format with all `Done here:` lines filled. I spot-checked five claims:
- **Ask beside the lede at x=820, y=425–473: true.** Measured 820, 425, 128×48.
- **Year pill 111×48, filter 11 → 3 → 11: true.**
- **$8.4M on the first screen at y 638–739: true.** Measured top 638.
- **Phone strip swaps one layer at a time through every launch: true.**
- **Hovers live inside `@media (hover: hover)` and press is .97: true.** The CSS comment still says ".98", which is harmless.

No false claim found, so no cap. The card presents the deck's clamp(52px, 7vw, 84px) h1 as if it were on-brief. It doesn't address JAMES rule 1's resting sizes, and that gap is this verdict.

## Fixes (in order)
1. **Give scale its rhythm** (JAMES 1, MASTER 3.1). Rest the h1 at 52px and the section h2s ("Every launch", "Backed by builders.", "Launch with us") at 26px. Bring the index names down to 17–21px. Let one thing per screen be big:
   - the plate figure on the first screen;
   - the stage figure in the index, at a 64px rest, growing only while it is the row being read, then settling;
   - the sliding close figures.

   The h1 and the $8.4M must not both be giants on the first screen.
2. **Stop the phone strip from doubling the row figure.** While a row is "being read", fade or collapse that row's own first figure, or have the strip carry the second figure or the year. One number should appear once per screen.
3. **Don't print the name twice on the plate.** When the case logo is missing, the fallback should be empty (the h3 already carries the name) or show the year only.
4. **Close the empty-stage gap on desktop.** Shorten the exit, or let the outgoing and incoming figures overlap by the 40px MASTER part 3 allows, so the stage never reads blank while you scroll.
5. **Check the one-off hydration attribute mismatch.** Look at the plate's `inert` and `aria-hidden` on the first client render and at `useCalm`, so the dev badge can't come from this page.
