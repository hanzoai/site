# synchronized.studio: James's favourite. NOT FILMED YET.

**Status.** No video or frames yet: this environment's network policy blocks synchronized.studio (the proxy returns 403), and WebFetch is blocked too. The exact run is in `docs/refs/TO-FILM.md`.

**Do not treat anything below as measured motion.** Every value carries one of three labels:
- **earlier code read:** taken from `docs/BRIEF-v3.md` §9, where an earlier session read the site's Nuxt 2 bundle. That bundle may be older than the live site. Not re-verified here.
- **write-up:** taken from public write-ups found by web search (sources at the end).
- **measured from JS (motion):** read from the motion package Hanzo ships, `node_modules/motion-dom` 12.23.24. These are Hanzo's engine defaults, not synchronized.studio's values.

## What is known

| What | Value | Source |
|---|---|---|
| Card to page | A card opens inside one persistent stage. The URL is kept as `?case=slug`, so Back closes it. | earlier code read |
| Cursor | 74px circle, `mix-blend-mode: difference`, labels "Open" and "Drag" | earlier code read |
| Headline reveal | Diagonal reveal, 2s, Power4.easeOut, offsets ±60px | earlier code read |
| Layout | Text anchored to the viewport edges; one pale accent used only for interaction | earlier code read |
| Phone | Below 992px a card opens the client link directly (no stage) | earlier code read |
| Standing | Awwwards Studio of the Year 2022 (7 Sites of the Day that year). Its own site was Site of the Day in July 2020, with Developer and Mobile excellence. Credited under Mobile Site of the Year. | write-up |

## Not known until filmed (the reason James sent us there)
- The card-to-page **timing and easing**, and whether the next page's hero **is** the clicked image (a shared element) or a cross-fade.
- Whether the site uses smooth scrolling, and how strong it is (its lerp).
- Idle motion: anything that moves without input on each screen.
- The type scale, spacing and colours.

No write-up found describes the transition. The searches returned only the award listings and unrelated studios.

## Moves Hanzo should borrow (provisional until filmed)

1. **The card opens into its page, and the next page's hero is the card.**
   - **Pages:** Catalogue (/models, /integrations, /oss, /solutions, /templates) and the home product cards.
   - **Build:** motion `layoutId` on the card media and the destination hero.
   - **Timing until filmed:** motion's own layout default is 0.45s with ease [0.4, 0, 0.1, 1] (measured from JS (motion): `defaultLayoutTransition` in `create-projection-node.mjs`). BRIEF §8's spring {260, 32} remains a proposal. Replace both with synchronized.studio's measured curve once filmed.
2. **One persistent stage with a real URL.**
   - **Pages:** Catalogue.
   - **Behaviour:** the opened case lives at its own URL, and Back or Esc closes it (earlier code read). It matches BRIEF §8's `@modal` intercepting route.
3. **A cursor label that teaches the click.**
   - **Pages:** Catalogue only.
   - **Behaviour:** a 74px difference-blend circle that says "Open" over cards and "Drag" over rails (earlier code read). Only under `(hover:hover) and (pointer:fine)`, never over forms or code.
   - **Not a cursor glow or beam:** those are on James's banned list.
4. **Text pinned to the viewport edges, with the media in the middle.**
   - **Pages:** Launch heroes, Story heroes.
   - **Behaviour:** the headline and supporting line sit at the far left and right edges, not centred in a box (earlier code read).
5. **On phones the card goes straight to its page.**
   - **Pages:** every card grid.
   - **Behaviour:** below 992px no stage opens (earlier code read). This keeps phones fast and avoids a morph on a small screen.
6. **One pale accent, only where you can act.**
   - **Pages:** all.
   - **Behaviour:** this fits James's "0 brand hues" rule as a grey or silver tint for focus and hover, never a colour.
7. **Diagonal headline reveal (hold).**
   - **Pages:** a later Story hero variant only.
   - **Timing:** 2s Power4.easeOut (earlier code read). BRIEF v3 cut it from home, so keep it off Launch pages.

## Sources (write-up)
- Awwwards annual awards 2022, Studio of the Year: https://www.awwwards.com/annual-awards-2022/studio-of-the-year
- Awwwards annual awards 2021, Mobile Site of the Year: https://www.awwwards.com/annual-awards-2021/mobile-site-of-the-year
- Awwwards inspiration, Synchronized 404 page: https://www.awwwards.com/inspiration/synchronized-studio-404-error-page
- Dribbble, Synchronized: https://dribbble.com/Synchronized
- Earlier code read: `docs/BRIEF-v3.md` §9, Craft references
