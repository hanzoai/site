# /about coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/About.jsx` (+ `About.css`, `story.css`, `StoryClose.jsx`, `StorySheet.jsx`) · gallery: `docs/gallery/about/` · metric id: `signup_start` (`data-cta="about.*"`)

Open copy questions for James: "1700+" repositories in the page copy against "1,600+" in its meta description and on /history (left as Hanzo has them). "Illustration, not data" and "2 of 4 kept" were strings the page had added; both are gone rather than registered.
Shared changes requested (`docs/requests/about.md`): Unfold spring → tween; kit Band word blur; kit Tabs spring pill; v2/Lines timing; the floating ask bar; `taste.py --fix` rewriting copy ("#299").
Forks this page deleted: the page's own buttons and text links (now kit `Cta`: solid, quiet, link); the cursor labels (`data-cursor`); three equal buttons in three places (now one solid plus text links); the page's own dark close (now `StoryClose`); raw `<img>`/`<video>` on the model cards and portraits; the badge above the h1 and every kicker above a heading; the ultramarine accent, the green status dot and the italic accent words; the auto-rotating tile cue and Zen auto-turn (nothing loops past 5 s).

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href are Hanzo's own (no `lib/cta.js` entry exists for /about yet)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; n/a: no prices on this page
- [x] Open copy questions for James listed, none decided

Done here: kit `Cta` everywhere; one solid "Get Started" (/pricing) in the hero, one "Start Building" after the track record, one "Explore Open Roles" in the closing Band; every other action is a text link with a chevron. Story pages' one action is the closing link, carried by `data-cta="about.band"`.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it (shared chrome)
- [x] Every link through `A`; every card a real link
- [x] n/a: breadcrumb (depth 1)
- [x] Link parity: 0 removed, 0 unexpected

Done here: `<main id="main">`; parity links 36/36; model cards are real `<a href>` (WebGL opener on click), papers and commits link out with `rel`.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] Page-owned hero (no shared `PageHero` yet); nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, Band, footer
- [x] Card-to-page links use the opener (model cards) and Morph (paper titles carry `data-morph`)

Done here: h1 (52px, cut in by line, 60 ms apart) with the lede and one ask to its right on 8/5 columns, the frontier drawing itself under them from 0.5 s; a `noscript` rule shows every line and the curve. Order: hero, statement and switches, tiles, figures, founders, Zen, black room, models and papers, roles, Band.

## 4. Conversion system
- [x] kit `Cta` only (solid, quiet, link); no raw `.x-btn`
- [x] Sticky ask: the shared ask bar carries the hero's "Get Started" (`data-thumb`)
- [x] n/a: no copy button on this page
- [x] `data-cta` and `data-thumb` on every primary

Done here: `<Cta thumb id="about.hero">` puts "Get Started" in the phone bar; `about.record` and `about.band` ids; the header carries the desktop ask (shared).

## 5. Trust and proof
- [x] No logo, no seal, no invented number
- [x] Every figure traces to Hanzo's copy
- [x] n/a: no marquee
- [x] n/a: no form

Done here: 100+, $1B+, 2024 and 1700+ are Hanzo's (content/live/about.json); commits link to GitHub; the frontier has no values on its vertical axis.

## 6. Content presentation (copy untouched)
- [x] No text under 13px except 12px mono capitals
- [x] Measures held (headings 24ch, lede 44ch, body 66ch); headings `balance`
- [x] Tabs use kit `Tabs`/`TabPanel`
- [x] `python3 scripts/parity.py /about`: 0 missing

Done here: parity 167/167 text, 36/36 links; the black room's two panes are kit tabs (one at a time), every panel in the HTML.

