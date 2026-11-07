# /sign: James-eye review

Verdict: 5/10
First complaint: "It's blue. I said greys, silvers, blacks and whites, and here the button, the boxes on the contract, the ink, the tabs and a whole square are blue. There's a little label on top of the headline again. And when it opens nothing moves: a big title, a blue button and a blank page cut off at the bottom. It's the same first screen as Tabs."

Reviewed: branch `claude/youthful-gauss-hiiqm9` @ `64b588a` (since merged to main; main's copy differs only in two import paths). Files hash: `79e745242d9c`
Walked 7 Nov 13:55–13:58 UTC on the dev server, moving, at 1470×801 and 375×812 (videos, frame sheets and a frame-difference motion log kept by the critic; the site loader was skipped).
Proof: `img/sign.jpg` (desktop first screen | phone first screen).

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Desktop: no. Phone: yes.
   - **The words are clear:** "Hanzo Sign" at 144px (line height 0.92), then "Upload a PDF, drop the fields where people need to sign, and send it." and a blue "Try Hanzo →".
   - **Desktop is still:** in the first second after paint 1 of 25 frames changes (max 0.92). d-sheet-01 and d-sheet-02 show the same picture for about 7s. The line-mask cut-in does not show on desktop; the title is whole in the first painted frame.
   - **The object is cut off:** the desk sits on the fold, and all you see is the top of a blank page ("Agreement.pdf · page 1 of 1" and seven grey bars) and the edge of "signer 1". Whatever the self-signing does, its fields, ink, step label and signer states are all below 801px. The best idea on the page, the contract that signs itself, is not on the first screen.
   - **Phone moves:** the title rises out of its mask (p-sheet-01 frames 3–4). The desk label at the bottom edge changes from "01 / 05 Upload the PDF" to "02 / 05 Place the fields" (29 of 60 frames move in the rest of the first 3s). For the first second the phone shows only the header on white.
2. **One in, one out, or a document?** It tells the same story twice, then turns into a document.
   - **The hero desk** walks Hanzo's five steps by itself, one every 2.6s: the fields drop in on a spring, the ink writes, the signers tick from "sent" to "signed", the certificate stamps the page.
   - **The pinned chapters** then tell the same five steps again, on a second copy of the same page, with a flag list (01 Upload the PDF … 05 Keep the record). Inside the chapters one panel changes while the text holds, which is the right Apple move.
   - **Mid-scroll rest:** stop between two chapters and the scene rests half-way through the crossfade. At s11 and s12 (2.2s each, 0 moving frames) "Watch it move" sat at about a tenth of its strength, with an empty pale-blue "04" flag (d-screens-3 last frame, d-screens-4 first).
   - **After the chapters it is a document:**
     - two live tiles over a 4×2 wall of eight numbered text cards;
     - the signing pad;
     - four price cards with a toggle;
     - "Built on Open Source" (two paragraphs);
     - a dark room with three equal link cards, "Something more specific", "Get started with Sign" and "Get Sign".

   The page is 13,015px on desktop (16 screens) and 16,394px on phone (20 screens).
   - **Not filmed:** the desktop film never got past the eight cards. Pressing chapter numbers threw the page back up twice (5031→2450, 4897→3111), and an opened card sheet held the last two screens. The phone film stops at the top of the dark room. So the pad, prices and close on desktop, and the dark room's cards and "Get Sign" at both widths, are judged from the phone frames and the source.
3. **A real object in every section?** Partly.
   - **Hero and chapters:** yes, the page on a desk, the signer list and the flags.
   - **"What is in it":** two live tiles. "Where it is right now" shows five recipients ticking every 1.2s; "Twelve languages" rolls a language every 1.3s on a solid blue tile. Then eight text boxes with a "+", which hold no object.
   - **"Each signer gets a link…":** yes, a pad you draw on. It is blank until you draw; only the "SIGN HERE" hint pulses.
   - **Prices, Open Source, the dark room and "Get Sign":** text, cards and chips, no object.
   - **Hanzo's own media:** the only image is the Kai render (`/models/kai.webp`), shrunk to a 24px file icon on "Agreement.pdf". Rule 6 (many real visuals at once) is not attempted.
4. **One ask, sticky after the hero?** Half. The verb is right, and it is better than most neighbours: "Try Hanzo" sits in the hero, the header, the phone bottom bar and the dark room's first card, the same words as the global header. But:
   - **First screen:** two solid "Try Hanzo" buttons, a blue one in the hero and a black one in the header, so one ask has two looks.
   - **Desktop:** no page bar follows you after the hero; only the header's button does.
   - **Phone:** the header and the bottom bar are both solid "Try Hanzo" on every screen from s2. At the prices a third solid appears, the blue "Contact Sales" (s13).
   - **The close (source):** the last solid button on the page is "Deploy to Cloud", a second verb.
5. **Every hover and press answers?** No.
   - **Hero "Try Hanzo →":** drifts toward the pointer (magnetic) and answers hover, but has no press.
   - **Chapter numbers 01–05:** no hover. Four press to 0.98; "05" has no press. A click jumps the page 260–2,580px (1300→1558, 1569→3609, 5031→2450, 4897→3111).
   - **Part cards:**
     - 01–03 lift 4px on hover (the walker logs it as JUMP).
     - Their press is 0.997 on 01 and 03, which you cannot see, and 02 has none.
     - Card 04 has no hover and no press.
     - On phone a tap raises a sheet out of the card, which is good. Taps on 02 and 05 showed no visible change.
   - **Pad "Clear":** no hover; press 0.98. "Sign" stays a pale-blue 1.9:1 button until you draw, and there is no way to draw with a keyboard.
   - **Pointer:** besides the magnetic ask, only the "Sign" and "Draw" cursor labels.
6. **Overlap, font swap, layout shift?** No font swap: one h1 box entry at each width (523ms desktop, 619ms phone). CLS is 0 on desktop and 0.001 on phone. No overlaps were measured, and there is no horizontal scroll at 375 or 320. But:
   - chapter clicks jump the page (answer 5);
   - the chapter title can rest as a ghost (answer 2);
   - the solid blue tile tints the header glass blue as it passes under it (d-sheet-13 and 14).
7. **Which reference, and is its motion there?**
   - **apple.com product page:** yes. The pinned chapters change the page and the flags per chapter. But the hero already played the same five steps.
   - **motion.dev patterns:** yes, and authored, not fade-ups: the fields drop on a spring, the ink path draws over 1.8s, the certificate stamps in with a spring and a −6° turn, languages roll, sheets rise. The mix is good, and scroll is the minority:
     - idle: the desk's 2.6s steps, the five recipients, the languages and the pad hint;
     - pointer: the magnetic ask and the cursor labels;
     - time: the ink writing;
     - state: the sheets, and the "Run it yourself / We run it" toggle dimming plans;
     - arrival: the line mask, on phone only.
   - **synchronized.studio:** no. Cards open into sheets (they rise from the card on phone and lift under a scrim on desktop), not into their page.
   - **anthropic launch:** no hero figure.
8. **Different from its neighbours?** No. Its CLOUD.md group is Business 2 (/risk /sign /tabs …), and all three come from this branch.
   - **The first screen is /tabs's twin:** a mono eyebrow, the title left, lede and one button right, a grey product strip on the fold (compare each page's d-screens-1). /metrics and /ledger have the same first screen.
   - **The rest is the kit:** numbered pinned chapters with a left rail (as /risk, /ledger and /metrics), one dark room and a "Get Sign" block.
   - **Colour is one accent per page:** /sign blue, /search blue too, /tabs green, /risk red, /ledger emerald, /metrics orange. That is the rule JAMES.md rule 7 replaced.
   - **What is its own:** the contract that signs itself and the pad you sign on. Both are good and both sit below the first screen. James: "It's not just a template."
