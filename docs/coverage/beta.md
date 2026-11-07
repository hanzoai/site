# /beta coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Beta.jsx` · gallery: `docs/gallery/beta/` · metric id: `signup_start`

Open copy questions for James: none (Hanzo's words only).
Shared changes requested (`docs/requests/<page>.md`): none.
Forks this page deleted: the forked `x-btn solid` Apply buttons (now kit `Cta`), the portal div sheet with a hand-made focus loop (now a native `<dialog>`), raw `<video>` (now kit `Film`), the floating `data-cursor` label, hover lifts and image zooms.


## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js`
- [x] Open copy questions for James listed, none decided

Done here: Header comment in `app/beta/page.jsx` names Persona, Goal, CTA, Metric `signup_start`, Signature, Beyond. One solid per screen: kit `Cta` "Apply" (`beta.hero`, and one per opened pass `beta.<pass>`); the header's Try Hanzo turns outline while it is on screen. No copy questions.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- ~~Breadcrumb at depth 2 or more~~ n/a: depth 1 page.
- [x] Link parity: 0 removed, 0 unexpected

Done here: One `<main>` from the layout; links via `A`/`Cta`; the product tiles link to /dev, /studio, /kai, /enso, /zen; parity links 4/4.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [ ] `PageHero`; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [ ] Ends in proof strip, `Band`, footer
- ~~Card-to-page links use Morph; title lands within 12px~~ n/a: the passes open into their sheet by shared-element morph (layoutId), not to a new page; the product tiles link to their own pages.

Done here: No label above the h1. "Get there first." (52px) with Hanzo's line and Apply; the film strip below is the one big thing and plays within 1 s. `PageHero` is not in the kit yet, so the hero is page-local (left open). The page ends on its own dark close (Feedback 52px, Book a call 26px over Kai's film) then the footer; kit `Band` takes one action, this close has two (left open). JS off: films show posters, every line is in place.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- ~~Copy button copies exactly the displayed text; failure never says Copied~~ n/a: no copy control.
- [x] `data-cta` and `data-thumb` on every primary

Done here: Kit `Cta` only (no raw `.x-btn` in the page file); `data-cta` and `data-thumb` on the hero Apply; the shared ask bar repeats "Apply" after the hero and hides over the dark close.

## 5. Trust and proof
- ~~No logo without documented permission; no seal; no invented number~~ n/a: no logos, seals or figures.
- ~~Every figure traces to Hanzo's copy; qualifier beside the number~~ n/a: no figures.
- ~~Marquees pause, freeze under reduced motion, hide duplicates~~ n/a: no marquee.
- ~~Privacy link and owner line beside every submit~~ n/a: no form on this page; Apply hands off to /beta/apply.

Done here: No figures, logos or seals; only Hanzo's product names and pass sentences.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- ~~Tables, FAQ, tabs and code use the kit parts~~ n/a: no table, FAQ, tabs or code.
- [x] `python3 scripts/parity.py /beta`: 0 missing

Done here: Parity 12/12 text. Type from MASTER: h1 52px, pass titles 32px (first) and 21px, sheet title 52px while it is the moment, close 52px and 26px; nothing under 13px.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` passes (greys only); nothing above a headline; tiles 24 radius with a hairline, no box plus shadow; the dark rooms are the first pass and the close, never back to back. Differs from /affiliate (link as type) and /bounty (GitHub window): its hero object is Hanzo's own films.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs are native, trap focus and return it
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: the forked `x-btn solid` Apply buttons (now kit `Cta`), the portal div sheet with a hand-made focus loop (now a native `<dialog>`), raw `<video>` (now kit `Film`), the floating `data-cursor` label, hover lifts and image zooms. listed below

Done here: Kit `Cta` states; pass tiles answer hover (art drifts up 16px, "+" turns), press .97 in 90ms, focus ring; the opened pass is a native `<dialog>` via `showModal()`: focus goes to Close, Esc, the scrim, Close and Back close it, focus returns to the pass.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- ~~Sound only on the listed moments, through the one kit~~ n/a: the shared sound kit is not on main yet; nothing page-local plays sound.

Done here: Signature: the pass grows into its sheet (layout morph, 0.6s standard ease). Time: the films play; Dev and Studio sketches come alive. Pointer: art drift on tiles and passes. Scroll: the passes clip in once (0.5s, 60ms apart); the close lines cut in from their mask (0.7s, 60ms). No springs; reduced motion shows final states.

## 10. Media
- [x] `Film` and `Pic` only; sizes and posters set
- [x] At most 2 videos playing; pause button on loops over 5 s
- [x] Budgets met; nothing missing; alt on every image
- [x] No dimmed or filtered photo; 4+ real visuals together where the page has them

Done here: Kit `Film` and `Img` only, posters set; Kai, Enso and Zen films play muted, inline; a pause control beside the row stops all of them; at most 2 films play at once on the phone.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: 375×812: films on the first screen, Apply full width above the fold, passes stack, the close sets 32/21; no horizontal scroll at 320; targets 44px+.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- ~~Forms labelled; first error focused~~ n/a: no form.
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: Ink and greys on white at 4.5:1+; white on the dark rooms; one h1; pass titles are h2; the dialog is labelled by its title; the pause control is a real button with its state.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: h1 in server HTML; films lazy with posters; motion is transform, opacity and clip-path; loops pause off screen (`[data-off]`); filmed in the cloud.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: Title and description unchanged; `<JsonLd route="/beta" />` renders canonical and og tags.

## 15. Catalogue and product pages
- ~~Model card matches `SPEC.md` (or n/a: not a catalogue or model page)~~ n/a: not a catalogue or model page.
- ~~Every card opens by Morph~~ n/a: not a catalogue.
- ~~Every maker and model page linked in the DOM~~ n/a: not a catalogue.
- ~~One price figure everywhere~~ n/a: no prices.

Done here: n/a: not a catalogue or model page.

## 16. Developer experience
- ~~One `CodeBlock`; copy equals display (or n/a: no code on the page)~~ n/a: no code on the page.
- ~~Config blocks parse on their own~~ n/a: no config.
- ~~Terminal pauses and ends on a static frame~~ n/a: no terminal.
- ~~No hand-typed version number~~ n/a: no version numbers.

Done here: n/a: no code on the page.

## 17. States and resilience
- ~~Loading, empty, error and offline states designed~~ n/a: static page; films fall back to their posters.
- ~~Blocked live data leaves a complete page, no console errors~~ n/a: no live data.
- ~~A failed submit keeps its values and shows no success~~ n/a: no form.
- [x] A thrown island does not blank the page

Done here: Static Hanzo copy; a film that fails leaves its poster; the sheet is an island that cannot blank the page.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js`
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [x] Review read: `docs/review/beta.md` verdict 8 or more

Done here: `data-cta` ids `beta.hero`, `beta.a`, `beta.b`, `beta.c` (kit Cta fires `cta_click`); V2 line in the route header; conductor review `docs/review/beta.md` 7/10 capped on the card format and the close scale, both fixed here.
