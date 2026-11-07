# /customers/* coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/story/Story.jsx` (+ `Story.css`, `storyData.js`; route `app/customers/[slug]/page.jsx`) · gallery: `docs/gallery/customers-family/` (earlier stills in `docs/gallery/customers/`) · metric id: `contact_sales_submit` (journey level). Members checked: `/customers/damon-motorcycles`, `/customers/kanoa`.

Open copy questions for James: (1) the primary ask on a case page is Hanzo's own "The original case study (PDF)", which sends a buyer to a PDF rather than to Hanzo; kept as the ask (Story type: the page's own closing link). (2) Years beside customer figures: Hanzo's header line gives one year per case ("2015", "2020"), shown under the name, not beside each figure.
Shared changes requested (`docs/requests/customers.md`): the media mirror into `public/` (the covers and frames are hanzo.ai-only).
Forks this page deleted: raw `<img>` (now kit `Img` inside a local plate), raw `.x-btn` asks (now kit `Cta`), the kit `Flap` scramble on figures (it drew invented in-between numbers), the floating reel counter over the scenes, hover captions laid over the frames.

Decision (count-ups): a count from 0 would show numbers that aren't Hanzo's (JAMES.md: every number traces to Hanzo's copy), so each figure arrives by its own characters rising into place (500ms ease-emphasis, 60ms apart, no overshoot). That arrival is kept, not removed. Sampled every 100ms during arrival on both members: only Hanzo's values were ever in the DOM.

Rule clashes noted (higher rule taken): the hero is a black room that, per part 7, enters as a rounded card inside the gutters and opens to full width; it sits at the top, so it opens on arrival rather than on scroll.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` (n/a: no prices)
- [x] Open copy questions for James listed, none decided

Done here: Story.jsx lines 17–22 carry Signature, Beyond, Persona, Goal, CTA and Metric. The one solid fill is Hanzo's "The original case study (PDF)": in the stage and again at the close, never both in one viewport. `lib/cta.js` does not exist yet, so the label and href come straight from the case's own closing links in `content/pages`. One h1 (the launch name).

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [x] Breadcrumb at depth 2 or more
- [x] Link parity: 0 removed, 0 unexpected

Done here: one `<main class="xst">`; the shell's skip link targets it. Every link is the kit `A` or `Cta`. The breadcrumb is Hanzo's "← Customers" then the case name (`aria-current="page"`, not a link). The next-launch card is a real `<a>` to the sibling. Link parity 2/2 on both members.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero`; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer (Story type: the page's own closing link)
- [x] Card-to-page links use Morph; title lands within 12px

Done here: the first screen is the black room opening (800ms) with the name cutting in by line mask (700ms, ease-emphasis, 200ms delay) and the Sigil drifting. h1 baseline at about 38% (desktop: h1 box 240–334px at 1470×801). Above the h1 there is only the breadcrumb; the year and kind sit under it. No kit `PageHero` exists yet, so the hero is page-local and follows its spec. When the launch's picture cannot load (every run here; hanzo.ai is blocked), the room is not left as a bare contour. A graphite ledger plate (#262626, radius 20) holds the launch's own figures: the first at 64px Air with its label, the rest as hairline rows. It wipes open (500ms) and its characters rise. It sits at x 919–1311, y 379–701 at 1470×801, clear of the h1 (240–334) and the ask (405–457). At 375×812 it sits at y 132–387, above the h1 (496) and the ask (660–712). It is `aria-hidden`, because the figures section below is the readable copy. With JS off, a `<noscript>` style plus `.js`-scoped CSS shows every word (checked with Playwright `javaScriptEnabled:false`). The sections run black room, paper, quiet room, 100svh scenes, paper wall, paper close. It ends on Hanzo's own closing links and the next case; per the Story type there is no Band. The next-launch picture carries `data-morph` into the sibling's `data-morph-target` stage.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text (n/a: nothing to copy)
- [x] `data-cta` and `data-thumb` on every primary

Done here: `<Cta id="customers.hero" thumb size="lg">` in the stage and `<Cta id="customers.close">` at the close. The shared ask bar carries "The original case study (PDF)" after the stage, and it yields while a page solid is in view. `data-cta` is `customers.hero` and `customers.close`; `data-thumb` is on the hero ask.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [x] Marquees pause, freeze under reduced motion, hide duplicates (n/a: no marquee)
- [x] Privacy link and owner line beside every submit (n/a: no form)

Done here: there are no logos or seals. Each figure is a button that travels to the sentence stating it and marks it, or a link to Hanzo's PDF when the page never states it (`storyData.js` `figures[].from`). Figures are drawn only as Hanzo prints them. Sampling during the reveal showed only "$8.4M", "541:1", "60,384", "+3,752%", "$7M+", "45,000", "150,000" and "$1.50". Labels sit under each figure.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts (n/a: none on the page)
- [x] `python3 scripts/parity.py /<path>`: 0 missing

Done here: deck sizes only: h1 84 settling to 52 (phone 44), h2 26, scene h3 32 (phone 26; the picture-less last chapter 52 / phone 44), lede 21 (phone 17), body 16, figure labels 14, captions 13, mono capitals 12. Measures: lede 44ch, body 62ch, and headings use `text-wrap: balance`. Parity: Damon 37/37 text and 2/2 links; KANOA 26/26 and 2/2.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` OK on Story.jsx and Story.css. The colours are the deck's neutrals, declared once as page tokens on `.xst`; there is no shared `tokens.css` yet. Nothing sits above any headline (the scene numbers "02 / 06" sit under the text). Radii: art 20, buttons full. There are no shadows; tiles are flat fills. Icons are a single arrow glyph. Hero medium is the launch photograph in a black room, unlike the blog's reading room or /agents' console.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs are native, trap focus and return it (n/a: no dialog)
- [x] Inputs 16px or larger; no bare `:hover` (n/a inputs: none)
- [x] Forks this page deleted: listed below

Done here: figure buttons have a hover rule line and arrow nudge, press scale .97 (90ms), a focus-visible rule line and a disabled state. The breadcrumb, "Every launch →" and the next card each have hover, press and focus states, and the asks use the kit `Cta` states. Every `:hover` is inside `@media (hover: hover)`. Forks deleted: see the top of this card.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit (n/a: no sound kit merged yet)

Done here: the signature is the scenes wiping up (scroll-scrubbed clip-path). Supporting: the Sigil and the frame wipe on arrival; `variety.py` counts 3 techniques and 0 fade-ups. Kinds of motion: arrival (room opens, name cuts in), idle (Sigil drift), pointer (Sigil leans, hovers), state (figure press travels and marks; figures rise once), and scroll (name settles 84→52, scenes). Durations are deck tokens (90/150/300/400/500ms; scene moves 700–800ms), with ease-emphasis and no springs. Under reduced motion nothing is bound to scroll. The hero contour gets `still={calm}` from `useCalm`, so its rAF loop stops (one frame), even when the setting is switched on later. The cover opens with no clip animation. `getAnimations()` shows 0 running after 3s on both members at 1470 and 375 (Playwright `reducedMotion: 'reduce'`).

## 10. Media
- [x] `Film` and `Pic` only; sizes and posters set
- [x] At most 2 videos playing; pause button on loops over 5 s (n/a: no video)
- [x] Budgets met; nothing missing; alt on every image
- [x] No dimmed or filtered photo; 4+ real visuals together where the page has them

Done here: measured in the DOM, 14/14 images on Damon and 7/7 on KANOA carry width and height attributes. Every picture is kit `Img` with width and height (hero 1920×1080 with `priority`, scenes and tiles 1200×1500, report 1600×1000, next 1600×900) inside a box reserved in CSS. Alt comes from Hanzo's own captions. The only dimming is a left gradient under the stage text. Damon's wall shows 6 frames. Gap: the pictures are not in the repository and hanzo.ai is blocked in this sandbox, so here every frame shows its silver caption plate. The dev server falls back to hanzo.ai for missing files, so they should load on an online localhost.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: walked at both sizes. At 375×812 the h1 is at 496–590px and the ask at 660–712px. At 375×667 the stage is 551px tall (100svh − 60 − 56) with the ask inside it. Scenes stack under 900px, and each picture wipes open on arrival. There is no sideways scroll, and the crumb, links, figures and next card are 44px or more. No hover-only information: captions sit under frames.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item (n/a: the only idle mover is the Sigil, which freezes under reduced motion)
- [x] Forms labelled; first error focused (n/a: no form)
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: text uses #0a0a0a, #262626 or #525252 on white, with #737373 captions only on white (4.74:1; switched to #525252 in quiet-room scenes). On black it uses #fafafa, white 78% and white 55%. Headings run h1 → h2 → h3. Figure buttons carry `aria-pressed`; PDF figures are links whose accessible name starts with the figure. Plates are `aria-hidden`.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: the h1 and the cover `<img fetchpriority="high">` are in the server HTML from `generateStaticParams`. The scenes run on motion values (no React state per frame). The page's own code is one client file. There is no poller, interval or third party. All filming and checks ran in the cloud. Gap: no Lighthouse or bundle measurement done for this template.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: `generateMetadata` reads title and description unedited from `content/pages.json`. `<JsonLd route="/customers/<slug>">` provides canonical, og:url and schema.org. The next-launch card is an `<a href>`.

## 15. Catalogue and product pages
- [x] Model card matches `SPEC.md` (n/a: not a catalogue or model page)
- [x] Every card opens by Morph (the one card, the next launch, does)
- [x] Every maker and model page linked in the DOM (n/a)
- [x] One price figure everywhere (n/a: no prices)

Done here: n/a: a story page. The one card (the next launch) opens by Morph from its picture into the sibling's stage.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (n/a: no code on the page)
- [x] Config blocks parse on their own (n/a)
- [x] Terminal pauses and ends on a static frame (n/a)
- [x] No hand-typed version number (n/a)

Done here: n/a: no code, terminal or version on a customer story.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed
- [x] Blocked live data leaves a complete page, no console errors
- [x] A failed submit keeps its values and shows no success (n/a: no form)
- [x] A thrown island does not blank the page

Done here: a picture that fails (including one that failed before hydration) hides and leaves Hanzo's caption on a silver plate. With no cover, the stage lets the Sigil fill the room and shows the caption. Boxes are reserved, so loading never shifts layout. The page is fully static from `content/pages`, with no live data. With hanzo.ai blocked there were 0 console errors at both sizes. Islands such as Sigil sit under the shell's error boundary (`app/error.jsx`).

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js`
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [x] Review read: `docs/review/<page>.md` verdict 8 or more (pending re-review)

Done here: `data-cta="customers.hero"` and `"customers.close"`, sent as `cta_click` by the kit `Cta`; `lib/track.js` does not exist yet. There are no identifiers and no forms. The `V2:` line is in Story.jsx. `docs/review/customers-family.md` (6/10 at 6d77b65) was read, and its four fixes are done:
- only Hanzo's figures (no scramble, no overshoot);
- sized images (14/14 and 7/7);
- the contour stops under reduced motion (0 running animations);
- `data-cta` is in the DOM (`customers.hero`, `customers.close`).

The fallback hero now holds the figure ledger, so it is not left empty. A re-review is pending.
