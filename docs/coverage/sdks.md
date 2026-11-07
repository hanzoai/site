# /sdks coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Sdks.jsx` · gallery: `docs/gallery/sdks/` · metric id: `cta_click sdks.hero`

Open copy questions for James: the language tabs carry Hanzo's own emoji labels; kept.
Shared changes requested (`docs/requests/<page>.md`): none.
Forks this page deleted: the cyan accent, dialect/language pills that never showed, eyebrows over headings, the hero's text-link ask and the close's raw `.x-btn` (both kit `Cta` now).

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js`
- [x] Open copy questions for James listed, none decided

Done here: Header comment carries Persona, Goal, CTA, Metric, Signature, Beyond; one solid `Cta` "API reference" (`sdks.hero`, thumb); h1=1 at all widths; no prices.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- ~~Breadcrumb at depth 2 or more~~ n/a: depth 1 page
- [x] Link parity: 0 removed, 0 unexpected

Done here: One `<main>`; links through `A`, `More`, `Cta`; parity links 69/69.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- ~~`PageHero`; nothing above the h1~~ n/a: page-owned hero on the kit grammar (A2Lines h1 cut-in); nothing visible above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in the close ask and footer (n/a for a proof strip and `Band`: the page has no figures beyond install lines)
- ~~Card-to-page links use Morph; title lands within 12px~~ n/a: no cards that open a page

Done here: The console flips OpenAI ⇄ Anthropic by itself within ~1 s and re-sets only the changed lines; on phones the console now follows the h1, lede and ask directly, so it moves inside the first 812px (the two dialect notes follow it). No proof strip: the page has no figures to show beyond install lines; it ends with the close ask and footer.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text; failure never says Copied
- [x] `data-cta` and `data-thumb` on every primary

Done here: Kit `Cta` in hero and close; every install line and sample uses kit `Copy` of the displayed text; `data-cta` on sdks.hero (with `data-thumb`) and sdks.close.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- ~~Marquees pause, freeze under reduced motion, hide duplicates~~ n/a: no marquee
- ~~Privacy link and owner line beside every submit~~ n/a: no form

Done here: Only Hanzo's install lines, registries and module paths.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts
- [x] `python3 scripts/parity.py /<path>`: 0 missing

Done here: `python3 scripts/parity.py /sdks`: text 217/217, links 69/69. Copy pass (8 Nov): offline copycheck missing 92 → 0. Every sample, both dialects and all three languages, is in the page as whole lines of text (with its URL and caption) behind the console, which shows one at a time; the dialect titles, the hero and peel sentences are split only at Hanzo's own code boundaries; install lines, the agent prompt (a page-local copy of the Paste strip) and the org cells are whole lines; each Go module is its whole path "hanzo.ai/…" as Hanzo prints it (the prefix greyed by a text-clipped fill, 9ch in mono). The finder's idle typing is an aria-hidden overlay; the wall's text never changes.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` passes; one dark room (per-language orgs); hero medium is code, unlike /operator's board and /pubsub's bus.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- ~~Dialogs are native, trap focus and return it~~ n/a: no dialogs
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: listed below

Done here: Dialect and language switches are buttons with pressed states; the module finder input is 16px with a label and an empty state.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit

