# /tunnel: shared change requested (Cloud owner, 7 Nov)

- **Phone header ask (components/Ask.jsx / header):** at ≤700px the header's solid "Try Hanzo" shows on every screen,
  so the first phone screen has two solid fills ("Try Hanzo" and the hero's "View Source"). Request: on phones, the
  header button goes quiet (outline) while the page's own `data-thumb` ask is on screen, as desktop already does.
  The page itself keeps one solid of its own per screen (the close's "View on GitHub" is an outline on this page).
- **Finale close id:** `components/v2/Finale.jsx` writes `data-cta="close"`; a `name` prefix (`tunnel.close`) would
  match MASTER part 4's `<page>.<slot>` form.
