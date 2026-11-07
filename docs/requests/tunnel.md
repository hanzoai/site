# /tunnel: shared change requested (Cloud owner, 7 Nov)

- **Phone header ask: resolved page-side (7 Nov, round 2).** The two solids came from the page's own `data-ask="off"`,
  which switched the shared ask off. With it removed, the header is quiet while "View Source" is on screen and carries
  "View Source" after it, at both widths. Nothing needed from the shared owner.
- **Finale close id:** `components/v2/Finale.jsx` writes `data-cta="close"`; a `name` prefix (`tunnel.close`) would
  match MASTER part 4's `<page>.<slot>` form.
