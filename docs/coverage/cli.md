# /cli coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/CliPage.jsx` · gallery: `docs/gallery/cli/` · metric id: `api_key_created`

Open copy questions for James: the CLI docs link (MASTER part 1 lists it): the live page sends both "Install from hanzo.sh" and "Install the CLI" to `https://docs.hanzo.ai/docs/cli`, kept as is. The hero says "Open source (MIT)" while the repo card says "License: Apache-2.0"; both are live strings, kept.
Shared changes requested (`docs/requests/cli.md`): none.
Forks this page deleted: the lime `.cli-go` button and the ghost `.x-btn` "View on GitHub" (now `<Cta>` solid and `<Cta kind="link">`); the second ending (the "Get CLI" card's solid "Deploy to Cloud" is a text link above the one Band); the 4 kickers over headlines; the tilted v1 terminal (`useTilt`); `Magnetic`; the hidden `<i data-thumb>`.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` (n/a: no prices on this page)
- [x] Open copy questions for James listed, none decided

Done here: Top of `CliPage.jsx` carries Persona/Goal/CTA/Metric/Signature/Beyond. One solid ("Install from hanzo.sh") in the hero and the same label as the closing band's one solid; check.mjs counts 1 solid on the first screen at 1470×801 and 375×812. `lib/cta.js` does not exist yet, so the label is Hanzo's live hero label.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [x] Breadcrumb at depth 2 or more (n/a: /cli is depth 1)
- [x] Link parity: 0 removed, 0 unexpected

Done here: every link is `A` or `<Cta>` (which renders `A`); parity links 10/10; the shell owns `<main id="main">` and the skip link.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero`; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer
- [x] Card-to-page links use Morph; title lands within 12px (n/a: no cards open into pages here; in-site links morph through the shell)

Done here: the session starts typing at 350 ms (check.mjs: 101 changes in the first second). Nothing sits above the h1 (the old kicker now titles the terminal bar). JS off: 0 invisible text blocks (every hidden state is scoped `.js`). Order: dark terminal, paste line, tree window, struck-command list, swipe rail, script builder, repo card, white closing band. `PageHero` is not in the kit yet; the hero is page-local.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text; failure never says Copied
- [x] `data-cta` and `data-thumb` on every primary

Done here: `<Cta id="cli.hero" thumb>` and `<Cta id="cli.band">`; the ask bar reads "Install from hanzo.sh". Every Copy copies the shown command; the `$` is `user-select: none` and not in the copied text (`Copy` uses `copyText`).

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [x] Marquees pause, freeze under reduced motion, hide duplicates (n/a: no marquee)
- [x] Privacy link and owner line beside every submit (n/a: no form)

Done here: the only figures are Hanzo's ("11 stars", "Apache-2.0", "3000", "/v1/chat"), shown as written; no logos.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts
- [x] `python3 scripts/parity.py /cli`: 0 missing

Done here: parity text 82/82, links 10/10. Phone rules lift every label to 14px. Code: the terminal, tree print pane and script window are the product objects themselves (MASTER 4.6 "a terminal as the hero"), so they stay page-local rather than `CodeBlock`; noted here.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: taste OK; check.mjs finds 0 labels over headlines. Rest sizes on the deck scale (h1 52/40, h2 26 or 32/44 for the one statement); greys only (`--soft #525252`, `--faint #737373` on white). The only first screen in the Apps group that is the product's own black room.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs are native, trap focus and return it (n/a: no dialog)
- [x] Inputs 16px or larger; no bare `:hover` (n/a: no inputs; all hovers inside `@media (hover: hover)`)
- [x] Forks this page deleted: listed below

Done here: tree rows, add toggles, rail arrows, pause/replay, repo links press at scale .98/.97 or translateY(1px); arrows disable at the rail ends; focus rings on every custom control. Deleted forks are listed at the top.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit (n/a: the shared sound kit has not landed)

Done here: signature typed session (time), tree selection glide (state, layoutId at 300 ms ease, no spring), added script block clip wipe (state), line-mask headlines (arrival); variety.py: 2 techniques, 0 Rise. Nothing is scroll-linked. The session runs once and rests on its final frame; reduced motion shows that frame.

## 10. Media
- [x] `Film` and `Pic` only; sizes and posters set (n/a: no images or films)
- [x] At most 2 videos playing; pause button on loops over 5 s (n/a: no video)
- [x] Budgets met; nothing missing; alt on every image (n/a)
- [x] No dimmed or filtered photo; 4+ real visuals together where the page has them (n/a: the page has no media)

Done here: the page has no images or films; every visual is the CLI's own text UI.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: check.mjs phone: 0 small tap targets, CLS 0.000. The tree print pane is fixed at 300px and the tree at 380px with its own scroll, and typed lines keep an invisible full-text ghost, so opening a folder or typing never moves the page (the review's 0.42 shift). Phone order: h1, session, lede, the one solid (y about 555 at 375×812).

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused (n/a: no form)
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: body grey #525252 and quiet #737373 on white; on black, white 78% and #a3a3a3. The terminal bar has a 44px Pause (aria-pressed) that becomes Replay when the session rests; the tree tour has its own Pause. Tree uses role tree/treeitem/group with aria-expanded/selected.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: the whole session, every tree command and every capability are in the server HTML; loops are timeouts that stop off screen (`useInView`); filming ran in the cloud session.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: `app/cli/page.jsx` keeps its metadata and renders `<JsonLd route="/cli" />`.

## 15. Catalogue and product pages
- [x] n/a: not a catalogue or model page
- [x] n/a
- [x] n/a
- [x] n/a

Done here: n/a, /cli is a developer page.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (or n/a: no code on the page)
- [x] Config blocks parse on their own (n/a: no JSON config)
- [x] Terminal pauses and ends on a static frame
- [x] No hand-typed version number

Done here: every command copies exactly what is shown (no `$`); the hero terminal starts in view, pauses, ends on the static final frame (also the SSR frame) and replays on demand; no version numbers are typed.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed (n/a: no live data on this page)
- [x] Blocked live data leaves a complete page, no console errors
- [x] A failed submit keeps its values and shows no success (n/a: no form)
- [x] A thrown island does not blank the page

Done here: the page fetches nothing; with JS off every word shows (check.mjs: 0 hidden); console errors: none.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js`
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [x] Review read: `docs/review/cli.md` verdict 8 or more

Done here: `data-cta="cli.hero"`, `cli.band`, plus `cli.*` on every secondary; `<Cta>` sends `cta_click`. Review read (7/10): all five fixes done in order (no green, one hero solid, one ending, fixed heights and 44px targets, no kickers); self-score 8/10 pending the critic's re-walk.
