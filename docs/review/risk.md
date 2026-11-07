# /risk: James-eye review

Verdict: 6/10
First complaint: "The dial's the one thing I'd stop for, and I still can't see what it decides. The score and 'summon a person' are under the fold on my laptop and cut in half on my phone. Then after the three chapters it's a document again: three columns of grey paragraphs in the black room, four boxes numbered 01 to 04, and the top plan is a black box with no name on it. And it opens exactly like Sign and Treasury."

Reviewed: branch `claude/youthful-gauss-hiiqm9` @ `303ba52` (/risk last changed in `572a1c3`, "risk: JAMES.md pass"; on origin/main, not yet on local main). Files hash: `2e15e8f4ab8e` (Risk.jsx + Risk.css + app/risk/page.jsx).
Walked 7 Nov 14:12–14:27 UTC on the dev server, moving, at 1470×801 and 375×812 (touch emulation), plus 320 wide, JS off and reduced motion. The critic kept frame bursts (8 frames 150ms apart from navigation), screen-by-screen sheets, a fine-pointer hover and press log, a layout-shift log and a solid-button count every half screen. The cookie note was skipped; hover was measured with a fine pointer forced on, because headless reports `hover: none`.
Proof: `img/risk.jpg` (desktop first screen | phone first screen).
Note: uncommitted edits to Risk.jsx, Risk.css and the shared OpenSheet appeared in the working tree at 14:28:46 UTC, after this walk ended. They change the hero grid, the Settle values and the score roll. They are not reviewed here; the hash above is the committed `572a1c3` state that was walked.

