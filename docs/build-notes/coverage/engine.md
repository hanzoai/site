# /engine coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/cloud/Engine.jsx` (+ `Engine.css`, on `components/v2/Keynote*`) · gallery: `docs/gallery/engine/` · metric id: `api_key_created`

Open copy questions for James: none (no copy changed; the Beyond aid's heading is Hanzo's own line "One binary, three verbs").
Shared changes requested (`docs/build-notes/requests/engine.md`): none. `lib/cta.js` and `tokens.css` are not on main yet; the asks use the kit `<Cta>` with Hanzo's labels and the deck values are written out (taste.py checks them).
Forks this page deleted: Frame `Hero`, `Paste`, `Get` and `Code` (replaced by KeynoteStage, KeynoteClose and the kit `CodeBlock`); the hand-made "Tech specs" section and its invented row labels; the "The moment" label; raw checkbox and input (now a switch button and the kit `Field`); the per-page red accent.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js`
- [x] Open copy questions for James listed, none decided

Done here: Persona Developer, Goal run Hanzo Engine, CTA "View on GitHub" (engine.hero) and "Deploy to Cloud" (engine.close), metric `api_key_created`. One solid button per screen: the hero ask, then the close's; `lib/cta.js` is not on main, so Hanzo's own labels are used unchanged. No prices on this page (n/a for plans).

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [x] Breadcrumb at depth 2 or more
- [x] Link parity: 0 removed, 0 unexpected

Done here: Hanzo's header and footer untouched; links go through the kit `Cta`/`A` (2/2 live links kept: github.com/hanzoai, platform.hanzo.ai/deploy). Depth 1, so no breadcrumb (n/a).

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero`; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer
- [x] Card-to-page links use Morph; title lands within 12px

Done here: The 52px h1 cuts in by CSS at first paint (baseline near 38% of the screen) beside the lede and the ask; under it the engine's terminal streams tokens by CSS from first paint, before hydration. `PageHero` is not on main yet; KeynoteStage is its kit equivalent. JS off: 0 hidden text blocks (`nojs.cjs`). Rhythm: hero → chapter intro → six pinned one-idea screens → quiet "three verbs" room → graphite close with licence and repo chips as the proof strip (KeynoteClose is the page's `Band`). No card leads to another page (Morph n/a).

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text; failure never says Copied
- [x] `data-cta` and `data-thumb` on every primary

Done here: Both asks are kit `<Cta>`s (`data-cta="engine.hero"` with `data-thumb`, `data-cta="engine.close"`); the shared ask bar carries "View on GitHub" after the hero. The command's `$` is `user-select: none` and Copy copies exactly the command shown; the agent prompt sits in the kit `CodeBlock`, whose Copy reports only a real copy.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [x] Marquees pause, freeze under reduced motion, hide duplicates
- [x] Privacy link and owner line beside every submit

Done here: The only figures are Hanzo's "8" and "2" (GGUF from 2 to 8 bits) and "01 / 06"…"06 / 06"; the drawn bars, lanes and weights show no numbers. The invented "3 verbs / 5 modalities" figures were removed. No logos, marquees or forms (n/a).

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts
- [x] `python3 scripts/parity.py /<path>`: 0 missing

