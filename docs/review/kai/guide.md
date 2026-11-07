# /kai/guide — James-eye review

Verdict: 7/10
First complaint: "It's a black box, then another black box, then another. Five dark slabs and the same curl twice in a row. That's one tone and a repeat, and in between it's white space where nothing happens."

Walked 7 Nov 2026 on the dev server at 1470x801 and 375x812. I scrolled the whole page at both sizes, with every scroll stop captured twice 1.2 s apart (11 desktop stops, 16 phone stops), plus first frames at 0, 1000 and 3000 ms and the video. I hovered 14 controls and clicked 13. I also ran my own probes: the h1 transform sampled every 100 ms, 2 s frame hashes per section, row and chip hovers, a press on the primary, the code tabs and the five limit buttons, reduced motion, JS off, a 70-stop Tab crawl, the phone header ask after the hero, `parity.py` and `taste.py`.

Frames: [the curl again, as the second dark slab](guide/d-curl-again.jpg) · [about 300 px of dead white before the black room](guide/d-gap-before-recipes.jpg) · [phone first screen: two solid fills and the red "1 Issue" badge](guide/p-first-screen.jpg)

## What works
- **The hero is alive inside 1 s, with no input.** The h1 cuts in by line mask. The transform starts at about 550 ms after commit and reaches 0 at about 1.2 s, with the lines 60 ms apart and the right easing. The terminal starts typing the guide's own curl at about 1 s, streams the response shape back, then rests. A pause/replay control sits in its bar, and the box never resizes. CLS is 0.0026 on desktop and 0.0069 on phone.
- **The request checker (the "Beyond") is the best thing on the page.** It is a real, useful object. Picking Model, Questions, State, Time or Price loads that case: the ruler moves to 2,000 or 3,982 tokens and the verdict changes from 200 to 422. Its verdict box holds the tallest answer, so nothing below it jumps. The rulers glide at 300 ms on ease-emphasis, and the chips hover-fill.
- **Scale has rhythm.** The h1 is 52px/497 (44px on phone), section heads are 26px, the benchmark figures are about 64px, and captions are 12px Zen Mono. In the benchmark the Kai-1.4 figure is in ink and Jev is in grey on a zero-based bar, as the rules ask.
- **The Jev diff is a good object.** The minus/plus lines arm in sequence and the changed tokens are highlighted. It explains "change the URL, the key and the model" without a sentence.
- **Reduced motion and JS off both work.** Reduced motion shows the final terminal at once, with `getAnimations()` empty after 3 s. With JS off the whole request is printed and the h1 is legible.
- **Rules that pass.** There is no horizontal overflow at either size, `parity.py` gives text 184/184 and links 7/7, and `taste.py` passes. Press is scale 0.97. The Tab crawl has 70 stops, none invisible.

## The 11 answers
1. **Does it sell in 5 s, and does something move within 1 s?** Mostly yes. The h1, lede, ask and a terminal typing a real request are on the first screen by 1.2 s. Against it: about 160px of empty headroom sits above the content. The h1 baseline lands at about 47% of the viewport (the brief says about 38%). The at-rest terminal is a dark slab that swallows the right two-thirds of the screen.
2. **One thing in, one thing out, or a document?** It is half a document. 5 of 11 desktop stops and 9 of 16 phone stops are still at idle. Frame hashes over 2 s are 1 distinct for `.kg-types`, `.kg-recipes` and `.kg-jev`, and 3 for `.kg-limits`. The question-type glyphs play once and stop. Between sections there are about 250 to 300px bands of pure white with nothing in them (desktop stops 01, 05 and 07). The recipes room is a static list.
3. **Does every section hold a real visual object?** Most do: the terminal, the glyph spec sheet, the code tabs, the checker, the diff and the bench bars. The exception is the black recipes room, which is six `recipes::x` names, each with an explaining sentence. That is a text list in a black box, not an object.
4. **One ask in the header, nothing floating, scale rhythm?**
   - **Desktop:** yes. The header ask swaps from "Try Hanzo" to "Get an API key" once the hero ask leaves view. Nothing floats over content apart from the shared cookie card.
   - **Phone:** the header says "Try Hanzo" (solid) right next to the hero's solid "Get an API key". That is two solid fills on the first screen, and the header never switches to the page's ask, even at y=2500 (shared chrome, noted only).
   - **Black room:** the white "Read the Recipes Guide" pill is a second solid fill in the same viewport as the header's solid ask.
   - **Scale:** the rhythm is good (see What works).
5. **Does every hover and press answer, with no jumps?** On desktop, 11 of 14 hovers changed style:
   - The recipe rows fill by clip-path.
   - The limit buttons ink up.
   - The rulers' thumbs scale on hover.
   - The primary darkens and presses to 0.97.

   The question-type rows (`.kg-rows li`) have no hover at all. "Read the reference" changes only its underline. "Time" and "Price" load the same checker case (800 tokens, 200), so pressing Price shows no new answer. The recorder's "dead" clicks (TypeScript, Price, kai-1.4) were already-selected states: I re-clicked them and all respond. On phone, hover is n/a; the taps work.
