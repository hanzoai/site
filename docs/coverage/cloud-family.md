# Coverage: /cloud/* (42 pages; components/pages/cloudfam/CloudProduct.jsx, cloudfam.css, cloudData.js; app/cloud/[slug]/page.jsx)

Shared parts used: `components/v2/StageSettle` (owned by this chat), the kit's `A`, `Band` and `Copy`, `ui`'s `Magnetic` and `Mark`, `Sigil`, and the site's ask bar (`components/Ask.jsx`, through `data-thumb`). The family's pages differ through their own console (services, a conversation or a CLI session), their own Sigil (seeded by the slug and the product's own figures) and their own words. They never differ by colour.

- **2.1 Strategy and conversion:**
  - The file header holds Persona (Developer and enterprise buyer), Goal (`contact_sales_submit`, through "Talk to us"; /cloud/local: "Run it locally") and CTA.
  - One solid button per screen: the hero's first action (solid, `data-thumb`, `data-cta="cloud.hero"`, magnetic), the site's ask bar after the hero, and the closing Band. "Source" is always an outline or a text link.
  - Gap: there is no `lib/cta.js` yet.
- **2.2 Information architecture and navigation:**
  - The breadcrumb ("Cloud / Compute") now sits under the h1, beside the lede.
  - The console's sidebar is the product's family as real links. The spec sheet repeats the family as pills, with the current page marked `aria-current`.
  - Related capabilities are three cards that open into their page.
- **2.3 First impression and page narrative:**
  - The h1 (the product name at display size) comes first, with no pill or eyebrow above it.
  - The lede, the ask and the status line sit beside it on the right.
  - The product's console is the hero object on a stage. It is tipped back like a lid and settles flat as you scroll, while its session types and plays.
  - Order: hero, Paste and ship, What it is (the 11 products that have it), the genesis line, the spec sheet, the Google Cloud finder (dark room), Related, Band.
  - Gap: the kit has no `PageHero` yet. The Band is the kit's.
- **2.4 Conversion system:**
  - "Paste and ship": the prompt is set as large type, with one Copy button that copies exactly the prompt.
  - The Band carries the product's live endpoint (`api.hanzo.ai/v1/…`) as its object, plus the secondary action as a text link.
- **2.5 Trust and proof:**
  - Only Hanzo's facts: the API path, the Google Cloud counterpart, the badges ("Open source", "On-chain settlement"), and /cloud/local's 0.30s, 7s and "No Docker", each with its own line.
- **2.6 Content presentation (copy untouched):**
  - Parity: 0 missing on all 42 pages (for example GPUs 45/45 text and 13/13 links, Local 27/27 and 2/2).
  - The h1 size follows the name's length: three steps from 176 down to 100 px, line height .9.
  - Measured floors: no visible text under 13 px on desktop or under 14 px at 375 px.
- **2.7 Visual design system:**
  - 0 UI hues. The v2 per-product oklch accent is deleted.
  - Status shows by shape: Generally available is a filled dot, Beta a half dot, and a family name a ring. In the console, Ready is a filled dot and Building a turning ring.
  - The spec card uses the silver sheen from `system.css`, and Hanzo's mark is in silver.
  - One dark middle room (the finder) plus the dark closing Band.
- **2.8 UI component library:**
  - The kit's `Band` and `Copy` are used.
  - Hovers sit in `@media (hover: hover)`.
  - Presses: rows `scale(.99)`, cards `translateY(-2px) scale(.98)`, pills `scale(.98)`, links `translateY(1px)`.
  - The console and the boot terminal have a pause control (an icon with `aria-label` Pause or Play).
  - Gap: the hero asks are raw `<a class="x-btn">`, because the kit's `Go` cannot carry `data-thumb`.
- **2.9 Motion and interaction:**
  - Signature: the session runs in the console.
  - The other kinds of motion, so scroll is 1 of 5:
    - Scroll: the stage settles.
    - Time: the prompt types, the services walk (or turns arrive, or lines print), the request travels from skill.md to the endpoint, and the genesis line grows bold once as you reach it.
    - Pointer: the magnetic ask, the Sigil fields lean to the pointer, related cards lift and their field grows, and the finder holds under the pointer.
    - State: the lit service glides (layoutId), and the finder re-flows as you type.
  - `variety.py` passes: 4 techniques (typing, layoutId, Sigil, magnetic) and 0 fade-ups.
  - Reduced motion: the stage is flat, every session line shows, the genesis line is at full weight, and the wires and pulses stop.
- **2.10 Media:**
  - No product film exists. The objects are the product's own console (real Hanzo product UI with its example project), the prompt's route, the product's Sigil, Hanzo's mark, the spec card and the related cards' Sigils.
- **2.11 Mobile and responsive:**
  - At 375×812 there is no sideways scroll.
  - The console's sidebar becomes a swipeable row of 44 px tabs, and the route runs vertically.
  - The finder becomes a single column of rows, and the site's thumb bar carries the ask.
  - No tap target is under 44 px (measured). CLS is 0.043 or less on phone and 0 on desktop.
- **2.12 Accessibility (WCAG 2.2 AA):**
  - One h1.
  - Autoplay sessions have pause controls (2.2.2).
  - The finder's results count is announced politely.
  - The art is `aria-hidden`.
  - Gap: no axe or screen-reader run has been done.
- **2.13 Performance and engineering:**
  - The stage settle is one transform. Typing writes to a text node, not React state.
  - Sessions run only while on screen, and the related cards' Sigils are still frames.
  - Not measured: LCP and INP.
- **2.14 SEO and machine files:**
  - Titles and descriptions come from `content/pages.json` unchanged, and every word is in the server HTML.
- **2.15 Catalogue and product pages:**
  - The PLAN 2.15 cloud anatomy is all here:
    - Identity: the name, the status by shape and the breadcrumb.
    - The console.
    - A facts strip, which is the spec sheet (API, Google Cloud, family, badges).
    - Features you can open: What it is and its four facts.
    - The Band.
  - Related cards show the Sigil their page opens with (`data-morph`). The hero band is the `data-morph-target`, so a card opens into its page.
- **2.16 Developer experience:**
  - The agent prompt copies exactly. The CLI session on /cloud/logs and /cloud/builds prints line by line. /cloud/local's boot types its commands.
- **2.17 States and resilience:**
  - With JS off (a `noscript` sheet), every session line, the genesis line at full weight, the Band's words and the session note all show. Measured: 0 hidden text runs on /cloud/gpus.
  - The finder's empty state shows the query and a clear button.
  - Gap: no error boundary around the Sigils.
- **2.18 Measurement and handover:**
  - `data-cta="cloud.hero"` is on the hero primary.
  - Gap: no `lib/track.js` exists.
  - Proof is in `docs/gallery/cloud/`. Checks: parity on all 42 pages, `cloudData.test.mjs`, `variety.py` and `audit.cjs`.

## §4 common gate
1. Persona, Goal, CTA and metric id: yes (file header).
2. One h1: yes. Band: yes. `PageHero`: not in the kit yet. No raw `<video>`, `<img>` or `<table>`. Raw `.x-btn` is on the hero asks.
3. One filled primary per screen: yes. `data-thumb` and `data-cta` on the hero primary: yes.
4. Copy parity 0 missing on all 42 pages. UI strings: only `aria-label`s (Pause, Play, Clear).
5. Reduced motion shows final states. JS off is legible. The pause control and clickable services are keyboard reachable.
6. 375×812 and 1470×801 pass. LCP and INP are not measured.
7. Contact sheet: `docs/gallery/cloud/`.
8. Ledger (what this page deleted):
   - The per-product accent system (`accentOf`, the hue table).
   - The template's own closing section (replaced by the kit `Band`).
   - The page AskBar (replaced by the site bar).
   - The label pill above the h1.
