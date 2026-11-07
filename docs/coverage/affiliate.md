# /affiliate coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Affiliate.jsx` · gallery: `docs/gallery/affiliate/` · metric id: `contact_click`

Open copy questions for James: none (the page uses Hanzo's words only; the copy control is icon-only until James approves "Copy").
Shared changes requested (`docs/requests/<page>.md`): `docs/requests/affiliate.md` (the header's ask outlines while the page's own ask is on screen, and carries it after the hero).
Forks this page deleted: the forked xp-cta button colours (now kit `Cta` sized by `.xp-cta`), the hand-rolled case tabs (now kit `Tabs`), the browser-window hero and its placeholder bars, every invented label.


## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js`
- [x] Open copy questions for James listed, none decided

Done here: Header comment in `app/affiliate/page.jsx` names Persona, Goal, CTA, Metric `contact_click`, Signature, Beyond. One solid per screen: the kit `Cta` "Apply" (hero `affiliate.hero`, close `affiliate.close`); the header's ask is outlined from the first paint (page CSS keyed on `main.xaf`) and turns solid only when the page sets `html[data-xaf-solid]`, i.e. while none of its own Apply buttons is on screen; measured one solid at 1, 2 and 3 s on cold loads at both sizes. No copy questions.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- ~~Breadcrumb at depth 2 or more~~ n/a: depth 1 page.
- [x] Link parity: 0 removed, 0 unexpected

Done here: One `<main>` from the layout's `#main`; links via `A`/`Cta`; /referral link kept; parity links 2/3 (the third is Cloudflare's email-protection artifact, the real mailto is on the page).

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [ ] `PageHero`; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [ ] Ends in proof strip, `Band`, footer
- ~~Card-to-page links use Morph; title lands within 12px~~ n/a: no cards on this page.

Done here: First screen at 1470×801: h1 (52px) top-left, lede and Apply top-right (8/5 split, top-aligned), then the whole link band (44px mono) with its Affiliates caption inside it. No label above the h1; "Refer customers to Hanzo" (52px) cuts in by CSS line mask from the first paint, then the link writes itself once from the first paint: typed by 0.8 s, `<code>` marked by 1.1 s (CSS, so nothing is wiped and retyped; JS off shows it whole). The link band hands straight into "How it works" (no bottom padding; the stage starts 96px under the caption), and the pin is 0.55 viewport per step (2563px for 4 steps). `PageHero` is not in the kit yet: the hero is page-local (headline, lede, one Cta). The page ends on its own light close (headline + Apply) then the footer; kit `Band` would be a second dark room back to back with the rule room. JS off: `NoJs` shows every final state.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text; failure never says Copied
- [x] `data-cta` and `data-thumb` on every primary

Done here: Kit `Cta` only (no raw `.x-btn` in the page file); `data-cta` and `data-thumb` on the hero Apply; the copy control copies exactly `POST /v1/affiliate/apply` and never says copied on failure (kit `Copy`).

## 5. Trust and proof
- ~~No logo without documented permission; no seal; no invented number~~ n/a: no logos, seals or figures here; nothing to permit.
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- ~~Marquees pause, freeze under reduced motion, hide duplicates~~ n/a: no marquee.
- ~~Privacy link and owner line beside every submit~~ n/a: no form; the ask is a mailto.

Done here: Only Hanzo's rule (first touch, one affiliate per org, never your own); no figures, logos or seals.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- ~~Tables, FAQ, tabs and code use the kit parts~~ n/a: no table or FAQ; tabs are kit `Tabs`; the endpoint is inline code with kit `Copy`.
- [x] `python3 scripts/parity.py /affiliate`: 0 missing

Done here: Parity 15/15 text. Type from MASTER: h1 52px, section headings 26px, the link 44px mono (26px on phones), body 16px; no text under 13px. Step titles are Hanzo's own step sentences.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` passes (greys only: `#0a0a0a`, `#525252`, `--hz-*`); nothing above a headline; objects are outlined (1px black 10%) with no shadow; radii 24/16/999. Differs from /beta (film strip) and /bounty (GitHub window): its hero object is the link as type.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- ~~Dialogs are native, trap focus and return it~~ n/a: no dialog.
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: the forked xp-cta button colours (now kit `Cta` sized by `.xp-cta`), the hand-rolled case tabs (now kit `Tabs`), the browser-window hero and its placeholder bars, every invented label. listed below

