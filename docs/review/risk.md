# /risk: James-eye review

Verdict: 6/10
First complaint: "The dial's better. I can see what it decides now. But on my phone it jumps: every couple of seconds the gauge shrinks to half and everything under it hops. And the big number it keeps flashing isn't one of ours. There are two black buttons at the top. After the chapters it's rows of grey text, a black room with a plus sign in it, and 'What this is not' is a heading with a plus under it."

Reviewed: branch `claude/youthful-gauss-hiiqm9`, walked at `9e2c486`. The page files last changed in `30e721f` ("Business 2: scale rhythm…"); before that, `8ab6fa7` and `7c7836b`. Files hash (Risk.jsx + Risk.css + app/risk/page.jsx): `0b0e60e17a2f`. While I wrote this, HEAD moved to `2eb72b7`. That commit only touches shared files (NoJs refactor, phone rail-title wrap, slider CSS). The working tree also has one uncommitted Rhythm.css line (sheet titles at 26px). None of it changes the findings below.
Walked: 7 Nov, 14:35–15:12 UTC, on the dev server, moving, at 1470×801 and 375×812 (touch emulation), plus 320 wide, JS off and reduced motion. I kept:
- 10-frame load bursts from navigation and idle bursts;
- a half-screen walk with a solid-button count at each stop;
- screencasts;
- a wheel-scroll layout-shift trace;
- a fine-pointer hover and press log (headless forced to `hover: hover`);
- a phone burst of the dial over 5s.

The cookie note was skipped.

The shared system changed three times during the walk:
- the rhythm pass (14:48);
- sheet kickers moved under the sheet title (about 14:55);
- the desktop ask bar and the cursor label were removed (15:01–15:02).

Findings are from the final state unless marked.
Proof: `img/risk.jpg` (desktop first screen | phone first screen | the same phone screen 0.55s later, after the dial collapses).

Since the last review (6/10 at `572a1c3`):
- **These landed:**
  - The decision is on the first screen: score and action at y 607–701 on desktop and 557–627 on phone.
  - Reduced motion shows the final h1 and dial.
  - "Pro" is legible.
  - The two faces are said once.
  - The 9-of-24 grid is gone.
  - Each of the four decision cards carries its own drawing.
  - The dark room's paragraphs and "What this is not" moved into sheets.
  - The stage tabs, stops, rail numbers and pause buttons answer hover.
  - The stage tablist takes ← and →.
  - `aria-live` is off while the dial idles.
  - The phone text floor is 14px.
  - The phone h1 steps are even (47/47/47).
  - Sheet kickers sit under the sheet title (shared).
