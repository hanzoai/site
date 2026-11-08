# /startups coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Startups.jsx` · gallery: `docs/gallery/startups/` · metric id: `cta_click:startups.hero` (then `form_submit` on the application)

Open copy questions for James: none new. "Select stage" and "Select one" (the live select placeholders) are kept word for word as the pill groups' hints.
Shared changes requested (`docs/requests/startups.md`): none; the header carrying "Apply for credits" after the hero is the shared `Ask.jsx` behaviour.
Forks this page deleted: two browser-default `<select>` menus (now APG radio groups of pills), the eyebrow over the h1 (now a caption under it), three equal tiles of rising height (now one ladder, one rung big at a time), the colourless raw `.xp-cta` (now a styled ink ask with hover and press).

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` (n/a: no plan prices; the $150,000 is the program's own figure)
- [x] Open copy questions for James listed, none decided

Done here: founders are the persona and "Apply for credits" (`data-cta="startups.hero"`, `data-thumb`) the one ask; it jumps to `#apply`. One h1 ("The Hanzo Startup Program"), measured 1.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [x] Breadcrumb at depth 2 or more (n/a: depth 1)
- [x] Link parity: 0 removed, 0 unexpected

Done here: `<main id="main">` added this pass; every outbound link is the kit `A`; `parity.py /startups` shows 0 missing.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero`; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer
- [x] Card-to-page links use Morph (n/a: no cards open into pages)

Done here: the split-flap $150,000 flips within the first second and again every 6.5 s while on screen; the caption "Techstars ’17 — built for founders" now sits under the h1. Then the ladder climbs once by itself, the application with its live match card, and the dark "Not venture-backed?" close.
 7 Nov (Ready pass): the hero card is one quiet outline (no lift shadow) and the program peeks 40px under the hero; the close enters as a rounded card inside the gutters and opens to full width as it arrives, about half as tall, holding the free track as its object (Everyone starts free, Start in minutes, its four uses lighting in turn).
## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text (n/a: no copy button)
- [x] `data-cta` and `data-thumb` on every primary

Done here: after the hero the header's ask reads "Apply for credits" (shared Ask, measured at 1470); the asks are page-local `.xp-cta` styled to the deck (ink fill, hover #262626, press .97), no `.x-btn`.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [x] Marquees pause, freeze under reduced motion, hide duplicates (n/a: no marquee)
- [x] Privacy link and owner line beside every submit

Done here: "Up to … in credits" sits beside $150,000 in the hero and on rung 03; the submit has Hanzo's Privacy Policy line directly under it.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts (n/a: none on the page)
- [x] `python3 scripts/parity.py /startups`: 0 missing

Done here: parity clean; rung bodies held to 44ch; phone floor 14px on hints and fine print.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: taste passes (0 hues); the ladder is hairline rows, not three boxes; the hero medium (a split-flap board) is the page's own.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs are native, trap focus and return it (n/a: no dialog)
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: listed below

Done here: the two selects are now `Choice` radio groups (one tab stop, arrow keys move and choose, `aria-checked`); submit shows "Submitting..." while busy; inputs 17px desktop, 16px phone.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit (n/a: none of the listed moments here)

Done here: signature is the match card assembling as you fill the form (state); supporting: the flap board (idle, time), the ladder climbing once and following pointer/focus (time, pointer), line-masked headlines (arrival). Timers are `setTimeout` only; reduced motion shows every rung at full size.
 7 Nov: the figure card leans up to 2.5 degrees toward a fine pointer and eases flat on leave; the live card keeps a reading line under its track at rest; stage and investor chips show a visible hover (#e4e4e7 with a darker edge).
## 10. Media
- [x] `Film` and `Pic` only; sizes and posters set (n/a: no photos or films on the live page)
- [x] At most 2 videos playing; pause button on loops over 5 s (n/a)
- [x] Budgets met; nothing missing; alt on every image (n/a)
- [x] No dimmed or filtered photo; 4+ real visuals together where the page has them (n/a: the page has none)

Done here: the live page has no media; the visual objects are the flap board, the ladder and the live match card.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: at 375 the counter sits above the asks and "Apply for credits" ends at y 519; no horizontal overflow; every control is 44px+ except the inline Privacy Policy link inside its sentence.
 7 Nov: the phone strip grows to fit its 'n / 5 · stage' line (it was clipped by 3px).
## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item (n/a: the flap and ladder stop by themselves; nothing loops past 5 s without rest)
- [x] Forms labelled; first error focused
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: resting rung text is #737373 on white (4.74:1); each radio group is labelled by its legend; the honeypot is `tabIndex=-1` and `aria-hidden`.
 7 Nov: an empty required field is marked aria-invalid, its message sits under it (aria-describedby), and a network failure shows Hanzo's 'Something went wrong. Please try again.' instead of the browser's text.
## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: one client page, no new dependency; the board re-flip is a single `setTimeout` gated by `useInView`.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link (n/a: no cards)

Done here: `app/startups/page.jsx` takes metadata from `content/pages.json` and renders `<JsonLd route="/startups" />`.

## 15. Catalogue and product pages
- [x] n/a: not a catalogue or model page

Done here: n/a, a program page.

## 16. Developer experience
- [x] n/a: no code on the page

Done here: n/a, no code blocks.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed
- [x] Blocked live data leaves a complete page, no console errors
- [x] A failed submit keeps its values and shows no success
- [x] A thrown island does not blank the page

Done here: a refused POST keeps every answer and shows the API's own reason (or "Request failed (status)") in an alert; success shows only after `r.ok`. Never submitted for real while building.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js`
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [x] Review read: `docs/review/startups.md` verdict 8 or more

Done here: `data-cta="startups.hero"` on the primary; the V2 line is in `components/pages/Startups.jsx`; the review is re-walked after this pass.
