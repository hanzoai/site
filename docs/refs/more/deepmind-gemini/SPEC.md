# deepmind.google/models/gemini: SPEC

Filmed 7 Nov 2026 (the Gemini 4 model page). Films: `desktop.mp4` (1470×801, shown at 980 wide) and `phone.mp4` (375×812). Frames: `frames/`. Method: `../INDEX.md`. The page's films come from `storage.googleapis.com`, which is blocked here, so every video shows black or its poster. The hero is a still image, so it is filmed as it really is.

**Why it is in James's family:** it tells a model as a story in a plain order: the name alone, one sentence and a film, the news, the proof table, real voices, safety, then where to try it. The h1 is just "Gemini 4" at 98 px with nothing above it. Proof is quiet: one table, with the model's own column lit and the methodology linked under it.

**Honest verdict:** a story-order and proof-table reference, not a motion reference. With no input nothing moves (0% of pixels), the only scroll effect is one sticky card, and hover is a 4% tint. Benchmarks are a table, not hero figures. Take the hero-figure scale from anthropic.com.

## Frames
| Frame | What it shows |
|---|---|
| `desk-01/02/03` | Arrival: "Gemini 4" centred on a blue cloud image scattered with tiny "4" glyphs; two glass asks top right. Nothing changes between frames. The three hero asks (y 717) sit under the cookie bar (top 703) at 1470×801 |
| `desk-04` | The foot of the statement film (black: video host blocked) with round mute and pause controls, then "Announcements": a big featured post left, a list with thumbnails right |
| `desk-05` | The featured post and its crystal image hold still while the right-hand list scrolls past it |
| `desk-06` | The benchmark table: the Gemini 4 Carbon column filled blue with blue rules each side; the best rival score in a row is grey (87.2%); "Methodology" link under it |
| `desk-07` | Safety: a carousel of cards, each a glass icon on a blue gradient plus a paragraph; two blue promo cards below |
| `desk-08` | "Get started / Try Gemini 4": four icon tiles, each with a sentence and a text link |
| `desk-09` | Footer: "Build AI responsibly to benefit humanity" and five link columns with small icons |
| `phone-p1/p2` | Phone hero: h1 at 34 px, three equal glass asks stacked; identical frames (no ambient motion) |
| `phone-p3` | The site switcher: a rounded white sheet listing seven Google AI destinations |
| `phone-p4` to `p6` | One post with a blue thumbnail; a "Showcase" quote card marked "1/12"; the "Get started" tiles stacked |

The cookie text looks selected (blue) in some frames: that is the walk's text selection, not the site.

## Measured motion
| Move | Value | Source |
|---|---|---|
| Arrival | none on the h1 (`animation: none`); the attribution caption fades in, opacity **300 ms ease**; a film fades in **200 ms ease** as its poster fades out **300 ms ease** | measured (getAnimations) |
| Ambient (no input, 2.4 s) | **0.0%** of pixels change: desktop first screen, desktop mid page and phone first screen | measured (frame difference) |
| Header steps aside | on scroll down: translateY(calc(−100% − 15px)), **200 ms ease** (desktop at y 400, phone at y 380); on scroll up it returns and a blur backing fades in, opacity **200 ms ease** | measured |
| Progressive-blur header backing | 80 px tall, 5 stacked layers at **blur 4, 6, 10, 18, 34 px**, each masked to its own band (the heaviest blur at the very top) | measured (probe) |
| Sticky featured post | the featured card (624×737) stays put for **880 px** of scroll (y 1980 to 2860) while 9 list posts pass; desktop only (phone: not sticky) | measured (scroll walk + probe) |
| Ask hover / press | a `::before` layer tints to `rgba(33,34,38,0.04)` on hover and `0.06` on press, **background-color 300 ms**; no transform | from code (CSS rules) + computed values |
| Card hover / press | card layer (radius 24 px) fills `#f8f9fc`, **150 ms ease**; press `#e6eaf0` | measured (hover) / from code (press) |
| Card image hover | scale3d(1.05) with contrast 1.05, brightness 0.975 | from code |
| Phone site-switcher sheet | opacity 0→1 and scale(0.98)→1, **250 ms cubic-bezier(0.16, 1, 0.3, 1)** | measured |
| Films | lazy: autoplay, muted, loop; the poster returns when a film leaves view (opacity 300 ms ease) | measured |
| Carousels | Embla (class names), counter "1/12"; no autoplay seen | from code / measured (0% ambient mid page) |
| Scroll | **native, not smoothed**: a 400 px step lands within one frame (68 ms) | measured |
| Scroll-linked motion | only the sticky featured post; no scrubs or reveals in an 8,586 px walk | measured (sampling every 220 px) |
| Curves in the bundles | `(0.4, 0, 0.2, 1)` ×20, `(0.16, 1, 0.3, 1)` ×11, `(0.22, 1, 0.36, 1)` ×3 | from code |
| Durations in the bundles | 300 ms ×44, 200 ms ×26, 150 ms ×36, 250 ms ×5 | from code |
| Keyframes named | `wireReveal`, `trace-border-in`, `fade-border-in/out`, `slideDownFadeIn`, `slideIn*`, `fadeIn`. No springs, no Lenis, no View Transitions | from code |

