# /search: James-eye review

Verdict: 5/10
First complaint: "It's still blue. The search box, the tabs, the dots, the sliders, the chat bubble, even a blue glow in the dark section, and the little green tag is still there. I said black, white and greys. And on my laptop it still opens on a big title with the search box cut off at the bottom, and nothing moves until I scroll."

Reviewed: main @ `48dfb49` (last page commit `486d6d0`). Files hash: `a75074f23cdd`
Walked 7 Nov 14:19–14:21 UTC on the dev server, moving, at 1470×801 and 375×812 (videos, frame sheets and a frame-difference motion log kept by the critic; the site loader was skipped).
Proof: `img/search.jpg` (desktop first screen | phone first screen).

## Since the last review
- **Done: the red error badge.** React no longer reports a server/client mismatch. No "1 Issue" badge appears in any frame, and the walker logged 0 page errors at both widths. The fix is the shared `useCalm` hook in `StageHero` and in the chapter pictures.
- **Done: JS off.** The h1, the lede "Keyword and meaning in the same query" and both hero buttons now show with JS off (0 hidden text runs, down from 8).
- **Half done: presses and the ask.**
  - Hero "Read the docs" and "GitHub", "Contact Sales" and "View on GitHub" now press to 0.98, and "Copy" now answers hover.
  - A sticky "Hanzo Search · Read the docs →" bar now follows you on desktop from the chapters to pricing. On phone the header's "Try Hanzo" goes outlined while that bar shows, so each phone screen has one fixed solid ask.
  - The page still ends on a different solid verb, "Deploy to Cloud".
- **Still open: everything else on the old list.** Since the last review `Search.jsx` changed by 6 lines (the reduced-motion hook and one import path), and `Search.css` did not change at all.
  - `--ac: #0066ff` is still on `<main>`, and the file header still says "Accent: search-link blue". The walk measured blue in 40 text runs on desktop (22 last time). The green "typo fixed" tag is still there.
  - The "● HYBRID SEARCH + RAG" eyebrow is still above the h1.
  - The desktop bar still sits frozen on the fold.
  - The dark room still holds the shared console, the chapter ticks still have a dead or fade-only hover, and the sliders are still native.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Phone yes, desktop no.
   - **The words are clear:** "Hanzo Search / Keyword and meaning in the same query", 128px at line height 0.92. After the usual blank body before the page loads, the title rises out of a mask at about 2.1 s.
   - **Desktop at 1470×801:** the bar sits on the fold (about y 650–770), with about 175px of empty white between the buttons and the bar. The four modes and the results are below the screen. The bar holds a fixed "Kubernets" with a blinking blue caret. Measured: 0 of 25 frames changed in the first second after paint. The first-screen dwell was STILL (2 of 45 frames, the caret). The typing only starts once you scroll (sheet 02: the bar empties to "K" as the first scroll begins).
   - **Phone:** good. The bar, the four modes and the first result fit 375×812. The query types itself and the modes switch from Text to Vector: 13 of 25 frames move in the first second, and 28 of 54 after that.
2. **One in, one out, or a document?** It starts well and then turns into a document.
   - **The stage works:** as you scroll, the title greys and lifts away while the bar rises and types. But the bar then holds the screen for two full scroll stops (650 and 1300px) and part of a third, running the same Text → Vector loop.
   - **The four chapters are a real pinned scene** where one panel changes: the corrected Kubern**e**tes with "docs / last quarter", then the map by meaning, then two lists fusing into one, then the RAG chat.
   - **After that it is stacked blocks:**
     - a dark room with the console and three "Step" paragraphs;
     - a list of framework names;
     - pricing;
     - two endings in a row: "Make your content searchable and conversational" with its own buttons and agent prompt, then "Related capabilities" and "Get Search".
   - **Phone:** 7 of the 14 page screens are STILL (s3, s4, s6, s8, s10, s11, s13), and most of the others move 4–6 frames at a tiny size.
   - The desktop film ends at the top of the footer, and the phone film reaches the end.
3. **A real object in every section?** No.
   - **Yes:** the stage (the bar), the chapters (four different pictures) and pricing. The "Which plan fits" finder works: moving Projects from 5 to 8 moves "fits" from Build to Scale and lights the Scale row (desktop sheet 11).
   - **The RAG chat's "streamed answer"** is five grey bars that grow and never become words. It still reads as a loading placeholder.
   - **The dark room's object** is the shared cloud console (gateway, payments-api, checkout-web, docs-site, "Building"), the same one /gateway, /base, /crawl, /registry and /billing use. Its caption is the gateway's line, "Every request enters here, so the limiter does too." It shows nothing about search.
   - **No object at all:** frameworks is big type, "Related capabilities" is three text cards, and "Get Search" has nothing.
