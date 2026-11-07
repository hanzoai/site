# /search: James-eye review

Verdict: 7/10
First complaint: "First screen, two black buttons fighting: Try Hanzo up top and Read the docs under the title. Then I scroll and the header still says Try Hanzo, not this page's ask. There's a red error in the corner, and at the end one of the results flashes white and I can't read it. It's close, but it looks unfinished."

Walked 7 Nov on the dev server (localhost:4180/search/), moving, at 1470×801 (hover-capable Chromium) and 375×812 (touch), cookie bar dismissed. Per screen: two shots about 1.1 s apart, a wheel scroll of the whole page with a layout-shift observer, video recorded, and every main control hovered and pressed. Working files are in `/tmp/claude-0/critic-search/`.
Proof: `img/search-close-invisible-row.jpg` (the closing bar mid-fuse: "Running containers in production" in white on #f2f2f2), `img/search-phone-hero-truncated.jpg` (phone hero: "Deploy to Kuber…" cut off by the "typo fixed" chip).

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes, at both widths.
   - The first screen shows "Hanzo Search" at 52px (40px on phone), with "HYBRID SEARCH + RAG" as a caption under it. Below that sit the lede, "Read the docs" and "GitHub →", then a search bar the width of the page.
   - "Kubernets" types itself in about a second, the caret blinks, and the four modes take turns every 4.2 s. The 300 ms and 1 s shots already differ.
2. **One in, one out, or a document?** Mostly one in, one out.
   - The hero bar hands over to "Four ways to ask, one index". That section pins, and one picture changes per chapter: the corrected word, the meaning map drawing its three lines, the two lists fusing into one rank, and the answer streaming.
   - The dark room cycles its three steps by itself. Frameworks cycles its five names. Pricing rolls the fit-finder up to "fits Build" once. The close retypes the query and fuses the lists.
   - Desktop still screens (shots 1.1 s apart): only s1 (the gap between the hero and the chapters), s7/s9 (parts of frameworks and pricing) and the footer.
   - On phone the chapters stack, as MASTER says they should under 900px. This makes the phone page long (13,000px), and 10 of 18 phone screens are still. That is acceptable, but the bottom half reads more like a document.
3. **A real object in every section?** Yes.
   - **Hero:** the bar.
   - **Chapters:** four pictures.
   - **Dark room:** the small bar showing documents landing, then three callers reaching one index, then a streamed answer.
   - **Frameworks:** a picker that drives its own bar.
   - **Pricing:** the fit-finder sliders light the plan whose limits cover your numbers. Four ArrowRight presses on Projects gave "fits Enterprise", which is correct.
   - **Close:** the bar again, with the merged rank.
4. **One ask, nothing floating, scale with rhythm?** Floating and scale pass. The ask fails.
   - **The ask:** the page sets `data-ask="off"` on `<main>`, so the shared `Ask.jsx` never hands "Read the docs" to the header. Because of that:
     - On desktop the header shows solid "Try Hanzo" all the way down. The page's own ask never sits in the sticky header, although the page's top comment claims it does.
     - The first screen at both widths has two solid black buttons, "Try Hanzo" and "Read the docs" (first-screen solids: `Try Hanzo`, `Read the docs`).
   - **Floating:** nothing floats over content. There is no bar, cursor label or panel.
   - **Scale:** h1 52px, section heads 26px, the chapter's "Kubernetes" 64px Air as that screen's one big thing, framework names 32px, prices 44px, with the fitted price growing 1.18×. Big, medium and small are all there.
5. **Every hover and press answers?** Yes, with one weak spot.
   - These press to 0.98 or 0.97: hero ask, mode tabs, step cards, pause, plan CTAs and the close ask.
   - "GitHub" and the framework rows press by 1px. Hovering a framework row selects it and nudges its name 10px.
   - A hovered step card takes the light fill. Plan CTAs get a ring on hover.
   - **Weak spot:** the hero "GitHub →" text link does nothing on hover (colour, underline and transform are unchanged). That link comes from the shared kit.
   - No hover or press caused a jump.
6. **Overlap, font swap, layout shift?** No overlap or font swap at either width. There are two visible flaws:
   - **Close, desktop (proof jpg):** in the two-list phase of `EndBar`, the first row of the vector column ("Running containers in production") is white text on #f2f2f2 for about 1.4 s.
     - Cause: `.se2-end li:first-child` sets the ink fill and paper text, and `.se2-end-out ol.b li` resets only the background.
     - Measured: `rgb(255,255,255) on rgb(242,242,242)`.
   - **Phone hero (proof jpg):** the first result, the one the demo is about, is cut to "Deploy to Kuber…" by the "typo fixed" chip. So the corrected spelling never shows in the hero.
   - CLS during the wheel scroll was 0.00016 on desktop and 0.00012 on phone (caret only). The h1 box was steady. No horizontal scroll at 320.
7. **Which reference, and is its motion there?**
   - **apple.com product page:** yes. A Spotlight-size bar is the product as hero, and the chapters pin while one panel changes.
   - **motion.dev:** yes. The mode pill glides with `layoutId` at 300 ms ease-emphasis, and the hybrid rows re-flow into one rank.
   - **synchronized.studio (card opens into its page):** absent. "Chat", "Bot" and "Crawl" in the close are plain links.
8. **Different from its neighbours?** Partly.
   - **Its own:** the hero medium, a live full-width search bar, belongs to this page alone.
   - **Shared:** the skeleton is the Cloud kit's: `StageHero`, then `PinScenes` with "0N / 04", then a dark room, then `Finale`. Visor, Telemetry, Stream, Sentinel and World use the same pieces.
   - The close is centred with the bar above the head, which sets it apart from the split `Finale` elsewhere.
9. **All 18 parts covered?** Judged from the page, not the card. Mostly yes.
   - **Present:**
     - the header comment, with Persona, Goal, CTA, Metric, Signature and Beyond;
     - one h1 and one `<main id="main">`;
     - `data-cta` on every ask (8) and `data-thumb` on the primary;
     - parity 0 missing;
     - pause controls first in the hero object and the dark room;
     - custom sliders with `aria-valuetext`;
     - 44px phone targets (0 under 44px in main at 375);
     - reduced-motion final states in the source;
     - a Beyond aid built from Hanzo's own plan limits.
   - **Gaps:**
     - Part 4: the sticky ask is switched off by the page (answer 4).
     - Part 3: no Morph.
     - Part 13/17: a console error, below.
     - The top comment's claim "sticky header on desktop" is false.
10. **Banned tells?** One on the gate list: **a red error badge and a console error.**
    - React logs a hydration mismatch on both widths, and the dev overlay shows "1 Issue" bottom left.
    - The page-owned part of the mismatch is the two `.l2-range` inputs in `Pricing`: their `--p` fill is set by `fillOf()` through `style.setProperty` on a ref, so the client's `style` differs from the server HTML.
    - The same report also flags the shared `FooterHTML` markup, which is not this page's.
    - **Clean:** no hue at either width, nothing above the h1 or any h2, no gradient text, no springs, no fade-only hovers, no browser-default controls, and no floating bar.
11. **Copy untouched?** Yes. `python3 scripts/parity.py /search` gives `OK text 103/103 links 14/14`. The new strings are demo data and UI labels. The streamed answer is Hanzo's own RAG chat sentence.

## Shared-chrome notes (not counted against the page)
- The header's "Try Hanzo" is solid on every page. Only the page's opt-out (`data-ask="off"`) is counted here.
- The shared `FooterHTML` hydration mismatch.
- The kit's primary hover goes to `rgb(44,44,46)`, which is not on the deck's neutral ramp.
- The kit's "GitHub →" text link has no hover change.
- The phone cookie card covers about 220px. That is in spec, but it hides the hero results until dismissed.

## Fixes to reach 8
1. **Clear the console error.** In `Pricing`, render the slider fill inline: `style={{ '--p': (p / (PROJ.length - 1)) * 100 + '%' }}`, and the same for docs, as `World.jsx` does. Drop the `fillOf` ref effect. Then the server and client agree, and the page's half of the hydration mismatch goes. Re-check that the only remaining mismatch is the shared footer, and file it in `docs/requests/search.md`.
2. **Put the page's ask in the header.** Remove `data-ask="off"` from `<main>`. Then the shared `Ask.jsx` steps the header's button down to an outline while the hero's "Read the docs" is on screen, and carries "Read the docs" solid once it scrolls away. If that conflicts with the close band, use `data-ask-hide` on the `Finale` rather than switching the ask off for the whole page. That gives one solid fill per viewport on the first screen.
3. **Fix the close's invisible row.** Scope the ink first row to the merged list only:
   - `.se2-end ol.m li:first-child { … }` instead of `.se2-end li:first-child`;
   - or set `color: var(--ink)` on `.se2-end-out ol.b li`.

   Then "Running containers in production" reads during the two-list phase.
4. **Let the phone hero show the fix.** At under 900px, either hide the "typo fixed" chip in the hero rows (chapter 01 already shows it), or let `.se2-doc b` wrap to two lines instead of ellipsing. Then "Deploy to Kubernetes" reads in full on the first screen.
5. **Make the top comment true.** Correct the CTA line ("sticky header on desktop") to whatever fix 2 delivers, so the header comment matches what the page does.
