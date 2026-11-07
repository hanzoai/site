# /search: James-eye review

Verdict: 6/10
First complaint: "The top is right now: it's black and white and the search types itself. But that 'Read the docs' bar sits on top of the words all the way down, it even hides a price, and on my phone I pressed Copy and it opened the docs. Everything under it is huge, and after the four ways nothing moves."

Reviewed: main @ `cb11693` (last page commit `4b53974`). Files hash: `ddbb4c20614f`
Walked 7 Nov 14:36–14:39 UTC on the dev server, moving, at 1470×801 and 375×812 (videos, frame sheets and a frame-difference motion log kept by the critic; the site loader was skipped).
Proof: `img/search.jpg` (desktop first screen | phone first screen).

## Since the last review
- **Done: the colour, the eyebrow and the sliders.** There are 0 hues at either width; last time desktop had blue in 40 text runs, plus the green "typo fixed" tag. "HYBRID SEARCH + RAG" is now a caption under the h1, and the "/v1/search" kicker over "How it works" is gone. The plan sliders now have an ink track and thumb (desktop s10).
- **Done: the desktop first screen runs and fits.**
  - At 1470×801 the bar (y 515–605), the four modes (620–700) and the first result sit above the fold.
  - The query types itself as soon as the page shows (d-sheet-01: "Ku" → "Kubernets"), then the modes take turns (the s0 shot pair goes from Text to Vector). There is a 44px pause.
  - The RAG answer now ends in Hanzo's own sentence with "[1] RAG chat [2] How it works" (s6), instead of grey bars.
  - The dark room shows the bar with documents landing in it, and the gateway console has moved into a drawer.
- **Done: one ask to the end.** "Deploy to Cloud" is a text link. The fitted plan gets an ink ring and an outlined button. The black band repeats "Read the docs". There are 8 `data-cta` and 1 `data-thumb`, and `docs/coverage/search.md` exists.
- **Still open:**
  - the three equal "Related capabilities" boxes, and the two endings ("Get Search", then the band);
  - Pause and the related cards still have no press, and "Vector" still has a dead hover;
  - phone motion still dies after the first screen. Now 18 of 19 phone screens are STILL; last time it was 7 of 14.
- **Not judged:** page commit `d5d6f10` (14:37) landed on main after this walk. Its message reads "one dark ending … related as a line of links, frameworks picker". The coverage card on main already describes that build, so the next walk has to check it.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes, at both widths.
   - **Desktop:** everything fits inside 801. "Hanzo Search" is 116px, the caption sits under it, then the lede "Keyword and meaning in the same query", then "Read the docs" and "GitHub", the bar, the four modes and the first result.
   - The body is blank for the usual dev-server ~2 s ("first second after paint" 0/25 falls in that window). Then the h1 cuts in by mask, the query types, and the modes cycle: 10/48 moving frames in the rest of the 3 s.
   - **Phone:** the 52px title, caption, lede, ask, bar, modes and two results are all on the first screen. 7/25 frames move in the first second and 41/63 after that.
2. **One in, one out, or a document?** The first half yes, the second half is a document.
   - **The stage:** the title steps back and the bar rises to the top and keeps answering. On desktop s1 it streams the RAG answer, with about 240px of empty white under the bar.
   - **The four chapters** are a real pinned scene where one panel changes: the corrected Kubern**e**tes, the map by meaning, the two lists fusing into one, then the answer with its sources.
   - **After that come stacked blocks:** the dark room, five framework names, pricing, "Get Search" with its prompt and three boxes, then the black band.
   - **Motion past the chapters:** the shot pairs differ only by a 1–2px scroll settle. Once that is aligned out, the only authored motion is at s0 (typing, modes), s1 (the answer streaming) and s5 (the lists fusing). s3 and s4 are STILL, and s7–s14 change only by a blinking caret or a hover nudge. The dark room waits for a hover: d-sheet-11 shows "Index your content" unchanged for 4 s.
   - **Phone:** 18 of 19 screens are STILL (shotdiff 0 from s1 to s18). The chapter pictures play on mount, so they are finished before you reach them.
3. **A real object in every section?** Mostly.
   - **Yes:** the bar (hero), four chapter pictures, the dark room's bar with documents landing, and the fit-finder ("Projects 5, Docs per project 10k, fits Build" lights the Build card).
   - **No object:** frameworks is five names in big type. "Related capabilities" is three text boxes. The band is text only.
   - **The drawer:** "See the example console" opens on phone (frame at 23.9 s), but it still holds the shared gateway console (gateway, payments-api, checkout-web, docs-site). Nothing in it is about search.
