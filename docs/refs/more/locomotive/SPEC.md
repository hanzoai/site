# locomotive.ca: SPEC

Filmed 7 Nov 2026 (`/en` home page, then a click on the "Lightship" project row). Films: `desktop.mp4` and `phone.mp4`. Frames: `frames/`. Method: `../INDEX.md`.

**Filming note:** the live site does not load at all without WebGL. The hero ring's WebGL renderer throws, the preloader never clears, and the first walk filmed only the logo. For this film, a local copy of `app.js` was served with one change: the ring's start-up is wrapped in try/catch, and its resize, scroll and launch calls are skipped when it is missing. Everything else is the live site. The hero showreel (Vimeo) is blocked, so its poster shows. The two WebGL scenes, the hero ring and the 3D team member, did not render and are described from code.

**Why it is in James's family:** this is editorial type done with restraint. One serif display face sits on a white page with 2 px black rules and a plain grotesk for text. The project list is text only, and hovering a name opens a small picture between its words: a hover that shows you something. Text "shuffles" on hover and on page arrival, and images resolve from big pixels. Scroll is Locomotive Scroll v5 on Lenis.

**Honest verdict:** the best reference for "hover shows a preview" and for an editorial list. Its default Lenis glide (lerp 0.1) is a little longer than Darkroom's. It is weak on asks: there is no filled button and no press state anywhere. Emojis sit in the h1, the menu is a blue box, and the site breaks completely without WebGL.

## Frames
| Frame | What it shows |
|---|---|
| `desk-01` | Preloader: the logo on black |
| `desk-02` | Preloader: lines of copy type themselves in through random characters ("Digital-First Design", "Based in Montréal") while the logo letters drop out |
| `desk-03` | Hero: the poster of the blocked showreel (a red-lit portrait). The h1 is white with a "difference" blend, so it reads cyan on red. The header is one line: "Work, Agency, Careers, Store" and "Let's talk" |
| `desk-04` | White page: "Featured work" over a rule, then "Lightship" at 112 px between rules |
| `desk-05` | The project list: the hovered "Scout Motors" has opened a picture between its two words. Then "All Work" and the 70 px serif statement |
| `desk-06/07` | Agency and Careers rows with arrows; a black square where the WebGL team member should be; Articles and Culture lists |
| `desk-08/09` | Store items, the footer menu, and the address set at 70 px with inline pictograms |
| `desk-10/11` | Card to page: on the Lightship case page the words arrive scrambled ("iLightshp", "oWrk, gAency") and settle by +0.85 s |
| `desk-12/13/14` | The case hero image arrives as big pixels and is sharp by +1.2 to +1.8 s |
| `phone-p1/p2` | Phone: the preloader, then the hero poster while it is still resolving from pixels |
| `phone-p3` | Phone menu: full-screen blue `#312DFB` with the links in the serif at 12vw (45 px, from code) |
| `phone-p4/p5/p6` | Project list, about text with the Agency and Careers rows, then Store |

## Measured motion
| Move | Value | Source |
|---|---|---|
| Scroll | Locomotive Scroll v5 on **Lenis 1.1.9 with default options** (lerp 0.1, smooth wheel on, touch sync off, so phones scroll natively), driven by the GSAP ticker | from code |
| 400 px wheel step | first movement at 49 ms, **50% at 170 ms, 90% at 422 ms, 99% at 784 ms** (first walk, under the preloader: 167 / 416 / 786 ms). This matches lerp 0.1 | measured (scrollY every frame) |
| Preloader | logo scale 0.9 → 1 with a fade, **900 ms linear**. Each copy letter cycles 5 random glyphs 16 ms apart, letters start 10 ms apart and lines 250 ms apart. The cover fades out in **900 ms (0.215, 0.61, 0.355, 1)** at 3.1 s. Repeat visits get a short version | measured + from code |
| Hero on scroll | the media is fixed behind the page. Over the second half of the hero it lifts **25vh** and a black layer rises to **75%** | from code; the fixed layer was measured at −200 px (25% of 801) |
| Header | fixed, 60 px, blend "difference" only while it is over the hero. A white bar fades in after the hero (**200 ms**, (0.215, 0.61, 0.355, 1)). Scrolling down slides it up by its own height, and scrolling up brings it back (**200 ms**, same curve) | measured (timings) + from code (rules) |
| Project row hover | a picture opens between the words: width 0 → **168 px (1.5 em) in 450 ms (0.23, 1, 0.32, 1)**, closing in **200 ms**. Turned off on touch | measured + from code |
| Link hover | an underline appears **instantly**, and the letters shuffle **4 times in 250 ms**. 65 elements on home have this | measured (underline) + from code (shuffle) |
| Press | **no change** on press on any probed link | measured |
| Card to page (Lightship row) | the URL changes about 110 ms after the click. The old page waits **250 ms**; the new page jumps to the top and its visible words shuffle **4 times in 250 ms**, then settle | measured + from code |
| Image arrival | a canvas redraws the image at **8, 16, 32, 48, 96 and 128 blocks wide, 100 ms apart**, then shows the real image | from code; seen in `desk-12/13` |
| "All Work" label | an emoji flashes in and out on a **2,000 ms linear** loop | measured |
| Team object | 27 rigged 3D team members. One is picked at random when the section enters; it idles and turns about once every 5.2 s, and a tap swaps in another person | from code (did not render: WebGL off) |
| Hero ring | a WebGL ring whose spin speeds up from 2 to 20 as the hero scrolls away | from code (did not render) |
| Phone menu | opens **instantly**, with no transition | measured |
| Ambient (no input, 2.4 s) | **0.0%** of pixels change on the first screen and mid page, on desktop and phone (the showreel is blocked) | measured (frame difference) |
| Curves and durations | `(0.215, 0.61, 0.355, 1)` ×43, `(0.23, 1, 0.32, 1)` ×9. CSS: 300 ms ×26, 150 ms ×16, 250 ms ×11. GSAP: `power1.inOut` ×12, `power4.out` ×4 | from code |

