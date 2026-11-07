# /iro — James-eye review

Reviewed: main, page files at `d3752c2` (Iro rides the shared creative-model template `components/pages/model/Creative.jsx`, also used by Koe, Koma, Mori, Oto and Uta, so most of this applies to them too). Walked moving at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

Verdict: 7/10

First complaint: "The pink film is gorgeous, but the pink has leaked into the labels and chips everywhere. There's no button on the first screen. And on my phone, once the film is gone, nothing moves."

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Moves, yes: Hanzo's own Iro film (pink clouds through a lit frame) plays full-bleed under "Iro" and "Image generation and visual understanding." It sells the mood more than the product, and there is **no ask on the first screen** ("Request access" arrives after the film settles).
2. **One in, one out?** Yes on desktop: the film settles into a card beside "Imagine without limits.", then "Watch an image resolve." runs a live resolve, then "What Iro does" pins the film while capabilities change (01 Image…). **Phone:** after the hero the screens barely move (0.1% or less on most).
3. **A real object in every section?** Yes: film, resolve demo, capability cards, field picker.
4. **One ask, sticky after the hero?** Yes after the hero: "Request access" solid with "Try it in Design" as a link, then the shared ask bar; the header's "Try Hanzo" turns outlined. "Request access" is Hanzo's honest label for a research-preview model.
5. **Every hover and press answers?** The close (×) and hero links answer; a pause control exists for the film.
6. **Overlap, font swap, layout shift?** None; layout shift 0.0001 and 0.013.
7. **Which reference, and is its motion there?** synchronized.studio (card opens into this page, with a close) and apple.com (pinned capability chapters). Both there.
8. **Different from its neighbours?** Yes in film and colour; in layout it is the same template as Koe, Koma, Mori, Oto and Uta.
9. **All 18 parts covered?** See below.
10. **Banned tells?** Yes:
    - UI hue: magenta on the mono labels ("IMAGE · IRO 1", "CAPABILITIES", "01 IMAGE"), the use-case icons and the background washes (`cr-g-iro`). The film may be pink; the interface should not be.
    - Pink mono labels above the section headlines (eyebrows over every h2).
11. **Copy untouched?** Yes: parity 51/51 text, 4/4 links.

## Missing from the 18 parts (PLAN-COMPONENTS 2.1–2.18, measured)
- **2.1 / 2.4:** no ask in the first screen; 0 `data-cta`.
- **2.6 Type floor:** 12 labels under 13px (the 11px "IMAGES" chip, 12px model ids).
- **2.10 Media:** 16 images without width and height.
- **2.11 Mobile:** most screens after the hero are still on the phone.

## Fixes (in `Creative.jsx`, so they reach all six creative models)
1. Keep colour inside the film: labels, chips, icons and washes in ink, white and greys.
2. Put "Request access" (solid) and "Try it in Design" (link) on the first screen under the lede.
3. Drop the mono label above each section headline, or move it under the headline.
4. Give every image its width and height; raise chips and ids to 13px or more.
5. Phone: let the capability film or the resolve demo play as each section reaches mid-screen.
