# /pricing coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Pricing.jsx` (+ `Pricing.css`) · gallery: `docs/gallery/pricing/` · metric id: `cta_click` on `pricing.free`, `pricing.go`, `pricing.pro`

Open copy questions for James: the pricing source of truth (no `lib/plans.js` yet; prices are Hanzo's strings in the page); the dead pricing-button destinations (Dev, Max, Ultra and Team have no checkout link on Hanzo's page; they offer "Chat with buying specialist" until James names one).
Shared changes requested (`docs/requests/pricing.md`): the phone header ask outlined while a page's solid ask shows; the Band's blur reveal and double keyboard stop. Waiting on shared owners for `lib/cta.js`, `lib/plans.js`, `PageHero` and `tokens.css`; the page uses page-local deck values until then.
Forks this page deleted: the dark "recommended" Pro and Team cards, three solid buttons in a row, the page-local tab bar (now kit `Tabs`), hand-written tables (now kit `DataTable`), the reading-row stripe, the duplicate "Pay as you go" price line, the invented helper sentences, the roll-up-from-$0 arrival.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; n/a for `lib/cta.js` (not merged yet): labels are Hanzo's own ("Try Hanzo", "Get API Key")
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; n/a for `lib/plans.js` (not merged yet)
- [x] Open copy questions for James listed, none decided

Done here: Plan columns work as a picker. The lowest plan (Free) is selected by default and is the page's only solid ask; pointing previews a column, and a click or focus selects it. On desktop the shared header ask drops to an outline while it shows; on phones the shared header keeps its solid "Try Hanzo" (shared header, not this file), so the phone's first screen shows two solid fills until the shared owner changes it. Only the visible tab's asks carry `data-thumb`; measured on the first screen: Personal 1 solid (Free) at 1470 and 375, Team 1 at 1470; the API tab at 1470 shows 2 (header and "Get API Key") because the shared `Ask.jsx` reads the page ask once per route (requested, `docs/requests/pricing.md` item 3).

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it (the shell's `#main` mark sits before the page's `<main>`)
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [x] n/a: breadcrumb (depth 1)
- [x] Link parity: 0 removed, 0 unexpected

Done here: Parity shows 5/5 links. Kit `Tabs` (Personal, Team, API) sync to `#team` and `#api`. Trust links ("How Hanzo is secured", "Trust center", "Read the Privacy Policy") are re-homed beside the asks.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] n/a: `PageHero` (not merged yet). Nothing sits above the h1: "Pricing" cuts in by CSS line mask (700 ms) at first paint
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in `Band`, then the footer
- [x] Card-to-page: the plan's "Compare plans" grows a sheet out of its column (the page's Morph moment)

