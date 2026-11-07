# /leaderboard — James-eye review

Verdict: 6/10
First complaint: "The best bit, the podium adding itself up, is cut off by the bottom of the screen, so what I see first is a headline, a paragraph and a grey box of names. Then I get ten grey bars that are all the same length, and the greys aren't even Hanzo's greys."

Walked 7 Nov 2026 on the dev server at 1470x801 and 375x812. I used the recorder (13 desktop and 18 phone scroll stops, each with an idle pair, plus 14 hovers, 16 clicks and the video). Then I ran my own Playwright probes: arrival frames every 180 ms, the pinned chapters in 400 px wheel steps, hover and press styles on the primary, chips, steppers, rows and the scale tabs. I also checked the calculator maths after clicking +300 and dragging the range to 9, opened the sheet and closed it with Esc, and tried reduced motion, JS off, a 45-stop Tab crawl, overflow at 320, `taste.py`, `parity.py`, and live copy in `content/live/leaderboard.json`. I compared it with its neighbours /bounty and /referral.

Frames: `leaderboard/d-first-screen.jpg` (desktop first screen at 1 s), `leaderboard/d-token-bars.jpg` (the token board), `leaderboard/p-receipt-repeats.jpg` (phone earn chapters).

## What works
- The page has its own idea, and it is honest. The podium's tape adds up each hunter (450 + 1,060 = 1,510; 150 + 42 = 192; 200 + 52 = 252, which matches the live totals), and the four earn rules pin as chapters while a receipt prints line by line and the total rolls (50, 150, 170, 180). On desktop the pinned receipt is the best screen on the page, close to an Apple pinned scene.
- The motion is a real mix, not only scroll:
  - Idle: the podium lights each hunter every 3.8 s and redraws its tape. Contributor rows light one at a time. The token rows read themselves.
  - Pointer: rows fill on hover through a clip-path `::before`, and the rank nudges 8 px.
  - State: the Log/Linear pill glides (`layoutId`). The sheet rises. Totals roll.
  - Scroll: the dark room wipes open, bars draw in, the chapters pin.
  - Arrival: the h1 cuts in by line mask.
- Something moves within 1 s on desktop: the podium blocks grow and the tape writes `+450 / +1,060`.
- The calculator works. +300 changes 160 to 360 pts, and the range at 9 gives 1,410 pts and "#1 on the global board". The chips are proper `role=radio` with `aria-checked`, the steppers are 44 px, the range is custom-styled (`appearance:none`), and nothing is a browser default.
- Press is right on the primary: hover lifts 1 px, press is `scale(.97)`, and opacity stays 1. The sheet is a real modal `<dialog>` and Esc closes it.
- Reduced motion: `getAnimations()` is empty after 3.2 s and the final state shows (the podium and the 1,510 tape). With JS off, the h1 is at opacity 1 and fully legible.
- CLS is 0.0017 on desktop and 0 on phone. There is no horizontal overflow at 375 or 320. `parity.py` passes (text 94/94, links 2/2) and `taste.py` passes.
- It is clearly different from /bounty (issue list in a right panel) and /referral (link widget in a right panel). Here the hero object is a full-width stage under a split head.

