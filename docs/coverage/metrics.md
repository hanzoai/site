# /metrics coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/cloud/Metrics.jsx` (+ `Metrics.css`) · route: `app/metrics/page.jsx` · gallery: `docs/gallery/metrics/` · metric id: `api_key_created`

Open copy questions for James: none (every live word kept; "View on GitHub" is the live hero label and the one ask).
Shared changes requested (`docs/requests/metrics.md`): (1) the sticky ask / thumb bar rules; (2) `lib/cta.js` / `lib/track.js` do not exist yet; (3) the header "Try Hanzo" outline rule belongs in the shared header; (4) deck tokens; (5) `PinnedChapters` should make hidden steps inert and unpin under 900px (done page-locally here).
Forks this page deleted: the shared `PinnedChapters` (replaced by a page-local scene that plays and stacks), the shared four-service `LaunchConsole` and Frame's `Paste` (replaced by the page's own chart console and prompt), Frame's `useFrame`/`useLive` imports, the per-frame `setAttribute('d')` path rewrites, Frame.css (no longer loaded by this page).

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js` (n/a for the file: it does not exist yet)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` (n/a: no prices)
- [x] Open copy questions for James listed, none decided

Done here: The Persona/Goal/CTA/Metric/Signature/Beyond lines head `Metrics.jsx` and `app/metrics/page.jsx`. `Metrics.css` outlines the header's "Try Hanzo" page-locally (`html:has(main.mt) header[data-slot=masthead] a[href='https://hanzo.ai/signup']`, as /o11y and /playground do), so "View on GitHub" is the one solid on the first screen at 1470×801 and 375×812 (`docs/gallery/metrics/d-first.png`, `p-first.png`). Further down, the site header's own "View on GitHub" thumb ask is the only solid; at the close it steps aside for the close's ask.

## 2. Information architecture and navigation
- [x] One `<main>`; skip link reaches it (the layout's skip link)
- [x] Every link through `A`; every card a real link
- [x] Breadcrumb at depth 2 or more (n/a: depth 1)
- [x] Link parity: 0 removed, 0 unexpected

Done here: Every link renders through kit `A`: the two asks, the console title, the console's eight product links, "Open in the console ↗", the Logs card and the repo link. `parity.py /metrics`: 59/59 text, 12/12 links.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero` (n/a for the component: not merged; the hero is the kit's `LineMask` h1 + lede + one ask + the live chart); nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in a close, `Band`, footer (`LaunchClose`: Sigil, "Get Metrics", the one ask, licence, repo)
- [x] Card-to-page links use Morph

