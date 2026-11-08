# /machines: shared changes requested (round 2, 7 Nov)

Done page-locally instead; the shared owners may want to lift these.

1. **Cookie card (shared chrome).** At 1470x801 it covers the bottom of the hero quote (the `$3.48 / h` itself now ends at y 711, above it), and about 200px of the 375x812 screen. MASTER part 17 asks for 220px or less at 375x812 and one bottom layer at a time.
2. **Header strip near the page end** (critic, `screen-13-a`, `screen-14-a`): a second header strip appears mid-viewport above the footer and the header greys at y 95. Shared header.
3. **PinChapters step crossfade** (`components/v2/x-hypatia/PinChapters.css`): the outgoing and incoming step text overlap for a frame (opacity .38s out while the next fades in after .1s). Machines overrides it in `Machines.css` (`.js .mc-ch .pc-art`: out in 150 ms, in from 180 ms, body by clip-path line mask). Gateway, Guard and Hsm use the same component and still overlap.
4. **`tokens.css` is not on main.** Machines declares the deck ramp once as `--mc-*` custom properties on `.mc` and reads them everywhere; swap to the shared tokens when they land.
5. **PinChapters dots** have no hover on the button itself (only the inner dot scales); Machines adds a soft well page-locally.
