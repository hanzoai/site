# /kai/guide — James-eye review

Verdict: 7/10
First complaint: "The hero is lovely, then it turns back into a docs page: a code box, another code box, five paragraphs stacked beside a control panel, then another code box. That's an overload of information, and the terminal I just watched ends on dots, not an answer."

Walked 7 Nov 2026 on the dev server at 1470x801 and 375x812 (full scroll with a/b idle frames at every stop, 14 hovers, 14 clicks, primary hover and press measured, frame-by-frame h1 arrival, a 40-stop Tab crawl, language tabs by click and arrow key, reduced motion, JS off, 375x667 fold check, 320px overflow, hero left alone for 14 s, neighbour /kai compared, `taste.py` and `parity.py` run).

Frames: `guide/r2-desk-hero-rest.jpg` (the hero demo at rest), `guide/r2-desk-limits.jpg` (the Limits screen), `guide/r2-phone-hero.jpg` (the phone hero).

## What works
- The hero object is the product in use. The guide's own curl request types into a dark terminal and starts within 1 s (typing at the 1000 ms frame on both sizes). The status reads `typing`, then `200 · streaming`, then `200 · output_tokens 0`, and the demo rests with a Replay control. Pause is 44px and first in the bar.
- The h1 cuts in by line mask: translateY from 56.8px to 0, two lines staggered, ease-out, done about 650 ms after it starts. It sits at 52px/497 with top 183 on desktop and 44px on phone. The box never moves: CLS is 0.0028 on desktop and 0.0086 on phone.
- The page mixes the kinds of motion properly:
  - Time: the typing terminal.
  - Idle: the choice, score and noul glyphs loop in turn; the request checker runs its own cases (it showed `422 state_too_long` with the hatched verdict on phone); the recipes stage advances `01 / 06` with a progress line and a pause button.
  - State: the gliding language pill and the `kai` / `kai-1.4` chips.
  - Pointer: the Limits rows get a clip-path hover fill.
  - Arrival: the h1 cut-in.
  - Scroll is well under half of it.
- The Jev diff is the best object on the page. Struck-through old values sit in grey marks and new values in ink chips, and it explains the switch with no prose.
- The palette holds: monochrome, two dark surfaces only (the hero terminal and the recipes room), never back to back. `taste.py`: OK. `parity.py`: text 184/184, links 7/7.
- The primary is right: `data-cta="kai-guide.hero"` and `data-thumb`, 44px tall, pressing scales it to 0.98, and the only solid fill in the first viewport on desktop. The header ask swaps to "Get an API key" once you pass the hero.
- Reduced motion leaves 0 running animations after 3 s. With JS off, the h1, lede and the full request are all legible.

## The 11 answers
1. **Sells in 5 s, moves in 1 s?** On desktop, yes. The h1, lede, primary and a typing terminal are all in the first viewport, and typing has begun at 1000 ms. On phone it is weaker. The terminal window is a short strip (about 195px) under a 2-line h1, and its JSON soft-wraps mid-string (`"Route` / `ticket to appropriate team"`, `"executive_escalati…`), so the hero object reads as broken text. The `HANZO DECISION MODEL · 0 OUTPUT TOKENS` line sits 10px under the h1 (h1 bottom 237, caption top 247 at 375x667). On a cold load the h1 is masked until about 1.0 s, so the 0 ms frame shows the caption and lede with no headline.
2. **One in, one out, or a document?** It is half of each. The first two screens work: the hero, then three glyph rows. After that, the Call section is a 610px-tall Python block. The Limits screen then puts five labelled paragraphs (Model, Questions, State, Time, Price; State alone is about 60 words) beside a checker with two rulers, a verdict, a figure and a price. That is the overload James named. The closing is clean: an 84.4% vs 76.6% proof strip, then a Quiet band with a centred statement and the ask.
3. **A real object in every section?** Yes. The terminal, the type glyphs, the code tabs, the checker, the recipes stage, the diff, the benchmark bars and the band. But four of the eight are code or code-like panels in the same grey and white, so the objects repeat. The recipes stage is mono text at a large size, not a picture. There is no Kai media anywhere, and /kai has a film it could borrow from.
4. **One ask in the sticky header, nothing floating; scale rhythm?** On desktop, yes. The header goes outlined while the hero ask is solid, then solid "Get an API key". Nothing of the page's own floats. On phone the shared header keeps a solid "Try Hanzo" beside the hero's solid "Get an API key", so there are two solid fills with different labels at 375x667 (shared chrome, noted below). Scale mostly has rhythm: h1 52, h2 26, benchmark figures large, captions 12 mono. But the type names `choice` / `score` / `noul` are h3s at 32px, bigger than every h2 (26px), so the hierarchy is inverted in that section.
5. **Every hover and press answers, no jumps?**
   - Mostly yes, with no jumps. Rows fill, chips fill, tabs answer, Copy confirms and Replay restarts the demo.
   - The primary hover moves the fill from `#0a0a0a` to `rgb(44,44,46)`. That is a fill change, not a fade, but it is off the deck ramp (kit `Cta`). Press is scale 0.98.
   - "Read the reference" underlines on hover.
   - The walker flagged "TypeScript" and "kai-1.4" as dead clicks. Both work when probed: `aria-selected` flips, and the chip toggles in the frames.
   - Under 44px: the hero Copy is 75x30 and "The runs →" is 80x21.
