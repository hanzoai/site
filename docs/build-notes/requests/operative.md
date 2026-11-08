# /operative: requests (Apps 2 chat)

UI strings: `Pause` is already listed; `Replay` is already listed. This page removed its invented ones ("Interrupt", "Resume", "interrupted", "Which way in?", "Replay the install"), and in round 2 the invented visible strings found in none of the copy sources (the "Xvfb :1" and "OK" desktop labels, the key-cap labels, the "noVNC, in a browser" / "VNC, for a native client" port labels, the ✓ and ↗ glyphs, two aria-labels). The port labels now use Hanzo's own fragments ("noVNC on 6080 in a browser", "VNC on 5900 for a native client").

Shared (kit owners, please):
1. **`Band` headline reveal without blur.** `kit.jsx` `Band` uses `<Words>`, which reveals word by word with `filter: blur(12px)`. MASTER part 9 bans an opacity-and-blur reveal. Please swap it for the line mask (translateY 105% to 0, 700 ms, ease-emphasis, 60 ms between lines), as `A2Lines` does.
2. **`Cta` solid hover from the deck ramp.** The solid hover fill is `rgb(44,44,46)` (`#2c2c2e`), which is not a deck value. Please use `#262626`.
3. **`Band` button has no `data-cta`** (see `docs/build-notes/requests/ide.md`). The close "Deploy to Cloud" is Hanzo's own label and a second, different solid ask; a `kind="quiet"` option on `Band` would let a page keep one solid ask.
4. The shared ask bar floats over content on desktop (same file as ide.md). The cookie card covers about 200px at 375 for the whole walk.

Kit parts this page waits for: `Terminal` (the docker run that types itself is page-owned until then), `PageHero`.

Note: `<main id="main">` duplicates the layout's `#main` marker div (`app/layout.jsx`); added on request as other pages do, but the layout marker could drop its id once pages own it.

8 Nov (slice C2):
5. **Phone header ask follows the page ask.** At 375 the header keeps a solid black "Try Hanzo" beside the hero's solid "Get Started": two solid fills, two labels on the first phone screen. Desktop already swaps to the page's thumb ("Get Started") once the hero ask leaves; please do the same on phone.
6. Item 1 (Band blur) is worked round on this page: the close is page-local (`Close` in Operative.jsx: A2Lines line mask, kit Rise, Magnetic, Cta with `data-cta="operative.band"`). It can go back to kit `Band` once Band drops the blur and takes an id.
7. check.cjs counts text inside a closed `<details>` (System Requirements, Basic Usage) as overlapping the warning below it; nothing is drawn there. Likely Chrome's `content-visibility: hidden` slot still giving rects.
