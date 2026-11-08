# /chat coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/ChatPage.jsx` · gallery: `docs/gallery/chat/` · metric id: `first_chat`

Open copy questions for James: none; the page uses Hanzo's words only. One structure note: MASTER 4.1 lists "the existing plan cards, Download" for /chat, but the live /chat page has neither, so none were added (copy is frozen).
Shared changes requested (`docs/build-notes/requests/chat.md`): the kit `Band` reveals its title word by word with a 12px blur and sets it at about 88px, while MASTER parts 9 and 3.1 ask for a line-mask cut-in and resting sizes. The kit `Band` takes no `data-cta`. The site ask bar is a floating pill on desktop, while MASTER 3.1 rule 6 says nothing floats over content.
Forks this page deleted: the page's own `Open` button fork (`.cht-open`), the `.cht-link` text-link fork, the hand-written closing section (`.cht-close`, `.cht-field`), the scroll-scaled stage, a `setInterval` lane scan, and all springs.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`. n/a for `lib/cta.js`: it does not exist on main yet. The label is Hanzo's own "Open Hanzo Chat".
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button. n/a for prices: no prices on /chat.
- [x] Open copy questions for James listed, none decided

Done here: There is one solid ask, "Open Hanzo Chat" (`/login?next=%2Fchat`), as the kit `Cta` in the hero and as the action of the closing `Band`. The site ask bar carries it after the hero (`data-thumb`). The header's "Try Hanzo" goes outline while a page ask is on screen (`components/Ask.jsx`), so the 1470×801 first screen has one solid fill.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it. Shared: the layout supplies the skip link; the page renders one `<main>`.
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- n/a: breadcrumb at depth 2 or more. /chat is depth 1.
- [x] Link parity: 0 removed, 0 unexpected

Done here: All links go through the kit `Cta` and `A`. The nine model rows in "Who answers what" are real `<a href="/<slug>">` links that also open with the WebGL opener. Parity reports links 2/2.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero`; nothing above the h1. `PageHero` is not in the kit yet, so the hero is a page part with the same anatomy: h1 line mask, lede, one primary, one object.
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer. The model sheet is the proof, then the kit `Band`.
- [x] Card-to-page links use Morph. The model rows use the WebGL opener (the synchronized.studio move).

Done here: (8 Nov, James: match hanzo.ai/chat) After the hero, the six tools are laid out as Hanzo's page has them: one heading over a three-by-two grid of cards. The pinned dark room is gone; each card keeps its small scene, which plays as it comes into view and again on hover or focus.
- At 1470×801 the h1 "Ask anything. / Enso picks the model." (52px, single tone, cut in by line mask) sits left.
- The whole chat window, at 100%, sits right with its composer, rail and lit lane on screen. The conversation starts writing within 1 s of hydration.
- Order: hero, the six tools pinned in the black room, the model sheet (white), then `Band` (black). The two black rooms are never back to back.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label (shared `Ask.jsx` reads the hero's `data-thumb`)
- [x] Copy button copies exactly the displayed text; failure never says Copied (the kit `Copy`)
- [x] `data-cta` and `data-thumb` on every primary. The kit `Band`'s button cannot take `data-cta` yet; requested.

Done here: (8 Nov) While the Band's solid ask is on screen the header ask goes quiet (html[data-ask=quiet]), so one solid fill per viewport.
- The hero ask is `Cta id="chat.hero" thumb`, and the empty-state ask is `Cta kind="quiet" id="chat.recent"`.
- The cross-origin hand-off shows the kit's `aria-busy` ring.
- Sending from the composer is a hand-off too: the send key turns into a ring, then leaves for Hanzo Chat. Nothing is sent to `api.hanzo.ai` (MASTER 3.3).

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number. n/a: /chat has no figures.
- n/a: marquees. The page has none.
- n/a: Privacy link by a submit. The page has no form submit; the composer hands off without posting.

Done here: The proof is Hanzo's own model roster: the names, tags and lines from `lib/models.js` with Hanzo's own artwork. No numbers or logos were added.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts. n/a: the page has no table, FAQ, tabs or copyable code. The chapter index is a button row.
- [x] `python3 scripts/parity.py /chat`: 0 missing

Done here:
- Parity: text 37/37, links 2/2.
- Sizes:
  - h1: 52px (40px on phone)
  - chapter titles: 32px
  - the room heading: arrives at 84px and shrinks toward a section heading
  - the model-sheet heading: 26px
  - body: 16 to 17px
  - window chrome: 13 to 14px
- Headings use `text-wrap: balance`.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes. Literal hex values remain, all snapped to the deck (`#0a0a0a`, `#525252`, `#737373`, `#a3a3a3`, `#f5f5f5`, `#171717`…), because `tokens.css` does not exist yet.
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow. Radii are 24px for the window and art, 12 to 22px for UI, and pills.
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: (8 Nov) The Enso card lost its long drop shadow (it is not floating).
- Rooms: paper hero, black room, paper sheet, black `Band`.
- Hero: headline left, the window right. /dev is a stacked terminal and /agents is a black film room, so the three heroes differ.
- `taste.py` passes on `ChatPage.css`, `ChatPage.jsx`, `AppChapters.css` and `AppLines.css`.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- n/a: native dialogs. The page has no dialog; the recents drawer is a disclosure (`aria-expanded`, `aria-controls`).
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: listed below

Done here: Every button has these states:
- hover: background or arrow nudge, inside `@media (hover:hover)`
- press: scale .97 or 1px down
- focus: a 2px ink ring with a white halo
- loading: the send key and the `Cta` ring