## Measured layout
| Item | Desktop (1470) | Phone (375) |
|---|---|---|
| h1 | Google Sans Flex **98/96 px** (line height 0.98), weight 500, −2.67 px (−0.027 em), centred, 848 wide | 34/36 px, weight 500, −0.32 px |
| Statement under hero | 42/43.7 px, weight 450, −0.98 px (−0.023 em), 848 wide | 28/29.7 px |
| Section heads | 32/33.9 px, weight 500 ("Announcements", "Performance", "Showcase") | n/a |
| Featured post / list titles | 42/43.7 px / 28/30.2 px | 28 px / 24 px |
| Body, links | 17.5/25.4 px, weight 400; text links 14.5 px / 450 in `#45474d` | same |
| Gutter | 87 px | 28 px |
| Header | 65 px, fixed, transparent; hides on scroll down | 65 px, fixed |
| Hero asks | three equal glass pills, 48 tall (155, 235, 251 wide), fully round, white at 18% + blur(6px) + 1 px ring `rgba(33,34,38,0.12)`, 17.5 px / 450 | stacked, centred |
| Header asks | "Build with Gemini" 156×34, "Try Gemini" 130×34, same glass, 14.5 px / 450 | menu button |
| Statement film | 846×475, radius 16 px; controls 48×48 round at `rgba(18,19,23,0.18)` | 317×177 |
| Benchmark table | 1152 wide, 8 columns, 14.5 px tabular figures; own column fill `#9dd2ff`, text `#1e2867`, 2 px rules `#3c90ff`; best rival `#e1e6ec` | scrolls sideways (854 px inside 291 px), benchmark-name column sticky |
| Palette | page `#ffffff`, panels `#f8f9fc`, pressed `#e6eaf0`, ink `#121317`, quiet `#45474d`; colour only from the blue key art | same |

## The 5 moves it gives Hanzo
1. **The model told in eight beats.** Name alone (98/96, nothing above it) → one 42 px sentence and a film (846×475, radius 16) → news → proof table → real voices with a "1/12" counter → safety → access programs → where to try it. One idea per section. *Suits: model pages and model launches; the same order works for a Hanzo Cloud product launch.*
2. **The quiet proof table with its own column lit.** 14.5 px tabular figures; Hanzo's column filled and ruled 2 px on both sides, the best rival in a row tinted grey, the methodology link directly under it. On phone the table scrolls sideways with the benchmark-name column sticky. For Hanzo, use silver or white for the lit column, never blue. *Suits: model pages, pricing comparisons, docs-style pages.*
3. **A sticky featured story beside a moving list.** One big post (624×737, 42 px title) holds for 880 px while nine 28 px posts with thumbnails scroll past. One thing stays, the rest come and go. *Suits: press, model launch news, customers, careers.*
4. **The progressive-blur header.** Five stacked backdrop blurs (4, 6, 10, 18, 34 px), each masked to a band of an 80 px strip, fading in over 200 ms ease. It reads like frosted glass with no hard edge. Take the blur, not the hiding (James wants the ask to stay). *Suits: the shared header on every page.*
5. **Glass asks over model media.** Pill 48 px tall, white at 18%, blur(6px), 1 px ink ring at 12%, 17.5 px / 450. A sheet that rises from scale(0.98) with opacity over 250 ms `cubic-bezier(0.16, 1, 0.3, 1)`. *Suits: asks placed on model imagery; phone menu; DetailSheet.*

## Gaps (do not copy)
- **Three equal asks in the hero** ("Try in Gemini", "…AI Studio", "…Antigravity"), and at 1470×801 they sit under the cookie bar. James: one ask, never 3 equal buttons.
- **The header hides on scroll down**, so no ask stays on screen after the hero. James wants it sticky at every width.
- **A dead first screen:** a still image, 0% ambient change, no arrival on the h1.
- **Hover and press are a 4% / 6% tint with no transform.** Too faint to answer a tap; add translateY(1px) or scale 0.98.
- **Icon tiles with a sentence under each** ("Get started", 4 in a row; safety cards with paragraphs): James's "icon boxes in a row" and "explaining sentences under every tile".
- **One blue tone everywhere** (key art, thumbnails, safety cards, table): colour from a gradient wash, not from real output. Hanzo has no brand hue.
- **Phone h1 is 34 px**, far below James's display scale.
