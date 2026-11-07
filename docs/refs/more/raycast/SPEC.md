# raycast.com: SPEC

Filmed 7 Nov 2026 (home page, then a click on the first extension card). Films: `desktop.mp4` (1470×801) and `phone.mp4` (375×812). Frames: `frames/`. Method: `../INDEX.md`. This page has no canvas or WebGL (none found), so nothing is missing from the film; the red glass art is a still image. YouTube thumbnails were blocked, so the blog row shows broken images.

**Why it is in James's family:** a dark, near-black stage where every section holds a real product object, and several of them **run themselves**. The launcher window types its own search and swaps tools, a full keyboard lights its keys one after another, and a wall of short phrases drives a screenshot every 5 seconds. That is James's rule 9 (idle and time motion, not just scroll) on a monochrome page.

**Honest verdict:** the best "objects that run themselves" reference after Cursor, and a good source for the shared header and a tactile ask. The first screen is weak: text only, nothing moving, and the ask sits on the fold. It also uses Inter and coloured, green-tinted cards, so take the objects and the chrome, not the type or the card colours.

## Frames
| Frame | What it shows |
|---|---|
| `desk-01/02/03` | Arrival: the h1 fades up from grey (01, 0.4 s); "Log in" and "Download" appear in the header by 1.2 s (02); the subline fades in a second later (03). Only text on the first screen; the top edge of "Download for Mac" touches the fold |
| `desk-04` | The launcher window (Clipboard History) on a red glass image, a 5-icon dock under it with a "Clipboard History" tooltip, and a two-tone caption |
| `desk-05`, `desk-10` to `desk-14` | Extension carousel: Linear (navy), Google Translate (blue), Spotify (green) cards, "Browse thousands more →", round prev/next arrows |
| `desk-06` | Quick AI and AI Extensions cards: a list of prompts, and "Finding last week's meetings…" in a shimmer |
| `desk-07` | "Don't repeat yourself." in white with a grey second line, a Snippets panel on a blue glass image, a typed "scratch" field, keyboard keys |
| `desk-08` | "Stay in the loop.": Slack and X/Twitter cards with mono counts over the red glass art |
| `desk-09` | Developer section: a hairline grid, mono `FIG_02` labels, an isometric line drawing of a Mac, "Cross-platform" |
| `desk-10` to `desk-14` | The card click: nothing happens (URL unchanged), so these frames match `desk-05` |
| `phone-p1/p2` | Phone hero: h1, 14 px subline, "The Raycast Keyboard →" pill with a red light. No download ask on phone. The walk could not open the menu, so there is no `phone-p3` |
| `phone-p4` to `phone-p6` | AI Extensions card; community cards over red glass; closing "Take the short way." over the red art, then the footer |

## Measured motion
| Move | Value | Source |
|---|---|---|
| Hero arrival | h1 then subline: opacity 0→1 and translateY(20 px)→0, **1,000 ms ease**, subline 1 s later | measured (getAnimations) + from code (`fadeInUpStagger`) |
| Header asks arrive | visible at 1.13 s, 200 ms ease-in-out | measured |
| Launcher window runs itself | with no input, the search field types its query a few characters per 500 ms sample, then the dock switches tool: Clipboard History → AI (about 13 s) → Emoji Picker (about 18 s). Active dock icon 68×68, others 54×54 | measured (probe, 500 ms sampling) |
| Star field in that frame | 92 stars; opacity toggles of **250 ms ease**, 979 seen in a 68 s walk, with and without input | measured |
| Keyboard types itself | keys go opacity 0.2 → 1 one after another, about one key per 250 ms, each **400 ms cubic-bezier(0.23, 1, 0.32, 1)** | measured (probe + getAnimations) |
| Phrase wall drives a screen | 13 phrases at 24/38.4 px in grey `#434345`; one lights white every **5,000 ms** with a progress bar (scaleX 0 → 0.1 at 5% → 0.95, linear); the screenshot enters over **600 ms cubic-bezier(0.4, 0, 0.22, 0.96)** and exits in 300 ms | measured (probe) + from code |
| Typing carets | opacity 1→0→1, **1,100 ms linear**, infinite (4 carets) | measured |
| Pending text shimmer | background-position 100% → −100%, **1,500 ms linear**, infinite | measured |
| Hero pill light | a conic highlight runs round the pill border, **3,000 ms linear**, infinite | measured + from code |
| Extension cards enter | translateY(50 px) translate(10 px) scale(0.98), opacity 0 → 1, **700 ms**, staggered **80 ms** over 17 cards; fires at load (247 ms), not when scrolled to | measured |
| Drawing settles on scroll-in | one part drops from translateY(−37 px) over **1,500 ms cubic-bezier(0.165, 0.84, 0.44, 1)**; its label rises 20 px and fades in over 2,000 ms, same curve | measured (class added on scroll, no hover) |
| Ask hover | fill `#e6e6e6` → `#ffffff`, **200 ms**; the ring and inset light stay; nothing moves | measured |
| Ask press | the walk saw no change; CSS sets fill `#cdcece` on `:active`, no transform | from code |
| Nav link hover | `#9c9c9d` → white, **200 ms ease-in-out** | measured |
| Blog card hover | thumbnail scale 1.04 and grayscale 0.5 → 0 over 300 ms; title opacity 0.8 → 1 over 200 ms | measured |
| Phone menu toggle | three 1 px lines turn into an X over 500 ms; the toggle rotates 180° | from code |
| Scroll | **native, not smoothed** (400 px step lands in one frame, 79 ms) | measured |
| Scroll-linked motion | no pins or scrubs in a 12,100 px walk; the drawing above is the only scroll reveal | measured |
| Ambient (no input, 2.4 s) | desktop first screen 0.0%, mid page 0.0%, phone first screen 5.1% | measured (frame difference) |
| Curves in bundles | `(0.23, 1, 0.32, 1)` ×21, `(0.4, 0, 0.2, 1)` ×16, `(0.4, 0, 0.22, 0.96)` ×11, `(0.165, 0.84, 0.44, 1)` ×10 | from code |
| Durations / springs | 300 ms ×116, 200 ms ×70, 150 ms ×35; springs 500/25 and 550/0; `startViewTransition` ×3 | from code |

