# deepmind.google/models/veo: SPEC

Filmed 7 Nov 2026 (the Veo model page). Films: `desktop.mp4` (1470×801, shown at 980 wide) and `phone.mp4` (375×812). Frames: `frames/`. Method: `../INDEX.md`. 29 media requests to `storage.googleapis.com` and 2 to YouTube were blocked, but the hero films and most section films played. The desktop scroll walk covered the first 12,100 px of a 26,512 px scroll; the Performance section was read with a separate probe (not in `frames/`). The phone walk covered the whole page.

**Why it is in James's family:** it is his rules 6 and 7 at full size. 57 films sit on one page, often 2 to 4 on screen at once, and they are the only colour: the page itself is white, ink `#121317` and one grey. A sticky section sub-nav follows you the whole way down, which is the Apple product-page pattern he named.

**Honest verdict:** the best media-led model page in this set, and a real sub-nav reference. The motion is almost all film: the UI itself has no reveals or scrubs, hover is a tint, and benchmarks are flat chart images in green and pink.

## Frames
| Frame | What it shows |
|---|---|
| `desk-01` (0.4 s) | The hero card, near black, with "Veo" in white, a grey subline and three asks; the next slide peeks in on the right |
| `desk-02` (1.2 s) | The card turns to its grey poster, just before the film fades in |
| `desk-03` | The film plays (a motorbike rider in a glittering landscape) behind the white name; slides peek at both edges |
| `desk-04` | The sticky sub-nav pill (Capabilities, Performance, Safety, Showcase, Try Veo) over three "What's new" cards; "Introducing Veo 3.1" in ink with its grey continuation; a "Learn how to prompt" pill |
| `desk-05` | One 1282×721 film (an old sailor) with round mute and pause controls, a one-line prompt caption with "+", the next film peeking |
| `desk-06` | The foot of a 2×2 film grid with prompt captions, then a large forest-creature film |
| `desk-07` | "Add ingredients to your video": reference portrait beside the output film on a pale panel |
| `desk-08` | Origami: input image beside output film, then a 2×2 grid of outputs |
| `desk-09` | Input dancer video beside the prompted output, then "Camera controls" |
| `phone-p1/p2` | Phone hero: inset film card, "Veo" at 34 px, three stacked asks; p1 the grey poster, p2 the film playing |
| `phone-p3` | The site-switcher sheet over the film |
| `phone-p4` to `p6` | The sub-nav pill scrolled sideways; an output film with carousel arrows; "Outpainting" text; the full-bleed Google Flow band with white text over film |

## Measured motion
| Move | Value | Source |
|---|---|---|
| Arrival | poster opacity 1→0 **300 ms ease** while the film fades in 0→1 **200 ms ease** (1.2 s desktop, 0.6 s phone); slide text and captions fade in **300 ms ease** | measured (getAnimations) |
| Ambient (no input, 2.4 s) | desktop first screen **53.0%** of pixels change, mid page **20.3%**, phone first screen **53.8%** | measured (frame difference) |
| Hero carousel | Embla; 3 film slides, each film 1359×629 at radius 36 px; neighbours peek on both sides; prev/next 42×36 round under it ("Explore the latest"); no auto-advance seen | measured (probe) |
| Sticky sub-nav | `position: sticky`, top 16 px; held from y 1,320 to the end of the walk (10,780 px); when the header returns it drops to top 80 px, **300 ms ease** | measured |
| Sub-nav scroll-spy | the current section's link fills `#121317` (`::before`, **300 ms**) and its text turns white (**200 ms ease**); the old one empties at the same time | measured (desktop y 6,380/6,600; phone y 5,398/5,778) |
| Sub-nav hover | link fills `#e6eaf0`, **200 ms ease** | measured |
| Sub-nav click | smooth jump: 18,590 px in about 650 ms (y 1,462 at 129 ms, 6,074 at 363 ms, 20,044 at 656 ms) | measured (probe) |
| Ask hover / press | white ask: `::before` to `rgba(33,34,38,0.12)` on hover, the same on press; glass asks: `rgba(230,234,240,0.04)` hover, `0.055` press; **300 ms**; no transform | measured (real pointer) |
| Header steps aside | translateY(calc(−100% − 15px)), **200 ms ease** on scroll down (y 400 desktop, y 380 phone) | measured |
| Prompt captions | 39 captions clipped to one line, each with a 24×24 "+" that expands it | measured (probe) |
| Lightbox | fixed layer, opacity **250 ms** | from code (computed) |
| Phone site-switcher sheet | opacity 0→1 and scale(0.98)→1, **250 ms cubic-bezier(0.16, 1, 0.3, 1)** | measured |
| Scroll | **native, not smoothed**: a 400 px step lands within one frame (116 ms) | measured |
| Scroll-linked motion | only the sticky sub-nav; no scrubs or reveals | measured (sampling every 220 px) |
| Bundle | the same stylesheet as the Gemini page (`site.271afe95.css`, scanned 4 times here): `(0.4, 0, 0.2, 1)` and `(0.16, 1, 0.3, 1)` lead; no springs, Lenis or View Transitions | from code |

