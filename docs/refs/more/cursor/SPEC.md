# cursor.com: SPEC

Filmed 7 Nov 2026 (home page, then a click into a "Recent highlights" card). Films: `desktop.mp4` and `phone.mp4`. Frames: `frames/`. Method: `../INDEX.md`.

**Why it is in James's family:** the product is the hero, and it **runs itself**. With no input, the app window on the first screen keeps working: a selection box glides between rows, "working" dots pulse, pending text shimmers, and new messages pop in. That is James's rule 9 ("a live demo that runs itself") done at the highest level. Colour arrives only through the painted landscapes behind each product window, never through boxes.

**Honest verdict:** the best ambient and product-demo reference in this set. The h1 itself is small (26 px), so take its type scale from elsewhere (Vercel, Obys).

## Frames
| Frame | What it shows |
|---|---|
| `desk-01/02/03` | Arrival: the hero app window over a painted landscape; between 01 and 03 the demo has already moved on its own |
| `desk-04` to `desk-09` | One product window per section, each on its own painting; a short statement on the left, a quiet link in orange-brown |
| `desk-08/09` | Closing: "Try Cursor now." at 72 px, centred, with one dark ask |
| `desk-10` to `desk-14` | Card to page: the blog card opens its article; the client-side route change lands in about 130 ms after the click with no transition |
| `phone-p1/p2` | Phone hero: 28% of the screen changes in 2.4 s with no input (the demo is running) |
| `phone-p3` | Phone menu: a full-screen list at about 30 px with "Sign up" filled, "Contact sales" outlined |

## Measured motion
| Move | Value | Source |
|---|---|---|
| Demo selection box glides between rows | `top`, `width`, `height`, **150 ms cubic-bezier(0.4, 0, 0.2, 1)**; 38 moves seen in one walk | measured (getAnimations) |
| "Working" dots | 3 dots, opacity loops, **3,100 ms linear**, infinite | measured |
| Pending text shimmer | background-position 200% → −200%, **1,600 ms linear** (synced) and **2,500 ms linear**, infinite | measured |
| Typing caret | opacity 1 → 0.5 → 1, **2,000 ms linear**, infinite | measured |
| New chat entry | translateY(8 px) scale(0.97), opacity 0 → none, 1; **280 ms** | measured |
| Tile pop-in | scale(0.7) translateY(3 px) → scale(1); **200 ms ease-out** | measured |
| Done check | scale(0.4) → 1 with opacity; **280 ms** | measured |
| Staged text reveal in the demo | opacity, **220 ms cubic-bezier(0.22, 1, 0.36, 1)** (19 seen) and 180 ms ease-out (25 seen) | measured (Web Animations) |
| Logo hover | the wordmark swaps to a **video**: opacity 0 → 1, **500 ms cubic-bezier(0.4, 0, 0.2, 1)** | measured |
| Ask hover | fill `#26251e` → `#3b3a33`, **instant**; secondary `#e6e5e0` → `#e1e0db` | measured |
| Ask press | fill drops back to `#26251e` while held (the press answers) | measured |
| Nav caret | rotates 180°, **140 ms cubic-bezier(0.25, 1, 0.5, 1)**; sub-nav fades in with the same curve and time | measured |
| Install command chip hover | fill `#ebeae5` → `#e6e5e0`, **200 ms cubic-bezier(0.4, 0, 0.2, 1)** | measured |
| Scroll | **native, not smoothed** (400 px step lands in one frame) | measured |
| Scroll-linked motion | none found in a 7,398 px walk; all motion is in the demos | measured |
| Ambient (no input, 2.4 s) | desktop first screen 6.0% of pixels change, mid page 2.7%, phone first screen 28.3% | measured (frame difference) |
| Springs in bundles | stiffness 360 / damping 32 (most used), 420 / 28, 300 / 30 | from code |
| Curves in bundles | `(0.22, 1, 0.36, 1)` ×18, `(0.4, 0, 0.2, 1)` ×20, `(0.25, 1, 0.5, 1)` ×2; durations mostly 120 ms (×13) | from code |
| View Transitions | `::view-transition-old/new` rules and `startViewTransition` are present | from code |

## Measured layout
| Item | Desktop (1470) | Phone (375) |
|---|---|---|
| h1 | CursorGothic **26/32.5 px**, weight 400, −0.325 px; width 658 px | 24.4/30.5 px |
| Section statement | 36/43.2 px, −0.72 px (−0.02 em) | n/a |
| Closing statement | **72/79.2 px** (1.1), −2.16 px (−0.03 em), centred | n/a |
| Body | 16/24 px, ink `#26251e` | n/a |
| Gutter | 85 px | 19 px |
| Header | 52 px, fixed, solid `#f7f7f4` | 56 px |
| Primary ask | "Download": 201×43, fully round, `#26251e`, 16 px / 400, padding 12.5 × 21.6 px | "Get started", filled |
| Secondary ask | "Request a demo →": 183×43, round, `#e6e5e0` | n/a |
| Header asks | 27 px tall: "Contact sales" outlined at 20% ink, "Download" filled | menu icon |
| Palette | page `#f7f7f4`, alternate band `#f2f1ed`, ink `#26251e`; colour only from the paintings | same |

## The 5 moves it gives Hanzo
1. **The self-running product window.** A real Hanzo app UI, scripted to keep working with no input: the selection box glides (150 ms, (0.4, 0, 0.2, 1)), rows enter at translateY(8 px) scale(0.97) over 280 ms, and checks pop from scale 0.4 in 280 ms. *Suits: home hero, Hanzo Chat, Dev/CLI, agents and product pages.*
2. **The AI waiting vocabulary.** Shimmer on pending text (1.6 s linear sweep), three "working" dots (3.1 s loop), a 2 s caret pulse. This is time-based motion that reads as "the model is thinking". *Suits: model, API, chat and agent pages; any loading state.*
3. **Product on a painted ground.** Every product window sits on a full-bleed painting or photo, so the only colour on the page comes from media. That is James's rule 7. *Suits: product and solutions pages, using Hanzo's own model imagery as the ground.*
4. **A logo that answers the pointer.** Hovering the wordmark crossfades it to a short video in 500 ms. A hover that shows you something, at almost no cost. *Suits: the shared header.*
5. **One closing ask, said big.** The page ends with one 72 px line and one dark ask, centred, after quiet sections. *Suits: the final band of every product page.*

## Gaps (do not copy)
- One status border turns green (`rgb(74, 222, 128)`) in the demo. James bans green accents; use white or silver for "done".
- The h1 is 26 px. Hanzo heroes need James's display scale (72 px or more, line height 1.05 or less).
