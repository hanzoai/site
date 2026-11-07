# /blog/* coverage (MASTER.md part 2, the 18 parts)

Family template `/blog/*` (3 members; checked `/blog/kai-decision-models`, `/blog/pareto-frontier`, `/blog/synthesis`). Page file: `components/pages/post/Post.jsx` (+ `postData.js`, `Frontier.jsx`, `Life.jsx`, `Post.css`) · gallery: `docs/gallery/blog/` · metric id: `cta_click blog-post.hero` (journey: `api_key_created`)

Open copy questions for James: none.
Shared changes requested (`docs/requests/<page>.md`): `docs/requests/families-b.md` (status board names `[slug]` families like their index pages; the desktop ask bar floats over content).
Forks this page deleted: its own code tabs and copy button (now kit `Tabs` + `CodeBlock`), its own film player (now kit `Film`), raw `<img>` (now kit `Img`), raw `.x-btn` on the Life board (now kit `Cta`), the closing big rows (now the kit `Band`), the spring on the reading spine, the per-post accent colours, the cursor labels ("Open", "Draw").

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from the post's own closing link (Story type: "the page's own closing link"; `lib/cta.js` n/a: per-post labels)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; n/a prices
- [x] Open copy questions for James listed, none decided

Done here: one solid `Cta` (`blog-post.hero`, the post's first closing link, e.g. "How to use Kai") on screen one, repeated once in the closing `Band`; the header's "Try Hanzo" turns outline while it shows, then carries the post's ask once the hero has gone (desktop, shared system; no floating pill). One solid at every width, from the first paint (the /affiliate pattern): `Post.css` draws the header's ask outlined on a post, and `useQuietHeader` turns it solid only while none of the post's own asks (hero, phone chapter bar, Band) is on screen or the hero has faded under the plate. On phones the post's ask rides inline in the 56px chapter bar (`blog-post.bar`), and the stage, body and end sections carry `data-ask-hide`, so the shared rising bar never floats over the text. Measured at 375x812 while reading: one solid ("Hanzo Gen" / "How to use Kai" in the bar), header outlined, no rising bar. Persona/Goal/CTA/Metric/Signature/Beyond are in `Post.jsx`'s top comment.

## 2. Information architecture and navigation
- [x] One `<main>`; skip link reaches `#main` (layout)
- [x] Every link through `A`; every card a real link
- [x] Breadcrumb at depth 2: Hanzo's own "Back to Blog" link sits first on the page
- [x] Link parity: 0 removed, 0 unexpected

Done here: breadcrumb `nav[aria-label=Breadcrumb]` "Back to Blog / <post chip>" sits in the meta line under the h1 (last item `aria-current="page"`, not a link), so nothing sits above the title; parity links 4/4, 8/8, 9/9; next-post cards are `<A>` links that open by Morph; chapters are anchored h2s reachable from the rail (desktop) and the reading-bar sheet (phone).

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] Hero (own `Stage`, no `PageHero` in the kit yet); nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof (sources, other posts), `Band`, footer
- [x] Card-to-page links use Morph; the card title carries `data-morph`, the h1 is `data-morph-target`

Done here: screen one is the 52px title cut in by word mask (700 ms, 55 ms apart, a CSS animation from first paint, so it does not wait for hydration; the film's poster drifts from first paint too), the post's ask, and its film (Kai, Enso) or Sigil playing in a card from the first second (critic 6/10 fix: "the picture only starts when I scroll"). The scene pins and the card opens to full bleed, then chapters, sources, next posts, `Band`. At 1470x801 the film card's top sits at 176px, playing (currentTime 2.1s to 4.2s over 2s, measured on both members); the Sigil post moves too. Nothing sits above the h1 (the breadcrumb is under it); on phones the h1 starts 68px under the header and about 280px of film is in the first screen. Mid-page stays one-in-one-out: every chapter that is only paragraphs gets one object drawn from its own words (`Gist.jsx`): Pareto 01 and Kai 01 a step track whose light walks through the chapter's own three steps, Pareto 03 count-up tiles "0.27 / ms p50" and "$0.021 / per million tokens", Kai 03 "Limits" 1,024 against 32,768 as bars at their true ratio. JS off: the cut-in plays as plain CSS, so the title always lands.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask: `data-thumb` on the hero ask feeds the shared ask bar
- [x] Copy button copies exactly the displayed text (kit `CodeBlock`)
- [x] `data-cta` and `data-thumb` on every primary

Done here: `data-cta="blog-post.hero"` + `data-thumb` on the hero ask; `blog-post.next-1/2` on the next-post cards; `blog-post.close-2/3` on the Band's text links.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy (plate figures from the post's own grid; GPQA dots with their own sentences and source links)
- [x] n/a: no marquee
- [x] n/a: no form

