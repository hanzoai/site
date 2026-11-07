# /sign: James-eye review

Verdict: 6/10
First complaint: "On my phone the box under the title is a mess. 'Document signing' is printed right on top of '02 / 05', and the step name disappears under the pause button. And the bit that sells it, the signature writing itself, happens along the bottom edge of my laptop screen and below the fold on my phone. For the first few seconds it's a blank page with grey lines, and then it tells me the same five steps all over again."

Reviewed: branch `claude/youthful-gauss-hiiqm9`, walked at `b09722b`, then re-checked at `2daa8e8` (HEAD at 14:35). The page changed during the walk:
- `8aa94d9` added the phone 14px floor and turned the "We run it" toggle into a white thumb.
- `00b5029` stopped the hero copy starting at opacity 0, removed the chapter meta lines and put "A document, signed" on the chapter rail.
- `2daa8e8` changed only a comment.

Every finding below holds at `2daa8e8`. Files hash at `2daa8e8` (Sign.jsx + Sign.css + app/sign/page.jsx): `7d778e7b8a7c`.
Walked 7 Nov 14:05–14:38 UTC on the dev server, moving, at 1470×801 and 375×812, plus 320. I kept load screencasts (10 fps frame-difference logs), scroll sheets, hover/press style diffs, overlap rects, JS-off and reduced-motion shots, and full-scroll CLS. The cookie note was skipped. The Kai image loads locally, so no hanzo.ai media was blocked.
Proof: `img/sign.jpg` (desktop first screen at step 04 | phone first screen at step 04).

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** The words sell, and something moves within 1 second. The object does not.
   - **Words:** "Hanzo Sign" is 144px with line height 0.92, then the lede and "Try Hanzo →" | "Documentation". Since `00b5029` the lede and buttons are in the first painted frame.
   - **The h1:** it is server-rendered at `translateY(108%)`, so the first frame has a lede and buttons but no title (HEAD film frame 9). The title rises about 0.4s later.
   - **The desk starts blank.** It opens on step 01, "Upload the PDF": a white page with 9 grey bars and three signers reading "—". The first change comes 2.6s after the desk is in view (fields drop about 5.5s after navigation on dev). Until then nothing on it moves.
   - **The signature is on the fold.** At 1470×801 the signature field spans y 724–840, so the ink writes along the bottom 40px of the screen (frame diffs show bbox y 760–800). The name, checkbox and free-text row (y 788–902) is below the fold. The certificate stamp is visible.
   - **Phone:** the desk starts at y 550 and the signature field at y 824, below the 812 fold. The only self-motion on the first screen is the step label changing, and that label is the one that collides (answer 6).
