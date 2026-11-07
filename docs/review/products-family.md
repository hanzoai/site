# /products/* (template) — James-eye review

Ready: 7 Nov 21:20, held up next to /api and /affiliate (James's new bar, no score). Entrances on measured cards, OS rows and band; the Hanzo OS row flies into the next page's h1; phone Measured rows fixed (name and text were split into two columns). taste/unique/parity OK; 0 console errors at 1470 and 375.

Verdict: 5/10
First complaint: "Where's the product? The name's tiny, and then it's the same six API lines three times in grey boxes. That's developer docs, not an Apple launch page."

Walked 7 Nov, 14:25 to 15:05. Template `components/pages/ProductPage.jsx` and `ProductPage.css`, judged on `b11ac35` (v4) with the Families kit at `fe077aa`.

v3 (`ad801d4`) was walked first and changed while I was walking it. It had a 128px name over a full-width console, then a 60px word-lit paragraph that filled two screens.

Members: /products/agents and /products/memory, both filmed moving:
- 1470×801 with the wheel, and 375×812 with finger drags;
- idle frames over the first 6.5 s;
- every kind of control hovered and pressed, and a Hanzo OS row clicked;
- a sideways swipe on the phone, reduced motion, and JS off.

Stills: `img/products-family-repeat.jpg`, `img/products-family-phone.jpg`, `img/families-first-screens.jpg`.

## What works
- **The console is the product, and it runs itself.**
  - The request types out of Hanzo's own "Try it", starting within about 1 s.
  - The six operations land one by one, and the count settles.
  - Pointing at an operation slides in Hanzo's line for it.
  - Copy and Replay work.
  - A read and a write are told apart by outline against fill, not by hue.
- **v4 puts the console whole on the first screen at 1470×801, beside the title.** One solid ask, "Try Hanzo", sits with the outlined "Agents API". The ask bar carries the ask after the hero at both widths.
- **The three sentence chapters replace v3's wall of text.** One sentence of Hanzo's paragraph pins at a time.
- **Memory's "Measured" section uses Hanzo's benchmarks as hero figures** (37.5, 90.6%, 67), each one a link. That is the anthropic.com launch reference done right.
- **The Hanzo OS list works.** The current layer is marked with its "6 API". The other six show their operation count on hover, and each row opens its page.
- **Clean on the checks:**
  - 0 UI hues, and no eyebrows.
  - Parity: agents 60/60 and 21/21; memory 59/59 and 19/19.
  - Reduced motion: 0 running animations. JS off: everything legible.
  - Phone swipe: agents to company, memory to models.
  - Desktop CLS 0.003 or less.
  - Every desktop control answers hover and press.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** It moves: the typing starts at once. It sells less than v3 did:
   - "Agents" is now 52px (40px on the phone) beside a 650px black console. The console is read first, and it reads as curl.
   - What the API does (the answer) lands only once the whole curl has typed: about 3–5 s in on both members.
2. **One in, one out, or a document?** The three sentence chapters pin and swap. After them it is a document: scroll-lit API rows, then the Hanzo OS rows, then a footer of links.
3. **A real visual object in every section?** Not after the console. What follows is outlined boxes that list operations, a thin "6", and rows of text.
   - Memory's measured cards are the only other object. Its first card (CronQuestions) is an empty box with a dash.
   - The same six operations appear three times: in the console's answer, in the chapter boxes and in the spec sheet (`img/products-family-repeat.jpg`).
4. **One ask, sticky after the hero?** Yes, "Try Hanzo" at every width, but those are the header's words, so the page never asks in its own. At the close on the phone, the header's "Try Hanzo" and the close's full-width "Try Hanzo" are solid together.
5. **Does every hover and press answer, with no jumps?** On desktop, yes. On the phone, the doc links ("Agents API", "Agents, the concept") are 22px tall.
6. **Overlaps, font swap, layout shift?** Yes, on the phone.
   - When the answer lands, the answer pane changes height and pushes the page: one shift of 0.14 on /products/memory. The total over the walks was 0.24 on agents and 0.62 on memory, partly from the typing cursor's shift on every character.
   - At 375, "API" butts against the chapter box above it, and the thin "6" runs into its lede line (`img/products-family-phone.jpg`).
   - The code wraps mid-URL at 375 ("…/agent/helper/" then "run").
7. **Which reference does it feel like, and is its motion there?** It aims at an Apple launch page, and the pinned sentence chapters are Apple. The anthropic.com launch shows in "Measured" (memory only).

   synchronized.studio is not there. Clicking a Hanzo OS row first jumps the current page back to its own top and restarts its console, then cuts to the next page (dev server). No title flies into the next h1.
8. **Different from its neighbours?** No. v4's composition matches /oss/* and /solutions/*: title on the left, a black rounded card on the right, then chapters with words on the left and a box on the right (`img/families-first-screens.jpg`). Agents and memory are one page with different strings.
9. **Every one of the 18 areas covered?** See below.
10. **Any banned tells?** Low contrast on the phone. Spec rows away from the middle of the screen sit at 34% opacity, about 1.6:1. The phone rule meant to show them at full strength loses on specificity (`ProductPage.css` line 89 beats line 171).
11. **Copy untouched?** Yes; parity is clean.

## Missing from the 18 areas
- **2.3 Narrative:** no closing band. The page ends on a list of links ("Docs", "On this site" chips) beside a solid button.
- **2.6 Presentation:**
  - The h1 is 52px, and the section headings "API", "Hanzo OS" and "Measured" are 26px. The master brief itself says 26px makes "sections feel like footnotes".
  - Spec rows are unreadable on the phone.
- **2.10 Media:** nothing besides the console. No product UI, film or model media anywhere on the page.
- **2.11 Mobile:** the layout shift when the answer lands, 22px links, code broken mid-word, and the "6" running into its lede.
- **2.15 Catalogue and product pages:** the plan's product anatomy (identity, console, a 3-fact strip, openable features, Band) is missing the fact strip and the Band. The row-to-page morph is not visible.
- **Gate line 2:** raw `<table>` in the spec sheet, where the gate asks for the kit's DataTable.
- **2.17 States:** a measured result with no figure renders as an empty box with a dash.
- **JAMES.md 10 Sound:** none on copy or replay. The shared kit is not built yet.

## Fixes (in order)
1. **Say each operation once.** The console's answer is the one list.
   - The sentence chapters should point at the console (the operation they name lit up) instead of printing the operations again.
   - Fold the spec sheet into the console's detail (point at an operation and its line shows), or make the spec sheet the only list.
2. **Give the name its size back.** The h1 at display size (72px or more on desktop), with the console beside it but not dwarfing it. Section headings at 36–64px.
3. **Fix the phone.**
   - Give the answer pane a fixed height, so swapping the count for a description moves nothing.
   - Space "API" away from the box above it, and the "6" away from its lede.
   - Let the code scroll sideways in its pane instead of breaking URLs.
   - Show the spec rows at full strength.
   - Make the doc links 44px tall.
4. **Close with a band.** One dark room in Hanzo's words with the one ask. The docs links and site chips go above it, quietly.
5. **Measured:** a result with no figure becomes a text row at the end, not an empty card.
6. **Make the row-to-page open continuous.** The title flies into the next h1, with no jump back to the top of the current page and no console restart.
