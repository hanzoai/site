# /stream: James-eye review

Verdict: 6/10
First complaint: "Everything is huge. A giant title, then giant numbers, giant headings and giant words, card after card, with nothing small to rest my eye on. A 'GitHub' pill floats in the middle of the screen on top of the code. On my phone the six points are still hidden off the side, and once I'm past the top nothing moves."

Reviewed: main @ `2106935` (last page commit `4b53974`). Files hash: `a2656d1152bd`
Walked 7 Nov 14:44–14:47 UTC on the dev server, moving, at 1470×801 and 375×812 (videos, frame sheets and a frame-difference motion log kept by the critic; the site loader was skipped).
Proof: `img/stream.jpg` (desktop first screen | phone first screen).

## Since the last review
- **Done: the colour.** The walk finds no hue at either width (hues `{}`). The last build had 119 text, 80 border and 2 background teal readings, a red chip, and green and blue code. Now the records are silver on black, the committed-offset marker is a white chip and INVALID_RECORD is an outlined white word. The code is ink and grey, with a grey wash and an ink underline on `stream.hanzo.ai:9092`.
- **Done: the hero.** "KAFKA WIRE PROTOCOL" now sits under the h1 as a caption (it was an eyebrow above it). The lanes end about 63px above the title (they used to cut through it), and the lane labels and the `stream.hanzo.ai:9092` chip sit inside the screen. "Stateless" no longer breaks. With JS off, 0 text runs are hidden (it was 3: the eyebrow, the lede and the button).
- **Done: one ask, buttons, card.** Each screen has one solid button: the hero's "GitHub", then the ask pill, then "View on GitHub" alone at the close, with "Deploy to Cloud" as text. The close used to have three solid buttons. All six tested controls answer hover and press (the hero's "GitHub" was dead). The "offset 000N" labels pass contrast now (they were 2.4:1), and the phone repo chip is no longer a tiny target. The header has Persona, Goal and CTA lines, there are 3 `data-cta` (was 0), and `docs/coverage/stream.md` exists (it was missing).
- **Still open:**
  - The phone facts rail. At s1 the phone shows the heading, white space and a 24px sliver of the first card at x 351. Snap is still `mandatory`.
  - Nothing moves on its own after the hero. Desktop has 0 running animations on s2–s8, and 8 of 10 phone screens are STILL.
  - The six facts still don't open.
  - The tape's pause can't be seen.
  - New since the 14:40 rules: everything is big at once, and the ask pill floats over content.
- **Not in this walk:** two later commits reached main at 14:52 (merge `c3615cd`), after this 14:44 walk. `356278d` puts the heading above the phone rail, adds proximity snap from the gutter and a running partition as the closing object. `d1a2614` sets the Cloud 4 type scale (h1 52, heads 26, h3 17). Neither is judged here, and the page needs a re-walk.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes, on the first screen.
   - Desktop: the whole hero fits inside 801.
     - Four partitions of records run full-bleed under the client chips (kafka-python, sarama, confluent-kafka, franz-go, `stream.hanzo.ai:9092`).
     - Below them sit "Hanzo Stream" with clear air above it, the caption, "A Kafka port in front of Hanzo PubSub" and one white "GitHub" button at y 701.
   - The tape runs by itself (s0 shotdiff 5.58; 47/248 moving frames in the dwell):
     - the marker cycles from "committed offset" to "consumer down · offset kept" to "back where it left off";
     - INVALID_RECORD bounces off lane 2.
   - Desktop measures 1/25 moving frames in the first second after paint. That is the dev server's normal hydration wait: the screen is black for about 1.5 s. From then on it moves: 17/44 frames in the rest of the 3 s.
   - Phone: 12/25 moving frames in the first second, and the tape, title, caption, lede and button all fit on one screen. But the button sits at y 766, outside the 660px band MASTER part 3 asks for.
   - The tape's own text collides:
     - The "partition N" chips sit on top of the records and cut their numbers ("60 partition 2 61").
     - As INVALID_RECORD fades, record 1258 prints through it (d-shot-01-a).
     - On phone the marker runs off the right edge ("committed offse"). Each time it switches to "consumer down" it shows as a blank white box for a moment (p-shot-00-b, the proof image). Its text turns white before its fill turns black.
   - The strip's loop seam shows offsets going backwards inside a partition (1269 → 1254 and 1306 → 1291 at s1). The page's fifth fact is "Offsets are stamped, not inferred", so a Kafka user will notice.
