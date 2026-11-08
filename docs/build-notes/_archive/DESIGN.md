# How a page is rebuilt

Read this before touching any page. It is the brief every page is built to, and the standard every page is checked against.

## What we are making
Every page of hanzo.ai, rebuilt. Hanzo's header, footer, logos, wording, numbers and links stay exactly theirs.
What changes is the experience: each page gets a layout made for its content and **one standout interaction of its own**.
The reference James loves is synchronized.studio (a card you click opens into its page); also osply.co, hamol.studio, grubogrubo.com.
James rejected: static pages, "scroll fade-ins only", walls of cards, everything dark, the same trick twice, anything that loses a feature of the live site.

## Non-negotiables
1. **Nothing lost.** Every sentence, number, link, list item, table row, FAQ, code sample and media of the old page appears on the new one
   (`python3 scripts/parity.py /path` must report 0 missing). Every interactive thing the live page has (tabs, hovers, tooltips, toggles,
   calculators, copy buttons) is kept and made better. Check the live page (https://hanzo.ai/path) when the outline looks thin:
   some parts are drawn in the browser and are not in `content/pages/`.
2. **Hanzo's words only.** Copy comes from `content/outline/<path>.json` and `content/pages/<path>.html`. No invented claims, prices or
   figures. Short UI labels are fine ("Replay", "Copy", "Close").
3. **Unique.** Each top-level page has its own layout and signature moment. Check `docs/PAGES.md` (column *Signature*) and do not reuse one.
   Page families share one template per family, with each member's own content and visual.
4. **Moves without hover.** Something on screen is alive when the page is idle (a demo running, a film, a counter, a sweep), plus real
   hover/press detail. Never "only animates on hover".
5. **Fast.** 50+ fps on an 8 GB MacBook Air. Transform and opacity only. No `backdrop-filter` on repeated elements, no permanent
   `will-change`, no infinite animations inside 3D-transformed layers, no blur on large panels, typing writes to text nodes via refs (not
   React state per character). Sections pause their CSS animations off screen automatically (`[data-off]`); JS loops must check
   `useInView` and stop when unseen. Hover nudges move children with `transform`; never animate padding, margin, width or height.
6. **Accessible and calm-safe.** Real buttons and links, visible focus, keyboard for every control, `aria-*` on tabs/toggles/accordions.
   `prefers-reduced-motion`: final states shown, no autoplay loops. `MotionConfig reducedMotion="user"` is already global.
7. **Phones are first-class.** Every layout works at 375 px: no sideways scroll, nothing cut off, tap replaces hover.

## The look
- White page, ink `#0a0a0a`, soft `#6e6e73`, faint `#86868b`, hairlines `rgba(0,0,0,.08)`, cards `#f5f5f7`. Black cards on white as the
  contrast. At most **one dark room** per page (`data-room="dark"` on the section turns the header dark over it).
- Type: Zen (variable) for text, Zen Mono for kickers, code and figures. Headings weight 560, tight tracking (-.035 to -.05em).
- Generous air: sections `x-sec` (96–168 px padding), wrap `x-wrap` (1200 px).
- Easing: `EASE = [0.16, 1, 0.3, 1]` for arrivals; springs for anything the hand moves; `(.76,0,.24,1)` for the open transition.

## The kit (reuse before writing)
- `components/ui.jsx`: `Words` (heading word reveal), `Rise` (fade-up once), `Count` (number counts up, tabular), `useTilt` (spring tilt +
  pointer light), `Magnetic`, `Btn`, `Arrow`, `Copy` (copy with drawn tick), `Mark` (Hanzo mark), `EASE`, `mod`, `fine`.
- `components/kit.jsx`: `A` (link that stays in-site via `lib/route.js`), `Go` (button link), `More` (arrow link), `SecHead`
  (kicker + title + lede), `Faq`, `Flap` (split-flap figure), `Tick` (self-drawing check), `Band` (closing dark band, one action).
- `components/Opener.jsx`: `useOpener().open(e, { el, src, href, key })` lifts a card's image into the next page (WebGL); the target page
  needs a hero with `data-hero={key}` + `data-ready` once its image is decoded (see `ModelPage.jsx`). Use it wherever a card leads to a
  page with a strong image.
- Home sections (`components/Hero.jsx`, `Platform.jsx` coverflow, `Agents.jsx` dock + stepper, `Race.jsx` true-speed race, `Cheaper.jsx`
  slider, `Pareto.jsx` budget line, `Open.jsx` calendar + rail, `Pricing.jsx` rolling prices) are references for quality and patterns.
- `components/pages/Enterprise.jsx` is the reference rebuilt page: read it first.
- Links: always `A`/`Go`/`More` or `href()` from `lib/route.js`, so pages this site has stay in-site and Hanzo's app (chat, pay, signup)
  goes to hanzo.ai.

## Files for a page
- `components/pages/<Name>.jsx` — `'use client'`, the page. Class names carry a short page prefix (e.g. `xa-` for About).
- `components/pages/<Name>.css` — the page's styles, imported at the top of `<Name>.jsx` (`import './<Name>.css';`), with its own
  `@media (max-width: 900px)` rules. Do not edit `app/globals.css` (shared; other pages are being built at the same time).
- `app/<path>/page.jsx` — server file: `export const metadata` (title and description from `content/pages.json`), render
  `<JsonLd route="/<path>" />` (from `components/JsonLd`) and the page. A folder in `app/` is all it takes: the catch-all route
  steps aside for it automatically. Families: `app/<family>/[slug]/page.jsx` with `generateStaticParams` over its members.
- All content is in the HTML: anything revealed by an interaction (FAQ answers, inactive tabs, other slides) is rendered collapsed
  or hidden, never left out (`Faq` in the kit already does this). `Count` and `Flap` render the real figure on the server.
- Do not edit `lib/route.js`, `docs/PAGES.md` or other pages' files; report what you built and its signature instead.

## Forms and live features keep working
Hanzo's forms post to its API; the rebuilt form must send the same request. `content/forms.json` (from `node scripts/forms.mjs /path`)
records each form's fields and the request it sends (sales leads: POST https://api.hanzo.ai/v1/marketing/leads; newsletter:
POST https://api.hanzo.ai/v1/marketing/subscribe; the live chat on /chat and /features: POST https://api.hanzo.ai/v1/chat/public).
Never submit a real form while building or testing: test with request interception that blocks the send (as forms.mjs does).

## Done for a page
1. `curl -s -o /dev/null -w "%{http_code}" http://localhost:4180/<path>/` returns 200 (the dev server compiles on demand).
2. `python3 scripts/parity.py /<path>` reports 0 missing.
3. No console errors (the dev server log shows none for the route).
4. Reduced motion and 375 px considered in code.

## The elite bar (top 1%, James 7 Nov)
James wants to wake up and be wowed on desktop AND phone. A page is not done because it passes parity; it is done when it would sit on Godly/Awwwards next to synchronized.studio. Check every page against this list, from its screenshots:
1. **First screen sells in five seconds.** One idea, huge confident type, one live object that is already moving (no hover needed). Nothing on the first screen is a generic card grid or a centered heading over three equal boxes.
2. **One signature moment per page** that nobody else's page has: something you click and it opens, a live demo that runs itself, a scrubbed story. Name it in the file's top comment.
3. **Rhythm.** Sections alternate density and scale (full-bleed → tight text → wide data → dark room). Never three sections in a row with the same layout.
4. **Type hierarchy.** At most three sizes per section; numbers in tabular figures; long text at 60–72ch; nothing smaller than 13px on desktop or 14px on phone.
5. **Motion with intent.** Springs or EASE [0.16,1,0.3,1]; 200–600 ms for UI, longer only for scene moves; stagger 30–60 ms; enter from where the thing comes from; exits faster than entrances. Hover gives real detail (a number, a preview, a tooltip), never just a colour change.
6. **Phone is designed, not shrunk.** Every hover detail has a tap equivalent; tap targets ≥ 44px; pinned/horizontal scenes become simple vertical or swipe rails; no text under 14px; the signature moment still works by tap or scroll.
7. **States.** Loading, empty, error and reduced-motion each look intentional.
8. **Craft details.** Optical alignment of icons, consistent radii from the kit, 1px hairlines, no orphan words in headlines (`text-wrap: balance`), no layout shift when fonts or images load.
9. **Beyond Hanzo.** One feature hanzo.ai does not have that helps the visitor decide, built only from Hanzo's own facts. Name it `Beyond:` in the file's top comment, beside `Signature:`. See docs/NEXT-LEVEL.md for the site-wide layers your page should use (morph navigation, Sigil, phone thumb bar and swipe, cursor labels).
10. **Unique.** No two pages share a signature, a beyond feature or a first-screen layout. Family pages differ through their own data and Sigil seed. `python3 scripts/unique.py` must pass.

## Motion: varied and restrained (James, 7 Nov: "don't overdo the same motion features, use different, unique ones… don't overdo it all")
On 7 Nov, 69 of 98 pages used the same fade-up and 57 overdid motion. That stops now.
1. **One signature motion per page, plus at most three supporting techniques.** Everything else sits still and reads well. Only the signature object moves while the page is idle.
2. **Fade-up (`Rise`) at most twice per page.** Never section after section. A section that just appears is fine.
3. **Reach for the least-used techniques first.** `python3 scripts/variety.py` prints site-wide use. On 7 Nov the least used were magnetic, split-flap, drag/inertia rails, canvas fields, word reveal, spring follow, scroll scrub, tilt and count-up. Techniques the site has not used yet are welcome too, if they suit the content: clip-path wipes, sticky stacked sheets, variable-font weight scrubbing, number scramble, cursor-following light, marquee rails, physics stacks, staggered grid ripples, scrubbed video, SVG morphs and FLIP shuffles.
4. **Neighbours differ.** Pages in the same menu or family do not share a signature technique.
5. **Restraint.** One moving thing per screen. No hover wiggle on every card. Entrances play once. Motion explains or rewards and never decorates.
6. **Checked.** `python3 scripts/unique.py` runs `scripts/variety.py` on every page file touched since 7 Nov 06:00, and it fails a page with more than 2 fade-ups or more than 4 techniques. Untouched pages are fixed as the polish chats reach them.

## No filming on this laptop (James, 7 Nov 12:30: the videos made the 8 GB Air unusable)
`scripts/motion.mjs` and `scripts/phone.mjs` run a headless Chrome and video encoding, and they made the Mac crawl. Do not run them, or any other browser script, unless James asks for that one page. Prove a page with `curl` (200), `python3 scripts/parity.py`, `python3 scripts/unique.py` (which includes the motion variety check) and the dev-server log. James judges the motion himself in his own Chrome. One chat at a time.

## How to look at a page (no visible browser overnight; suspended, see "No filming on this laptop")
- **Motion is the product, so judge it moving (James, 7 Nov: stills are not good enough).** `node scripts/motion.mjs /your-page` films a person using the page at desktop and phone. It wheel-scrolls, dwells on each screen, hovers controls on desktop and taps tabs and toggles on phones. Results:
  - `shots/<page>/d.webm` and `p.webm`, plus film-strip sheets `d-sheet-NN.jpg` and `p-sheet-NN.jpg`, 3 frames a second, read left to right.
  - A report in the console and in `shots/motion-report.txt`:
    - STILL: a screen where nothing moves without input.
    - DEAD hover/tap: a control that gives no response.
    - Scroll long frames and layout shift.
  - Read every sheet and judge the motion itself:
    - Does the first screen come alive within a second?
    - Do entrances come from where things live?
    - Does the signature moment play?
    - Is anything janky, sudden or too slow?
  - Fix every STILL screen, DEAD control and layout shift over 0.05, then film again. `shots.mjs` stills are only for a quick layout check.
- `node scripts/phone.mjs /your-page` for the sideways-scroll and console-error check.
- Browser scripts queue themselves (one at a time on this 8 GB Mac). Never open the Chrome extension or the browser pane, never run `next build`, never start another dev server: the conductor runs those.
