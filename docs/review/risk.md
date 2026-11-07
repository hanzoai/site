# /risk: James-eye review

Verdict: 5/10
First complaint: "Red, green and yellow again. I said greys, silvers, blacks and whites, with colour only from our own media. There's a little red 'RISK' label stuck on top of the headline, then a green box next to a yellow box, and by the dark section it's three columns of grey text. The dial is the one good idea, and on my screen I only see the top half of it."

Reviewed: branch `claude/youthful-gauss-hiiqm9` @ `64b588a` (since merged to main; main's copy differs only in two import paths). Files hash: `58b18b9dab06`
Walked 7 Nov 13:49–13:54 UTC on the dev server, moving, at 1470×801 and 375×812 (videos, frame sheets and a frame-difference motion log kept by the critic; the site loader was skipped).
Proof: `img/risk.jpg` (desktop first screen | phone first screen).

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Half. The words are clear: "One risk plane for accounts, payments and agents" (80px, line height 0.92) and one black "Talk to us". The dial is a real object, but at 1470×801 only its top half is on screen (the pink arc, "the line" and the needle). The score and the action ("72 / summon a person"), which are the point, sit below the fold. Phone is the same: the gauge is on the first screen, but "SCORE / ACTION" are cut at the bottom edge. The headline cuts in by line mask (h1 lands at 731ms on desktop, 633ms on phone). Apart from that, the first second after paint changes 1 of 25 frames on desktop and 2 of 25 on phone. The needle's first swing comes about 2s in; after that it keeps deciding by itself every 2.2s. The file header promises the dial "arrives huge and settles". On film it fades in at about its final size (a 1.1 scale).
2. **One in, one out, or a document?** Mixed. The hero and the three pinned chapters work: one visual swaps per chapter (alert→case file, the lifecycle track, the four fact toggles) while the text holds. After that the page turns into a document:
   - four equal boxes with red numerals;
   - a dark room with three columns of long grey paragraphs (about 330 words);
   - "Rules, lists and suppression" as three text rows;
   - two text cards ("How it connects");
   - a plans ladder;
   - "What this is not" as three more paragraphs.

   The page is 13,247px on desktop (16.5 screens) and 17,674px on phone (22 screens). James: "An overload of information."
3. **A real object in every section?** Hero: yes, the dial. Chapters: yes, and each one runs by itself. Platforms: yes, the "declare" chips pulse, small but real. The dark room has a small `POST /v1/event` strip with red dots streaming, then text. The rest have none:
   - the statement and "Where this is today" are text in a green box and a yellow box, with a decorative block grid;
   - "What it decides on" is big numerals in boxes, which is type, not a thing;
   - Rules, How it connects and What this is not.

   The film stops at "Rules, lists and suppression" on desktop and at "Plans" on phone. The plans ladder and the close are judged from measurements and source.
4. **One ask, sticky after the hero?** Half. The verb is consistent, which is better than its neighbours: "Talk to us" is in the hero, in the phone bottom bar and in the close. But on desktop nothing of the page's own follows you after the hero; only the global header's "Try Hanzo" does. On phone the header's solid "Try Hanzo" and the bar's solid "Talk to us" show together on every screen from s2 on. The close's "Talk to us" is a red-filled card.
5. **Every hover and press answers?** No.
   - **Hero "Talk to us":** drifts toward the pointer (magnetic; the walker logs it as JUMP) but has no press state.
   - **Reason rows:** answer well, with a border change, a press of 0.98 and a cursor that reads "Neutral". That label is the one hover detail on the page that tells you something.
   - **Chapter numbers 01/02/03:** no hover, and a click jumps the page 550–1,270px (2600→3150, 3897→4440, 5339→4066).
   - **"The six capabilities +", "The three stages +" and the "Signup and onboarding" stop:** no hover and no press. On phone, tapping "The three stages +" showed no visible change.
   - **Fact toggles:** no hover, and "metered usage" has no press either.
   - **Cards 01–03:** lift 4px and press. Good.
6. **Overlap, font swap, layout shift?** No font swap: one h1 box entry at each width. CLS is 0 on desktop and 0.001 on phone, and there is no horizontal scroll at 375 or 320. But the hero object glitches. After two quick taps on the reasons, the readout drew "57" over "46" and "summon a person" over "allow" for about 4s (d-sheet-10 last row through d-sheet-11 row 2). The `popLayout` roll leaves the exiting value stuck. On phone, "post-purchase" runs past the edge of its pill in the stage switch, and each chapter swap shows two visuals through each other for about 1s.
7. **Which reference, and is its motion there?**
   - **apple.com product page:** yes. The product is the hero, and the pinned chapters change one panel each.
   - **motion.dev patterns:** yes (spring needle, rolling figures, rising sheets). The motion mix is the best in this batch, and scroll-linked effects are the minority:
     - idle: the dial, case file, track, toggles, event stream and declare chips;
     - pointer: the magnetic ask and the "Neutral" cursor;
     - state: the stage tabs and sheets;
     - arrival: the line mask.
   - **synchronized.studio:** absent. The cards open into sheets, not into their page.
   - **anthropic launch:** the score could be a hero figure, but it sits below the fold.
8. **Different from its neighbours?** Partly. Its CLOUD.md group is Business 2 (/risk /sign /tabs /treasury …).
   - **What is its own:** the hero medium (a gauge) and the signature: set a reason back to neutral and watch the score drop, which is Hanzo's own "attributable by construction". No other walked page has these.
   - **What is the kit:** /sign (same branch) and /ledger share its first screen: a mono eyebrow, the title left, the button right and a product strip on the fold. It shares the numbered pinned 01/02/03 chapters of /ledger and /metrics, one dark room and a closing block.
   - **Colour:** the same colour-per-page scheme (/sign blue, /ledger emerald, /metrics orange, /risk red), which is exactly the "one accent per page" JAMES.md rule 7 replaced. James: "It's not just a template."
9. **All 18 parts covered?** No; see below. `docs/coverage/risk.md` is missing.
10. **Banned tells?** Yes:
    - **Red UI hue as the page accent** (`--acc: #e5484d`, declared "signal-red accent"). It colours the eyebrow, the line, the arc, the reason bars, "summon a person", the 01–04 numerals, the chapter kickers and dots, the "+" buttons, the stream dots, the "declare" chips and the close's filled "Talk to us" card. Desktop measures 24 text, 80 background and 27 border hits. JAMES.md rule 7: the UI has 0 hues.
    - **Green:** "allow" in #1a7f37, the green-tinted "compliance face" box with a pulsing green dot, and the green "/v1/aml" pill. Green accents are a reject.
    - **Yellow and orange:** the cream "decide plane" box with an amber block grid, the amber "/v1/risk" pill and every "In development." label (41 background and 2 text hits). That is colour from boxes, not from Hanzo's media.
    - **Eyebrows:** "● RISK" sits 28px above the h1, and kickers sit over the headlines ("STATUS", "/V1/AML · LIVE", "/V1/RISK · BEING BUILT").
    - **Dead hover** on the detail buttons, stage stops, chapter numbers and toggles.
11. **Copy untouched?** Yes. Parity 114/114 text and 7/7 links.
    - The 25 added strings are demo data and labels lifted from Hanzo's own sentences ("several customers acting as one", "rule fired / with its citation", "money plane reads it", "1 of 4 facts").
    - "Illustration." is added in front of Hanzo's own "No figure on this page is a customer result."
    - The dial's numbers (72, 57, 27, the +38/+19/+15 weights, the line at 50) are invented weights. They are labelled as an illustration, so they read as demo data, not claims, but the numeric-diff gate will flag them.
    - "reasons · tap one to set it back to neutral" and the sheet labels ("The six capabilities", "The three stages", "Why the facts decide") are UI strings outside `content/ui-strings.json`.

## Missing from the 18 parts (PLAN-COMPONENTS §2.1–2.18, measured)
- **2.1 Strategy / 4 Common gate:**
  - No `Persona:`, `Goal:`, `CTA:` or metric id in the page header.
  - Two solid buttons per viewport on phone (header "Try Hanzo" + bar "Talk to us").
- **2.3 First impression:**
  - With JS off the h1 shows, but 34 text runs are hidden, including the hero's "Talk to us", the stage switch and the dial (fails a P1 row).
  - The score and action are below the fold at both widths.
  - The page hand-writes `function Hero()` instead of using `PageHero`.
  - There is no Band at the end (`bandAtEnd` false).
  - Cards open into sheets, not into their page (Morph row).
- **2.4 Conversion:** 0 `data-cta`. No sticky page ask on desktop after the hero.
- **2.5 Proof:** the proof Hanzo does print is buried in a sheet and in paragraphs, and none of it is staged: twenty typology rules, the five-year clock, the OFAC / UK OFSI / EU / UN lists, the public source. The biggest numbers on the page are the invented dial weights.
- **2.6 Content:**
  - 4 runs at 13px on phone ("Risk", "signup", "payment", "post-purchase"), under the 14px floor.
  - The dark room's three long paragraphs and the three "What this is not" paragraphs have no disclosure, though the chapters already use sheets.
  - "post-purchase" overflows its pill at 375.
- **2.7 Visual system:** red, green and yellow/orange break the 0-hue override. Status colour here is a whole tinted box, not "colour with a shape or text cue".
- **2.8 Components:**
  - 13 bare `:hover` rules (Risk.css and Frame.css).
  - 4 `.x-btn` rules in the shared Frame.css.
  - The hero ask, the detail buttons, the stage stops and one toggle have no press.
  - Four kinds of control have no hover.
- **2.9 Motion:**
  - 2 `setInterval` timers in Frame.jsx (`useEvery` drives the dial, case file and lanes).
  - None of the self-running demos has a pause control (2.12, WCAG 2.2.2).
  - The score roll can stick with two values drawn over each other.
  - Chapter numbers jump the page.
  - Reduced motion settles.
- **2.12 Accessibility:** contrast failures:
  - the plan name "Pro" measures 1.0:1 (black on the ladder's black top bar), so the top tier's name is invisible;
  - "Risk" 3.9:1;
  - "/v1/aml · live" and "/v1/risk · being built" 3.9:1;
  - the close's white-on-red "Talk to us" 3.9:1 and its "Tell us which stage is costing you…" 3.2:1.
- **Coverage:** `docs/coverage/risk.md` is missing at the walked commit, on the branch and on main.
- Passing: one h1, one main, no horizontal scroll at 320, no raw img/video/table, 0 `title=` tooltips, 0 tiny targets, reduced motion settles, CLS ≈ 0, h1 box steady, one verb ("Talk to us") in the hero, phone bar and close, parity 114/114 and 7/7.

## Fixes (in order)
1. **Take the colour out.** Set `--acc` to ink.
   - The dial: dark grey for the arc past the line, ink for the needle and "the line", mid grey for the reason bars.
   - The verdict: "summon a person" as an inverted ink chip and "allow" in plain ink, so weight and shape carry it.
   - The two status boxes: the same neutral card, with a filled versus a hollow dot as the cue. Drop the pulsing green and the amber grid.
   - Everything else: grey or ink for "In development.", the 01–04 numerals, the stream dots, the "declare" chips and the close's "Talk to us" card.
2. **Delete the "● RISK" eyebrow above the h1**, and the "STATUS", "/V1/AML · LIVE" and "/V1/RISK · BEING BUILT" kickers above the headlines. The endpoint already shows in each visual's toolbar (`/v1/aml`, "same call · same record…").
3. **Fix the three bugs.**
   - Roll the score and action with `mode="wait"` (or one element whose text rolls), so two values never draw on top of each other.
   - Give the ladder's "Pro" the bar's light ink.
   - Render the hero "Talk to us" and the dial visible in the server HTML: animate from visible, never from `opacity: 0`.
4. **Put the decision on the first screen.** At 1470×801, cut the hero's top padding and the title gap, or set the dial beside the title, so the needle, "72" and "summon a person" are all visible. On phone, show the title, "Talk to us", then the gauge with its score, all inside 812px.
5. **Every control answers, and the ask follows.**
   - Give the hero ask, "+" detail buttons, stage stops, chapter numbers and toggles a non-opacity hover inside `@media (hover:hover)` and a press of scale 0.98.
   - Make a chapter-number click scroll smoothly to its chapter instead of jumping.
   - Carry "Talk to us" in a sticky bar after the hero on desktop.
   - Put `data-cta` on every "Talk to us".
6. **Thin the reading.** Keep "Your data, your model", its lede and the `POST /v1/event` stream in the dark room. Move the three long paragraphs into a sheet titled "Your data, your model", the way the chapters already open theirs, and do the same for the three "What this is not" paragraphs.
