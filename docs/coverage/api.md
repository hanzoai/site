# /api coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/ApiPage.jsx` (+ `ApiPage.css`, shared `components/v2/AppType.css`, `AppScenes`, `x-edison/AppLines`) · gallery: `docs/gallery/api/` · metric id: `api_key_created`

Open copy questions for James: none decided. The "cURL text" question in MASTER part 1 applies: the page shows no Hanzo cURL sample, so the request line is built from Hanzo's own base URL, paths and bearer header only.
Shared changes requested: `docs/requests/apps1.md` (a `Band` with an `id` prop), `docs/requests/api.md` (the phone header label). The ask uses the shared opt-in (SYSTEM §5): the hero's `<Cta thumb>` makes the desktop header read "Get an API key, free" once the hero ask scrolls away (measured at the black room, 1470×801). Phones keep the shared "Try Hanzo" by system rule, and the slim quiet bar carries this page's ask. The page closes on its own band with `<Cta id>`, with Next folded under it as two text rows.
Forks this page deleted: the native endpoint `<select>` (now a styled list), raw `<img>`/`<video>` (now kit `Img`/`Film`), the hidden `data-thumb` `<i>` (now `<Cta thumb>`), raw `.x-btn` `Go` asks (now `<Cta>`), the Stage hero wrapper, four kickers over headlines, spring transitions.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js` (n/a for the lib: `lib/cta.js` does not exist yet, so the label is Hanzo's own "Get an API key, free" → platform.hanzo.ai/api-keys)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` (n/a: no prices on /api)
- [x] Open copy questions for James listed, none decided