2. **One in, one out, or a document?** Desktop: half.
   - The tape clips into a rounded card. For the whole s1 dwell, that card is three lanes in the top 200px with about 410px of empty black under them (d-shot-01).
   - Then the six facts pin and slide sideways under the scroll. Each record's numeral fills with ink as you reach it, and "committed offset 0000 … 0006" counts along the bottom. It is still the page's best move.
   - But the records are equal 480px grey boxes with 4–6 line paragraphs, and three are on screen at once, so it reads as a row of text.
   - After the strip the page is a document: four big words, the code with the checker, then the shared close in two black blocks ("Point the bootstrap server at it", then "Get Stream").
   - Phone: nothing pins. s1 shows "Your clients, our store", "01 / 06 — 06 / 06", white space and a 24px sliver of the first card at the right edge, the same as last time.
3. **A real object in every section?**
   - Hero: yes, the running tape.
   - Facts: no object. They are outlined numerals and paragraphs, and the four end words (Kafka, PubSub, Stateless, Durable) are type too.
   - "One line changes": yes. It holds producer.py with the bootstrap line marked, and the "Does my client's call work?" checker with its twelve API chips.
   - Close: the shared "Paste and ship" prompt. "Get Stream" holds only two chips.
4. **One ask, nothing floating, scale with rhythm?** The ask: yes. Floating: fails. Scale: fails.
   - **One solid per screen now:**
     - the hero's "GitHub";
     - then the site's ask pill "GitHub →" from s1 to s8;
     - then "View on GitHub" alone at the close.

     The header's "Try Hanzo" stays outlined until the footer.
   - **The ask floats over content on desktop.** It lives in the site's pill (`div.x-ask`, 308×54 at y 727, bottom centre), not in the header.
     - At s1 it sits on the top of the "0001" record.
     - Through s2–s6 it sits on the page's own committed-offset line.
     - At s7 it covers the code window's title (only ".py" of "producer.py" shows). The walk logs FLOATS over the h2 "One line changes".
     - On phone the bar covers the last code line, "process(message.value)", at s3.
     - MASTER §3.2.6 bans a floating pill on desktop. The fix is shared (it is already requested in `docs/review/SYSTEM.md`), but the page still fails.
   - **A second float.** The pinned track carries `data-swipe-own`, so the site cursor shows "Drag" beside the pointer over the strip. It is the black "D" chip at the right edge of s3–s7, and the strip can't be dragged: you scroll it.
   - **Everything is big at once:**
     - The h1 rests at 116px (live hanzo.ai: 52px).
     - Section heads: "Your clients, our store" 96px, "One line changes" 56px, "Point the bootstrap server at it" 74px, "Get Stream" 88px (live: 26px).
     - Record numerals are 103px, two to four on screen at once beside 41px card titles. The four end words are 68px.
     - The walk counts BIG×3 to BIG×4 on s2–s5 and BIG×6 on s6–s7.
     - Only the tape's clip shrinks. Nothing grows for its moment and settles back.
5. **Every hover and press answers?** Yes, now, apart from Pause.
   - "GitHub": the hover answers and it presses to 0.98.
   - "Copy": the hover answers and it presses to 0.92.
   - "View on GitHub" and the "hanzoai/stream 4 stars" chip press to 0.98.
   - "Deploy to Cloud": the hover answers and it presses 1px.
   - The phone tap on Copy shows "Copied".
   - Pause: the walk measures no press, and no frame shows the button. Its corner of the tape is pure black in both s0 shots, under the hero copy's black gradient (`.st2 .l2-stage.frame .l2-stage-copy::before`).
   - Nothing answers the pointer itself (no magnet, tilt or hover preview), apart from the wrong "Drag" label.
6. **Overlap, font swap, layout shift?**
   - Measurements are clean: CLS 0 at both widths, and one h1 box reading at each width (116px desktop, 52.5px phone), so the box never moves. No horizontal scroll at 375 or 320, and no overlaps between non-fixed page elements.
   - But the fixed ask covers content at both widths (answer 4), and the tape's own text overlaps itself (answer 1).
