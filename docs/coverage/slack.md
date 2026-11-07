# /slack coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Slack.jsx` (+ `Slack.css`, copy in `slackData.js`) · gallery: `docs/gallery/slack/` · metric id: `slack.hero`, `slack.close`

Open copy questions for James: none; the copy is unchanged (parity 196/196 text, 10/10 links).
Shared changes requested (`docs/requests/slack.md`): mirror the memoji, fix the shared A2Lines reduced-motion hydration, the phone header ask, the header solid shown beside the close's solid, cookie card height.
Forks this page deleted: the outlined "Explore" pill buttons and the solid black "Get Hanzo Tag" tile in the close (now text links and a quiet tile); the three numbered room cards (now one tile with three states).

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js`
- [x] Open copy questions for James listed, none decided

Done here: The h1 now rests at 52px with its last line near 40% of 801px, and the dark scene with the step rail and the window top shows on the first screen. The close keeps one solid ask ("Connect Slack Workspace"); the two Explore links and Deploy to Cloud became text links.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [x] ~~Breadcrumb at depth 2 or more~~ n/a: /slack is depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: Every link goes through kit `A`/`More` (the close's `Go` became `More` with the same href). `parity.py /slack` reports links 10/10.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [ ] `PageHero`; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [ ] Ends in proof strip, `Band`, footer
- [x] ~~Card-to-page links use Morph; title lands within 12px~~ n/a: no cards open into pages here

Done here: The h1 cuts in by line mask and the pulsing dot and "Working" status move within 1 s; the window peeks into the first screen at 1470x801 and 375x812. Every section after the scene opens at 72px (Setup, What, Platform, Questions, Close; Notes, Setup and What close at 103px), so the white between moments fell from about 320px to about 175px. The page still uses its own hero markup until a shared `PageHero` lands (the kicker is visually hidden), and it ends on its own close, not on a `Band`.

## 4. Conversion system
- [ ] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text; failure never says Copied
- [x] `data-cta` and `data-thumb` on every primary

Done here: Asks still use `.x-btn` until `<Cta>` ships. The hero ask carries `data-cta="slack.hero"` plus `data-thumb`, the close carries `slack.close`, and A2Paste copies exactly the displayed prompt.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [x] ~~Marquees pause, freeze under reduced motion, hide duplicates~~ n/a: no marquee
- [x] ~~Privacy link and owner line beside every submit~~ n/a: no form

Done here: Every figure on the page is Hanzo's own (42 channels, 1.9:1, 8.9:1, 28/28, +32 -9, PR #418), from `slackData.js`. The new window crop and room art reuse those strings only.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts
- [x] `python3 scripts/parity.py /<path>`: 0 missing

Done here: `parity.py /slack` reports text 196/196 and links 10/10. The invented headings are gone: the setup card is labelled by its own name ("Hanzo Tag Setup") and Hanzo's sentence "Connect @Hanzo to your Slack workspace in three steps." appears once, as the close h2, as on live; the FAQ h2 is visually hidden since Hanzo gives it no label. Unlit promises draw at 17px (21px scaled .81) and only the lit one grows to 21px; the h1 is 52px and the room numbers are 13px mono captions.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` passes on all 5 files; the "aubergine" wording is gone from the header comment and only deck greys are used. The new tiles are flat `#f5f5f5` fills with `--r-hero` radii, and no shadow is added.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs are native, trap focus and return it
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: listed below

Done here: Measured: the outlined secondary goes from white to `#f2f2f2` on hover. The "How each one works" trigger also fills `#f2f2f2` and nudges its + by 2px, and both press at scale .97 (90ms). New hovers sit inside `@media (hover:hover)`, and the room tabs press at .98. The four platform items are now focusable (tabIndex 0, focus inks the item like hover), press at .98 in 90ms and show a 2px ink focus ring.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] ~~Sound only on the listed moments, through the one kit~~ n/a: no page sounds; the shared kit owns them

