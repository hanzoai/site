# /cloud/* coverage (MASTER.md part 2, the 18 parts): one template, 42 pages

Page file: `components/pages/cloudfam/CloudProduct.jsx` (+ `cloudfam.css`, `cloudData.js`, `cloudData.test.mjs`, `app/cloud/[slug]/page.jsx`; shared v2 parts used, not edited: `StageSettle`, `useCalm`) · metric id: `contact_sales_submit` (/cloud/local: the run-locally action)
Members checked by hand for this card: `/cloud/gpus` (stage, Compute) and `/cloud/wallet` (path, Web3); also walked `/cloud/logs` (wide, Observe), `/cloud/kubernetes` (stage, a page with no lede and no features), `/cloud/secrets` (field, Security), `/cloud/chat` (wide, a conversation console), `/cloud/embeddings` (wide) and `/cloud/local` (CLI boot). `/cloud/gateway` is not a member of this family (Hanzo has no `/cloud/gateway` page; the gateway product is the separate `/gateway` page).

Open copy questions for James: none.
Shared changes requested (`docs/requests/platform.md`, shared with this family): kit `Band` should accept an `id` so its primary carries `data-cta`; `lib/cta.js`, `lib/track.js` and a kit `PageHero` do not exist yet.
Forks this page deleted: the shared example project as the hero (gateway, payments-api, checkout-web, docs-site and "Every request enters here, so the limiter does too." now sit behind their own note "Example project. ..." and open on demand; the CLI "deploy the gateway to staging" lines likewise), the spec-sheet section that repeated the name as an h2, the three equal related cards, the 88px name repeat in the close, the replaying console loop.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js` (n/a for the second half: `lib/cta.js` does not exist; the label and href are each page's own first action from its Hanzo copy)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` (n/a for prices: none on these pages)
- [x] Open copy questions for James listed, none decided

Done here: The top comment of `CloudProduct.jsx` names Persona, Goal and metric, CTA, Signature and the four first screens; `app/cloud/[slug]/page.jsx` carries the Signature and Beyond lines. The only solid in the hero is the product's first action ("Talk to us"); "Open in the console", Copy, the example-project note and Source are outlines or links.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it (the layout's skip link targets the `#main` marker before every page's `<main>`)
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [x] Breadcrumb at depth 2 or more
- [x] Link parity: 0 removed, 0 unexpected

Done here: Each page shows Hanzo's crumb (Cloud / group) under the ask. Console siblings, family pills, related rows and finder rows are kit `A` links. `parity.py` on all 42 members: 0 missing (gpus 45/45 text, 13/13 links; wallet 32/32, 11/11; local 27/27, 2/2).

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [ ] `PageHero`; nothing above the h1 (nothing above the h1: yes; `PageHero` does not exist in the kit, requested)
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer
- [x] Card-to-page links use Morph; title lands within 12px (related row titles carry `data-morph`; the target is the hero head, `data-morph-target`; landing on non-/cloud destinations depends on those pages)