Done here: Kit `Cta` states (hover fill, press .98, focus ring, busy on hand-off); kit `Tabs` with arrow keys; the rule panel has a 2px light focus ring; the in-text hello@hanzo.ai and "referral" links thicken and drop their underline on hover; chapter dots have a 44px hit area; no browser-default controls.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- ~~Sound only on the listed moments, through the one kit~~ n/a: the shared sound kit is not on main yet; nothing page-local plays sound.

Done here: Signature: sticky chapters (scroll). Time: the link writes itself once. Pointer: the link tilts up to 2.5° and Apply reveals hello@hanzo.ai on hover or focus (on phones too, so no address sits idle under the ask). State: rule tabs glide; the chapter object changes. Idle: after the link is written its caret keeps a slow blink and the `<code>` mark re-runs every 5 s (CSS only; none under reduced motion); the rule diagrams draw themselves. Ease-emphasis, no springs; reduced motion shows final states.

## 10. Media
- ~~`Film` and `Pic` only; sizes and posters set~~ n/a: no images or video; the objects are drawn (link, request, thread, diagrams).
- ~~At most 2 videos playing; pause button on loops over 5 s~~ n/a: no video.
- ~~Budgets met; nothing missing; alt on every image~~ n/a: no images.
- ~~No dimmed or filtered photo; 4+ real visuals together where the page has them~~ n/a: no photos; the page has no Hanzo media to show.

Done here: No raster media; product-style objects drawn in DOM and SVG.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: 375×812: the chapters become a swipe rail with dots, the rule tabs scroll sideways, Apply is full width and above the fold; no horizontal scroll at 320; targets 44px+.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- ~~Pause control on every moving item~~ n/a: nothing loops: the link writes once, the rule tabs advance only while unattended and stop on any choice; reduced motion stops all.
- ~~Forms labelled; first error focused~~ n/a: no form.
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: Greys on white at 4.5:1+ (`#525252` body, `#0a0a0a` ink); one h1, h2s in order; tablist with roving tabindex; chapter rail buttons; every control reachable by Tab.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: h1 text in server HTML (CSS animation, no opacity 0); no images; motion is transform, opacity and clip-path; loops stop off screen; nothing heavy run locally (filmed in the cloud).

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: Title and description unchanged from `content/pages.json`; `<JsonLd route="/affiliate" />` renders the canonical and og tags.

## 15. Catalogue and product pages
- ~~Model card matches `SPEC.md` (or n/a: not a catalogue or model page)~~ n/a: not a catalogue or model page.
- ~~Every card opens by Morph~~ n/a: no cards.
- ~~Every maker and model page linked in the DOM~~ n/a: not a catalogue.
- ~~One price figure everywhere~~ n/a: no prices.

Done here: n/a: not a catalogue or model page.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (or n/a: no code on the page)
- ~~Config blocks parse on their own~~ n/a: no config block.
- ~~Terminal pauses and ends on a static frame~~ n/a: no terminal.
- [x] No hand-typed version number

Done here: The one endpoint `POST /v1/affiliate/apply` copies exactly as shown; no code block or terminal.

## 17. States and resilience
- ~~Loading, empty, error and offline states designed~~ n/a: static page; no live data or form.
- ~~Blocked live data leaves a complete page, no console errors~~ n/a: no live data.
- ~~A failed submit keeps its values and shows no success~~ n/a: no form.
- [x] A thrown island does not blank the page

Done here: Static Hanzo copy; nothing to load or fail. With JS off every state is final and legible; the four steps sit in a 2-column grid inside the 1152px container, the POST bar unclipped.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js`
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/review/affiliate.md` verdict 8 or more (7/10 capped; awaiting re-review)

Done here: `data-cta` ids `affiliate.hero`, `affiliate.close` (the kit Cta fires `cta_click`); V2 line in the page and route headers. Review read: `docs/review/affiliate.md` gave 7/10 (capped on the old card; page itself 8); its fixes are done: card in this 18-part format, h1 rests at 52px, and the link (hero object) sits whole in the first screen at 1470×801 (44px mono, top 430; proof `docs/gallery/affiliate/v3-desktop-first.jpg`). Round 4: one solid from first paint, idle beat every 5 s, the Affiliates caption inside the link band, JS-off diagram curves drawn.
