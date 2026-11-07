# /blog/* (template) — James-eye review

Verdict: 7/10
First complaint: "On my phone I'm reading and there's the header, a bar under it, and then a button floating over the text at the bottom. The header says Try Hanzo, the floating one says Hanzo Gen. Which one do you want me to press? One ask."

Walked 2026-11-07 16:43 UTC, HEAD 10953462, at 1470x801 and 375x812 (isMobile, touch). I walked /blog/pareto-frontier/ and /blog/kai-decision-models/ in full and glanced at /blog/synthesis/. For each I took first-screen frames at 0.2, 1, 3 and 6 s and a reload, scrolled the whole page in 200px (desktop) and 160 to 180px (phone) steps with screenshots, and hovered and pressed the hero ask, Back link, next-post cards, chart chips and dots, chapter rail, Copy and the TypeScript/Python tabs. On phone I opened the chapter sheet. I also ran reduced motion, JS off, CLS while scrolling, taste.py (OK) and parity.py (pareto 77/77 text, 8/8 links; kai 110/110, 4/4).

## What works
- The first screen sells. The title sits at rest size (52px desktop, 40px phone), with the lede and one solid ask, and the post's own Hanzo film plays beside it. The film is in motion from the first frame. On phone the h1, lede, ask and film top (y 528) all fit inside 812px.
- The hero film card grows into a full-bleed black stage (Gen / Enso / Kai on pareto, four hero figures on Kai), then hands over to a calm 768px reading column. That gives the page a big, then medium, then small rhythm.
- Every chapter has a real object. The pareto GPQA chart draws its frontier line and **walks the dots by itself when idle**: the readout changed from Fable 5.1 to GLM 5.3 with no input. Hovering or pressing a chip or dot pins it. The page also has the 01/02/03 step track, 0.27 ms / $0.021 count-ups, the install terminal, Kai's code tabs (TypeScript to Python swaps and holds the pressed state) and the 32,768 bar.
- Next-post cards open into their page. The title morphs to the destination h1, which lands at y 345, and Back restores the scroll position. Card hover scales the picture 1.04.
- The hero ask answers on hover (#0a0a0a to #2c2c2e) and press (scale 0.98) with no jump. Copy puts the exact displayed text on the clipboard. Clicking the rail scrolls to the chapter. The phone chapter bar opens its sheet (aria-expanded true).
- On desktop the header ask swaps to the post's own ask ("Hanzo Gen" / "How to use Kai") once the hero ask leaves view, and the header button goes quiet while the hero ask is visible.
- CLS while scrolling is 0.0001 to 0.0004 on all three posts at both sizes, and the h1 box never moves. There is no horizontal scroll at 375. I found no page errors and no hue in main. Reduced motion shows the final state: the stage is static and the Band words are visible. JS off is fully legible.

## The 11 answers
1. Yes. Something moves within 1 s: the title cut-in and the Enso/Kai film (synthesis has a drawing canvas). It sells in 5 s.
2. Mostly one-in-one-out. The hero hands to the stage, the stage to the column, each chapter's object to the next. The reading column is document-like by nature, but each chapter swaps its object.
3. Yes on pareto and Kai. Every chapter carries a chart, step track, figures, terminal, code or bar.
4. Desktop: yes, one ask in Hanzo's words in the sticky header. Phone: no. The header keeps a solid "Try Hanzo" while the shared rising bar shows "Hanzo Gen" over the text, under a 56px chapter bar, so there are three chrome layers and two asks. Scale has rhythm: big stage, medium column, small meta.
5. Yes. Every hover and press I tried changed something other than opacity, with no jumps.
6. No overlaps from the page itself. The cookie sheet and the dev "1 Issue" badge cover content, but both are shared chrome. I saw no font swap and CLS is about 0.
7. It feels like an anthropic.com model launch crossed with an Apple pinned stage, and the synchronized.studio card-to-page morph is really there. The motion is present, not just implied.
8. Partly. Across the family each post has its own film and its own chapter object, but pareto and Kai share an identical skeleton: split hero, black stage, rail plus column, two next cards, Band. That is acceptable for a template, but the posts read as one page with different media.
9. Mostly covered: skip link, one main, one h1, data-cta on every primary, closing links, Band, Morph, JS off, reduced motion, budgets. Two gaps: the depth-2 page has a "Back to Blog" link where part 2 asks for a breadcrumb, and that link sits directly above the h1 (part 3 says nothing sits above the h1).
10. One: on /blog/synthesis the "AI for AI" chapter is a 3-up grid of equal tiles (Zen / Enso / Kai films, then Gen / MCP / IAM and KMS), each with an explaining sentence underneath. That is "3 equal boxes in a row" twice. Pareto and Kai have none. No gradients, no pill above the h1, buttons do not fade.
11. Yes. Parity is OK on both posts and taste.py is OK.

Shared (not counted): the intermittent `FooterHTML` hydration mismatch (diff is only in the footer `__html`); the cookie sheet covering the lower screen; the dev "1 Issue" badge; the shared `x-ask` rising bar.

## Fixes (in order)
1. Phone, one ask. While the post is being read, the header's solid "Try Hanzo" and the floating "Hanzo Gen" bar must not show together. Either put the post's ask in the header on phone (as desktop already does), or keep the header quiet whenever the rising bar is up. Consider folding the ask into the 56px chapter bar so nothing floats over the text.
2. /blog/synthesis "AI for AI": break the 3-across equal grid. Make one large film with the other parts as a smaller list or rail, or use an asymmetric 2+1 layout. Keep every word.
3. Move the "Back to Blog" link off the h1. Make it a proper breadcrumb ("Blog / <post>") in the meta line or under the header, so nothing sits directly above the title.
4. Give pareto and Kai different stage moves so neighbouring posts do not read as the same page. For example, a scrubbed figure count on Kai instead of the same black stage block, and keep the products stage on pareto.
5. Small polish: on phone the header button flashes solid to outline during the first second. Set its quiet state from first paint when the hero ask is in view.