Done here: figures are Hanzo's strings byte for byte (e.g. "<1 ms", "$0.021", "32,768"); synthesis keeps its numbered sources; the GPQA chart keeps every dot's own sentence and "Source" link.

## 6. Content presentation (copy untouched)
- [x] No text under 13px except 12px mono capitals
- [x] Measures held: prose column 768px, paragraphs 66ch, lede 44ch; headings `balance`
- [x] Tabs and code use the kit parts (`Tabs`, `TabPanel`, `CodeBlock`); n/a tables, FAQ
- [x] `python3 scripts/parity.py`: 0 missing

Done here: parity text 110/110, 77/77, 45/45. Sizes are from the deck only: h1 52 (40 phone), h2 26, lede 21 (17 phone), body 16, figures 64 (Air 220), captions 12–14.

## 7. Visual design system
- [x] `python3 scripts/taste.py` passes; greys only (room tokens)
- [x] No label, tag, badge or pill above a headline (chapter numbers sit beside their h2; post meta under the h1; card meta under the card title)
- [x] Radii 24 (plate card), 20 (art cards), 16 (readout), 6 (chips)
- [x] One icon set (inline 16px strokes); no icon in a box
- [x] Differs from neighbours: hero medium is the post's own film in a card that opens to a black room

Done here: neighbours differ by their own data: a post whose plate holds figures (Kai) mirrors the scene (film card left, title right, figures counted up by the scroll as the plate opens, reading rail on the right); a post whose plate names products (Pareto) keeps card right, rail left; a post without a film (synthesis) shows its Sigil and the Life board. Synthesis "AI for AI" parts are asymmetric: Zen leads large with its film, the other five follow as a list with small marks (film stills or Sigils). `taste.py` OK on all 6 files; code samples are greys only (kit `CodeBlock`: ink lines, comments dimmed), no syntax hues; one black room (the plate) plus the closing `Band`, not back to back; colour only from Hanzo's model films.

## 8. UI component library
- [x] Every control has hover (inside `@media (hover:hover)`), press (scale .97, 90 ms), focus-visible
- [x] Focus ring is the shared one
- [x] n/a: no dialog (the phone contents sheet is an inline disclosure with `aria-expanded`)
- [x] n/a: no inputs; no bare `:hover`
- [x] Forks this page deleted: listed above

Done here: the back link drops 1px on press, next-post cards press to .98 and underline their title on hover; rail knots, reading bar, chips, Life controls (kit `Cta`), next cards and the pause button all scale on press; hover changes position or fill, never only opacity.

## 9. Motion and interaction
- [x] One signature (the reading thread), 3 supporting (pinned card-to-full-bleed scene, title cut-in, Sigil/film idle); 0 fade-ups
- [x] Kinds: idle (film, Sigil, GPQA readout walk, Life glider), pointer (Sigil bends), time (title cut-in), state (numeral hand-over, tabs), scroll (scene, spine); scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state (stacked layout, no pin); no `setInterval` (Life and the GPQA walk run on rAF clocks)
- [x] n/a: sound belongs to the shared kit

