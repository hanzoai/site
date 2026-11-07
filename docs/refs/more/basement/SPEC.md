# basement.studio: SPEC

Filmed 7 Nov 2026 (home page, then a click into the "Vercel Ship" project card). Films: `desktop.mp4` and `phone.mp4`. Frames: `frames/`. Method: `../INDEX.md`. Showcase and logo images come from `cdn.sanity.io` (blocked, 36 requests) and project videos from Mux (blocked, 8), so the logo wall and some cards show broken images. A full-screen fixed canvas (1470×801, pointer-events none) did not render with WebGL off, so the live 3D layer is missing from the film.

**Why it is in James's family:** big, tight display type that reads like a logo (87 px at line height 0.90), a black stage, real work on every screen, and pointer details that are playful but small (a blink, a drifting hatch). It also has the idea most native to an AI company in this lab: a fixed **HUMAN | MACHINE** switch that opens a plain-text mirror of the site for AI agents.

**Honest verdict:** a strong reference for type, the logo wall and the human/machine idea. Its hover language is orange with a text glow, and its card-to-page is a hard cut, so take the structure and timings, not the colours.

## Frames
| Frame | What it shows |
|---|---|
| `desk-01` | Black; only the header and the "HUMAN / MACHINE" pill at the bottom centre |
| `desk-02/03` | The h1 in three lines, a short subline, then "Trusted by Visionaries" over a 6×2 grid of logo tiles (images blocked) |
| `desk-04` to `desk-06` | "Featured Projects" sticks at the top; project rows run under it: media left, a short text, the name right (Vercel Ship, Daylight, KidSuper, MrBeast) |
| `desk-07` | "Capabilities": one 76 px statement, then four service columns |
| `desk-08/09` | Contact line with the email in big type, a huge "BSMNT.26" wordmark, the footer menu |
| `desk-10` | The pointer rests on the Vercel Ship card; a mono "[View Project]" tag sits on the media |
| `desk-11` | The project page: a metadata column at left (Client, Year, Type, Link, text, "More Projects") and a big blurred placeholder at right |
| `desk-12` to `desk-14` | The image has resolved to the sharp media |
| `phone-p1/p2` | Phone hero: the h1 in five lines at 46 px, then the logo grid |
| `phone-p3` | Phone menu: a full-screen list in big type, "Home" in orange, socials at the bottom, "Close ×" top right |
| `phone-p4` to `p6` | Project cards, the capability columns, then contact and the "BSMNT" wordmark |