## The 11 answers
1. **Sell in 5 s; moves within 1 s?** It moves within 1 s on desktop. It does not sell, because the moment sits below the fold. At 1470x801 the podium blocks start at y≈630 and the 84 px tape total ("1,510") is cut by the fold at 801 (`d-first-screen.jpg`). What sits above the fold is the h1, the lede, the button and a grey card of small names and numbers. At 0 ms the h1 is not there yet and the "LEADERBOARD" caption floats alone. On phone the lit block and the tape are fully below the fold. After the cut-in, the phone first screen is still: the idle diff on screen 00 is 2 bytes.
2. **One in, one out, or a document?** It is mixed. The podium, the pinned receipt and the calculator are single ideas. The token board is a document: ten rows over about 1.7 screens on desktop and 2.5 on phone, with an identical layout on every row. Gaps break the rhythm too: about 270 px of empty white sits between the hero stage and the contributors (desktop screen 01), and a dead 150 px sits above "How to earn" on both sizes. The phone page is 11,561 px long, against 7,909 px on desktop.
3. **A real visual object in every section?** Mostly yes: the podium plus tape, the ranked rows with a sheet, the bar board, the receipt, and the calculator with a dark result panel. The bar board is the weak object. On the default Log scale the widths are log10(t)/log10(106M), so rows #2 to #8 all draw at 80 to 85% (`d-token-bars.jpg`). The visual says "everyone is about equal" when the data says @hanzo has 17 times the next org. The bars are also a decorative `linear-gradient(90deg, #3a3a3c, #f5f5f7)`, which is colour as decoration, not state.
4. **One ask in the sticky header, nothing floating; scale rhythm?** The ask is right on desktop: the header swaps "Try Hanzo" for "Open bounties" once the hero ask leaves, and nothing floats over content (the cookie card and the dev badge aside). On phone the header keeps "Try Hanzo" all the way down and no thumb bar showed in any frame (shared chrome, noted only). Scale mostly has rhythm: h1 52/40 px, heads 26 px, figures 64 px, and one 84 px moment per screen (the tape total, then 140.1M, then the receipt total, then the calculator total). The exception is the close: the Band h2 runs about 84 px across nearly the full width and repeats the h1 word for word.
5. **Every hover and press answers, no jumps?** Partly.
   - The primary, steppers, rows, org rows and podium steps all answer.
   - The PR chips only darken their text (`rgb(51,51,51)` to `rgb(10,10,10)`), which is too faint to read as feedback.
   - The stepper hover is `scale(1.08)`, which is not one of the allowed hover transforms.
   - The primary's hover fill is `rgb(42,42,44)`, which is not in the deck.
   - The rows also light themselves every 1.6 s, so hovering a row fights the auto-reader: two rows look selected at once (desktop screen 01-b).
   - On phone, 14 of 14 hovers are inert, as expected. Taps on the podium and chips answer.
   - The recorder flagged the chip clicks as dead. My probe shows they do respond (160 to 360).
6. **Overlap, font swap, layout shift?** There is no shift. One measured collision: the "LEADERBOARD" caption box starts at y=344 while the h1 box ends at y=349, a 5 px overlap that sits tight under the descender of "credits." at both sizes. **Console error (counts): a hydration mismatch on the calculator's range input (`style={{}}` on `<input type="range">` in `Calc`, Leaderboard.jsx line 372).** It shows in the same error as the shared FooterHTML mismatch and raises the red "1 Issue" badge on every load at both sizes, which fails DONE item 3.
7. **Which reference, and is its motion there?** The pinned receipt is apple.com (a pinned scene where one panel changes) and it is truly there on desktop. On phone, as the brief asks, it becomes stacked panels. But the panels are the same receipt card four times, nearly identical in shape (`p-receipt-repeats.jpg`), so the phone reads as repetition, not chapters. The calm proof lists lean toward chatgpt.com/business/enterprise. There is no osply/hamol-style editorial pointer detail beyond the row fill.
8. **Different from neighbours?** Yes. /bounty and /referral both use a right-hand panel hero. This page has a split head over a full-width podium stage, plus its own signature (a self-adding tape and receipt).
9. **18 parts?** Gaps I could see:
   - The Band's "Open bounties" has no `data-cta="leaderboard.band"`. Only `leaderboard.hero` exists, twice, once on the empty-text AskBar.
   - The Band magnetic wrapper is an extra Tab stop: SPAN "Open bounties" 171x52, then A "Open bounties".
   - "Browse open bounties" is 21 px tall, under the 44 px touch target.
   - Three dark surfaces: the token room, the calculator's black result panel and the black Band. On phone the last two sit almost back to back with only one text link between them.
   - Page CSS is full of literal hex values, against part 7's tokens-only rule.
   - Weights 560 and 600 are used, which are not deck weights (497 / 606).
   - Ad hoc durations (.2s, .25s, .5s, .6s) and an infinite 2.4 s underline animation on the receipt.
   - Fine: one h1, a skip link, a pause control first in the podium, reduced motion, JS off.
10. **Banned tells?**
    - Colour: the page's greys are Apple's, not Hanzo's. Leaderboard.css hard-codes `#f5f5f7`, `#f0f0f2`, `#e8e8ed`, `#fbfbfd`, `#d9d9de`, `#c7c7cc`, `#a1a1a6`, `#86868b`, `#6e6e73` and `#3a3a3c`. None of these is on the deck ramp (`#f5f5f5`, `#ededed`, `#e5e5e5`, `#a3a3a3`, `#737373`, `#525252`…). `taste.py` passes only because their chroma is under 0.08. James said the brand deck is all the colours they use.
    - The token bars are a decorative grey gradient.
    - The closing Band reveals its words with `opacity:0; filter: blur(12px)`, which is the banned opacity-and-blur reveal. It comes from the shared kit `Band`, but it is on this page.
    - There is no hue, no gradient text and no label above a headline (the "Leaderboard" eyebrow was correctly moved under the h1).
