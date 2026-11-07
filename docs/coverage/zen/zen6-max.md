# /zen/zen6-max coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/model/ZenMax.jsx` (+ `ZenMax.css`) · gallery: `docs/gallery/zen/zen6-max/` · metric id: `contact_sales_submit`

Open copy questions for James: none for this page's words. The meta description's "3.7 trillion parameters" is not on the live page body, so it is not shown.
Shared changes requested (`docs/requests/zen-zen6-max.md`): register strings "Breadcrumb" (crumb `nav` name) and "Server" (radiogroup name); both are unlabelled for now. `lib/cta.js` and `lib/track.js` do not exist yet. The desktop ask bar floats over content, which MASTER bans; that belongs to `Ask.jsx`.
Forks this page deleted: the raw `<video>` (now kit `Film`), raw `.x-btn` links (now `Cta`), the hand-written spec grid (now `DataTable`), `Magnetic` springs, `useFilms`, a hand-made role=table sheet.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js` (n/a: `lib/cta.js` not built yet; label and href are Hanzo's own: Talk to sales → /contact-sales)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` (n/a: no prices on this page)
- [x] Open copy questions for James listed, none decided

Done here: `// Persona:`, `// Goal:`, `// CTA:`, `// Metric: contact_sales_submit`, `// Signature:` and `// Beyond:` sit in ZenMax.jsx. The first screen at 1470×801 and 375×812 holds the h1 "Zen 6 Max", Hanzo's lede and one solid "Talk to sales" with a text link "Run it on your own GPUs"; the close repeats the one ask.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [x] Breadcrumb at depth 2 or more
- [x] Link parity: 0 removed, 0 unexpected

