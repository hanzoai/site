# /blog/* (template) — James-eye review

Verdict: 7/10
Ready: 8 Nov, held up next to /api and /affiliate (James's new bar, no score). Walked kai-decision-models, synthesis and pareto-frontier: each post reads as a simple article (title, meta, lede, one ask, then chapters in one column beside a quiet reading rail), as Hanzo's own posts do; this pass makes the Game of Life board a grid of square cells on phones (the global 44px tap floor had stretched them into grey stripes, fix 1) and keeps inline code as plain text so Kai's two live lines read word for word. copycheck missing 0 of 34, 21, 27 (kai, pareto-frontier, synthesis); taste/unique OK; 0 console errors, no overflow at 1470 and 375 (code blocks and the frontier chips scroll inside their own boxes). Shared, not this page: the kit Band's word blur (fix 2) is the Band owner's.
First complaint: "The Game of Life board looks like it's still loading: grey stripes, not a grid of cells. And the closing line goes blurry before it comes in."

Walked 2026-11-07 ~17:00 UTC, HEAD 042dd418 (2e1b77aa by the end of the walk), at 1470x801 and 375x812 (isMobile, hasTouch). Members walked: /blog/pareto-frontier/, /blog/kai-decision-models/, /blog/synthesis/. For each: first screen at 0.2/1/3/6 s and a reload; whole page by 200px wheel steps with dwell; hovered and pressed the hero ask; clicked the chapter rail, chart chips, Kai's TypeScript/Python tabs, Copy, the Life Run/Pause/Step/Glider/Clear controls and a next-post card (plus Back); on phone opened the chapter bar and jumped from it. Also checked reduced motion and JS off. taste.py OK (4 files); parity OK on all three (77/77, 110/110, 45/45). No console errors, page errors or hydration warnings on any member.

## What works
- Hero: the h1 cuts in by line mask inside a steady box. The lede and one solid ask sit beside it, with a live film (Pareto, Kai) or a drifting Sigil contour (Synthesis) on the other side. Something moves within 1 s on every member.
- The hero plate opens into a full-bleed black stage that you scroll through: Gen / Enso / Kai rows on Pareto, the four figures on Kai, a 112px "Synthesis" on Synthesis. Then it hands over to a calm reading column. That's a real one-in, one-out moment.
- The sticky rail has a 64px numeral ("02 / 04"), a "min left" countdown and a thread of knots that fills as you read. Clicking a knot scrolls to that chapter. On phone it becomes a sub-bar under the header (chapter, chevron and the post's ask). It opens to the full list, and a tap jumps.
- Real objects in the body: the three-step strip, the Frontier chart (chip press updates the caption card and highlights the point), the 0.27 / $0.021 figures, the copy-exact shell block (the clipboard matched the display), Kai's code tabs, the 32,768 bar, the live Life board, and the Zen film beside the product list.
- The next-post card opens into its page: the title flies to the destination h1 at about 250 ms, and Back returns to the same post.
- The header ask becomes the post's own ask ("Hanzo Gen" / "How to use Kai"), solid. Hover darkens the fill (not a fade), and press scales to 0.98.
- The three members differ: film right with a chart, film left with a figure stage and code tabs, contour Sigil with a playable Life board.

## The 11 answers
1. Yes. The title, lede and ask read in 5 s, and the h1 cut-in plus film or Sigil moves within 1 s. Phone fits the h1, meta, lede, ask and about 90px of art inside 660px. The ask's bottom edge is at 458px at 375x667.
2. Mostly one in, one out: the hero becomes the stage, then the chapters come one at a time under a changing numeral, then next-post cards and the Band. The chapters are prose by nature, and Synthesis 02 and 03 read as a document: two long text chapters with no object.
3. Nearly. Every Pareto and Kai chapter holds an object. Synthesis "Collisions are construction" and "The emblem" hold none.
4. Yes. There is one ask in Hanzo's words in the sticky header (and the phone chapter bar, which sits under the header, not over text). Scale has rhythm: h1 52, h2 26, figures about 64, one stage word at 112 and the Band at 88, never two big things at once.
5. Mostly. The ask, chips, rail, tabs, Life controls and Copy all answer. Card hover only zooms the media to 1.04 and tells you nothing new.
6. **Overlap on Synthesis at both sizes.** The Life board's cells render 24px wide in 21.3px (desktop) and 20.3px (phone) tracks, so they overlap by about 3px. The 2px gaps vanish and the empty rows read as grey loading bars. On Kai's stage, the "<1 ms / DECISION LATENCY" figures sit straight on the bright diamond film with no gradient under them. No font swap, no h1 shift, no horizontal scroll.
7. apple.com (a pinned stage, a sub-nav with a persistent ask), synchronized.studio (the card opening into the next post works), and osply-style editorial numerals. The motion is actually there.
8. Yes. Each member has its own hero medium and stage, on one shared template.
9. What I saw: one main, the skip link, a "Back to blog / tag" breadcrumb, data-cta on the asks, the closing Band, the Morph, a pause control on the films, Copy, and Life's step-through. I did not audit all 18 parts.
10. No hue, no pill or eyebrow over an h1 or h2 (the meta sits under the h1), no three equal boxes, no fading buttons. Not on James's list, but against MASTER part 9: the Band headline reveals with opacity and blur, word by word, visibly blurred at 100 ms.
11. Untouched: parity is 0 missing on all three.

Shared (not counted): the cookie card covers 203px of the phone screen and sits over the hero film on desktop. The Band's blur reveal comes from the kit `Band`. It is listed under fixes because it shows on this page.

## Fixes (in order)
1. Life board overlap (`components/pages/post/Post.css:174`). The global 24px button min-height combined with `aspect-ratio: 1` forces 24px cells into 21px tracks. Add `min-height: 0` (and `min-width: 0`) to `.xbg-board button`, or make the board wide enough for 16 columns at 24px plus the gaps. Check it at 375 too.
2. Band headline: replace the opacity-and-blur word reveal with the line-mask cut-in (request to the kit `Band` owner, or a page-local prop if one exists).
3. Kai stage: put the deck's gradient under the figure column, or shift the film so the labels never sit on its brightest lines.
4. Synthesis chapters 02 and 03: give each an existing object, for example Life presets for the collision, or the glider as the emblem, so the post is not two text screens in a row. Do not add copy.
5. Reduced motion, desktop: the hero's right column is empty because the plate already sits in the stage below. Keep the hero object in the first screen.
6. Frontier chip wall: the "Source" links sit inside the chip flow and break it into a cluttered four-row wall. Move them out of the flow (for example, beside the caption card).
7. Next-post card hover: let it tell something (the read time or the tag growing in) rather than only zooming the media.
