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

| Page | Signature |
|---|---|
| `/` | `keep` Keep as is |
| `/enso` | `particles` Particles form it |
| `/iro` | `compare` Before / after slider |
| `/kai` | `live-chat` Live conversation |
| `/koe` | `waveform` Waveform |
| `/koma` | `film-scrub` Scrub the film |
| `/models` | `race` Live race |
| `/mori` | `particles` Particles form it |
| `/oto` | `waveform` Waveform |
| `/uta` | `film-scrub` Scrub the film |
| `/zen` | `particles` Particles form it |
| `/agents` | `live-chat` Live conversation |
| `/api` | `terminal` Live terminal |
| `/bot` | `live-chat` Live conversation |
| `/chat` | `card-stack` Card stack |
| `/chrome` | `terminal` Live terminal |
| `/cli` | `compare` Before / after slider |
| `/computer` | `terminal` Live terminal |
| `/console` | `drag-canvas` Drag to explore |
| `/design` | `compare` Before / after slider |
| `/desktop` | `terminal` Live terminal |
| `/dev` | `compare` Before / after slider |
| `/download` | `terminal` Live terminal |
| `/extension` | `compare` Before / after slider |
| `/gen` | `film-scrub` Scrub the film |
| `/gui` | `compare` Before / after slider |
| `/ide` | `terminal` Live terminal |
| `/identity` | `spotlight` Spotlight |
| `/kata` | `terminal` Live terminal |
| `/mcp` | `compare` Before / after slider |
| `/operative` | `live-chat` Live conversation |
| `/operator` | `card-stack` Card stack |
| `/playground` | `drag-canvas` Drag to explore |
| `/sdks` | `peel` Peel the layers |
| `/skills` | `drag-canvas` Drag to explore |
| `/slack` | `live-chat` Live conversation |
| `/studio` | `film-scrub` Scrub the film |
| `/tag` | `drag-canvas` Drag to explore |
| `/templates` | `h-gallery` Sideways gallery |
| `/ui` | `magnet-grid` Magnetic grid |
| `/analytics` | `flip-board` Flip board |
| `/authz` | `spotlight` Spotlight |
| `/auto` | `drag-canvas` Drag to explore |
| `/automations` | `h-gallery` Sideways gallery |
| `/base` | `zoom-map` Zoom into the system |
| `/benchmarks` | `race` Live race |
| `/billing` | `calculator` Live calculator |
| `/blockchain` | `drag-canvas` Drag to explore |
| `/blog` | `word-light` Words light up |
| `/captable` | `calculator` Live calculator |
| `/commerce` | `flip-board` Flip board |
| `/compare` | `race` Live race |
| `/comparison` | `rows-open` Rows that open |
| `/crawl` | `flip-board` Flip board |
| `/dashboards` | `spotlight` Spotlight |
| `/dataroom` | `drag-canvas` Drag to explore |
| `/datastore` | `zoom-map` Zoom into the system |
| `/dns` | `globe` Globe |
| `/edge` | `graph` Living graph |
| `/engine` | `zoom-map` Zoom into the system |
| `/features` | `h-gallery` Sideways gallery |
| `/flow` | `rows-open` Rows that open |
| `/functions` | `peel` Peel the layers |
| `/gallery` | `film-scrub` Scrub the film |
| `/gateway` | `globe` Globe |
| `/guard` | `spotlight` Spotlight |
| `/help/privacy/model-training` | `h-gallery` Sideways gallery |
| `/hsm` | `spotlight` Spotlight |
| `/iam` | `decode` Decode |
| `/idv` | `spotlight` Spotlight |
| `/ingress` | `globe` Globe |
| `/insights` | `flip-board` Flip board |
| `/integrations` | `h-gallery` Sideways gallery |
| `/jin` | `rows-open` Rows that open |
| `/kai/guide` | `live-chat` Live conversation |
| `/kms` | `spotlight` Spotlight |
| `/leaderboard` | `race` Live race |
| `/learn` | `word-light` Words light up |
| `/ledger` | `calculator` Live calculator |
| `/machines` | `zoom-map` Zoom into the system |
| `/metrics` | `flip-board` Flip board |
| `/mq` | `globe` Globe |
| `/network` | `graph` Living graph |
| `/node` | `zoom-map` Zoom into the system |
| `/o11y` | `flip-board` Flip board |
| `/open-source` | `h-gallery` Sideways gallery |
| `/payments` | `calculator` Live calculator |
| `/platform` | `zoom-map` Zoom into the system |
| `/pubsub` | `globe` Globe |
| `/realtime` | `graph` Living graph |
| `/registry` | `zoom-map` Zoom into the system |
| `/research` | `word-light` Words light up |
| `/risk` | `decode` Decode |
| `/s3` | `peel` Peel the layers |
| `/search` | `flip-board` Flip board |
| `/sentinel` | `decode` Decode |
| `/sign` | `stamp` Stamp |
| `/solutions` | `h-gallery` Sideways gallery |
| `/stream` | `globe` Globe |
| `/tabs` | `calculator` Live calculator |
| `/telemetry` | `graph` Living graph |
| `/treasury` | `calculator` Live calculator |
| `/tunnel` | `peel` Peel the layers |
| `/visor` | `graph` Living graph |
| `/world` | `globe` Globe |
| `/zap` | `calculator` Live calculator |
| `/zen/7` | `particles` Particles form it |
| `/zen/models` | `object-3d` Turn the object |
| `/zen/zen6-max` | `particles` Particles form it |
| `/affiliate` | `one-question` One question at a time |
| `/beta` | `stamp` Stamp |
| `/bounty` | `one-question` One question at a time |
| `/buying-specialist` | `stamp` Stamp |
| `/enterprise` | `rows-open` Rows that open |
| `/grants` | `stamp` Stamp |
| `/pricing` | `morph-panel` One panel, many states |
| `/referral` | `one-question` One question at a time |
| `/sms-opt-in` | `stamp` Stamp |
| `/startups` | `morph-panel` One panel, many states |
| `/about` | `word-light` Words light up |
| `/brand` | `magnet-grid` Magnetic grid |
| `/careers` | `word-light` Words light up |
| `/contact` | `one-question` One question at a time |
| `/contact-sales` | `stamp` Stamp |
| `/customers` | `word-light` Words light up |
| `/founder` | `one-question` One question at a time |
| `/history` | `word-light` Words light up |
| `/investors` | `timeline` Drag the timeline |
| `/legal` | `rows-open` Rows that open |
| `/newsletter` | `one-question` One question at a time |
| `/philosophy` | `timeline` Drag the timeline |
| `/press` | `magnet-grid` Magnetic grid |
| `/security` | `decode` Decode |
| `/support` | `one-question` One question at a time |
| `/team` | `timeline` Drag the timeline |
| `/trust` | `decode` Decode |
| `/agents/*` | `split` Split screen |
| `/benchmarks/*` | `race` Live race |
| `/blockchain/*` | `rows-open` Rows that open |
| `/blog/*` | `timeline` Drag the timeline |
| `/careers/*` | `magnet-grid` Magnetic grid |
| `/cloud/*` | `rows-open` Rows that open |
| `/compare/*` | `race` Live race |
| `/customers/*` | `timeline` Drag the timeline |
| `/integrations/*` | `graph` Living graph |
| `/legal/*` | `morph-panel` One panel, many states |
| `/models/*` | `race` Live race |
| `/oss/*` | `graph` Living graph |
| `/products/*` | `morph-panel` One panel, many states |
| `/solutions/*` | `ribbons` Velocity ribbons |
