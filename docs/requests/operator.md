# /operator: requests

Shared (kit owners, please):
1. **`Band` headline reveal without blur.** `kit.jsx` `Band` uses `<Words>` (ui.jsx), which reveals word by word with `filter: blur(12px)`; MASTER part 9 bans an opacity-and-blur reveal. Please swap it for the line mask (translateY 105% to 0), as `A2Lines` does, and let `Band` take an `id` so its ask carries `data-cta` (here it would be `operator.band`).
2. **Phone header ask follows the page ask.** At 375 the header keeps a solid black "Try Hanzo" beside the hero's solid "View on GitHub"; on desktop it already swaps to the page's thumb once the hero ask leaves.
3. The cookie card covers the lower ~200px of the phone screen on first visit (noted in the review; shared).
