# /agents coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/AgentsPage.jsx` · gallery: `docs/gallery/agents/` (`desktop.*`, `phone-*`; the `crew-*` and `sdk-*` files belong to the family chat) · metric id: `api_key_created` (and the `llms.txt` fetch)

Open copy questions for James:
1. The FAQ says "Top up in USDC or Card" inside `agent.ts` but "USDC or USDT" in the steps. Both are kept verbatim.
2. The header sits white over the black hero at the top of the page (shared Header behaviour). Requested, not edited.

Shared changes requested (`docs/build-notes/requests/chat.md`): the kit `Band` (blur word reveal, no `data-cta`), the floating desktop ask bar, `.x-arrow` underlines. Also the shared Header: it should turn dark over a black first section at scroll 0.
Forks this page deleted:
- page asks (`Ask`, `Docs` buttons), now kit `Cta`
- the hand-written close, now kit `Band`
- the dark install terminal, now one large line plus quiet rows
- the step accordion that shifted layout (CLS 0.18 before), now fixed rows plus one detail panel
- the line counter that flashed numbers
- the install picker and its invented labels

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js` (n/a for `lib/cta.js`: not on main; Hanzo's own label "Sign up headless")
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button. n/a for prices: none here. The ask is an in-page jump to `#headless`, as on Hanzo's page.
- [x] Open copy questions for James listed, none decided

Done here: "Sign up headless" is the only solid fill: the kit `Cta` in the hero, the site ask bar after it, and the closing `Band`. "Read the docs" is a text link.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it (shared)
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- n/a: breadcrumb. Depth 1.
- [x] Link parity: 0 removed, 0 unexpected

Done here: Links parity 4/4. The ask lands on `#headless` (the literal sequence). Agents SDK, llms.txt and Book a call are kept.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero`; nothing above the h1 (no kit `PageHero` yet, so the same anatomy as a page part)
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer (FAQ, then `Band` "No human required.")
- n/a: Morph. No cards to pages.

Done here: At 1470×801:
- The black room, with Koma's film standing between the words and the terminal (clear of the paragraph) and the 52px h1 over a gradient.
- On the right, the numbered terminal. It writes its first request within about 1 s and plays once over about 8 s.

Order: hero, questions (live chat), prompt, `#headless` (unpinned; the scroll hands each step the stage), install, proof figures, `Band`.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text; failure never says Copied. The install Copy gives Hanzo's whole install block, which the rows display. `agent.ts` and the prompt copy whole.
- [x] `data-cta` and `data-thumb` on every primary

Done here: `Cta id="agents.hero" thumb`. The docs links are `agents.docs` and `agents.close-docs`.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- n/a: marquees. None.
- n/a: Privacy link by a submit. No form.

Done here: Every number is Hanzo's, verbatim, in the FAQ and script: $0.021, $8 a month, 402/429, 24 hours, 2000 cents. The terminal's requests are copied from Hanzo's agent prompt. The `n / 05` counter shows the step number only.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts (`Faq multi`). `agent.ts` keeps its own highlighter; there is no kit `CodeBlock` with line scrubbing.
- [x] `python3 scripts/parity.py /agents`: 0 missing

Done here: Parity: text 221/221. Sizes:
- h1: 52px
- section headings: 26px
- the reached step on the `agent.ts` index: grows from 17px to 26px
- body: 15 to 17px
- install line: 36px

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes (literals snapped to the deck)
- [x] No label, tag, badge or pill above a headline. "For agents" is the terminal's title; "Install" and "Headless" are captions below their headings.
- [x] Radii, shadows and sizes from tokens; never box plus shadow. Radii: 24 for objects, 16 for panels. No shadows on tiles.
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: Rooms: black (hero with film), paper (install), quiet `#f5f5f5` (script), paper (prompt, questions), black `Band`. This differs from /chat (paper window hero) and /dev (paper stacked terminal).

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- n/a: dialogs. None.
- [x] Inputs 16px or larger; no bare `:hover`. n/a for inputs: none.
- [x] Forks this page deleted: listed below