9. **All 18 parts covered?** No; see below. `docs/coverage/sign.md` is missing.
10. **Banned tells?** Yes:
    - **Blue UI hue as the page accent** (`--acc: #3e63dd`, declared "ink-indigo accent"). It colours:
      - the hero "Try Hanzo" and the eyebrow;
      - all six field boxes, the ink and the certificate;
      - the flags, the chapter kickers and the rail;
      - the solid "Twelve languages" tile, the 01–08 numbers and the status dots;
      - the pad;
      - the "Most Popular" pill, the Business plan's outline and its "Contact Sales";
      - the dark room's first card (source).

      Desktop measures 214 text, 24 background and 67 border hits; phone measures 61/13/26. JAMES.md rule 7: the UI has 0 hues.
    - **Eyebrow:** "DOCUMENT SIGNING" sits 20px above the h1 at both widths. Kickers sit over the headlines: "A DOCUMENT, SIGNED · 01…05" over every chapter title, "TRY THE SIGNING PAGE" over the pad's headline, and a "Most Popular" pill over "Business".
    - **Colour from boxes:** the solid blue language tile.
    - **Three equal boxes in a row:** the dark room's "Start signing / Documentation / The source" cards (source; not filmed).
    - **Dead hover** on the chapter numbers, card 04 and "Clear".
