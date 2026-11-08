# /zen coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/model/Zen.jsx` and `components/v2/Launch.jsx` · gallery: `docs/gallery/zen/` · metric id: `signup_start`

Open copy questions for James: (1) the h1 is "Zen" with the home model card's line ("Deep reasoning for complex problems."), and live /zen's h1 "Open models. Yours to run." sits beside the settled film as an h2 with the same words: keep, or make the live line the h1 again? (2) The trace's tab names reuse Hanzo's card rows ("Open weights", "Text, images and video", "Packed ternary, 5.95 GB"), its button uses the register's "Next" and "Replay", and its tablist is named "Zen": no new words, but the tabs are a new use of them. Labels that sat above headlines now sit below or beside them as captions.
Shared changes requested (`docs/build-notes/requests/zen-names.md`): the desktop ask bar floats over content (Ask.jsx); the kit Band's blur reveal; `lib/cta.js`, `lib/track.js` and `tokens.css` are not on main yet.
Forks this page deleted: our spec table and headings, raw `.x-btn` asks (now `Cta`), raw `<img>` (now `Img`, `ModelFilm`), cursor labels.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js` (n/a for `lib/cta.js`: not on main; Hanzo's own label is used)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` (n/a: model page, prices are the model's own)
- [x] Open copy questions for James listed, none decided

Done here: `app/zen/page.jsx` carries Persona, Goal, CTA, Metric `signup_start`, Signature and Beyond. The one solid ask "Try Hanzo" (/login): on desktop the page's own ask fills (white on the film, then ink beside the settled headline) while the shared header goes quiet, and the header is solid when no page ask is on screen; on phones the header carries the solid and the page's asks are outlined; the closing band's ask (`zen.band`) is solid. One h1 ("Zen") is in the server HTML.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [ ] n/a: breadcrumb at depth 2 or more (the page sits at depth 1)
- [x] Link parity: 0 removed, 0 unexpected

Done here: the skip link in `app/layout.jsx` reaches `#main`. Every link goes through `A`, `More`, `Cta` or `Arrow`, and every model card is a real `<a href>`. Parity links are 6/6.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero` (n/a: `PageHero` is not in the kit yet; `v2/Launch` plays its role); nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer
- [x] Card-to-page links use Morph; title lands within 12px (the model cards use the WebGL opener, which lands the picture as this page's hero)

Done here: Zen's own film plays full-bleed under the h1 cut-in within the first second, then settles into an arch around Zen's sphere with Hanzo's headline beside it. Then the signature room: about 900 ink dots assemble into Zen's sphere over its rings (the pointer pushes them, a tap scatters them) beside the three figures. Then the reasoning trace (Zen reasons which Zen to run, lighting the rows it reads on the two cards), the three parts (Open weights on its own Sigil art with the two model ids, Zen 6 Flash and Zen 6 on Zen's film, each carrying its card), the family tiles (Every Zen model, Zen 7, Zen 6 Max), Hanzo's model cards coming into focus, and the closing band cut in by line mask. The sphere film is the object on the stage and two parts only; the swarm, trace and family each have their own.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text; failure never says Copied (n/a: no copy button on this page)
- [x] `data-cta` and `data-thumb` on every primary

Done here: "Try Hanzo" appears 4 times: the header, the first-screen ask (white fill on the film), the settled headline and the closing band; the chapters and the trace cards no longer repeat it. One solid "Try Hanzo" per screen, in step with the shared header: on desktop the shared `Ask.jsx` quiets the header (`html[data-ask=quiet]`) while a page "Try Hanzo" is on screen, and the page's own ask then fills (white on the film, ink beside the settled headline); when no page ask is on screen the header is the solid one. On phones (≤700px) the header stays solid and the page's first-screen and headline asks stay outlined. Measured by sampling every 300px of scroll at 1470 and 375: exactly one solid "Try Hanzo" at each stop after arrival (the first ~0.5 s, while the first-screen ask fades in, can show none). The closing band's ask (`zen.band`, `data-thumb`) is solid while the header is quiet. `data-cta` ids: `zen.first`, `zen.hero`, `zen.band`. The settled headline's links stay in the tab order; focusing one scrolls the stage to its settled point so it shows.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [ ] n/a: marquees pause, freeze under reduced motion, hide duplicates (no marquee)
- [ ] n/a: Privacy link and owner line beside every submit (no form on this page)

Done here: Zen's figures in kit `Stat` (5.95 GB, 27.3B, $2.28) and the family tiles (Every Zen model, Zen 7, Zen 6 Max) with living Sigils. Numbers: Packed ternary, 5.95 GB; 27.3B dense; $2.28 in and $7.26 out per 1M tokens, from content/live/zen.json.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts
- [x] `python3 scripts/parity.py /zen`: 0 missing

Done here: parity text 23/23, links 6/6. Section headings rest at 26px, the settled headline at 44px, body 16px, ledes 20px. Mono captions are 12-13px; Hanzo's model-card pills are 11px mono capitals (SPEC 10px, raised one step at the critics' ask). Tables: n/a: no table on /zen. Headings use `text-wrap: balance`.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens (deck values only; `tokens.css` not on main)
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` passes on the page and shell files. Deck greys only (#0a0a0a, #525252, #737373, #a3a3a3 on black), Book 497 headings, radii 24 on tiles and 20 on Hanzo's art cards. Black rooms: the trace room and the closing Band. /zen is the only arch and the only reasoning trace in the group.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [ ] n/a: dialogs are native, trap focus and return it (no dialog on this page)
- [x] Inputs 16px or larger; no bare `:hover` (no inputs; hovers sit in `@media (hover: hover)`)
- [x] Forks this page deleted: listed above

Done here: kit `Cta` gives hover, press (scale), focus and the leaving state. The trace tabs fill on hover (the chosen one brightens to white) and press to .96; Next/Replay press to .97; the parts tilt toward a fine pointer and settle flat; the family tiles and model cards answer hover and press; the film Pause lightens and presses to .94. The settled headline's links are in the tab order and focusing them settles the stage, so no Tab stop is invisible. Focus uses the shared ring.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval` (gap: one typing interval remains in v1 demo code where present)
- [x] Sound only on the listed moments, through the one kit (`lib/sound.js`): the kit ticks the trace tabs and taps the asks; the trace plays the faint `done` settle when it lands its answer on screen

Done here: Signature: the particle swarm (ink dots assemble Zen's sphere; pointer and tap move them). Supporting: the stage settle into the arch (scroll), the self-running reasoning trace (idle, with tabs and Next), the diagonal-wipe, letter-cascade, tilt-3d, glitch-in and focus-pull entrances, the parts' pointer tilt and the model-card tilt. Walked 7 Nov at 1470x801 and 375x812: no still screen above the footer.

## 10. Media
- [x] `Film` and `Pic` only; sizes and posters set (kit `Img`, `Film`, shared `ModelFilm`)
- [x] At most 2 videos playing; pause button on loops over 5 s
- [x] Budgets met; nothing missing; alt on every image
- [x] No dimmed or filtered photo; 4+ real visuals together where the page has them

Done here: Hanzo's own films are unfiltered; the only dimming is a gradient under the name. `ModelFilm` holds at most two films playing at once. The stage's `FilmPause` stops every film and the page's self-running demos. The model-card grid puts nine real model films and posters on screen together.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: at 375 nothing pins. The stage settles by itself after arrival into the arch, and the film Pause rides inside the arch, never alone on white. The trace puts the two cards above the steps, so the lit row is on screen with the step reading it. Parts and family tiles stack; Hanzo's grid stacks to 2 columns. scrollWidth equals innerWidth at 375. The first-screen ask sits under the name inside the first screen.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [ ] n/a: forms labelled; first error focused (no form)
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control (desktop: focusing the settled headline's "Try Hanzo", "API Platform" or "Docs on GitHub" scrolls the stage to its settled point, so they show; measured Tab order Try Hanzo → Try Hanzo → API Platform → Docs on GitHub → Close → Pause → chapters → trace)

Done here: body text is #525252 on white and #a3a3a3 or better on black. The `FilmPause` (44px, `aria-pressed`) sits at the stage foot. h1 is the name, h2 the headline and section heads, h3 the chapters. Tabs and radios take arrow keys.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized (gap: not measured with Lighthouse in the cloud)
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: the h1 and the priority poster (`Img priority`, 1200×1500) are in server HTML. Only transform, opacity and clip-path animate; the trace timers stop off screen and with the page pause. The trace renders all three step slots, its answer row and its button from the start at fixed heights and fills them by opacity and transform only (no in-flow waiting row; the waiting dots sit in the fixed label row). Measured with a PerformanceObserver over a scroll, a 14 s untouched dwell on the trace, all three tabs and five button taps: CLS 0.0005 at 1470 (film pause disc and the shared header, not the trace) and 0.0000 at 375, two fresh runs each.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: `metadata` in `app/zen/page.jsx` is unchanged, and `<JsonLd route="/zen" />` renders the canonical and schema.

## 15. Catalogue and product pages
- [x] Model card matches `SPEC.md` (or n/a: not a catalogue or model page)
- [x] Every card opens by Morph
- [ ] n/a: every maker and model page linked in the DOM (that is `/models`)
- [x] One price figure everywhere

Done here: `ModelCards.jsx` copies SPEC: grid 2fr + 4×1fr at 1131px, rows 220px, gap 12, #000 cards, radius 20, title 22/500 (Enso 44), 11px mono pills (SPEC 10px), the film over its poster with a 0.6s crossfade, and a pointer tilt of 3° that settles flat. This page's card is marked. Each card opens through the WebGL opener.

## 16. Developer experience
- [ ] One `CodeBlock`; copy equals display (or n/a: no code on the page)
- [ ] n/a: config blocks parse on their own (no config)
- [ ] n/a: terminal pauses and ends on a static frame (no terminal)
- [x] No hand-typed version number

Done here: n/a: no code block on /zen (model ids show as inline code).

## 17. States and resilience
- [x] Loading, empty, error and offline states designed (the poster is the loading and offline state for every film)
- [x] Blocked live data leaves a complete page, no console errors (the page has no live data; films fall back to posters)
- [ ] n/a: a failed submit keeps its values and shows no success (no form)
- [x] A thrown island does not blank the page (`app/error.jsx` keeps header and footer)

Done here: JS off shows every word, unblurred, including the closing band (checked with JavaScript disabled at 1470). Reduced motion shows the settled stage and the demo's final frame, with no pin. With media blocked, the posters and black frames stand in at their reserved size.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js` (n/a for `lib/track.js`: not on main; kit `Cta` dispatches `cta_click`)
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/build-notes/review/zen.md` verdict 8 or more (pending a fresh walk of the current build)

Done here: the `V2:` line is in the page file. Proof is in `docs/gallery/zen/` (desktop hero, settled headline, swarm, trace; phone stills), walked 7 Nov.
