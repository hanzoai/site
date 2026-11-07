# /analytics coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/cloud/Analytics.jsx` (+ `Analytics.css`) · gallery: `docs/gallery/analytics/` · metric id: `api_key_created` (proxy on this page: `cta_click analytics.hero`)

Open copy questions for James: (1) Hanzo's sample links `jane@example.com` to `/cdn-cgi/l/email-protection` (Cloudflare's email guard); the kit's CodeBlock is plain text, so the link now sits as a caption under the JavaScript sample: keep or drop? (2) "M+", "K+" and the empty "Contributors" figure print no number on live; kept as printed (an em dash for the empty one). (3) "Deploy to Cloud" in the close goes to `platform.hanzo.ai/deploy` as on live. No CTA label changed.
Shared changes requested (`docs/requests/analytics.md`): none filed; kit gaps go to the Cloud 1 kit owner in the report (CodeBlock greys and its 32px copy, `.x-arrow` hit area, no line numbers in CodeBlock).
Forks this page deleted: the hand-made JS highlighter `Lines`/`an-pre` (now the kit `CodeBlock`, twice, plus a line-number gutter in the flow); the hand-made language tablist `an-langs` (now kit `Tabs`/`TabPanel`, every panel in the HTML); every hand-made `kn-btn` ask (9, now kit `Cta` solid/quiet/link); `Count` on the three KPIs (true values settle by line mask); Frame's `useLive`/`useEvery` (a `setInterval`; now page-local `useSeen` and a timeout chain); the floating hour label over the chart (now read out in the chart header); the floating shadowed cliff badge over the funnel (now an icon inside the "Step 4" label); the per-page accent.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from Hanzo's copy (`lib/cta.js` does not exist yet; labels are the live ones)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; ~~prices from `lib/plans.js`~~ n/a: no prices on this page
- [x] Open copy questions for James listed, none decided

Done here: "Try Hanzo" → /login is the page's ask (`analytics.hero`, `data-thumb`). Above 700px it is now the first screen's one solid fill (48px, page-scoped CSS on `[data-cta="analytics.hero"]` with `--btn-solid-bg/-ink/-hover`; measured rgb(10,10,10), hover #262626 from the deck ramp); while it shows, the header's "Try Hanzo" is an outline, and the header goes solid once it scrolls away. On phones the header's "Try Hanzo" is always solid, so the hero's stays a 48px outline there (one solid per view at both sizes). Again after the script (`analytics.script`, quiet) with "Request Demo" as its link: the one ask pair there; "A script, then an API" is now a text disclosure under a hairline, not a third pill. "Deploy to Cloud" is the close's one solid (`analytics.close`). In the sheets one quiet button leads and the rest are text links (API sheet: View Documentation quiet, API Reference and Example Projects links; Open Source sheet: View Docs quiet, View Repository and GitHub Repo links).

## 2. Information architecture and navigation
- [x] One `<main>`; the layout's skip link reaches its `#main` mark
- [x] Every link through `A` or `Cta`; every card a real control
- [x] ~~Breadcrumb at depth 2 or more~~ n/a: /analytics is depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: Parity links 13/13, including the re-homed `/cdn-cgi/l/email-protection`. Header and footer untouched; every external link goes through `A` (rel and new tab).

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] ~~`PageHero`~~ the kit's `KeynoteStage` is this family's hero (h1 52px at ~38%, nothing above it; the kicker sits under the asks)
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip (security spec), closing block, footer
- [x] ~~Card-to-page links use Morph~~ n/a: the report cards open in place (`KeynoteOpen`), no card leaves the page

Done here: Analytics' own hero, not the cloud side template: KeynoteStage `look="split"` with "Hanzo Analytics" on one line across the left (h1 y 223–276 at 1470×801, baseline ~33%), the lede (17px) and the ask pair on the right, and the dashboard a full-width stage below (x 113–1357 at its 1.08 start, settling to the grid as you scroll): KPIs as a column on the left, the activity line in the middle, the realtime feed on the right. No traffic-light dots or window bar; the demo's pause sits in the board's own top strip beside "Hanzo Analytics Dashboard · example" and the mono "Web analytics you host yourself". "The reports" peeks 56px at the fold (y 745). At first paint the copy, asks and stage are present (they cut in by position only from 0 s, never from transparent; the KPIs settle within 0.38 s). Order: hero, reports, three pinned chapters, commerce, graphite AI room, script, security spec, community, close. Section padding is page-scoped to 48–88px; page height 12,274 → 10,973 at 1470 and 16,348 → 14,593 at 375.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn` or hand-made `kn-btn` ask
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text; failure never says Copied
- [x] `data-cta` and `data-thumb` on every primary