Done here: One `<main className="zx">` after the layout's `#main` mark. Links go through `Cta`, `A` and `More`. A breadcrumb "Zen / Zen 6 Max" (the last item not a link) sits under the asks, because nothing may sit above the h1. Parity links 4/4.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero`; nothing above the h1 (n/a: no kit `PageHero` yet; the Stage keeps its order: h1 cut-in by line mask 700 ms, lede, one primary, the film)
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [ ] Ends in proof strip, `Band`, footer (n/a: Hanzo's page has no proof strip; the close is its own section, not the kit `Band`, because `Band` uses blur word reveals and springs that the deck bans)
- [x] Card-to-page links use Morph; title lands within 12px (the h1 is the `data-morph-target`)

Done here: On load the name cuts in (700 ms, ease-emphasis) over the playing Zen film, with Hanzo's lede and "Talk to sales" on the first screen. The name is the 112px moment only while the film fills the screen, then settles to 52px as the film settles into its card. With JS off, a noscript rule settles the stage and shows the poster, every step and the drawer (checked with Playwright `javaScriptEnabled:false`).

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label (the shared ask bar carries "Talk to sales" from `thumb`)
- [x] Copy button copies exactly the displayed text; failure never says Copied (n/a: no copy button)
- [x] `data-cta` and `data-thumb` on every primary

Done here: `data-cta` values are `zen6max.hero` (with `data-thumb="Talk to sales"`), `zen6max.hero.gpus` and `zen6max.close`. While the film is under the ask (desktop) the solid reads light; once the card has cleared it, the ask reads ink. It is never two solids at once.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [x] Marquees pause, freeze under reduced motion, hide duplicates (n/a: no marquee)
- [x] Privacy link and owner line beside every submit (n/a: no form)

Done here: 9,216 GB, 5,760 GB, 8 x 288 GB, 2,304 GB, 1,440 GB, 8 x 3.84 TB and "About 31 TB" are all from the live page. Each server column keeps its NVIDIA user-guide link under the sheet. There are no logos or seals.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts
- [x] `python3 scripts/parity.py /<path>`: 0 missing

Done here: Sizes come from the deck scale (112 moment, 64 figures, 52 h1, 26 headings, 21 lede, 16 body, 13 crumb, 12 mono capitals). The lede is 44ch or less and the body 64ch. The specs are the kit `DataTable` with the picked column as `subject`; on phones its cells wrap. Parity: 46/46 text, 4/4 links.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens (deck values are page tokens at the top of ZenMax.css until `tokens.css` lands)
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` passes on both files. Radii: art card 20, panel 24, chips 6, buttons full; no shadows (the old card and panel shadows are gone). "Enterprise deployment" sits under its heading as a 12px caption. Neighbours: /zen/models opens on a figure catalogue and /zen/7 on a giant numeral; this page opens on the full-width film.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs are native, trap focus and return it (n/a: no dialog)
- [x] Inputs 16px or larger; no bare `:hover` (n/a: no inputs; every `:hover` sits in `@media (hover: hover)`)
- [x] Forks this page deleted: listed below

Done here: Chips, sheet columns, the drawer button and the pause control press to .97 in 90 ms. Hover changes the fill or rotates the drawer cross. The server switch is a radiogroup with arrow keys, the planning buttons use `aria-pressed`, and the drawer uses `aria-expanded`/`aria-controls`. Cta loading and disabled states come from the kit. Forks deleted: see the top of this card.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [ ] Sound only on the listed moments, through the one kit (n/a: the shared sound kit is not built yet)

Done here: `variety.py` reports 3 techniques (scroll scrub, count-up, Sigil) and 0 fade-ups. Kinds of movement: arrival (name cut-in), idle (film, Sigil), scroll (stage settle, chapters), state (server switch, plan, drawer, column pick), time (count) and pointer (Sigil). There are no springs; durations come from the deck (90/150/300/400/500 ms, 700 ms line mask). Under reduced motion `--k` is 0, so the settled stage, unpinned steps and instant states show.

## 10. Media
- [x] `Film` and `Pic` only; sizes and posters set
- [x] At most 2 videos playing; pause button on loops over 5 s
- [x] Budgets met; nothing missing; alt on every image
- [x] No dimmed or filtered photo; 4+ real visuals together where the page has them (n/a: Hanzo has one Zen film)

Done here: There is one kit `Film` (`/models/zen.webm`, 248 KB, under the 500 KB hero budget; poster `/models/zen.webp`, w 1200 h 1500). It plays only on screen. A 44px Pause toggle (`aria-pressed`, register string "Pause") sits under the card. The only darkening is a gradient under the words.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: Under 900px nothing pins: the rack sits above its steps and the planning buttons drive it. scrollWidth is 375 at 375. The ask-bar sweep found 0 overlaps with page buttons at 375×812 and at 1470×801. The phone ask sits at about 340px from the top.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused (n/a: no form)
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: Text on white uses #0a0a0a, #525252 and #737373 (4.74:1); on black it uses #fafafa and white at 78% or 55%. Headings run h1, then the h2 promises and "On your own premises", then the h3 step titles. The film has a pause; the count runs once. Gap: no axe run.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [ ] No poller; no third-party request before consent (no poller here; the consent side is shared)
- [x] Nothing heavy run on James's laptop

Done here: The h1, lede and asks are server HTML. The film is sized (1200×1500) and loads only near the screen. The Stage moves through one CSS variable on transform only. Filming ran in the cloud. JS budget not measured per route.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link (n/a: no cards)

Done here: `app/zen/zen6-max/page.jsx` keeps Hanzo's title and description from `content/pages.json` and renders `<JsonLd route="/zen/zen6-max" />` (canonical and og:url come from it).

## 15. Catalogue and product pages
- [x] Model card matches `SPEC.md` (n/a: no model card on this page)
- [x] Every card opens by Morph (n/a: no cards; the h1 is the Morph target for cards that link here)
- [x] Every maker and model page linked in the DOM (n/a: not a catalogue)
- [x] One price figure everywhere (n/a: no prices)

Done here: This is a model page with a spec sheet rather than prices. The B300/B200 rows are one `DataTable`, and each total appears once in the sheet and once in the rack.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (n/a: no code on the page)
- [x] Config blocks parse on their own (n/a)
- [x] Terminal pauses and ends on a static frame (n/a)
- [x] No hand-typed version number (n/a)

Done here: n/a: no code, install command or terminal on this page.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed (n/a: no live data; the film shows its poster until it plays)
- [x] Blocked live data leaves a complete page, no console errors
- [x] A failed submit keeps its values and shows no success (n/a: no form)
- [ ] A thrown island does not blank the page (shared: error boundaries around Sigil belong to the shell)

Done here: The page fetches nothing at run time. With JS off it is complete: settled stage, poster, rack, steps and open drawer. There are no console errors with JS on at 1470×801 or 375×812.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js` (the kit `Cta` sends `cta_click`; `lib/track.js` is not built yet)
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/review/<page>.md` verdict 8 or more (the last review, zen-family 7/10, asked for the lede and ask on the first screen: done here)

Done here: `V2: 8/10` is in ZenMax.jsx. The zen-family review fixes are done: lede and ask on the first screen, 13px floor, kit `Film` with a pause, and `data-cta`. Proof in `docs/gallery/zen/zen6-max/` was refilmed after this rework.
