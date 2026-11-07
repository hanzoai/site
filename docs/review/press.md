# /press — James-eye review

Verdict: 6/10
First complaint: "Why do I get the same three logo cards twice in a row? Then after the news it's just grey boxes: six partner boxes, nine social boxes, two empty photo boxes. It goes dead at the bottom. And what's that lonely copy button floating in the black?"

Walked 7 Nov. Repo `62dbd1e`; page files as of `09eb239` (`components/pages/Press.jsx`, `Press.css`, `company/MaskLines`, `company/useArrived`, `company/deck.css`).
- **Desktop:** filmed with headless Chromium at 1470×801, twice (a first visit and a return visit). Wheel scroll in 115px notches with a dwell on every screen. Hover and press on 16 controls, the news card on all six rows, both copy buttons, the kit download, and a keyboard Tab onto the news rows.
- **Phone:** filmed at 375×812 (isMobile, hasTouch) with touch-drag scrolling. Taps on both copy buttons and on a news row.
- **Also checked:**
  - widths 320, 375, 1024 and 1180 (touch);
  - JS off at both test sizes and reduced motion;
  - a layout-shift observer, the console and a Tab crawl;
  - first screens of /investors, /about, /brand, /contact, /history and /careers for the variety question.
- **Frames** were pulled with ffmpeg for the arrival, the kit's deal, the belief reveal, the facts and the news card.
- **Arrival:** the curtain is home-only and skips automated browsers (`components/arrival.js`). /press never shows it, so a first visit and a return visit run the same path. "Within 1 s" below is timed from first paint.
- **Stills:** `review/press/desktop-walk.jpg` (hero, kit spread, news card over a headline, black room) and `review/press/phone-walk.jpg` (first screen, black room, social wall, team).

## What works
- **Clean on the numbers:**
  - parity: text 83/83, links 20/20;
  - `taste.py` OK, `variety.py` OK and `unique.py` OK;
  - CLS 0 at both sizes;
  - no sideways scroll at 320 or 375;
  - reduced motion: 0 running animations after 3.5 s, and the boilerplate is plain text;
  - Tab crawl: 26 stops in `<main>`, every one with a visible ring and none invisible or under the header.
- **The first screen sells.** "Press Resources." is 84px at line height 1.02. The lede and "Contact Press Team" sit above the fold on desktop (ask bottom 647). On the phone the ask ends at y=384.
  - The h1 cuts in by line mask.
  - The kit's three plates deal to the front at about 2.4 s, 4.8 s and 7.2 s, then settle with the dark plate in front.
- **The signature is real.** The boilerplate goes from faint to ink word by word as it scrolls, measured at 0, 40 and 59 of 60 words lit across three screens on desktop (2, 51 and 59 on the phone). The four facts then rise out of their masks once.
- **The news index is the best moment on the page.** Huge headlines, the other rows step back to .28, and a black card with the date and Hanzo's summary rides beside the row (300 ms ease-out). On the phone each summary sits under its headline.
- **Every control answers, with no jump** (0px of movement on all 16 probed):
  - the solid darkens to `#262626`;
  - outlines fill `#f5f5f5`;
  - kit cards darken and their format pills invert;
  - the email underlines;
  - press is .97 or .98 everywhere except the news rows and partner links.
- **Copy works on desktop and phone.** "Copy boilerplate" puts the full boilerplate on the clipboard and "Copy" puts `press@hanzo.ai` there. Both draw a tick, swap their label to "Copied", and are 48px. The download draws a tick.
- **Palette:** no hue anywhere in `<main>`.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes on both sizes.
   - The h1 is cutting in at 600 ms and 1 s.
   - The first deal comes at about 2.4 s.
   - After the third deal (about 7.2 s) the first screen is still for good.
2. **One in, one out, or a document?** A well-set document with two scroll moments (the belief reveal and the facts).
   - **The same object twice in a row.** The hero is a stack of the three kit plates, and the very next screen is the same three plates again as a large spread (still).
   - **The bottom half is dead.** From the black room down (contact, brand assets, partners, channels, team), nothing moves without a pointer except two headline cut-ins.
   - There is no pinned scene and no timeline scrub (MASTER 4.4 screen 4). The dated news list was the natural place for one.
3. **A real visual object in every section?** Mostly:
   - the plate stack;
   - the plate spread;
   - the boilerplate and giant facts;
   - the headline index;
   - the giant email.

   Then it thins out:
   - Brand Assets is one mark tile plus six equal partner tiles.
   - Connect With Us is a 3×3 wall of nine equal grey tiles, each with an arrow in a white circle.
   - The team is two grey plates (the portraits are blocked here; the fallback reads as empty boxes).
