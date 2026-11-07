# Request from /contact to the shared-chrome owners (header ask)

From `docs/review/contact.md` (7/10, fix 1): "Put 'Talk to sales' in the sticky header at every width."

Measured on 7 Nov with Playwright, page unchanged on this point (no page-side header hack):

- **Desktop (1470×801): already met by shared code.** `components/Ask.jsx` swaps the header button's words and link to
  the page's `data-thumb` ("Talk to sales" → /contact-sales/) once the hero's button has gone by. Sampled every 300px:
  "Try Hanzo" at 0 and 300 (the hero's own solid ask is on screen, header quiet), "Talk to sales" from 600 to the end,
  solid ink from 1500 on (a light fill over the dark Visit room). No floating bar on desktop.
- **Phone (375×812): the header keeps "Try Hanzo" at every scroll position.** The slim phone bar carries "Talk to sales"
  only where nothing sits under it, so it is rare: with the cookie note rejected it rested at one of ~28 scroll steps
  (about 1760, the Visit room's empty bottom), never over the community rows; a critic saw it at none of 24 steps.
  With the cookie note still open it never shows.

Ask: on phones, let the header's solid button carry the page's `data-thumb` after the hero, as it already does above
700px (the same swap in `Ask.jsx`'s desktop effect, without the `min-width: 701px` gate). Then the page's one ask lives
in the sticky header at every width, as MASTER 3.2 rule 6 and the review want, and the slim bar becomes optional.
