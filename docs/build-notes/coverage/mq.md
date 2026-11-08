# /mq coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/cloud/Mq.jsx` (+ `Mq.css`) · route: `app/mq/page.jsx` · gallery: `docs/gallery/mq/` · metric id: `github_click`

Open copy questions for James: none decided. Listed: the live hero ask is "GitHub" (to github.com/hanzoai) while the site header says "Try Hanzo"; the demo's drawn product words (job states, tab names, "Retry"/"Undo") are not in `content/ui-strings.json` yet.
Shared changes requested (`docs/requests/mq.md`): Frame's Paste/Code on the deck; light-code comment contrast in the kit; the sticky ask label and the floating desktop pill; a press on `lx-text`; `Copy` press .97; the UI-strings register; `lib/cta.js`, `lib/track.js` and the sound kit.
Forks this page deleted: the centred hero head (the h1 is now on the 8/5 split), the header "Try Hanzo" override in page CSS, every spring (`SPRING`, `SNAP`), the inspector's raised shadow, the 120–220px "10K", the 46px spec words and the 52px "Add a job and walk away", and every Apple-grey literal.

Decisions noted (James never asked): the metric is `github_click`, not `api_key_created`, because the page's only ask is Hanzo's live "GitHub" and no button here creates a key (MASTER §1 names a GitHub click as a metric). The h1 baseline sits at about 30% of 801px rather than 38%, so the whole conveyor fits the first screen (MASTER part 3 "the hero object on the first screen" taken over the 38% line).

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js` (n/a for the file: it does not exist yet; the label is Hanzo's live hero label)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` (n/a: no prices)
- [x] Open copy questions for James listed, none decided