Done here: `variety.py` OK (sigil, scroll scrub, clip reveal); the chapter numeral is read on every scroll (heading above 60% of the screen; the last chapter once finished), so it never lags at "02 / 03 · Finished"; the closing Band headline is balanced (no one-word last line at 1470); no springs (the spine follows scroll directly; tab pill is the kit's); figures arrive at 84px and settle to 64px as the plate opens.

## 10. Media
- [x] `Film` and `Img` from the kit only; sizes and posters set (1200×1500)
- [x] At most 2 videos playing (plate, or the 3 part films only while in view); pause button on the plate film
- [x] Alt: films are decorative (`aria-hidden`), card images `alt=""` beside their titles
- [x] No dimmed photo; synthesis shows Zen, Enso and Kai films together

Done here: films are Hanzo's own `/models/*.webm` with `.webp` posters, played by the kit `Film` (IntersectionObserver, Save-Data, reduced motion); the plate has a 44px pause control.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap (checked by screenshot)
- [x] No horizontal scroll (scrollWidth 375)
- [x] Every target 44px or more; hovers have tap paths
- [x] Primary ask above the fold at 375 (title, meta, lede, ask, then 45svh of film)

Done here: under 900px the scene stacks (no pin): title 40px, breadcrumb and meta, lede 17px, the ask, then the plate with its film at 45svh; the rail becomes a sticky reading bar with a contents sheet; at 700px and under the bar carries the post's ask on its right and the minutes left move into the sheet.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Text uses room ink and room soft (#6e6e73 on white, 4.9:1); white 55–78% on black
- [x] Pause control on the plate film (first in the plate's DOM); Life has Pause; GPQA walk stops on hover/focus
- [x] n/a: no forms
- [x] One h1; h2 per chapter; names start with visible text
- [x] Keyboard reaches every control (tabs with arrows, Life board with arrows, chart dots focusable)

Done here: the h1 keeps a screen-reader copy (`x-sr`) while words animate; the current chapter has `aria-current`; the reading bar has `aria-expanded`/`aria-controls`.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] Every image and video sized; films load only near the screen
- [x] No poller (rAF clocks that stop off screen); no third-party request
- [x] Nothing heavy run on James's laptop (filmed in the cloud)

Done here: scroll maps are function transforms on the main thread; Frontier coordinates are rounded so server and client match (no hydration warning); layout shift ≤ 0.03 per the critic.

## 14. SEO and machine files
- [x] Title and description from `content/pages.json`
- [x] Canonical and OG via `<JsonLd route="/blog/<slug>" />`
- [x] JSON-LD unchanged
- [x] Every card is a real link

Done here: `app/blog/[slug]/page.jsx` `generateMetadata` reads `meta(slug)`; `generateStaticParams` covers all 3 posts.

## 15. Catalogue and product pages
- [ ] n/a: not a catalogue or model page
- [x] Every next-post card opens by Morph
- [ ] n/a: no maker or model list
- [ ] n/a: no prices

Done here: n/a for catalogue rules; the next-post cards use Morph (`data-morph` title into the next post's `data-morph-target` h1).

## 16. Developer experience
- [x] Kit `CodeBlock`; copy equals display
- [ ] n/a: no config blocks
- [ ] n/a: no terminal
- [x] No hand-typed version number (code is the post's own)

Done here: in greys only, the Kai post's TypeScript/Python sample sits in kit `Tabs` with a `CodeBlock` per language; the Gen post's shell sample is one `CodeBlock`.

## 17. States and resilience
- [x] Loading: posters hold the film boxes; empty/error n/a (static content)
- [x] n/a: no live data
- [x] n/a: no forms
- [x] A thrown island (Sigil, film) leaves the article standing

Done here: reduced motion, JS off and phones get the stacked layout with every word; a missing film falls back to its poster.

## 18. Measurement and handover
- [x] `data-cta` on every primary (events go through the kit `Cta`)
- [x] Nothing before consent (no tracker of our own)
- [x] `V2:` line and this card

Done here: `V2: 8/10` line in `Post.jsx`; proof in `docs/gallery/blog/v3-post-*` (desktop at 250 ms and settled, desktop gist, phone first screen, phone Limits bars, phone code, desktop walk webm); the intermittent footer hydration warning is shared (`docs/requests/blog-family.md`); events: `cta_click` with `blog-post.hero`, `blog-post.next-n`, `blog-post.close-n`.