## 7. Visual design system
- [x] `taste.py` passes; deck greys only (#0a0a0a, #525252, #737373, #a3a3a3, #d4d4d4, #f5f5f5, #171717)
- [x] No label above a headline: Hanzo's labels sit under their heading as a caption
- [x] Radii 24 tiles, 20 art, full buttons; tiles are flat fills, no shadow; only the sheet floats with a shadow
- [x] No icon set needed (one arrow and one chevron, 1.6px stroke)
- [x] Differs from neighbours: hero object is a drawn frontier (History: a running year; Blog: a magazine cover)

Done here: headings rest at 26px (h1 52px, Book 497), figures 64px in Air 220 and grow to 1.75× only while they are the moment; one big thing per screen.

## 8. UI component library
- [x] Every control has hover (inside `hover:hover`), press (.97, 90 ms), focus-visible
- [x] Focus ring: 2px ink with a white halo (white with black halo in the black rooms)
- [x] The sheet traps focus and returns it to the tile; Esc closes
- [x] n/a: no inputs
- [x] Forks deleted: listed above

Done here: switches are `role="switch"`, ease-emphasis 300 ms (no overshoot); the sheet is `StorySheet` (a page-owned tween copy of v2/Unfold, not a native `<dialog>`: noted).

## 9. Motion and interaction
- [x] One signature, 3 supporting, 0 fade-ups (`variety.py` OK)
- [x] Kinds: state (tile → sheet, tabs, switches), pointer (the year under the hand, role tracks, tile peek), time (the frontier draws), arrival (h1 cut-in); scroll-linked: count-up, figures' moment, commits landing
- [x] Something moves without input; every control answers
- [x] Reduced motion shows final states; no `setInterval`
- [x] n/a: sound is the shared kit's

Done here: signature = tile opens into its sheet (600 ms ease-in-out). Nothing loops past 5 s: the curve draws once in 4 s, the switch hint breathes twice, the live dot is still.

## 10. Media
- [x] kit `Img` for portraits and model art, with sizes
- [x] n/a: no films playing (hover films removed)
- [x] Alt on every image (portraits named; decorative art `alt=""`)
- [x] No dimmed photo; Kai, Zen and Enso art shown together

Done here: 3 model artworks plus a Sigil plate for Hanzo Engine in one row; a founder whose portrait cannot load gets a contour field from their name with the initials in the corner (no empty grey slab).

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Targets 44px (socials, commit links); every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: phone composition stacks the hero with the frontier cropped at true scale, the commit log runs message then time (no letter-by-letter dates), the black room's tabs wrap; the switches go two by two, tiles stack with the radar top right, the sheet rises from the bottom, the black room's tabs sit above the log; scrollWidth 375 at 375.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast: #0a0a0a and #525252 on white, #525252 on #f5f5f5, #a3a3a3 and white 78% on black
- [x] n/a: nothing moves for more than 5 s by itself
- [x] n/a: no forms
- [x] One h1; h2 per section, h3 inside; names start with visible text
- [x] Keyboard reaches every control (tiles, sheet arrows, tabs, switches, Zen index, roles)

Done here: tiles carry `aria-haspopup`; the sheet is a labelled `role="dialog"`; decorative SVGs are `aria-hidden`; the curve has an accessible name.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] Every image sized; transform and opacity only
- [x] No poller; no third-party request
- [x] Nothing heavy run on James's laptop (filming in the cloud)

Done here: the pointer cursor writes motion values (state only when the year changes); the curve stops off screen; CLS 0 on the last film.

## 14. SEO and machine files
- [x] Title and description from content/pages.json (unchanged)
- [x] Canonical: shared metadata layer
- [x] `<JsonLd route="/about" />` renders
- [x] Every card is a real link

Done here: `app/about/page.jsx` keeps its metadata and JsonLd; all text in server HTML.

## 15. Catalogue and product pages
- [x] n/a: not a catalogue or model page (the four model cards keep the WebGL opener)

Done here: n/a: Story page; its model cards are links into /kai, /zen, /engine and /enso.

## 16. Developer experience
- [x] n/a: no code on the page

Done here: n/a: no code blocks; commit hashes are real links.

## 17. States and resilience
- [x] Image failure: monogram (portraits), Sigil (Hanzo Engine)
- [x] n/a: no live data (commits are a build snapshot from Hanzo's page)
- [x] n/a: no submit
- [x] Reduced motion and JS off designed

Done here: with hanzo.ai blocked (the cloud) the page is complete with monograms; reduced motion shows the curve drawn and figures at rest.

## 18. Measurement and handover
- [x] `data-cta` on every primary; no analytics wired yet (needs `lib/track.js`)
- [x] Nothing identifier-bearing
- [x] `V2:` line in the page file's top comment
- [ ] Review read: `docs/review/about.md` verdict 7/10, fixes pushed, re-review pending

Done here: `docs/review/about.md` (critic round 2: 7/10); all five fixes in this push (phone log, founders' fallback, length 12,350 → under 11,000px, ghost axes draw, phone hero crop).
