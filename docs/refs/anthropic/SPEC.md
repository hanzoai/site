# anthropic.com/claude-sonnet-5-5: FILMED AND MEASURED (7 Nov)

**Files:**
- `desktop.mp4`: 1470×801 walk, 33s, cut as described under Caveats.
- `phone.mp4`: 375×812 walk, 46s.
- `frames/`:
  - `d-1s`: the intro clip
  - `d-5_5s`: the name over the Earth window
  - `d-10s`: nav hovers
  - `d-20s`, `d-30s`: the article
  - `menu-desktop`: the Research dropdown
  - `p1` to `p3`: the phone
- `measure.json`: everything measured.
- `summary.md`: the readable measurements this spec was written from. Its timeline is the uncut walk.
- Tool: `docs/refs/lab/film.mjs`.

**Labels:**
- **CDP:** the browser's own animation records (Animation domain) while a person hovered, scrolled and opened menus.
- **computed:** `getComputedStyle` and `getAnimations()`.
- **CSS / JS:** the stylesheets and bundles the page ships, read directly.

**Caveats:**
- **Slow-motion intro.** This container has no GPU, so the WebGL intro renders at about 0.5 fps (2s frames).
  - **What the video shows:** the first 18.6s of the walk (the arrival) at 3× speed, which is still slower than real life. Then a cut (a 52s slow scroll past the hero is removed). Then the real-speed walk: pointer sweep, nav hovers, Research menu, one screen at a time with a hover on each.
  - **Timings are unaffected:** they come from CDP and the page's own code, not from the video.
- **Missing images.** Customer logos and images on `assets.claude.com` were blocked by the network policy, so those tiles are blank in the video.

## What I saw

1. **Arrival is a short film, not a fade.**
   - The page opens full-bleed on near-black `#0d0c0b` with the header hidden.
   - Two 2-second macro clips play through a WebGL2 window: a rotary phone dial at 2× speed, then a tachometer from its midpoint.
   - The window then becomes a spacecraft cupola looking down on a rendered Earth (clouds, terminator), and the model name appears over it. The name is set in an SVG title with a faint cool glow (blur 14, `#c9d4ff` at 16%).
   - The Earth comes from a packed dataset, `cupola.gz.bin`, with tables for the earth, clouds and the window outline.
   - The date eyebrow and a four-item contents list `(1) Introduction … (4) Getting started` follow.
   - A quiet "Skip intro" sits at the bottom.
2. **The page turns to light reading.** Below the hero it is ivory `#faf9f5`, one 720px serif reading column, and a large serif lead paragraph.
3. **A side contents rail fades in once the hero has gone.**
   - **Shape:** dashes on the left edge, pinned 351px from the top.
   - **Behaviour:** hovering a dash shows a black pill with the section name. Dragging the rail scrubs the whole page.
4. **Benchmarks are a real table, not cards.**
   - **Scrolling:** the header row sticks under the 84px site header, and the first column sticks.
   - **Highlight:** the new model's column is tinted pale blue `#c5d3e0`.
   - **Views:** tabs switch the benchmark view.
5. **Charts draw themselves:** lines stroke in, then the points fade in one by one.
6. **Quotes in a carousel.** The quotes sit in a carousel whose height eases to each quote. Name tabs (Epic Games, Every…) switch the quote.
7. **Prompt comparisons stream.** "Creating murmurations", "Shaping sand dunes", "Building a clock of clocks": the response appears word by word.
8. **Footnotes close the page:** four method footnotes in 15px serif.
9. **Phone:** the same story in one column. The h1 is 32px, the article padding is 80 / 96px, and the side rail is hidden below 1080px.

## Motion measured

### Not scroll-driven (the larger share on this page)

| Moment | Kind | Values | Source |
|---|---|---|---|
| Film intro | time | Clip 1 lasts 2s at playbackRate 2; clip 2 lasts 2s starting from 50% of its video; total M = 4s. The title phase follows. "Skip intro" hides 2.74s into it, the scroll cue appears at 3.7s, and Skip jumps to 4.7s. The whole intro is about 8.5s. The hero is one 100vh track. | JS (`mountLaunchHero`, `cupola`) |
| Idle at top | time | About 80% of pixels change in 2s with no input (the film); 14 DOM changes | lab pixel diff |
| Header over the hero | state | Hidden, `translateY(-100%)`, while the hero holds the screen. Fallback: returns after 6s via a 0.3s animation. When the hero ends: background and colour transition 1.1s; while scrolling: 0.3s. | CSS |
| Scroll cue | idle loop | 8s ease-in-out, infinite: invisible 0–50%, fades in by 56%, holds to 94%, fades out | CSS `rdpyvG_scrollcue` |
| Chart draw-in | time (once) | Lines: `stroke-dashoffset` 700ms quart-out, delays 0 / 120 / 240 / 360ms. Points and labels: opacity 300ms quart-out, delays 490 to 1010ms in 40ms steps. Fired on mount, about 1.2s after load, not when in view. | CDP |
| Streaming answer | time | Starts 450ms after it shows, then 1 word every 120ms; each word fades over 320ms. Before hydration the words appear together after 4s. | JS + CSS |
| Quote carousel | state | Slide: opacity 220ms ease + transform 340ms quart-out. Stage height: 350ms quart-out (auto-height). | CDP + computed |
| Benchmark tabs | state | Text colour 150ms quart-out; "More views" background 200ms ease | CDP |
| Side contents rail | state (scroll-aware) | Rail fades in 300ms when the first section reaches 50% of the viewport. Pill: opacity and transform 180ms ease. Dash: width, opacity and background 250ms ease. Drag scrubs the page. | CSS + JS + CDP |

