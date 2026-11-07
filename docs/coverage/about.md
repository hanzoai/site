# /about coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/About.jsx` (+ `AboutZen.jsx`, `About.css`, `story.css`, `StoryClose.jsx`, `StorySheet.jsx`) · gallery: `docs/gallery/about/` · metric id: `signup_start` (`data-cta="about.*"`)

Open copy questions for James: "1700+" repositories in the page copy against "1,600+" in its meta description and on /history (left as Hanzo has them). "Illustration, not data" and "2 of 4 kept" were strings the page had added; both are gone rather than registered.
Shared changes requested (`docs/requests/about.md`): Unfold spring → tween; kit Band word blur; kit Tabs spring pill; v2/Lines timing; the floating ask bar; `taste.py --fix` rewriting copy ("#299").
Forks this page deleted: the page's own buttons and text links (now kit `Cta`: solid, quiet, link); the cursor labels (`data-cursor`); three equal buttons in three places (now one solid plus text links); the page's own dark close (now `StoryClose`); raw `<img>`/`<video>` on the model cards and portraits; the badge above the h1 and every kicker above a heading; the ultramarine accent, the green status dot and the italic accent words; the auto-rotating tile cue and Zen auto-turn (nothing loops past 5 s).

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href are Hanzo's own (no `lib/cta.js` entry exists for /about yet)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; n/a: no prices on this page
- [x] Open copy questions for James listed, none decided

Done here: kit `Cta` everywhere; two solid labels on the whole page: "Get Started" (/pricing) in the hero and "Explore Open Roles" in the closing Band. "Start Building" after the track record is now a text link; every other action is a text link with a chevron. Story pages' one action is the closing link, carried by `data-cta="about.band"`.

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