## Measured layout
| Item | Desktop (1470) | Phone (375) |
|---|---|---|
| h1 | Google Sans Flex **98/96 px** (0.98), weight 500, −2.67 px (−0.027 em), white over the film | 34/36 px, weight 500 |
| Hero subline | 20 px / 500, white at 72% | stacked under the h1 |
| Hero card | film 1359×629, radius 36 px, 56 px in from each edge, starts under the 65 px header | inset rounded card (seen in frames) |
| Statements | 42/43.7 (weight 450, −0.023 em), 54/56.2 (450, −1.2 px), 63/65.5 (450) | n/a |
| Two-tone section header | title 32/33.9 / 500 in `#121317`, continuation at the same size in `#45474d` | same pattern (seen in frames) |
| Captions | 14.5/21 px in `#45474d` (17.5/25.4 under the big films) | n/a |
| Media | carousel films 1282×721, radius 16; 2-up grid 624×351, gap 48, radius 16; Google Flow band full bleed 1470×801 | 1-up |
| Sub-nav | pill 685×62 in `#f8f9fc`, links 52 tall, fully round, 17.5 px / 450 | same pill, 319 wide, scrolls sideways (685 px inside 319) |
| Hero asks | "Try in Gemini" 155×48 filled `#f8f9fc`, ink text; "Try in Google Flow" 199×48 and "Build with Veo" 164×48 as dark glass: `rgba(18,19,23,0.18)`, blur(6px), 1 px ring `rgba(230,234,240,0.12)` | stacked, full set of three |
| Header | 65 px, fixed, transparent; glass asks 34 tall, 14.5 px / 450; hides on scroll down | 65 px |
| Performance | 9-slide carousel of chart images (848×477) on `#f8f9fc` panels; "View model card" and "View tech report" pills | in `phone.mp4` |
| Gutter, page | 87 px; page 27,313 px tall; 57 `<video>` elements | 28 px |

## The 5 moves it gives Hanzo
1. **The live film as the hero.** One film per slide (1359×629, radius 36) with the model's name in white at 98/96 over it, neighbours peeking at both edges, the poster crossfading to film (300 / 200 ms ease). Half the screen changes every 2.4 s with no input. *Suits: model pages and launches, using Hanzo's own model media; home as a variant.*
2. **The sticky sub-nav with scroll-spy.** A 62 px pill at top 16, five links 52 tall; the current section fills ink with white text over 300 ms; hover `#e6eaf0` in 200 ms; a click glides to the section in about 650 ms; on phone the pill scrolls sideways. For Hanzo, the last item becomes a real filled ask (James's persistent ask). *Suits: model pages, product pages (Chat, Dev/CLI, agents, cloud), pricing, docs-style pages.*
3. **Input beside output.** Reference image or video on the left, the result on the right, 624×351 tiles with a 48 px gap, under a one-line prompt caption (14.5 px grey) that opens on "+". The proof is shown, not claimed. *Suits: model pages, Hanzo Chat and agents (prompt → result), solutions.*
4. **Many real outputs at once, colour only from them.** 2×2 grids and 1282×721 carousels with the next film peeking, on a white page with ink and one grey. *Suits: model launches, customers and showcase, home.*
5. **Two-tone headers, then a full-bleed close.** Each section opens with a 32 px title in ink that runs on in grey at the same size (no eyebrow needed), and the page closes on a full-bleed 1470×801 film band with a 54 px white statement. *Suits: every product and model section; the closing band of a launch page.*

## Gaps (do not copy)
- **Green in the benchmark charts:** "Wins" bars are green and "Losses" pink (James bans green accents), and the charts are flat images, not hero figures.
- **Three asks in the hero** (one filled, two glass), and the header hides on scroll down. The sub-nav's "Try Veo" is a jump link, not an ask.
- **Hover and press are tints only** (12% / 4–5.5%), no transform, and the white ask's press looks the same as its hover.
- **The hero is a framed card** (radius 36, inset 56). James rejects a framed static hero; it only works while the film runs.
- **Length:** 20+ capability sections and 27,313 px. Beside the films it is a document; "What's new" is three cards in a row, each with a sentence.
- **Phone h1 is 34 px.**