11. **Copy untouched?** No, one sentence was added. Parity is 106/106 text and 9/9 links, and the prices ($30, $50, Custom, Free) are Hanzo's.
    - **Demo data and labels, fine:** most of the 18 added strings ("signer 1–3", "person 1–5", "Agreement.pdf", "page 1 of 1", "5 recipients", "draw here", "sign here", "Clear").
    - **A new sentence:** "Draw a signature in the field and press Sign. Nothing here is sent anywhere." is added after Hanzo's "Nobody installs anything and nobody prints anything." After signing, "Signed <time>. The certificate records…" rewords a Hanzo line (source).
    - **New labels:** the kickers "A document, signed · 01–05" and "Try the signing page". The close's "Read the docs →" and "View on GitHub →" are not in Hanzo's source for this page.
    - **The register:** none of these is in `content/ui-strings.json`.

## Missing from the 18 parts (PLAN-COMPONENTS §2.1–2.18, measured)
- **2.1 Strategy / 4 Common gate:**
  - No `Persona:`, `Goal:`, `CTA:` or metric id in the page header.
  - Two solid buttons on the first screen at both widths (blue hero "Try Hanzo" + black header "Try Hanzo"), two on every phone screen, and three at the prices.
- **2.3 First impression:**
  - With JS off the h1 shows, but 20 text runs are hidden, including the hero lede, "Try Hanzo" and "Documentation" (fails a P1 row).
  - At 1470×801 the hero object is a blank page cut by the fold.
  - The five steps are told twice.
  - The page hand-writes `function Hero()` instead of using `PageHero`.
  - There is no Band at the end (`bandAtEnd` false).
  - Cards open into sheets, not into their page (Morph row).
- **2.4 Conversion:**
  - 0 `data-cta` (`data-thumb` is set once).
  - No sticky page ask on desktop.
  - The close ends on a solid "Deploy to Cloud".
- **2.6 Content:**
  - 8 runs at 13px on phone (the chapter rail "01"–"05"), under the 14px floor.
  - The eight part cards each carry a sentence in a 4×2 wall, though they already open into sheets.
- **2.7 Visual system:**
  - The indigo accent and the solid blue tile break the 0-hue override.
  - Hanzo's Kai render is used as a file icon.
- **2.8 Components:**
  - 11 bare `:hover` rules.
  - 4 `.x-btn` rules (the shared Frame.css).
  - The hero ask has no press, and the card press is 0.997.
  - The chapter numbers and "Clear" have no hover, and card 04 is dead.
