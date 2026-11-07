# /grants coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Grants.jsx` · gallery: `docs/gallery/grants/` · metric id: `lead_submit`

Open copy questions for James: the form's state lines ("Application Received", "Thank you for applying! …", "Submit Another Application", the two check lines and "Your application did not reach us…") come from the page as it arrived in the 7 Nov snapshot (`4203095f`) and are not in `content/live/grants.json`; listed for James to confirm. "Sending…" is removed (the kit busy ring stands in).
Shared changes requested (`docs/requests/<page>.md`): `docs/requests/affiliate.md` (the header's ask outlines while a page's own ask is on screen, and carries it after the hero).
Forks this page deleted: `x-btn` buttons (now kit `Cta`), raw inputs (now kit `Field`), the pill label on the art, the track chip's box-plus-shadow, step hover lifts, oversized 12rem numbers and 36px list titles.


## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport: the page-local `usePhoneAsk` outlines the header's button at every width while any solid ask of the page (the hero ask or "Submit Grant Application") is on screen; on phones the header keeps "Try Hanzo" because "Apply for a Grant" does not fit it (no clipped label)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js`
- [x] Open copy questions for James listed, none decided

Done here: Header comment in `app/grants/page.jsx` names Persona, Goal, CTA, Metric `lead_submit`, Signature, Beyond. One solid per screen: kit `Cta` "Apply for a Grant" (`grants.hero`, `data-thumb`) in the hero and "Submit Grant Application" (`grants.apply`) at the form; each sheet's ask is quiet. Open copy questions listed above.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- ~~Breadcrumb at depth 2 or more~~ n/a: depth 1 page.
- [x] Link parity: 0 removed, 0 unexpected

