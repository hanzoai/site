# apple.com: iPhone Pro and MacBook Pro product pages. NOT FILMED YET.

**Status.** No video or frames yet: the network policy blocks www.apple.com (proxy 403), and WebFetch is blocked too. The runs (iPhone Pro page and /macbook-pro/) are in `docs/refs/TO-FILM.md`.

**Labels:**
- **earlier read:** `docs/BRIEF-v3.md` §9, where an earlier session read the HTML, CSS and text, but did not measure scroll.
- **Apple CSS (snippet):** values from Apple's own built stylesheets, seen only as web-search snippets, and from **other** Apple pages (iPhone cellular, iMac, Logic Pro). Treat them as Apple's type system, not as this page.
- **write-up:** a third-party explanation found by web search.

## What is known

| What | Value | Source |
|---|---|---|
| Sub-nav | A sticky local nav that gains the Buy button only after the hero's button scrolls away (`data-localnav-trigger-anchor`) | earlier read |
| Closing | The final call to action repeats the hero's; footnotes sit at the foot | earlier read |
| Super headline | `.typography-headline-super`: 80px, line height 1.05, weight 600, tracking -0.015em. At ≤1068px: 64px, line height 1.0625. | Apple CSS (snippet) |
| Headline | `.typography-headline`: 48px, line height 1.083, weight 600, tracking -0.003em. Small screens: 32px, line height 1.125. | Apple CSS (snippet) |
| Product headline | `.typography-custom-product-headline` (iMac): 112px, line height 1, weight 600, tracking -0.015em | Apple CSS (snippet) |
| Pinned scenes | A tall section holds a `position: sticky; top: 0; height: 100vh` stage. Scroll position drives progress, so scrolling up rewinds it. | write-up |
| Scrubbed sequences | Claimed to be canvas plus pre-extracted image frames, not video. Unverified for these pages. | write-up |
| Warning | Daring Fireball called the AirPods Pro page "scrolljacking hell": several scrolls just to pass one section | write-up |

## Not known until filmed
- How long each pinned scene is, in screens.
- Section spacing and the tile-grid gap and radius.
- Hover and press responses.
- Whether anything moves without scrolling: idle loops, autoplay films.
- The exact timing of the sub-nav's Buy button.

## Moves Hanzo should borrow (provisional until filmed)

1. **A sub-nav that earns its ask.**
   - **Pages:** Launch pages (home, /chat, /dev, /agents, cloud products) and Model pages.
   - **Behaviour:** the sticky bar shows Hanzo's one ask only once the hero's button has scrolled away (earlier read). This is James's rule 5: one solid ask, sticky after the hero.
2. **Product-name type at 80px / 1.05 / -0.015em.**
   - **Pages:** Launch and Model heroes.
   - **Type:** Apple's super headline meets James's rule (h1 line height ≤ 1.05 at 72px and up). Step it down to 64px / 1.0625 at ≤1068px, as Apple does (Apple CSS (snippet)).
   - **Not the font:** Hanzo keeps its own font.
3. **One idea per screen, in a pinned stage of 2 to 4 beats.**
   - **Pages:** Launch and System (/platform, /enterprise).
   - **Behaviour:** one sticky 100vh stage; scrolling scrubs the beats and rewinds on the way up (write-up). BRIEF §8 caps it at 250svh. Measured scene lengths replace that cap after filming.
4. **The closing ask repeats the hero's ask word for word.**
   - **Pages:** all page types.
5. **Footnotes for every number, gathered at the foot.**
   - **Pages:** Model and Launch.
   - **Behaviour:** this is how Apple lets big claims stand (earlier read). It also enforces James's "every number traces to Hanzo's own copy".
6. **Do not scroll-jack (a "don't").**
   - **Pages:** all.
   - **Rule:** no scene may take several scrolls to leave (write-up, Daring Fireball). Keep the pinned stage under 2.5 screens and the page's scroll-linked motion at no more than half of its motion (JAMES.md rule 9).

## Sources
- Apple built CSS (search snippets):
  - https://www.apple.com/mideast/iphone/cellular/h/built/styles/overview.rtl.built.css
  - https://www.apple.com/v/logic-pro-for-ipad/b/built/styles/overview.built.css
  - https://www.apple.com/v/imac/k/built/styles/overview.built.css
- Sticky stage pattern (write-up): https://ddingpy.github.io/mynote/posts/building-an-apple-style-scroll-experience-like-the-macbook-neo-page
- Canvas frame claim (write-up): https://autonoma-digital.pages.dev/blog/cinematic-scroll/
- Scroll-jacking critique: https://daringfireball.net/linked/2019/10/28/airpods-pro-scrolljacking-hell
- Earlier read: `docs/BRIEF-v3.md` §9, Conversion references