- **2.9 Motion:**
  - 2 `setInterval` timers (`useEvery` drives the recipients and the languages).
  - The self-running desk, recipients and languages have no pause control (2.12, WCAG 2.2.2).
  - Chapter numbers jump the page.
  - The scrub can rest mid-crossfade.
  - Reduced motion settles.
- **2.10 Media:** one raw `<img>` (`kai.webp`), and 2 images without width and height.
- **2.11 Mobile:** "Read the docs →" (109×22), "View on GitHub →" (115×22) and the "hanzoai" chip (93×40) are under 44px.
- **2.12 Accessibility:**
  - On the blue tile: "10" measures 3.6:1, "Twelve languages" 3.8:1 and "German, English, Spanish…" 4.2:1.
  - "Community" and "Free" measure 2.5:1. "We run it" is the default, so the free plan arrives greyed out.
  - The disabled "Sign" measures 1.9:1.
  - The pad is pointer-only, so a keyboard user can never enable "Sign".
- **Coverage:** `docs/coverage/sign.md` is missing at the walked commit, on the branch and on main.
- Passing: one h1 (visible with JS off), one main, no horizontal scroll at 320, 0 `title=` tooltips, 0 native selects, 0 small text and 0 tiny targets on desktop, CLS ≈ 0, h1 box steady, reduced motion settles, one verb ("Try Hanzo") in the hero, header, phone bar and close card, parity 106/106 and 9/9.

## Fixes (in order)
1. **Take the blue out.** Set `--acc` to ink.
   - The contract: an ink signature line (the path's `#1f3fae` and the pad's `strokeStyle` too), grey-filled fields with hairline ink outlines, and the active flag as an inverted ink chip.
   - "Twelve languages": the same grey card as "Where it is right now", with the language in ink.
   - Status dots: filled versus hollow ink.
   - "Most Popular" as plain text inside the card. The Business plan's "Contact Sales" outlined, like the others.
   - The hero "Try Hanzo" and the dark room's first card in black, like the header.
2. **Delete the "DOCUMENT SIGNING" eyebrow above the h1**, the "A document, signed · 0N" kickers (the rail and the flags already number the chapters) and the "Try the signing page" kicker. Remove the added "Draw a signature in the field and press Sign. Nothing here is sent anywhere."; the pad's own "draw here" and "Sign here" already say it.
3. **Put the signing on the first screen.**
   - At 1470×801, cut the hero's top padding and the title gap, or set the desk beside the title, so the whole page with its fields and ink is in view. Start the steps on mount so the first field drops inside 1s.
   - On phone, bring the fields up under the ask.
   - Render the lede, "Try Hanzo" and "Documentation" visible in the server HTML: animate from visible, never from `opacity: 0`.
4. **Tell the five steps once.**
   - Make the hero desk the pinned chapters' visual, and drop the second `Page`: the contract signs itself once, then the scroll walks that same page through 01–05.
   - Snap the chapter text to the nearest chapter when scrolling stops, so a title never rests as a ghost.
   - Make a chapter-number click scroll smoothly to its chapter instead of jumping up to 2,580px.
5. **Every control answers, and the ask follows.**
   - Give the chapter numbers, all eight cards and "Clear" a non-opacity hover inside `@media (hover:hover)` and a press of scale 0.98 (the cards are at 0.997, and 02 and 04 have none). Give the hero "Try Hanzo" the same press.
   - Carry "Try Hanzo" in a sticky bar after the hero on desktop, with `data-cta` on each one.
   - Make the pad focusable, so a keyboard user can also sign.
6. **Cut the boxes.**
   - The eight part cards show their number and title with the "+", and the sentence moves into the sheet they already open.
   - The dark room's three equal cards become one solid "Try Hanzo" with "View Docs" and "View on GitHub" as text links. "Deploy to Cloud" becomes a text link too.
   - Default the price toggle so "Community" is not greyed out on arrival.