Done here: The header carries "Try Hanzo" at every width, the same words as the page's ask (so the phone bar stays away, by SYSTEM.md §5). 17 `data-cta` ids under `analytics.*` (hero, hero-2, script, script-2, close, close-docs, close-github, reports-docs, resources, api-*, oss-*). Copy is the kit's `CodeBlock`/`Copy` (copies the displayed code; the `$ ` prompt is not copied).

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [x] ~~Marquees pause~~ n/a: no marquee
- [x] ~~Privacy link and owner line beside every submit~~ n/a: no form

Done here: Every figure is Hanzo's and printed byte for byte (127,543, 4.87%, $45,892, 1,240, 876, +24.5%, 4.78%, $87.32, 98/85/79, 98.7%, 14:32 UTC, 23%, 150ms); none counts. Charts, cohorts and bars are drawn and print no numbers; the dashboards keep Hanzo's "example" chip.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts
- [x] `python3 scripts/parity.py /analytics`: 0 missing

Done here: Parity text 223/223, links 13/13. Phone audit at 375: no text under 14px except the kit's 12px mono chapter count; sizes are deck only (h1 52/40, headings 26, H3 17, lede 21/20, body 16, captions 13/14, figures 64 Air on the commerce board, KPIs 32/26).

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside the deck ramp
- [x] No label, tag, badge or pill above a headline
- [x] Radii 6/12/16/24/999; no shadow; never outline plus fill
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: taste OK (2 checked). Replaced every off-deck grey (#fbfbfd #dcdce1 #f0f0f3 #c7c7cc #0b0b0c #8e8e93 #f5f5f7 #e8e8ed #161618 #a1a1a6 #d1d1d6 #48484a #6e6e73) with deck values; removed 6 shadows (panel, badge, dots); the cliff is a hatched bar (shape, not colour). "Ask it as a question" now sits under its chips; the oss figures moved below "Open Source".

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs (kit sheet, opened card) close on Esc and return focus
- [x] ~~Inputs 16px or larger~~ n/a: no input; no bare `:hover` (all inside `@media (hover: hover)`)
- [x] Forks this page deleted: listed above

Done here: Question chips fill #f5f5f5 with an ink border and the arrow steps 4px; report cards lift 4px, turn their hairline ink, spin the plus and start their own picture (Realtime rows wipe in, the Journeys path draws, funnel bars fill, events wipe, attribution blocks grow); every link ask ("Request Demo", "Read how reports work", "Read the docs"…) draws an underline from the left and moves its arrow 5px (measured background-size 0 → 100%); security spec rows take a #fafafa fill inside the gutter (x 159–1311, words inset 16px), each of the seven features is a real `role="switch"` button (`aria-checked`, the thumb slides, a press scales .98 and plays the shared "tick"; checked once in Playwright: true → false), feature rows fill #f5f5f5, the audit card lifts and its page tilts; the repo card lifts with an ink border and its arrow turns. Resource rows, Apply and the chart also answer; press at .97–.98, focus `2px solid var(--focus)`. Apply keeps its width and gains a tick. No `title=` on the page.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [ ] ~~Sound~~ the shared sound kit is not in yet

Done here: `variety.py` OK (pathLength only in the page file; 0 Rise). Kinds: idle (realtime, line draws), pointer (hairline + hour readout, magnetic ask), time (a visit every 2.4 s), state (cards, chips, Apply, tabs), arrival (cut-in, settle), scroll (chapters, Stage settle, room). No springs; tweens on the deck curves, 90–500 ms, line draws 1.2–1.4 s; reveals are wipes and masks, no fades of text.

## 10. Media
- [x] ~~`Film`/`Pic`~~ n/a: no Hanzo image or film on this page; its objects are product UI
- [x] ~~At most 2 videos~~ n/a: no video
- [x] ~~Budgets, alt~~ n/a: no image
- [x] ~~No dimmed photo~~ n/a: no photo

Done here: Every section's object is drawn UI, all SVG or CSS: dashboard, report pictures, funnel/cohort/revenue scenes, commerce board, AI panel, code, and now the security features as a settings panel (seven real switches that turn on in sequence when seen and toggle on press), "Continual internal audits / Report on request." as a document card, and "Powered by Community" led by a repository card (a 26-week contribution grid that fills in week by week, linking to github.com/hanzoai/insights). The Attribution card's "referrer" block has a 92px floor, so the word is no longer clipped. The Open Source sheet's "M+", "K+" and "—" (Hanzo prints no number in them) are set at 26px, never figure size.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: Audit: 320 sideways none; sweep desk/phone sideways none; phone targets under 44px none (the link `Cta`s were 21px, now 44px). At 375 the ask ends near y≈290; the funnel's "Step 4" no longer wraps (icon hidden on phones, the hatch carries it). Below 900px the five report cards are one snap rail (`scroll-snap-type: x proximity`, cards 82% wide so the next peeks) and the question chips one swipeable row, so Reports is 801px tall at 375 (was 2,542). In an opened report on a phone the picture starts under the close button, so no referrer is covered.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] ~~Forms labelled~~ n/a: no form
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: On #f5f5f5 (community, retention, card art) muted text is #525252; on white #525252/#737373; in the graphite room #fafafa, white 78%, #a3a3a3. The realtime loop runs only while seen and stops on the board's own pause (a 36px button with a 44px hit area in the dashboard's top strip, `aria-pressed`; it also holds every CSS loop in the board); the dark room's ring plays 3 times and stops. Headings 1 then 2/3 with no skips.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: The first screen's motion is CSS on server HTML; the realtime list uses one timeout chain while seen and unpaused; no `setInterval`. Filming ran in the cloud container.

