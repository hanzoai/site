# Reference Lab: index (7 Nov)

**What this is.** Measured reference motion for the chats rebuilding Hanzo's pages. Use these values instead of guesses. Each folder has a `SPEC.md` with what was seen, the values, and the moves to borrow.

**Honest status.** The cloud network blocks every reference except anthropic.com. Creating a network environment needs James, so it waits for him. So:
- **Filmed and measured** in a real browser (video, frames, CDP animation records, CSS/JS values, scroll sampling, layout): **anthropic.com**.
- **Measured from code:** **the motion engine Hanzo ships** (`node_modules/motion` 12.23.24).
- **Not filmed:** the other 6 references. Their specs use only labelled sources ("earlier code read" from BRIEF-v3 §9, "write-up" from web search). Every "provisional" move must be re-checked against a filmed run.
- **What to film once allowed:** `TO-FILM.md` has the hosts to allow, one command per site, and the questions each run must answer.
- **The tool:** `lab/film.mjs` films and measures any URL. See TO-FILM.md.

| Reference | Folder | State | Its job for Hanzo (JAMES.md) |
|---|---|---|---|
| anthropic.com/claude-sonnet-5-5 | `anthropic/` | **Filmed + measured** (desktop.mp4 33s, phone.mp4 46s, 9 frames, measure.json, summary.md). The video's WebGL intro plays in slow motion because this container has no GPU; timings come from the browser and code. | A model launch told as a story; benchmarks as hero figures |
| motion (engine) and motion.dev/examples | `motion-dev/` | **Engine measured from code**; gallery not filmed | The engine's real defaults and its named patterns |
| synchronized.studio | `synchronized/` | Not filmed (blocked) | The card opens into its page |
| apple.com iPhone Pro and MacBook Pro | `apple/` | Not filmed (blocked); Apple type values from its own CSS (search snippets) | One idea per screen, pinned scenes, huge type, a sub-nav with the ask |
| osply.co | `osply/` | Not filmed (blocked) | Editorial scale, line-mask headings, copy-in-place |
| hamol.studio | `hamol/` | Not filmed (blocked) | Numbered catalogue, detail overlay, spatial scene |
| grubogrubo.com | `grubogrubo/` | Not filmed (blocked) | Single-slot caption, informative hover, closing band |
| chatgpt.com/business/enterprise | `chatgpt-enterprise/` | Not filmed (blocked) | Calm trust: one ask, proof after claim, security as a list |

Also in this folder, not from the Lab: `hanzo-model-cards/`, another chat's measured spec of hanzo.ai's own live model cards.

## Measured numbers to use now

Taken from `anthropic/SPEC.md` (browser-measured) and `motion-dev/SPEC.md` (engine code).

| Use | Value | Source |
|---|---|---|
| UI hover (colour, background, ring) | 150 to 200ms, ease-in-out | anthropic nav pills (CDP) |
| Text-link hover | 100 to 150ms, ease-out | anthropic (CDP) |
| Dropdown open | 150ms: opacity + transform, ease; the chevron flips 180° in 150ms ease-out | anthropic (CDP, CSS `--nav-dropdown-duration:.15s`) |
| House UI curve | quart-out `cubic-bezier(.165,.84,.44,1)`, 150 to 350ms | anthropic CSS `--ease-out-quart` (34 elements use it) |
| Rise-in (words, lines) | 0.8s `cubic-bezier(.16,1,.3,1)` from translateY(.42em), with opacity 0.5s `(.2,.7,.1,1)` and blur 4px→0 0.5s; 34ms word stagger | anthropic CSS (shipped in this page's bundle for another hero; not seen firing on this page) |
| Chart draw-in | lines: stroke-dashoffset 700ms quart-out, staggered 120ms; points: opacity 300ms, 40ms steps from 490ms | anthropic (CDP) |
| Streaming text (time, not scroll) | wait 450ms, then 1 word every 120ms, each fading in over 320ms | anthropic JS + CSS |
| Idle scroll cue | 8s ease-in-out loop: hidden for half, shown 56 to 94% | anthropic CSS |
| Header over a dark hero | hidden over the hero; colour change 1.1s when the hero ends; 0.3s once scrolling | anthropic CSS |
| Card to page (layoutId) | 0.45s, ease [0.4, 0, 0.1, 1] (engine default) until synchronized.studio is filmed | motion code |
| Engine defaults | x/y/rotate: spring 500/25. Scale: spring 550/30. Opacity and colour: 0.3s [0.25, 0.1, 0.35, 1]. Drag release: timeConstant 750ms, elastic 0.35. | motion code |
| Type, model launch | h1 91px / lh 1.05 / -0.012em serif; lead 28 / 1.29; body 16.7 / 1.53 serif; reading column 720px; article padding 128px (phone 80 / 96) | anthropic (computed) |
| Type, Apple super headline | 80px / 1.05 / -0.015em, weight 600; 64px / 1.0625 at ≤1068px | Apple CSS (snippet, other Apple pages) |

## Moves by Hanzo page type (where each borrow lands)

| Page type | Borrow (folder) |
|---|---|
| **Launch** (home, /chat, /dev, /agents, cloud products) | Sub-nav that gains the ask after the hero (apple) · 80px / 1.05 product type (apple) · pinned 2 to 4 beats, under 2.5 screens (apple) · single-slot caption `01 / 05` (grubogrubo) · magnetic ask, typewriter (motion-dev) · edge-anchored hero text (synchronized) · idle scroll cue (anthropic) |
| **Model** (/models/*, /zen) | Film-intro hero that resolves into the name, about 8.5s, skippable, with a static fallback (anthropic) · benchmark table with sticky head and first column, own column tinted grey (anthropic) · charts that draw themselves (anthropic) · streaming answer demo (anthropic) · footnotes for every number (anthropic, apple) |
| **System** (/enterprise, /platform, /security, /trust) | One ask, one label, three places (chatgpt) · proof straight after the claim (chatgpt) · security as a calm list (chatgpt) · spatial scene with a Static view (hamol) · quote carousel with auto-height (anthropic) |
| **Catalogue** (/models, /integrations, /oss, /solutions, /templates, /cloud) | Card opens into its page (synchronized, motion-dev) · persistent stage with a URL; Back or Esc closes (synchronized) · cursor label "Open" on pointer:fine only (synchronized) · `01 / 09` counter (hamol) · informative hover per card (grubogrubo) · prefetch on intent (osply) · draggable rail with inertia (motion-dev) |
| **Story** (/about, /history, /blog, /investors) | Line-mask headings, 1.2s (osply) · side table of contents that appears after the hero, with a drag-to-scrub pill (anthropic) · 720px serif reading column (anthropic) · scroll word reveal (motion-dev) |
| **Utility** (/pricing, /contact, /download, legal) | Copy-in-place confirmation (osply) · tab pill glide (motion-dev) · sheet or compare drawer (motion-dev) · one inverted tile (grubogrubo) |
| **Developer** (/api, /cli, /sdks, /mcp) | Copy command in place (osply) · typewriter terminal (motion-dev) · scroll-scrubbed video, /dev only (grubogrubo) |
| **All pages** | Closing ask repeats the hero's (apple) · closing band with whole-row hit areas (grubogrubo) · white-alpha hierarchy on near-black (osply) · no scroll-jacking (apple) |
