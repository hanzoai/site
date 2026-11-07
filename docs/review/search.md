# /search: James-eye review

Verdict: 5/10
First complaint: "It's blue. The search box, the tabs, the dots, the sliders, even a blue glow in the dark section, and there's a little green tag as well. I said black, white and greys. And on my laptop it opens on a big title with the search box cut off at the bottom of the screen, and nothing moves except a blinking line."

Reviewed: branch `claude/laughing-hamilton-uisesd` @ `d7f5f25` (not on main yet). Files hash: `87315df9f908`
Walked 7 Nov 13:49–13:54 UTC on the dev server, moving, at 1470×801 and 375×812 (videos, frame sheets and a frame-difference motion log kept by the critic; the site loader was skipped).
Proof: `img/search.jpg` (desktop first screen | phone first screen).

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Phone yes, desktop no. The words are clear ("Hanzo Search / Keyword and meaning in the same query"), the title is 128px at line height 0.92, and it rises out of a mask on arrival. At 1470×801, though, the search bar sits on the fold (about y 660–760). The four modes and the results, the part that shows "one query, four answers", are below the screen. The bar holds a fixed "Kubernets": the typing does not start until you scroll, because the demo waits until a quarter of it is on screen. Measured: 1 of 25 frames changed in the first second after paint, and 5 of 54 in the rest of the 3 s idle. That is the blinking caret. Phone is good: bar, four modes and the first result fit 375×812, the query types itself, and the modes switch from Text to Vector (5/25 moving frames in the first second, 38/59 after).
2. **One in, one out, or a document?** It starts well and then turns into a document. The stage does the right move: as you scroll, the title greys and lifts away while the bar rises to the centre. But on desktop the bar then holds the screen for three scroll stops (650, 1300 and 1950 px) running the same Text → Vector loop, so for a while scrolling changes nothing. The four chapters are a real pinned scene: the corrected word (Kubern**e**tes with "docs / last quarter"), then the map by meaning, then two lists fusing into one, then the RAG chat. After that it is stacked blocks: a dark room of a console and three "Step" paragraphs, a list of framework names, pricing (STILL on desktop, 2/47 frames), and then two endings in a row ("Make your content searchable and conversational" with its own two buttons and an agent prompt, then "Related capabilities" and "Get Search"). Phone: 7 of 16 screens STILL.
3. **A real object in every section?** No.
   - Yes for the stage (the bar), the chapters (four different pictures) and pricing (the "Which plan fits" finder works: moving Projects from 5 to 8 moves "fits" from Build to Scale and lights the Scale row, seen in the phone film).
   - The RAG chat's "streamed answer" is five grey bars that grow and never become words. It reads as a loading placeholder.
   - The dark room's object is the shared cloud console (gateway, payments-api, checkout-web, docs-site, "Building"), the same one /metrics uses. It shows nothing about search.
   - Frameworks is big type, not an object. "Related capabilities" is three text cards. "Get Search" has no object.
4. **One ask, sticky after the hero?** No.
   - The hero has "Read the docs" (solid) and "GitHub" (outlined).
   - Desktop: after the stage, the only sticky button is the global header's "Try Hanzo" (s2–s12), so no page ask follows you.
   - Phone: the header's "Try Hanzo" and the bottom bar's "Read the docs →" are two solid asks on every screen from s2 to s12. In pricing, the fitted plan's "Read the docs" turns solid as well.
   - The close's solid button is a different verb, "Deploy to Cloud".
5. **Every hover and press answers?** No.
   - Hero "Read the docs" and "GitHub", "View on GitHub", "Contact Sales" and the "Chat" card: hover answers, no press state.
   - Chapter tick "01": dead hover. Chapter tick "04": opacity-only hover (banned).
   - Pressing a tick scrolls the page away (1950→2117, 2135→3653).
   - "Copy": dead hover, though it presses well (0.97).
   - Good: the Text/Vector/RRF/RAG tabs answer hover and press (0.98), and the white pill slides between them. The framework names nudge 10px on hover.
   - The plan sliders are native browser range inputs tinted blue.
6. **Overlap, font swap, layout shift?** None found. CLS 0 on both widths. The h1 box is steady (one reading, 769×123 at top 218). No horizontal scroll at 375 or 320. No overlaps measured. The dev server shows a red "1 Issue" badge on every frame: React reports that the server HTML and the client HTML differ on this page. /sentinel, on the same branch, has no such error.
7. **Which reference, and is its motion there?** apple.com product page, and its motion is mostly there: a Spotlight-size bar as the product hero, the copy stepping back as the object rises, pinned chapters where one panel changes, and tabs that morph. The motion is a real mix: idle typing (phone), state changes (tab pill, fit-finder row), and scroll (stage, chapters). synchronized.studio is absent: "Related capabilities" (Chat, Bot, Crawl) are plain cards that navigate on click. There is no anthropic-style hero figure.
8. **Different from its neighbours?** Half. The first screen is its own: a centred title over a full-width search bar, not the left-hand two-line "Hanzo X" with a console on the right that /sentinel (same chat), /metrics and /ledger use. From the chapters on, it is the Cloud kit:
   - numbered pinned chapters "01 / 04" (as /metrics 01/06, /sentinel 01/06, /sign 01/05);
   - one dark room with the very same console as /metrics, including "Example project. Every name in it is one you would give your own.";
   - the same "Paste and ship" agent prompt card as /metrics;
   - a "Related capabilities" row;
   - a "Get Search" block with license and "hanzoai" chips and "Deploy to Cloud".

   /world, on the same branch, uses the same "rise" hero. James: "It's not just a template."