## 14. SEO and machine files
- [x] Title and description match live (`content/pages.json`)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real control

Done here: `app/analytics/page.jsx` reads title "Hanzo Analytics — Hanzo AI" and its description from `content/pages.json`; canonical and og:url are both `https://hanzo.ai/analytics/`; two JSON-LD blocks render.

## 15. Catalogue and product pages
- [x] ~~Model card matches `SPEC.md`~~ n/a: not a catalogue or model page
- [x] ~~Every card opens by Morph~~ n/a: report cards open in place
- [x] ~~Every maker and model page linked~~ n/a
- [x] ~~One price figure everywhere~~ n/a: no price

Done here: Follows the cloud product anatomy: identity (Stage), the console (dashboard), openable features (report cards), the Get block.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display
- [x] ~~Config blocks parse on their own~~ n/a: JavaScript samples, no JSON config
- [x] ~~Terminal pauses~~ n/a: no terminal animation
- [x] No hand-typed version number

Done here: Three kit `CodeBlock`s (analytics.js, `npm install hanzo-analytics` with an unselectable `$ `, the full sample in the JavaScript tab), held to the deck page-locally (#0a0a0a fill, comments white 55%, 44px copy).

## 17. States and resilience
- [x] ~~Loading, empty, error, offline~~ n/a: no live data or form; every value is static Hanzo copy
- [x] Blocked live data leaves a complete page, no console errors
- [x] ~~A failed submit keeps its values~~ n/a: no form
- [x] A thrown island does not blank the page

Done here: No fetch on the page; film and sweep show 0 console errors at desk and phone. Paused, reduced-motion and JS-off states each show the final drawing.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through the kit `Cta` (`hz-event`)
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: 8/10 …` in the page file's top comment
- [x] Review read: `docs/review/analytics.md` (round 2 critic, 7.5/10); its fixes are done in round 3

Done here: Primary `analytics.hero` with `data-thumb`; gallery `docs/gallery/analytics/` (desktop.mp4, desktop.jpg, phone-1..3.jpg, plus round 2 `desktop-r2.jpg`, `phone-r2.jpg` and round 3 `desktop-r3.jpg`, `phone-r3.jpg`). Own score 8/10; the critic's verdict decides.
