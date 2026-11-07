# /bot coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Bot.jsx` (+ `Bot.css`, `Bot.data.js`, shared `components/v2/AppType.css`, `AppScenes`, `AppSheet`) · gallery: `docs/gallery/bot/` · metric id: `signup_start`

Open copy questions for James: none decided. Two of Hanzo's own figures disagree and both are kept word for word: the pricing-model drawer says "Why a $100/mo entry floor?" while the FAQ says "Why is there a $15/mo floor for cloud resident bots?" (and plans start at $15). Which is right?
Shared changes requested (`docs/requests/apps1.md`): only the `Band` `id` prop is still open (this page closes on its own Band markup with `<Cta id>` until then). The header ask and the phone ask bar landed in the shared system, so `data-ask="off"` is gone from `<main>`.
Forks this page deleted: the centred kicker-over-display hero, three equal hero asks, the Stage wrapper, the ten-row workflow index (now one drawer), the FAQ section (now one drawer), the separate "Need more than one resident bot?" and "Three steps" sections (folded into pricing and install), the solid "Deploy to Cloud" after the close, the floating verifier chip over the chart, raw `<img>` (now kit `Img`), every kicker over a headline (11), spring transitions, the drawn `Tick` in the drawer, the tangerine and green hues.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js` (n/a for the lib: `lib/cta.js` does not exist yet, so the label is Hanzo's own "Try Hanzo" → hanzo.bot)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` (n/a for the lib: not merged; the four plan prices are Hanzo's own strings, each shown once)
- [x] Open copy questions for James listed, none decided

Done here: Top comment of `Bot.jsx` names Persona (a founder or team lead with more routine work than people), Goal, CTA, `Metric: signup_start`, Signature and Beyond. check.mjs: one solid on the first screen at 1470×801 and at 375×812; one `<h1>` in the server HTML.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it (the shell's `#main` mark sits before the page's `<main>`)
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link (the one exception is the in-page `#install` anchor)
- ~~Breadcrumb at depth 2 or more~~ n/a: /bot is depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: parity reports links 21/21. The four plan buttons, docs links, GitHub, /team, /bot, hanzo.team, /pricing, /login, /cloud/chat, /search, /crawl and the deploy link are all still on the page.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero` (n/a for the part: not merged yet; the kit equivalent is the line-mask h1 + one lede + one ask + one object); nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer (the proof is the repo meta "MIT · hanzoai/bot · 5 stars" just before the Band)
- ~~Card-to-page links use Morph~~ n/a: the page's cards leave for docs and the app; the hero object carries `data-morph-target` for cards that open into /bot

Done here: At 1470×801 the h1 (52px), lede, "Try Hanzo" and the live org chart share the first screen, and the packet runs from Zoe's message to @Dev within 1 s (check.mjs: changes 161, 8 animations). The walk is about 12 screens (12,037px tall at 801): hero → workflows line + four points → 5 pinned chapters → tools and channels → install → pricing and more bots → questions and repo → Band.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn` (exceptions: the four "Get <plan>" quiet buttons and the drawer's "Open Hanzo Bot / Team" pair keep Hanzo's own links as `A.x-btn`, outlined or inside a closed drawer)
- [x] Sticky ask in header and bar after the hero, same label (the shared header always carries a solid "Try Hanzo"; on phones the slim quiet bar carries this page's own `data-thumb` ask; no floating bar on desktop)
- [x] Copy button copies exactly the displayed text; failure never says Copied (kit `Copy`; the `$ ` prompts are `user-select: none` and not in the copied text)
- [x] `data-cta` and `data-thumb` on every primary

Done here: The primary appears twice: `data-cta="bot-hero-try"` (thumb) and `data-cta="bot-band-try"` in the Band. "Install on your Mac" and "Contact sales" are text links with chevrons (`bot-hero-install`, `bot-hero-sales`).

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number (the 200 connector marks carry Hanzo's own line "Each mark belongs to its owner…")
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- ~~Marquees pause, freeze under reduced motion, hide duplicates~~ n/a: the channel belt is now a still sentence
- ~~Privacy link and owner line beside every submit~~ n/a: no form

Done here: Figures are Hanzo's strings only ("200 tools", "$15", "$45", "$95", "$195", "1/5th", "5 stars"); the slider shows the count you choose and the plan's own price, never a counted or invented value.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading (`text-wrap: balance`)
- [x] Tables, FAQ, tabs and code use the kit parts (kit `Faq` inside a drawer; the tools are real tabs with `role="tablist"`; the terminal is its own `<pre>`)
- [x] `python3 scripts/parity.py /bot`: 0 missing

Done here: Body 14–16px, lede 20px, mono labels 12px capitals. The ten workflows and the ten answers open in one drawer each and stay in the HTML. Parity: text 306/306, links 21/21.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens (deck greys only)
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow (objects are outlined 1px, no drop shadows)
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: taste.py OK; check.mjs finds 0 labels over headlines (Hanzo's former kickers now sit as 12px captions under their sections). The hero is a 4/8 headline-left, org-chart-right composition with one black room (the Band); /api is a console under an 8/4 head, /computer a black desktop, /design a workspace window.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading (Cta from the kit; page controls press at scale .97, hovers inside `@media (hover: hover)`)
- [x] Focus ring visible on every stop of a Tab crawl (2px ink outlines on tabs, chips, switches, pause, slider)
- [x] Dialogs are native, trap focus and return it (v2 `AppSheet`: Esc, backdrop and close; focus moves in and returns)
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: listed above

Done here: Tabs, category chips, routine switches, "Yes, add it / Not yet", the plan slider and the pause button all have hover, press and focus states; nothing fades on hover.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups (variety.py: magnetic, layoutId, useScroll, clip reveal; 0 Rise)
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit (`lib/sound.js`; tabs, switches and pressed buttons tick through `components/Sound.jsx`)

Done here: Idle (the org chart routes a packet through ten workflows; the sample thread plays), pointer (magnetic ask), state (tab pill glides at 300ms ease-emphasis, drawers rise), time (the reply arrives after the bot's dots), arrival (h1 line cut-in), scroll (pinned chapters; the Band opens from a rounded card). No springs. Sound: `play('done')` when a run the visitor picked is verified and when the sample thread finishes; `data-sound="tick"` on "Yes, add it", "Not yet" and the plan slider.

## 10. Media
- [x] `Film` and `Pic` only; sizes and posters set (kit `Img` with width and height inside the page's `Pic` fallback)
- ~~At most 2 videos playing; pause button on loops over 5 s~~ n/a: no video
- [x] Budgets met; nothing missing; alt on every image (connector logos carry the tool's name; memoji are decorative)
- [x] No dimmed or filtered photo; 4+ real visuals together where the page has them (13 memoji in the chart, 10 logos per tool tab)

Done here: Hanzo's memoji draw over a drawn face, so a blocked image never leaves a hole; the connector logos sit beside their names.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: check.mjs at 375×812: h1, one solid ask and the moving chart on the first screen, CLS 0.000, 0 small tap targets; the chart becomes a 13-face strip with stacked replies, and pinned chapters stack.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better (#0a0a0a / #525252 on white and #f5f5f5; #737373 only on white)
- [x] Pause control on every moving item (the org chart's pause is the first control in it, 44px, `aria-pressed`; the chapters run only while shown)
- ~~Forms labelled; first error focused~~ n/a: no form (the slider has a `<label for>`)
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control (arrow keys move the channel tabs)

Done here: One h1; h2 per section, h3 inside chapters and drawers. Reduced motion freezes the chart on the finished handoff.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: The chart measures once per workflow with a ResizeObserver and stops its timers off screen (`useInView`); filming ran in the cloud session.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL (`<JsonLd route="/bot" />`)
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: `app/bot/page.jsx` keeps Hanzo's title and description and renders `<JsonLd route="/bot" />`.

## 15. Catalogue and product pages
- ~~Model card matches `SPEC.md`~~ n/a: not a catalogue or model page
- ~~Every card opens by Morph~~ n/a: no catalogue cards
- ~~Every maker and model page linked in the DOM~~ n/a
- [x] One price figure everywhere (each plan's price appears once, in its row and in the slider's answer from the same list)

Done here: The plan list (`PLANS` in `Bot.jsx`) feeds both the slider's answer and the rows, so the price can never disagree.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (the install `<pre>` and the agent prompt copy exactly what they show)
- ~~Config blocks parse on their own~~ n/a: no config block
- [x] Terminal pauses and ends on a static frame (the install terminal is static; the sandbox terminal runs only while its chapter is shown)
- [x] No hand-typed version number

Done here: Copy gives `npm install -g @hanzo/bot` and `hanzo-bot onboard --install-daemon`, the two lines shown.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed (n/a in part: no live data; the reply slot shows the bot's typing dots until its reply)
- [x] Blocked live data leaves a complete page, no console errors (blocked memoji and logos fall back to the drawn face and the name)
- ~~A failed submit keeps its values and shows no success~~ n/a: no form
- [x] A thrown island does not blank the page

Done here: With hanzo.ai assets blocked in this sandbox the page is complete; check.mjs reports no console errors besides the blocked-asset 500s it ignores.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js` (kit `Cta` sends `cta_click`)
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/review/bot.md` verdict 8 or more (round 1 verdict 6/10; every item in its Fixes list is addressed in round 2, awaiting the next review)

Done here: `data-cta` ids: bot-hero-try, bot-hero-install, bot-hero-sales, bot-plan-pro/dev/max/ultra, bot-deploy, bot-band-try, bot-band-sales. The V2 line reads "8/10 round 2: …".