## Measured layout
| Item | Desktop (1470) | Phone (375) |
|---|---|---|
| h1 | Inter **64/70.4 px** (1.1), weight 600, tracking normal, white, 540 px wide, centred | 36/39.6 px, weight 600 |
| Hero subline | 18 px white | 14 px |
| Section heads | two-tone: 20 px / 500 white sentence, then a 20 px grey (`#6a6b6c`) line | same pattern |
| Largest inner line | "Build the perfect tools.": 56/65.5 px, weight 400 | n/a |
| Container | 1204 px (133 px each side) | 16 px header inset, 24 px text gutter |
| Header | fixed floating bar 1204×76, 16 px from the top, radius 16, `linear-gradient(137deg, rgba(17,18,20,.75), rgba(12,13,15,.9))`, blur 5 px, 1 px border `#ffffff0f`, inset top light | 343×58, radius 16, fixed; menu icon only |
| Ask | "Download for Mac": 173×36, radius 8, fill `#e6e6e6`, text `#2f3031` 14/500, padding 8×12; a 2 px dark ring, 14 px white bloom, 1 px inset light on top; top edge at 797 px (on the fold) | none on phone |
| Header ask | "Download": 117×36, same style | none |
| Pill | "The Raycast Keyboard →": 204×32, radius 43, at 935 px (below the fold) | 204×32 at 583 px |
| Product frame | 1204×740, radius 19, `rgba(0,0,0,.44)` with a faint radial tint, 0.5 px inset top light | n/a |
| Palette | page `#07080a`, ink white, quiet `#6a6b6c`, nav `#9c9c9d`, border `#ffffff0f`; colour from glass images and from coloured cards | same |

## The 5 moves it gives Hanzo
1. **The window that runs itself.** A real Hanzo product window types its own query, then a dock swaps to the next tool (about 13 s, then 5 s); the active dock icon grows from 54 to 68 px. *Suits: home product moment, Hanzo Chat, Dev/CLI, agents.*
2. **The object that types.** A keyboard (or a command grid) lights one key every 250 ms, each 0.2 → 1 over 400 ms `(0.23, 1, 0.32, 1)`, with Hanzo's own short claims printed on keys. *Suits: Dev/CLI, docs-style pages, careers.*
3. **The phrase wall that drives a screen.** A list of short capability lines in grey; one lights white every 5 s with a thin progress bar, and the screenshot beside it enters over 600 ms `(0.4, 0, 0.22, 0.96)`. Clicking a line jumps to it. *Suits: product pages, solutions, model pages (capabilities list).*
4. **Figure plates.** Hairline grid, mono `FIG_0n` labels and line drawings where one part settles 37 px over 1.5 s `(0.165, 0.84, 0.44, 1)` as it scrolls in. *Suits: docs-style pages, cloud, Dev/CLI, model specs.*
5. **Glass header with a lit key for an ask.** Floating 76 px bar inset 16 px, radius 16, dark gradient at 75–90%, blur 5 px, 1 px hairline; the ask is a light key (`#e6e6e6`, 2 px dark ring, inset light) that goes to white in 200 ms and to `#cdcece` on press. Monochrome, so it fits rule 7. *Suits: the shared header on every page; pricing asks.*

## Gaps (do not copy)
- **Inter** everywhere (a banned tell). Keep Hanzo's own face.
- **Green and coloured boxes:** the Spotify card is a green gradient card, and the other extension cards are navy and blue gradient boxes. Colour from boxes, plus a green accent.
- Coloured glows: a blue text glow (`rgba(154,170,255,.65)`) on the lit phrase and a pink light round the pill. Hanzo has 0 hues; use white light.
- The first screen is dead: text only, 0.0% of pixels change, and the ask sits on the fold at 1470×801. No ask at all on phone.
- h1 is 64 px at 1.1, under James's 72 px and 1.05.
- Press only darkens the fill (no translateY(1px) or 0.98 scale), and the walk could not see it. The blog title hover is an opacity fade.
- The extension card stagger fires at page load, so it is spent before anyone scrolls there. The card click does nothing.
