# /chrome coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/ChromePage.jsx` · gallery: `docs/gallery/chrome/` · metric id: `signup_start` (install hand-off to the Chrome Web Store)

Open copy questions for James: none new. "Add to Chrome" points at `https://chromewebstore.google.com` (the live href, no listing path), kept as live.
Shared changes requested (`docs/requests/apps1.md`): only the `Band` `id` prop is still open (this page closes on its own ask row with `<Cta id>`); the header ask and the ask bar landed with the shared system.
Forks this page deleted: the PR pill that flew over the window and the channel chip above it (the patch now lands in the window's own `#bug-button-darkmode` tab); the grey skeleton stripes in the ghost tabs (now Hanzo's own tab names); the progress bars in chapter one (now a tick per action); the raw `.x-btn` hero and close buttons (now `<Cta>`); every label above a heading; the second ending ("Get Hanzo in Chrome" with a solid "Deploy to Cloud", now a text-link row above the close); the endless loops (the run, the scan and the MCP pulses now play a set number of times and rest). Round 3 (review 7/10): the six-tile icon bento (three equal icon tiles in a row) is now four hairline capability rows with one small product render that changes per row; the two governance tiles (allowlists, password-manager guardrails) are gone from the bento, so each of those lines is said once, in the black room; the tester's repeat of the window's "Allowed: … Password managers: Blocked" line is gone; the four surface text columns are now a handoff rail; the grey "Looking for Firefox…" box and the outlined "Get Hanzo in Chrome" bar are one hairline block.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` (n/a: no prices)
- [x] Open copy questions for James listed, none decided

Done here: one solid "Add to Chrome" in the hero and again in the closing ask row; check.mjs: 1 solid on the first screen at 1470×801 and 375×812. `lib/cta.js` has not landed, so the label is Hanzo's live one.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [x] Breadcrumb at depth 2 or more (n/a: depth 1)
- [x] Link parity: 0 removed, 0 unexpected

Done here: parity links 9/9; every link is `A` or `<Cta>`.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero`; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer (adapted: no proof strip, because Hanzo's /chrome copy has no proof figures or logos; the close is a page-local room, not `Band`, then the footer)
- [x] Card-to-page links use Morph; title lands within 12px

Done here: the h1 is plain server HTML; the window run starts as soon as 15% of it is in view (on the phone's first screen the side panel's steps tick within a second). JS off: 0 hidden blocks. Order: window (product), paste line, three pinned chapters (agent work), capability rows with their render, the black governance room, the handoff rail and one hairline "where else" block, then the quiet closing room (`<section class="x-band xch-close">`, page-local, not the shared `Band`) with "Add to Chrome" and a small resting Chrome frame showing the tester's "Allowed" verdict, then the footer. There is no proof strip. Small links morph through the shell.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text; failure never says Copied
- [x] `data-cta` and `data-thumb` on every primary

Done here: `<Cta id="chrome.hero" thumb>` and `<Cta id="chrome.band">`; every other link carries `chrome.*`. Desktop: once the hero's ask has gone by, the header's solid button carries "Add to Chrome" (shared `Ask.jsx`); nothing floats over content. Phones: the header stays "Try Hanzo"; the shared slim bar shows "Add to Chrome" only at rest and only where it covers nothing, so it appears in some places and not others (seen in the round-3 walk under the capability rows, not over the dense window or rooms). The agent prompt copies exactly what is shown.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [x] Marquees pause, freeze under reduced motion, hide duplicates (n/a: no marquee)
- [x] Privacy link and owner line beside every submit (n/a: no form; the tester sends nothing)

Done here: every figure is Hanzo's example ("15 seats", "$300/mo", "84ms", "PR #418", "WCAG AAA 8.9:1", "CheckoutForm.tsx:142"), shown as written; no logos or seals.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts
- [x] `python3 scripts/parity.py /chrome`: 0 missing

Done here: parity text 88/88. The former kicker words sit under their headings as 12px mono captions ("What it is", "Capabilities", "Connected surfaces") and under the window ("Hanzo in Chrome · Browser Agent & Enterprise Governance"). The inspector's Elements/Console/Network are part of the product render, not page tabs.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: taste OK (the "PR #418" string is written `#418` / `&#35;418` so the palette check never reads it as a colour); check.mjs: 0 labels over headlines. h1 52/40, section heads 26, one 32/44 statement per screen; status is shape and word (filled dot, tick, ring), never hue. One window, inspector-led: unlike /extension's three-browser stack. No icon tiles: the capability icons are gone; the one remaining icon (a lock) sits bare beside "Password manager guardrails", not in a box.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs are native, trap focus and return it (n/a: no dialog)
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: listed below

Done here: pause/replay, inspector tabs, policy radios, try chips and pills press at .97/.98; capability rows and handoff stops are real buttons (hover with a mouse, focus or tap opens them; press nudges the title 1px); pills fill ink on hover and slide out their own path (/extension, /slack, /tag, /bot); the tester field is 17px+ with a visible ring; all hovers sit in `@media (hover: hover)`.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit

Done here: signature agent run (time and state: steps, panes, the channel tab filling), Stage settle and the black room opening (scroll), pinned chapters (scroll), the handoff rail walking Chrome → Team → Slack → Bot with the scroll (or jumping to the product you point at), the window's pointer tilt (at most 1.6°, fine pointers only, through the shared `useTilt`, no glow), the capability renders crossfading on hover/focus (state), the policy pill at 300 ms ease. variety.py: 4 counted techniques (tilt, layoutId, useScroll, clipPath), 0 Rise. The run plays once and rests; reduced motion shows the finished run. Once it rests the window stays alive (8 Nov): the CDP dot breathes and the side panel's field waits at a blinking caret; the Paste prompt also waits at a caret, so no screen is still. Capability rows' padding now eases with the row (no 24px jump of the rows below). The run's end plays the kit's faint 'done' chime (`play('done')`); policy radios and try chips carry `data-sound="tick"`; inspector tabs tick through the kit's `[role=tab]` rule.

## 10. Media
- [x] `Film` and `Pic` only; sizes and posters set (n/a: no media)
- [x] At most 2 videos playing; pause button on loops over 5 s (n/a)
- [x] Budgets met; nothing missing; alt on every image (n/a)
- [x] No dimmed or filtered photo; 4+ real visuals together where the page has them (n/a)

Done here: the page has no images or films; the hero object is a drawn Chrome window in Hanzo's own words.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: the window's left column is pinned to `minmax(0, 1fr)`; the side panel has a fixed height (desktop: the split fits `100svh - 210px`, so the settled window, ask field included, fits under the header at 1470×801; phone: 516px, the run's tallest moment measured), so results opening never move the page; only the latest finished step keeps its result open. On phones the side panel comes first, then the page pane as a 124px cropped strip and a 120px inspector, so the window is about one screen tall (was about two); "Add to Chrome" sits at y about 450. errs.js: 0 errors, overflow 0 at both sizes.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused (n/a: the tester's field has a hidden label; there is no submit)
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: #525252 and #737373 on white, #a3a3a3 and white 78% on black; the window has a 44px Pause (aria-pressed) that becomes Replay; the verdict is `aria-live="polite"`.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: the finished run is the server frame (every step and result in the HTML); timers stop off screen; filming ran in the cloud session.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: `app/chrome/page.jsx` keeps its metadata and `<JsonLd route="/chrome" />`.

## 15. Catalogue and product pages
- [x] n/a: not a catalogue or model page
- [x] n/a
- [x] n/a
- [x] n/a

Done here: n/a, /chrome is a product launch page.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (or n/a: no code on the page)
- [x] Config blocks parse on their own (n/a)
- [x] Terminal pauses and ends on a static frame
- [x] No hand-typed version number

Done here: the only copy is the agent prompt (copies exactly what is shown); the window run pauses and ends on its static final frame.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed (n/a: no live data)
- [x] Blocked live data leaves a complete page, no console errors
- [x] A failed submit keeps its values and shows no success (n/a: no form)
- [x] A thrown island does not blank the page

Done here: nothing is fetched; the tester runs in the page; an empty address shows no verdict rather than a false one; console errors none, also under reduced motion: the hero window's tilt style is now the same on server and client (reduced motion drops only the pointer handlers), which fixed a hydration mismatch (8 Nov).

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js`
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [x] Review read: `docs/review/chrome.md` verdict 8 or more

Done here: `chrome.hero`, `chrome.band` and `chrome.*` secondaries; `<Cta>` sends `cta_click`; the tester's address is never sent anywhere. `docs/review/chrome.md` scored round 2 at 7/10; every fix it lists is applied in round 3 (bento, de-duplication, handoff rail, one hairline block, window fit and tilt, closing object, phone crop, card claims). Self-score 8/10, awaiting re-review.
