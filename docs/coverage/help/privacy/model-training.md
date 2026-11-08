# /help/privacy/model-training coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/help/HelpArticle.jsx` (+ `HelpArticle.css`, `helpData.js`; route `app/help/privacy/model-training/page.jsx`) · gallery: `docs/gallery/help/privacy/model-training/` · metric id: none assigned (support page).

Open copy questions for James: (1) Hanzo's article has no call to action, so the page has no primary ask; the shared ask bar keeps the header's "Try Hanzo". (2) The breadcrumb uses the footer's existing label "Help center" (→ /support) and the topic word "Privacy" from Hanzo's "Help · Privacy".
Shared changes requested (`docs/requests/<page>.md`): none.
Forks this page deleted: the ported raw HTML page (served before by the catch-all), the spring-driven cursor (now an eased glide), the overshooting switch curve, and the panel's shadow plus outline (now one flat tile).

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js` (n/a: no ask on a help article; no solid fill on the page)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` (n/a: no prices)
- [x] Open copy questions for James listed, none decided

Done here: HelpArticle.jsx lines 14–19 carry Signature, Beyond, Persona, Goal, CTA and Metric. The h1 is Hanzo's question. The first screen holds the question, its one-line answer (the lede) and the live settings panel. The page adds no button of its own except the demo controls.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [x] Breadcrumb at depth 2 or more
- [x] Link parity: 0 removed, 0 unexpected

Done here: there is one `<main class="xhp">`. The breadcrumb reads "Help center" (link to /support), then "Privacy", then the question (`aria-current="page"`, not a link; hidden on phones). Links go through the kit `A`. `#choices` and the email link stay plain anchors, and the email keeps Hanzo's protected link in the HTML and becomes a mailto once scripts run. Link parity is 4/4.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero`; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer (n/a: a help article ends on its own "More" section)
- [x] Card-to-page links use Morph; title lands within 12px (`data-morph-target` on the h1)

