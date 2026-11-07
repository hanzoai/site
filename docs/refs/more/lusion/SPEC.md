# lusion.co: SPEC (from code, not filmed)

**Not filmed.** The page needs `lusion.dev` for its 3D assets, and that host is blocked (see `docs/refs/TO-FILM.md`), so in the cloud browser it stays on its loader. Every value below is **from code**: Lusion's own bundle (`/_astro/hoisted.CUO_IjfL.js`, 1.25 MB) and stylesheet (`/_astro/about.CNa9RfUh.css`), both read from lusion.co on 7 Nov 2026. Awards: Lusion v3 was Awwwards Site of the Year 2023 and Developer Site of the Year 2023.

**Why it is in James's family:** it is the strongest card-to-page studio site. Project cards open into their page through one live 3D stage that starts from what was on screen, never a blank cut (the nearest thing to James's synchronized.studio rule among award studios). Every hover answers, including text that decodes as the pointer arrives, and the page has its own scroll feel.

**Honest verdict:** take the timing rules, not the look. The 3D stage needs a GPU and its own engine, so for Hanzo it is a pattern for one WebGL moment at most.

## From code: motion
| Move | Value | Source |
|---|---|---|
| Own smooth scroll (wheel) | each frame moves `distance × (1 − e^(−12·dt))`; so 90% of a wheel step lands in about **190 ms** and 99% in about **380 ms** | from code (`wheelEaseCoeff = 12`) |
| Touch / drag scroll | momentum with friction coefficient from 2.1 to 1.9 | from code |
| Scroll-strength indicator | eases back with `e^(−10·dt)` | from code |
| Card hover, line 1 | the label **decodes**: 40 letters per second, with up to 5 random characters leading the real text | from code (`LETTER_PER_SECOND = 40`, `MAX_RAND_LETTER_COUNT = 5`) |
| Card hover, line 2 | hover progress runs at 2.5 per second (full in about **400 ms**); letters slide up to 1.5 em with a stagger, and the arrow icon follows | from code |
| Hover and click sounds | a short sound plays on hover and on click (off when the sound toggle is off) | from code |
| Card to page | the route manager hides the current page, shows a transition overlay with text while the next page loads, then shows the page; the 3D layer blends from the clicked frame using a "from" texture (`u_fromTexture`) | from code (no fixed duration: it waits for the load) |
| Most-used tween curves in JS | `expoOut` ×24, `cubicInOut` ×20, `expoInOut` ×19 | from code |
| CSS curves | `cubic-bezier(.4, 0, .1, 1)` ×32 and `cubic-bezier(.35, 0, 0, 1)` ×32 | from code |
| CSS durations | 400 ms ×24, 500 ms ×22, 300 ms ×19 | from code |
| Header colour change | `color 0.25s` as the page under it changes | from code |

## From code: layout
| Item | Value |
|---|---|
| Hero title | `font-size: 2.5vw` (about 37 px at 1470), `line-height: 1.1`, on grid columns 4 to 8 of a 12-column grid: deliberately small and off-centre over a full-screen 3D stage |
| Type | Aeonik |
| Project list | two cards per row (each spans 6 of 12 columns); from the third card on, `margin-top: 5em` (10em on ultra-wide) |
| Header | fixed, `font-size: clamp(1rem, 1vw, 1.5rem)` |

## The 5 moves it gives Hanzo
1. **The card is the door.** Clicking a card starts the next page from a texture of what was on screen (the shader's "from" texture), with an overlay that covers loading, so there is never a blank cut. Use Hanzo's own model and product media as the card image. (How the blend looks is not visible without filming; the mechanism is in the code.) *Suits: customers, case studies, models index to model page, careers roles.*
2. **Text that decodes on hover.** The card's label re-types itself at 40 letters per second, with 5 random characters leading. The hover tells you "this is live". *Suits: model cards, product cards, nav labels; once per page, not everywhere.*
3. **Staggered label slide.** Hover drives the second line's letters up to 1.5 em with a stagger, and progress fills in about 400 ms. *Suits: any card grid, the footer links.*
4. **A heavier scroll.** Wheel steps land 90% in about 190 ms and 99% in about 380 ms (exponential, coefficient 12). If Hanzo uses Lenis, match this feel. *Suits: long story pages: home, model launch, investors.*
5. **Two curves only.** `cubic-bezier(.4, 0, .1, 1)` and `cubic-bezier(.35, 0, 0, 1)` at 300 to 500 ms cover almost every CSS transition. *Suits: the shared motion tokens.*

## Gaps (do not copy)
- Sound on hover and click is off-brand for an AI company's site unless the user turns it on.
- The 3D stage needs a GPU. On phone and low-end machines it must fall back to Hanzo's own film or still.