Done here: Signature `peel` on the second screen, right under the hero: Hanzo's stack (01 OpenAPI, 02 Full Cloud SDK, 03 AI + Agents, 04 your application) sits as four CSS-3D plates that lift apart (900 ms ease-in-out) when the section reaches the screen and close again when it leaves; once open it walks the layers bottom-up, each rising 22px out of the stack and inking while its words (the old two-halves copy, re-homed) show beside it. The visitor drags or swipes sideways across the stack to peel/close it by hand (snaps to the nearest end), picks a layer (list buttons, hover with a mouse, tap a plate) or uses "Close the stack / Lift the layers". The approved hero console (OpenAI ⇄ Anthropic, only the changed lines re-set) is kept; section h2s are now plain (the line mask stays only on the h1, a page-local copy that reads reduced motion after hydration). Reduced motion: stack open, no transitions. The long middle now moves too (slice D, 7 Nov): the per-language org rows draw in one by one (90 ms apart) as the dark room reaches the screen, and the Go finder's idle typing answers in the wall: each module name it types stays ink while the rest step back to grey, until you type. Section entrances from MOTION-MAP (slice D, page-local in Sdks.jsx/.css under html.js and no-preference): scroll-tilt (the picker arrives leaning back and levels, then leans with the scroll's speed through a spring), fold-out (the org rows unfold from their top edge one by one; this replaces the earlier draw-in), inertia-drag (the flagship cards thrown in from the right, coasting to rest), pendulum (the Go finder swings in from a pivot above it), invert-flash (the close flickers inverted once). Probe: all five end with data-in and nothing under 0.5 opacity at 1470 and 375; JS off and reduced motion show the final state. Probe: 0 console errors at 1470×801 and 375×812 (also reduced), CLS ≤ 0.0004, hscroll 0; `variety.py` OK.

## 10. Media
- ~~`Film` and `Pic` only; sizes and posters set~~ n/a: no media: the console shows Hanzo samples
- ~~At most 2 videos playing; pause button on loops over 5 s~~ n/a: no video
- [x] Budgets met; nothing missing; alt on every image
- ~~No dimmed or filtered photo; 4+ real visuals together where the page has them~~ n/a: no photos

Done here: No images or films on the page.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: Probe: hscroll 0 at 1470, 375, 320; CLS 0; the hero ask sits at y≈400 at 375×812. The hero console fills its column on phones (it no longer sizes to its longest code line and gets clipped): measured inside the viewport at 375 (console 16–359, cURL 266–343, Copy 271–345) and at 320 (the language row wraps; cURL 32–109, Copy 216–290); the code scrolls inside its own pane. Module links are 44px tall on phones. The official-SDK picker walks the six languages once by itself on arrival and stops at the first touch. The flagship library is no longer three in a row: the Python lead spans two rows with Node and Rust stacked beside it (desktop), its line set large at the foot over its install; on phone the three stack. Probe (slice D, 7 Nov): no in-page target under 44px at 375.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: The finder input is labelled; tabs carry aria states; one h1 with an h2 per section. Text on ink fills ("AI + Agents", the lead library's "Python", the picker's chosen language) is #fafafa on #0a0a0b, about 19:1 (measured); the visually hidden sample code is `inert`, so a Tab crawl has 0 invisible stops in it.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: All samples in server HTML; transform/opacity only; typing writes text nodes.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: `app/sdks/page.jsx`: metadata from `content/pages.json`, `<JsonLd route="/sdks" />`.

## 15. Catalogue and product pages
- ~~Model card matches `SPEC.md` (or n/a: not a catalogue or model page)~~ n/a: not a catalogue or model page
- ~~Every card opens by Morph~~ n/a: no cards
- ~~Every maker and model page linked in the DOM~~ n/a: not a catalogue
- ~~One price figure everywhere~~ n/a: no prices

Done here: n/a: developer page; the Go module wall links every import path.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (or n/a: no code on the page)
- [x] Config blocks parse on their own
- [x] Terminal pauses and ends on a static frame
- [x] No hand-typed version number

Done here: Code is a labelled region with Copy of exactly the displayed text; no `//` comments in copied JSON; versions only as Hanzo's registries print them.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed
- [x] Blocked live data leaves a complete page, no console errors
- ~~A failed submit keeps its values and shows no success~~ n/a: no form
- [x] A thrown island does not blank the page

Done here: Loading has nothing to fetch (all copy and samples are in the server HTML); no live API call, so blocked networks leave the full page with 0 console errors (probe at 1470, 375, 320). Islands sit inside the shared error boundary. The finder's empty state reads "No module at that path."

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js`
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [x] Review read: `docs/review/<page>.md` verdict 8 or more

Done here: `data-cta` on sdks.hero and sdks.close via kit `Cta` (cta_click event); `V2:` line present (the builder's own); the verdict that counts is `docs/review/sdks.md` (6/10 on the walk before this build; marked Ready in slice D on 7 Nov after the phone console, flagship grid, org draw-in and finder fixes).