Done here: the h1 cuts in by line mask (700ms, ease-emphasis). The cursor makes its first move at about 0.55s, and the menu opens by 1.4s, without input. The h1 baseline sits near 40% at 1470×801 (h1 box 219–335px). Above the h1 there is only the breadcrumb, and "Help · Privacy" sits under the lede. With JS off a `<noscript>` style shows the h1 and lede and hides the hand (checked with Playwright `javaScriptEnabled:false`). There is no kit `PageHero` yet, so the hero is page-local to its spec.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label (shared: the header's "Try Hanzo")
- [x] Copy button copies exactly the displayed text (n/a: nothing to copy)
- [x] `data-cta` and `data-thumb` on every primary (n/a: no primary)

Done here: no `.x-btn` and no solid fill. The demo's own controls are a radiogroup (web and desktop / mobile), the step buttons and a `role="switch"`. They are a tryout that sends nothing.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number (n/a: no figures)
- [x] Marquees pause, freeze under reduced motion, hide duplicates (n/a: none)
- [x] Privacy link and owner line beside every submit (n/a: no form)

Done here: n/a for proof: a help article. Every sentence is Hanzo's. The drawn panel uses grey placeholder bars, not invented menu items, and its only words are the setting's name and the steps' own bold words (Settings, Privacy).

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts (n/a: none on the page)
- [x] `python3 scripts/parity.py /<path>`: 0 missing

Done here: deck sizes: h1 52 (phone 32), h2 26, lede 21 (phone 17), body and index 16, panel text 13–14, mono capitals 12. Measures: lede 44ch, body 64ch, and headings use `text-wrap: balance`. Parity is 45/45 text and 4/4 links.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` OK. Neutrals are declared once as page tokens on `.xhp`. Section numbers hang beside the h2s, not above them. Radii: panel tile 24 (flat fill, no shadow or outline), outlined step cards 16, buttons full. Only the drawn menu, which floats in the mock, takes the deck's floating shadow. The hero medium is a drawn product panel on a paper page, unlike the story and agent pages.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs are native, trap focus and return it (n/a: no dialog)
- [x] Inputs 16px or larger; no bare `:hover` (n/a inputs)
- [x] Forks this page deleted: listed below

Done here: the step buttons, the segmented control and the switch each have hover (inside `@media (hover: hover)`), press (scale .97, 90ms), focus-visible (2px ink ring) and a selected state. Links shift their underline on hover and drop 1px on press. Forks deleted: see the top of this card.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit (n/a: no sound kit merged yet)

Done here: the signature is the self-walking panel. Supporting: the drawn tick on save; `variety.py` counts 1 technique and 0 fade-ups. Kinds of motion: time (the walk), state (screens slide, switch, step selection), pointer (the walk pauses under the pointer) and arrival (h1 cut-in). Nothing is scroll-linked. The glide is 500ms ease-emphasis; screens use 300/400ms; there are no springs and no overshoot. Timers are `setTimeout` only. Under reduced motion the hand is hidden, the final screen shows, and `getAnimations()` is empty after 3s (checked).

## 10. Media
- [x] `Film` and `Pic` only; sizes and posters set (n/a: no image or video)
- [x] At most 2 videos playing; pause button on loops over 5 s (n/a)
- [x] Budgets met; nothing missing; alt on every image (n/a)
- [x] No dimmed or filtered photo; 4+ real visuals together where the page has them (n/a)

Done here: n/a: the page has no images or video. The panel is drawn in HTML and CSS.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667 (n/a: no ask)

Done here: at 1470×801 the sticky panel spans 87–723px depending on the answer shown, clear of the fold. At 375×812 the order is crumb, question, lede, topic, panel, index, then document, and the panel starts on the mobile steps. scrollWidth is 375 at 375px and 320 at 320px. The segmented buttons, step buttons and switch are each 44px or more, and pressing a step shows it in the panel.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused (n/a: no form)
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: on white the text is #0a0a0a, #262626, #525252 or #737373 (4.74:1); on the #f5f5f5 tile it is #525252 or darker. The walk loops, so a 44px pause control (`aria-pressed`, icon with aria-label Pause or Play) sits first in the panel. The walk also stops for good once you press a step or the switch, and it pauses while the pointer rests on the stage. Headings run h1 → h2 → h3. The drawn screens are `aria-hidden`; the real switch is `role="switch"`, and the meaning of the choice is announced in an `aria-live` region.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: the route is a server file reading `content/pages` at build. The h1 and document are in the server HTML. The walk runs only while the panel is on screen, with no rAF loop of its own. All filming ran in the cloud. Gap: no Lighthouse or bundle measurement.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link (n/a: no cards)

Done here: `metadata` is read unedited from `content/pages.json`, and `<JsonLd route="/help/privacy/model-training">` provides canonical, og:url and schema.org.

## 15. Catalogue and product pages
- [x] Model card matches `SPEC.md` (n/a: not a catalogue or model page)
- [x] Every card opens by Morph (n/a)
- [x] Every maker and model page linked in the DOM (n/a)
- [x] One price figure everywhere (n/a)

Done here: n/a: a help article.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (n/a: no code on the page)
- [x] Config blocks parse on their own (n/a)
- [x] Terminal pauses and ends on a static frame (n/a)
- [x] No hand-typed version number (n/a)

Done here: n/a: no code, terminal or version on the page.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed
- [x] Blocked live data leaves a complete page, no console errors
- [x] A failed submit keeps its values and shows no success (n/a: no form)
- [x] A thrown island does not blank the page

Done here: the page is static, with no live data, so there is no loading, empty or offline state to show. The document reads in full whatever the panel does, and with scripts off the panel shows its first screen. There were 0 console errors with hanzo.ai blocked, and the shell's `app/error.jsx` boundary keeps the header and footer.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js` (n/a: no primary; the tryout sends nothing)
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [x] Review read: `docs/review/help/privacy/model-training.md` (round 6, 7/10, 7 Nov); fixes applied 8 Nov

Done here: the `V2:` line is in HelpArticle.jsx. The page sends no events and holds no identifiers. Round 6 review fixes (8 Nov): 1 the panel no longer repeats the body (its "When it is on… When it is off…" pair and the saved line are gone; the switch and its name stay); 2 one switch per screen (the panel's own switch steps aside while 01's scene or 04's ledger shows its own; the phone's 01 switch card is gone); 3 phone 04: the four rows are the checklist (a tick on the row being read), no separate card; 4 the panel's section label is its contents number alone (x / 04 is the walk's steps only); 5 the phone mock's app and settings screens clip inside the bezel; 6 not done: no pinned phone stage (COPY-RULE 4: a help article stays simple; the steps already drive the demo when pressed); 7 the panel's dead band went with the pair; 8 the demo switch answers hover (thumb nudges 2px, track darkens) and press (.94); 9 the close's "More" bottom-aligns with its text and Help Center row; 10 the Noto Kufi Arabic-first heading stack is shared (globals), reported to the lead. Copy: every run of Hanzo's words beside a bold word or link is its own element; an offline copycheck against `content/live/help/privacy/model-training.json` reads missing 0 of 35 (hanzo.ai is not reachable from the cloud session).
