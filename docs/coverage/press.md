# /press coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/Press.jsx` + `Press.css` · route: `app/press/page.jsx` · gallery: `docs/gallery/press/` (desktop.mp4, desktop-1.jpg at 1470×801, desktop-2.jpg, phone.jpg)

1. **Strategy and conversion.**
   - Persona: a journalist or analyst (PLAN 1.1 "Investor and press"). Goal: leave with the kit, the facts and the right email.
   - One ask in Hanzo's words: "Contact Press Team" (mailto:press@hanzo.ai), `data-cta="press.hero"`; metric: one contact click.
   - The page closes on "Request Executive Bios" (`press.bios`), which goes to the same inbox.
   - The kit downloads are quiet outlines (`press.kit`, `press.zip`).
2. **Information architecture and navigation.**
   - Hanzo's header and footer are unchanged.
   - Order: headline and kit, the kit spread, about and facts, recent news, the press contact room, brand and partner assets, channels, leadership.
   - All 20 live links are present: the kit zip, mail, /brand, six partner logo files, /blog, nine channels and hanzo.team.
3. **First impression and page narrative.**
   - At 1470×801 the masthead h1 (line-mask cut-in, line height 0.9), the lede, both actions and the dealing kit all fit above the fold.
   - At 375×812 the h1, lede and both actions fit, and the kit starts below.
   - No eyebrow anywhere:
     - "Press & Media" now names the hero section (`aria-label`) and the ask bar.
     - "Leadership" names the last section.
     - "Media Inquiries" and "Headquarters" now sit under what they label.
4. **Conversion system.**
   - `data-thumb="Contact Press Team"` drives the site's shared ask bar at every width. The bar steps aside when the closing "Request Executive Bios" (also `data-thumb`) is on screen.
   - One solid button per viewport.
5. **Trust and proof.**
   - The facts (2016, San Francisco, CA, Hanzo AI, Inc., Techstars '17) and every news line are Hanzo's.
   - The partner logo files are linked as live links them. Showing logos needs written permission (PLAN 1.3 #3); see the note at the end.
6. **Content presentation (copy untouched).**
   - Parity: text 83/83, links 20/20.
   - No new visible words: "/blog →" in the news card is now an arrow icon, and the copy buttons are icons with an aria-label ("Copy boilerplate", "Copy").
   - The boilerplate measure is about 60ch, and the news headlines are set to balance.
7. **Visual design system.**
   - No UI hue. The magenta is gone: ink, greys, #f5f5f7 and #ececf0 tiles, and black and white plates.
   - Colour can arrive only through the leadership portraits, shown in greyscale until hovered.
   - Hero objects use 28px corners and tiles 16px. There is one dark room: the press contact.
8. **UI component library.**
   - Kit `A` and `Img`, with a wrapper that swaps in a fallback, and ui `Copy` and `Mark`. Also the company `MaskLines` and the shared `Sigil`.
   - No raw `<img>`, no native tooltips, no browser-default controls.
9. **Motion and interaction.**
   - Arrival: headline cut-in, plus a CSS rise for the lede, asks and fan that works without JS.
   - Idle: the kit deals its three plates once (2.4s apart), then rests with the dark plate in front. The contact room's Sigil drifts.
   - Pointer:
     - News: the other headlines step back, and a card with the date and summary follows on a spring.
     - Kit plates lift, and the guidelines tile turns its mark.
     - Channel tiles fill their arrow.
     - Portraits regain colour.
   - State: the download icon draws a tick, and copy shows a tick. Press is .98 or 1px everywhere.
   - Scroll: no scroll-linked effects.
10. **Media.**
    - Partner logos (`/press/partners/*`) and the two leadership portraits (`/authors/*-portrait.jpg`) load through kit `Img`, with width and height reserved.
    - They are blocked in this cloud box: logos fall back to a Hanzo mark tile, and portraits to a grey plate with the mark.
11. **Mobile and responsive.**
    - At 375 the news summaries sit under each headline (no pointer card), channel tiles go two up and the facts form a 2×2 grid.
    - Targets are 44px or more, and there is no sideways scroll at 320 or 375.
12. **Accessibility.**
    - One h1, and the hero is a labelled section.
    - Each news link names its story. The pointer card is `aria-hidden` because it repeats the summary, which is in the phone view and the DOM.
    - Copy buttons announce "Copied".
    - The focus ring is ink, or white in the dark room.
    - Reduced motion: no dealing and no rise, and the Sigil draws one frame.
13. **Performance and engineering.**
    - Transform and opacity only.
    - The plate timer runs only in view and stops after one round.
    - The pointer card uses springs.
    - No video, and one canvas (the Sigil, paused off screen).
14. **SEO and machine files.** Metadata and JSON-LD are unchanged. All text is in the server HTML, including every summary. With JS off, the headline shows through MaskLines' `<noscript>` rule and the CSS arrival.
15. **Catalogue and product pages.** Does not apply.
16. **Developer experience.** Does not apply.
17. **States and resilience.** Failed logos show a mark tile, and failed portraits keep the mark plate. When the download is clicked it draws its tick. Copy never confirms a failed write (ui `Copy`).
18. **Measurement and handover.**
    - `data-cta` is on the hero ask, the kit downloads, the mail link, the bios ask and the team link. Analytics aren't wired yet (`lib/track.js` pending).
    - Ledger (what this page deleted): the magenta accent, four eyebrows, the "/blog" text, the visible copy label, the endless plate loop and raw `<img>`.

**Open for James:**
- The partner logos (PLAN 1.3 #3).
- Whether the leadership portraits from /authors may sit on /press. They are Hanzo's own pictures, and the boilerplate names both leaders.