4. **One ask, nothing floating over content? Scale has rhythm?** The ask is right, but the bar floats over content and the scale fails.
   - **The ask:** one verb throughout. "Read the docs" is solid in the hero, in the site's ask bar from s2 to s11 at both widths (with the header's "Try Hanzo" outlined beside it), and in the band.
   - **Floating over content, desktop:** the site's ask bar (`components/Ask.jsx`) is a fixed pill at bottom centre. It sits on:
     - chapter 01's first result, where only "typo fixed" shows (s2);
     - the dark room's "Cluster quotas" row (s7);
     - the Enterprise card's "Custom" price (s10);
     - "Paste this into any agent… from there" (s11).
   - **Floating over content, phone:** the full-width bar covers:
     - the last lines of the Vector and Hybrid paragraphs (s2, s3);
     - the Pricing lede (s9);
     - the prompt card's "AGENT PROMPT … Copy" row (s11). The walker tapped "Copy" there and the page navigated away: the tap landed on the bar's "Read the docs".
   - **Scale:** everything below the hero is big at once. Live hanzo.ai rests at h1 52, section heads 26 and figures 64. This page rests at:
     - h1 116px;
     - every section head 56px;
     - the chapter-01 word 92px under a 56px head and a 40px chapter title (s2);
     - five 44px framework names beside a 56px head (s9);
     - three 68px prices beside a 56px "Pricing" (s10);
     - "Get Search" 96px (s11–s12);
     - the band 76px.

     Nothing grows and settles back. The phone sizes are calmer (h1 52px, section heads 36px).
5. **Every hover and press answers?** No.
   - **Answers, with a press of 0.98:** hero "Read the docs"; the "Text" and "RRF" tabs; the "01" and "03" rail ticks; "Query it from anywhere"; "See the example console"; "hanzoai". "Copy" presses to 0.92, and "GitHub", "Deploy to Cloud" and "View on GitHub" press 1px.
   - **Dead hover:** the "Vector" tab, the lit step cards ("Index your content", "Let people ask instead") and the sliders.
   - **No press:**
     - Pause: its hover `scale(1.06)` overrides the `:active` scale(.94), because both rules have the same specificity and the hover comes later.
     - The related cards: the same fault, with their 4px hover lift, which the walker also logs as a jump.
   - **Phone taps:**
     - "Text" and "Let people ask instead" answer.
     - The sheet does open, and Pause swaps to a play icon (p-sheet-01, last frames), although the walker logged both as "no visible change".
     - "Copy" was under the ask bar, so the tap went to the bar instead.
6. **Overlap, font swap, layout shift?**
   - The fixed ask bar overlaps content at both widths (answer 4).
   - On phone, the vector map's "Scaling a service" label sits on the corner of "Deploy to Kubernetes", and "Running containers in …" is cut (p-shot-03).
   - The OVERLAP lines at desktop s7–s8 and phone s6–s7 are each step card's own invisible hit button (`.se2-step-hit`, inset 0) over its heading. Nothing visible overlaps there.
   - The h1 box is steady: one reading at each width.
   - CLS is 0.014 on desktop (one result row) and 0 on phone. There is no horizontal scroll at 375 or 320.
7. **Which reference, and is its motion there?**
   - **apple.com product page:** yes. A Spotlight-size bar is the product hero, the copy steps back as it rises, and the chapters pin while one panel changes.
   - **motion.dev:** yes. The mode tabs' white pill glides, and the hybrid lists re-flow into one.
   - **synchronized.studio:** absent. "Chat", "Bot" and "Crawl" are plain links, and no card opened into its page in the walk.
   - **anthropic launch:** absent. No hero figure.
8. **Different from its neighbours?** Only the hero.
   - **The hero is its own.** In Cloud 4 nothing else centres a title over a full-width search bar:
     - /sentinel (same commit) has a two-line title on the left and the issue card on the right;
     - /stream has a dark partition tape behind a one-line title.
   - **The rest is the Cloud 4 kit:**
     - the mono caption under the h1 (/sentinel "SENTRY.HANZO.AI", /stream "KAFKA WIRE PROTOCOL");
     - "01 / 04" pinned chapters with the rail;
     - one dark room;
     - the "Get X" block with "License" and "hanzoai" chips, "Deploy to Cloud", "Paste and ship" and three "Related capabilities" boxes, the same as "Get Sentinel";
     - a black band;
     - the same "Hanzo X | Read the docs" pill.

   James: "It's not just a template."
9. **All 18 parts covered?** No; see below. The card exists and has all 18 parts, but two of its claims fail the walk.
10. **Banned tells?** Yes:
    - **Floating over content:** the site's ask bar covers text, a price and the page's Copy button.
    - **Everything big at once:** 56px heads beside five 44px names, then beside three 68px prices; "Get Search" at 96px.
    - **Three equal boxes in a row:** Chat, Bot, Crawl (desktop s12).
    - **A dead page on phone:** 18 of 19 screens are STILL. On desktop the dark room and everything below it move only when touched.
    - **Clean:** no hue at either width, nothing above the h1 or any h2, 0 `title=` tooltips, no browser-default controls, no sound and no model cards.
11. **Copy untouched?** Yes. Parity is 103/103 text and 14/14 links.
    - The 13 added strings are demo data: the result titles, "How does RAG chat answer?", "docs ·" and the console's build line.
    - The rest are UI labels: "typo fixed", "Which plan fits", "fits", "See the example console" and "Open in the console ↗".
    - The streamed answer is Hanzo's own RAG chat sentence. Nothing added is a claim or a number.

