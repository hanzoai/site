# /brand — James-eye review

Verdict: 8/10
First complaint: "The top half is lovely, the logo builds itself and the 01, 02, 03 scene is proper. Then Typography and Components go flat. It's a spec table and some boxes, it reads like a docs page."

Walked 7 Nov 2026 16:55 UTC, HEAD 042dd418, at 1470x801 and 375x812 (isMobile, hasTouch). First screen captured at 0.2/1/3/6 s plus a reload, then wheel-scrolled the full page in 160px steps with about 0.65 s dwell. Hovered, pressed and tapped the hero asks, the pause button, the swatches, the White/Black toggle, the weight slider, the component buttons and the email copy. Also checked layout-shift entries, reduced motion (walked in the viewport, not only fullPage) and JS off. `taste.py` OK (2 files), `parity.py /brand` OK (text 76/76, links 4/4).

## What works
- The hero object is the brand itself. The Hanzo mark sits on a construction grid with a tick-ring, breaks into its five pieces and reassembles, and a construction line keeps rotating. Pixel change is about 5% per second through the first 6 s, and it still drifts at idle (0.2%/1.5 s). It is not dead.
- The pinned "Minimal / Elegant / Consistent" stage is one idea per screen. A huge 01, 02 or 03 shares the screen with one object each (the mark, a chrome sphere, a 4x4 mark grid) while the panel changes. That is real one-in-one-out.
- The colour section is a working tool. Swatches widen on hover, the White/Black toggle flips the contrast list with a sliding pill (aria-pressed updates), and the stage goes true black to tell the story. Monochrome only; no hue anywhere.
- The "Aa" weight slider changes the specimen live on desktop drag and on phone keyboard input.
- Asks: "Download Assets" is solid black. On hover it lifts to #2c2c2e, on press it scales to 0.98, and the opacity stays at 1. On desktop the header ask becomes "Download Assets" once you scroll. "Press Kit" is a quiet outline.
- No console errors or page errors at either size, with or without JS. CLS is about 0.0002 (header only), and the h1 box stays put once fonts load. There is no horizontal scroll (scrollWidth equals clientWidth at both sizes). There is no kicker above the h1 or any h2.
- With JS off, every section is legible and fully laid out. With reduced motion, the hero and every section show their final state when walked.

## The 11 answers
1. Yes. The title, the sub and two asks are readable at once, and the mark starts assembling inside 1 s.
2. Through Principles and Colour, yes: a pinned stage, then a black colour scene. From Typography down it becomes a document: a sticky left title beside a long right-hand table, then Components as a grid of boxes.
3. Mostly. The hero mark, the 01-03 objects, the swatches and toggle, the Aa specimen and the asset tiles all count. The Typography table is text rows. Components is live buttons and badges, which is honest but plain.
4. One ask, in Hanzo's words, sits in the header ("Try Hanzo", which becomes "Download Assets" on desktop scroll). Scale has rhythm in the top half: one huge numeral, a medium heading, small body. The lower half is all medium. The only thing floating over content is the shared cookie banner (not counted). On phone it covers about a quarter of the screen until dismissed.
5. Hover and press answer: the asks, the swatches (widen), the type rows (rule darkens), the ghost and primary buttons (background change, no fade) and the toggle. On swatch and email copy I saw no visible "copied" confirmation. Headless clipboard may be blocked, so recheck in a real browser.
6. I found no overlap or clipping at rest at either size. One mid-scroll frame on phone caught the toggle pill partway through its slide, offset from its label; at rest it is aligned. With reduced motion on desktop, the gray strip still sits transformed (translateX -313px) until it is scrolled into view, so it still animates in.
7. The top half is apple.com product-page logic: a pinned scene, huge numerals, the product (the mark) as hero. The construction-grid hero has some osply/hamol restraint. The lower half has no reference motion.
8. Yes. Its hero medium is a self-building logo construction, and its signature is the 01/02/03 pinned stage plus the black colour lab. Unlikely to be confused with a neighbour.
9. Visible parts are covered: skip link, progress bar, sticky header with sound toggle, hero, sections, ask band, contact, footer with ask bar, consent, no-JS, reduced motion. I did not audit the full 18 checklist line by line.
10. No hue, gradient text, Inter, kicker, fading buttons or cursor glow. Borderline: the asset card's three equal logo tiles in a row, and the three gradient tiles (unequal widths, so it passes).
11. Yes. Parity is 76/76 text and 4/4 links.

## Fixes (in order)
1. Give Typography a moment, not a table. Pin the "Aa" specimen and let each row (Heading 1 to Caption) set the specimen's size and weight as it passes, one in, one out, so the table scrubs the object instead of stacking under it.
2. Make Components a stage rather than a box grid. Show one live component at a time (button, then card, then badge) with a real hover and press demo, or at least stagger and scale them so they are not all medium at once.
3. Show a visible copied state (a check plus a tick sound) on swatch copy and on the email copy button, and confirm it in a real browser.
4. Under reduced motion, render the gray strip and other scroll-revealed pieces in their final layout without the transform.
5. Vary the three asset tiles (the active variant larger, or reveal them one by one on hover) so they do not read as three equal boxes.
6. On phone the email copy button wraps onto its own line under the address; keep it inline.

Shared (not counted): the cookie banner floats over content at both sizes, covering a lot of the phone screen until dismissed (`x-cookie`). The dev-server font preload warnings for Zen/ZenMono are not this page's own.