Done here: The name cuts in by its line mask (700 ms) and rests at 64px settling to 52px (longer names 52px), so the console is the one big thing. The console is server-rendered settled (features, terminal or conversation all present, first paint never a black void), then the prompt sweeps white over its faint copy and the body plays once. Below the hero the page is one pinned console on the right whose panel is driven by the chapter in view on the left (route, then the feature you open, then the family member you point at); the inactive chapters dim to 32%, so one thing comes in as one goes out.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text; failure never says Copied
- [ ] `data-cta` and `data-thumb` on every primary (hero yes: `data-cta="cloud.<slug>.hero"` + `data-thumb`; the Band's primary is kit `Band`, which takes no id: requested)

Done here: Hero asks are kit `Cta` with per-page ids (`cloud.gpus.hero`, `cloud.gpus.hero-1`); hover lifts the solid to graphite with a silver ring and inverts the outline, press scales to 0.97. Copy turns ink with "Copied" (kit `Copy`, which returns early when the clipboard write fails).

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [x] Marquees pause, freeze under reduced motion, hide duplicates (n/a: no marquee)
- [x] Privacy link and owner line beside every submit (n/a: no form)

Done here: The hero's one number is the product's place in its own console sidebar (gpus `01 / 08` Compute, wallet `04 / 06` Web3), shown with its group name and one status chip (Hanzo's own label as a shape: filled dot GA, half dot Beta, ring for a family). Endpoints, Google Cloud pairs, features, commands and hover previews are read from Hanzo's pages by `cloudData.js` (`previewsOf`; `cloudData.test.mjs`: OK).

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts
- [x] `python3 scripts/parity.py /<path>`: 0 missing

Done here: The 3-fact strip under the console is the page's own API line, its Google Cloud line (else its Agent prompt "Start with" command) and its two badges, laid 5 / 4 / 4 on hairlines, not boxes. Features open (part 15): each is a button that puts it on the pinned console as the big object (`02 / 04`). Parity 0 missing on all 42 members.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` OK on all four files. Four first screens by group (`VARIANT`): stage (console on a lid with sidebar, figure column and the product's rows: gpus, kubernetes), wide (edge to edge, the family as a tab strip, the session in 21px type, figure on the right: logs, chat), path (the endpoint as an 84px mono object cut in by line, the figure beside it, facts in a column left of a narrow terminal: wallet, evals), field (a tall quiet Sigil room the console rises out of: secrets).

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading (disabled/loading n/a: no async control)
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs are native, trap focus and return it (n/a: no dialog)
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: listed below

Done here: Sidebar siblings invert to white and show that product's own name, status, lede and endpoint over the console panel while pointed at; family pills invert and drive the pinned panel; features, Copy, the example note, pause, finder rows (the Hanzo path grows 1.15×), related rows and the Band's Source link all answer hover and press. Hovers sit in `@media (hover: hover)`. Forks deleted: see the line at the top.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit

Done here: Signature: the product's own console plays once, then stays pinned while the facts drive it. Supporting: typing, `layoutId` lit row, Sigil, scroll (`variety.py` OK, no `Rise`). Time (typing, the one-pass session, the feature cycle), pointer (previews), state (panel swap by clip-path), scroll (lid, name settle, pin), arrival (line mask). Reduced motion on 8 members: 0 running animations in main at 3.5 s, no hydration error (render branches use `useCalm`).

## 10. Media
- [x] `Film` and `Pic` only; sizes and posters set (n/a: no photo or video)
- [x] At most 2 videos playing; pause button on loops over 5 s (n/a: no video; the console has a pause)
- [x] Budgets met; nothing missing; alt on every image (n/a: no images; Sigils are `aria-hidden` canvases)
- [x] No dimmed or filtered photo; 4+ real visuals together where the page has them (n/a: Hanzo's cloud pages have no photography)

Done here: Every section's object is product UI: the console, the pinned console (route, feature, family member), the finder and the related preview with its endpoint. Contour art stays in the hero (and under a featureless terminal, and the related preview card). No raw `img` or `video`.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: On the phone the pin becomes static panels: each chapter carries its own black panel under its text; the family tabs scroll sideways inside the console; related previews are dropped for 72px rows. `motion.mjs`: layout shift 0.000 on the phone for gpus and logs, 0.005 and 0.004 on desktop.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused (n/a for errors: the finder has a label and a live count)
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: The pause in the console bar stops the session and settles it; the boot terminal on /cloud/local has its own. The example project is a real disclosure (`aria-expanded`, `aria-controls`, its panel `hidden` until opened). Pinned panels and previews are `aria-hidden` duplicates of text that is in the chapters.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: Name, prompt, console body and facts are server-rendered; animation is transform, opacity and clip-path only. Sessions are one-shot `setTimeout` steps keyed by a run id, so scrolling away no longer kills them midway (the cause of /cloud/local's empty terminal) and leaving the page ends them.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: `generateMetadata` reads each member's title and description from `content/pages.json`; `<JsonLd route={'/cloud/' + slug} />` on every member; canonical and og:url from the shared layout.

## 15. Catalogue and product pages
- [x] Model card matches `SPEC.md` (n/a: no model card on cloud pages)
- [x] Every card opens by Morph
- [x] Every maker and model page linked in the DOM (n/a: product pages; every sibling product is linked from the console and the family pills)
- [x] One price figure everywhere (n/a: no price)

Done here: Cloud anatomy held on every member: identity (name, lede, ask, crumb), console (own chip, own figure, own body), a 3-fact strip from existing text, openable features (on the 11 members that have them; the rest open family members), `Band`. Related is a rail of rows (number, name, line, arrow) with one preview card that swaps in place, so hovering never reflows.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display
- [x] Config blocks parse on their own (n/a: no config blocks)
- [x] Terminal pauses and ends on a static frame
- [x] No hand-typed version number

Done here: The Paste and ship prompt copies exactly what is shown. On members with no features the console body is a one-line terminal of the product's own "Start with" command (else its own `api /v1/...` call), its endpoint and its Google Cloud pair. /cloud/local's boot plays once and rests on its last line.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed (n/a for loading/error/offline: no live data; empty: the finder shows "0 / 18")
- [x] Blocked live data leaves a complete page, no console errors
- [ ] A failed submit keeps its values and shows no success (n/a: no form)
- [ ] A thrown island does not blank the page (no page-local error boundary; requested as a kit part)

Done here: No network calls. /cloud/local's `TypeError: alive is not a function` is fixed (`typing` was called with its arguments shifted). Screenshot runs on gpus, logs, kubernetes, wallet, secrets, chat, embeddings and local at 1470 (and gpus, logs, wallet, local at 375): console errors none.

## 18. Measurement and handover
- [ ] `data-cta` on every primary; events only through `lib/track.js` (hero yes; Band primary blocked on kit; `lib/track.js` does not exist)
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [ ] `V2: <score>/10 <one line>` in the page file's top comment (added after the critic's verdict)
- [ ] Review read: `docs/review/cloud.md` verdict 8 or more (re-review requested after this rework)

Done here: The pages send nothing; per-page `data-cta` ids on the hero asks. Critic verdict before this rework: 5/10 (`docs/review/cloud.md`); fixes 1 to 7 of the brief were worked in this pass, and this card is updated with the new verdict when it comes.
