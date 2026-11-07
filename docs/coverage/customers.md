# /customers coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/Customers.jsx` + `Customers.css` · route: `app/customers/page.jsx` · gallery: `docs/gallery/customers/` (desktop.mp4, desktop-1.jpg, desktop-2.jpg, phone.jpg)

1. **Strategy and conversion.**
   - Persona: an enterprise buyer in the Buy journey. Goal: see what Hanzo built and sold, then talk to it.
   - One ask in Hanzo's words, "Talk to us" (/contact). It appears solid in the hero, in the shared ask bar after the hero, and solid white in the closing room.
   - Metric: contact_sales_submit. `data-cta` values: `customers.hero` and `customers.close`.
   - Proof order (2.1): this page holds only the 2015–2020 launches. There is no current proof on it to move above them, so the cases stay in Hanzo's order.
2. **Information architecture and navigation.**
   - Hanzo's header and footer are unchanged.
   - Order: headline and ask, then the case plate (two case studies), every launch, backers, close. One idea per screen.
   - The plate links to `/customers/damon-motorcycles` and `/customers/kanoa`.
   - All 10 live links are present.
3. **First impression and page narrative.**
   - At 1470×801 the first screen holds the h1 (line-mask cut-in, 0.94 line height), the lede and the one ask. The top of the case plate peeks below them.
   - At 375×812 the h1, the lede, "Talk to us" and the plate's first band all fit.
   - Nothing sits above the h1: the "Customers" kicker is gone. The word now names the hero section (`aria-label`) and the ask bar (`data-ask-name`).
   - The ending is the dark room with "Launch with us" and its one ask.
4. **Conversion system.**
   - `data-thumb="Talk to us"` sits on the hero ask, so the site's shared ask bar carries it at every width.
   - The bar steps aside while the closing "Talk to us" (also `data-thumb`) is on screen.
   - One solid button per viewport. The case plate's open is an outlined round arrow, and the year chips are quiet toggles, not buttons.
5. **Trust and proof.**
   - Every figure is Hanzo's.
   - The plate's $8.4M and $7M+ come from the case studies' own copy ("in bikes sold in 30 days", "raised in preorders").
   - Years show only where the case copy prints them (2015–2020). Launches without a year show an em dash.
   - "Backed by builders." keeps Hanzo's live links. The logos are shown as on live, still and greyscale, with names as fallback. Permission for the logos is James's decision (PLAN 1.3 #3); see the note at the end.
6. **Content presentation (copy untouched).**
   - Parity: text 72/72, links 10/10.
   - No new visible words: the invented "Read the case study", "All" and "Undated" are deleted, and the open control is an arrow icon inside the plate link.
   - Measures: lede 40ch, row text 44ch. Figures use tabular numerals.
7. **Visual design system.**
   - No UI hue. Ink #1d1d1f, secondary #424245 and muted #6e6e73, with #f5f5f7 and #ececf0 surfaces.
   - Colour arrives only through the case covers.
   - When a cover fails, the plate is a grey gradient with a Sigil seeded by the case.
   - The hero object uses a 28px radius and tiles use 16px. There is one dark room (the close).
8. **UI component library.**
   - Kit parts: `A` and `Img` (wrapped so a failed picture shows its fallback). Company kit: `MaskLines`. Shared: `Sigil` and the site ask bar.
   - The year chips are real buttons with `aria-pressed`, and the case tabs use `role=tab`.
   - No native `title=` tooltips and no browser-default controls.
9. **Motion and interaction.**
   - Arrival: headline cut-in, plus a CSS rise for the lede, ask and plate that runs without JS.
   - Idle: the plate wipes to the other case once and rests. Its tab bar fills while it waits.
   - Pointer: the index carries a preview on a spring (the launch's logo and its first figure); rows lift onto a grey sheet; the plate photo eases in and the arrow fills.
   - State: the year pill glides between years (layoutId). Press is .98 everywhere, and tabs move 1px.
   - Scroll: nothing is scroll-linked, so scroll stays well under half.
   - The closing Sigil drifts slowly and bends to the pointer.
10. **Media.**
    - The case covers (`/customers/*/cover.webp`, `athlete.webp`) and customer and partner logos come from Hanzo's own /public, through kit `Img` with width and height reserved.
    - Only the first cover is `priority`.
    - In this cloud box the covers and logos are blocked, so the films show the grey and Sigil fallbacks.
11. **Mobile and responsive.**
    - At 375 the plate becomes 4:5.4 and the figure sits above the case text.
    - The year chips become a swipe rail and the index rows stack.
    - Tap targets are 44px or larger, the smallest text is 13px mono, and there is no sideways scroll at 320 or 375.
12. **Accessibility.**
    - One h1. The hero is a labelled section.
    - Hidden plate cases are `inert` and `aria-hidden`. The index list announces filtering (`aria-live`), and each year chip has a full accessible name ("2018: 3 launches").
    - The focus ring is a two-tone ink ring.
    - Reduced motion: the headline, plate and fills sit still, the plate does not advance, and the Sigil draws one frame.
13. **Performance and engineering.**
    - Transform, opacity and clip-path only.
    - The plate timer runs only while the plate is in view, and stops after one turn.
    - The preview follows the pointer through springs and does no layout reads per frame beyond one rect.
    - No marquee and no video.
14. **SEO and machine files.** Metadata and JSON-LD are unchanged. Every word sits in the server HTML, including the hidden case and every row; JS off shows the headline through MaskLines' `<noscript>` rule and the CSS arrival.
15. **Catalogue and product pages.**
    - The index is the catalogue: year filter, rows, and a preview on hover.
    - Each case plate opens into its page (`data-morph` on the picture).
16. **Developer experience.** Does not apply.
17. **States and resilience.**
    - A missing cover shows a Sigil plate, and a missing logo shows the company name in type.
    - A filtered year with no launches cannot happen, because only printed years are chips.
18. **Measurement and handover.**
    - `data-cta` is on both primaries. No analytics are wired: `lib/track.js` doesn't exist yet (PLAN 2.18).
    - Ledger, what this page deleted: the 32-second logo marquee, the teal accent, the "Read the case study" pill, the "All" and "Undated" chips, the plate's scroll scaling, the kickers above the h1 and the plate, and the opacity:0 arrival states.

**Open for James:** whether to show the partner logos (PLAN 1.3 #3; today they show as live has them); and whether "Case studies" should stay as the caption for the plate's tabs (it is Hanzo's heading, now set under the plate).
