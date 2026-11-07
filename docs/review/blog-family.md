# /blog/* (template) — James-eye review

Reviewed: main, page files at `e341b54`. Members walked: `/blog/pareto-frontier` and `/blog/kai-decision-models`, moving, at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

Note (7 Nov 14:12): a hydration error seen in the first walks came from the shared shell and is gone on main; it is not counted against this page.

Verdict: 6/10

First complaint: "I open the post and it's a big title on a white page, and then nothing. The picture and the good stuff only start when I scroll."

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** The title cuts in by line mask within the first second. After that the **desktop first screen is completely still** (0% change over 4 s on both members): display title, the lede on the right, a mono byline. The plate with Hanzo's film (the Enso ring, Kai's strands) is below the fold. On the phone the plate peeks at the bottom and moves a little.
2. **One in, one out?** Yes once you scroll: the plate grows from a card to full bleed, then each chapter opens with its number while the reading rail on the left hands "01 / 04" to "02 / 04" and counts "3 min left" down to "Finished". That rail is the best idea on the page.
3. **A real object in every section?** Plate and code blocks, yes. The chapters are paragraphs beside the rail; for an article that is fair.
4. **One ask, sticky after the hero?** Yes on desktop: a floating pill carries the post's own ask ("Hanzo Gen", "How to use Kai") after the hero. On the phone the same pill sits beside the header's solid "Try Hanzo", so two solid buttons show.
5. **Every hover and press answers?** The back link and the next-post rows answer. The commit says press states were added; they were not caught on the rows tested.
6. **Overlap, font swap, layout shift?** No overlap; layout shift 0.03 or less.
7. **Which reference, and is its motion there?** osply / hamol editorial: the display title, 8/4 split and reading rail are there. The synchronized.studio card-opens-into-page is at the end (next posts).
8. **Different from its neighbours?** Yes. Each post has its own film on the plate.
9. **All 18 parts covered?** See below. `docs/coverage/blog-family.md` exists.
10. **Banned tells?** No eyebrow over the h1 any more (fixed). Code blocks use pink, mint and lavender tokens, which is the only colour on the page not from Hanzo's media; minor, but JAMES.md says 0 UI hues.
11. **Copy untouched?** Yes: parity 77/77 and 110/110 text, 8/8 and 4/4 links.

## Missing from the 18 parts (PLAN-COMPONENTS 2.1–2.18, measured)
- **2.3 First impression:** the hero object (the plate) is below the fold on desktop; the first screen does not move after arrival.
- **2.10 Media:** the plate's film is one raw `<video>`, not through a shared film part; no pause control.
- **2.4:** 0 `data-cta`.

## Fixes
1. Bring the plate into the first screen on desktop: let its top edge (with the film already playing) sit inside 801px under the title, the way the phone already peeks it.
2. On the phone, make the post's ask the only solid button (outline or swap the header's "Try Hanzo").
3. Set code in greys (weight and alpha for tokens) or confirm with James that syntax colour is allowed.
4. Add a press state to the next-post rows and the back link.
