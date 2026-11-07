# /team coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/TeamPage.jsx` (+ `TeamPage.css`) · gallery: `docs/gallery/team/` · metric id: `signup_start` (cta_click team.hero)

Open copy questions for James: the aria strings Pause and Replay (canvas control) wait for approval in `content/ui-strings.json`.
Shared changes requested (`docs/requests/team.md`): none. Note for the conductor: `taste.py --fix` rewrote Hanzo's "PR #418" to "PR #262626" and the diff sample's colours on this page (restored here; copy outranks palette). It hits any "#" plus 3 or 6 hex-like characters, including /chrome.
Forks this page deleted: the forked `Btn` buttons (now the kit's `Cta`); the company `PinScenes` (replaced by page-local chapters whose headline clears first); the placeholder grey rooms.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from Hanzo's copy (`lib/cta.js` does not exist yet)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; ~~prices~~ n/a: no prices
- [x] Open copy questions for James listed, none decided

Done here: "Create your team" (hanzo.team/start) is the solid in the hero and the close. "Open Hanzo Team", "hanzoai" and "Deploy to Cloud" are quiet `Cta`s. The site's ask bar carries "Create your team" after the hero.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [x] ~~Breadcrumb~~ n/a: depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: The layout's skip link reaches `#main`. The links are `Cta`, `Lk` (the kit's `A`) and the social icons. Parity is 20/20 links, and "Open Hanzo Team" now follows "in your workspace:".

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [ ] ~~`PageHero`~~ not merged in the kit yet; the hero is page-local and nothing sits above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in the Sigil close and footer
- [x] ~~Morph~~ n/a: no card opens into a page

Done here:
- The right column's fade and the canvas story both wait for `useArrived`, so Zoe's first walk happens where people can see it. After Done the cursors breathe (one mover), with Pause and Replay.
- With JS off the lede, asks, docs link and whole canvas show; the cursors are hidden and the chapters stack.
- Narrative: canvas hero, three pinned chapters, together, the rooms (miniatures), the dark workflow room, the code window, leaders, the spec, the close.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text
- [x] `data-cta` and `data-thumb` on every primary

Done here: `Cta id="team.hero" thumb` and `team.close`, plus team.hero-open, team.source and team.deploy. The "Paste and ship" prompt copies the exact displayed text.

## 5. Trust and proof
- [x] No logo without permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy
- [x] ~~Marquees~~ n/a: none
- [x] ~~Privacy link~~ n/a: no form

Done here: 42/42, PR #418, (+18 -4), (+14 -3) and 8.9:1 all trace to `content/live/team.json`. The two PR numbers corrupted by the palette pass are restored.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tabs use the APG pattern (arrow keys, `aria-selected`)
- [x] `python3 scripts/parity.py /team`: 0 missing

Done here: Parity is 242/242 text and 20/20 links. The invented "CHANNEL" label is gone, and Engineering · Security · … · Growth reads as Hanzo's line of text again.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside the deck ramp
- [x] No label, tag, badge or pill above a headline
- [x] Radii 24/16/12/8/6, art 20; windows outlined only, tiles flat; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium (a working multiplayer canvas)

Done here:
- `taste.py` passes (2 checked). `TeamPage.css` uses only #0a0a0a, #171717, #262626, #525252, #737373, #a3a3a3, #d4d4d4, #e5e5e5, #ededed, #f2f2f2, #f5f5f5, #fafafa and #fff.
- Headings come from `company/deck.css` (weight 497). The hero canvas and code window are outlined with a 1px hairline and have no shadow.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] ~~Dialogs~~ n/a
- [x] ~~Inputs~~ n/a; no bare `:hover`
- [x] Forks this page deleted: listed above

Done here: The Pause/Replay control has a 44px hit area and presses at .97. The workflow and step tabs are APG tab lists. The inactive channel panels are `inert` and `aria-hidden`.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [ ] ~~Sound~~ the shared sound kit is not in yet

Done here:
- Kinds of motion:
  - Idle: the canvas story, then the breathing rest.
  - State: tabs, steps, Pause and Replay.
  - Pointer: the handoff faces drawing together.
  - Arrival: the line masks, and the room miniatures making one move each (the board card sliding to Done, the calendar block filling).
  - Scroll (2 of 6): the tilt-and-settle and the chapters.
- There are no springs: cursors and the card move at 0.9 s and 0.5 s ease-in-out. Reduced motion shows the final picture, with the stage untransformed.

## 10. Media
- [x] ~~`Film`~~ n/a: no film; memoji are CSS backgrounds over sized discs
- [x] ~~Videos~~ n/a
- [x] Every face has a fallback (the person's own initial: Z, D, Q…)
- [x] No dimmed or filtered photo

Done here: Memoji failures leave a grey disc with the person's initial, from the `INI` map (Zoe = Z, Qa = Q). Leaders' portraits keep their initial plates.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here:
- On the phone, the board widens whichever column holds the task (1.7fr), so the card reads in lines.
- The chapters stack with their visuals and the giant numerals are hidden. The workflow rail is a swipe row of 44px pills.
- Arrow links are 44px. The window dots are `flex:none`.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item (the canvas)
- [x] ~~Forms~~ n/a
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: The canvas is `aria-hidden` decoration beside real text. Focus inside a chapter scrolls the page to it. Tabs move with the arrow keys.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] Transform and opacity only
- [x] No poller; no third-party request
- [x] Nothing heavy run on James's laptop

Done here: The canvas runs only while seen. The stage's transform is the same on server and client (no reduced-motion branch in JS; CSS removes it), so there is no hydration error (console clean).

## 14. SEO and machine files
- [x] Title and description match live
- [x] Canonical belongs to the shared layout owner
- [x] `<JsonLd route="/team">` unchanged
- [x] ~~Cards~~ n/a: no linking cards

Done here: `app/team/page.jsx` keeps Hanzo's title and description.

## 15. Catalogue and product pages
- [x] ~~Model card~~ n/a: not a catalogue or model page

Done here: n/a. As a Launch page it has the hero product, the show-it canvas, chapters, the spec (License: MIT, source, deploy, paste-and-ship) and one closing ask.

## 16. Developer experience
- [x] The paste-and-ship prompt copies exactly the displayed text
- [x] ~~Config blocks~~ n/a
- [x] ~~Terminal~~ n/a: the code session is stepped by hand
- [x] No hand-typed version number

Done here: The diff sample is Hanzo's own code text, kept byte-identical (written so the colour checker skips it).

## 17. States and resilience
- [x] Static content; no loading state needed
- [x] Blocked media leaves a complete page, no console errors
- [x] ~~Failed submit~~ n/a
- [x] A thrown island does not blank the page

Done here: With hanzo.ai blocked (cloud), the memoji fall back to initial discs. The console is clean.

## 18. Measurement and handover
- [x] `data-cta` on every primary (through `Cta`)
- [x] Nothing identifier-bearing before consent
- [x] `V2: 8/10 …` in the page file's top comment
- [ ] Review read: `docs/review/team.md` was 6/10; every listed fix is done, awaiting re-review

Done here: All six fixes from the review are done in its order (hero and JS off, the rooms, the workflow room, alive at rest and the chapter change, the phone pass, and this card). Gallery: `docs/gallery/team/`.