- **These did not land:**
  - A first screen of its own (it is still /sign's grammar).
  - A solid "Talk to us" at the close.
  - UI strings in the register.
  - A Ledger entry.
  - A Band ending.
  - The stale "red accent" comment (Risk.jsx line 3) and "signal red" comment (Risk.css line 1).
  - The bare `.rk-next-a:hover` rules (Risk.css lines 192, 194 and 198).
  - The dark-room stream, which still runs once and stops.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes, but the first screen now has three problems.
   - **Words:** the h1 "One risk plane / for accounts, / payments / and agents" is 52px (the Rhythm.css resting size), set as 4 hard lines (y 317–535) with a 62px line step (1.19 with the mask padding). One "Talk to us" sits under it.
   - **Motion:** yes. The h1 cuts in at first paint (CSS LineMask; it is mid-cut in the 554ms frame), the needle swings by about 1.1s, and the dial decides again every 2.2s.
   - **The decision is visible:** on desktop the dial runs 639–1458 × 268–739, with the score at 630–701 and the action at 607–701. On phone the score and action sit at 557–627 and the arc at 677–810.
   - **Two solid pills on the first screen at both widths:** the header's "Try Hanzo" and the hero's "Talk to us" (every load-burst frame, and both walk stops above 430px, at each width). Since 15:01 the header no longer steps down to an outline. The "summon a person" chip is a 38px, two-line black block, a third ink mass at squint.
   - **The biggest figure on the page is invented.** The score is 76px and flips every 2.2s: 72 → 34 → 53 → 67 → 46 → 55 → 27 → 41. Next to it are the weights (+38/−38, +19, +15 and so on). The only label is a 13px #6e6e73 line, "Illustration…". The conductor's rule is that counters never flash numbers that aren't Hanzo's.
2. **One in, one out, or a document?** Half and half.
   - **Works:** the hero and the three pinned chapters (`#rk-how`, 2,964px): the words hold while the case file, the track and the lanes swap.
   - **Better:** "What it decides on" (4 cards, each with its own drawing).
   - **Still a document after that:**
     - **The dark room:** a 26px h2, the lede, a `POST /v1/event` strip whose dots run once in 4s and stop, and a lone "+" in about 250px of black.
     - **"Rules, lists and suppression":** three 16px text rows.
     - **"Platforms":** text, plus a declare stack that plays once.
     - **"How it connects":** two text cards.
     - **"What this is not":** a 26px heading and a "+" in a 7/12 column, with about 500px of white under it.
   - **Length:** the page is 11,321px on desktop (14.1 screens, down from 16.6) and 13,996px on phone (17.2, down from 22).
3. **A real object in every section?** Mostly.
   - **Have one:**
     - the dial;
     - the endpoint tiles `/v1/aml` and `/v1/risk`;
     - the case file with the five-year clock;
     - the track;
     - the fact lanes;
     - the four card drawings (accounts acting as one, transaction to action, usage bars, a stamped record);
     - the endpoint strip;
     - the declare stack;
     - the ladder;
     - the Sigil.
   - **Have none:**
     - "Rules, lists and suppression";
     - "How it connects";
     - "What this is not", which is a "+" only. "An icon alone fails."
4. **One ask in the header, nothing floating over content, scale with rhythm?** These rules are new in JAMES.md and MASTER as of 14:41.
   - **The header:** "Try Hanzo" is solid at every stop of the walk (29 on desktop, 35 on phone); over the dark room it inverts to a light fill.
   - **The page's own ask:** "Talk to us" is solid only in the hero, where it is a second solid. After the hero it never returns as a solid:
     - the desktop bar is gone (shared, 15:01);
     - the phone bar showed at 0 of 35 stops, because it only appears where it covers nothing;
     - the close's "Talk to us" is an outlined card (`.rk-next-a.first`, 2px ink ring).
   - **Nothing floats:** no bar and no cursor label any more (shared). The page's `data-cursor="Neutral"` and `"Open"` attributes are now inert.
   - **Rhythm is half done:**
     - **Done:** the h1 at 52px, h2s at 26px, h3s at 17px, body at 16px and the lede at 21px.
     - **Still big:**

       | Element | Size |
       |---|---|
       | `.rk-say-h` "Two faces over one engine…" | 76px, weight 600 |
       | `.rk-face-ep` `/v1/aml`, `/v1/risk` | 74px |
       | `.rk-ep` `POST /v1/event` | 62px |
       | score | 76px |
       | action chip | 38px |
     - **Screen 2 is three big things at once** (desktop y≈800–1600): the statement and the two endpoints.
     - **A label over the headline:** the 26px h2 "Where this is today" now sits directly above the 76px statement.
     - **"Next" is now a big caps tag:** the Rhythm override turned `h2.w2-kicker` into a 26px uppercase mono label above the close cards.
     - **Inverted order:** the card titles (`.w2-oc-t`, 28px) outrank their 26px section heading.
5. **Every hover and press answers, with no jumps?** The hovers mostly answer now; the jumps are covered in answer 6.
   - **Answer:**
     - the hero ask: fill #0a0a0b → #2c2c2e, the arrow moves 3px, press 0.98;
     - the stage tabs: a white veil and ink text, press 0.98;
     - the reason rows: an ink border, press 0.99, a line-through and the score drops;
     - both pauses: they invert to ink, press 0.94;
     - the rail numbers: ink, the bar widens 1.25×, press 1px;
     - the detail "+": turns 90°, press 0.98;
     - the decision cards: lift 4px, the plus turns, press 0.99;
     - the Next cards: a fill shift, the arrow moves 4px, press 0.98;
     - the stops: an inactive stop's ring turns ink.
   - **Dead:** the four fact switches (`.rk-facts button`) have no hover.
   - **Keyboard:** the stage tablist has no Home or End.
6. **Overlaps, font swap, layout shift?**
   - **Clean:** no font swap, a steady h1 box, no horizontal scroll at 320 or 375.
   - **The phone dial jumps on every idle flip.**
     - **Cause:** `.rk-dial` keeps `align-items: center` from its grid rule when the phone CSS turns it into a flex column. So `.rk-dial-l` shrinks to fit its content, and the gauge (78% of that column) goes from 235px wide to 117px whenever "summon a person" becomes "allow".
     - **Effect:** the tabs and everything below move 82px (tabs at y 830 → 748). The burst log shows the gauge at 235px for 2.2s, then 117px for 2.2s, and so on.
     - **Measured shift:** 0.0335 per flip at the top of the page, and 0.0913 while reading "Where this is today" at scroll 974, where that whole section hops 82px. The session maximum is about 0.09–0.10 against a 0.02 budget. MASTER bans visible layout shift.
   - **The desktop dial card re-centres by 10px on every flip:** the dial is 268–739 ↔ 278–728 (0.0069 each), because the two-line chip makes `.rk-dial-l` 21px taller.
   - **Overlaps:**
     - **The dial pause covers the "post-purchase" tab.** The pause (1395–1440 × 285–330) sits on the right end of the stage track (1067–1421 × 315–369), 26×15px, over the selected "post-purchase". Its text (1309–1421) also runs 5px past its thumb (1303–1416) at 1470 wide.
     - **The phone chapter pause is unreachable.** It sits at 315–359 × 8–52, under the header (`elementFromPoint` there is the header). The WCAG 2.2.2 control for the case file, the track and the lanes cannot be reached on a phone.
     - **The desktop chapter pause floats.** It sits at x 1424, y 68 in the page margin, 40px above the visual, attached to nothing.
     - **The chapter detail pills are crammed.** Six names at 16px/1 sit in a 48px pill: two lines on desktop, three on phone. On phone the "+" disc is squashed to 11px and 19px wide, because `.w2-detail i` shrinks.
   - **Reduced motion:** the final state, with 0 running animations. A hydration-mismatch error is still logged; it comes from the shared Settle's `useReducedMotion` branch.
7. **Which reference, and is its motion there?**
   - **apple.com product page:** yes. The product is the hero, and the pinned chapters change one panel each.
   - **motion.dev:** yes. The needle, toggles and sheets now use 300ms and 600ms in-out curves with no springs.
   - **synchronized.studio:** no. Cards open into sheets, not into their page.
   - **Anthropic launch:** Hanzo prints no figure here. The invented score fills that slot, which is the problem in answer 1.
8. **Different from its neighbours?** Partly.
   - **/treasury and /zap** now open dark, with the object below the title.
   - **/sign** still has /risk's exact grammar: a white page, the title and ask on the left, and a framed white card on the right with a mono caps name in its top-left corner ("DOCUMENT SIGNING" / "RISK") and a round pause top right.
   - **/security** is also title left, object right.
9. **All 18 parts covered?** No; see below. `docs/coverage/risk.md` is stale:
   - it was written at `572a1c3`;
   - it uses the old numbered format, not MASTER §6's 18-heading card with "Done here:" lines;
   - it still describes a separate "where it stands today" section, the ask bar, and "Live score and action are `aria-live`".
10. **Banned tells?**
    - **Clean:**
      - 0 UI hues; the only hue is the shared footer's privacy icon, rgb(0,114,206);
      - no green;
      - no fade on hover;
      - no gradient text;
      - nothing floats over content (as of 15:02);
      - sheet kickers are under their titles.
    - **Remaining:**
      - Everything big at once on screen 2 (MASTER 3.3, "in your face").
      - The 26px h2 over the 76px statement, which reads as a label over a headline.
      - Two solid pills on the first screen.
      - Visible layout shift on phone.
      - Invented figures flashing.
    - **`taste.py` passes,** but off-deck neutrals remain in Risk.css: #ececf0 ×5, #a1a1a6 ×5, #d1d1d6 ×3, #d2d2d7 ×2, #c7c7cc, #8e8e93, #0e0e10, #0a0a0b ×18 and #f5f5f7 ×6. MASTER 3.1 allows only the deck ramp.
11. **Copy untouched?** Yes. Parity 114/114 text and 7/7 links.
    - **UI strings missing from `content/ui-strings.json`** (which exists now): "Illustration. No figure on this page is a customer result.", "reasons · tap one to set it back to neutral", "the line", "score", "action", "allow", "N of 4 facts", "same call · same record · same model", "alert → case", "five-year clock on every retained record", "declare", "money plane reads it", "shadow" and "record".
    - **Invented numbers:** the weights and the line at 50.

## Missing from the 18 parts (PLAN-COMPONENTS §2.1–2.18 and MASTER §2, measured)
- **2.1 Strategy / gate:**
  - The header has Persona, Goal, CTA, metric, Signature and Beyond.
  - Risk.jsx line 3 ("red accent") and Risk.css line 1 ("signal red") are stale.
  - There is no Ledger entry (what the page deleted).
  - The first screen has two solids (gate line 3).
- **2.3 First impression:**
  - A hand-written `Hero`, not `PageHero`.
  - No closing Band; the page ends on three Next cards.
  - Cards open into sheets, not their page.
- **2.4 Conversion:** after the hero the page's own ask is gone at both widths (no bar, and an outlined close card). The only solid after y≈430 is "Try Hanzo".
- **2.5 Proof:** what Hanzo does print is still unstaged: twenty typology rules, the five-year clock, OFAC / UK OFSI / EU / UN and the public source. The hero figure is the invented score.
- **2.6 Content:**
  - The chapter detail pills cram 6 names into 48px.
  - The dark room and "What this is not" open from a bare "+" with no visible word.
  - Screen 2 sets text at 76px and 74px.
- **2.7 Visual system:**
  - Off-deck greys (see 10).
  - Radii: 3, 4, 6, 8, 10, 12, 14, 16, 20, 22, 24, 28, 50% and pill. MASTER allows 6, 8, 12, 16, 24, 28, full, and 20 for art.
  - Dead CSS: `.rk-build`, `.rk-model-cols`, `.rk-not-p`.
- **2.8 Components:**
  - The fact switches have no hover.
  - The tablist has no Home or End.
  - Bare `:hover` on `.rk-next-a` (×3), plus `.w2-oc-card:hover .w2-oc-plus` (shared).
- **2.9 Motion:**
  - 3 `setInterval` loops through `useEvery`.
  - The stream and the declare stack play once and go still.
  - Magnetic on the hero ask is within MASTER's 22px.
- **2.11 Mobile:**
  - The dial jump.
  - The chapter pause under the header.
  - The squashed "+" in the pills.
- **2.12 Accessibility:**
  - The chapters' pause is unreachable on phone (WCAG 2.2.2).
  - A hydration error is logged under reduced motion (shared Settle).
- **2.18 Measurement:** `data-cta` is on both asks. The `data-cursor` attributes are inert.
- **Passing:**
  - one h1 and one main;
  - no horizontal scroll at 320;
  - JS off is legible (only the rail numbers hide on phone);
  - reduced motion shows the final state;
  - parity and taste;
  - `data-thumb` and 2 `data-cta`;
  - sheets trap Tab, Esc closes them, and focus returns.

## Fixes (in order)
1. **Stop the dial jumping.**
   - Give the action a box that does not change size: either `.rk-action b { white-space: nowrap }` at a size that fits one line (about 26px on desktop and 22px on phone), or a two-line `min-height` in both states.
   - On phone, set `.rk-hero-g .rk-dial { align-items: stretch }` so `.rk-dial-l` is full width and the gauge stays at 78% of the card.
   - On desktop, use `align-items: start` (or a fixed dial height) so the card stops re-centring.
   - Target: CLS 0 while the dial idles, at both widths.
2. **Flash no number that isn't Hanzo's.**
   - Keep the needle, "the line", the bars and the action word, and drop the digits: no 76px score and no ±weights.
   - Bar length already shows each reason's share, and striking a reason still drops the needle. The action word ("summon a person" / "allow") becomes the big thing.
   - If a number must show, show it only after the visitor has touched a reason (`mine`), never on the idle loop.
3. **One solid on the first screen, and the ask again at the close.**
   - The header's "Try Hanzo" is now the one solid. Make the hero's "Talk to us" the quiet button (`w2-ghost`), or ask the shared owner to step the header down while a page `data-thumb` is on screen, as before 15:01.
   - Make the close's "Talk to us" the one solid of its screen, as a Band, because nothing else carries the page's ask after the hero.
4. **Finish the rhythm.**
   - Bring `.rk-say-h` to the 32px statement step (`gx-say`), and `.rk-face-ep` and `.rk-ep` to 44px, so screen 2 has one big thing.
   - Keep "Where this is today" as the heading, with the statement under it at 32px, so it stops reading as a label over a giant headline.
   - Give `.rk-next h2` `gx-stay` and its 13px mono style back, so "Next" is not a 26px caps tag.
   - Cap `.w2-oc-t` at 22px, under its 26px h2.
5. **Fix the controls you can see.**
   - Move the dial pause off the stage track: into `.rk-dial-l`'s top-right corner, or give the track `margin-right: 56px`.
   - Fit "post-purchase" in its thumb at 1470.
   - Put the chapters' pause inside the visual's own corner at both widths; on phone it is under the header today.
   - Stop the "+" disc shrinking (`.w2-detail i { flex: none }`). Give the long chapter pills `height: auto; line-height: 1.3; padding: 10px 8px 10px 22px`, or use the bare "+" as the third chapter does.
   - Add an ink-border hover to `.rk-facts button`.
   - Wrap the three `.rk-next-a:hover` rules in `@media (hover: hover)`.
6. **Give the back half objects, not plus signs.**
   - **Dark room:** loop the `POST /v1/event` stream while it is in view (with the pause), and give its opener Hanzo's own words, like the chapters' labelled pills.
   - **"What this is not":** show the three named gaps as a ruled list, with the full text still in the sheet, so the column is not a heading and a "+".
   - **"Rules, lists and suppression":** one rule card showing a list reference and a suppressed hit, instead of three text rows.
   - **Proof:** stage Hanzo's own checkable facts (twenty rules, the five-year clock, four sanction lists, the public source) as the page's figures.
7. **A first screen /sign doesn't have.** Let the gauge be the stage: unframed, wide, and without the corner name and floating pause that /sign also uses.
8. **Housekeeping.**
   - Register the UI strings listed in 11.
   - Delete the stale colour comments.
   - Rewrite `docs/coverage/risk.md` as MASTER's 18-heading card.
   - Swap the literal greys for deck values.
   - Move radii to the MASTER set.
   - Drop the dead CSS and the inert `data-cursor` attributes.
   - Add the Ledger line.