6. **Overlaps, font swap, layout shift?** No overlap at either size, and overflowX is 0 at 375 and at 320. CLS: 0.0028 desktop, 0.0086 phone. No visible font swap. The desktop Python block clips long lines inside its own scroller (scrollWidth 799 vs 700), so the `state` and `criteria` lines run off the card's right edge with no hint.
7. **Which reference, and is its motion there?** motion.dev patterns and the Developer type's "typewriter terminal". The typing, streaming status and rest are really there. Apple's "one idea per screen" is not there in the middle third.
8. **Different from its neighbours?** Yes. /kai is a black full-bleed film hero (the light diamond) with a 120px name. The guide is a light split hero with a typing terminal. Different medium, layout and signature.
9. **18 parts?**
   - Covered: header comment with Persona, Goal, CTA, Signature and Beyond; one h1; `<main>` content; a breadcrumb under the hero (Models / Kai Guide); `data-cta` on the primary; APG-style tabs with arrow keys; a code block focusable as a scroll region; pause controls on the terminal and recipes; reduced motion; JS off; no 320 overflow.
   - Gaps:
     - The tabs don't sync to the hash (`location.hash` stays empty after choosing TypeScript), and the choice isn't remembered.
     - Two targets are under 44px.
     - The page CSS uses literal hex values throughout (`#f5f5f5`, `#e4e4e7`, `#a3a3a3`…) and redefines its own token names in `.kg` instead of using `tokens.css` (part 7). The values are on the palette.
     - Under reduced motion the hero shows the top of the request, not the settled response.
10. **Banned tells?** None found. No hue, no gradient text, no kicker above a headline (the mono captions sit below their h1 and h2), no cursor glow, no fade-on-hover.
11. **Copy untouched?** Yes: parity 184/184 text and 7/7 links. The response's `…` values are the guide's own response shape, not invented numbers.

## Fixes (in order)
1. **Turn Limits into one thing at a time** (`components/pages/model/KaiGuide.jsx`, the `kg-rows` list around line 290, and the checker beside it). Only the active row shows its paragraph. The others collapse to their mono label and one line, with the text kept in the HTML (`hidden="until-found"`, opens by hash). Clicking a row already loads the checker case, so the open row and the checker move together. This is the screen James will call "overload".
2. **Make the hero rest on the answer** (the session terminal, `KaiGuide.jsx` lines 100–115 and its runner). Still no invented values. When it settles, scroll the response to the middle and light the `answers` block and `"output_tokens": 0` line by line in ink, with the request dimmed to white 55%. That way the climax is "probabilities come back, no text". Under reduced motion, render that same settled response view, not the top of the request.
3. **Rebuild the phone hero** (`KaiGuide.css`, `@media (max-width: 899px)`):
   - Make the terminal taller, up to 45svh.
   - Use `white-space: pre` with horizontal scroll (or 12px mono) so the JSON keeps its indentation instead of soft-wrapping mid-string.
   - Add 10.5–17px between the h1 and the `HANZO DECISION MODEL` caption.
4. **Break the code-panel run.** The Call section's Python block is 610px tall and clips at the right. Cap it at about 12 lines with an "expand" disclosure, and let long lines wrap or show a scroll fade. Give the Call section's left column something other than a paragraph, such as the three-question response shape as a small diagram from the existing words. Consider bringing Kai's own film or still from /kai into the recipes room or the band, so the page has one real Hanzo visual.
5. **Fix the inverted scale.** Set the `choice` / `score` / `noul` h3s to 21px (deck H3 band) or lower, so the section h2 at 26px leads.
6. **Tabs:** sync the language choice to the hash (`#python`, `#typescript`, `#curl`) and remember it in `localStorage` inside try/catch (parts 6 and 16).
7. **Targets:** give the hero Copy a 44px hit area (it is 30px tall) and "The runs →" a 44px line box.
8. **Tokens:** replace the literal hex values in `KaiGuide.css` with `tokens.css` variables, and drop the local re-declarations at the top of `.kg`.
9. **Phone checker:** set the `model: "kai"` / `model: "kai-1.4"` chips side by side at equal width. They currently stack at different widths.

Shared chrome, not scored against the page:
- On phone the header keeps a solid "Try Hanzo" in view with the hero's solid "Get an API key", so there are two solid fills and two labels. Desktop swaps correctly.
- The kit `Cta` hover goes to `rgb(44,44,46)`, which is off the deck ramp.
- The phone cookie card is 203px and covers the lower quarter of every screen until dismissed.
- The red "1 Issue" dev badge is the FooterHTML hydration mismatch, which is the only console error.