## Measured layout
| Item | Desktop (1470) | Phone (375) |
|---|---|---|
| h1 | LocomotiveNew (upright serif) **70/77 px (1.1)**, weight 400, white with blend "difference"; 2 lines across 1,390 px | 36/39.6 px |
| Project list | LocomotiveNew **112.3/112.3 px (1.0)**, centred, 154 px rows with a 2 px black top rule | n/a |
| Statement, "Extras", address | 70/77 px serif | n/a |
| Text | Helvetica Now Display **26/31.2 px**, black; base size 15 px | 18/21.6 px |
| Grid | 12 columns, 20 px gutter, 40 px side margin; rules 2 px solid | 20 px margin |
| Header | 60 px, fixed; 26 px links in one comma-separated line; "Let's talk" text link on the right | "Menu" text toggle |
| Asks | no filled button. "Let's talk" is a text link; row asks ("Agency →") are 333×48 with a 2 px top rule, 26 px text | same rows, full width |
| Palette | page `#ffffff`, ink `#000000`, menu `#312DFB`; otherwise colour comes from media | same |

## The 5 moves it gives Hanzo
1. **The preview list.** Names at 112/112 px centred between 2 px rules in 154 px rows. Hover opens a picture between the words, width 0 → 1.5 em (168 px) in 450 ms (0.23, 1, 0.32, 1), closing in 200 ms, and it is off on touch. The row height never changes; only the words part. *Suits: customers, the model list, solutions, the careers job list, press.*
2. **The letter shuffle.** On arrival, the new page's visible words shuffle 4 times in 250 ms and settle; links do the same on hover. The copy always ends unchanged. *Suits: the shared header and nav; the page change on docs-style pages and model launch.*
3. **Pixel-resolve images.** Each image arrives at 8, 16, 32, 48, 96, then 128 blocks wide, 100 ms apart (about 0.5 s), then sharp. It reads like a render finishing. *Suits: model pages and model launch (Hanzo model imagery), customers, press.*
4. **The parting hero.** The hero media stays fixed behind the page. Over the second half of the hero it lifts 25vh and darkens, while the title keeps its contrast through blend "difference". *Suits: home and product heroes with Hanzo's own film (keep the darkening to the scroll-out only).*
5. **The live team member.** One of 27 rigged 3D portraits is picked at random when the section enters; it idles, turns about once every 5.2 s, and a tap swaps in another person. This is the "one 3D moment" James allows, but it must fail soft without WebGL. *Suits: team, careers.*

## Gaps (do not copy)
- Emojis in the h1 (🔶, 🍺🔞 hidden from screen readers and drawn by the font as pictograms), plus an emoji that flashes on a 2 s loop in "All Work". This is James's "emojis in headings".
- The blue `#312DFB` menu, and the title that turns cyan through the blend, are colour from boxes, not from media (rule 7).
- No press state anywhere, and no solid ask: "Let's talk" is a text link. That breaks rules 4 and 5.
- The h1 is 70 px at line height 1.1, below James's display scale. Use the 112/112 list size for heroes instead.
- A 3.1 s preloader stands before any content, and without WebGL the page never loads. Every Hanzo 3D moment needs a fallback.
- The bundle includes a pointer image trail that spawns a picture every 80 px of pointer travel. It is a cousin of the custom cursor and is not used on home.
- The phone menu opens instantly, with no transition.