11. **Copy untouched?** Hanzo's copy is intact (parity 94/94), but the page adds words and numbers that are not Hanzo's:
    - **The merged pull request chapter carries a "+$20 AI credits" tag, and the receipt and calculator credit $20 per merged PR** ("up to $40 / $45 AI credits", "Up to $40 in AI credits"). Live copy gives that chapter only "+100 pts" and "Earn +100 to +500 points and AI credits". The $20 is an invented, unverifiable figure.
    - New UI strings appear in neither the live copy nor `content/ui-strings.json`: "Your points, worked out", "Points, as the rules add them", "How #1 adds up", "Points a pull request", "1 merged bounty pull request, at +100", "Your tokens would sit at #N on the global board", "Below #10 on the global board".

## Fixes (in order)
1. **Fix the console error.** In `components/pages/Leaderboard.jsx` `Calc` (line 372), stop the server/client `style` mismatch on the range input. Render the input with no `style` prop on both sides, or set the fill through a CSS variable on the parent `label`. The red badge must be gone before anything else counts.
2. **Remove the invented credit.** In `EARN[1]` (Leaderboard.jsx line 69), drop "+$20 AI credits" from the merged PR tags and set its receipt credits to 0. In `Calc`, set `credits = bugs * 20 + refs * 5`. The PR line must not add dollars Hanzo never states. Move every new UI string into `content/ui-strings.json` through a request (`docs/requests/leaderboard.md`), or cut it. Keep the calculator's words to Hanzo's own labels.
3. **Put the deck greys back.** Rewrite `components/pages/Leaderboard.css` on `tokens.css` variables with no literal hex. Map `#f5f5f7`/`#f0f0f2`/`#e8e8ed` to the quiet `#f5f5f5`/`#ededed`/`#e5e5e5`, `#86868b`/`#6e6e73` to `#737373`/`#525252`, and `#a1a1a6`/`#c7c7cc` to `#a3a3a3`/`#d4d4d4`. Replace the `--silver` `#fbfbfd → #d9d9de` gradient with the deck silver `#f6f6f6 → #e9e9e9`. Use 497/606 instead of 560/600. Make the bars flat: ink for the lead, `#a3a3a3` for the rest. Request that `globals.css` `--soft`/`--faint`/`--card` move to the deck too (shared).
4. **Bring the moment into the first screen.** At 1470x801, the podium blocks and the tape's 84 px total must be visible above the fold. Tighten the hero top (the lede starts at y=180 and the h1 at y=234: pull the head up and bottom-align the h1 and the lede/ask as the 8/5 split asks). Shorten `.xlb-pod-body`, or put the tape total level with the blocks rather than under them. On phone, crop the podium so the lit block and the total sit within 660 px, or show only the lit hunter's block and total there. Give the "LEADERBOARD" caption at least 10 px clear of the h1 box (it overlaps by 5 px now).
5. **Make the token board say something.** Default to Linear, so @hanzo's dominance is the picture and Log becomes the reveal. Or keep Log and label it. On phone, collapse rows 4 to 10 behind the existing disclosure pattern so the dark room is one screen, not two and a half.
6. **Stop the phone from repeating the receipt four times.** Under 900 px, show one receipt after the four chapters, with all four lines printed and the 180 total. Or keep one sticky receipt and let the chapters scroll past it. Do not stamp the same card under each chapter.
7. **Close out the dead space and the dark rooms.** Remove the ~270 px gap after the hero stage on desktop and the ~150 px gaps on phone. Next sections should overlap or peek by 40 to 56 px. Make the calculator result panel graphite on a light room, or light, so the page has at most two dark rooms and they never sit back to back on phone.
8. **Make every hover answer properly.**
   - PR chips: fill `#ededed` on hover, not only a text darken.
   - Steppers: drop `scale(1.08)` and use the press `scale(.97)` only, with a fill change on hover.
   - Pause the auto-reader (`useReader`) while the pointer is over the list, so hover and auto-light never show two selected rows.
   - Primary hover fill: use a deck value, not `#2a2a2c`.
9. **Fix the close.** The kit `Band` uses a blur word reveal and has no `data-cta`. Request a kit fix (line-mask reveal, a `cta` prop, no focusable magnetic wrapper). Until it lands, pass `data-cta="leaderboard.band"` through a page-local close, and keep the Band h2 at the deck's 52 px rather than a near-full-width 84 px repeat of the h1. Give "Browse open bounties" a 44 px hit area.
10. **Motion tokens.** Replace `.2s/.25s/.5s/.6s` and the infinite 2.4 s receipt underline with deck durations (150/300/400/500). Let the underline draw once per new line, then rest, so the pinned screen has one mover (the rolling total), not two.