Done here: h1 (52px, cut in by line by a CSS animation from first paint, 60 ms apart) with the lede and one ask to its right on 8/5 columns, at full opacity in the server HTML; the frontier, its ghost axes and its head draw by CSS from 0.1 s (no hydration wait); with JS off the frontier shows fully drawn. The lede and asks never move (lede top measured identical at 0.3, 1 and 3 s); on phones the frontier is its own taller plot of the whole 2014–2026 curve at 343px (Techstars '17, all four axis names and every year at 12–13px, y 221–451 of 812), straight under the h1, with the lede and "Get Started" below it. Order: hero, Why (one figure, switches and the principles index on one screen), figures, founders, Zen (the one pinned scene: the scroll turns its six principles one at a time), black room (enters as a rounded card), models and papers, roles, Band. At 1470×801 the hero leaves the next section's head peeking under the fold.

## 4. Conversion system
- [x] kit `Cta` only (solid, quiet, link); no raw `.x-btn`
- [x] Sticky ask: the shared ask bar carries the hero's "Get Started" (`data-thumb`)
- [x] n/a: no copy button on this page
- [x] `data-cta` and `data-thumb` on every primary

Done here: `<Cta thumb id="about.hero">` puts "Get Started" in the phone bar; `about.record` and `about.band` ids; the header carries the desktop ask (shared). On phones the header's solid "Try Hanzo" turns quiet (`html[data-ask=quiet]`, the /bounty pattern) while the hero's solid ask is on screen, so one solid fill shows at a time.

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
- [x] Radii 24 tiles, 20 art, full buttons; tiles are flat fills, no shadow; only the sheet floats with a shadow (the commit log is outlined only, no drop shadow)
- [x] No icon set needed (one arrow and one chevron, 1.6px stroke)
- [x] Differs from neighbours: hero object is a drawn frontier (History: a running year; Blog: a magazine cover)

Done here: headings rest at 26px (h1 52px, Book 497; founders' names 26px beside 230px plates), figures rest at 64px in Air 220 and only the one nearest the middle of the screen grows to 1.75× (one big figure at a time, handing over down the staircase); one big thing per screen. Why We Build is one screen (878px at 1470, 1212px at 375): one diamond figure whose four corners the four switches push out (all four = the full frontier), beside the switches and the six principles as a compact index; a hand or focus on a principle swaps the diamond for its radar, a click grows the row into its sheet. Model cards answer a hand with the SPEC's perspective tilt (under 3°, no scale, lift or shadow); paper rows take a soft fill and ink their kind and date; row-head links come up from grey to ink.

## 8. UI component library
- [x] Every control has hover (inside `hover:hover`), press (.97, 90 ms), focus-visible
- [x] Focus ring: 2px ink with a white halo (white with black halo in the black rooms)
- [x] The sheet traps focus and returns it to the tile; Esc closes
- [x] n/a: no inputs
- [x] Forks deleted: listed above

Done here: switches are `role="switch"`, ease-emphasis 300 ms (no overshoot); the dark room's quiet button is a light outline on black that fills light on hover (it was light text on its own white fill); runtime cards lift their render 6px and ink their kind on hover, and press to .98; the sheet footer's counter sits centred on its arrows; the sheet is `StorySheet` (a page-owned tween copy of v2/Unfold, not a native `<dialog>`: noted).

## 9. Motion and interaction
- [x] One signature, 3 supporting, 0 fade-ups (`variety.py` OK)
- [x] Kinds: state (tile → sheet, tabs, switches), pointer (the year under the hand, role tracks, tile peek), time (the frontier and its four ghost axes draw), arrival (h1 cut-in); scroll-linked: the pinned Zen scene (apple.com), count-up, figures' moment, commits landing
- [x] Something moves without input; every control answers
- [x] Reduced motion shows final states; no `setInterval`
- [x] n/a: sound is the shared kit's

Done here: signature = tile opens into its sheet (600 ms ease-in-out). The Zen of Hanzo pins for six steps (`AboutZen.jsx`, `useScroll`): the old principle leaves before the new one rises, a bar fills with the scroll, and a hover, key or click still picks any one (a click moves the scroll to its step). The curve draws once in 4 s; after it the first screen idles by CSS: the head's halo breathes (3.2 s) and a reader walks the curve 2014 → frontier every 9 s while no hand is on it (hidden while the pointer reads a year). Both pause off screen and never run under reduced motion. The switch hint breathes twice; the live dot is still.

## 10. Media
- [x] kit `Img` for portraits and model art, with sizes
- [x] n/a: no films playing (hover films removed)
- [x] Alt on every image (portraits named; decorative art `alt=""`)
- [x] No dimmed photo; Kai, Zen and Enso art shown together

Done here: 3 model artworks plus a Sigil plate for Hanzo Engine in one row; the founders' portraits are not in `public/authors` yet, so `app/about/page.jsx` asks for them only when the files exist (no 404s); no portrait exists anywhere in the repo (public, content, /team and /investors use the same missing `/authors/*` paths), so each founder is a 230px Sigil plate (contour field from their name, 26px initials) with the name, role, bio and links beside it, two cards side by side (no dead half-screen). The plate opens as a circle from its initials' corner as it scrolls in (CSS `view()` timeline), its hills lean toward a hand and darken under it. When a portrait ships, it loads over the Sigil.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Targets 44px (socials in a clean 2 × 2, commit links, github.com/hanzoai, and every text link on phones); every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: phone composition stacks the hero with the frontier cropped at true scale, with its year labels and three axis names set larger so they read at about 13px; the commit log runs repo and date on one line (149px / 130px columns, "Nov 6, 05:53 UTC" on one line), message under it; the black room's two tabs wrap onto two rows (nothing cut); the Zen scene shows its plate with a row of six numbers under it; the switches go two by two, tiles stack with the radar top right, the sheet rises from the bottom, the black room's tabs sit above the log; scrollWidth 375 at 375.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast: #0a0a0a and #525252 on white, #525252 on #f5f5f5, #a3a3a3 and white 78% on black
- [x] The hero's idle loops (halo breathe, curve reader) have a pause control (WCAG 2.2.2, MASTER part 12): a 44px quiet `StoryPause` button ("Pause", `aria-pressed`), first in the hero's DOM, tucked into the plot's lower right corner; it pauses both by class. They also pause off screen, and under reduced motion they never run and the button is hidden
- [x] n/a: no forms
- [x] One h1; h2 per section, h3 inside; names start with visible text
- [x] Keyboard reaches every control (tiles, sheet arrows, tabs, switches, Zen index); the role rows are no longer empty tab stops

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
- [x] Image failure: Sigil with initials (portraits), Sigil (Hanzo Engine)
- [x] n/a: no live data (commits are a build snapshot from Hanzo's page)
- [x] n/a: no submit
- [x] Reduced motion and JS off designed

Done here: without the portrait files the page is complete with Sigil portraits and no console errors from the page (the shared FooterHTML hydration warning is requested in `docs/requests/about.md`); JS off shows the frontier drawn at rest (a `noscript` rule stops the draw and the idle loops and hides the pause); reduced motion shows the curve drawn and figures at rest, with `document.getAnimations()` empty after 3.5 s.

## 18. Measurement and handover
- [x] `data-cta` on every primary; no analytics wired yet (needs `lib/track.js`)
- [x] Nothing identifier-bearing
- [x] `V2:` line in the page file's top comment
- [x] Review read: `docs/review/about.md` verdict 7/10, every fix applied, re-review pending

Done here: `docs/review/about.md` (7/10). Round 3: Zen pinned scene; founders always Sigil (never grey), names 26px; "Start Building" a text link; github link 44px; log shadow removed; role rows not focus stops; dark room rounded; hero peek; phone hero labels. Round 4 (review 6/10): hero visible in server HTML and moving from first paint; phone header quiet beside the hero ask; dark-room button legible with hover; section padding 80px max (was 116); runtime hover; counter aligned; reduced motion 0 running animations. Page is 12,088px at 1470 (the pinned scene's six steps are about 1,400px of it). Proof: `docs/gallery/about/v3-*`.