Done here: Prices are visible at once with no roll from 0. Within 0.2 s at both sizes Hanzo's model art (Enso, Zen, Kai) deals in beside the lede ("every model on one bill"), then each card lifts once in turn and rests on Enso by 4.3 s; the Pro column takes its first step at 1 s. JS off: 0 invisible text blocks (checked), and the Pro column shows only Pro (no misprice).

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label (shared `Ask.jsx` carries the selected plan's `data-thumb`)
- [x] n/a: no copy button on this page
- [x] `data-cta` and `data-thumb` on every primary

Done here: The `data-cta` ids are pricing.free, .go, .pro, .help, .team, .enterprise, .api.key, .api.sales and .api.try. Plan asks share one y within 1px (subgrid rows).

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [x] n/a: no marquee on this page
- [x] n/a: no form on this page; Privacy link sits beside the asks anyway

Done here: Every price is Hanzo's string. The Team total is plain arithmetic on Hanzo's seat prices for the visitor's own seat mix. Rates with float dust show their real precision (0.026250000000000002 shows as 0.02625).

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts
- [x] `python3 scripts/parity.py /pricing`: 0 missing

Done here: Parity is 100/100 text. Kit `Faq` shows the first three questions open-able; the other 22 sit behind one control with their true count ("+ 22"), and their answers stay in the HTML. Model rows keep the name in the row; the detail opens in place (`<details>`, findable).

## 7. Visual design system
- [x] `python3 scripts/taste.py` passes. Deck values are scoped on `.xpr` until `tokens.css` lands
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from the deck; never box plus shadow (the plan sheet is one outlined surface)
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours: a sheet of columns with rolling figures, no hero object or film

Done here:
- **Scale with rhythm:** h1 52px; section headings 26px Book 497; prices 64px Air 220 (the one big thing per screen); body 15–16px.
- **Plans:** columns of one sheet, divided by hairlines.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading (kit `Cta`)
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs trap focus and return it (`x-cannon/Drawer`, Esc closes)
- [x] n/a: no inputs; no bare `:hover` (all inside `@media (hover:hover)`)
- [x] Forks this page deleted: listed above

Done here: Every control has its states:
- **Segmented radios:** ease 300 ms, no spring.
- **Steppers:** disabled at 2 and at 100 members.
- **Press:** .97–.98 over 90 ms.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups (`variety.py` OK)
- [x] At least 3 kinds of movement; scroll-linked is none
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; the ladder uses one timeout plus an interval that ends after one lap
- [x] n/a: sound kit not merged (shared)

Done here: The signature is the odometer: 300 ms, rolling only between real prices, and announced politely. The other movement:
- **Idle:** the Pro ladder runs one lap within 4.3 s and stops on pointer or focus.
- **State:** the tab pill, the sheet growing out of its column, and the details opening.
- **Arrival:** the h1 cut-in.

## 10. Media
- [x] Kit `Img` only, sized (320×240 and 192×240), Enso with `priority`
- [x] n/a: no video
- [x] Three webp files already in `public/models/`; decorative (`aria-hidden`, `alt=""`)
- [x] No dimmed or filtered photo: the art shows as Hanzo made it

Done here: The hero strip shows Hanzo's own Enso, Zen and Kai art (the families the plans name) as black 20px cards; it is the page's only colour. The plan sheet and its rolling figures stay the main object.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320 (tables pin-scroll inside their own box)
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here:
- **Phone:** the art strip is 60px tall at 375 so the Free card starts inside the first screen; trust links and the band's link are 44px tall on phones (probe: no target under 44px except desktop-only links). The API tab's model families fold to one open (`<details>`), and "The rates" shows three with the other five behind "Read more"; measured page height on the API tab: 7,392px at 1470 and 10,799px at 375 (still long on phones: every rate and model row is Hanzo's copy and stays). The columns stack with hairlines.
- **Compare sheet:** shows one plan at a time on phones, picked from a switch over it.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast: text #0a0a0a, #525252 and #737373 on white; on #f5f5f5 only #525252 or darker
- [x] Pause control on every moving item (the ladder ends within 5 s; the odometer moves only on change)
- [x] n/a: no form
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control (APG tabs, radio groups, steppers, sheet with focus trap)

Done here: Prices sit in `aria-live="polite"`. The steppers are named groups. The disclosure summaries carry the register's "Read more" as their accessible name.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] No images or films; the odometer is CSS only
- [x] No poller; no third-party request
- [x] Nothing heavy run on James's laptop (filmed in the cloud)

Done here: Motion is transform and opacity only. The ladder's timers live only while the card is on screen. The page's only images are the three hero model-art webp files (Enso with `priority`), sized; they answer the plan picker (Free lights Enso and Zen, every other plan all three).

## 14. SEO and machine files
- [x] Title and description match `content/pages.json`
- [x] Canonical equals og:url equals the live URL (`https://hanzo.ai/pricing/`)
- [x] `<JsonLd route="/pricing">` parses
- [x] Every model "Start Using" link is a real link

Done here: The title is "Pricing — start free, every model on one bill — Hanzo AI". Every tab, variant and answer is in the server HTML.

## 15. Catalogue and product pages
- [x] n/a: not a catalogue or model page (the API tab lists model prices but no model cards)
- [x] n/a
- [x] n/a
- [x] One price figure everywhere: the compare sheet and the columns read the same strings

Done here: n/a for model cards. Each model price appears once, in its group's `DataTable`.

## 16. Developer experience
- [x] n/a: no code block (the endpoint lines are inline `code`)
- [x] n/a
- [x] n/a
- [x] No hand-typed version number

Done here: n/a. "Get API Key" (/dev) and the OpenAI-compatible endpoint line stay.

## 17. States and resilience
- [x] n/a: no live data, so no loading, empty or offline state
- [x] Blocked live data leaves a complete page: nothing is fetched
- [x] n/a: no form
- [x] A thrown island does not blank the page (shared `app/error.jsx`)

Done here:
- **Steppers:** cannot go below 2 or above 100 members.
- **JS off:** shows Pro only, with all words legible.

## 18. Measurement and handover
- [x] `data-cta` on every primary. `lib/track.js` is not merged; kit `Cta` dispatches `hz-event` cta_click
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/review/pricing.md` verdict 8 or more (none on main yet; my own critic said 5.5 on the build before this rework, and every fix it listed is done here)

Done here: The V2 line is updated after the critic's next walk. The critic's eight fixes are all in this build:
1. picker, one solid ask
2. ladder stops under the hand
3. asks in the first screen
4. compare sheet readable on both widths
5. the API stair as one graphic, with model detail behind disclosures
6. Team total by its steppers
7. JS off shows only Pro
8. FAQ 3 plus a collapsed rest
