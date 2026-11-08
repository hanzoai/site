# /agents/* coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/crew/AgentRoom.jsx` (+ `AgentRoom.css`, `agentsData.js`, `app/agents/[slug]/page.jsx`) · gallery: `docs/gallery/agents/` · metric ids: `install_copy` (agents-sdk), `signup_start` (agents-crew). Members checked: `/agents/crew`, `/agents/sdk`.

Open copy questions for James: none (the ask labels are the pages' own: "Launch a bot", "Read the docs").
Shared changes requested (`docs/requests/<page>.md`): none filed. Noted: the shared desktop ask bar floats at the bottom centre over content (MASTER §3.2 rule 6 bans floating pills on desktop); it is the shared chat's to change.
Forks this page deleted: the hand-made buttons (now kit `Cta`), the hand-made `<pre>` code block (now kit `CodeBlock`), `Magnetic` and every spring.
Page-local on purpose (round 2, docs/review/agents.md): the h1 uses the shared `.x-line` / `.x-line-in` mask markup but its cut-in is CSS under `html.js` (the shared `Lines` writes `translateY(110%)` inline into the server HTML, which hid the h1 until hydration); the find field uses the kit Field's markup and classes (`x-field`, `x-input2`) with a fixed id, because the kit `Field`'s `useId` differed between server and client here (hydration mismatch).

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
- [x] Hero headline cuts into its line mask (CSS keyframes under `html.js`, 1.1 s ease-emphasis, from first paint); nothing above the h1
- [x] JS off: legible (no inline transform or opacity in the server HTML; the stage unpins because the pin is scoped to `.js`; checked by screenshot with JavaScript disabled at both sizes)
- [x] The ring is server-rendered in its start pose (`--from` / `--low` on the stage, the same scale and offset the scroll scrub starts from) with "Antje · 01 / 10" in the hub, so nothing moves at hydration
- [x] One idea per 100svh: stage (chapter one hands to chapter two), room / sheets, spec, code, close
- [x] Ends in the close's object (crew faces / install terminal), then the footer (no `Band`: the live page has no band copy)
- [x] n/a card-to-page Morph: no card here leads to a page with a hero image

Done here: screenshot 500 ms after the h1 reaches the DOM (warm load): crew shows h1, lede, "Launch a bot" and the ring with Antje; SDK shows h1, lede and "Read the docs" beside the console.

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
- [x] Code uses the kit `CodeBlock`; the search uses the kit Field's markup and classes (fixed id, see the note above); n/a tables, FAQ
- [x] `parity.py`: crew 31/31, SDK 94/94

Done here: deck sizes only: 52 (h1, 40 on phones), 44 (close), 32 (hub name), 26 (sections), 21 (lede), 17, 16, 14, 13, 12.

## 7. Visual design system
- [x] `taste.py` passes; colours are page-local custom properties holding deck values (no `tokens.css` on the branch yet)
- [x] No label above a headline: every kicker sits under its heading
- [x] Radii 24 tiles, 20 art, 6 chips, full buttons; no tile has both an outline and a shadow (no drop shadows; the stacked sheets carry only a 1px hairline on their top edge so each covered sheet's strip reads)
- [x] n/a icon set: no icons beyond the kit chevron
- [x] Differs from neighbours: ring / console heroes, not the /agents index's stack

Done here: one black room (crew Bots room) or one graphite room (SDK code), each entering as a rounded card that opens to full width.

## 8. UI component library
- [x] Every control has hover (fill or underline, chevron nudge, inside `@media (hover:hover)`), press (scale .97 / 1px), focus-visible
- [x] Focus ring visible: seats outline 6px, kit controls use the shared ring
- [x] n/a dialogs: none
- [x] The search field has the kit field's 16px look; the browser's webkit search-cancel × is hidden and the field has its own 44×44 clear button (hover fill, press .97, focus ring, Escape also clears)
- [x] Forks deleted: listed above

Done here: the close's face links lift 6px, turn ink and show the agent's name on hover; seats and the Bots room toggle keep their earlier answers.

## 9. Motion and interaction
- [x] Signature (who has the turn) + 3: pinned stage scrub, ink that slides (layoutId, tweened), room clip opening; `variety.py` OK (4)
- [x] Kinds: idle (ring round, console), state (ink, hub swap), pointer (seat takes the turn), arrival (cut-in), scroll (stage, room): scroll is under half
- [x] Moves untouched; every control answers
- [x] Reduced motion: no pin, demos show their final state; no `setInterval` (timeout chains that end)
- [x] n/a sound: the shared sound kit is not on the branch

Done here: no springs anywhere (deck tweens: 400 ms ease-in-out baton, 400 ms ease-emphasis ink and entrances, 1.1 s room opening).

## 10. Media
- [x] Faces and the Bots room screenshots by Hanzo's paths as backgrounds over a designed fallback (n/a `Film`, `Pic`: no video; no raw `<img>`)
- [x] n/a videos
- [x] Alt: the screenshot carries its own alt via `role="img"`; faces are decorative
- [x] No dimmed photo

Done here: Hanzo's own pictures are in the repo now (`public/agents/`: the 26 faces as Hanzo serves them, 160px, and the Bots room's dark and light screenshots in `public/agents/room/`), so the ring shows every agent's face and the room shows Hanzo's real screenshot; the greyscale initial mark stays as the fallback while a picture loads. Colour arrives only through these pictures.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap (walked)
- [x] No horizontal scroll at 375 (320 not measured)
- [x] Targets 44px or more (seats 54px, nav 44px, Copy 44px)
- [x] Primary ask above the fold at 375×667: crew yes (top at y≈406), SDK yes (y≈422)

Done here: under 900px the stage stacks (h1, object, chapter two), the console nav scrolls sideways, the room shot crops at true size (4:5); the close's 10 faces sit on one line at 375 (x 16 to 344, measured); the SDK parts become a swipe rail of tiles under the contour. With live's 26-agent roster the seats size themselves to the ring (min of the deck size and the arc per agent), so no two overlap at 1470 or 375; on phones each small seat has a finger-sized hit area.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Text #0a0a0a / #525252 / #737373 on white; on black #fafafa / white 78% / 55%
- [x] n/a pause control: both demos run once and rest (no loop)
- [x] Find field labelled with `<label for="xag-find-q">`; clear button named "Clear"
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
- [x] Picture failure: the per-agent mark and the room sketch; JS off: legible; reduced motion: final state
- [x] Blocked data: n/a live data; hanzo.ai blocked leaves a complete page
- [x] n/a forms
- [x] Find with no match shows "—"

Done here: no console errors and no hydration mismatch at 1470×801 and 375×812 (3 clean reloads of crew and 2 of SDK each, caught from first byte; other than the blocked pictures).

## 18. Measurement and handover
- [x] `data-cta` on every primary (kit `Cta` sends `cta_click`)
- [x] Nothing identifier-bearing before consent
- [x] `V2:` line in the page file's top comment
- [x] Review read: `docs/review/agents-family.md` (8/10 at `fca5513`)

Done here: films and phone stills in `docs/gallery/agents/`; round 2 first screens: `crew-desktop-r2.jpg`, `crew-phone-r2.jpg`, `sdk-desktop-r2.jpg`, `sdk-phone-r2.jpg`.