## Measured motion
| Move | Value | Source |
|---|---|---|
| Arrival | text spans fade 0 → 1, **200 ms ease-out**, at 0.76 s and 0.90 s | measured (getAnimations) |
| Nav link hover | colour `#e6e6e6` → `#ff4d00`, **60 ms**; then a "blink": opacity 100 → 50 → 100 → 50 → 100 over **300 ms after a 60 ms delay**; a 1 px underline appears and a 30 px text glow | measured (colour, blink) + from code (keyframes, glow) |
| Press | nothing changes; `:active` only cancels the blink | measured + from code |
| Logo wall hover | the hovered tile fades in a hatch (white lines at 10%, 64 px tile) in **300 ms (0.4, 0, 0.2, 1)**; the hatch drifts 64 px per **6,000 ms linear** loop; tiles dim 1 → 0.5 in **200 ms ease-in-out** | measured (pointer sweep) + from code |
| Phone logo wall (idle) | each tile cross-fades two logos on a **16,000 ms linear** loop (39 seen) | measured |
| Project card hover | the image pulses opacity 1 → 0.75 → 1 on a **1,000 ms** loop; group-hover text turns orange and underlines | measured (13 seen) + from code |
| Featured projects | heading pinned at the top (0 px) and rows pinned at 165 px, both for **1,320 px** of scroll | measured (sampling every 220 px) |
| Card to page | the route changes **681 ms** after the pointer set off (that includes the walk's 500 ms hover pause); running animations drop 38 → 0 at that moment: a hard cut, no transition; the media shows blurred first and is sharp by +1.2 s | measured |
| Scroll | native: a 400 px wheel step lands by the 79 ms sample | measured (scrollY per frame) |
| Phone menu | two bars turn ±45° into an X and shrink to 83.3% width, **300 ms (0.4, 0, 0.2, 1)**; items fade in 300 ms ease-out, **16.7 ms apart** from a 200 ms delay; footer 300 ms at 400 ms, `(0.25, 0.1, 0.35, 1)` | measured |
| MACHINE view | links to `/ai/home`: a plain-text, ASCII mirror "for AI agents, crawlers, and humans who prefer it raw"; it reveals in **1.4 s steps(32)** and flickers in **0.18 s steps(3)** | probe + from code |
| Ambient (no input, 2.4 s) | desktop 0% top and mid (canvas off); phone first screen 20.3% | measured (frame difference) |
| Bundles | curves `(0.4, 0, 0.2, 1)` ×14, `(0.16, 1, 0.3, 1)` ×2; durations 0.15 s ×13; springs 100/10, 500/25, 550/0; `startViewTransition` present; keyframes `marquee-translate`, `machine-reveal`, `machine-flicker` | from code |

## Measured layout
| Item | Desktop (1470) | Phone (375) |
|---|---|---|
| h1 | Geist **87/78 px** (line height 0.90), weight 600, −3.48 px (−0.04 em), 1,317 px wide | 46/39.2 px (0.85), −1.84 px |
| Section statements | 76/68 px (0.89), 600, −3.04 px (−0.04 em) | n/a |
| Body | 13/16 px, weight 600, `#e6e6e6` | 15/16 px |
| Gutter | 16 px | 16 px |
| Header | 36 px, fixed, transparent | 36 px, fixed, solid black |
| Header ask | "Contact Us": a 12 px / 600 text link, 64×16, no fill | "Menu" |
| HUMAN / MACHINE pill | 144×30, fully round, black, 1 px `#2e2e2e` border, fixed 16 px above the bottom; Geist Mono 13 px / 600, segments padded 6×12 px; the active side in `#ff4d00` | same, 12 px |
| Palette | `#000`, text `#e6e6e6`, hairline `#2e2e2e`, accent `#ff4d00` | same |

## The 5 moves it gives Hanzo
1. **The HUMAN | MACHINE switch.** A 144×30 mono pill, fixed at the bottom centre, that opens a plain-text mirror of the same page for agents (reveal 1.4 s steps(32), flicker 0.18 s steps(3)). It mirrors existing copy, so no new words are needed. *Suits: docs-style pages, Dev/CLI, model pages, home.*
2. **Display type set almost solid.** h1 87/78 (0.90) at −0.04 em; statements 76/68; phone 46/39.2 (0.85). *Suits: home, solutions, careers, press.*
3. **A logo wall that answers the pointer and idles.** On hover, a drifting hatch (64 px, 10% white, 6 s loop, 300 ms in) while the other tiles dim to 0.5 in 200 ms; on phone, tiles cross-fade on a 16 s loop with no input. *Suits: customers, investors, the proof band on home.*
4. **Sticky heading over stacked rows.** Heading pinned at 0 and rows at 165 px for 1,320 px; each row is media left, one short line, name right, opening into a page with a metadata column. *Suits: customers and case studies, press, a model archive.*
5. **The typed phone menu.** Bars to an X in 300 ms `(0.4, 0, 0.2, 1)`, items in 300 ms, 16.7 ms apart, as one big full-screen list. *Suits: the shared phone menu.*

## Gaps (do not copy)
- Orange `#ff4d00` on hover, the active nav item and the active "HUMAN": a brand hue. Hanzo uses white or silver.
- The hover adds a 30 px text glow (James bans glows).
- The blink is opacity-only (100 → 50). Keep it only beside a real change (the underline, a colour step in grey).
- No press state on links.
- Card to page is a hard cut with nothing shared between card and page. Use synchronized.studio's open instead.
- The canvas layer and most images did not render here, so their effect is unjudged.