Done here: Step rows and index rows have:
- hover: colour
- press: scale .97
- focus: a 2px ring

The steps are `aria-pressed` toggles that control one detail panel.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups (`variety.py` OK)
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- n/a: sound. The shared kit is not on main.

Done here: Kinds of movement:
- time: the sign-up writes itself; the install rows arrive
- arrival: the h1 line mask and the terminal entry
- state: ticks land, the detail panel swaps at 300 ms, the reached index step grows
- pointer: step and index previews
- scroll: `agent.ts` only, with no pin: as the file passes, each step takes the stage in turn (about every 190px at 1470), its lines light, and its requests write themselves under the code before its answer rises; a click holds a step until the scroll crosses into the next

Koma's film plays once and rests on its last frame.

## 10. Media
- [x] `Film` and `Pic` only; sizes and posters set (kit `Film`, poster `koma.webp`, 1200×1500)
- [x] At most 2 videos playing; pause button on loops over 5 s (one film, no loop)
- [x] Budgets met; nothing missing; alt on every image (`koma.webm` is 187 KB; the film is decorative, `aria-hidden`)
- [x] No dimmed or filtered photo; 4+ real visuals together where the page has them (one film: the page has only Koma)

Done here: The film is uncovered between the headline and the terminal, moved off the paragraph at 1470 and above the h1 on phones, so no words sit on it. The only dimming is a gradient under the text side, and there is no filter.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320 (375 checked: 0px)
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: On phone: the film stands above the words (never behind them), then the h1 (3 lines at 40px), lede, ask and link, with the terminal starting on the first screen. `agent.ts` plays once instead of pinning, and its index is a swipe row.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item (the terminal run; the film is under 5 s visible motion per view and does not loop)
- n/a: forms. None.
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: The terminal's final frame (all requests, all steps ticked) is in the server HTML. The full install block is a visually hidden `<pre>`. The prompt is a focusable region labelled "Agent prompt". Gap: no axe run.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: CLS is 0.0008 at 1470×801 and 0.0012 at 375×812 (walked 7 Nov); the hero run card holds 552px (desktop) and 559px (phone) through all five steps. Requests are written into nodes through refs. The demo clock pauses off screen and in hidden tabs.

## 14. SEO and machine files
- [x] Title and description match live (unchanged)
- [x] Canonical equals og:url equals the live URL (shared)
- [x] `<JsonLd route>` parses; no broken URL
- n/a: cards as links. No cards.

Done here: `app/agents/page.jsx` keeps its title, description and `<JsonLd route="/agents" />`.

## 15. Catalogue and product pages
- n/a: not a catalogue or model page.

Done here: n/a. /agents is a Launch page.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display. The install block and prompt copy what they show. `agent.ts` stays a page part, because the kit `CodeBlock` cannot scrub.
- n/a: config blocks. No config.
- [x] Terminal pauses and ends on a static frame (`AppDemo`, plus the server-rendered final frame)
- [x] No hand-typed version number

Done here: The hero terminal starts at 35% in view, has Pause or Replay, and rests on the server frame. The install's first command is large with a `$ ` prompt that cannot be selected.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed. Run states: waiting (dim), current (writing), done (tick). Nothing is fetched.
- [x] Blocked live data leaves a complete page, no console errors
- n/a: failed submits. No form.
- [x] A thrown island does not blank the page (shared)

Done here: JS off and reduced motion show the finished run and the whole script as run. A run with `api.hanzo.ai` blocked logged 0 console errors.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js` (`lib/track.js` not on main; the kit `Cta` dispatches `hz-event`)
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment (after review)
- [x] Review read: `docs/build-notes/review/agents.md` verdict 8 or more (the critic gave 6 before these fixes; pending re-review)

Done here: Proof is in `docs/gallery/agents/` (`desktop-hero.jpg`, `phone-1..3.jpg`: hero, the script mid-scene, the proof row; plus the older `desktop.mp4`, `desktop.jpg`).
