# Motion map: one signature per page (James, 7 Nov)

Every page used to move the same way: hero, then pinned scroll chapters, then proof, then a closing band. James:
"just don't have every page following the same process". Keep each page's **layout**; change how it **moves**.

## The rules

1. Each page's **signature** (below) is its main interaction, built once and well, in the first or second screen.
2. **No fixed section order.** MASTER.md's screen list is a menu, not a sequence. Start some pages with the demo, some with a statement, some with the signature itself.
3. **The pinned-chapters scene (`split`) only where this map assigns it.** Elsewhere, remove pinned/sticky chapter scenes and scroll-scrubbed reveals that every page shares; replace them with the signature or plain, quick sections.
4. **Supporting motion differs too:** no shared reveal on every section. At most one reveal style per page, and not the line-mask cut-in on every heading.
5. Never remove motion James approved (`keep`), hover effects, counters or marquees. Layouts, copy and Hanzo's colours stay.
6. A signature is used by at most 7 pages and never by two neighbours in the tour (`/wall/`). Regenerate with `python3 scripts/motion_map.py`.
7. **Entrances (James: "make them enter the screen different ... vertical or merge together").** Each page also gets 5 entrances from the library below: its main sections each arrive a different way, in the order listed. No entrance repeats inside a page or with the page before it. Build them page-local (`components/pages/<page>/...`), not as one shared reveal.

## Entrance library

- **`split-merge`**: two halves slide in from left and right and merge into one
- **`curtain-rise`**: rises from below behind a clip, like a curtain
- **`drop-in`**: falls in from above and settles with a small bounce
- **`iris`**: a circular clip opens from the centre
- **`diagonal-wipe`**: a diagonal clip sweeps across
- **`letter-cascade`**: letters fall into place one by one
- **`word-shuffle`**: words arrive out of order and swap into place
- **`grow-from-point`**: grows from the point the visitor last clicked or the cursor
- **`fold-out`**: unfolds like paper (rotateX from a hinge)
- **`card-deal`**: items are dealt from a deck onto their places
- **`slot-roll`**: text rolls vertically into place like a slot machine
- **`typewriter`**: types itself out with a caret
- **`rack-focus`**: comes into focus from a blur, like a camera pulling focus
- **`pixel-resolve`**: resolves from coarse pixels to sharp
- **`tile-flip`**: a grid of tiles flips in to form it
- **`blinds`**: venetian-blind strips open
- **`zoom-through`**: flies in from far behind the screen
- **`swing-door`**: swings in on a vertical hinge (rotateY)
- **`spring-snap`**: snaps in from the side and overshoots on a spring
- **`magnet-gather`**: scattered pieces are pulled together into it
- **`explode-gather`**: starts as fragments and collapses into the whole
- **`ink-spread`**: an organic ink-blot mask spreads to reveal it
- **`line-draw`**: its outlines draw themselves, then it fills
- **`count-roll`**: its numbers count and roll into their values
- **`stack-drop`**: layers drop and stack onto each other
- **`depth-parallax`**: layers at different depths move at different speeds
- **`conveyor`**: rides in on a horizontal conveyor
- **`shutter`**: bars close from top and bottom, then open on it
- **`glitch-in`**: a short monochrome glitch, then it holds still
- **`ripple`**: a ripple spreads from the centre and leaves it behind
- **`domino`**: items tip into place one after another like dominoes
- **`accordion`**: unfolds section by section like an accordion
- **`page-curl`**: the previous surface curls away at the corner to show it
- **`pendulum`**: swings in and settles like a pendulum
- **`orbit-in`**: items orbit into their places on a curve
- **`squash-land`**: lands with a squash and stretch
- **`focus-pull-scroll`**: the background blurs and the subject sharpens as it scrolls in
- **`invert-flash`**: a black/white inversion flash, then normal
- **`grid-wave`**: a grid ripples in by distance from the cursor
- **`scroll-tilt`**: tilts on rotateX with scroll speed and levels out
- **`sticky-stack`**: cards stack at the top as you scroll past them
- **`snap-sections`**: sections snap one screen at a time
- **`side-carousel`**: a horizontal snapping carousel
- **`text-mask-film`**: a film plays through the letters of a headline
- **`opposite-drift`**: left and right halves drift in opposite directions with scroll
- **`shrink-to-card`**: the section shrinks into a card as you leave it
- **`cover-slide`**: the next section slides up over the previous one
- **`pull-back`**: starts zoomed right in and pulls back to reveal the whole
- **`tilt-3d-hover`**: tilts in 3D toward the pointer
- **`cursor-trail`**: a trail follows the cursor across it
- **`velocity-skew`**: skews with scroll speed and straightens when still
- **`inertia-drag`**: can be dragged and thrown with inertia
- **`scramble`**: characters scramble and decode into it
- **`underline-sweep`**: underlines sweep under key words in sequence
- **`stretch-scroll`**: stretches vertically with scroll and relaxes
- **`noise-dissolve`**: dissolves in from grain/noise
- **`cursor-lens`**: a circular lens follows the cursor and magnifies
- **`vertical-ticker`**: rides a vertical ticker into place
- **`spiral-in`**: spirals in from the edge to its place
- **`venetian-type`**: each line of type slides in from alternating sides