### Pointer (hover and press)

| Control | Response | Source |
|---|---|---|
| Nav pill (News, Search, menu) | Background `#f5f4ed`→`#e8e6dc`, text `#3d3d3a`→`#141413`, plus a 1px ring (box-shadow). 200ms ease-in-out, no movement, no layout jump. | CDP + computed |
| Dropdown trigger (Research, Policy…) | Inverts to black pill with ivory text (opening the menu), 150ms ease-in-out. Chevron rotates 180° in 150ms ease-out. | CDP + computed |
| Dropdown press | Background `#141413`→`#b7b5ad` and the chevron turns further. A real press state. | lab press test |
| Dropdown panel | Opacity + transform 150ms ease (`--nav-dropdown-duration:.15s`); white panel, 8px radius, 2 columns | CDP + CSS |
| Wordmark | Hover slides the logo wrapper from 71.6px offset to 0 in 633ms ease | CDP + computed |
| Text links (footer, triggers) | Colour 100 to 150ms ease-out | CDP |
| Search field | Clip-path swap 300ms `cubic-bezier(.25,1,.5,1)` | computed |
| Cards and quotes | No hover change (cursor stays auto). Only controls answer. | lab hover test |
| Custom cursor | None | lab cursor test |

**Phone menu:** height 100ms ease-out, panel opacity 150ms.

### Scroll-driven (the smaller share)
- The scroll sample (10 positions, down and back up) found **no scroll-linked transforms**.
- Only the side rail (pinned) and the sticky table heads respond to scroll.
- The hero scene follows the scroll in WebGL (it hands over the nav as it leaves). That is outside CSS, so it is not sampled.
- No ScrollTrigger configs or CSS scroll timelines fire on this page, although GSAP, ScrollTrigger and Lottie are present in the bundles.

### Easing and duration system (CSS)
- **Curves** (`:root` variables):
  - `--ease-out-quart: cubic-bezier(.165,.84,.44,1)`, the house UI curve (34 elements)
  - `--ease-in-out-quart: (.77,0,.175,1)`
  - `--ease-in-out-expo: (1,0,0,1)`
  - `--ease: (.65,0,.35,1)` (18s idle icon cycles)
  - `--hero-ease: (.2,.8,.2,1)`
  - `--ease-in-rise: (.16,1,.3,1)`, the same curve as Hanzo's `ease-out-expo`
  - `--ease-in-opacity: (.2,.7,.1,1)`
- **Durations shipped:** .2s ×70, .3s ×43, .15s ×42, .25s ×24, .5s ×12. Nothing in the UI is longer than .7s except the hero.
- **Word rise** (shipped for another hero in the bundle; not seen firing here):
  - opacity 0.5s `(.2,.7,.1,1)`
  - translateY .42em → 0 over 0.8s `(.16,1,.3,1)`
  - blur 4px → 0 over 0.5s
  - 34ms per word
- **Motion library:** framer-motion defaults appear in the bundle, `{duration:.45, ease:[.4,0,.1,1]}` and springs 500/25 and 550, the same as Hanzo's engine (`docs/refs/motion-dev/SPEC.md`).
- **Reduced motion:** 90 `prefers-reduced-motion` rules.

## Layout measured (computed)

**Desktop, 1470×801.** The page is 10,103px tall, 12.6 screens.

| Element | Size / line height / tracking / weight / face |
|---|---|
| h1 (model name) | 91.2px / 1.05 / -0.012em / 400 / Anthropic Serif, `#f2ede4` on `#0d0c0b` |
| Eyebrow (date) | 14px / 1 / +0.12em / 500 / Sans, uppercase |
| Lead paragraph | 28px / 1.29 / 0 / 400 / Serif |
| h2 | 32px / 1.2 / 0 / 400 / Serif |
| h3 | 21.4px / 1.25 / 600 / Serif |
| Body | 16.7px / 1.53 / Serif (37 paragraphs) |
| Quotes | 16.7px / 1.53 / Sans |
| UI tabs | 15px / 1.55 / 600 / Sans |
| Nav | 13 to 16.7px Sans |
| Footnotes | 15px / 1.6 / Serif |

