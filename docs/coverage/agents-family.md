# /agents/* coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/crew/AgentRoom.jsx` (+ `AgentRoom.css`, `agentsData.js`, `app/agents/[slug]/page.jsx`) · gallery: `docs/gallery/agents/` · metric ids: `install_copy` (agents-sdk), `signup_start` (agents-crew). Members checked: `/agents/crew`, `/agents/sdk`.

Open copy questions for James: none (the ask labels are the pages' own: "Launch a bot", "Read the docs").
Shared changes requested (`docs/requests/<page>.md`): none filed. Noted: the shared desktop ask bar floats at the bottom centre over content (MASTER §3.2 rule 6 bans floating pills on desktop); it is the shared chat's to change.
Forks this page deleted: the hand-made buttons (now kit `Cta`), the hand-made `<pre>` code block (now kit `CodeBlock`), the raw search `<input>` (now kit `Field`), the hand-written h1 line mask (now `Lines`), `Magnetic` and every spring.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href are the page's own (n/a for `lib/cta.js`: not on this branch)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; n/a prices: none on these pages
- [x] Open copy questions for James listed, none decided

Done here: Crew serves `signup_start` with "Launch a bot", SDK serves `install_copy` with "Read the docs" (both data-thumb + `data-cta`); the walk at 1470×801 and 375×812 counts exactly 1 solid button in the first view.

## 2. Information architecture and navigation
- [x] One `<main>`; the shared shell's skip link reaches it
- [x] Every link through `A` or the kit `Cta`; agents on the ring and at the close are real links to `/chat?agent=…`
- [x] n/a breadcrumb: Hanzo's live page has none and the nav carries no parent label for it
- [x] Link parity: 0 removed, 0 unexpected

Done here: parity links 12/12 (crew) and 13/13 (SDK); the server copy's "/home" console link is kept on the console's title bar.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input (the ring's first turn at 650 ms; the console's first turn at 600 ms)
- [x] Hero by the shared `Lines` cut-in (`PageHero` is not in the kit yet); nothing above the h1
- [x] JS off: legible (stage unpins because the pin is scoped to `.js`; checked by screenshot); h1 never at opacity 0
- [x] One idea per 100svh: stage (chapter one hands to chapter two), room / sheets, spec, code, close
- [x] Ends in the close's object (crew faces / install terminal), then the footer (no `Band`: the live page has no band copy)
- [x] n/a card-to-page Morph: no card here leads to a page with a hero image

Done here: crew first screen: 52px h1, ring passing the turn, "Launch a bot"; SDK: h1, console typing its first turn, "Read the docs".

## 4. Conversion system
- [x] `<Cta>` only for solids; secondary actions are text links with a chevron
- [x] Sticky ask: the shared bar carries "Launch a bot" / "Read the docs" (data-thumb) once the hero ask leaves view
- [x] Copy buttons are the kit's (`Copy`, `CodeBlock`): copy exactly the displayed text
- [x] `data-cta` (`agents-crew.hero|room|close`, `agents-sdk.hero|code|close`) and `data-thumb` on the hero primary

Done here: the repeated asks carry `data-ask-hide` on their own row, so the bar steps aside and never lands on them (walked on a phone with wheel scrolling: bar shows "Launch a bot", header outlined).

## 5. Trust and proof
- [x] No logo, no seal, no invented number
- [x] Figures are Hanzo's ("260+ tools", "117 Cloud services", "100 req/min") inside their own sentences
- [x] n/a marquees: none
- [x] n/a submit: no form

Done here: the Bots room's sketch is drawn only from the screenshot's own alt text ("Weekly outreach, Expense report, Support digest, each done").

## 6. Content presentation (copy untouched)
- [x] No text under 13px except 12px Zen Mono capitals (kickers, counters, table-free labels)
- [x] Headings 12–18ch with `text-wrap: balance`; body 64ch
- [x] Code uses the kit `CodeBlock`; the search uses the kit `Field`; n/a tables, FAQ
- [x] `parity.py`: crew 31/31, SDK 94/94

Done here: deck sizes only: 52 (h1, 40 on phones), 44 (close), 32 (hub name), 26 (sections), 21 (lede), 17, 16, 14, 13, 12.

## 7. Visual design system
- [x] `taste.py` passes; colours are page-local custom properties holding deck values (no `tokens.css` on the branch yet)
- [x] No label above a headline: every kicker sits under its heading
- [x] Radii 24 tiles, 20 art, 6 chips, full buttons; no tile has both an outline and a shadow (no shadows at all)
- [x] n/a icon set: no icons beyond the kit chevron
- [x] Differs from neighbours: ring / console heroes, not the /agents index's stack

Done here: one black room (crew Bots room) or one graphite room (SDK code), each entering as a rounded card that opens to full width.

## 8. UI component library
- [x] Every control has hover (fill or underline, chevron nudge, inside `@media (hover:hover)`), press (scale .97 / 1px), focus-visible
- [x] Focus ring visible: seats outline 6px, kit controls use the shared ring
- [x] n/a dialogs: none
- [x] The search field is the kit's 16px `Field`
- [x] Forks deleted: listed above

Done here: a script hovered all 25 crew and 27 SDK controls at 1440×900: every one changes position, ring or shadow except the fill-only ones (pip/cargo, Copy, the Dark/Light toggle), whose hover is a background fill.

## 9. Motion and interaction
- [x] Signature (who has the turn) + 3: pinned stage scrub, ink that slides (layoutId, tweened), room clip opening; `variety.py` OK (4)
- [x] Kinds: idle (ring round, console), state (ink, hub swap), pointer (seat takes the turn), arrival (cut-in), scroll (stage, room): scroll is under half
- [x] Moves untouched; every control answers
- [x] Reduced motion: no pin, demos show their final state; no `setInterval` (timeout chains that end)
- [x] n/a sound: the shared sound kit is not on the branch

Done here: no springs anywhere (deck tweens: 400 ms ease-in-out baton, 400 ms ease-emphasis ink and entrances, 1.1 s room opening).

## 10. Media
- [x] Faces and the Bots room screenshots by Hanzo's paths as backgrounds over a letter / sketch fallback (n/a `Film`, `Pic`: no video; no raw `<img>`)
- [x] n/a videos
- [x] Alt: the screenshot carries its own alt via `role="img"`; faces are decorative
- [x] No dimmed photo

Done here: images 404 in the cloud sandbox (hanzo.ai blocked), so the films show the letter monograms and the room sketch; on localhost the dev proxy loads Hanzo's pictures.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap (walked)
- [x] No horizontal scroll at 375 (320 not measured)
- [x] Targets 44px or more (seats 54px, nav 44px, Copy 44px)
- [x] Primary ask above the fold at 375×667: crew yes (top at y≈406), SDK yes (y≈422)

Done here: under 900px the stage stacks (h1, object, chapter two), the console nav scrolls sideways, the room shot crops at true size (4:5).

## 12. Accessibility (WCAG 2.2 AA)
- [x] Text #0a0a0a / #525252 / #737373 on white; on black #fafafa / white 78% / 55%
- [x] n/a pause control: both demos run once and rest (no loop)
- [x] Field labelled by the kit
- [x] One h1; h2 per section; h3 in sheets
- [x] Keyboard: install switch is a radiogroup with arrow keys; hidden stage panel is `inert`

Done here: hub and find result announce through `aria-live="polite"`; axe not run.

## 13. Performance and engineering
- [x] h1 in server HTML
- [x] Only transform, opacity and clip-path animate; scroll fades use function transforms
- [x] No poller; timers stop off screen (`useInView`)
- [x] Nothing heavy run on James's laptop (films made in the cloud)

Done here: JS/CSS budgets not measured (no build run here).

## 14. SEO and machine files
- [x] Title and description from `content/pages.json`
- [x] Canonical: shared metadata helper (not changed here)
- [x] `<JsonLd route>` per member
- [x] Agents and faces are real links

Done here: `generateStaticParams` over the two members; `dynamicParams = false`.

## 15. Catalogue and product pages
- [x] n/a: not a catalogue or model page

Done here: n/a: launch-type family (MASTER §4.1).

## 16. Developer experience
- [x] One `CodeBlock` for the SDK sample; copy equals display
- [x] n/a config blocks
- [x] The console plays once and ends on its final frame
- [x] No hand-typed version

Done here: install line (pip / cargo) copies exactly the line shown.

## 17. States and resilience
- [x] Picture failure: letters and the room sketch; JS off: legible; reduced motion: final state
- [x] Blocked data: n/a live data; hanzo.ai blocked leaves a complete page
- [x] n/a forms
- [x] Find with no match shows "—"

Done here: no console errors at 1470×801 and 375×812 (other than the sandbox's blocked pictures).

## 18. Measurement and handover
- [x] `data-cta` on every primary (kit `Cta` sends `cta_click`)
- [x] Nothing identifier-bearing before consent
- [x] `V2:` line in the page file's top comment
- [x] Review read: `docs/review/agents-family.md` (8/10 at `fca5513`)

Done here: films and phone stills in `docs/gallery/agents/`.