## Signatures

- **`drag-canvas` Drag to explore** (7 pages): An infinite canvas the visitor pans with the pointer (or a finger); the product's parts are laid out on it.
- **`zoom-map` Zoom into the system** (7 pages): Scroll zooms from the whole system down into one part, which then fills the screen and explains itself.
- **`h-gallery` Sideways gallery** (7 pages): Vertical scroll drives a horizontal track of panels; the page moves sideways for one stretch, then releases.
- **`spotlight` Spotlight** (7 pages): A dark section the cursor lights up; what is under the light reveals detail (touch: tap to place the light).
- **`compare` Before / after slider** (7 pages): A divider the visitor drags across two states: without Hanzo and with it, old and new.
- **`card-stack` Card stack** (2 pages): A stack of cards flicked or dragged away one at a time; each card is one idea.
- **`terminal` Live terminal** (7 pages): A terminal types the real commands and streams real output; the visitor can pick the next command.
- **`object-3d` Turn the object** (1 pages): One 3D object (or 2.5D layered render) the visitor drags to rotate; parts label themselves as they face front.
- **`film-scrub` Scrub the film** (5 pages): Scroll scrubs a film or image sequence frame by frame, forwards and back.
- **`race` Live race** (7 pages): Bars, lanes or counters race against each other in real time, at the real ratios.
- **`graph` Living graph** (7 pages): Nodes and links that settle like a physics graph; hovering a node lights its paths and names them.
- **`split` Split screen** (1 pages): One side holds still while the other scrolls and changes it (the old pinned-chapters scene: rationed).
- **`decode` Decode** (5 pages): Headlines and figures resolve out of scrambled characters as they arrive; hovering re-scrambles them.
- **`magnet-grid` Magnetic grid** (4 pages): A field of tiles or dots that bends toward the cursor and ripples when clicked.
- **`timeline` Drag the timeline** (5 pages): A timeline the visitor drags or scrubs; the page's content changes with the year or step.
- **`rows-open` Rows that open** (7 pages): A tight list whose rows expand in place on hover or tap into a full detail panel.
- **`live-chat` Live conversation** (6 pages): The product answers in real time on screen, with a choice of questions to ask it.
- **`flip-board` Flip board** (7 pages): Departure-board tiles flip through values (statuses, prices, regions) as data changes.
- **`ribbons` Velocity ribbons** (1 pages): Bands of words or logos whose speed and direction follow the scroll and lean with it.
- **`peel` Peel the layers** (4 pages): The product's stack lifts apart into floating layers in 3D, then closes again.
- **`word-light` Words light up** (7 pages): A long statement lights word by word as it is read (story pages).
- **`stamp` Stamp** (6 pages): Elements land with weight: a short drop, a squash and a settle, like stamping a document.
- **`globe` Globe** (7 pages): A turning globe with live points and arcs between regions; drag to spin it.
- **`particles` Particles form it** (5 pages): A cloud of dots assembles into the product's shape or mark and scatters at the cursor.
- **`morph-panel` One panel, many states** (4 pages): A single panel that morphs smoothly between states as tabs or steps change, never cutting.
- **`waveform` Waveform** (2 pages): A live audio waveform that plays, scrubs and reacts to the pointer (voice and audio pages).
- **`calculator` Live calculator** (7 pages): Sliders and inputs that reprice or re-plan everything on the page instantly.
- **`one-question` One question at a time** (7 pages): A form that asks one thing per screen, sliding to the next, with the answer summarised as it builds.
- **`keep` Keep as is** (1 pages): James approved this page's motion (7 Nov). Do not change it.

