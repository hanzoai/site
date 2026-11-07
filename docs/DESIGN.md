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
   `useInView` and stop when unseen.
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

## Done for a page
1. `curl -s -o /dev/null -w "%{http_code}" http://localhost:4180/<path>/` returns 200 (the dev server compiles on demand).
2. `python3 scripts/parity.py /<path>` reports 0 missing.
3. No console errors (the dev server log shows none for the route).
4. Reduced motion and 375 px considered in code.
