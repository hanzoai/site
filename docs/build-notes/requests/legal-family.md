# /legal/* (LegalDoc template): requests to the shared system

Fix 8 of `docs/build-notes/review/legal-family.md`: site layers, not this template.

- **Arrival curtain on deep links.** The 000–100 arrival curtain played about 2.4 s on a deep link to /legal/terms in the 7 Nov walk and hid the h1 cut-in. CANON: home only, skip deep links, no counter.
- **Morph cut-over.** The card-to-page Morph scrolled the old page to its top while waiting for the route (3.6 s on dev). Verify the sibling-card → h1 flight on the preview build.
- **Footer tooltip.** The footer's "Talk to Hanzo" button uses a native `title` tooltip (browser-default control).
- **Footer icon hue.** The footer's privacy-choices icon is blue (the only hue on these pages).
- **Header tools reach the live API.** Page loads open a connection to `api.hanzo.ai:443` from the shared header (`components/HeaderTools.jsx`).
- **check.cjs false positives.** It flags the visually hidden table captions and cover `.x-sr` numbers (the site's `.x-sr`/clipped captions, not skipped like `.sr-only`), and the phone Contents list inside a closed `<details>` (content-visibility, no paint) as "text overlap". None are visible overlaps (measured rects and screenshots, 8 Nov).