4. **One ask, sticky after the hero?** Not reliably.
   - **The bar arrives on some scrolls and not others.** On the return-visit wheel walk it carried "Press & Media / Contact Press Team →" and stepped aside for "Request Executive Bios". On the first-visit wheel walk and the phone touch walk it never arrived, so the header's "Try Hanzo" was the only solid ask on every screen.
     - Cause, in the shared `components/Ask.jsx`: `past = !e.isIntersecting && e.boundingClientRect.top < 0` with a `-64px` root margin.
     - A 48px hero button stops intersecting while its top is still about +14px. Logged: `isIntersecting:false, top:14`. So `past` stays false.
     - The fallback in `update()` only fires when the button is not `filled`.
     - Whether the bar comes depends on scroll speed. Not this page's code, but it breaks this page's ask.
   - **Phone first screen:** at 4 s the header "Try Hanzo" was still solid beside the solid "Contact Press Team" (two solids). This is shared and racy; another run had it outlined.
5. **Every hover and press answers, no jumps?** Yes, with two faults.
   - **The news card covers headlines.** The card's left edge is fixed at x=899, but the 18ch titles reach x=911. Row 03 reads "Agent Hosting from $5/mc" (12px under the card) and row 05 is covered by 8px. The page comment promises "never over a headline".
   - **Keyboard focus misplaces the card.** Focusing a row shows the card but does not call `place()`, so it stays where the pointer last left it. Measured: focused row at y=250, card at y=1227.
6. **Overlaps, font swap, layout shift?** No hero overlap, no font swap, CLS 0. But:
   - **The black room hides two labels.** "Media Inquiries" and "Headquarters" are `#0a0a0a` on `#0a0a0a`, measured.
     - Cause: `.xpe { --ink2: #0a0a0a }` (Press.css:3) overwrites deck.css's `--ink2: #525252` on the same `<main>`, and `.vc .vc-kick { color: var(--ink2) }` (0,2,0) beats `.xpe-contact-m h3` (0,1,1).
     - Result: the copy button floats alone after an invisible word, centred on the phone, and the address has no caption.
     - The same clash turns every lede, body and fact label to ink, so the deck's `#525252` second tone is gone page-wide.
   - **JS off, desktop:**
     - The empty news card shows as a black 340px pill over row 01's headline: the layout's `opacity:0` noscript rule reveals it.
     - The boilerplate drops a full row below its heading: the `<noscript>` is a grid item and takes the column.
     - The six news summaries cannot be seen at all.
   - **Touch tablets (1024 and 1180, `hover: none`):** the summaries are `display:none` and the card is hidden, so six Hanzo summaries are unreachable.
   - **Phone:**
     - "discord.gg/XthHQ / Qj" and "@hanzoai.bsky.so / cial" break mid-word.
     - The partner "Logo (SVG) ↓" links are centred under left-aligned names (22px off).
     - The big `press@hanzo.ai` link is 40px tall, the one target under 44.
   - **Hero placement:** the h1 sits low, its top at 306 with 246px of air under the header and its first baseline at about 47%. Nothing peeks: the kit starts at 861 on an 801 screen. The back plates are translucent (.88 and .76), so a mid-deal frame shows a ghost mark through the white plate.
7. **Which reference, is its motion there?** The news index is osply or hamol: an editorial index with a pointer-aware card, and it is there. The word reveal is the Apple-page text scrub, and it is there. There is no pinned stage, no scrubbed strip and no card-to-page open. Story is meant to read like a magazine; the second half reads like a link directory.
8. **Different from its neighbours?** Partly. The hero is the same split as /investors, /brand, /contact, /history and /careers (headline left, object right). Its object, the Hanzo mark on plates, is the same object /brand leads with. The news index and the black email room are its own.
9. **The 18 parts?** See below.
10. **Banned tells?**
    - Low-contrast dark mode, at its limit: two labels at 1:1 in the black room.
    - Three equal boxes in a row, three times over: the social wall. Each tile also carries an icon in a round box (MASTER part 7: never an icon in a rounded box). The six equal partner tiles echo it.
    - No eyebrow over a headline, no hue, no gradient text, no default controls, no fading buttons.
11. **Copy untouched?** Parity says yes, but four Hanzo labels cannot be seen:
    - "Press & Media" and "Leadership" survive only as `aria-label`s. Parity counts attributes, so it passes. MASTER part 7 says to keep a kicker's words and set them below the heading as a caption, not hide them.
    - "Media Inquiries" and "Headquarters" are in the DOM but ink on ink (answer 6).