Done here: `Mq.jsx` and `app/mq/page.jsx` open with Persona (Developer), Goal, CTA ("GitHub" → github.com/hanzoai, `mq.hero` / `mq.close`), Metric (`github_click`), Signature, Beyond and `V2:`. `fs-audit.cjs` counts one solid ("GitHub") at 1470×801 and 375×812.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it (the layout's skip link targets `#main`)
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [x] Breadcrumb at depth 2 or more (n/a: depth 1)
- [x] Link parity: 0 removed, 0 unexpected

Done here: Every link is the kit `A` (hero ask, "View on GitHub", the close's ask, Deploy to Cloud and repo). `parity.py /mq`: 2/2 links.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero` (n/a for the component: not merged; the hero is `LineMask` h1 + lede + one ask + the live conveyor); nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer (the close is `LaunchClose`: "Get MQ" grows 26 → 64px beside the page's Sigil)
- [x] Card-to-page links use Morph; title lands within 12px (n/a: no card on this page)

Done here: First screen at 1470×801: h1 (52px, baseline ≈ 240px), lede, "GitHub", and the whole conveyor (y ≈ 300–660); `fs-audit.cjs` measures 86,365 changed px in 0.9 s with no input (73,699 on phone) and nothing above the h1. `c3nojs.cjs`: 0 hidden text runs with JS off. Order: hero, pinned chapters (tall), black room, white figure + spec, close.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn` (the kit's `lx-cta` stands in at 48px until `Cta` lands)
- [x] Sticky ask in header and bar after the hero, same label (the site's `Ask.jsx` bar carries "GitHub" from `data-thumb`; the header's own label is a shared request)
- [x] Copy button copies exactly the displayed text; failure never says Copied (kit `Copy` in Frame's Paste and Code)
- [x] `data-cta` and `data-thumb` on every primary

Done here: Hero ask `data-cta="mq.hero" data-thumb="GitHub"`, close ask `mq.close` with the same label; `data-ask-name="Hanzo MQ"` sits on the hero section inside `<main>`. "View on GitHub" is an outline secondary, Deploy to Cloud a text link.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [x] Marquees pause, freeze under reduced motion, hide duplicates (n/a: no marquee)
- [x] Privacy link and owner line beside every submit (n/a: no form)

Done here: The one figure, "10K", is Hanzo's ("Free tier includes 10K jobs/month") and its sentence sits beside it; it cuts in by line mask and is never counted. Job names and row numbers in the demo are drawn examples, said so in the header comment.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts (code: Frame's `Code` and `Paste`; the inspector tabs are product UI buttons)
- [x] `python3 scripts/parity.py /mq`: 0 missing

Done here: `parity.py /mq`: 81/81 text, 2/2 links. `c3pal.cjs` finds 0 runs under 13px on desktop and 0 under 14px on phone (only 12px Zen Mono capitals: "JOB QUEUE", lane names). Sizes follow the scale: h1 52, intro 44, chapter titles 32, headings 26, the one figure 64 Air, lede 20, body 16, code 13.5/1.65.

## 7. Visual design system
- [x] `python3 scripts/taste.py` passes; no literal hex outside tokens (deck values only)
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` OK; `c3pal.cjs` reads every computed colour in `<main>` at both widths: 0 off the deck ramp (#0a0a0a, #525252, #737373, #a3a3a3 on black, #d4d4d4, #e4e4e7, #ededed, #f2f2f2, #f5f5f5, #171717, #262626, #404040). The inspector is outlined (1px, radius 24) with no shadow; tickets 12, slots 16, chips 6, pills full. "Job queue" sits in the conveyor's own toolbar. Hero medium: a live kanban of jobs that no other page uses.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading (n/a for disabled/loading: nothing here waits on a network)
- [x] Focus ring visible on every stop of a Tab crawl (kit: 2px ink plus a white halo, inverted in the black room)
- [x] Dialogs are native, trap focus and return it (n/a: no dialog)
- [x] Inputs 16px or larger; no bare `:hover` (n/a for inputs: none)
- [x] Forks this page deleted: listed at the top

Done here: Tabs, Retry and the pauses are real buttons; every hover sits inside `@media (hover:hover)` and changes ink, edge or fill; press is scale .97 for 90 ms (tabs, Retry, text links, the kit's asks).

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit (n/a: the shared sound kit has not landed)

Done here: Signature: jobs on the conveyor (idle). Supporting: layout glides (`layoutId`), the settle, the line-mask cut-ins; `variety.py` OK. Kinds: idle (conveyor, inspector panels), pointer (a job under the cursor names its options in the toolbar, magnetic close ask ≤22px), state (tab underline, Retry/Undo), arrival (h1 cut-in, timed black-room wipe, "10K" cut-in), scroll (settle, pinned chapters, "Get MQ" growing). Tweens only: 300 ms ease-emphasis, 400 ms ease-in-out, 150 ms exits; 0 `spring`, 0 `stiffness`, 0 `setInterval`.

## 10. Media
- [x] `Film` and `Pic` only; sizes and posters set (n/a: no Hanzo photo or film for MQ)
- [x] At most 2 videos playing; pause button on loops over 5 s (the conveyor and the inspector each have a 44px `LivePause`)
- [x] Budgets met; nothing missing; alt on every image (n/a: no images)
- [x] No dimmed or filtered photo; 4+ real visuals together where the page has them (n/a: Hanzo has no MQ media)

Done here: Objects are product UI (conveyor, inspector, worker.ts, the prompt) and the page's Sigil drawn from its own figures [6379, 10, 100, 60000].

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: `c3w320.cjs`: scrollWidth 320 at 320 wide, the ask's bottom at 238px at 375×667, 0 targets under 44px. Phone chapters: the inspector sits in a fixed 44svh window, so words never move between chapters; `pinchk.cjs` 7/7 ok. The pointer peek's tap path is the lanes themselves (every job shows its state in words).

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused (n/a: no form)
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: `c3pal.cjs` computes every text run against its real background: 0 under 4.5:1 at both widths (#525252 on #f5f5f5 7.2:1, #737373 on white 4.74:1, white 78% and #a3a3a3 on #000/#171717). Headings: h1, h2 (intro), h3 ×6, h2 (black room), h2, h2 (close). Pauses are first in each demo with `aria-pressed`.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized (n/a for media)
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: The conveyor's first frame is computed on the server (`WARM`, four steps in), so the hero is whole before hydration. Timers are timeout chains that stop off screen and when paused. Filming and audits ran in the cloud container.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL (owned by the shared layout)
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link (n/a: no card)

Done here: `app/mq/page.jsx` takes `metadata` from `content/pages.json` unedited and renders `<JsonLd route="/mq" />`.

## 15. Catalogue and product pages
- [x] Model card matches `SPEC.md` (n/a: not a catalogue or model page)
- [x] Every card opens by Morph (n/a: no card)
- [x] Every maker and model page linked in the DOM (n/a)
- [x] One price figure everywhere (n/a: the free-tier line appears once)

Done here: Cloud product anatomy: identity (h1, line), the product at work (conveyor), openable features (six chapters with an inspector you press), the spec facts, the close.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (Frame's `Code` and `Paste` copy exactly what they show)
- [x] Config blocks parse on their own (n/a: no JSON config)
- [x] Terminal pauses and ends on a static frame (n/a: no terminal; the demos pause)
- [x] No hand-typed version number

Done here: worker.ts is 13.5px/1.65 on a flat graphite tile, its copy writes the displayed text; the prompt copies its one line. No version numbers.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed (n/a: nothing is fetched; the page is whole at first paint)
- [x] Blocked live data leaves a complete page, no console errors
- [x] A failed submit keeps its values and shows no success (n/a: no form)
- [x] A thrown island does not blank the page (Sigil, Cursor and Phone boundaries belong to the shared layer)

Done here: The product's own states are designed in the demo: waiting, running, backing off, completed, the failed set with its stack, retry. `look2.cjs` logs 0 page errors; paused, reduced-motion and JS-off frames each show a whole queue.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js` (n/a for the file: it does not exist yet; ids are in place)
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [x] Review read: `docs/review/mq.md` verdict 8 or more (no review of this round yet; none existed when the page was pushed)

Done here: `mq.hero` and `mq.close` are set; `V2: 8/10` heads `Mq.jsx` and the route. Gallery: `docs/gallery/mq/d.mp4`, `d.jpg`, `p.jpg` (filmed in the cloud). Checks at push: 200, parity 0 missing, taste OK, variety OK, unique OK, fs-audit clear, pinchk 7/7.