Since the last review (5/10 at `64b588a`), these landed: all red, green and amber is gone, the "● RISK" eyebrow is gone (Hanzo's "Risk" now sits inside the dial), every self-running demo has a pause button, JS-off is legible, `data-cta` is on both asks, the score roll no longer sticks, the chapter numbers now scroll smoothly instead of jumping, and the coverage file exists. These did not land: the decision on the first screen, the invisible "Pro", the reading in the back half, and hover on the stage tabs, stops and chapter numbers.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Half.
   - **Words:** clear. The h1 "One risk plane for accounts, payments and agents" is 80px with an 85px line step (1.06, just over JAMES's 1.05). There is one black "Talk to us" on the right.
   - **Motion:** yes. The lines cut in by mask (rising at about 1.2s, settled by 1.5s from navigation), the ask arrives at about 1.7s, and the needle swings from straight up to its score. After that the dial keeps deciding by itself every 2.2s (34 "allow" → 53 "summon a person" → 57 within 5s).
   - **The payoff is below the fold:** at load, Settle (`from={1.08} lift={40}`) pushes the dial card to both screen edges (x 0 to 1470), so you see the top of the arc, "the line" and the stage switch. The score and action sit at y 948–1076, 150–275px below the fold. On phone the score sits at 767–855 of 812, so "SCORE 34" is cut in half.
   - **Squint test:** three ink masses of equal weight compete on the first screen: "Talk to us", the selected "payment" tab, and (when the dial is hot) the "summon a person" chip, which stretches into a 530px black bar.
2. **One in, one out, or a document?** The hero and the three pinned chapters (`#rk-how`, 2,964px) work: the words hold while one visual swaps per chapter (case file, lifecycle track, fact toggles). The rest is a document:
   - The statement, then "Where this is today", say the same idea twice (two faces at two stages). That is 1,600px of text (y 1211–2837) with one decorative grid.
   - Four equal boxes numbered 01–04.
   - A dark room with three equal columns of grey paragraphs (about 330 words).
   - "Rules, lists and suppression": three text rows.
   - "How it connects": two text cards.
   - "What this is not": three paragraphs.

   The page is 13,273px on desktop (16.6 screens) and 17,838px on phone (22 screens).
3. **A real object in every section?** No.
   - **Have one:**
     - Hero: the dial.
     - Chapters: the alert-to-case file with the five-year clock, the stage track, and the four fact toggles routing a caller.
     - Platforms: the "declare" stack (plays once).
     - Plans: the rising ladder.
     - Close: the Sigil contour map.
   - **Have none:**
     - The statement.
     - "Where this is today": two text cards and a 24-cell grid with 9 cells filled, which implies "about 37% built", a figure Hanzo never gives.
     - "What it decides on": the numerals 01–04 are index type, not a thing.
     - "How it connects".
   - **Dark room:** its `POST /v1/event` strip streams 14 dots once over 4s and then sits dead above the three text columns.
4. **One ask, sticky after the hero?** Mostly.
   - **What works:** "Talk to us" sits in the hero (`data-thumb`, `data-cta="risk.hero"`). The shared ask bar carries "Talk to us" from about 1,200px on desktop and 1,624px on phone through to the close. The header's "Try Hanzo" goes outline while the bar shows, so the count is one solid per half screen.
   - **The gap:** the hero is 1,151px tall on desktop and 1,264px on phone, because the dial is huge. So from a scroll of about 400px to 1,200px (desktop) and 400px to 1,600px (phone), the only solid on screen is the header's "Try Hanzo", a different verb.
   - **The close:** the page's own "Talk to us" is an outlined card (`.rk-next-a.first`), and there is no Band that repeats the ask.
5. **Every hover and press answers?** Not yet.
   - **Answer well:**
     - The hero ask: fill #0a0a0b → #2c2c2e, the arrow moves 3px, press 0.98, and a magnetic drift of about 7px.
     - The reason rows: the border goes to ink, press 0.99, and a line-through when set to neutral, so the score visibly drops (for example 27 → 57).
     - The 01–04 cards: lift 4px and the plus turns.
     - The detail "+" buttons: the plus turns.
     - The Next cards: a fill shift, the arrow moves 4px and press 0.98.
   - **Dead:**
     - The stage tabs (`.rk-stage button`): no hover, only the global press.
     - The lifecycle stops (`.rk-stop`): no hover.
     - The chapter numbers (`.w2-pin-rail button`): no hover.
     - The pause buttons: rgba(255,255,255,.92) → #fff on a white card, which is invisible.
   - **Keyboard:** the stage `role="tablist"` ignores ArrowRight (focus stays on "signup").
6. **Overlap, font swap, layout shift?** No font swap, a steady h1 box, and no horizontal scroll at 320 or 375. CLS is 0.0003 on desktop and 0.005 on phone, from each "allow" ↔ "summon a person" swap shifting `.rk-score` and `.rk-action` by 0.0017. But:
   - **Pause covers text:**
     - Chapter 1, at both widths: the pause button covers "alert → case". The button is at 1386–1430 × 123–167 and the label at 1304–1405 × 148–170.
     - Chapter 3, phone: it covers the end of "a registration in your organization".
     - Chapter 2, desktop: it floats about 85px above the track card in empty white.
   - **"post-purchase" overflows** its pill by 16px at 375: the text runs 246–356 in a 240–340 pill. This was flagged last time and is still there.
   - **Phone h1 leading is uneven:** the line steps are 40, 47 and 40px, because the extra mask padding sits between the two LineMask lines.
   - **Reduced motion breaks the hero** at both widths. The h1 lines stay at `translateY(108%)`, so there is no headline at all. The dial stays at `scale(1.08)`, running x −33 to 1503 at 1470 wide with its pause button half off screen. Cause: a hydration mismatch in the shared `LineMask` and `Settle`, where the server writes the first frame and the client's `useReducedMotion()` branch never clears it.
7. **Which reference, and is its motion there?**
   - **apple.com product page:** yes. The product is the hero, the Stage settles on scroll, and the pinned chapters change one panel each.
   - **motion.dev:** yes. A spring needle, rolling figures, toggles with springs, and sheets morphing out of their card.
   - **The motion mix is right:**
     - idle: the dial, case file, track, lanes, a dot ping, the stream and the declare stack;
     - pointer: the magnetic ask, card lift and the Sigil;
     - state: tabs, toggles and sheets;
     - scroll: Settle and the pinned chapters;
     - arrival: the line mask.

     Scroll is well under half.
   - **synchronized.studio:** no. Cards open into modal sheets, not into a page.
   - **Anthropic launch:** no hero figure. That is honest, since Hanzo prints none, but the live score could be that figure and it sits below the fold.
8. **Different from its neighbours?** Partly.
   - **Its own:** the gauge, and "attribution by hand" (set a reason to neutral and the score drops by its weight).
   - **The kit:** the first screen grammar is the same as /sign, /treasury and /zap: title left, ask right, a framed stage card starting at about y 400 with a mono caps label in its top-left corner ("RISK", "DOCUMENT SIGNING", "ZAP · the buffer that arrived") and a round pause top right. Then come numbered pinned chapters, OpenCards and one dark room. /risk and /sign are both white heroes. James: "It's not just a template."
9. **All 18 parts covered?** No; see below. `docs/coverage/risk.md` now exists, but two of its claims fail on the walk: "Reduced motion shows the final dial" (the h1 vanishes) and "No figure on this page is a customer result" (true, but the unlabelled 9-of-24 grid reads as progress).
10. **Banned tells?** Mostly clean now.
    - **Clean:**
      - 0 UI hues on the page. The only hue measured is the shared footer's blue privacy-choices icon, rgb(0,114,206).
      - No eyebrow over the h1.
      - No green.
      - No fade on hover.
    - **Remaining:**
      - **A kicker above the headline in every sheet:** "/V1/AML", "IN DEVELOPMENT" and "01" sit above the sheet title (shared OpenSheet, fed by this page's `kicker` props and `k` values).
      - **Equal boxes in a row:** 4 equal cards in "What it decides on", and 3 equal text columns in the dark room.
      - **Walls of text:** see answer 2.
      - **Dead hover** on 4 controls.
11. **Copy untouched?** Yes. Parity 114/114 text and 7/7 links.
    - **Added UI strings:** "Illustration.", "reasons · tap one to set it back to neutral", "the line", "allow", "score", "action" and "N of 4 facts". None of them is in a register; `content/ui-strings.json` does not exist.
    - **Invented numbers:** the dial weights (+38/+19/+15, +34/+21/+12, +30/+16/+11) and the line at 50. They are labelled, but only by a 13px #6e6e73 caption under the reasons.

## Missing from the 18 parts (PLAN-COMPONENTS §2.1–2.18, measured)
- **2.1 Strategy / 4 Common gate:**
  - `Persona:`, `Goal:`, `CTA:` and the metric are now in the Risk.jsx header.
  - `app/risk/page.jsx` lines 1–3, Risk.jsx line 3 and Risk.css line 1 still describe a "signal-red accent", which is stale and misleading.
  - There is no Ledger entry (gate line 8: what the page deleted).
- **2.3 First impression:**
  - The score and action are below the fold at both widths.
  - Reduced motion hides the h1 (P1 row "server-rendered text", gate line 5).
  - The page hand-writes `function Hero()` instead of using `PageHero`.
  - There is no closing Band.
  - Cards open into sheets, not their page.
- **2.4 Conversion:** the page's ask is off screen for about one screen after the hero at each width; the solid there reads "Try Hanzo". The close's "Talk to us" is outlined.
- **2.5 Proof:** what Hanzo does print is still unstaged: twenty typology rules, the five-year clock, the OFAC / UK OFSI / EU / UN lists and the public source. Meanwhile the biggest numbers on the page are the invented dial weights and the implied 9/24 progress grid.
- **2.6 Content:**
  - **Under 14px on phone:** "Risk" (13px), "signup", "payment" and "post-purchase" (13px, set at Risk.css line 201), and the chapter meta lines (13px, `.w2-pin-meta` in the shared PinChapters.css).
  - **No disclosure** for the dark room's ~330 words, the three Rules rows or the three "What this is not" paragraphs, though the chapters already use sheets.
  - **Overflow:** "post-purchase" runs past its pill at 375.
- **2.7 Visual system:**
  - **Literal hex** in Risk.css: #ececf0, #c7c7cc, #8e8e93, #d1d1d6, #a1a1a6, #0e0e10 and #0a0a0b.
  - **14 radii:** 3, 4, 6, 8, 10, 12, 14, 16, 20, 22, 24, 28, 50% and pill. CANON is 6/10/16/24/32/pill.
  - **"Pro" is invisible:** the ladder's black card has a 1.0:1 title and number, because `h3` and `.rk-ladder-n` compute to rgb(10,10,10) on rgb(10,10,10).
  - **The `/v1/aml` chip** in the live card stops at 60ch (`.rk-face p { max-width: 60ch }` also hits `.rk-face-k`), so it sits mid-card while `/v1/risk` sits at the right edge.
- **2.8 Components:**
  - 3 bare `:hover` rules in Risk.css (lines 187, 189, 193) and 3 in the shared OpenSheet.css.
  - No hover on the stage tabs, stops, chapter numbers or pause buttons.
  - The tablist has no arrow keys and no tabpanel.
- **2.9 Motion:**
  - 3 `setInterval` loops via the shared `useEvery` (dial, case file, lanes).
  - Reduced motion leaves the hero mid-entrance (see answer 6).
- **2.11 Mobile:** the pause buttons cover chapter text at 375, and the phone h1 has a 47px step between 40px steps.
- **2.12 Accessibility:**
  - `.rk-out` and `.rk-lane-box` are `aria-live="polite"` while idle timers rewrite them every 2.2s and 1.5s, so a screen reader is read a new score every 2 seconds for as long as the hero is on screen.
  - "Pro" is 1.0:1.
- **2.17 States:** a hydration mismatch is logged on every reduced-motion load (Next shows "1 Issue").
- **Passing:**
  - one h1 and one main;
  - no horizontal scroll at 320 or 375;
  - no raw img, video or table;
  - CLS ≈ 0 and a steady h1 box;
  - JS off is legible (only the aria-hidden chapter demos hide);
  - one verb, "Talk to us", carried by the shared bar;
  - `data-thumb` and two `data-cta`;
  - sheets trap focus, Esc closes them and focus returns to the card;
  - parity 114/114 and 7/7.

## Fixes (in order)
1. **Put the decision on the first screen.** At 1470×801 the needle, the score and the action must all be visible without scrolling:
   - Cut `.rk-hero` top padding and `.rk-hero-top` margin.
   - Start Settle at 1 with no lift (or a lift that keeps the card inside the screen).
   - Move `.rk-out` (score + action) beside the gauge instead of under it.

   On phone, put the score and action above the gauge, so title, "Talk to us", "53 · summon a person" and the arc fit in 812px. Let the "summon a person" chip hug its text (`align-self: flex-start`) instead of becoming a 530px bar.
2. **Make reduced motion show the final hero.** The shared `LineMask` and `Settle` must render the same markup on server and client, and leave reduced motion to `MotionConfig`; request this from the Business 2 owner. Until then, Risk.css can carry `@media (prefers-reduced-motion: reduce) { .rk .x-line-in, .rk .w2-settle { transform: none !important } }`.
3. **Fix the visible bugs.**
   - Give the Pro card's `h3` and `.rk-ladder-n` #f5f5f7.
   - Move each pause button inside its own visual's top-right corner (or align `.rk-vis` items to the top), so it never covers "alert → case", the first fact row, or floats over empty space.
   - Fit "post-purchase" in its pill at 375 (pills sized to content, or less padding; keep 14px).
   - Even out the phone h1 line steps.
   - Let the `/v1/aml` chip reach the card's right edge.
4. **Turn the back half from a document into objects.** Copy stays in the DOM; only presentation changes.
   - Dark room: keep the headline, lede and a running `POST /v1/event` stream (loop while in view, with pause) as the object, and put the three ~110-word paragraphs behind one sheet, as the chapters already do.
   - "What it decides on": replace the 01–04 numerals with a live object per card (for example the dial's reason rows for that subject), or break the four equal boxes into one large plus three.
   - Fold "Where this is today" into the statement's two pills, so the two-faces idea is said once.
   - Drop the 9-of-24 grid.
5. **Every control answers, and nothing chatters.**
   - Add a non-opacity hover in `@media (hover:hover)` to `.rk-stage button`, `.rk-stop`, `.w2-pin-rail button` and `.w2-pause`.
   - Give the stage tablist arrow, Home and End keys.
   - Wrap the three bare `.rk-next-a:hover` rules.
   - Announce score changes only after a visitor acts: drop `aria-live` while the idle loop runs.
6. **Give /risk its own first screen.** The gauge is the strongest hero medium in Business 2, so let it be the stage itself: an unframed, full-width arc with the h1 inside or over it, rather than the same framed card with a corner label and a pause that /sign, /treasury and /zap use. Also:
   - Make the close's "Talk to us" the one solid on its screen.
   - Register the new UI strings ("Illustration.", "reasons · tap one…", "the line", "allow", "N of 4 facts").
   - Raise the phone 13px text to 14px.
   - Delete the stale "signal-red accent" comments.
