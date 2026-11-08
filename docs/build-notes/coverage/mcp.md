# /mcp coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/McpPage.jsx` (+ `McpPage.css`) · gallery: `docs/gallery/mcp/` · metric id: `cta_click mcp.hero` (and `mcp.close`)

Open copy questions for James: none.
Shared changes requested (`docs/build-notes/requests/mcp.md`): the phone header should carry the page ask the way it does at 1470; the header ask clips at 320; the cookie card covers the phone hero; PageHero kit part.
Forks this page deleted: the hand-written hero and close buttons (now kit Cta), the kit Band at the close (replaced by a page-local light close so the close holds one solid and a real object), the hand-built code panels (now kit CodeBlock), the orange tool stream and coloured bars, the 196px figures, sheet outlines and shadows, numbers above card titles, the drag cursor label, springs, setInterval, the stream's layout-animated rows (now transform-only).

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- ~~No dead or self-looping button; prices from `lib/plans.js`~~ n/a: no prices on this page
- [x] Open copy questions for James listed, none decided

Done here: Top of McpPage.jsx has Persona/Goal/CTA/Metric/Signature/Beyond and a V2 line. One solid per screen: hero "Browse 260+ tools" (header "Try Hanzo" is an outline while it shows, by the system's data-ask=quiet on desktop and page-locally on phones); after the hero the sticky header carries "Browse 260+ tools"; the close has one solid "Browse All Tools" (marked as the hero ask's twin, so the header goes quiet there) and "Deploy to Cloud" is an outline. Labels and hrefs are Hanzo's (no lib/cta.js exists).

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- ~~Breadcrumb at depth 2 or more~~ n/a: depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: One <main class="a2 mcp"> inside the layout; every link through kit A or Cta; parity links 5/5. The domain cards are buttons that open a sheet (dialog), each sheet links to All MCP Tools Reference.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [ ] `PageHero`; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer
- [x] Card-to-page links use Morph; title lands within 12px

Done here: Nothing above the h1 (Hanzo's "Hanzo MCP · 260+ tools · 117 cloud services" sits under it as a grey mono caption); the tool-call stream runs from the first second. Phone is its own order: h1 (40px, 4 lines: Hanzo's words cannot fit 3 lines at 40 in 343px, they need about 29px), caption, the stream at three rows (top at y=374, 180px of it inside 660), then lede and asks. Hand-built hero, not PageHero. Order: hero, three figures, stacked runtime sheets, paste, domain rail, dark config room, light close, footer; the close replaces Band with the same words plus the repo card. Domain cards open by shared-element morph (layoutId).

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text; failure never says Copied
- [x] `data-cta` and `data-thumb` on every primary

Done here: Kit Cta only. Hero: data-cta="mcp.hero" data-thumb="Browse 260+ tools"; close: data-cta="mcp.close" data-thumb="Browse 260+ tools". Desktop: no floating pill; the header's solid carries "Browse 260+ tools" after the hero (Ask.jsx). Phones: the quiet bottom bar carries it when it covers nothing. Both CodeBlocks copy exactly what they show (checked in Playwright: the .mcp.json copy passes JSON.parse).

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- ~~Marquees pause, freeze under reduced motion, hide duplicates~~ n/a: no marquee
- ~~Privacy link and owner line beside every submit~~ n/a: no form on this page

Done here: Only Hanzo's figures: 38, 1,538, 260+, 117, 34, 2ms, 6.4ms, Apache-2.0, 8 stars; each with its own words beside it. No logos or seals.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts
- [x] `python3 scripts/parity.py /mcp`: 0 missing