9. **All 18 parts covered?** No; see below. `docs/coverage/search.md` is missing.
10. **Banned tells?** Yes:
    - Blue UI hue throughout: h210 in 22 text runs, 3 backgrounds and 3 borders on desktop (15, 5 and 4 on phone). It covers the bar icon, caret and glow ring, the active tab, the first-row tint, "01 / 04", the "e" in Kubernetes, the "last quarter" chip, the map's query node and lines, the solid blue question bubble, the [1] [2] source chips, "Step 01–03", a blue glow under the dark room, "Which plan fits" and "fits", the slider fills, the lit plan's border and bullet dots, and the "api" tag. The file declares it: "Accent: search-link blue" (`--ac: #0066ff`). JAMES.md rule 7: the UI has 0 hues.
    - A green "typo fixed" tag (h135, `#1a7f37` on `#e7f6ec`).
    - A "● HYBRID SEARCH + RAG" eyebrow 22px above the h1, with a blue dot. Also a "/V1/SEARCH" kicker above the dark room's "How it works".
    - Opacity-only hover on chapter tick "04". Dead hover on tick "01" and on "Copy".
    - Browser-default controls: the two plan sliders are native `<input type="range">` with `accent-color`.
11. **Copy untouched?** Yes. Parity 103/103 text and 14/14 links. The 12 added strings are demo data (the query "Kubernets", the result titles, "How do I deploy to Kubernetes?") and labels ("typo fixed", "Which plan fits", "fits", "Open in the console ↗", the console's build line). None is a claim or a number.

## Missing from the 18 parts (PLAN-COMPONENTS §2.1–2.18, measured)
- **2.1 Strategy / 4 Common gate:** no `Persona:`, `Goal:`, `CTA:` or metric id in the page header. More than one solid button shows per viewport on phone (see answer 4).
- **2.3 First impression:**
  - With JS off, the h1 shows, but 8 runs are hidden, including the lede "Keyword and meaning in the same query" and both hero buttons. That fails a P1 row.
  - At 1470×801 the hero object is cut at the fold and frozen until you scroll.
  - The page does not end in a Band that repeats the hero ask (`bandAtEnd` false; the last solid button is "Deploy to Cloud").
  - The related cards do not open into their pages (Morph row).
- **2.4 Conversion:** 0 `data-cta`. The thumb bar ("Read the docs →") and the close ("Deploy to Cloud") use different verbs. There is no desktop sticky ask after the hero.
- **2.6 Content:** 18 text runs at 13px on phone, below the 14px floor ("Search — Hanzo", "Ready", "Building", "api.hanzo.ai/v1/search").
- **2.7 Visual system:** the blue accent and the green tag break the 0-hue override. The blue is declared as a page token (`--ac`).
- **2.8 Components:**
  - 8 `title=` tooltips (plan: 0).
  - 10 bare `:hover` rules and 6 raw `.x-btn`.
  - Hero, plan and close buttons have no press state.
  - Chapter ticks: dead or opacity-only hover.
  - Native range sliders.
- **2.9 Motion:** 3 `setInterval` timers (the typing loop and two in the shared console). The hero demo loops every 14 s with no pause control (WCAG 2.2.2 row in 2.12). The desktop hero demo does not run until scrolled. Reduced motion is good: everything comes to rest.
- **2.11 Mobile:** "Search — Hanzo" (13px tall), "Open in the console" (36px) and the "hanzoai" chip (36px) are under 44px.
- **2.12 Accessibility:** contrast under 4.5:1 on the active tab "Text" (4.1:1), "Step 01/02/03" (4.3:1) and the prompt's "api" tag (3.7:1).
- **2.13 Engineering:** React reports a hydration mismatch on this page (server and client HTML differ); /sentinel on the same branch is clean.
- **2.17 States:** the RAG answer is a skeleton that never resolves, so the page shows a loading state as its finished state.
- **Coverage:** `docs/coverage/search.md` is missing.
- Passing: one h1, one main, no horizontal scroll at 320, no raw img/video/table, reduced motion settles, CLS 0, parity complete, and the phone first screen holds the product.

## Fixes (in order)
1. **Take the blue and the green out.** Set `--ac` to ink, or remove it.
   - Make the icon, caret and focus ring of the bar ink and grey. Show the active tab by weight.
   - Mark the corrected "e" with an ink underline. Make the query node, the question bubble and the source chips ink, and turn "typo fixed" into an ink outline chip.
   - Make "Step 01–03" grey and drop the blue glow under the dark room.
   - Draw the lit plan and the slider fill in ink.
2. **Delete the "● HYBRID SEARCH + RAG" eyebrow above the h1,** and the "/v1/search" kicker above "How it works". The address already sits in the bar.
3. **Make the desktop first screen run and fit.** Start the typing on arrival, not on scroll: lower the in-view threshold, or lift the bar so that the bar and the four modes sit above 801. Render the lede and both buttons visible in the server HTML. Then shorten the stage so the bar doesn't hold the same loop for three scroll stops.
4. **One ask.** "Read the docs" is already the hero primary and the phone bar. Carry it in a desktop sticky bar after the stage, and make it the one solid button in the close. "Deploy to Cloud" and "View on GitHub" become the text row.
5. **Make every control answer.**
   - Give "Read the docs", "GitHub", the plan buttons and "Contact Sales" a press of scale 0.98.
   - Give the chapter ticks a hover that is not opacity (a width or label reveal), and give Copy a hover.
   - Restyle the two sliders with `appearance: none`, an ink track and an ink thumb, keeping the same input underneath.
6. **Give the dark room Search's own object.** Swap the shared gateway/payments-api console (the one /metrics uses) for the bar from the hero, small, driven by the three Steps. "Index your content" shows documents landing in it. "Query it from anywhere" shows the React hook, the REST API and the MCP tool calling it. "Let people ask instead" shows the answer with its two linked sources.