2. **One in, one out, or a document?** The first half is one in, one out, but it tells the steps twice. The second half is a document.
   - **Hero, then chapters:** the hero desk loops the five steps. Then five pinned chapters (5.5 screens) walk the same `Page` through the same five states. Inside the chapters, one panel changes while the words hold, which is the right Apple move.
   - **Chapter 04 changes nothing.** "Watch it move" shows exactly the page from 03. Only the flag moves (the visual's HTML differs by 13 characters). The recipients that "move" exist only in the hero desk.
   - **After the chapters it is a stack:**
     - a bento of two live tiles over a 4×2 wall of eight text cards;
     - the pad;
     - four plan cards and a toggle;
     - two paragraphs on open source;
     - a dark room with three equal cards, two boxes and "Get Sign".
   - **No arrival motion after the hero.** No headline arrives with any motion: "What is in it", "Each signer gets a link…", "What it costs", "Built on Open Source" and "Send the first one" are static.
   - **Dead bands:** the 240px section padding stacks into roughly 480px of nothing between the cards and the pad (d s08) and between the pad and the prices (d s10). There is about 350px of blank between the desk and chapter 01 (d s01).
   - **Length:** 12,889px on desktop (16 screens) and 16,350px on phone (20).
3. **A real object in every section?** Mostly.
   - **Hero and chapters:** yes, a page on a desk, signers and step flags.
   - **"What is in it":** two live tiles (five recipients ticking every 1.2s, twelve languages rolling every 1.3s), then eight text cards with no object.
   - **The pad:** yes, and it is the best moment on the page.
   - **Prices:** typographic figures ($30 and $50 in mono at 64px).
   - **"Built on Open Source" and the dark room:** text and cards only.
   - **Hanzo's media:** the only image is the Kai render, used as a 38px file icon on "Agreement.pdf".
4. **One ask, sticky after the hero?** Yes. This is the page's strongest part.
   - **The ask:** "Try Hanzo" is solid in the hero with `data-thumb` and `data-cta="sign.hero"`. The header turns to an outline while the hero ask is in view.
   - **After the hero:** the ask bar carries "Try Hanzo" at both widths. The close's first card ("Start signing … Try Hanzo →") has `data-cta="sign.close"`.
   - **The count:** one solid per stop at all 16 desktop and 20 phone scroll stops, once `8aa94d9` turned the toggle into a white thumb.
   - **Exception 1, the pad:** once you draw, "Sign" turns solid black on the same screen as the bar's solid "Try Hanzo", at both widths (`ix/d-pad-drawn`, `ix/p-pad-drawn`).
   - **Exception 2, the dark room:** the inverted "Start signing" card, the bar's white "Try Hanzo" and the white "Get started with Sign" box are three light masses on one screen.
   - **Exception 3, JS off:** the header and hero buttons are both solid.
5. **Every hover and press answers?** Mostly. Nothing fades and nothing jumps.
   - **Hero ask:** the fill goes #0a0a0b→#2c2c2e, the arrow nudges 3px, it is magnetic, and the press is 0.98.
   - **Outline buttons:** a veil plus an ink border on hover, and a 0.98 press.
   - **Part cards:** they lift 4px, the "+" turns 90° to ink, and the press is 0.99.
   - **Chapter rail:** it now answers hover (`00b5029`).
   - **Gaps:**
     - The dark-room cards 02 and 03 lose their press while hovered: `.sg-first-a:not(.first):hover`'s `translateY(-4px)` beats `.sg-first-a:active`.
     - The ask card 01 is the weakest of the three. Its hover is only #f5f5f7→#fff, with no lift.
     - "Run it yourself / We run it" has no hover.
     - The "hanzoai" chip has no hover and no press.
     - "Documenso", "Read the docs →" and "View on GitHub →" underline on hover but have no press.
6. **Overlap, font swap, layout shift?** No font swap, no layout shift and no horizontal scroll. But there are overlaps at both widths, and the one at 375 is on the reject list.
   - **Clean:** CLS is 0.0001 on desktop and 0 on phone, across a full scroll. One h1 box. No horizontal scroll at 375 or 320.
   - **375×812, hero desk (reject list):** `.sg-desk-k` "DOCUMENT SIGNING" (x 44–210, y 575–597) is printed over `.sg-desk-r`'s "01 / 05" (x 31–92) and its step title (x 199–344). The 44px pause (x 302–348) covers the end of the title ("Place the fi…", "Watch it m…"). It is worse at 320.
   - **"Where it is right now":** the pause sits on the status column (pause x 746–790 over "signed" and "opened" at x 737–784), at both widths.
   - **"Twelve languages":** "Brazilian Portuguese" is 604px in a 498px box (358 in 287 on phone). It is clipped to "Brazilian Portugu" ("Brazilian Portu" on phone) with the pause on top.
   - **The contract itself:**
     - The checkbox tick sits on the "CHECKBOX" label.
     - The empty signature field shows two stray ink dots in steps 01–02 (`pathLength: 0` with round caps).
     - At 320 the page card runs 4px past the desk on each side.
   - **Transient:** at 1470×801 the ask bar passes over the run toggle (d s10).
7. **Which reference, and is its motion there?**
   - **apple.com pinned chapters:** yes, with the rail and the flags.
   - **synchronized.studio:** the nearest thing is the parts, which morph out of their cards into sheets (`layoutId`). Focus returns to the card after Esc, but it is not held inside the open sheet (see 2.12).
   - **motion.dev patterns:** yes, authored: the fields drop on a spring, the ink path draws over 1.8s, and the certificate stamps in at −6°.
   - **anthropic launch:** no hero figure.
   - **The motion mix is good, and scroll is well under half:**
     - Idle: the desk, the recipients, the languages and the pad hint.
     - Pointer: the magnetic ask, the card lift and drawing.
     - Time: the certificate time uses the visitor's clock.
     - State: the sheets, the toggle dimming plans and the pad's three states.
     - Arrival: the h1.
     - Scroll: Settle (3.4% scale on desktop, barely felt) and the chapters.
8. **Different from its neighbours?** No.
   - **Same frame as /tabs:** a headline on the left, the lede and one button on the right, and a full-bleed grey Settle stage on the fold with a mono label top-left and a round pause top-right. Then numbered pinned chapters, one dark room and a "Get X" block. /risk moved its dial beside the title at `7c7836b`, so /sign and /tabs are now the twins.
   - **What is its own:** the self-signing contract and the pad.
9. **All 18 parts covered?** `docs/coverage/sign.md` exists. Two of its claims are wrong (see below), and some areas are thin.
10. **Banned tells?** The hue and eyebrow fixes held, but the reject list still catches two things.
    - **Passing:** 0 UI hues on the page; the only hue is the shared footer's blue "Privacy choices" icon, rgb(0,114,206). No eyebrow over the h1. Nothing fades on hover. No green.
    - **Three equal boxes in a row:** the dark room's "01 Start signing / 02 Documentation / 03 The source", each with an explaining sentence.
    - **Overlap at 375×812** in the hero desk (answer 6).
    - **Borderline:**
      - the "Most Popular" pill sits on top of the "Business" card title;
      - invented "09" and "10" sit above the two tile titles, out of order with the cards 01–08 below them.
11. **Copy untouched?** Hanzo's words are untouched: parity is 106/106 text and 9/9 links. But strings were added outside the register (`content/ui-strings.json` does not exist):
    - "Try the signing page";
    - "Draw a signature in the field and press Sign. Nothing here is sent anywhere.", appended inside Hanzo's lede paragraph;
    - the "Run it yourself" / "We run it" toggle labels;
    - "Signed <time>. The certificate records each signer, the time, and the address they signed from." (a rewording);
    - "09" and "10".

    The demo data is fine (signer 1–3, person 1–5, "Agreement.pdf", "Certificate", "signer · time · address"). The header comments still say "ink-indigo accent" (Sign.jsx line 3, Sign.css line 1), though the CSS is grey.

## Missing from the 18 parts (PLAN-COMPONENTS §2.1–2.18, measured)
- **2.1 / 4 Common gate:**
  - `Persona:`, `Goal:`, `CTA:` and the metric (`signup_start`) are present.
  - A second solid appears once the pad is inked.
  - Gate line 7 (rubric scores) and line 8 (ledger entry: what this page deleted) are not in the coverage file.
- **2.3 First impression:**
  - The h1, the LCP element, is server-rendered pushed out of its mask.
  - The hero object opens blank and signs on the fold.
  - The five steps are told twice, and chapter 04 is dead.
  - The close is not the kit `Band`. It ends three times: "Send the first one", "Get started with Sign" and "Get Sign".
- **2.6 Content:**
  - On phone, the contract's own text is 11.8–12.6px in the hero (`zoom: .84`) and 9.0–9.6px in the chapters (`zoom: .64`). This covers "Agreement.pdf", "page 1 of 1" and the six field labels; none of it is `aria-hidden`.
  - Each of the eight part cards carries a sentence.
- **2.7 Visual system:**
  - 46 literal hex values in Sign.css.
  - Radii of 4, 8, 12, 14, 18 and 28 (CANON is 6, 10, 16, 24, 32).
  - A model render used as a PDF file icon.
- **2.8 Components:**
  - 2 bare `:hover` rules (`.sg-first-a.first:hover`, `.sg-gs-links a:hover`).
  - Close cards 02 and 03 lose their press under hover.
  - The chip is dead.
- **2.9 Motion:**
  - 2 `setInterval` timers (`useEvery` in Five and Langs).
  - Reduced motion freezes the hero at step 01: a blank page, fields at opacity 0, and "—,—,—" as the signer states. It never shows the signed final state ("write the final state first").
  - Chapter 04 has no change.
- **2.11 Mobile:** the hero desk label collision at 375 and 320.
- **2.12 Accessibility:**
  - "We run it" is the default, so "Community / Free / Self-host and own your data…" arrives at opacity 0.38, about 2:1.
  - The pad is pointer-only: the canvas cannot take focus, so a keyboard user can never enable "Sign".
  - The signed line is not in a live region. Coverage 12 says "announced", and it is not.
  - The part sheets do not trap focus, though they are `aria-modal`. One Tab from "Close" goes out to the footer's "Ask Hanzo anything", then "Talk to Hanzo", "Send" and "Models". This is shared `OpenSheet`, but the page relies on it.
- **Coverage accuracy:**
  - Item 11 says the phone desk "stacks (step label, page, recipients)" cleanly, but it collides.
  - Item 12 says the pad result is announced, but there is no `role="status"`.
  - Item 12 says the sheets "trap focus", but they leak.
- **Passing:**
  - one h1 and one main;
  - JS off legible (`NoJs`): every chapter stacked, the lede and buttons visible;
  - parity clean;
  - one verb, with `data-thumb` and both `data-cta`;
  - pause controls on all three loops, which stop off screen;
  - sheets close on Esc and return focus to the card;
  - no horizontal scroll;
  - CLS about 0;
  - 0 hues on the page.
- **Shared system, not this page's fault but it hurts it:**
  - There is no sound kit in `lib/` (JAMES rule 10), so the ask press, the toggle, a sheet opening and the desk finishing a run are silent.
  - The header's "Try Hanzo" is clipped at 320.
  - At about 14:31 a build-error overlay from `components/pages/LegalIndex.jsx` (another chat's file) covered every page on the dev server for a few seconds.

## Fixes (in order)
1. **Fix the phone desk header** (reject list).
   - At ≤900px, give `.sg-desk` one top row: the counter and step name on the left, the pause on the right, nothing under it.
   - Move "Document signing" out of that row, for example below the recipients, or drop it on phone.
   - Re-test at 375 and 320, and keep the page card inside the desk at 320.
2. **Put the signing on the first screen and start it at once.**
   - Start the desk at step 02 (fields placed), or fire the first step 600ms or less after hydration, so the object moves inside a second.
   - At 1470×801, lift the desk so the whole signature field and its ink sit above the fold (field bottom at y 760 or less). Trim `.sg-hero` padding and the title gap, or set the page beside the title.
   - On phone, bring the field band within 812: crop the grey bars or show the fields first.
   - Under reduced motion, render the final state: signed, ticked, certificate stamped.
   - Server-render the h1 inside its mask (start the rise only after hydration).
3. **Let each chapter change the object, and tell the steps once.**
   - Chapter 04 must show the recipients moving: put `Track` in the chapter visual.
   - Either hand the hero desk into the chapters, or let the hero play one short pass and stop, so the scroll is not a replay.
4. **Clear the collisions.**
   - In "Where it is right now", move the pause off the status column, to the tile corner.
   - Size the language to fit its box, by length or on two lines, so "Brazilian Portuguese" fits 498px and 287px; keep the pause clear of it.
   - Move the checkbox tick off its label.
   - Hide the ink path until it draws, to remove the two dots.
5. **Cut the boxes.**
   - The dark room becomes one inverted ask, with "View Docs" and "View on GitHub" as text links: no three equal cards. Fold "Get started with Sign" into it.
   - The eight part cards show number, title and "+", with the sentence moving into the sheet they already open.
   - Drop "09" and "10".
   - Make "Most Popular" a line inside the card, not a pill over the title.
6. **Give the second half arrivals and trim the gaps.**
   - Use `LineMask` (in view) on "What is in it", "Each signer gets a link…", "What it costs", "Built on Open Source" and "Send the first one".
   - Halve the padding where two `.w2-sec` paddings meet (the bands of about 480px) and the gap between the desk and chapter 01.
7. **Small but owed:**
   - Ask the owner of `OpenSheet` (the Business 2 chat) to trap Tab inside the sheet.
   - The pad: add a keyboard path (focusable canvas, or a "type your name" fallback) and put `role="status"` on the signed line. While the pad is in view, the ask bar steps aside (`data-ask-hide`) so "Sign" is the only solid.
   - Plans that do not apply stay legible (4.5:1 or better, for example a muted price and hairline only, not opacity 0.38).
   - The ask card lifts on hover like its siblings, the close cards keep their 0.98 press while hovered, and the chip gets hover and press.
   - Remove "Try the signing page" and the appended pad sentence, or register them for James.
   - Fix the stale "ink-indigo" comments.
