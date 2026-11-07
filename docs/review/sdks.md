# /sdks — James-eye review

Verdict: 6/10
First complaint: "On my phone the code box runs off the side of the screen. I can't see cURL and I can't even press Copy, which is the whole point of the page. And past that code window it goes back to being a document: two grey cards, a table, three boxes."

Walked 7 Nov 2026 (fresh walk, not the earlier review's notes), Playwright Chromium at 1470×801 and 375×812 (isMobile, hasTouch, DPR 2), video recorded for both. 10 frames over the first ~5.5 s with no input, then a slow wheel scroll (260px steps, 320 ms dwell) on desktop and smooth 300px touch-style steps on phone through the whole page. Clicked the cURL tab and the Anthropic dialect, pressed Copy and read the clipboard back, hovered and pressed the hero ask, picked Rust in the SDK picker, hovered an org row, typed "sql" and a miss into the module finder, then a 60-stop Tab crawl. Also reduced motion, JS off, 375×667, 320×640 and 768. Non-localhost POSTs blocked. No build-error overlay appeared (the `nextjs-portal` present is only the dev indicator); 0 console errors, 0 page errors.

Stills: `sdks/d-f2.jpg` (desktop hero 1.1 s in, the changed lines lit mid-flip), `sdks/p-s00.jpg` (phone: the console cut off at the right edge, cURL and Copy missing), `sdks/d-i-two.jpg` (the "Full Cloud SDK / AI + Agents" pair, now legible). `d-f3.jpg`, `st-two.jpg`, `st-pick.jpg` are refreshed with today's frames (hero, the pair, the picker with Rust chosen).

## What works
- **The desktop hero is a real signature.** A big black console on the left 8 columns, the h1 on the right. It flips OpenAI → Anthropic by itself at about 0.9 s, then every 4.2 s while in view. Only the lines that differ are re-set, under a short light band, so base URL, auth header and `max_tokens` read as the difference. It is Hanzo's own code.
- **The fixes from the last review are in.**
  - "AI + Agents", the lead "Python" card and the picker's chosen language are now #fafafa on ink (measured rgb 250,250,250 on #0a0a0b).
  - The hidden sample block is `inert`: the Tab crawl has 0 invisible stops.
  - Pills and the URL swap use ease-emphasis at 300 ms; no springs.
  - The screen-2 headings are 32px, not 56px.
- Copy puts exactly the displayed text on the clipboard (cURL/Anthropic checked) and says "Copied". The hero ask moves ink → #2c2c2e on hover and to scale(.98) on press, with no fade. Org rows fill at white 6%, library cards lift 4px, the picker pill glides.
- The Go module finder types names by itself when idle (a real "time" movement). "sql" filters to 4 / 50; a miss says "No module at that path."
- The solid ask moves into the header ("API reference") once the hero ask leaves, and in the close the header copy goes quiet, so there is one solid fill on screen.
- CLS 0.0004 desktop and 0.0005 phone. Reduced motion: `getAnimations()` empty at 3.5 s and the console holds still. JS off: 0 hidden text, h1 present.
- `parity.py /sdks`: text 217/217, links 69/69. `taste.py`: OK. `unique.py`: OK.

## The 11 answers
1. **5 s / 1 s.** Desktop: yes. The h1 cuts in, the console rises, and the flip lands at about 0.9 s. Phone: the console now starts at y=441, so it moves inside the first 812px (fixed). But the phone console is **465px wide in a 343px column**, so a third of it is clipped off-screen (see 6).
2. **One in, one out?** Only at the top. After the hero comes a paste strip, two text cards, the picker, a six-row table in the black room, three library cards, the module wall and the close. Each arrives with only the h2 line-cut and then sits still. On phone the org table becomes about 1,680px of stacked mono records. The middle still reads as a document.
3. **A real object in every section?**
   - Hero: yes (console).
   - "Full Cloud SDK / AI + Agents": no. Two paragraph cards with a `{ }` and a ✦ glyph as the object.
   - Picker: partly (install line with Copy).
   - Orgs: a table.
   - Flagship: three cards, each with an install line.
   - Modules: yes (type wall plus a self-typing finder).
4. **One ask / scale rhythm.** One solid page ask, which the header takes over after the hero. On phone the shared header's solid "Try Hanzo" sits next to the hero's solid "API reference" (shared chrome, noted, not held against the page). Scale is better now: the 68px h1 sits beside the big console, and section heads are 32px. One inversion remains: the picker's h3 "Hanzo Rust SDK" is 41.6px and the flagship card h3s are 38px, both bigger than the 32px h2s above them.
5. **Hover and press.** Every control I tried answers, with no jump and no fade. The module words invert to grey on hover and say nothing more. The finder's idle typing never filters the wall, so the two don't talk to each other.
6. **Overlap / font swap / shift.** Desktop: no overlap, no font swap, no shift. **Phone: the hero console overflows its column and is clipped by `main { overflow-x: clip }`.** The page reports no horizontal scroll, which hides the bug.
   - At 375 the console spans x 16–481. The cURL tab (382–465) and the console Copy button (393–467) are off-screen, so they cannot be tapped.
   - At 320 it spans 16–518.
   - The cause: `.xsd-first { align-items: start }` still applies when the phone rule turns it into a flex column, so `.xsd-code-first` shrinks to the `<pre>`'s max-content width instead of the column width.
   - The right edge of every code line, the URL and the caption are cut too.

   The cookie card covers the console foot on desktop and the hero's lower third on phone (shared chrome).
7. **Reference.** Apple developer and Stripe-style docs heroes: one product object with a persistent ask, and the console delivers that. Nothing below the fold borrows a pinned scene or the osply/hamol editorial grammar.
8. **Different from neighbours.** Yes. Code-first, console left, words right, the dialect diff as its signature. `unique.py` passes.
9. **18 parts.** The card has 18 headings, all filled. Some ticks are untrue (see Card check).
10. **Banned tells.**
    - No hue, gradient text, Inter or visible eyebrow above a headline.
    - The 🐍 📘 🔗 tab labels are Hanzo's live copy, not headings.
    - The flagship row is still three boxes in a row (1.4fr 1fr 1fr; one is black). It is unequal, but it reads as the three-card pattern.
    - `{ }` / ✦ glyphs stand in for an object in the two cards.
    - "SDKs docs → →" shows a doubled arrow: the copy's own → plus the `More` arrow. It appears twice, in the modules room and the close.
11. **Copy untouched.** Yes, parity 217/217 and 69/69.

## Card check (`docs/coverage/sdks.md`)
It exists with 18 parts, all filled. These claims are not true today:
- **Part 11, "375×812 and 1470×801 pass with no overlap" and "hscroll 0":** at 375 and 320 the hero console overflows its column and is clipped. hscroll is 0 only because `main` clips.
- **Part 11, "Every target 44px or more":** the phone module links are 26px tall, and "hanzoai/sdk" and "Docs" are 21–22px.
- **Part 4 / 16, "Copy button copies exactly the displayed text":** true on desktop. On phone the console Copy is off-screen and unreachable.
- **Part 3, "Ends in proof strip, `Band`, footer":** there is no proof strip. The card's own text admits this, but the box is still ticked.
- **Part 18, "Review read: verdict 8 or more":** the verdict is 6.
- These are now true and were not before: contrast on ink fills, 0 invisible tab stops, no springs, and the console moving inside 812px on phone.

## To reach 8
1. **Fix the phone console width.**
   - In the `max-width: 900px` block, set `.xsd-first { align-items: stretch }` (or give `.xsd-code-first` `width: 100%; min-width: 0`).
   - Let `.xsd-pre` scroll on its own with `overflow-x: auto`, as it is already declared.
   - Check that the cURL tab and Copy sit inside 375 and 320, and add a check that compares element rects to the viewport, because hscroll will not catch it.
2. **Give the long middle one moment of its own,** so it stops reading as a document. Pick one:
   - the org rows drawing in one by one as the black room opens;
   - the picker cycling languages on its own until touched, as the console does;
   - on phone, the orgs as a snap rail (one language per card, 14–18% peek) instead of 1,680px of stacked records;
   - the finder's idle typing actually filtering and lighting the matching word in the wall.
3. **Make screen 2 hold an object, not two paragraph cards with glyphs.** For example, a small drawing from the existing words: one OpenAPI document → generated SDKs in six orgs, beside the hand-written library. Or fold the pair into the console room as its caption.
4. **Fix the inverted scale.** Bring the picker h3 and the flagship card h3s to 21–26px so they sit below the 32px h2s.
5. **Remove the doubled arrow** on "SDKs docs →" (render the copy's own arrow and drop the `More` glyph there).
6. **Raise the phone touch targets** for module links and the small `More` links to 44px.
7. **Update the coverage card** to the measured truth (phone overflow, targets, proof strip, verdict).