7. **Which reference, and is its motion there?**
   - apple.com product page: yes. The strip pins and the scroll moves it sideways, with a counter.
   - synchronized.studio card-open: absent. The six facts don't open.
   - anthropic launch: the four end words try to be hero figures, but they arrive at the tail of a strip at 68px, four at once.
   - osply/hamol pointer-aware detail: none.
8. **Different from its neighbours?** The hero medium is its own, but the skeleton and the close are shared.
   - Stream has the only full-bleed dark tape behind a title in Cloud 4:
     - /search has a centred title over a search box;
     - /sentinel has a two-line title beside an error console;
     - /telemetry has a title over the collector;
     - /tunnel has a title over a terminal strip.
   - But all five use the same StageHero: a very large "Hanzo X", a mono caption under it ("HYBRID SEARCH + RAG", "SENTRY.HANZO.AI", "HANZO SHARE", "KAFKA WIRE PROTOCOL"), a lede and one button.
   - All five also end on the same Finale: the closing line, "Paste and ship", the "Get X" chips and "Deploy to Cloud".
   - The sideways fact rail with "01 / 06 — 06 / 06" beside its heading is /iam's rail ("01 / 08 — 08 / 08").
   - James: "It's not just a template."
9. **All 18 parts covered?** No (see below). The card exists, but its parts 9, 11 and 12 claim things the walk disproves, which caps the page at 7.
10. **Banned tells?** Yes:
    - Everything big at once: a 116px h1, 56–96px section heads and 103px numerals, up to BIG×6 on one screen.
    - The ask pill floats over content on desktop (and over code on phone).
    - A cursor-following "Drag" label over a strip that doesn't drag.
    - A still middle: with no input, nothing moves from the facts to the footer.
      - Desktop has 0 running animations on s2–s8. s3–s8 count as moving only because the scroll is still settling: the a/b shots differ by a 1–2px shift of the whole frame.
      - On phone, 8 of 10 screens are STILL.

    Clean: no hue at either width, nothing directly above an h1 or h2, no opacity-only hover, no `title=` tooltips, no sound, and no console errors.
11. **Copy untouched?** Yes. Parity is 75/75 text and 2/2 links. The 11 added strings are:
    - the tape's demo label ("my-service ·");
    - the checker's prompt ("Does my client's call work?", "Type a Kafka API.");
    - the producer.py lines, which are Hanzo's own sample split up by the highlighting.

    The checker's three answer lines did not trigger in the walk. The builder wrote them, and none of the checker's strings are in `content/ui-strings.json`, which now exists.

## Missing from the 18 parts (MASTER §2, measured; coverage card checked)
- **Part 1:** the ask is in a floating pill, not the header. One href has three labels: "GitHub", "GitHub →" and "View on GitHub". The metric id sits on the CTA line, so the header check finds none. The card lists no copy questions.
- **Part 3:** on phone the primary sits at y 766, outside the 660px for h1, lede, primary and 80px of product. Desktop s1 is three lanes over about 410px of empty black. The h1 cut-in runs 1.15 s (MASTER: 700 ms). No card opens into a page (Morph).
- **Part 4:** the `data-cta` values are "primary", "close" and "deploy", not `stream.<slot>`. The sticky ask floats over content. The checker's strings are not in `content/ui-strings.json` (gate line 4).
- **Part 6:** "producer.py" and "Copy" are under the floor at both widths (13px at 375). On phone the code wraps mid-statement (`bootstrap_servers=` / `["stream.hanzo.ai:9092"],`) instead of pin-scrolling.
- **Part 7:** `Stream.css` uses literal greys that are not deck tokens: `#f5f5f7`, `#a1a1a6`, `#e8e8ed`, `#c7c7cc`, `#5f5f64`, `#3a3a3c`, `#ececf0` and `#e3e3e8` (the deck has `#f5f5f5`, `#a3a3a3`, `#525252`…). They have no hue, but they are not Hanzo's values. Three equal record boxes are on screen at once.
- **Part 8:**
  - Pause shows no state and no press, because nobody can see it.
  - The checker's focus is its own 4px grey glow, not the site's 2px ink ring.
  - The marker, the records and the checker transition `background` (MASTER: transform, opacity and clip-path only).
  - The phone rail uses `scroll-snap-type: x mandatory` (plan: proximity, 14–18% peek).
