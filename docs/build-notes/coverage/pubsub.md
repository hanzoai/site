# /pubsub coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/cloud/Pubsub.jsx` (+ `Pubsub.css`) · route: `app/pubsub/page.jsx` · gallery: `docs/gallery/pubsub/` · metric id: `github_click`

Open copy questions for James: none decided. Listed: the live hero ask is "GitHub" (to github.com/hanzoai/pubsub) while the site header says "Try Hanzo"; the demo's drawn product words (delivery states, switch labels built from Hanzo's sentences) are not in `content/ui-strings.json` yet.
Shared changes requested (`docs/requests/pubsub.md`): Frame's Paste/Code on the deck; light-code comment contrast in the kit; the sticky ask label and the floating desktop pill; a press on `lx-text`; `Copy` press .97; the UI-strings register; `lib/cta.js`, `lib/track.js` and the sound kit.
Forks this page deleted: the poster hero with the bus above the h1 (now the h1, line and ask left, the bus right, nothing above the h1), the header "Try Hanzo" override in page CSS, every spring (`SPRING`, `SNAP`), the arrow nudge on row hover, the raised inspector and code shadows, the 60px spec words and the 52px "Put it between your services", the #0a0a0a hero (black rooms are #000), and every Apple-grey literal.

Decisions noted (James never asked): the metric is `github_click`, not `api_key_created`, because the only ask is Hanzo's live "GitHub" (MASTER §1 names a GitHub click). The bus now runs top to bottom so it can sit beside the title on the 5/8 split; the fan-out is the same signature, drawn downward.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js` (n/a for the file: it does not exist yet; the label is Hanzo's live hero label)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` (n/a: no prices)
- [x] Open copy questions for James listed, none decided

Done here: `Pubsub.jsx` and `app/pubsub/page.jsx` open with Persona (Developer), Goal, CTA ("GitHub" → github.com/hanzoai/pubsub, `pubsub.hero` / `pubsub.close`), Metric (`github_click`), Signature, Beyond and `V2:`. In the black hero the ask is the one solid (white on #000); on desktop the header's "Try Hanzo" is outlined while it is on screen. On phones the shared header keeps a solid "Try Hanzo" (shared header, requested in `docs/requests/pricing.md` item 1), so the phone's first screen has two fills until that lands.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it (the layout's skip link targets `#main`)
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [x] Breadcrumb at depth 2 or more (n/a: depth 1)
- [x] Link parity: 0 removed, 0 unexpected