4. **One ask, sticky after the hero?** Nearly, but not to the end.
   - **The hero** has a black "Read the docs" and an outlined "GitHub".
   - **The sticky bar:** from the chapters to pricing, "Read the docs →" sits in a bar at the bottom on both widths (desktop s3–s11, phone s2–s9), and on phone the header's "Try Hanzo" turns outlined beside it.
   - **But:**
     - In pricing the fitted plan's "Read the docs" also turns solid, so two black buttons share the screen.
     - The page's last solid button is a different verb, "Deploy to Cloud", in the "Get Search" block.
5. **Every hover and press answers?** No.
   - **Mode tabs:** they press (0.98), but "Vector" has a dead hover. `Search.css` has no hover rule for the mode tabs at all, so "Text" only "answered" because the demo moved on by itself.
   - **Chapter ticks:** "01" has a dead hover, and "04" has an opacity-only hover (banned). Both press to 0.98.
   - **No press state:** the plan sliders (native browser range inputs tinted blue), the three "Related capabilities" cards, the "hanzoai" chip and the console's side icons.
   - **Good:** the hero buttons, "Contact Sales" and "View on GitHub" press to 0.98. "Copy" presses to 0.92. The framework names nudge 10px on hover, but they turn blue as they do.
6. **Overlap, font swap, layout shift?** None found.
   - CLS is 0.009 on desktop (one result row as it fills) and 0 on phone.
   - The h1 box is steady: one reading, 769×123 at top 218 on desktop and 329×53 at top 212 on phone.
   - No horizontal scroll at 375 or 320, and no overlaps measured. The error badge is gone.
7. **Which reference, and is its motion there?** The apple.com product page, and its motion is mostly there:
   - a Spotlight-size bar as the product hero, with the copy stepping back as the object rises;
   - pinned chapters where one panel changes;
   - tabs whose white pill slides between them.

   The motion is a real mix: idle typing (phone only), state changes (the tab pill, the fit-finder row) and scroll (the stage, the chapters). synchronized.studio is absent: "Related capabilities" (Chat, Bot, Crawl) are plain cards that navigate on click. There is no anthropic-style hero figure.
8. **Different from its neighbours?** Half.
   - **The first screen is its own.** In Cloud 4 nothing else puts a centred title over a full-width search bar:
     - /sentinel has its two-line title on the left and an issue card on the right;
     - /telemetry and /tunnel have a one-line title on the left with the lede and button on the right;
     - /visor puts the console on the left and the title on the right;
     - /stream has a dark tape behind the title.
   - **But it shares their tells:** the same coloured-dot eyebrow over the h1 (/telemetry, /tunnel, /visor and /sentinel all have one), and the same "rise" stage as /world.
   - **From the chapters on, it is the Cloud kit:**
     - numbered pinned chapters "01 / 04";
     - one dark room with the shared console;
     - the "Paste and ship" agent prompt card;
     - a "Related capabilities" row;
     - a "Get Search" block with license and "hanzoai" chips and "Deploy to Cloud", the same `Finale` as /sentinel, /stream, /telemetry, /tunnel, /visor and /world.

   James: "It's not just a template."
9. **All 18 parts covered?** No; see below. `docs/coverage/search.md` is missing on main.
10. **Banned tells?** Yes:
    - **Blue UI hue throughout.** The walk measured h210 in 40 text runs, 5 backgrounds and 4 borders on desktop (15, 5 and 4 on phone). It covers:
      - in the stage: the bar icon, caret and glow ring, the active tab, and the first-row tint;
      - in the chapters: "01 / 04", the "e" in Kubernetes, the "last quarter" chip, the map's query node and lines, the solid blue question bubble, and the [1] [2] source chips;
      - in the dark room: "Step 01–03" and a blue glow under the console (`rgba(0,102,255,.45)`);
      - in the frameworks list: the hovered name;
      - in pricing: "Which plan fits" and "fits", the slider fills, and the lit plan's border and bullet dots;
      - in the close: the "api" tag.

      The page declares it: `--ac: #0066ff` and "Accent: search-link blue". JAMES.md rule 7: the UI has 0 hues.
    - **A green "typo fixed" tag** (h135, `#1a7f37` on `#e7f6ec`), on the first screen of the phone and in chapter 01.
    - **A "● HYBRID SEARCH + RAG" eyebrow** 22px above the h1, with a blue dot. There is also a "/V1/SEARCH" kicker above the dark room's "How it works".
    - **Hovers:** opacity-only on chapter tick "04", and dead on tick "01" and the "Vector" tab.
    - **Browser-default controls:** the two plan sliders are native `<input type="range">` with `accent-color`, and there are 8 native `title=` tooltips on the console icons.
    - No sound plays. No Hanzo model cards are on this page.
11. **Copy untouched?** Yes. Parity is 103/103 text and 14/14 links. The 12 added strings are the same as before:
    - demo data: the query "Kubernets", the result titles, "How do I deploy to Kubernetes?" and the console's build line;
    - labels: "typo fixed", "Which plan fits", "fits", "Open in the console ↗".

    None is a claim or a number.