Done here: Top comment of `ApiPage.jsx` names Persona (developer coming from the OpenAI API), Goal, CTA, `Metric: api_key_created`, Signature and Beyond. check.mjs shows 1 solid on the first screen at 1470×801 and at 375×812, and one `<h1>` in the server HTML.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it (the shell's `#main` mark sits before the page's `<main>`)
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- ~~Breadcrumb at depth 2 or more~~ n/a: /api is depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: parity reports links 18/18. Every link is `A` or `Cta` (which renders `A`); the two Next rows under the Band are whole-row `<a>`s (`data-cta` api-next-api, api-next-getting).

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero` (n/a for the part: not merged yet; the kit equivalent is the line-mask h1 + one lede + one ask + one object); nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip (n/a: /api has no proof figures), `Band` (the page's closing ask row in its own words), footer
- ~~Card-to-page links use Morph~~ n/a: /api's cards go to docs.hanzo.ai (external); the console carries `data-morph-target` for cards that open into /api

Done here: At 1470×801 the h1, lede, ask and the live console share the first screen. The path types and the answer streams within 1 s (check.mjs: changes 158, film playing). JS off: 0 invisible text blocks. The rhythm is: hero → slim paste strip → 4 pinned chapters → black room → reference list → the Band (statement, ask, then Next as two text rows). The h1 rises by CSS from first paint (landed by about 300 ms) and the console holds its server-painted request until 1 s, so the words lead even on a slow machine.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero (shared system: with `<Cta thumb>` the desktop header reads "Get an API key, free" once the hero ask leaves; phones keep "Try Hanzo" in the header and the slim quiet bar carries this page's ask)
- [x] Copy button copies exactly the displayed text; failure never says Copied (kit `Copy`)
- [x] `data-cta` and `data-thumb` on every primary

Done here: The primary appears twice: `data-cta="api-hero-key"` (thumb) and `data-cta="api-close-key"` in the Band; the desktop header shows "Get an API key, free" mid-page (Playwright, 7 Nov). On phones, while the hero or Band ask is on screen, `useOneSolidOnPhone` sets `html[data-ask=quiet]` (the /bounty move), so the header's "Try Hanzo" is an outline and one solid shows (measured: transparent at hero and Band, solid in between). The two Next doors are no longer boxes before the Band: they are text rows under its ask. The "same host, same key" box shows exactly the curl it copies (`curl -X POST https://api.hanzo.ai/v1/… \` + `-H "Authorization: Bearer <your key>"`).

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number (the only figures are "Sub-10ms" and "429", both in Hanzo's sentences)
- ~~Marquees pause, freeze under reduced motion, hide duplicates~~ n/a: no marquee
- ~~Privacy link and owner line beside every submit~~ n/a: no form

Done here: No counters and no invented status. The "200" status and the green live dot were removed in round 2. Parity text 80/80.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading (`text-wrap: balance` on av-display/av-head)
- [x] Tables, FAQ, tabs and code use the kit parts (the endpoint list is an accordion of buttons with `aria-expanded`; the request line is its own `<pre>`, kept for the Beyond's path wipe)
- [x] `python3 scripts/parity.py /api`: 0 missing

Done here: Body 16px, lede 21px, mono labels 12–13px. Core endpoints show six rows, the other nine one tap away ("Show all +9"), kept in the HTML as `hidden="until-found"` (Find in page opens them; JS off shows all 15 and no button); rows disclose one at a time. The Core section's bottom padding and the Band's top padding were cut, so the close follows the list. Parity: text 80/80, links 18/18.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens (deck greys only; some literals remain from the deck ramp)
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow (objects are outlined 1px black 10%, no shadow)
- [x] One icon set; no icon in a rounded box (stroke arrows and play/pause only)
- [x] Differs from neighbours in hero medium and room order

Done here: taste.py OK. The scale has rhythm: h1 52px, section heads 26px, chapter titles grow 26→32px while active, and the one big figure is the base URL at 64px in the black room. /cli's hero is a full-bleed terminal, /bot's an org chart, /desktop's an app window. /api's is a request console beside the headline.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled (n/a: none disabled), loading (the `Cta` hand-off sets `aria-busy`)
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs are native, trap focus and return it (n/a: no dialog on /api)
- [x] Inputs 16px or larger; no bare `:hover` (the filter input is 15px mono on desktop and 16px on phone; hovers sit in `@media (hover: hover)`)
- [x] Forks this page deleted: listed above

Done here: Chips, filter segments, endpoint rows, the endpoint list and the pause button each have hover (fine pointers), press (scale .97/.98), focus-visible and selected states. Tab pills move with a 300 ms ease-emphasis tween (no springs). Chip hover (mouse) previews the model that serves that endpoint in the console's frame (e.g. /v1/decisions → kai) and returns on leave; chips press at .98.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit (`play('done')` when the console's walk ends; `data-sound="tick"` on chips, filter tabs, the endpoint list, rows and the pause; Copy chimes through the kit)

Done here: The signature is the live console (time: path typing, answer streaming; idle: model film). Supporting: pinned chapters with clip wipes (scroll), the line-mask h1 (arrival), and the tab pill (state); the magnetic ask is pointer. variety.py OK, 0 Rise. The console walks all eight endpoints once, then rests. Server and client render identical markup under reduced motion: the dark room always carries its clip style (CSS drops it under `prefers-reduced-motion`), and "How it fits together" uses a page-local CSS line mask instead of AppLines. 0 console errors with `reducedMotion: 'reduce'` and without, at 1470×801 and 375×812. The pinned chapters sit just under the header on desktop, so the stage arrives with its heading (gap ≈ 64px, was ≈ 200px).

## 10. Media
- [x] `Film` and `Pic` only (kit `Img` + `Film`); sizes and posters set (1200×1500, poster = the model still)
- [x] At most 2 videos playing; pause button on loops over 5 s (the console's pause swaps the film for its still)
- [x] Budgets met; nothing missing; alt on every image (decorative model art has `alt=""`)
- [x] No dimmed or filtered photo; 4+ real visuals together (n/a: one model film at a time is the console's design)

Done here: The model films are Hanzo's own `/models/*.webm` over `.webp` posters, which are the only colour on the page. Film plays only on screen and never under reduced motion or Save-Data. With JS off the hero film is hidden by `<NoJs>` (poster only, no native control bar; measured `display: none`).

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: check.mjs at 375×812 shows h1, ask and the console typing on the first screen, CLS 0.000, no small targets, no sideways scroll. The black room's base URL is sized to the gutters on phones (`min(7.4vw, (100vw - 40px) / 14)`): at 375 it ends at x=324, `/v1` in full, with a `<wbr>` before `/v1` as the fallback. The "console" link stays inline in its sentence (44px hit area by padding, not inline-flex). The console's answer box is sized by the longest answer, so streaming never moves the page.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better (#0a0a0a / #525252 / #737373 on white; white 55% or more on black)
- [x] Pause control on every moving item (the console has a 44px pause, first in its bar's DOM; chapter loops end after one pass, under 7.2 s)
- ~~Forms labelled; first error focused~~ n/a: only a filter input, labelled with `aria-label`
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: The pause button has `aria-pressed` and Play/Pause names. Chapters jump by the rail buttons, and focusing a hidden chapter's link scrolls it in. The endpoint list is `role="listbox"` with `aria-selected` options.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized (not measured here: needs a production build, conductor's job)
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop (filmed in the cloud)

Done here: The h1 and console text are server-rendered (curl shows the h1). Typing writes text nodes through refs, not React state per character. Films are `preload="none"` until near the screen.

## 14. SEO and machine files
- [x] Title and description match live (metadata unchanged from `content/pages.json`)
- [x] Canonical equals og:url equals the live URL (`https://hanzo.ai/api/`)
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: `app/api/page.jsx` keeps its metadata and `<JsonLd route="/api" />`. curl shows canonical and og:url both `https://hanzo.ai/api/`.

## 15. Catalogue and product pages
- ~~Model card matches `SPEC.md`~~ n/a: not a catalogue or model page
- ~~Every card opens by Morph~~ n/a
- ~~Every maker and model page linked in the DOM~~ n/a
- ~~One price figure everywhere~~ n/a: no prices

Done here: n/a. /api is a developer page (MASTER 4.6) with no model cards or prices.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (a page-local `<pre>` kept for the Beyond's path wipe; it copies exactly what it shows)
- ~~Config blocks parse on their own~~ n/a: no config block
- [x] Terminal pauses and ends on a static frame (the console pauses, walks once and rests on 01 / 08)
- [x] No hand-typed version number

Done here: The agent prompt copies its exact displayed line. The request line copies the exact two lines it shows, and the paste runs in zsh (backslash continuation). No curl / Python / JS tabs: the page carries no Python or JS sample in Hanzo's copy, and copy is frozen, so curl is the one language shown.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed (empty: the endpoint filter's "No endpoint matches. Show all"; loading: the console's text is in the server HTML; offline n/a: no live data)
- [x] Blocked live data leaves a complete page, no console errors (no live calls; films fall back to their posters)
- ~~A failed submit keeps its values and shows no success~~ n/a: no form
- [x] A thrown island does not blank the page (shared `app/error.jsx`)

Done here: With hanzo.ai and the API blocked in the cloud sandbox, the page renders complete with 0 console errors (check.mjs and film.mjs).

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js` (`<Cta>` dispatches `cta_click`; `lib/track.js` is not merged)
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [x] Review read: `docs/review/api.md` verdict 8 or more (read; the 7 Nov verdict was 6/10, and every fix in its list is done in round 2 and awaits a re-walk)

Done here: `data-cta` = api-hero-key, api-hero-ref, api-close-key, api-close-ref. Review round 2 (7/10) fixes: reduced-motion hydration mismatch, phone one-solid, Core endpoints six-then-Show-all, blank under "How it fits together", chip hover preview, JS-off film controls. Review 7 Nov (7/10) fixes: header ask via `thumb`, base URL fits 375, Next folded into the Band, h1 paints before the console types. Earlier fixes: (1) console in the first screen, (2) no phone jump (CLS 0.000), (3) no hue, no green dot, no kickers, (4) one ask repeated at the close, (5) real lines in the chapters and a styled list instead of the native select.
