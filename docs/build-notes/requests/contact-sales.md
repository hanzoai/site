# /contact-sales: shared changes requested (7 Nov, review 6/10 fixes)

Done page-local instead wherever possible. These need the owner of shared files:

1. **Header ask (review fix 1).** The review asks for "Talk to sales" in the sticky header slot, solid once the card
   leaves view. The header is shared chrome and its label is fixed ("Try Hanzo"), so this page does not touch it. The
   page already sets `data-ask-name="Talk to sales"` on its `<main>` and `data-thumb="Talk to sales"` on the card, if
   the header ever reads a per-page ask. The floating pill bar is gone site-wide (d2b5ab8c), so nothing floats over
   the inclusion rows on desktop or phone any more.
2. **Kit `Band` uses `Magnetic` (components/ui.jsx), which is a spring** (stiffness 260, damping 17). That breaks
   MASTER 3.1's no-springs rule on every page that ends in a Band. Suggest an eased follow (ease-emphasis, 300ms) in
   `Magnetic`. This page keeps the kit Band as asked and has no spring of its own.
3. **Customer logos** (`content.trusted`, `/logos/customers/*`) are not in this repo's `public/`. In dev they are
   proxied to hanzo.ai, which this cloud box blocks, so the console shows resource 404s; the rail falls back to the
   names in type. Not a page bug; worth checking in the static export.