**Grid tokens (CSS):**

| Width | Columns | Margin | Gutter | Section space (sm / md / lg) | Page top |
|---|---|---|---|---|---|
| Below 768px | 4 | 32px | 16px | 24 / 32 / 48 | 48 |
| From 768px | 12 | 48px | 16px | 32 / 48 / 64 | 64 |
| From 1280px | 12 | 80px | 16px | 48 / 64 / 96 | 80 |

- **Reading column:** max 720px.
- **Article padding:** 128px top and bottom (phone 80 / 96).
- **Radii:** 8px cards, 999px pills. **Flex gaps:** 8px (most), 16px.

**Colours (by area):**
- **Backgrounds:** `#faf9f5` ivory, `#141413` and `#0d0c0b` near-blacks, `#efeee9` and `#f5f4ed` panels, `#c5d3e0` the highlighted benchmark column.
- **Text:** `#141413`, then `#5e5d59`, `#87867f`, `#b0aea5`.
- Warm greys throughout; no accent hue except the one data column.

**Phone, 375×812.** The page is 14,032px tall, 17.3 screens.
- h1 32px / 1.05; lead 22 / 1.36; h2 23 / 1.25; body 16 / 1.53.
- The grid becomes 4 columns.

## Moves Hanzo should borrow

1. **A film intro that resolves into the model's name.**
   - **Pages:** Model (flagship /models/* and /zen launches).
   - **Behaviour:** about 8.5s total: 2 clips of 2s, then the name. Skippable, with Skip hidden 2.74s into the title phase. The header stays hidden until the hero hands over.
   - **Hanzo version:**
     - Hanzo's own model media through a single window.
     - The name in Hanzo's display face at ≥72px with line height ≤1.05 (measured here: 91px / 1.05 / -0.012em).
     - A lighter path: on a device without a GPU this hero renders at about 0.5 fps, so ship the static title fallback the page itself has (`data-hero-failed`).
2. **Benchmarks as a sticky table, with the new model's column tinted.**
   - **Pages:** Model, /benchmarks, /compare, /leaderboard.
   - **Behaviour:** the head sticks under the header (top = header height) and the first column sticks.
   - **Colour:** Hanzo's tint must be a silver or grey, not blue (0 brand hues).
3. **Charts that draw themselves.**
   - **Pages:** Model, Launch proof sections, /benchmarks.
   - **Timing:** lines over 700ms quart-out, staggered 120ms; points 300ms in 40ms steps after about 490ms.
   - **Improvement:** trigger when in view. Anthropic fires on mount, so the chart has already drawn by the time you arrive.
4. **A streaming answer as the "try it" moment.**
   - **Pages:** Model, Launch (/chat, /agents).
   - **Timing:** a 450ms pause, then a word every 120ms, each fading in over 320ms.
   - **Why:** this is time-based motion, not scroll, which James asked for. Use real Hanzo prompt and output text only.
5. **A side contents rail that appears after the hero, with a drag-to-scrub pill.**
   - **Pages:** Story (blog posts, /history), Model, Utility (legal).
   - **Timing:** rail fade 300ms; pill 180ms; hidden below 1080px.
6. **Nav pills that answer without moving.**
   - **Pages:** global header.
   - **Hover:** tone step plus a 1px ring, 200ms ease-in-out.
   - **Opening:** the trigger inverts to black, 150ms, and the chevron flips 180° (ease-out). Press darkens the pill.
   - **Rule match:** this meets James's rule 4 (hover changes something other than opacity, with no layout jump) using greys only.
7. **One house curve and short UI durations.**
   - **Pages:** every page.
   - **Values:** quart-out `(.165,.84,.44,1)` for UI at 150 to 350ms, and expo-out `(.16,1,.3,1)` for rises. Nothing in the UI over 0.7s.
   - **Token match:** Hanzo's `ease-out-expo` token already equals Anthropic's `--ease-in-rise`. Add quart-out as the UI token.
8. **An idle scroll cue that breathes.**
   - **Pages:** Launch and Model heroes.
   - **Timing:** an 8s ease-in-out loop, invisible for half the cycle. A slow idle motion so the first screen is never dead.
9. **Quotes in an auto-height carousel switched by name tabs.**
   - **Pages:** System (/enterprise, /customers).
   - **Timing:** slide 220 / 340ms; height 350ms quart-out.
10. **Footnotes for every figure.**
    - **Pages:** Model, Launch, Proof pages.
    - **Behaviour:** 15px serif at the foot. This is how a launch page keeps big numbers honest, which matches James's "every number traces to Hanzo's copy".