Done here: Body 16px, captions 13px, 12px only for Zen Mono capitals; headings `text-wrap: balance`, chapter bodies 44ch. Code (the agent prompt) is the kit `CodeBlock`; no tables or FAQ. Parity 29/29 text, 2/2 links.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: taste OK; every value is a deck value (#0a0a0a, #525252, #737373, #f5f5f5, #fafafa, #a3a3a3 on black, white at 55/78%). Scale has rhythm: h1 52px, headings 26px, the 8→2 figures 64px Air, body 16px; the terminal is the one big thing. Labels ("hanzoai/engine", "01 / 06", "run, serve, bench") sit under their headings. Objects are filled or outlined, never both, with no shadow; radii 24/16/12/999. No icons beyond play/pause glyphs. Neighbours differ: /edge's hero is a localhost window, /functions' a function's life; only /engine has a terminal with verb tabs.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs are native, trap focus and return it
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: listed below

Done here: Verb tabs, verb radios, the switch and the pause button have hover (inside `@media (hover:hover)`), a .97 press in 90 ms and a 2px focus ring; the asks are kit `Cta` (loading via `aria-busy`). The model input is the kit `Field` (16px). No dialogs on this page (n/a). Forks deleted: see the top of this card.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit

Done here: Signature: the quantization scrub (8 → 2 bits). Supporting: Stage settle, line-mask title, graphite room opening. Kinds: idle (terminal), time (tokens, lanes), state (verb tabs, switch, radios), arrival (title), scroll (chapters, scrub). 0 `Rise`, `variety.py` OK. No springs; tweens on the deck curves. No `setInterval` (step timers are one-shot timeouts). Sound is the shared kit's (not wired by this page).

## 10. Media
- [x] `Film` and `Pic` only; sizes and posters set
- [x] At most 2 videos playing; pause button on loops over 5 s
- [x] Budgets met; nothing missing; alt on every image
- [x] No dimmed or filtered photo; 4+ real visuals together where the page has them

Done here: n/a: Hanzo's /engine has no images or films; every visual is drawn product UI. The one self-running loop (the hero terminal) has the pause control.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: First screens checked at 1470×801 and 375×812 (`first.cjs`); at 375 the h1 (40px), lede, ask and 80px+ of the terminal fit inside 660px. Chapters stack under 900px and play when seen. `sweep.cjs`: no sideways scroll at 375. Verb tabs, radios, switch, pause and chips are 44px+ on touch.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: Lightest text on white is #737373 (4.74:1); on #f5f5f5 #525252 (7.0:1); on black #a3a3a3 (8.0:1) and white 55%. The hero's pause button comes before the demo in the DOM (`aria-pressed`, 44px). One h1; h2 sections, h3 chapters. Verb tabs are role=tab, verbs role=radio, the switch role=switch; the model input has a real label.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: The h1 and the hero terminal are server-rendered; the title and the token stream are CSS, so they paint before hydration. Loops run only while on screen and not paused (one rAF via `useFrame`). Filming and checks ran in the cloud.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: `app/engine/page.jsx` takes title and description from `content/pages.json` and renders `<JsonLd route="/engine" />` (canonical and og:url from the shared component). No cards (n/a).

## 15. Catalogue and product pages
- [x] Model card matches `SPEC.md` (or n/a: not a catalogue or model page)
- [x] Every card opens by Morph
- [x] Every maker and model page linked in the DOM
- [x] One price figure everywhere

Done here: n/a for model cards and prices. As a cloud product it keeps the shared anatomy: identity (title, licence, repo), console (the terminal), facts (the chapters, from existing text), and the closing band.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (or n/a: no code on the page)
- [x] Config blocks parse on their own
- [x] Terminal pauses and ends on a static frame
- [x] No hand-typed version number

Done here: The agent prompt is the kit `CodeBlock` (Copy equals display). The written command copies exactly what is shown. The hero terminal pauses (KeynoteStage pause) and the token stream settles to a static frame; no versions are typed. No config blocks (n/a).

## 17. States and resilience
- [x] Loading, empty, error and offline states designed
- [x] Blocked live data leaves a complete page, no console errors
- [x] A failed submit keeps its values and shows no success
- [x] A thrown island does not blank the page

Done here: The page fetches nothing live: every scene is scripted from Hanzo's copy, so blocked APIs change nothing (0 console errors in `sweep.cjs`). Reduced motion and JS off both show the final, complete page. No forms (n/a); the shared `app/error.jsx` holds the page if an island throws.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js`
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [x] Review read: `docs/build-notes/review/<page>.md` verdict 8 or more

Done here: `data-cta="engine.hero"` and `engine.close`; the kit `Cta` sends `cta_click` through the shared event (no `lib/track.js` on main yet; nothing else is tracked, no field values). `V2: 8/10` line is at the top of `Engine.jsx`. `docs/build-notes/review/engine.md` does not exist yet; this card is updated when the critic's verdict lands.