Done here: Every link is the kit `A`. `parity.py /pubsub`: 2/2 links. The six facts are one numbered list read in order beside a held drawing (no pinned rail, no hidden content).

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero` (n/a for the component: not merged; the hero is `LineMask` h1 + lede + one ask + the bus); nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer (the close is `LaunchClose`: "Get PubSub" grows 26 → 64px beside the page's Sigil)
- [x] Card-to-page links use Morph; title lands within 12px (n/a: no card)

Done here: The first screen is the page's one black room: h1 (52px), "The bus everything else rides", "GitHub" bottom-left, and the globe right with the stream tray, three subscribers and the ack switch under it. The server frame is a settled fan-out; within 0.45 s the next message is published and its arc draws. Order: black hero (globe), white code split ("Put it between your services", events.go walked once on arrival), "More than pub/sub" (heading and one drawing held left while the six facts pass right), quiet room (prompt, 4222 spec), close.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn` (the kit's `lx-cta` stands in at 48px until `Cta` lands)
- [x] Sticky ask in header and bar after the hero, same label (the site's `Ask.jsx` bar carries "GitHub" from `data-thumb`; the header's own label is a shared request)
- [x] Copy button copies exactly the displayed text; failure never says Copied (kit `Copy` in Frame's Paste and Code)
- [x] `data-cta` and `data-thumb` on every primary

Done here: Hero ask `data-cta="pubsub.hero" data-thumb="GitHub"`, close ask `pubsub.close`; `data-ask-name="Hanzo PubSub"` on the hero section inside `<main>`. "View on GitHub" is an outline secondary.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [x] Marquees pause, freeze under reduced motion, hide duplicates (n/a: no marquee)
- [x] Privacy link and owner line beside every submit (n/a: no form)

Done here: Figures are Hanzo's (4222, "1M messages/month", "4 stars", two minutes). Sequence numbers and key values in the demo are drawn, said so in the header comment.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts (code: Frame's `Code` and `Paste`)
- [x] `python3 scripts/parity.py /pubsub`: 0 missing

Done here: `parity.py /pubsub`: 82/82 text, 2/2 links. `c3pal.cjs`: 0 runs under 13px on desktop and 0 under 14px on phone (only 12px Zen Mono capitals). Scale: h1 52, "More than pub/sub" 44, fact titles 21 (19 phone), headings 26, spec 44 Air, lede 20, body 16, code 13.5/1.65, drawing labels 13px mono scaled with the tile (14px on phones).

## 7. Visual design system
- [x] `python3 scripts/taste.py` passes; no literal hex outside tokens (deck values only)
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` OK; only deck greys. The hero is #000; subscribers are outlined until a copy lands, then a flat #171717 fill. Below the hero the objects are events.go (white, one hairline) and the facts' drawing: a flat #f5f5f5 tile beside the heading that draws the fact at the middle of the screen in ink and grey line art (`pubsub/PsFacts.jsx`): the stream ages out its oldest and keeps its newest while a consumer reads along; a duplicate collapses and the ack comes home on an arc; a bucket key takes a new value under a watch; a request reaches one of three instances and one answer returns; a payload is chunked into a stream and put back together; an account wall stops a subject. The prompt a flat #171717 tile; nothing shadowed. "NATS JetStream" is in the globe's own toolbar. Hero medium: the only globe fan-out among the cloud pages.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading (n/a for disabled/loading: nothing waits on a network)
- [x] Focus ring visible on every stop of a Tab crawl (kit: 2px ink plus a white halo, inverted in the black room)
- [x] Dialogs are native, trap focus and return it (n/a: no dialog)
- [x] Inputs 16px or larger; no bare `:hover` (n/a for inputs: none)
- [x] Forks this page deleted: listed at the top

Done here: The ack switch (`aria-pressed`, a pill that glides 300 ms) and the pause are real buttons; hover changes fill or ink inside `@media (hover:hover)`; press is .97 for 90 ms. Replay hover lights the sequences from the one under the pointer and names "replay · from #40 → #43" in the toolbar; hovering a place on the globe names it with its state. Hovering a fact puts it in ink, draws its top rule and swaps the drawing to it; leaving hands back to the fact at the middle of the screen. A pointer on events.go ends its walk at once so it can be read and copied.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit (n/a: the shared sound kit has not landed)

Done here: Signature `globe` (MOTION-MAP, 7 Nov): in the hero a dark planet drawn as a graticule on one canvas (`pubsub/PsGlobe.jsx`) carries the fan-out: a publish on events.user.signup pulses, its arc draws to the stream EVENTS (the tray's newest sequence lights), three arcs fan out to analytics, audit and the one queue-group member picked, acks fly home dashed, and under "ack every" audit is redelivered once. Drag spins it with inertia (sideways on touch); hover names a place. The ack switch (`layoutId` pill) re-runs the fan-out under Hanzo's three choices. Below: events.go is walked once as it arrives (connect, stream, publish, consume; 1.25 s a beat, 5 s in all, then every line back in ink); the facts' drawing is held beside the heading and draws the fact at the middle of the screen once (about 3 s, then still), crossfading 300 ms between facts; on phones each fact draws its own drawing once as it comes up. Kinds: idle (the fan-out), pointer (drag, place hover, replay preview, fact hover, magnetic close ask), time (the events.go walk), state (ack switch, pause), arrival (h1 cut-in, each drawing), scroll (the fact at the middle, "Get PubSub" growing). Tweens only, 0 springs; the globe's rAF runs only while seen and unpaused; the walk and drawings are short one-shot runs that end still. Reduced motion: settled fan-out, no walk, every drawing at its final frame. JS off hides the empty canvas and the drawings; the tray, subscribers and every fact still read. Checked 7 Nov at 1470×801 and 375×812: 0 console errors, no sideways scroll. Entrances (MOTION-MAP, `pubsub/PsEnter.jsx`, one per section, once): line-draw (the tray's and subscribers' outlines draw on first paint, CSS only, then fill), cursor-trail (a cursor crosses "Put it between your services" and uncovers it with a short dot trail; later a mouse leaves the same trail), spring-snap (each fact snaps in from the right with a small overshoot, the drawing from the left; an overshooting tween, no spring), cover-slide (the quiet room rides up over the facts' empty bottom padding, scroll-linked), pixel-resolve (the close's art clears from coarse grey pixels through finer ones). Final state in the server HTML; armed only after mount and only below the fold; reduced motion skips all; a walk to the footer leaves nothing armed at 1470 or 375 (probe, 7 Nov).

## 10. Media
- [x] `Film` and `Pic` only; sizes and posters set (n/a: no Hanzo photo or film for PubSub)
- [x] At most 2 videos playing; pause button on loops over 5 s (the globe has a 44px `LivePause`; the code walk and drawings end still within 5 s)
- [x] Budgets met; nothing missing; alt on every image (n/a: no images)
- [x] No dimmed or filtered photo; 4+ real visuals together where the page has them (n/a: Hanzo has no PubSub media)

Done here: Objects are product UI (the globe and its bus; events.go; the six drawings; the prompt) and the page's Sigil from its own figures [4222, 3, 1000000]. The globe has a 44px `LivePause`; the code walk (5 s) and each drawing (about 3 s) end on a still frame, so they need none.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: No sideways scroll at 375 or 320; the ask sits above the globe on phones. On phones analytics and audit sit side by side with the queue group as a full-width row under them, so every state ("↻ redelivered" included) fits whole at 375 and 320, with no ellipsis (probe: 0 truncated labels over 8 s). The facts stack, each with its own drawing above its words; the drawings scale with the column (text 14px). The replay preview's tap path is the sequence row itself.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused (n/a: no form)
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: `c3pal.cjs` measures every text run on its real background: 0 under 4.5:1 at both widths (#a3a3a3 on #000 8.3:1 and on #171717 7.1:1, white 78% on #000, #525252 on #fafafa, #737373 code comments on white 4.74:1). Headings: h1, h2 (intro), h3 ×6, h2 (quiet room), h2, h2 (close). The ack line is `aria-live="polite"`.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized (n/a for media)
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: The bus is whole in the server HTML (a settled fan-out); timers are timeout chains that stop off screen and when paused; the wires are SVG strokes animated by dash offset. Filming and audits ran in the cloud container.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL (owned by the shared layout)
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link (n/a: no card)

Done here: `app/pubsub/page.jsx` takes `metadata` from `content/pages.json` unedited and renders `<JsonLd route="/pubsub" />`.

## 15. Catalogue and product pages
- [x] Model card matches `SPEC.md` (n/a: not a catalogue or model page)
- [x] Every card opens by Morph (n/a: no card)
- [x] Every maker and model page linked in the DOM (n/a)
- [x] One price figure everywhere (n/a: the free-tier line appears once)

Done here: Cloud product anatomy: identity (h1, line), the product at work (the globe and its bus), features (six numbered facts, the ack switch), the 4222 spec, the close.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (Frame's `Code` and `Paste` copy exactly what they show)
- [x] Config blocks parse on their own (n/a: no JSON config)
- [x] Terminal pauses and ends on a static frame (n/a: no terminal; the demos pause)
- [x] No hand-typed version number

Done here: events.go is 13.5px/1.65 on white with one hairline; its copy writes the displayed Go. The prompt copies its one line. No version numbers.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed (n/a: nothing is fetched; the page is whole at first paint)
- [x] Blocked live data leaves a complete page, no console errors
- [x] A failed submit keeps its values and shows no success (n/a: no form)
- [x] A thrown island does not blank the page (Sigil, Cursor and Phone boundaries belong to the shared layer)

Done here: Nothing is fetched. The product's states are drawn: in the hero published, stored, delivered, acked, redelivered and the one queue-group member; in the facts' drawings aged out, read by a consumer, duplicate collapsed, acked, last value under a watch, one answer, chunked and put back together, walled by account. 0 page errors at both widths.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js` (n/a for the file: it does not exist yet; ids are in place)
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [x] Review read: `docs/review/pubsub.md` verdict 8 or more (no review of this round yet; none existed when the page was pushed)

Done here: `pubsub.hero` and `pubsub.close` are set; `V2: 8/10` heads `Pubsub.jsx` and the route. Gallery: `docs/gallery/pubsub/d.mp4`, `d.jpg`, `p.jpg`. Checks at push: 200, parity 0 missing, taste OK, variety OK, unique OK, fs-audit clear, pinchk 7/7.