### Shared layers that touched this page (not scored against it)
- **Hydration:** a hydration failure in the shell (`<div className="x-page">` against `HeaderHTML`'s `data-x-shell`) appeared on all 4 walk loads (video recording on) and on 0 of 9 bare loads. It shows the red dev "1 Issue" badge. React then regenerates the tree, so the hero visibly cuts in a second time (video frames at 11 s).
- **News-row tap:** on the phone it first smooth-scrolls /press to the top. /blog loads about 5 to 9 s later (Morph, known broken).
- **Sound:** the kit is not built, so there is no confirm chime on copy.

## Missing from the 18 parts
- **1 Strategy:** the sticky ask is unreliable (answer 4). The phone first screen showed two solids once.
- **3 First impression:**
  - the h1 baseline is near 47%, not 38%, and no next section peeks;
  - the first screen is still after about 7 s;
  - JS-off desktop shows the empty card pill and the dropped boilerplate row;
  - no timeline scrub.
- **5 Trust:** partner assets are six equal tiles, not a stationary greyscale row (logo permission is still an open copy question).
- **6 Content:**
  - four Hanzo labels are not visible;
  - summaries are unreachable on touch tablets and with JS off;
  - two mid-word breaks on the phone.
- **7 Visual:**
  - the `--ink2` clash removes the grey second tone;
  - an icon in a round box ×9;
  - the 3×3 equal tiles.
- **8 Components:**
  - the news rows have no press state;
  - copy has no `role="status"` region (the label swap only);
  - the email link is 40px tall on the phone.
- **9 Motion:**
  - the lede, asks and fan enter on CSS fade-ups (`xpe-up`: opacity 0 and 18px), though the card says 0;
  - the bottom half has no idle or scroll moment.
- **11 Mobile:** the phone ask bar did not arrive on the touch walk (shared cause).
- **12 Accessibility:** contrast fails at 1:1 for two labels.
- **18 Coverage doc accuracy.** Claims that are wrong:
  - "One solid fill per viewport" (the phone first screen once, and the header ask whenever the bar misses);
  - "0 fade-ups";
  - "JS off: legible … 0 faint or offset text";
  - "'Media Inquiries', 'Headquarters' … sit under what they name" (they are invisible);
  - "Each news summary shows under its headline, so no hover is needed" (not at 900px and up on touch);
  - "focusing a news row shows its card" (it shows elsewhere);
  - "the copy buttons … announce 'Copied'" (no live region);
  - "Sticky ask in the header and in the bar after the hero, same label" (the header says "Try Hanzo").

## Fixes (in order)
1. **Light the black room and bring back the second tone.**
   - Rename the page token in Press.css:3 (for example `--xpe-ink`) so deck.css's `--ink2: #525252` stands for ledes, body and labels.
   - Set `.xpe-contact .vc-kick { color: #a3a3a3 }` (0,2,0, after deck.css).
   - Check "Media Inquiries" and "Headquarters" measure 4.5:1 or better and that the copy button sits beside its label on the phone.
2. **Make every Hanzo word visible.**
   - Set "Press & Media" as a caption under the h1 and "Leadership" as a caption under "Meet our team" (MASTER part 7).
   - Show `.xpe-ts2` under its headline whenever `(hover: none)`, at any width, and in a `<noscript>` rule.
3. **One object, not two; wake the bottom half.**
   - Let the hero stack become the spread: as you scroll, the dealt plates fan out into the three kit cards (one pinned scene, one in and one out), instead of showing the same plates twice. Make the back plates opaque.
   - Turn the 3×3 channel wall into a hairline list (name, handle, row hover fill), with no icon circles. Turn Partner Assets into one stationary greyscale row.
   - Give the black room one authored moment, such as the email cutting in by line mask with the copy tick as its answer.
4. **Keep the news card off the words.**
   - At 900px and up, cap `.xpe-tt` at about 16ch, or place the card from the title's measured text edge plus 24px.
   - Call `place()` on focus as well as pointer enter.
   - Add a press state (.98) to the rows.
5. **JS off, desktop.**
   - Move the boilerplate `<noscript>` out of `.xpe-about-g` (before the grid).
   - Add `.xpe-card{display:none}` and `.xpe-ts2{display:block}` to the page's noscript rule.
6. **Hero placement.**
   - Trim the top padding and the vertical centring so the h1 baseline sits near 38% and the next section peeks 56px.
   - Either cut the lede and asks in with the h1's mask, or correct the card's "0 fade-ups".
7. **Phone polish.**
   - Stop handles breaking mid-word (`overflow-wrap: normal`, and let the tile grow or the mono size drop).
   - Left-align the partner download links.
   - Give `press@hanzo.ai` a 44px minimum height.
8. **Send to the Ask owner (shared, `docs/requests/press.md`):** treat the hero ask as gone when `boundingClientRect.bottom < 64` (the root margin), not `top < 0`, so a slow scroll never misses the bar. Also send the shell hydration mismatch to its owner.
9. **Correct `docs/coverage/press.md`** to what ships, with the numbers above.