## Missing from the 18 parts (PLAN-COMPONENTS §2.1–2.18, measured)
- **2.1 Strategy / 4 Common gate:** no `Persona:`, `Goal:`, `CTA:` or metric id in the page header. Pricing shows two solid "Read the docs" buttons at once (the fitted plan's and the sticky bar's).
- **2.3 First impression:**
  - At 1470×801 the hero object is cut at the fold and frozen until you scroll.
  - The page does not end in a Band that repeats the hero ask (`bandAtEnd` false; the last solid button is "Deploy to Cloud").
  - The related cards do not open into their pages (Morph row).
- **2.4 Conversion:** 0 `data-cta`. The sticky bar ("Read the docs →") and the final solid button ("Deploy to Cloud") use different verbs.
- **2.6 Content:** 18 text runs at 13px on phone, below the 14px floor ("Search — Hanzo", "Ready", "Building", "api.hanzo.ai/v1/search", "/v1/search"). On desktop, "Copy" measures under the 13px floor.
- **2.7 Visual system:** the blue accent, declared as a page token (`--ac`), the blue glow in the dark room, and the green tag all break the 0-hue override.
- **2.8 Components:**
  - 8 `title=` tooltips (plan: 0).
  - 10 bare `:hover` rules and 6 raw `.x-btn`.
  - No hover rule on the mode tabs. Chapter ticks: dead or opacity-only hover.
  - Native range sliders.
  - No press on the related cards, the sliders or the console icons.
- **2.9 Motion:** 3 `setInterval` timers (the typing loop and two in the shared `Frame.jsx`). The hero demo loops every 14.4 s with no pause control (WCAG 2.2.2 row in 2.12). The desktop hero demo does not start until scrolled. Reduced motion is good: everything comes to rest.
- **2.11 Mobile:** these hit areas are under 44px:
  - "Search — Hanzo" (13px tall);
  - "Open in the console" (36px);
  - the "hanzoai" chip (36px).
- **2.12 Accessibility:** contrast under 4.5:1 on the active tab "Text" (4.1:1, blue), "Step 01/02/03" (4.3:1) and the prompt's "api" tag (3.7:1).
- **2.17 States:** the RAG answer is a skeleton that never resolves, so the page shows a loading state as its finished state.
- **Coverage:** `docs/coverage/search.md` is missing on main.
- Passing:
  - structure: one h1, one main, no raw img/video/table, and no horizontal scroll at 320;
  - JS off is legible (0 hidden runs), and reduced motion settles;
  - CLS 0.009 or less, no page errors and no error badge;
  - parity is complete;
  - the phone first screen holds the product and moves;
  - a sticky ask in the hero's words appears on both widths.

## Fixes (in order)
1. **Take the blue and the green out.** Set `--ac` to ink, or remove it from `<main>`.
   - **Stage:** make the bar's icon, caret and focus ring ink and grey, and show the active tab by weight.
   - **Chapters:**
     - Mark the corrected "e" with an ink underline.
     - Make the query node, its lines, the question bubble and the source chips ink.
     - Turn "typo fixed" into an ink outline chip.
   - **Dark room:** make "Step 01–03" grey, and delete the blue `box-shadow` under the console.
   - **Frameworks and pricing:** keep the frameworks hover as the 10px nudge in ink. Draw the lit plan, its dots and the slider fill in ink.
2. **Move "Hybrid Search + RAG" off the headline.** Keep the words but put them where nothing sits above the h1, for example in the bar's right-hand slot beside "/v1/search", or under the lede in grey. Delete the "/v1/search" kicker above "How it works"; the address is already in the bar.
3. **Make the desktop first screen run and fit.**
   - Start the typing on arrival: call `useLive(0)` in `Ask`, or start it on mount.
   - Cut the ~175px gap between the buttons and the bar, so the bar and the four modes sit above 801.
   - Shorten the stage so the bar holds for one scroll stop, not two.
4. **One ask to the very end.** Make "Read the docs" the last solid button: "Deploy to Cloud" in the "Get Search" block becomes outlined or a text link. In pricing, mark the fitted plan with an ink border and leave its button outlined while the sticky "Read the docs →" bar is showing.
5. **Make every control answer.**
   - Give the mode tabs a hover: ink label plus a faint pill.
   - Give the chapter ticks a hover that is not opacity (a width or label reveal).
   - Restyle the two sliders with `appearance: none`, an ink track and an ink thumb that grows on hover and presses to 0.98, keeping the same input underneath.
   - Give the related cards a press of 0.98.
   - Drop the 8 `title=` attributes from the console icons; they already show their own label.
6. **Give the dark room Search's own object, and let the RAG answer finish.**
   - Swap the shared gateway console for the bar from the hero, small, driven by the three Steps:
     - "Index your content" shows documents landing in it;
     - "Query it from anywhere" shows the hook, the REST API and the MCP tool calling it;
     - "Let people ask instead" shows the answer with its two linked sources.
   - In chapter 04, end the grey bars on a resolved state. The two sources, "Deploy to Kubernetes" and "Kubernetes ingress", grow into the answer's cards, so it never rests as a loading skeleton.
