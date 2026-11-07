# darkroom.engineering: SPEC

Filmed 7 Nov 2026 (home page, two walks). Walk 2 (`desktop.mp4`, `phone.mp4`) stopped short of the bottom and clicked an Activity log row through to `/work/looped`. Walk 1 (`desktop-walk1.mp4`) ran to the very bottom and fell into the site's `/backrooms` easter egg. Frames: `frames/`. Method: `../INDEX.md`. The site uses no WebGL on home: the work pieces are plain videos and they played.

**Why it is in James's family:** they wrote Lenis, the smooth-scroll library behind most award sites, and their own site is the cleanest measurement of that "premium" glide. The h1 reads like a logo: 204 px, line height 0.8, set word by word on an 8-column grid. Every ask answers the hand: hover swaps fill and text and slides the arrow, and press scales to 0.97. The whole site uses one ink on black, which is James's "no colour from boxes" idea done in red.

**Honest verdict:** the best smooth-scroll and press-state reference in the set. Take the glide, the grid-locked type and the ask, but in Hanzo's white and silver. The first screen is dead without input (0.0% change), the header is not sticky, and the page-to-page change is a plain cross-fade.

## Frames
| Frame | What it shows |
|---|---|
| `desk-01/02/03` | Arrival: the h1 is in place from the first frame and nothing moves. A strip of the first film ("Oreo & BTS") peeks in under the fold, with a red sponsor bar at the bottom |
| `desk-04/05` | The pinned film stage: the Oreo & BTS film, then "Looped" (its film counts down 3, 2). The project name sits on a red hairline at mid-screen |
| `desk-06` | The "Ibicash" film, then "What clients say" |
| `desk-07` | Tools: "Satus Lenis Hamo Tempus" next to a red square film |
| `desk-08/09` | Services and client lists, then the Activity log. The row under the resting pointer is filled red |
| `desk-10/11/12` | Card to page: the hovered row ("Looped case study…"), then the whole page dims as it cross-fades |
| `desk-13/14` | `/work/looped`: the case hero is the project's own pixel-art image |
| `desk-w1-footer-29.4s` | Walk 1: the footer, with the "LET'S TALK" ask, three live city clocks that match the filming time, and a scanline "DARKROOM" wordmark |
| `desk-w1-red-panel-rises-30.6s`, `desk-w1-backrooms-page-33.6s` | Walk 1: holding at the bottom fills the screen with a red panel ("You've found the Darkroom backrooms."), then a terminal page loads |
| `phone-p1/p2` | Phone hero: the h1 on 2 lines at 100 px and a full-width "MANIFESTO →" ask. Nothing moves (0.0%) |
| `phone-p3` | Phone menu: stacked dark-red rows, and the burger turns into an X |
| `phone-p4/p5/p6` | The Ibicash film, Satus with a big statement, then the Activity log |

## Measured motion
| Move | Value | Source |
|---|---|---|
| Scroll (wheel) | **smoothed by Lenis 2.0.0-dev.5**. After one 400 px wheel step: first movement at 74 ms, **50% at 173 ms, 90% at 377 ms, 99% at 664 ms** (walk 2: 213 / 433 / 716 ms). Native scroll lands in about 80 ms on the same rig (Vercel) | measured (scrollY every frame) |
| Lenis options | wheel **lerp 0.125** (their wrapper, which matches the measured curve), autoRaf. Touch smooth is **off**, so phones scroll natively. The custom scrollbar drag and the arrow keys (±100 px) use lerp 0.2 | from code |
| Ask hover | fill `#e71419` → black, text black → `#e71419`; **200 ms cubic-bezier(0.23, 1, 0.32, 1)**. The arrow slides **18.4 px** right over 200 ms | measured |
| Ask press | **scale(0.97), 120 ms**, same curve | measured |
| List row hover | row fill clear → `#e71419`, text → black, the text slides **18.4 px** right; **150 ms (0.23, 1, 0.32, 1)**; an arrow icon appears instantly | measured |
| Pinned film stage | three full-bleed films (1470×801) are pinned for **~1,540 px** of scroll (650 → 2,187). The project title (h2) stays pinned for ~1,980 px at 354 px from the top, and the next film rises from below | measured (sampled every 220 px) |
| Bottom bar | slides out (translateY 100%, opacity 0) in **300 ms** once you leave the top, and comes back at the top | measured |
| Header | absolute (not sticky); slides up out (translateY −100%) in **350 ms** when the footer arrives | measured |
| Footer | stays pinned for ~805 px while the page above scrolls off it (curtain reveal) | measured (walk 1) |
| End of page | holding at the bottom: a red panel wipes up (clip-path inset 100% → 0, **1,200 ms linear**). The route then changes to `/backrooms` with a 200 ms cross-fade, and the panel wipes off upward in **1,000 ms linear** | measured (walk 1) |
| Card to page (Activity row → `/work/looped`) | the URL changes about 190 ms after the click. The screen then holds for about 0.5 s while no frames are drawn, followed by a View Transition **cross-fade, 200–250 ms linear** | measured |
| Phone menu | the burger's bars go from translateY(±400%) to rotate(±45°) in **250 ms (0.23, 1, 0.32, 1)** | measured |
| Ambient (no input, 2.4 s) | **0.0%** of pixels change: desktop first screen, mid page and phone first screen. The work films do play once you scroll to them (the Looped countdown moves from 3 to 2 in walk 1) | measured (frame difference) |
| Curves in bundles | `(0.23, 1, 0.32, 1)` on every transition measured. The full set of classic Penner curves is present once each. GSAP: `power3.inOut` ×11, `power2.out` ×2, `expo.out` ×1 | from code |
| CSS durations | 200 ms ×3, then 120, 150, 250, 300, 350 ms | from code |
| View Transitions | `startViewTransition` ×2, `::view-transition-old/new` rules | from code |

