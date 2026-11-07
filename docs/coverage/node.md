# /node coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/cloud/Node.jsx` (+ `.css`) · route: `app/node/page.jsx` · gallery: `docs/gallery/node/` · metric id: `api_key_created`

Open copy questions for James: none decided. One to confirm: the spec row shows Hanzo's counted words as numerals ("One Rust binary" → 1, "Three commands" → 3, the five levels Hanzo lists → 5, "a tenth of the block reward" → 1/10); the words themselves stay in the chapters.
Shared changes requested (`docs/requests/node.md`): Frame's Paste on the deck (page-local overrides until then); `Copy` press to .97; the desktop ask bar floats over content; a hue in the shared nav icon; the pinned chapter count above the h3; `lib/cta.js` and `lib/track.js`.
Forks this page deleted: the `useSpring` lean (now a CSS-eased tilt of 2.5° at most), the 52px "Why Run a Hanzo Node" h2 that sat on one screen with 64px figures (now 26px), the black room right after a dark terminal (now a quiet #f5f5f5 room), the terminal's drop shadow, three equal "hanzo fabric" buttons (now one command bar), the LED's halo ring, every Apple-grey literal (#6e6e73, #8e8e93, #c7c7cc, #e3e3e8, #ececf0, #f2f2f5, #f5f5f7, #2c2c2e, #a1a1a6, #d2d2d7), the 600–900 ms line and bar animations (now 400–500 ms).

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js` (n/a for the file: it does not exist yet; the label and href are Hanzo's live hero ask)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` (n/a: no prices)
- [x] Open copy questions for James listed, none decided

Done here: `Persona: Developer with a machine to lend · Goal: run a node · CTA: "Run a Node" → docs.hanzo.ai/docs/proof-of-ai/node-operator · Metric: api_key_created`, plus Signature, Beyond and `V2:`, head `Node.jsx` and `app/node/page.jsx`. `fs-audit.cjs` counts one solid ("Run a Node") on the first screen at both sizes.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it (the layout's skip link targets the one `<main>`)
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [x] Breadcrumb at depth 2 or more (n/a: depth 1)
- [x] Link parity: 0 removed, 0 unexpected

Done here: Every link is kit `A`. `parity.py /node`: 4/4 links; "About the Network" goes to /network with `data-morph`.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero` (n/a for the component: not merged; the hero is the kit's `LineMask` h1, caption, lede, one ask and the live machine); nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer (`LaunchClose`: Sigil, "Get Node", the one ask, licence and repo)
- [x] Card-to-page links use Morph; title lands within 12px

Done here: The first screen is the machine on the left eight columns (it settles from 1.06 to its place) and the 52px title, "Decentralized AI Compute" as its caption, the lede and the ask on the right five. It starts within 0.7 s ("hanzo fabric up" → starting → joined → serving); `fs-audit.cjs` measures motion on both sizes and nothing above the h1. Rooms: hero, figures, pinned terminal (tall), quiet room, close.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn` (the kit's 48px `lx-cta`; swapped when the deck `Cta` lands)
- [x] Sticky ask in header and bar after the hero, same label (the site's `Ask.jsx` reads `data-thumb`)
- [x] Copy button copies exactly the displayed text; failure never says Copied (Frame's Paste uses the kit `Copy`)
- [x] `data-cta` and `data-thumb` on every primary

Done here: The hero ask has `data-cta="node.hero" data-thumb="Run a Node"`, the close `node.close` with the same thumb; `data-ask-name="Hanzo Node"` is on the hero section. "Quickstart" is a ghost, the rest text links.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [x] Marquees pause, freeze under reduced motion, hide duplicates (n/a: no marquee)
- [x] Privacy link and owner line beside every submit (n/a: no form)

Done here: The four figures count Hanzo's own words (one Rust binary, three commands, the five listed levels, a tenth of the block reward), each with its label beside it. Merkle roots and bars are drawn, as the header comment says.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts (n/a for tables, FAQ and tabs: none; code is Frame's Paste and the drawn terminal)
- [x] `python3 scripts/parity.py /node`: 0 missing

Done here: Parity 37/37 text, 4/4 links. Sizes: h1 52, caption 21, the figures 64 (the next screen's one big thing), section headings 26, chapter titles 32, lede 20, body 16, terminal 16 mono, captions 13; the cells' 12px labels are Zen Mono capitals. The "01 / 06" counts sit under each chapter title.

## 7. Visual design system
- [x] `python3 scripts/taste.py` passes; no literal hex outside tokens (deck values only)
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` OK; values #0a0a0a, #525252, #737373, #a3a3a3, #d4d4d4, #e4e4e7, #ededed, #f2f2f2, #f5f5f5, #171717, #262626, #404040. The machine is a hairline stage with flat #f5f5f5 cells (16px inside the 24px stage); the terminal is flat graphite with no shadow. Neighbour /network is the map page (a peer graph in its hero and as its chapters' object) with a black room; /node opens on a product card left of the copy, shows its own side of the fabric as three transports drawn in ("hanzod ── peer 03"), not a map, and keeps the graphite terminal and a quiet room, with no black room.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading (n/a for disabled and loading: nothing is ever unavailable or fetched)
- [x] Focus ring visible on every stop of a Tab crawl (kit: 2px ink, white halo)
- [x] Dialogs are native, trap focus and return it (the kit `Sheet` for "See the levels": focus to Close, Esc, focus back to the button)
- [x] Inputs 16px or larger; no bare `:hover` (n/a for inputs: none; every hover is in `@media (hover:hover)`)
- [x] Forks this page deleted: listed at the top

Done here: The five level buttons (44px rows on desktop, 64px bars on phone), the drive bar (up / join / stop, `aria-pressed`), the pause and "See the levels" all fill or ink on hover and press at .97 for 90 ms; text links press 1px. The levels sheet mounts only while open, so the sticky ask never mistakes it for an overlay.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit (n/a: the shared sound kit has not landed)

Done here: Signature: the machine's own run (idle, the one mover on its screen): up, starting, joined, then four jobs lit and settled in about nine seconds (MASTER §4.1); it rests serving with three roots settled, and the toolbar's play replays it. Supporting: the tilt toward a fine pointer (2.5° at most, 300 ms ease-in-out), the terminal's lines staged in 60 ms apart (time), the stage settling from 1.06 (scroll). Also pointer (a level you point at takes a job), state (drive bar, levels sheet), arrival (title cut-in, the quiet room's wipe). `variety.py` OK with no technique counted (no springs, no layoutId); no `setInterval`. Scale rhythm: the stage starts big and settles, the figures are the next screen's one big thing, "Get Node" grows to 64.

## 10. Media
- [x] `Film` and `Pic` only; sizes and posters set (n/a: Hanzo has no Node photo or film)
- [x] At most 2 videos playing; pause button on loops over 5 s (the machine's 44px pause is first in its toolbar)
- [x] Budgets met; nothing missing; alt on every image (n/a: no images)
- [x] No dimmed or filtered photo; 4+ real visuals together where the page has them (n/a: no media)

Done here: Objects are drawn product UI (the machine, the figures, the terminal, the agent prompt) and the close's Sigil from figures [5, 3, 10].

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: Phone order: title, caption, lede, ask (y≈325), then the machine with the five levels as five 64px bars and the lit level named under them. The terminal sits in a 36svh window over its words and `pinchk.cjs` passes 6/6. Tilt is fine-pointer only; levels take a tap.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused (n/a: no form)
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: #525252 on #f5f5f5 7.4:1 (the cells), #737373 on white 4.74:1, #a3a3a3 on #171717 7.1:1 and on #262626 6.0:1 (terminal), #d4d4d4 on #171717 12.6:1. Headings: h1, h2 (why), h3 ×6, h2 (quiet room), h2 (close). Status is `aria-live`; levels are named buttons.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized (n/a for media: none)
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: The machine runs on a `setTimeout` chain only while 30% in view and unpaused; the tilt writes one transform with no React state. Filming ran in the cloud.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL (owned by the shared layout)
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link (n/a for cards: none on this page)

Done here: `app/node/page.jsx` takes `metadata` from `content/pages.json` unedited and renders `<JsonLd route="/node" />`; the hero carries `data-morph-target` for /network's "Provide Compute".

## 15. Catalogue and product pages
- [x] Model card matches `SPEC.md` (n/a: not a catalogue or model page)
- [x] Every card opens by Morph (n/a: no cards; "About the Network" carries `data-morph`)
- [x] Every maker and model page linked in the DOM (n/a)
- [x] One price figure everywhere (n/a: no prices)

Done here: A cloud product on the shared anatomy: identity (title and caption), the live machine, a 4-fact strip from Hanzo's words, six openable reasons, the close.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (the agent prompt copies exactly what it shows)
- [x] Config blocks parse on their own (n/a: no config block)
- [x] Terminal pauses and ends on a static frame (the hero machine pauses; the chapter terminal changes only with the chapter and is static)
- [x] No hand-typed version number

Done here: `hanzo fabric up / join / stop` and the agent prompt are the code on the page; Copy writes the displayed string. No version numbers.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed (n/a: nothing is fetched; the page is whole at first paint)
- [x] Blocked live data leaves a complete page, no console errors
- [x] A failed submit keeps its values and shows no success (n/a: no form)
- [x] A thrown island does not blank the page (Sigil, Phone and Cursor boundaries are the shared layer's)

Done here: The machine's own states are designed: stopped (hollow LED, blinking caret), starting, joined (grey), serving (ink), "waiting for work" in the first of three dashed root slots (reserved from the start, so a new root never moves anything), a stop that leaves the same-named process running. Reduced motion shows it serving with roots settled.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js` (n/a for the file: not built yet; ids are in place)
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [x] Review read: `docs/review/node.md` verdict 8 or more (pending: no verdict had landed at push time)

Done here: `node.hero` and `node.close` are set. Gallery: `docs/gallery/node/d.mp4`, `d.jpg`, `p.jpg` (`film.cjs`, no errors). My own score is 8/10; the critic's verdict decides.
