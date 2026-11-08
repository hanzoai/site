# hanzo.ai model cards: replicate EXACTLY (James, 7 Nov: "it needs to be the exact same")
Measured by the conductor in a real browser on the live https://hanzo.ai/ on 7 Nov, at a 1383px-wide viewport. Picture: `live-hanzo-ai.jpg`.
This section is copied, not redesigned. Same place, same grid, same cards, same motion. Only our shared layers may sit on top: the sound tick, and the click opening into the page.

## Place
- **Section 2 of the home page,** directly after the hero. Heading: "Frontier AI for everything you build." Subline: "Language, routing, decisions and creative models."
- **On hanzo.ai the heading sits about 690px below the hero headline.** On ours it is about 2,140px below, because the hero is far longer. James wants the cards where they are on hanzo.ai, so the cards must be reachable with the first scroll. Shorten the hero (or its pinned length) until the heading starts at most one viewport below the hero headline.
- **Under the grid:** "Explore model pricing →" on the left and "View full model catalog →" on the right, 13-14px.

## Grid
- CSS grid, `grid-template-columns: 385px repeat(4, 192px)` (that is 2fr 1fr 1fr 1fr 1fr of a 1131px content width), `grid-template-rows: 220px 220px`, `gap: 12px`.
- **Enso** spans column 1 and both rows (385×452). **Row 1:** Kai, Zen, Iro, Koma. **Row 2:** Oto, Koe, Uta, Mori. Each card links to `/<name>`.

## Card
- `background: #000` (pure black, not #0a0a0a), `border-radius: 20px`, `overflow: hidden`, no shadow, no border, `cursor: pointer`.
- **Media:** the model's `.webm` loops muted, playing while in view, over its `.webp` poster, with `object-fit: cover` and a 0.6s opacity crossfade when the video is ready. Never filter or dim it.
- **Text** sits at the top left, inset 21px:
  - **Title:** 22px, weight 500, letter-spacing -0.44px, line-height 28px, white, followed by "→". Enso's title is 44px, weight 500, letter-spacing -0.88px, line-height 48px.
  - **Description:** 13px, line-height 18px, rgba(255,255,255,.8), about 57px from the card top.
  - **Tag pill** at the bottom left (about 175px from the top on small cards): 10px Zen Mono, uppercase, letter-spacing 0.8px, line-height 14px, padding 4px 10px, 1px solid rgba(255,255,255,.2), fully rounded, rgba(255,255,255,.8).
  - **Enso extras:** a "FLAGSHIP MODEL" pill at the top, and the pills ROUTING · AGENTS · MULTI-MODAL at the bottom.
- **Hover (the movement):** a pointer-follow 3D tilt.
  - `transform: perspective(900px) rotateX(±) rotateY(±)`, up to about ±3° towards the pointer (top-left corner gives rotX -1.5 / rotY +1.5; bottom-right gives +2.7 / -2.7).
  - No scale, no lift.
  - `transition: transform .3s cubic-bezier(.2,.8,.2,1)`, and it settles flat on leave.
  - Reduced motion: no tilt.
- **Phone:** the grid stacks the same cards. Keep the same card look and the same tilt-free tap.

## Same design wherever the model cards appear
The `/models` catalogue cards and the related-model cards on the model pages use this same card: black #000, 20px radius, the same type and the same tilt.
