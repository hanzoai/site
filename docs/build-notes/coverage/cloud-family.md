# /cloud/* coverage (MASTER.md part 2, the 18 parts): one template, 42 pages

Page file: `components/pages/cloudfam/CloudProduct.jsx` (+ `cloudfam.css`, `cloudData.js`, `app/cloud/[slug]/page.jsx`; own v2 part `StageSettle`) · gallery: `docs/gallery/cloud/` · metric id: `contact_sales_submit` (/cloud/local: the run-locally action)
Members checked by hand for this card: `/cloud/gpus` (stage, Compute) and `/cloud/evals` (path, Science); also walked `/cloud/embeddings` (wide), `/cloud/secrets` (field) and `/cloud/local` (CLI boot).

Open copy questions for James: none.
Shared changes requested (`docs/build-notes/requests/platform.md`, shared with this family): kit `Band` should accept an `id` so its primary carries `data-cta`; kit `Copy` should not show its tick when the clipboard write fails; `lib/cta.js`, `lib/track.js` and a kit `PageHero` do not exist yet.
Forks this page deleted: the per-family accent colours (`accentOf`), the full-screen genesis-line room (now a quiet strip), the second solid button in the console and in Paste and ship (now outlines), the hidden ghost prompt that blinked on arrival.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js` (n/a for the second half: `lib/cta.js` does not exist; the label and href are each page's own first action from its Hanzo copy)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` (n/a for prices: none on these pages)
- [x] Open copy questions for James listed, none decided

Done here: Top comment of `CloudProduct.jsx` names Persona, Goal and metric, CTA, Signature, Beyond and the four first screens. The only solid is the product's first action ("Talk to us"); "Open in the console" and Copy are outlines. `audit.cjs`: h1 count 1 on gpus, evals, secrets, local.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it (the layout's skip link targets the `#main` marker before every page's `<main>`)
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [x] Breadcrumb at depth 2 or more
- [x] Link parity: 0 removed, 0 unexpected

Done here: Each page shows Hanzo's crumb (Cloud / group) under the ask; the family label is screen-reader-only where it repeats a crumb. Console siblings, related cards and finder rows are kit `A` links. `parity.py` on all 42 pages: 0 missing (e.g. gpus text 45/45, links 13/13; local 27/27, 2/2).

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [ ] `PageHero`; nothing above the h1 (nothing above the h1: yes; `PageHero` does not exist in the kit, requested)
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer
- [x] Card-to-page links use Morph; title lands within 12px