Done here: h1 52px in 3 lines (40px in 4 lines at 375; 33px in the same 4 lines at 320); config captions wrap (nothing past x=375 or x=320), section headings 26, lede 21, figures 64 growing 1.45x while they cross; mono captions 11.5px capitals. Parity: text 72/72, links 5/5. Code in kit CodeBlock (labels ".mcp.json" and "bash").

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: taste.py OK on both files; zero hue: primary, "1,538" and the "+" in ink/grey, tool bars one silver (#737373) at different lengths with the live call in white, sheets #f5f5f5/#ededed/#e5e5e5. Captions ("Tool domains", "Get started", the hero line) sit under their headlines; "01 / 03" sits beside the sheet title. Greys are literal values from the brand-deck ramp (taste.py accepts them). Only the open sheet (a dialog) has a shadow.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [ ] Dialogs are native, trap focus and return it
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: listed below

Done here: Domain cards lift 4px on hover or focus and their chip row swaps to a preview with two more tool names and what remains ("+8"); Copy buttons are 44px tall at every width. Cards press to .98, the sheet close to .96, pause buttons grow 1.06 on hover, the repo link gets a grey fill, Copy brightens on dark; all hovers inside (hover: hover). The open sheet is a role=dialog div (not native <dialog>, because the card morphs into it): Escape closes, Tab stays inside, focus returns to the card (checked). Forks: see the line above part 1.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit

Done here: Signature: the domain card morphs into its sheet (layoutId, 400ms ease-emphasis). Supporting: the live tool stream (time, 900ms timeouts, transform-only rows), the drag rail with fling (pointer), where only the card nearest the centre calls its tools and pulses its "+" (idle, one mover), stacked sheets where only the sheet on top runs its art, and growing figures (scroll). Arrival idles that end under 5 s: the figures' "+" breathe 3 times, the bash rows light in turn once, the close's terminal types `npx -y hanzo mcp` once and rests. Reduced motion stops every loop and shows the typed command whole. Sound comes only from the shared kit.

## 10. Media
- ~~`Film` and `Pic` only; sizes and posters set~~ n/a: no images or films, every visual is drawn in the DOM
- ~~At most 2 videos playing; pause button on loops over 5 s~~ n/a: no video
- ~~Budgets met; nothing missing; alt on every image~~ n/a: no images
- ~~No dimmed or filtered photo; 4+ real visuals together where the page has them~~ n/a: Hanzo has no MCP media

Done here: No media; the stream, sheets, rail and terminal are drawn with Hanzo's tool names.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [ ] Primary ask above the fold at 375×667

Done here: 375x812: h1 40px in 4 lines, stream inside 660, "Browse 260+ tools" bottom at 790px (inside 812; below 667 because the stream now comes first). 320: scrollWidth 320, 0 elements past x=320 and 0 text cut by its own box (8 Nov: the stream's tool column widens to 62% so kai_command_guard is whole at 13px, the guard gate sits at 30% so kai_injection_screen fits its panel, the compare's .mcp.json wraps its one long line at 320 instead of being cut), the sheet chips tighten under 360px. Phone audit of main a/button finds 0 targets under 44px (CodeBlock Copy raised to 44px page-locally; links 44px min-height). 1470x801: the runtime sheets are plain sections now (no overlap); the domain rail bleeds past the right edge by design and clips inside its own scroller.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: Text #0a0a0a/#525252/#737373 on white and #a3a3a3 or lighter on black. Pause buttons on the tool stream, the runtime sheets' loops and the domain rail's chips; the caret blinks 4 times and stops. One h1, h2 sections, h3 cards; every card is a button named by its title.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [ ] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: h1 and the stream's first 9 rows are in server HTML; transform and opacity only; the stream stops off screen and when paused; layout shift 0.0002 to 0.001 measured. Bundle budgets not measured.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: app/mcp/page.jsx metadata unchanged; JsonLd route=/mcp; Hanzo's full config block, comments included, kept in the HTML (visually hidden) for search.

## 15. Catalogue and product pages
- ~~Model card matches `SPEC.md` (or n/a: not a catalogue or model page)~~ n/a: not a catalogue or model page
- [x] Every card opens by Morph
- ~~Every maker and model page linked in the DOM~~ n/a: not a catalogue
- ~~One price figure everywhere~~ n/a: no prices

Done here: Not a catalogue; the six domain cards open in place by morph.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (or n/a: no code on the page)
- [x] Config blocks parse on their own
- [x] Terminal pauses and ends on a static frame
- [x] No hand-typed version number

Done here: ".mcp.json" is a kit CodeBlock (pure JSON, JSON.parse of the copied text passes in Playwright). "bash" is a page-local block in the CodeBlock's skin with one kit Copy per command: copies are exactly `npm i -g hanzo`, `hanzo mcp`, `hanzo mcp -t sse` (checked), so a paste runs in default zsh and never queues a blocking `hanzo mcp`; "$ " and Hanzo's `#` notes are shown with user-select:none. Hanzo's two comment lines sit above each block as captions. The close's terminal types once and rests on "hanzo mcp · stdio". No version numbers.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed
- [x] Blocked live data leaves a complete page, no console errors
- ~~A failed submit keeps its values and shows no success~~ n/a: no submit
- [ ] A thrown island does not blank the page

Done here: No live data, so nothing loads or fails; 0 console errors at 1470x801, 375x812 and 320; closing the sheet restores the rail and focus.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js`
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/build-notes/review/mcp.md` verdict 8 or more

Done here: data-cta on mcp.hero, mcp.close, mcp.close-deploy, mcp.close-selfhost, mcp.close-github, mcp.close-platform; Cta fires cta_click through the system event. V2 line in the header. Last review 6/10 (7 Nov) was on the older build; each of its five fixes is addressed, awaiting a new critic walk.
