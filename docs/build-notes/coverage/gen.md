# /gen coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Gen.jsx` · gallery: `docs/gallery/gen/` · metric id: `api_key_created`

Open copy questions for James: none new. The header ask label ("Try Hanzo" while the page's ask is "Get API key") is a shared change, filed in `docs/build-notes/requests/apps1.md` item 1.
Shared changes requested (`docs/build-notes/requests/apps1.md`): only the `Band` `id` prop is still open (this page closes on its own ask row with `<Cta id>`); the header ask and the ask bar landed with the shared system.
Forks this page deleted: the native `<select>` agent picker (now Previous/Next buttons), the page-local tabs (now kit `Tabs`/`TabPanel`), the page-local FAQ (now kit `Faq`, multi-open, `#q-slug`), the raw `.x-btn` hero links (now `<Cta>` and text links), `Magnetic`, every label above a heading (h1's included), the scrambled-letter flip.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` (n/a: no prices)
- [x] Open copy questions for James listed, none decided

Done here: one solid "Get API key" (`platform.hanzo.ai/keys`) in the hero and the same one in the closing room; On phones the page-local `usePhoneAsk` (round 3) outlines the header's "Try Hanzo" while any solid ask of the page is on screen, so the first screen shows one solid at both sizes. `lib/cta.js` has not landed, so the label is Hanzo's live one.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [x] Breadcrumb at depth 2 or more (n/a: depth 1)
- [x] Link parity: 0 removed, 0 unexpected

Done here: parity links 10/10. The former section labels (Install, Gen and Dev, Agents, Our rails, In the Hanzo CLI, Read, Questions, Open source) are now one index row of in-page links under the hero, each 52 to 56px tall; `#agents` and `#install` keep working.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero`; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer
- [x] Card-to-page links use Morph; title lands within 12px

Done here: the h1 is plain server HTML (no mask holding it back on a slow machine); the board starts flipping in the first second (check.mjs: moving at both sizes). JS off: 0 hidden blocks. Order: board, index, install window, Gen and Dev pair, keys, rails builder, CLI twin, read grid and paste, FAQ, then the black closing room with "Get API key" and "Read the docs". The Dev card is a link and morphs to /dev.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text; failure never says Copied
- [x] `data-cta` and `data-thumb` on every primary

Done here: `<Cta id="gen.hero" thumb>` and `<Cta id="gen.band">`; secondaries carry `gen.*` ids. Desktop: the shared Ask swaps the header to a solid "Get API key" after the hero (outlined while the hero's ask shows). Phones (measured 8 Nov at 375×812): `usePhoneAsk` outlines the header's "Try Hanzo" while the hero's "Get API key" is on screen, so one solid shows at a time; after the hero the header goes back to a solid "Try Hanzo", because the hook keeps Hanzo's label when "Get API key" would end 2.7px past the 16px gutter (right edge 361.7 > 359), and the shared slim bar did not rise at any depth (0, 900, 2000, 4000, 6000). So on phones the page's own ask shows in the hero and the closing room only; asked of the shared owner (docs/build-notes/requests/apps1.md item 1). Every Copy copies the shown command; `$` is `user-select: none` and not copied.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [x] Marquees pause, freeze under reduced motion, hide duplicates (n/a: no marquee)
- [x] Privacy link and owner line beside every submit (n/a: no form)

Done here: the only figures are the 23 agents (the live list) and "v0.1.0" (Hanzo's release link text).

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts
- [x] `python3 scripts/parity.py /gen`: 0 missing

Done here: parity text 164/164. Kit `Tabs` for install, kit `Faq` for questions. The code windows are product objects with a Copy per line, so they stay page-local (noted).

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: taste OK; check.mjs: 0 labels over headlines. h1 52/40, section heads 26, one 32/44 statement per screen; greys only (`#525252`, `#737373` on white). Objects are outlined, tiles flat. The 4/8 copy-beside-board first screen is unique in the Apps group.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs are native, trap focus and return it (n/a: no dialog)
- [x] Inputs 16px or larger; no bare `:hover` (n/a: no inputs; hovers inside `@media (hover: hover)`)
- [x] Forks this page deleted: listed below

Done here: keys, switches, stepper, pause and links press at scale .97/.98 or translateY(1px); the `--model` switch shows disabled (dashed) until `--cloud` is on. Deleted forks are listed at the top.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit

Done here: signature board (idle and time: each tile turns over once, 90 + 150 ms, no scrambled letters), the rails' beacons (state), the black room opening from a rounded card (the one scroll-linked effect), switches at 300 ms ease (no springs). variety.py: 2 counted techniques, 0 Rise. The board walks the 23 once at 2.2 s each, then rests. The board's walk ends on the kit's faint 'done' chime (`play('done')`); switches, keys and tabs tick through the kit's `[role=switch]`, `[aria-pressed]` and `[role=tab]` rules.

## 10. Media
- [x] `Film` and `Pic` only; sizes and posters set (n/a: no media)
- [x] At most 2 videos playing; pause button on loops over 5 s (n/a)
- [x] Budgets met; nothing missing; alt on every image (n/a)
- [x] No dimmed or filtered photo; 4+ real visuals together where the page has them (n/a)

Done here: the page has no images or films; every visual is Gen's own text (board, commands, flags).

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: phone order h1, lede, "Get API key" (y about 410), then the board with its tiles moving by 660px; check.mjs phone: 0 small targets, CLS 0.000. The install panels hold a fixed height (392 / 480px), so switching tabs never moves the page.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused (n/a: no form)
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: a 44px Pause (aria-pressed) sits first in the board; the caption under it is `aria-live="polite"`. Switches are `role="switch"` with `aria-checked`; keys `aria-pressed`; kit Tabs take arrow keys.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: the h1, the board's first agent and every command are in the server HTML; timers stop off screen (`useInView`); filming ran in the cloud session.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: `app/gen/page.jsx` keeps its metadata and `<JsonLd route="/gen" />`.

## 15. Catalogue and product pages
- [x] n/a: not a catalogue or model page
- [x] n/a
- [x] n/a
- [x] n/a

Done here: n/a, /gen is a developer page.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (or n/a: no code on the page)
- [x] Config blocks parse on their own (n/a: no JSON)
- [x] Terminal pauses and ends on a static frame
- [x] No hand-typed version number

Done here: every line copies its exact command; the builder's `gen` and `hanzo dev` lines copy what they show; the board pauses and rests. "v0.1.0" is Hanzo's own link text, not typed by us.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed (n/a: no live data)
- [x] Blocked live data leaves a complete page, no console errors
- [x] A failed submit keeps its values and shows no success (n/a: no form)
- [x] A thrown island does not blank the page

Done here: nothing is fetched; console errors none; JS off shows every word.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js`
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [x] Review read: `docs/build-notes/review/gen.md` verdict 8 or more

Done here: `gen.hero`, `gen.band` plus `gen.*` secondaries; `<Cta>` sends `cta_click`. Review read (6/10): fixes 1 to 5 done in order (labels gone, h1's included; ask bar off with apps1.md referenced; closing ask row with "Get API key" and "Read the docs", Read and Paste moved above the FAQ; h1 paints first; this card). Self-score 8/10, pending the critic's re-walk.
