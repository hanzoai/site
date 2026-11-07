# vercel.com: SPEC

Filmed 7 Nov 2026 (home page). Films: `desktop.mp4` (1470×801, shown at 980 wide) and `phone.mp4` (375×812). Frames: `frames/`. Method and caveats: see `../INDEX.md`. WebGL was off, so the hero's canvas object is missing from the film.

**Why it is in James's family:** it is the cleanest working proof of his rule 7, "colour from the brand, not from boxes". The whole page is black, white and four greys. Type is huge, tight and set in a light weight, so it reads like a logo. There is one filled ask, and it repeats in the sticky header.

**Honest verdict:** a type and palette reference, not a motion reference. The home page has native scroll, no scroll-linked motion and hover that only changes a background. Use it for the system, not for the signature move.

## Frames
| Frame | What it shows |
|---|---|
| `desk-01/02/03` | Arrival. The h1 is in place from the first frame (no font swap). The hero object fades in later (see the timeline) |
| `desk-04` to `desk-09` | The scroll walk. Each section is one big statement plus one product panel (several product images were blocked, so some panels are blank) |
| `phone-p1` vs `phone-p2` | The mono subline under the h1 changes on its own ("For coding agents", then "To ship apps and agents"): time-based motion with no input |
| `phone-p3` | The phone menu: full-height list, filled "Sign Up" pinned under it |

## Measured motion
| Move | Value | Source |
|---|---|---|
| Arrival: hero canvas | opacity 0→1, **1200 ms linear**, starting 1.5 s after load | measured (getAnimations) |
| Arrival: cover over hero | opacity 1→0, **700 ms linear**, at 2.75 s | measured |
| Button hover (all asks) | background only: white → `#f2f2f2`, or `#171717` → `#383838`; **150 ms cubic-bezier(0.4, 0, 0.2, 1)**; settled at 200 ms | measured |
| Nav link hover | colour `#4d4d4d` → `#171717`, **instant (0 ms)** | measured |
| Press | no change on press | measured (a gap: Hanzo must add one) |
| Scroll | **native, not smoothed**: a 400 px wheel step lands within one frame (about 80 ms) | measured (scrollY per frame) |
| Scroll-linked motion on home | none found: no pins, scrubs or reveals in a 5,038 px walk | measured (element sampling every 220 px) |
| Phone logo wall | marquee, transform, **40,000 ms linear** loop | measured |
| Phone menu | items fade in, **150 ms cubic-bezier(0.4, 0, 0.2, 1)** | measured |
| Phone ambient | 1.9% of pixels change in 2.4 s with no input (the rotating subline); desktop 0.1% (static without WebGL) | measured (frame difference) |
| Most-used curves in the bundles | `cubic-bezier(0.32, 0.72, 0, 1)` ×16 (the iOS sheet curve), `(0.4, 0, 0.2, 1)` ×11, `(0.23, 1, 0.32, 1)` ×10, `(0.22, 1, 0.36, 1)` ×6 | from code |
| Most-used durations | 200 ms ×28, 150 ms ×25, 300 ms ×8, 500 ms ×8 | from code |
| Springs in the bundles | stiffness 240 / damping 28 / mass 0.9; 120 / 11 / 1; 300 / 35 | from code |
| Keyframes named in CSS | `letterReveal`, `drawPath`, `reveal`, `fluctuate`, `modal-appear` | from code |
| View Transitions API | `document.startViewTransition` is called | from code |

## Measured layout
| Item | Desktop (1470) | Phone (375) |
|---|---|---|
| h1 | Geist Sans **64/64 px** (line height 1.0), weight 400, tracking −3.84 px (−0.06 em) | 48/56 px, weight 400, −2.88 px (−0.06 em) |
| h2 | 56/56 px, weight 450, −3.36 px (−0.06 em) | n/a |
| Page gutter | 35 px | 24 px |
| Header | 64 px, sticky, transparent | 64 px, sticky |
| Ask (primary) | "Deploy now": 124×40, fully round, `#171717` fill, white 16 px / 500, padding 0 12 px | full width in the menu |
| Ask (secondary) | "Talk to sales": 130×40, round, white fill | same |
| Header asks | 32 px tall, radius 6 px, 14 px / 500; only "Sign Up" is filled | menu button 44×44 |
| Palette | page `#fafafa`, ink `#171717`, quiet text `#4d4d4d`, hover `#f2f2f2`, dark hover `#383838` | same |

## The 5 moves it gives Hanzo
1. **The monochrome token ladder.** Page `#fafafa`, ink `#171717`, quiet text `#4d4d4d`, hover fill `#f2f2f2`, dark hover `#383838`. That is five values and no hue, which is James's rule 7 built. *Suits: the shared system for every page.*
2. **Logo-like display type in a light weight.** h1 64/64 at −0.06 em and weight 400, h2 56/56 at 450; phone 48/56. Big and light, never bold. *Suits: every hero, product and model pages.*
3. **One ask in two weights, repeated in the sticky header.** A filled 40 px round ask plus a white twin of equal size, then a filled 32 px "Sign Up" in the 64 px sticky header. *Suits: home, product, pricing; the header pattern for all pages.*
4. **The rotating mono subline (phone).** One line under the h1 swaps on a timer with no input: ambient time motion that costs no scroll. Use it only where Hanzo's own copy already has a list, since the copy is frozen. *Suits: home and product heroes on phone.*
5. **The sheet curve for anything that rises.** `cubic-bezier(0.32, 0.72, 0, 1)` is the most-used curve in its bundles; pair it with 150–200 ms colour hovers. *Suits: phone menu, DetailSheet, spec drawers.*

## Gaps (do not copy)
- Press does nothing, which breaks James's rule 4 ("every tap answers"). Add translateY(1px) or scale 0.98.
- Hover is background-only. James wants the hover to tell you something.