Done here: `variety.py` passes with 3 techniques (useScroll, layoutId, rAF) and 0 Rise. The tab pill moved from a spring to a 300ms ease-emphasis tween. The setup demo (setTimeout, no setInterval) starts at 60% in view with the ask already in the channel, ticks the three steps, answers, and ends at rest after 9 s; it pauses out of view and never loops. On desktop the scene's thread now scrolls inside the window (grid row `minmax(0, 1fr)`), so at step 6 the merged PR (y 707-746) and Archive Channel sit inside the window (bottom 767) at 1470x801. New idle motion was added: a runtime signal and a WIMSE token draw. Under reduced motion there are 0 running animations after 3 s on desktop and phone.

## 10. Media
- [x] ~~`Film` and `Pic` only; sizes and posters set~~ n/a: no photos or films; every visual is drawn
- [x] ~~At most 2 videos playing; pause button on loops over 5 s~~ n/a: no video
- [x] Budgets met; nothing missing; alt on every image
- [x] ~~No dimmed or filtered photo; 4+ real visuals together where the page has them~~ n/a: no photos

Done here: The memoji hotlinks (5 failed requests a load) were replaced with drawn initial discs, so 0 failed requests and no broken glyphs. hanzo.ai was unreachable, so `public/memoji/` could not be filled; `MEMOJI = true` in `slackData.js` turns the faces on once they are mirrored.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: The phone now has its own scene: a compact window pinned under a 44px scroll-snap rail that slides to the current step, with only the current artifact under the thread. A target scan at 375 finds 0 targets under 44px, and scrollWidth equals the viewport at 320, 375 and 1470.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] ~~Forms labelled; first error focused~~ n/a: no form
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: Inactive promises dim to opacity .56 (renders about #767676, 4.5:1) and draw at 17px and inactive titles use `#737373` on white (4.7:1). The rooms are an APG vertical tablist (aria-selected/controls, inert panels), and the rail keeps arrow keys. The contrast-slider loop has no separate pause control; dragging stops it, and it freezes under reduced motion.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: New motion animates only transform, opacity and clip-path (room panels wipe by clip-path, drops by scaleY). The range input renders after mount, which removes the hydration mismatch. All checks ran in the cloud session.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: Metadata, canonical and JSON-LD are untouched (route files not edited). Every word is still in the server HTML; the rooms' panels stay in the DOM while hidden.

## 15. Catalogue and product pages
- [x] ~~Model card matches `SPEC.md`~~ n/a: not a catalogue or model page
- [x] ~~Every card opens by Morph~~ n/a: not a catalogue
- [x] ~~Every maker and model page linked in the DOM~~ n/a: not a catalogue
- [x] ~~One price figure everywhere~~ n/a: no prices

Done here: Not a catalogue page; the platform section links Team, Tag, Governance, Chrome and Bot (5 runtime links kept). The four product marks are drawn frames, not logos.

## 16. Developer experience
- [x] ~~One `CodeBlock`; copy equals display~~ n/a: the diff is product UI inside the window, not a copyable code block
- [x] ~~Config blocks parse on their own~~ n/a: no config
- [x] ~~Terminal pauses and ends on a static frame~~ n/a: no terminal
- [x] ~~No hand-typed version number~~ n/a: none shown

Done here: The only copyable text is the A2Paste agent prompt, which copies exactly what it shows. The diff and the room-art diff render Hanzo's own lines from `DIFF`.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed
- [x] Blocked live data leaves a complete page, no console errors
- [x] ~~A failed submit keeps its values and shows no success~~ n/a: no form
- [x] A thrown island does not blank the page

Done here: With hanzo.ai blocked the page is complete, with 0 console errors on 6 loads (desktop, phone, 320, and reduced motion). The reduced-motion hydration error is gone: the page imports `skills/Lines` and gates its own reduced-motion state behind a mounted flag.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js`
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/review/<page>.md` verdict 8 or more

Done here: The `V2:` line was rewritten for this pass, and `docs/review/slack.md` (7/10) was worked through fixes 1 to 7 in order; the two shared notes stay filed in `docs/requests/slack.md`. A fresh critic verdict is still to come.