## Pages, in tour order

| Page | Signature | Section entrances, in order |
|---|---|---|
| `/` | `keep` Keep as is | keep as is |
| `/enso` | `particles` Particles form it | `fold-out`, `cursor-lens`, `ink-spread`, `word-shuffle`, `orbit-in` |
| `/iro` | `compare` Before / after slider | `velocity-skew`, `explode-gather`, `depth-parallax`, `rack-focus`, `accordion` |
| `/kai` | `live-chat` Live conversation | `zoom-through`, `snap-sections`, `cover-slide`, `blinds`, `split-merge` |
| `/koe` | `waveform` Waveform | `typewriter`, `slot-roll`, `pendulum`, `inertia-drag`, `noise-dissolve` |
| `/koma` | `film-scrub` Scrub the film | `drop-in`, `domino`, `opposite-drift`, `curtain-rise`, `magnet-gather` |
| `/models` | `race` Live race | `pull-back`, `text-mask-film`, `vertical-ticker`, `spring-snap`, `tile-flip` |
| `/mori` | `particles` Particles form it | `shrink-to-card`, `side-carousel`, `pixel-resolve`, `card-deal`, `scramble` |
| `/oto` | `waveform` Waveform | `sticky-stack`, `stack-drop`, `grid-wave`, `cursor-trail`, `conveyor` |
| `/uta` | `film-scrub` Scrub the film | `page-curl`, `iris`, `scroll-tilt`, `count-roll`, `spiral-in` |
| `/zen` | `particles` Particles form it | `diagonal-wipe`, `letter-cascade`, `tilt-3d-hover`, `glitch-in`, `focus-pull-scroll` |
| `/agents` | `live-chat` Live conversation | `squash-land`, `ripple`, `venetian-type`, `grow-from-point`, `stretch-scroll` |
| `/api` | `terminal` Live terminal | `line-draw`, `underline-sweep`, `invert-flash`, `shutter`, `swing-door` |
| `/bot` | `live-chat` Live conversation | `tile-flip`, `ripple`, `grid-wave`, `fold-out`, `grow-from-point` |
| `/chat` | `card-stack` Card stack | `glitch-in`, `tilt-3d-hover`, `line-draw`, `underline-sweep`, `scramble` |
| `/chrome` | `terminal` Live terminal | `rack-focus`, `scroll-tilt`, `orbit-in`, `cover-slide`, `pull-back` |
| `/cli` | `compare` Before / after slider | `noise-dissolve`, `shutter`, `side-carousel`, `curtain-rise`, `cursor-trail` |
| `/computer` | `terminal` Live terminal | `conveyor`, `squash-land`, `venetian-type`, `diagonal-wipe`, `card-deal` |
| `/console` | `drag-canvas` Drag to explore | `sticky-stack`, `depth-parallax`, `vertical-ticker`, `spring-snap`, `velocity-skew` |
| `/design` | `compare` Before / after slider | `drop-in`, `explode-gather`, `opposite-drift`, `word-shuffle`, `count-roll` |
| `/desktop` | `terminal` Live terminal | `swing-door`, `domino`, `inertia-drag`, `shrink-to-card`, `page-curl` |
| `/dev` | `compare` Before / after slider | `stack-drop`, `letter-cascade`, `pendulum`, `slot-roll`, `zoom-through` |
| `/download` | `terminal` Live terminal | `accordion`, `invert-flash`, `text-mask-film`, `ink-spread`, `spiral-in` |
| `/extension` | `compare` Before / after slider | `iris`, `pixel-resolve`, `split-merge`, `stretch-scroll`, `cursor-lens` |
| `/gen` | `film-scrub` Scrub the film | `magnet-gather`, `focus-pull-scroll`, `snap-sections`, `typewriter`, `blinds` |
| `/gui` | `compare` Before / after slider | `split-merge`, `velocity-skew`, `domino`, `cursor-lens`, `grow-from-point` |
| `/ide` | `terminal` Live terminal | `venetian-type`, `spring-snap`, `blinds`, `rack-focus`, `tilt-3d-hover` |
| `/identity` | `spotlight` Spotlight | `line-draw`, `ink-spread`, `typewriter`, `stretch-scroll`, `conveyor` |
| `/kata` | `terminal` Live terminal | `drop-in`, `shutter`, `vertical-ticker`, `focus-pull-scroll`, `shrink-to-card` |
| `/mcp` | `compare` Before / after slider | `diagonal-wipe`, `cursor-trail`, `count-roll`, `side-carousel`, `curtain-rise` |
| `/operative` | `live-chat` Live conversation | `iris`, `accordion`, `zoom-through`, `sticky-stack`, `orbit-in` |
| `/operator` | `card-stack` Card stack | `magnet-gather`, `depth-parallax`, `grid-wave`, `explode-gather`, `card-deal` |
| `/playground` | `drag-canvas` Drag to explore | `glitch-in`, `tile-flip`, `cover-slide`, `scramble`, `swing-door` |
| `/sdks` | `peel` Peel the layers | `scroll-tilt`, `fold-out`, `inertia-drag`, `pendulum`, `invert-flash` |
| `/skills` | `drag-canvas` Drag to explore | `pull-back`, `text-mask-film`, `word-shuffle`, `stack-drop`, `squash-land` |
| `/slack` | `live-chat` Live conversation | `pixel-resolve`, `page-curl`, `ripple`, `letter-cascade`, `underline-sweep` |
| `/studio` | `film-scrub` Scrub the film | `opposite-drift`, `spiral-in`, `slot-roll`, `snap-sections`, `noise-dissolve` |
| `/tag` | `drag-canvas` Drag to explore | `letter-cascade`, `blinds`, `drop-in`, `cover-slide`, `domino` |
| `/templates` | `h-gallery` Sideways gallery | `velocity-skew`, `fold-out`, `count-roll`, `explode-gather`, `shutter` |
| `/ui` | `magnet-grid` Magnetic grid | `accordion`, `page-curl`, `magnet-gather`, `cursor-trail`, `zoom-through` |
| `/analytics` | `flip-board` Flip board | `focus-pull-scroll`, `ripple`, `noise-dissolve`, `stretch-scroll`, `card-deal` |
| `/authz` | `spotlight` Spotlight | `curtain-rise`, `vertical-ticker`, `slot-roll`, `inertia-drag`, `spiral-in` |
| `/auto` | `drag-canvas` Drag to explore | `word-shuffle`, `rack-focus`, `scroll-tilt`, `iris`, `stack-drop` |
| `/automations` | `h-gallery` Sideways gallery | `underline-sweep`, `spring-snap`, `side-carousel`, `squash-land`, `grow-from-point` |
| `/base` | `zoom-map` Zoom into the system | `split-merge`, `snap-sections`, `tile-flip`, `pull-back`, `venetian-type` |
| `/benchmarks` | `race` Live race | `sticky-stack`, `glitch-in`, `swing-door`, `line-draw`, `conveyor` |
| `/billing` | `calculator` Live calculator | `pixel-resolve`, `orbit-in`, `invert-flash`, `shrink-to-card`, `depth-parallax` |
| `/blockchain` | `drag-canvas` Drag to explore | `opposite-drift`, `scramble`, `grid-wave`, `text-mask-film`, `cursor-lens` |
| `/blog` | `word-light` Words light up | `ink-spread`, `typewriter`, `pendulum`, `tilt-3d-hover`, `diagonal-wipe` |
| `/captable` | `calculator` Live calculator | `pull-back`, `zoom-through`, `inertia-drag`, `split-merge`, `count-roll` |
| `/commerce` | `flip-board` Flip board | `scroll-tilt`, `word-shuffle`, `ripple`, `cover-slide`, `vertical-ticker` |
| `/compare` | `race` Live race | `stretch-scroll`, `typewriter`, `venetian-type`, `opposite-drift`, `letter-cascade` |
| `/comparison` | `rows-open` Rows that open | `accordion`, `sticky-stack`, `noise-dissolve`, `side-carousel`, `fold-out` |
| `/crawl` | `flip-board` Flip board | `tile-flip`, `slot-roll`, `grow-from-point`, `pendulum`, `shrink-to-card` |
| `/dashboards` | `spotlight` Spotlight | `diagonal-wipe`, `curtain-rise`, `explode-gather`, `stack-drop`, `cursor-lens` |
| `/dataroom` | `drag-canvas` Drag to explore | `text-mask-film`, `iris`, `focus-pull-scroll`, `page-curl`, `ink-spread` |
| `/datastore` | `zoom-map` Zoom into the system | `spiral-in`, `shutter`, `snap-sections`, `squash-land`, `rack-focus` |
| `/dns` | `globe` Globe | `swing-door`, `invert-flash`, `drop-in`, `domino`, `depth-parallax` |
| `/edge` | `graph` Living graph | `velocity-skew`, `blinds`, `card-deal`, `glitch-in`, `cursor-trail` |
| `/engine` | `zoom-map` Zoom into the system | `line-draw`, `scramble`, `magnet-gather`, `conveyor`, `orbit-in` |
| `/features` | `h-gallery` Sideways gallery | `pixel-resolve`, `grid-wave`, `tilt-3d-hover`, `underline-sweep`, `spring-snap` |
| `/flow` | `rows-open` Rows that open | `cursor-trail`, `card-deal`, `drop-in`, `glitch-in`, `diagonal-wipe` |
| `/functions` | `peel` Peel the layers | `conveyor`, `split-merge`, `spring-snap`, `tile-flip`, `grow-from-point` |
| `/gallery` | `film-scrub` Scrub the film | `velocity-skew`, `scramble`, `text-mask-film`, `underline-sweep`, `line-draw` |
| `/gateway` | `globe` Globe | `page-curl`, `rack-focus`, `tilt-3d-hover`, `scroll-tilt`, `slot-roll` |
| `/guard` | `spotlight` Spotlight | `zoom-through`, `stack-drop`, `vertical-ticker`, `letter-cascade`, `ink-spread` |
| `/help/privacy/model-training` | `h-gallery` Sideways gallery | `cover-slide`, `depth-parallax`, `word-shuffle`, `blinds`, `shrink-to-card` |
| `/hsm` | `spotlight` Spotlight | `swing-door`, `pull-back`, `venetian-type`, `sticky-stack`, `domino` |
| `/iam` | `decode` Decode | `shutter`, `accordion`, `noise-dissolve`, `spiral-in`, `magnet-gather` |
| `/idv` | `spotlight` Spotlight | `ripple`, `focus-pull-scroll`, `invert-flash`, `grid-wave`, `iris` |
| `/ingress` | `globe` Globe | `side-carousel`, `stretch-scroll`, `inertia-drag`, `count-roll`, `curtain-rise` |
| `/insights` | `flip-board` Flip board | `pendulum`, `fold-out`, `snap-sections`, `opposite-drift`, `squash-land` |
| `/integrations` | `h-gallery` Sideways gallery | `explode-gather`, `pixel-resolve`, `orbit-in`, `typewriter`, `cursor-lens` |
| `/jin` | `rows-open` Rows that open | `squash-land`, `curtain-rise`, `pull-back`, `venetian-type`, `domino` |
| `/kai/guide` | `live-chat` Live conversation | `ripple`, `drop-in`, `tilt-3d-hover`, `line-draw`, `cover-slide` |
| `/kms` | `spotlight` Spotlight | `magnet-gather`, `blinds`, `pendulum`, `grid-wave`, `stretch-scroll` |
| `/leaderboard` | `race` Live race | `card-deal`, `rack-focus`, `focus-pull-scroll`, `orbit-in`, `letter-cascade` |
| `/learn` | `word-light` Words light up | `tile-flip`, `fold-out`, `opposite-drift`, `spiral-in`, `depth-parallax` |
| `/ledger` | `calculator` Live calculator | `stack-drop`, `velocity-skew`, `spring-snap`, `word-shuffle`, `inertia-drag` |
| `/machines` | `zoom-map` Zoom into the system | `glitch-in`, `diagonal-wipe`, `snap-sections`, `page-curl`, `noise-dissolve` |
| `/metrics` | `flip-board` Flip board | `scroll-tilt`, `swing-door`, `accordion`, `shutter`, `slot-roll` |
| `/mq` | `globe` Globe | `shrink-to-card`, `iris`, `scramble`, `count-roll`, `cursor-lens` |
| `/network` | `graph` Living graph | `split-merge`, `grow-from-point`, `typewriter`, `zoom-through`, `invert-flash` |
| `/node` | `zoom-map` Zoom into the system | `vertical-ticker`, `conveyor`, `underline-sweep`, `text-mask-film`, `side-carousel` |
| `/o11y` | `flip-board` Flip board | `ink-spread`, `explode-gather`, `pixel-resolve`, `sticky-stack`, `cursor-trail` |
| `/open-source` | `h-gallery` Sideways gallery | `snap-sections`, `magnet-gather`, `scroll-tilt`, `letter-cascade`, `ripple` |
| `/payments` | `calculator` Live calculator | `stretch-scroll`, `curtain-rise`, `word-shuffle`, `side-carousel`, `stack-drop` |
| `/platform` | `zoom-map` Zoom into the system | `inertia-drag`, `count-roll`, `spiral-in`, `underline-sweep`, `explode-gather` |
| `/pubsub` | `globe` Globe | `line-draw`, `cursor-trail`, `spring-snap`, `cover-slide`, `pixel-resolve` |
| `/realtime` | `graph` Living graph | `card-deal`, `tile-flip`, `shrink-to-card`, `vertical-ticker`, `venetian-type` |
| `/registry` | `zoom-map` Zoom into the system | `tilt-3d-hover`, `pendulum`, `opposite-drift`, `fold-out`, `invert-flash` |
| `/research` | `word-light` Words light up | `split-merge`, `focus-pull-scroll`, `scramble`, `domino`, `diagonal-wipe` |
| `/risk` | `decode` Decode | `orbit-in`, `ink-spread`, `squash-land`, `velocity-skew`, `depth-parallax` |
| `/s3` | `peel` Peel the layers | `text-mask-film`, `iris`, `shutter`, `cursor-lens`, `grid-wave` |
| `/search` | `flip-board` Flip board | `blinds`, `sticky-stack`, `zoom-through`, `pull-back`, `grow-from-point` |
| `/sentinel` | `decode` Decode | `typewriter`, `conveyor`, `glitch-in`, `page-curl`, `slot-roll` |
| `/sign` | `stamp` Stamp | `swing-door`, `drop-in`, `rack-focus`, `noise-dissolve`, `accordion` |
| `/solutions` | `h-gallery` Sideways gallery | `sticky-stack`, `invert-flash`, `pull-back`, `venetian-type`, `split-merge` |
| `/stream` | `globe` Globe | `opposite-drift`, `spring-snap`, `depth-parallax`, `snap-sections`, `cover-slide` |
| `/tabs` | `calculator` Live calculator | `squash-land`, `fold-out`, `typewriter`, `vertical-ticker`, `inertia-drag` |
| `/telemetry` | `graph` Living graph | `domino`, `ink-spread`, `text-mask-film`, `magnet-gather`, `shutter` |
| `/treasury` | `calculator` Live calculator | `accordion`, `iris`, `scramble`, `side-carousel`, `pixel-resolve` |
| `/tunnel` | `peel` Peel the layers | `noise-dissolve`, `explode-gather`, `count-roll`, `spiral-in`, `glitch-in` |
| `/visor` | `graph` Living graph | `diagonal-wipe`, `orbit-in`, `underline-sweep`, `word-shuffle`, `curtain-rise` |
| `/world` | `globe` Globe | `blinds`, `ripple`, `stretch-scroll`, `scroll-tilt`, `grow-from-point` |
| `/zap` | `calculator` Live calculator | `velocity-skew`, `page-curl`, `cursor-trail`, `drop-in`, `pendulum` |
| `/zen/7` | `particles` Particles form it | `shrink-to-card`, `letter-cascade`, `card-deal`, `focus-pull-scroll`, `stack-drop` |
| `/zen/models` | `object-3d` Turn the object | `cursor-lens`, `grid-wave`, `tile-flip`, `swing-door`, `zoom-through` |
| `/zen/zen6-max` | `particles` Particles form it | `tilt-3d-hover`, `slot-roll`, `rack-focus`, `conveyor`, `line-draw` |
| `/affiliate` | `one-question` One question at a time | `depth-parallax`, `focus-pull-scroll`, `iris`, `noise-dissolve`, `glitch-in` |
| `/beta` | `stamp` Stamp | `ripple`, `venetian-type`, `zoom-through`, `orbit-in`, `page-curl` |
| `/bounty` | `one-question` One question at a time | `conveyor`, `fold-out`, `domino`, `blinds`, `typewriter` |
| `/buying-specialist` | `stamp` Stamp | `count-roll`, `rack-focus`, `swing-door`, `tile-flip`, `split-merge` |
| `/enterprise` | `rows-open` Rows that open | `scramble`, `snap-sections`, `inertia-drag`, `diagonal-wipe`, `line-draw` |
| `/grants` | `stamp` Stamp | `grid-wave`, `stack-drop`, `pixel-resolve`, `cover-slide`, `shrink-to-card` |
| `/pricing` | `morph-panel` One panel, many states | `text-mask-film`, `grow-from-point`, `scroll-tilt`, `vertical-ticker`, `underline-sweep` |
| `/referral` | `one-question` One question at a time | `slot-roll`, `word-shuffle`, `cursor-lens`, `card-deal`, `sticky-stack` |
| `/sms-opt-in` | `stamp` Stamp | `explode-gather`, `shutter`, `velocity-skew`, `spring-snap`, `side-carousel` |
| `/startups` | `morph-panel` One panel, many states | `pendulum`, `tilt-3d-hover`, `invert-flash`, `drop-in`, `opposite-drift` |
| `/about` | `word-light` Words light up | `ink-spread`, `magnet-gather`, `squash-land`, `letter-cascade`, `accordion` |
| `/brand` | `magnet-grid` Magnetic grid | `pull-back`, `cursor-trail`, `spiral-in`, `curtain-rise`, `stretch-scroll` |
| `/careers` | `word-light` Words light up | `line-draw`, `swing-door`, `iris`, `count-roll`, `sticky-stack` |
| `/contact` | `one-question` One question at a time | `tile-flip`, `focus-pull-scroll`, `tilt-3d-hover`, `spring-snap`, `vertical-ticker` |
| `/contact-sales` | `stamp` Stamp | `pendulum`, `accordion`, `grow-from-point`, `letter-cascade`, `text-mask-film` |
| `/customers` | `word-light` Words light up | `cursor-lens`, `underline-sweep`, `curtain-rise`, `magnet-gather`, `rack-focus` |
| `/founder` | `one-question` One question at a time | `opposite-drift`, `blinds`, `spiral-in`, `diagonal-wipe`, `word-shuffle` |
| `/history` | `word-light` Words light up | `domino`, `cover-slide`, `page-curl`, `explode-gather`, `split-merge` |
| `/investors` | `timeline` Drag the timeline | `drop-in`, `snap-sections`, `glitch-in`, `zoom-through`, `inertia-drag` |
| `/legal` | `rows-open` Rows that open | `ripple`, `grid-wave`, `cursor-trail`, `scramble`, `ink-spread` |
| `/newsletter` | `one-question` One question at a time | `stretch-scroll`, `shrink-to-card`, `noise-dissolve`, `card-deal`, `pixel-resolve` |
| `/philosophy` | `timeline` Drag the timeline | `typewriter`, `venetian-type`, `fold-out`, `invert-flash`, `side-carousel` |
| `/press` | `magnet-grid` Magnetic grid | `conveyor`, `pull-back`, `velocity-skew`, `orbit-in`, `stack-drop` |
| `/security` | `decode` Decode | `shutter`, `depth-parallax`, `squash-land`, `scroll-tilt`, `slot-roll` |
| `/support` | `one-question` One question at a time | `card-deal`, `cursor-lens`, `fold-out`, `tile-flip`, `tilt-3d-hover` |
| `/team` | `timeline` Drag the timeline | `spiral-in`, `side-carousel`, `cursor-trail`, `split-merge`, `cover-slide` |
| `/trust` | `decode` Decode | `line-draw`, `conveyor`, `text-mask-film`, `scroll-tilt`, `velocity-skew` |
| `/agents/*` | `split` Split screen | `curtain-rise`, `spring-snap`, `invert-flash`, `inertia-drag`, `count-roll` |
| `/benchmarks/*` | `race` Live race | `venetian-type`, `pull-back`, `blinds`, `glitch-in`, `slot-roll` |
| `/blockchain/*` | `rows-open` Rows that open | `accordion`, `stretch-scroll`, `scramble`, `grow-from-point`, `diagonal-wipe` |
| `/blog/*` | `timeline` Drag the timeline | `pendulum`, `typewriter`, `grid-wave`, `page-curl`, `underline-sweep` |
| `/careers/*` | `magnet-grid` Magnetic grid | `drop-in`, `shrink-to-card`, `magnet-gather`, `stack-drop`, `rack-focus` |
| `/cloud/*` | `rows-open` Rows that open | `swing-door`, `opposite-drift`, `letter-cascade`, `iris`, `squash-land` |
| `/compare/*` | `race` Live race | `pixel-resolve`, `ripple`, `sticky-stack`, `orbit-in`, `noise-dissolve` |
| `/customers/*` | `timeline` Drag the timeline | `snap-sections`, `domino`, `word-shuffle`, `focus-pull-scroll`, `vertical-ticker` |
| `/integrations/*` | `graph` Living graph | `shutter`, `zoom-through`, `explode-gather`, `depth-parallax`, `ink-spread` |
| `/legal/*` | `morph-panel` One panel, many states | `vertical-ticker`, `spiral-in`, `domino`, `underline-sweep`, `snap-sections` |
| `/models/*` | `race` Live race | `letter-cascade`, `tilt-3d-hover`, `pull-back`, `card-deal`, `tile-flip` |
| `/oss/*` | `graph` Living graph | `opposite-drift`, `scramble`, `explode-gather`, `magnet-gather`, `rack-focus` |
| `/products/*` | `morph-panel` One panel, many states | `stretch-scroll`, `cursor-trail`, `cover-slide`, `count-roll`, `word-shuffle` |
| `/solutions/*` | `ribbons` Velocity ribbons | `cursor-lens`, `page-curl`, `sticky-stack`, `venetian-type`, `ripple` |