Done here: The first screen is the 52px h1, the lede, the ask, the toolbar and the chart tile; the line draws in over 1.4 s and slides on. The first spike lands about 1.9 s in, after the line has drawn, and the flag and the dashed cursor ride it left while its traces are open (`d-first.png`). The blank runs are shorter: the hero's bottom padding is 32–48px (was up to 120), the related card's top 56–96px, and the close's bottom 56–96px. With JS off, the h1 and all six chapters render visible in reading order (checked with JavaScript disabled). The Logs card carries `data-morph`.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn` (the kit's `lx-cta`)
- [x] Sticky ask in header after the hero, same label (the site's `Ask.jsx` from `data-thumb`)
- [x] Copy button copies exactly the displayed text; failure never says Copied (the kit's `Copy`)
- [x] `data-cta` and `data-thumb` on every primary

Done here: The hero ask has `data-cta="metrics.hero" data-thumb="View on GitHub"` and the close ask has `metrics.close`. `data-ask-name="Hanzo Metrics"` is on the hero. The prompt's Copy copies `PROMPT`, the same string the `<pre>` shows.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy
- [x] Marquees pause (n/a: no marquee)
- [x] Privacy link beside every submit (n/a: no form)

Done here: The only figures are Hanzo's ("4 stars", "Apache-2.0"). Chart, table and console draw shapes without numbers. The console's names are labelled "Example project. Every name in it is one you would give your own."

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables and code use real structure (the table is product UI with `role=table`)
- [x] `python3 scripts/parity.py /metrics`: 0 missing

Done here: Parity is 59/59 text and 12/12 links. "Agent prompt" is now 12px Zen Mono capitals (`.mt-paste-k`, uppercase, .14em) at every width. On phone the prompt's api tag, the console's rows, status, caption, traces and footer are all 14px. The only text under 14px on phone is 12px mono capitals: the table heads, the traces caption, the chapter numbers and "Agent prompt".

## 7. Visual design system
- [x] `python3 scripts/taste.py` passes; deck values only
- [x] No label, tag, badge or pill above a headline
- [x] Radii and sizes consistent; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` reports OK. "01 / 06" now sits under each chapter title (`<h3>` then `<p class="lx-kick mt-ch-k">`), never above. The page no longer loads `Frame.css`, `PinnedChapters.css` or `LaunchConsole.css`: the chapter scene, the prompt and the console are styled in `Metrics.css` with deck values only (#0a0a0a, #0f0f0f, #171717, #262626, #525252, #737373, #a3a3a3, #d4d4d4, #e4e4e7, #f5f5f5, #fafafa). The black room's console is Metrics' own chart set dark, not the shared four-service console.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs (n/a: none)
- [x] Inputs 16px or larger (n/a: none); no bare `:hover`
- [x] Forks this page deleted: listed at the top

Done here: Every hover is inside `@media (hover: hover)`. "hanzoai/metrics 4 stars" gets a #f2f2f2 fill and a darker underline on hover and scales to .97 on press. The console title, product icons, "Open in the console ↗", service rows and the chart tile all answer on hover and press at .97 (the chart at .99). The selected split tab gets an outline on hover. In Playwright with hover enabled, every one of these changes on hover. A 60-stop Tab crawl at 1470 never lands on an invisible element.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit

Done here: Idle: the chart line slides by one CSS `translateX` loop, and a spike under the cursor comes about every 5.7 s (comments in both files now say "about every six seconds"). Time: each chapter plays its states once when it comes into view, one beat every 0.9 s, then rests: 01 lights metric, trace, log; 02 swaps PromQL ↔ builder; 03 ticks per-route then per-tenant until you tap; 04 grows the spike row, then its trace and log; 05 brings in "alert rule"; 06 scopes to org a and fades org b, then org c. In the black room, the prompt's query crosses the wire and lands on the line, rides it, and opens its traces. checkout-web builds once and chimes through `lib/sound` (`play('done')`). Pointer: the crosshair and the magnetic close ask. Scroll: only which desktop chapter is on and "Get Metrics" growing. Per-screen probe (`still.cjs`): 0 of 14 desktop screens still. On phone, every page screen moves; only the shared Related card and the footer are still. Reduced motion: 0 running animations after 3 s, with the spike set under the cursor and the console built.

## 10. Media
- [x] `Film` and `Pic` only (n/a: no Hanzo photo or film)
- [x] Pause on loops over 5 s
- [x] Budgets met (n/a: no images)
- [x] No dimmed photo (n/a: Hanzo has no Metrics media)

Done here: The chart's `LivePause` is first in its toolbar's markup (before the host, query, split and legend; its grid area still draws it top-right). The console's `LivePause` is first in the console bar and stops its line, the landed query and the spinner. The console's build runs once, then rests. The Sigil is drawn from `family.js` figures [4, 6].

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: Under 900px nothing pins. Each chapter renders its own table above its words with no sticky, and each table plays its chapter once when 55% of it is in view. In chapter 03, the model and route columns replace name and value on phone, so the tick lands on a column you can see. Every word stays. scrollWidth is 375 at 375 and 320 at 320. The console stacks under the prompt with 44px rows and one column of services.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms (n/a: none)
- [x] One h1; no heading skips
- [x] Keyboard reaches every control

Done here: Hidden desktop chapters are `inert`. Once faded they are also `visibility: hidden` and `scale: 0`, so chapter 03's label buttons leave the tab order and the hit area while another chapter is on. The Tab crawl found 0 focus stops on invisible elements. Pauses sit on the chart and the console. The chapter tables play once and rest. Text contrast: #a3a3a3 on #0a0a0a is about 7.8:1, #525252 on #f5f5f5 7.2:1, #737373 on white 4.74:1. Heading order: h1, h2 (intro), h3 ×6, h2 (black room), h2 (related), h2 (close).

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget (n/a for media: none)
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: Each series is drawn once, two windows wide, and slid by one CSS animation, so nothing rewrites a path. The rAF loop only reads the animation's progress, and it sets state only when the spike starts or ends. `useLive` watches the chart tile, not the hero block, so the loop stops once the chart leaves. Reduced motion is read after mount, so there is no hydration mismatch, and there are 0 console errors at 1470, 375 and 320. Filming ran in the cloud.

## 14. SEO and machine files
- [x] Title and description match live
- [x] Canonical (owned by the shared layout)
- [x] `<JsonLd route>` parses
- [x] Every card is a real link

Done here: `app/metrics/page.jsx` takes `metadata` from `content/pages.json` unedited and renders `<JsonLd route="/metrics" />`. The Logs card is a real `<a href="/cloud/logs">`.

## 15. Catalogue and product pages
- [x] Model card (n/a: not a catalogue page)
- [x] Every card opens by Morph (Logs has `data-morph`)
- [x] Maker pages linked (n/a)
- [x] One price figure (n/a: no prices)

Done here: This is a cloud product page in its own order: the live chart, the table that plays per chapter, the black room where the prompt's query lands on Metrics' own chart, one related card, the close.

## 16. Developer experience
- [x] Copy equals display
- [x] Config blocks parse (n/a: none)
- [x] Terminal pauses and ends on a static frame (the console builds once and has a pause)
- [x] No hand-typed version number

Done here: The agent prompt's Copy writes exactly the displayed string, and copying it also sends the query to the console again. No version numbers appear.

## 17. States and resilience
- [x] Loading, empty, error, offline (n/a: nothing is fetched)
- [x] Blocked live data leaves a complete page, no console errors
- [x] Failed submit (n/a: no form)
- [x] A thrown island does not blank the page (the shared boundaries)

Done here: Paused, held, reduced-motion and JS-off states each look intentional. Reduced motion shows the spike under the cursor with its traces open, the last state of each chapter, and the console built with the query landed. JS off shows every chapter in reading order beside the table.

## 18. Measurement and handover
- [x] `data-cta` on every primary (`lib/track.js` n/a: it does not exist yet)
- [x] Nothing identifier-bearing before consent
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [x] Review read: `docs/review/metrics.md` (6/10 at `648b7985`), Fixes 1–6 addressed

Done here: Fix 1: chapters play by themselves, desktop and phone. Fix 2: the black room is Metrics' chart set dark, and "Paste and ship" is 17px under the 26px head. Fix 3: one solid. Fix 4: numbers under titles, hidden steps inert, unpinned under 900px. Fix 5: pause first, the console builds once and has a pause, "Agent prompt" is mono capitals, the repo link and console title answer, and this card is corrected. Fix 6: translateX instead of path rewrites, and `useLive` on the chart tile. Gallery: `d-first.png`, `p-first.png`, `d.jpg`, `p.jpg`, `d-sheet-01/04/07.jpg`, `p-sheet-01.jpg`, `room-d.png` and `d.mp4`.