- **Part 9:**
  - No idle mover after the hero at either width.
  - The "Drag" cursor label shows over the pinned strip.
  - No pointer kind of motion.
  - The tape runs on `setInterval` (2 in `Frame.jsx`).
  - Reduced motion is good: 0 running after 3 s.
- **Part 11:**
  - The phone facts rail starts its first card at x 351 of 375, so none of the six facts shows without a swipe the page never hints at.
  - "Deploy to Cloud" has a 132×21 hit area.
  - The phone bar covers code.
- **Part 12:** "producer.py" measures 2.6:1 at both widths. The running tape's pause is never on screen (WCAG 2.2.2).
- **Part 15:** the six features don't open, and there is no console in the cloud product anatomy.
- **Coverage:** `docs/coverage/stream.md` exists (18 numbered parts, the older format). These claims are false against the walk:
  - part 11 "text ≥14px": "producer.py" and "Copy" are 13px at 375;
  - part 11 "a swipe rail with snap and a peek": the first card is a 24px sliver and snap is mandatory;
  - part 12 "contrast ≥4.5:1": "producer.py" is 2.6:1;
  - part 12 "44px Pause on the running tape", and part 9 "(with Pause)": the button is in the DOM, not on screen.

  HEAD's newer card keeps "text ≥14px", "contrast ≥4.5:1" and the Pause line.
- Passing: one h1, visible with JS off and 0 hidden runs; one main; CLS 0 and a steady h1 box at both widths; no horizontal scroll at 320; no tiny targets on desktop; 0 `title=` tooltips and no native selects; no raw img, video or table; 3 `data-cta` and 1 `data-thumb`; no console errors; reduced motion settles; no hue; parity 75/75 and 2/2; band at the end.

## Fixes (in order)
1. **One big thing per screen.** Rest the h1 at 52px and the four section heads at 26px ("Your clients, our store", "One line changes: the bootstrap server", "Point the bootstrap server at it", "Get Stream"). Set the record titles at 17px. Let only the record you have reached grow to 64px. The others sit small in outline and shrink back as the next one arrives. Set the four end words at 26px. `d1a2614` claims the first half of this, so re-walk it.
2. **Nothing floating.** Put `data-cursor=""` on `.st2-track` while it pins, so "Drag" never shows over a strip you scroll. Put `data-ask-hide` on the pinned facts section and on `.st2-code`, so the site's pill steps aside instead of sitting on the committed-offset line and the producer.py title. On phone, give `.st2-code` bottom padding equal to the bar's height, so it never covers the last line. The desktop pill itself is the shared request in `docs/review/SYSTEM.md`.
3. **Show the facts on the phone.** Put "Your clients, our store" and "01 / 06 — 06 / 06" above the rail, start the first record at the 16px gutter with the next one peeking about 15%, and use proximity snap. `356278d` claims this, so re-walk it.
4. **Keep the middle alive and the pause visible.** Run one grey lane of the hero's tape faintly along the committed-offset line under the pinned facts (one mover). On phone, fill each record's numeral when it snaps into view. Drop the `bottom: 28px` override in `.st2-pause` so the Pause sits at the tape's top right, above the copy's gradient.
5. **Clean the tape.**
   - Give INVALID_RECORD a solid fill that never shows the record behind it.
   - Transition the marker's text colour together with its fill, so it never flashes a blank white box.
   - On phone, pull the marker in so "committed offset" stays whole inside 375.
   - Make the offsets only rise, for example by letting the existing 900 ms tick add 16 to a run's base each time it wraps.
6. **Floors, names and the card.**
   - Set "producer.py" to `#525252` (it is 2.6:1 now), and both "producer.py" and "Copy" to 14px on phone.
   - Give "Deploy to Cloud" a 44px hit area.
   - Name the CTAs `stream.primary`, `stream.close` and `stream.deploy`.
   - Register the checker's strings in `content/ui-strings.json`.
   - Then correct parts 9, 11 and 12 on the card.
