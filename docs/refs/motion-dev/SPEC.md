# motion.dev: the engine and its examples gallery

**Status.**
- **Engine:** measured. Its defaults are read from the code Hanzo actually ships, `node_modules/motion` 12.23.24 (`motion-dom`, `framer-motion`).
- **Examples gallery:** NOT FILMED. The network policy blocks motion.dev (proxy 403), so the gallery is described from search snapshots. The run is in `docs/refs/TO-FILM.md`.

**Labels:**
- **measured from JS (motion):** read from the motion source in `node_modules`.
- **write-up:** search snapshots of motion.dev pages.

## The engine's defaults (measured from JS, motion 12.23.24)

These are what any Hanzo animation gets when no `transition` is given. Set `transition` explicitly wherever BRIEF §8 has a token.

| Animated value | Default | Where |
|---|---|---|
| x, y, rotate (any transform except scale) | spring: stiffness 500, damping 25, restSpeed 10 (a slight overshoot) | `motion-dom/.../default-transitions.mjs` |
| scale | spring: stiffness 550, damping 30. When going to 0: damping 2√550 ≈ 46.9 (no bounce). | same |
| opacity, colour, everything else | 0.3s, ease [0.25, 0.1, 0.35, 1] | same |
| 3 or more keyframes | 0.8s | same |
| `layout` / `layoutId` (card to page) | 0.45s, ease [0.4, 0, 0.1, 1] | `projection/node/create-projection-node.mjs` |
| Spring with no settings | stiffness 100, damping 10, mass 1. Duration form: 0.8s, bounce 0.3, visualDuration 0.3s. Rest: speed 2 / delta 0.5 (granular .01 / .005). Max 10s. | `animation/generators/spring.mjs` |
| keyframes() with no settings | 300ms, easeInOut | `animation/generators/keyframes.mjs` |
| Drag release (momentum) | inertia: timeConstant 750ms, restDelta 1, restSpeed 10. Edge spring stiffness 200, damping 40 when elastic. dragElastic 0.35. | `framer-motion/.../VisualElementDragControls.mjs`, `drag/utils/constraints.mjs` |
| inertia() with no settings | power 0.8, timeConstant 325ms, edge spring 500 / 10 | `animation/generators/inertia.mjs` |

**The same numbers ship on anthropic.com.** Its bundle contains `{duration:.45, ease:[.4,0,.1,1]}` and the 500/25 and 550 springs, so the Claude launch page runs the same defaults (`docs/refs/anthropic/summary.md`, "JS: springs" and "tween objects").

**How the BRIEF §8 tokens compare to the engine:**
- **Tab pill:** BRIEF {500, 35} is the engine's x/y spring (500/25) with more damping, so it overshoots less.
- **Card morph:** BRIEF's spring {260, 32} is slower and softer than the engine's 0.45s layout default.
- **Sheet:** BRIEF {300, 34} has no engine equivalent. Keep it as a token.

## The examples gallery (write-up, search snapshots)
- **Categories seen:**
  - Gallery: Showcase, Coverflow, Grid, Helix, Sphere
  - Carousel: Autoplay, Parallax, Vertical, Loop
  - Ticker: RTL, Draggable, Vertical
  - Cursor: Floating target, Magnetic target
  - Drag
  - UI: Sheet Modal, Command Palette, Context Menu
- **Size:** 370+ to 510+ examples across snapshots. Some are Motion+ (paid).
- **Not seen:** whether gallery cards play their example on hover, how the filter re-flows the grid, and every timing. Film these (TO-FILM).

## Moves Hanzo should borrow
Measured engine values are given where they exist. Each move names its kind of motion, because JAMES.md rule 9 says scroll is at most half of a page's motion.

1. **Card to page (`layoutId`). State change.**
   - **Pages:** Catalogue and home product cards.
   - **Timing:** engine default 0.45s [0.4, 0, 0.1, 1] until synchronized.studio is filmed (`docs/refs/synchronized/SPEC.md`).
2. **Tab and toggle pill (`layoutId` glide). State change.**
   - **Pages:** Utility (/pricing monthly or yearly), Catalogue (/models filters), Developer (code-language tabs).
   - **Timing:** BRIEF's spring {500, 35}.
3. **Draggable ticker or rail with inertia. Pointer and idle.**
   - **Pages:** Catalogue (model and integration rails) and System (a logo or customer wall, if Hanzo's copy has one).
   - **Behaviour:** idle drift, plus drag with the engine's release (timeConstant 750ms, elastic 0.35).
4. **Magnetic target on the one ask. Pointer.**
   - **Pages:** Launch heroes and the sticky ask bar.
   - **Behaviour:** the button leans toward the pointer within a small radius, only under `(hover:hover) and (pointer:fine)`. JAMES.md lists "magnetic asks".
5. **Sheet modal rising. State change.**
   - **Pages:** Utility (the /pricing compare drawer) and Catalogue (quick view).
   - **Timing:** BRIEF's spring {300, 34}.
6. **Animated number (count-up). Arrival or time.**
   - **Pages:** Model (benchmarks), Launch and System (proof numbers).
   - **Behaviour:** 1.2s once in view, tabular figures (BRIEF §8). Only numbers already in Hanzo's copy.
7. **Typewriter. Time.**
   - **Pages:** Launch (/chat prompt) and Developer (terminal).
   - **Timing:** BRIEF §8's 40 to 70ms jitter.
8. **Scroll word reveal. Scroll.**
   - **Pages:** Story (/about belief line). Count it in the scroll half.
9. **Hide-on-scroll header. Scroll.**
   - **Pages:** global.
   - **Measured:** anthropic.com's header does this with `transform .3s ease` (`docs/refs/anthropic/SPEC.md`).

## Sources
- Engine: `node_modules/motion-dom/dist/es/animation/utils/default-transitions.mjs`, `.../animation/generators/spring.mjs`, `.../keyframes.mjs`, `.../inertia.mjs`, `.../projection/node/create-projection-node.mjs`, `node_modules/framer-motion/dist/es/gestures/drag/VisualElementDragControls.mjs`
- Gallery snapshots (write-up): https://motion.dev/examples, https://motion.dev/examples?category=carousel, https://motion.dev/ui/galleries