6. **Overlaps, a font swap or layout shift?** There is no overlap or font swap at either size, and CLS is under 0.01. However, phone shows the red Next "1 Issue" badge, from a hydration mismatch. Its diff names the two `<input type="range">` in the Checker (`aria-label="State tokens"` and `"Questions"`, at KaiGuide.jsx:225 and :234) as well as the shared FooterHTML. The footer part is excused; the Checker part counts.
7. **Which reference, and is its motion there?** It feels like a developer docs page, close to motion.dev's examples, through the typewriter and the scrubbed rulers. Nothing from apple.com (no pinned scene where one panel changes) and nothing from osply or hamol (no editorial asymmetry; it is the same 5/8 split in every section). The diff's sequential arm is the closest thing to an authored moment after the hero.
8. **Different from its neighbours?** Yes. /kai's signature is a decision tree resolving. This page has a typewriter terminal hero and a checker, which no other page uses.
9. **Are all 18 parts covered?** Not fully. Present:
   - the header comment, with Persona, Goal, CTA, Metric, Signature and Beyond;
   - one h1 in server HTML, and a breadcrumb;
   - kit `Cta`, `Tabs` and `CodeBlock`;
   - `data-cta` on every primary and `data-thumb` on the hero;
   - a terminal pause control;
   - JS-off and reduced-motion states.

   Missing or weak:
   - **No closing `Band`.** The page ends on a bare CTA pair under a hairline, with no statement in the page's words.
   - **No proof strip before the Band.** The benchmark sits inside the Jev section.
   - **The h1 holds a `<noscript><style>`.** Its textContent therefore includes CSS (seen by the recorder), which hurts accessible-name and SEO tooling. Move the noscript out of the h1.
10. **Any banned tells?** No hue, gradient text or pill above a headline (the "HANZO DECISION MODEL · 0 OUTPUT TOKENS" eyebrow sits below the h1, as allowed). There are two near-tells:
    - **Dark rooms:** four black or graphite surfaces sit in `<main>` (hero terminal 557px, code block 680px, black room 877px, diff 293px). With the checker card there are five, against a cap of "at most 2 black or graphite rooms per page, never back to back". The terminal, code block and checker run back to back in sections 1 to 3.
    - **Explaining sentences:** an explaining sentence under every recipe row.
11. **Is the copy untouched?** Yes, parity shows 0 missing (text 184/184, links 7/7). One note: the hero terminal types the same curl request that "One request, three questions" prints again two sections later. The words are Hanzo's, but showing the same block twice is a design repeat.

## Fixes (in order)
1. **Break the black run.** Make the code tabs section (`.kg-call`, KaiGuide.jsx/CSS) a Paper or Quiet room. Put the `CodeBlock` on `#f5f5f5` with ink text, or show only the *response* half there, since the hero already typed the request. Then the page has two dark moments, the hero terminal and the recipes room, and they are not back to back. Restyle the checker (`.kg-check`) and the diff (`.kg-jev-d`) as light surfaces (Quiet `#f5f5f5`, ink type, hairlines), so the black room is the only full-dark room after the hero.
2. **Stop showing the curl twice.** In `.kg-call`, open on the Python or TypeScript tab, or collapse the curl tab to its first 4 lines with "same request as above". The hero owns the curl. Copy stays the same; only the presentation changes.
3. **Give the recipes room an object and some life.** Turn the six `.kg-rec li` into a rail or a pinned stage where one recipe is in focus. Show its name large and its line beneath, and switch the focused recipe on scroll or hover. The other names sit small and grey. Then the room is not six explaining sentences in a column, and the second solid (the white "Read the Recipes Guide" pill) can drop to the quiet `Cta` variant.
4. **Fix the Checker's hydration mismatch** (the phone "1 Issue" badge). The SSR `<input type="range">` at KaiGuide.jsx:225 and :234 hydrates with a differing `style` attribute. Make both inputs render identically on server and client: set no style from any client-only path, and check that nothing in KaiGuide.css or a script writes inline style before hydration. Then confirm the badge is gone at 375x812.
5. **Add idle life to the still screens.**
   - Let the three question-type glyphs (`.kg-glyph`) loop slowly while in view (choice bars re-weighting, score dot stepping, noul thumb tipping) and pause when out of view and under reduced motion.
   - Give `.kg-rows li` a row hover fill like the recipe rows have.
   - That makes the types section, now 1 distinct frame in 2 s, alive.
6. **Close properly.** Replace the bare CTA pair under a hairline (`kai-guide.close`) with a `Band`: one line in the page's own words, then the solid "Get an API key" and the reference link. Lift the 84.4% / 76.6% figures into the proof strip just before it.
7. **Tighten the hero.** Cut the empty band above the hero so the h1 baseline sits near 38% of 100svh rather than about 47%, and let the next section peek 56px. Move the `<noscript><style>` out of the `<h1>` (KaiGuide.jsx near line 362) into the section.
8. **Make "Price" answer.** It loads the same 800-token case as "Time". Give it its own checker case, or highlight the cost line (`.kg-cost`) when Price is the active limit, so the press shows something new.
9. **Shared chrome (request, do not edit).** On phone the header keeps a solid "Try Hanzo" beside the hero's solid "Get an API key", and it never swaps to the page's ask after the hero. Write `docs/requests/kai-guide.md` asking the sticky-ask owner to apply the desktop swap at 375 too.