Done here: The name cuts in by its line mask on arrival (700 ms) and the console starts typing within a second; the whole prompt is visible (faint) from the first paint, so nothing blinks. Neighbouring groups get different first screens (stage / wide / path / field), so gpus, embeddings, evals and secrets no longer share a hero. Related cards are big links, so the shared Morph opens them into their page.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text; failure never says Copied (first half yes; the failure state is kit `Copy`, requested)
- [ ] `data-cta` and `data-thumb` on every primary (hero yes: `data-cta="cloud.<slug>.hero"` + `data-thumb`; the Band's primary is kit `Band`, which takes no id: requested)

Done here: Hero asks are kit `Cta` with per-page ids (`cloud.gpus.hero`, `cloud.gpus.hero-1`). The site ask carries the product's first action after the hero; the console and finder no longer hide it.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [x] Marquees pause, freeze under reduced motion, hide duplicates (n/a: no marquee)
- [x] Privacy link and owner line beside every submit (n/a: no form)

Done here: Status is Hanzo's own word with a shape (filled dot, half dot, ring), never a colour. Spec values, endpoints and Google Cloud pairs are read from each page's own copy by `cloudData.js` (`cloudData.test.mjs`: OK). The console's example rows are Hanzo's own example project, captioned as such.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts
- [x] `python3 scripts/parity.py /<path>`: 0 missing

Done here: `audit.cjs` at 375: only 12px mono-capital labels (status, spec keys, card numbers). Parity: 0 missing on all 42 members.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` OK on `CloudProduct.jsx` and `cloudfam.css`; every value is a `--k-*` deck token. The status and crumb sit under the h1. Four first screens by group (`VARIANT` in `CloudProduct.jsx`), each member's own Sigil seed and console.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading (disabled/loading n/a: no async control)
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs are native, trap focus and return it (n/a: no dialog)
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: listed below

Done here: Service rows, sibling tabs, pause, copy, finder rows and related cards answer on hover and press; hovers sit in `@media (hover: hover)`. The finder input is 16px. Forks deleted: see the line at the top.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit

Done here: Signature: the session runs in the console. Supporting: typing, the gliding lit row (`layoutId`), Sigil, scroll (`variety.py` OK, no `Rise`). Kinds: time, scroll, pointer, state, arrival. Walks are one-shot `setTimeout` steps; the finder's idle scan is one pass under 5 s. Reduced motion: prompt typed, rows still, stage flat. 8 Nov: the family rows open on click, tap or focus only (hover lights a row): opening under a passing mouse moved the page (CLS 0.156 on gpus, now 0.000); the Google Cloud light walks its pairs again and again while in view.

## 10. Media
- [x] `Film` and `Pic` only; sizes and posters set (n/a: no photo or video)
- [x] At most 2 videos playing; pause button on loops over 5 s (n/a: no video; the console has a pause)
- [x] Budgets met; nothing missing; alt on every image (n/a: no images; Sigils are inline SVG, `aria-hidden`)
- [x] No dimmed or filtered photo; 4+ real visuals together where the page has them (n/a: Hanzo's cloud pages have no photography)

Done here: The objects are the product's own console, its endpoint, its Sigil field, the spec card, the finder and the related cards. No raw `img` or `video`.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: `audit.cjs` on gpus, evals, secrets, local at 375: CLS 0, taps list empty, no sideways scroll. The phone prompt keeps one wrapping while it types (no overlap; fixed this round). Ask at about y 270 on the phone. 8 Nov: an opened row's address stays one line and trails off (it had split mid-word at 375); the Google Cloud room's words sit 20px inside its black card on phones.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused (n/a for errors: the finder has a label and a live count)
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: The faint prompt is white 55% on black (decorative until typed; the same text is read once by screen readers). The console's pause stops the session; the finder scan stops on its own under 5 s. Every row and tab is a button or link.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: The name, prompt and console rows are server-rendered; animation is transform and opacity only. No fetch from the page: everything is read at build time from `content/pages/cloud/*.html` by `cloudData.js`.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: `generateMetadata` reads each member's title and description from `content/pages.json`; `<JsonLd route={'/cloud/' + slug} />` on every member; canonical and og:url from the shared layout.

## 15. Catalogue and product pages
- [x] Model card matches `SPEC.md` (n/a: no model card on cloud pages)
- [x] Every card opens by Morph
- [x] Every maker and model page linked in the DOM (n/a: product pages; every sibling product is linked from the console)
- [x] One price figure everywhere (n/a: no price)

Done here: Each product page links every sibling in its group (console nav) and three related products (cards with their own Sigils). The Google Cloud finder appears only on the 18 pages that have a pair.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display
- [x] Config blocks parse on their own (n/a: no config blocks)
- [x] Terminal pauses and ends on a static frame
- [x] No hand-typed version number

Done here: The Paste and ship prompt copies exactly what is shown; /cloud/local's boot session pauses and rests on its last line.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed (n/a for loading/error/offline: no live data; empty: the finder shows "0 / 18")
- [x] Blocked live data leaves a complete page, no console errors
- [ ] A failed submit keeps its values and shows no success (n/a: no form)
- [ ] A thrown island does not blank the page (no page-local error boundary; requested as a kit part)

Done here: No network calls. `look.cjs` errors: none on gpus, embeddings, evals, secrets. /cloud/local's crash on a missing crumb list was found and fixed this round (guarded, 200).

## 18. Measurement and handover
- [ ] `data-cta` on every primary; events only through `lib/track.js` (hero yes; Band primary blocked on kit; `lib/track.js` does not exist)
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [ ] `V2: <score>/10 <one line>` in the page file's top comment (added after the critic's verdict)
- [ ] Review read: `docs/build-notes/review/cloud-family.md` verdict 8 or more (re-review requested after this rework)

Done here: The pages send nothing; per-page `data-cta` ids on the hero asks. Gallery proof in `docs/gallery/cloud/`. Critic verdict before this rework: 5/10; this card is updated with the new verdict. 8 Nov: copycheck missing 0 on all 42 members (cascading headings carry their whole text once, status chips as plain text, the session note on every member).
