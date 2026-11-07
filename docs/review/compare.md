# /compare — James-eye review

Verdict: 5/10
First complaint: "Green ticks, green Yes, green borders. I said no green, and no colour in the UI at all."

Walked 7 Nov, page file at `fc10b3d` (`components/pages/Compare.jsx`, `Compare.css`), on the preview of main plus the Proof branch. Filmed moving at 1470×801 and 375×812 (wheel and finger scroll, dwell on every screen, hover and press on desktop, taps on phone), plus reduced motion and JS off. Stills: `review/compare/desktop-walk.jpg`, `review/compare/phone-walk.jpg`.

## What works
- The row chapters are a real scene. One routing question pins on the left while a four-lane board flips Enso, OpenRouter, Portkey and LiteLLM to that row's answer. One comes in, one goes out, seven times.
- "Count the Yes" is a good Beyond: untick a row and the tallies (5/5, 2/5, 2/5, 4/5) recount as giant figures. It is built only from the table's cells.
- It is honest. Enso's 600+ sits beside Portkey's 1,600+ and LiteLLM's 1,800+, and "Not published" and "not measured by us" are shown. That is the candour the brief asks for.
- The Enso film still on the comparison card is real Hanzo media. The one dark room ("A different question") closes it well.
- Parity: text 28/28, links 2/2. CLS 0.007. Reduced motion leaves 0 running animations. Every desktop hover answered; press scales to .98.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Half. The headline reads well, but at 1470×801 the table object is only a header row peeking at the bottom. Once the lines have cut in, the only movement is a thin reading line walking the rows, mostly under the fold.
2. **One in, one out, or a document?** One in, one out through the seven row chapters. That is the best part.
3. **A real visual object in every section?** Mostly: the table, the verdict board, the tally figures and the Enso card. The hero itself has no object above the fold at 1470×801.
4. **One ask, sticky after the hero?** No page ask at all. The hero's only control is a small "+ Every cell, in full" link. Desktop: just the site header's "Try Hanzo". Phone: a "Try Hanzo →" thumb bar under a header that also says "Try Hanzo", so the same solid button shows twice.
5. **Every hover and press answers, no jumps?** Desktop yes. Phone: tapping rows 03 and 06 in the full-table sheet gave no response.
6. **Overlaps, font swap or layout shift?** No overlaps, no swap, shift 0.007. JS off: 16 of 28 text blocks stay invisible.
7. **Which reference, is its motion there?** The pinned chapters are Apple's pattern and they are there. synchronized.studio is claimed for the comparison card, but the Enso card lands on `/compare/model-routing`, a plain text page with no image. The card does not become its hero.
8. **Different from neighbours?** Barely. It is the same frame as /comparison, /philosophy, /research and /security: white page, mono kicker, headline left, object right. Only the accent colour changes from page to page.
9. **18 areas (PLAN-COMPONENTS)?** See below. No `docs/coverage/compare.md`.
10. **Banned tells?** Yes:
    - green as the UI accent (`#00a37a` on every Yes, tick, border, tint and the dark room's arrow button). "Green accents" is on his reject list, and JAMES.md allows 0 UI hues;
    - eyebrows over the h1 ("HANZO VS") and over each block ("MODEL ROUTING APIS", "COUNT THE YES", "COMPARISONS", "A DIFFERENT QUESTION");
    - those mono labels are the page's `<h2>`s, so the outline is labels, not headlines.
11. **Copy untouched?** Yes. Parity is clean, and every figure (600+, 500+, 1,600+, 1,800+, 198 questions, 58.2%, 46.8%) sits with its source cell.

## Missing from the 18 areas
- **2.3 First impression:** no hero object above the fold at 1470×801, and no closing Band with one solid button in Hanzo's words.
- **2.3 Morph:** the card's Enso image does not reach the destination. The landing page is unstyled text.
- **2.4 Conversion:** no page ask, no desktop sticky ask, and the button repeats on phone (header plus thumb bar).
- **2.7 Visual system:** green accent. Teal-green also breaks the rule that status colour comes with a shape cue, because here the colour is the decoration.
- **2.12 Accessibility:** the mono labels are the `h2`s. The real headlines ("OpenAI-compatible endpoint" and the rest) are not headings in order.
- **2.17 States:** most text is hidden with JS off.
- **2.18 Measurement:** no `Persona:` / `Goal:` / `CTA:` header lines, no `data-cta`.

## Fixes (in order)
1. **Take the green out.** "Yes" in ink at full weight, "No" at 40% grey, ticks as ink glyphs, no tinted rows or coloured borders. Hanzo's column is raised by weight and a hairline, not by colour. The dark room's arrow button goes white on black.
2. **Remove the eyebrows.** Delete "HANZO VS" over the h1 and the mono labels over each block. If the label must stay for meaning, put it after the headline as a quiet meta line. Make the real headlines the `h2`s.
3. **Put the object on the first screen at 1470×801.** Bring the table up so at least four rows sit under the headline, with the reading line visibly walking them, or set the table beside the headline at 7/5. Something should be moving in view the moment the lines land.
4. **Give the page one ask.** Use Hanzo's existing label for the hero and the closing dark room, as one solid button (not a round icon). Show the desktop sticky version after the hero. On phone, drop the duplicate: header or thumb bar, not both.
5. **Make the card open into a real hero.** Coordinate with the `/compare/*` family owner so the Enso image and the question title land as the destination hero, not on a text page.