Done here: One `<main>` (the layout's `#main` marker takes the skip link); links via `A`/`Cta`, except the two `mailto:` links written as plain `<a>`; the in-page asks now use full paths (`/grants#apply`), so kit `A` keeps them in the same tab (round 4, click-tested: 0 new tabs); parity links 5/5.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [ ] `PageHero`; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [ ] Ends in proof strip, `Band`, footer
- ~~Card-to-page links use Morph; title lands within 12px~~ n/a: no cards that open pages.

Done here: Nothing above the h1. "Open Source & Research Credit Grants" (52px) cuts in by line mask; the contour field moves within 1 s and has a pause control. `PageHero` is not in the kit (left open). The page ends on the application, then a quiet proof strip in its own words ("2,137+ repositories · 122 organizations", Explore Repositories), then the footer; no `Band`, because the ask is the form. Round 5: the lede, ask and art rise by CSS from the server HTML (never opacity 0, never waiting for JS). JS off: `NoJs` shows final states and the sheets' dim layers are hidden.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [ ] Sticky ask in header and bar after the hero, same label (desktop: the header carries "Apply for a Grant" after the hero; phone: the label is too long for the shared header, so it stays "Try Hanzo"; request for a phone-size header ask in `docs/requests/founder.md`)
- ~~Copy button copies exactly the displayed text; failure never says Copied~~ n/a: no copy control.
- [x] `data-cta` and `data-thumb` on every primary

Done here: Kit `Cta` only (no raw `.x-btn` in the page file); `data-cta` and `data-thumb` on the primary; the submit is a kit `Cta` with the busy ring.

## 5. Trust and proof
- ~~No logo without documented permission; no seal; no invented number~~ n/a: no logos or seals; 2,137+ repositories and 122 organizations are Hanzo's own figures, beside their words.
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- ~~Marquees pause, freeze under reduced motion, hide duplicates~~ n/a: no marquee.
- [x] Privacy link and owner line beside every submit

Done here: Figures are Hanzo's (2,137+ repositories · 122 organizations) with their words beside them; no logos or seals; "Privacy Policy" (hanzo.ai/privacy) sits beside "Submit Grant Application", with Hanzo's review sentence and "Or email us directly at careers@hanzo.ai" as the owner line. The 2,137+ figure is set static at 64px (the count-up was removed to stay inside the motion budget).

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- ~~Tables, FAQ, tabs and code use the kit parts~~ n/a: no table, FAQ, tabs or code; the track switch is a radiogroup.
- [x] `python3 scripts/parity.py /grants`: 0 missing

Done here: Parity 57/57 text. Type from MASTER: h1 52px, section heads 26px, step and list titles 21px, sheet numbers 64px (44 phone), sheet titles 32px (26 phone), body 16px, labels 15px, caption 12px mono caps.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes (white and black now `--hz-white`/`--hz-black`; the remaining literals are deck greys with no token: #f5f5f5, #171717, #a3a3a3, #525252, #737373)
- [x] No label, tag, badge or pill above a headline
- [ ] Radii, shadows and sizes from tokens (no box plus shadow; radii 24/20/12/999 are deck values written as literals, as no radius token is merged)
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` passes (deck greys only); nothing above a headline; objects 24 radius with hairlines, no box plus shadow; one dark room (the three ways). The hero object is the Sigil field, unlike /bounty (live list) and /founder (pull request).

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- ~~Dialogs are native, trap focus and return it~~ n/a: no dialog.
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: `x-btn` buttons (now kit `Cta`), raw inputs (now kit `Field`), the pill label on the art, the track chip's box-plus-shadow, step hover lifts, oversized 12rem numbers and 36px list titles. listed below

Done here: Kit `Cta` and `Field` states (hover, press .97, focus ring, busy, dashed invalid); the track radios' chip glides (round 4: a selector bug had shrunk it to 2×20px; it now measures 201×50 at 1470), answer hover and press, arrow keys move between them; the pause control has hover, press and focus.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit: the shared `lib/sound.js` (header mute toggle) sounds the `data-cta` asks; the track radios carry `data-sound="tick"`; the page plays nothing of its own.

Done here: Signature: the stacked sheets, each shrinking to .92 and dimming as the next slides over it (driven by the list's own progress). Time: the contour field (pausable). Arrival: line-mask h1; the timeline draws across; ticks draw on the ledger row by row. State: the track chip glides; the filing card fills as you type. Ease-emphasis, no springs. Reduced motion (round 6): nothing branches on the preference while rendering any more (that had broken hydration); CSS shows the final state instead: the sheets at scale 1 with no dim layer, the line drawn, every step and ledger row lit with its tick, the field still. Measured: 0 console errors at 1470 and 375 with reduced motion on and off. The timeline is now scrubbed by scroll and lights each step as the line reaches it; hover redraws a ledger tick.

## 10. Media
- ~~`Film` and `Pic` only; sizes and posters set~~ n/a: no images or video; the hero art is the page's own Sigil field.
- ~~At most 2 videos playing; pause button on loops over 5 s~~ n/a: no video.
- ~~Budgets met; nothing missing; alt on every image~~ n/a: no images.
- ~~No dimmed or filtered photo; 4+ real visuals together where the page has them~~ n/a: no photos.

Done here: No raster media; the hero art is the page's own canvas field.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: round 5: the grants@hanzo.ai link in the error line now has a 44px box (it was 19px). 375×812: hero ask full width above the fold; steps stack on a line; sheets lie flat with full-width wrapping asks (no overflow at 320); the filing card shows only once a field has a value and only the filled rows; fields 56px; targets 44px+.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: Greys at 4.5:1+ on white and dark (round 6: unlit ledger titles are #525252 on #f5f5f5, 7:1; with JS off every row shows lit); one h1, h2s in order, h3s under them; radiogroup with roving focus; a hidden sheet's link lifts its sheet on focus (`:focus-within`); wrong fields are `aria-invalid`, the first takes focus; the result takes focus.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: h1 in server HTML; no poller; the field pauses off screen and on request; motion is transform and opacity.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: Title and description unchanged; `<JsonLd route="/grants" />` renders canonical and og tags.

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
- [x] Loading, empty, error and offline states designed
- [x] Blocked live data leaves a complete page, no console errors
- [x] A failed submit keeps its values and shows no success
- [x] A thrown island does not blank the page

Done here: Offline (round 3): the `online`/`offline` events disable "Submit Grant Application" and show Hanzo's existing error sentence with grants@hanzo.ai. The form checks before sending; a refused application keeps every value and shows the error with the grants@hanzo.ai address; success shows only on a 2xx (tested with interception).

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js`
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/review/grants.md` verdict 8 or more (read: 7/10 on 7 Nov; every fix in it applied in round 3, awaiting the next walk)

Done here: `data-cta` ids `grants.hero`, `grants.apply`, `grants.oss`, `grants.academic`, `grants.internship`, `grants.again` (kit Cta fires `cta_click`); the lead carries only what the visitor typed, on submit; V2 line in the route header; critic review (6/10 at `57dfa0a`): JS-off sheets, the stack's motion, keyboard under sheets, hierarchy, the list as an object, phone filing card, track sound, form focus, kit parts all fixed; strings listed above.
