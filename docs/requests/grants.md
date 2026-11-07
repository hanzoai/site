# /grants: shared change request (8 Nov)

For the shared Ask owner (`components/Ask.jsx`), not a page change (review fix 6):
- On a brisk scroll the desktop header still read "Try Hanzo" up to y 700–1060 after the hero's "Apply for a Grant" (`data-cta="grants.hero"`, `data-thumb`) had gone by: the swap waits for scroll idle. Please swap on an IntersectionObserver for the page's `[data-thumb]` ask instead, so the header carries the page's ask the moment the hero's leaves.

The phone header request (one solid at a time on phones) is the one in `docs/requests/founder.md`; /grants calls the page-local `components/pages/usePhoneAsk.js` until it lands.