## Missing from the 18 parts (MASTER §2, measured; coverage card checked)
- **Part 1 Strategy:** Persona, Goal and CTA are in the header. The metric id is inside the CTA line ("Metric: cta_click:search.primary"), so the check finds none. The card lists no copy questions.
- **Part 3 First impression:**
  - After the stage, the bar holds the top of the screen with about 240px of empty white under it (desktop s1).
  - The page still ends twice: "Get Search" with its prompt and boxes, then the band.
  - No card opens into its page (Morph).
- **Part 4 Conversion:** the site's ask bar sits over content at both widths: desktop s2, s7, s10 and s11, phone s2, s3, s9 and s11. On phone it sits on the prompt's Copy button.
- **Part 6 Content:** "FITS" is 13px on phone, under the 14px floor. It is a mono capital label, so it should be a 12px caption or 14px.
- **Part 7 Visual system:**
  - 0 hues, and nothing above a headline.
  - `Search.css` carries 32 literal greys (`#5f5f64` ×13, `#3a3a3c` ×5, `#f5f5f7` ×4, …) instead of the `--hz-*` tokens. `#5f5f64` is not a token at all.
  - Only the hero differs from its neighbours.
- **Part 8 Components:**
  - The Pause and related-card presses are masked by their hover transforms.
  - The "Vector" tab, the lit step cards and the sliders have no hover.
  - 9 bare `:hover` rules and 5 raw `.x-btn` uses (source scan).
- **Part 9 Motion:**
  - Below the chapters nothing runs without input. `HowBar`'s own comment says "nothing here runs by itself".
  - Phone is 18 of 19 STILL.
  - There are 4 `type: 'spring'` transitions (stiffness 300, damping 30), where the deck says no springs.
  - There are 4 `setInterval` timers.
  - Reduced motion settles (0 running after 3 s).
- **Part 11 Mobile:**
  - "GitHub" (68×21), "Deploy to Cloud" (132×21) and "View on GitHub" (127×21) are under 44px.
  - The vector map's labels collide.
  - The bottom bar covers text and the Copy button.
- **Coverage:** `docs/coverage/search.md` has all 18 parts in the older numbered format, but two claims are false:
  - **Part 9:** "every button scales .98 on press". Pause and the related cards do not press, and the sliders have no hover.
  - **Part 11:** "targets ≥44px … the ask bar sits under the thumb". Three links are 21px tall, and the bar covers text and Copy.

  Its part 2 and "Ledger (deleted)" lines now describe `d5d6f10`, which this walk did not see.
- **Passing:**
  - **Structure:** one h1 and one main; no raw img, video or table; no horizontal scroll at 320.
  - **Load and fallbacks:** JS off shows everything (0 hidden runs), and reduced motion settles. The h1 box is steady, CLS is 0.014 and 0, and there are no console errors at either width.
  - **Look:** 0 hues, nothing above any headline, 0 low-contrast runs, 0 title tooltips, and custom sliders.
  - **Ask and states:** 8 `data-cta` and 1 `data-thumb`; the band repeats the hero's ask; the RAG answer resolves; the hero object has a 44px pause.
  - **Copy:** parity 103/103 and 14/14.

## Fixes (in order)
1. **Get the ask bar off the content.** Write `docs/requests/search.md` for `components/Ask.jsx`:
   - **Desktop:** no bottom pill. Once the hero ask leaves view, put "Read the docs" in the header's ask slot, which MASTER part 4 already asks for.
   - **Phone:** reserve the bar's height at the bottom of each section, so it never sits on text.
   - **On this page now:** put `data-ask-hide` on the "Get Search" prompt card, so the bar steps aside for Copy.
2. **Give scale a rhythm.** Set this page's resting sizes to live hanzo.ai's:
   - `.se2 .l2-head` 26px;
   - framework names 21px;
   - the fitted plan's price at 64px and the other two at 32px, so the price grows as its plan fits;
   - "Get Search" and the band head 52px.

   Let the h1 start at 116px and shrink to 52px as the bar rises. Keep chapter 01's "Kubernetes" as that screen's one big thing.
3. **Keep something moving below the chapters.**
   - **Dark room:** let it step through its three steps by itself while it is on screen, with `useSteps(3, 4200, live)` as the hero does. Hover, tap or a pause stops it.
   - **Phone:** start each chapter picture when it reaches 60% in view, not on mount, so the lists fuse and the answer streams while you look at them.
4. **Make every control answer.**
   - Write the Pause and related-card presses as `:hover:active`, or move the `:active` rules below the hover block, so the press shows.
   - Give the mode tabs a hover that reads (a faint white pill under the label), the lit step card a hover, and the slider thumb a hover grow.
   - Make "GitHub", "Deploy to Cloud" and "View on GitHub" 44px tall on phone.
5. **End once, with no three boxes.** Turn "Related capabilities" into one line of links (Chat, Bot, Crawl) and fold "Get Search" into the black band. `d5d6f10` says it does both; the next walk will check.
6. **Correct the card and the curves.**
   - Fix the part 9 and part 11 claims.
   - Put the metric id on its own header line.
   - Swap the four `type: 'spring'` transitions for `ease-emphasis` at 300 ms.