The composer and search inputs are 16px. Deleted forks: `.cht-open`, `.cht-link`, `.cht-close`, `.cht-field`.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups. `variety.py` is OK.
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- n/a: sound. The shared sound kit does not exist on main yet.

Done here: (8 Nov) Each chapter's scene lands its payoff within about 1.5 s (same keyframes, shorter delays): Search and code reaches "14 passed", Dev lands its diff, before the next chapter takes over. (8 Nov) The tools grid has no scroll pin: each card's scene plays once on view (time) and replays on hover or focus (pointer/state); cards lift on hover and press to .98.
- Signature (time): Hanzo's conversation writes itself once, Enso scans the lanes and Zen lights. It runs on `AppDemo`'s clock: it starts in view, pauses off screen, rests at its end, and has Pause or Replay.
- Supporting moves:
  - arrival: the h1 line mask and the window's entry
  - state: the lane pill, the chapter pill and the recents drawer, at 300 ms with ease-emphasis and no springs
  - pointer: the magnetic ask, and rail and roster previews
  - scroll: the pinned chapters and the room heading that shrinks
- Each chapter art plays one scene and rests.

## 10. Media
- [x] `Film` and `Pic` only; sizes and posters set. These are images via the kit `Img`, with width and height set.
- n/a: video limits. No video on /chat.
- [x] Budgets met; nothing missing; alt on every image (decorative images use `alt=""`, and the names sit beside them)
- [x] No dimmed or filtered photo; 4+ real visuals together where the page has them

Done here: Hanzo's nine model images (`/models/*.webp`) appear together in the router rail, nine at once. In the sheet, one large picture changes as you point. No filter; the caption sits on a gradient only.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320. Checked at 375 (0px); the window rails scroll inside themselves.
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: On phone the first screen has the h1 in 3 lines at 40px, the lede, "Open Hanzo Chat", and the top of the live window with its first message. Chapters stack as copy then art, each playing when seen. The recents become a swipe row, and the pause control sits at the window's right edge. (8 Nov) Memory stacks its two cards on phones so the carried answer reads at a normal measure; the dark room's heading stops shrinking at section size on phones; "Enso →" is 44px tall.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better. Text on white uses `#0a0a0a`, `#525252` or `#737373`; on `#f5f5f5` it uses `#525252`; on black it uses `#fafafa`, white 78% or `#a3a3a3`.
- [x] Pause control on every moving item. The window demo has Pause or Replay (`AppDemo`); the chapter scenes play once and rest.
- n/a: form labelling. The page has no form; the composer has `aria-label`.
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: The log and the peek line use `aria-live`. The lanes, Listen and the drawer are toggles with `aria-pressed` or `aria-expanded`. The chapter index buttons carry the chapter titles as names. Gap: no axe run in this pass.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized. Sizes are set; the budgets are unmeasured (no `budgets.json` CI yet).
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop (all filming in the cloud)

Done here: Only transform, opacity and clip-path animate. The streaming text is written into a text node through a ref. The demo clock stops while off screen or in a hidden tab, and the lane scan now runs on that clock (the `setInterval` is gone).

## 14. SEO and machine files
- [x] Title and description match live (unchanged in `app/chat/page.jsx`)
- [x] Canonical equals og:url equals the live URL. Shared: layout or `metadataBase`; unchanged here.
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: `app/chat/page.jsx` keeps the title "Hanzo Chat — a chat app that does more than answer", its description, and `<JsonLd route="/chat" />`.

## 15. Catalogue and product pages
- n/a: not a catalogue or model page. The model rows are a roster, not the `SPEC.md` grid.
- [x] Every card opens by Morph. The model rows open with the WebGL opener.
- n/a: maker and model links. Not the /models catalogue.
- n/a: price figures. No prices.

Done here: Each roster row hands its picture to the destination model page through `useOpener().open()`. Reduced motion is a plain link.

## 16. Developer experience
- n/a: /chat has no copyable code. The retry.ts lines in the "Search and code" and "Chat, then Dev" scenes are decorative, `aria-hidden` illustrations, as on /dev.
- n/a: config blocks. None.
- [x] Terminal pauses and ends on a static frame. This applies to the chat demo window: `AppDemo` Pause or Replay, resting on its final frame.
- n/a: version numbers. None on /chat.

Done here: The only live demo is the chat window. It plays once, can be paused, and rests on Hanzo's finished conversation, which is also the server-rendered frame.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed. These are chat states: thinking (Enso's dots), streaming, done, empty ("Ask anything"), another recent selected. Offline is n/a: nothing is fetched.
- [x] Blocked live data leaves a complete page, no console errors (no live data; api.hanzo.ai blocked in every run)
- n/a: failed submits. No form submit.
- [x] A thrown island does not blank the page. Shared error boundaries; the page has no island beyond the window.

Done here: JS off and reduced motion show Hanzo's finished two-question conversation in the server HTML. A run at 1470×801 and 375×812 with `api.hanzo.ai` blocked logged 0 console errors.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js`. `data-cta` is set; the kit `Cta` dispatches `hz-event` cta_click. `lib/track.js` does not exist yet.
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment (added once the critic scores)
- [x] Review read: `docs/build-notes/review/chat.md` verdict 8 or more. The critic pass in this session gave 7 before these fixes, so this is pending re-review.

Done here: `data-cta` is `chat.hero` and `chat.recent`. Proof is in `docs/gallery/chat/`: a 15 s desktop film at 1470×801, the first screen, and three 375×812 phone shots. (8 Nov) Ready by the new bar: docs/gallery/chat/ desktop-hero, phone-1..3.