## Measured layout
| Item | Desktop (1470) | Phone (375) |
|---|---|---|
| h1 | "therma" **204/163 px (line height 0.8)**, weight 400, −10.2 px (−0.05 em), caps. Its 4 words sit on an 8-column grid across 1,437 px | 100/80 px, −5 px, 2 lines |
| Scale | type tracks the viewport width: 204 px and 14.29 px at 1470 are 200 and 14 on a 1440 base | n/a |
| Film titles (h2) | 122.5/98 px (0.8), weight 700, −6.1 px | n/a |
| Body | mono **14.29/17.15 px, weight 200**, caps, `#e71419` | 12/15 px |
| Footer wordmark | "sauce" 256/256 px | n/a |
| Grid and gutter | 8 columns of 165.4 px; gutter 16 px | gutter 8 px |
| Header | 22 px, absolute; the nav chips are filled `#390205` | 28 px, burger |
| Ask | "MANIFESTO →": **165×22** (exactly one grid column), radius 0, `#e71419` fill, black mono 14.29 px / 200 caps, padding 4×8 px | 267×28, full width |
| Footer ask | "LET'S TALK →" 165×45 | n/a |
| Palette | page `#000000`, ink and fill `#e71419`, chip `#390205`: one hue | same |
| Contrast | red body text on black is about **4.5:1** at weight 200 | same |

## The 5 moves it gives Hanzo
1. **The measured glide.** Lenis with wheel lerp 0.125: a 400 px step reaches 50% in ~173 ms, 90% in ~377 ms and 99% in ~664 ms. Touch stays native, and the arrow keys (±100 px) and scrollbar drag use lerp 0.2. Use one setting for the whole site. *Suits: the shared system for every page; most felt on long story pages (home, model launch, customers).*
2. **The grid-locked logo h1.** 200 px on a 1440 base, line height 0.8, −0.05 em, caps, with each word dropped into a column of an 8-column grid so the line fills the width; phone 100/80 on 2 lines. Set it in Hanzo white, not red. *Suits: home hero, model launch hero, careers.*
3. **The inverting ask that presses.** Fill and text swap in 200 ms (0.23, 1, 0.32, 1), the arrow slides 18.4 px, and press scales to 0.97 in 120 ms. The ask is exactly one grid column wide (165 px). Hover changes three things, and none of them is opacity. *Suits: every ask and the sticky bar, in black and white.*
4. **The pinned film stage.** Full-bleed films stay pinned for ~1,540 px while the name rides a hairline at mid-screen and the next film rises from below: three films in about two screens. *Suits: customers, model pages (one model output per film), solutions.*
5. **The scanning list.** Rows fill in 150 ms, the text slides 18.4 px and an arrow appears. With the pointer resting while the page scrolls, rows light up one after another like a ticker. The live city clocks in the footer add time-based motion. *Suits: press, changelog and docs-style pages, the careers job list, investor updates.*

## Gaps (do not copy)
- One red hue is used as UI ink and fill everywhere. That breaks rule 7 (no brand hues in the UI), so swap it for white and silver.
- Red mono at weight 200 on black is only about 4.5:1, which is close to James's "low-contrast dark mode".
- The first screen is static (0.0% change) and has no headline cut-in. That fails James-eye question 1.
- The header is absolute and slides away, so there is no sticky ask (rule 5).
- Holding at the bottom of the page sends you to another page (`/backrooms`). Never hijack the end of a Hanzo page.
- Card to page is a stall of about 0.5 s followed by a plain cross-fade, not a card that opens into its hero.
- The service, client and log lists are long walls of caps text: clutter.
