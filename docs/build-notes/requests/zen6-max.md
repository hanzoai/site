# Requests from /zen/zen6-max (review 7 Nov, fix 4)

- Shared header ask (components/Ask.jsx and the header's ask): on phones the header shows a solid "Try Hanzo" on the first screen while the hero shows the page's solid "Talk to sales". That is two solids and two different asks on one screen. On desktop the header already switches to the page's `data-thumb` label ("Talk to sales") after the hero; on phones it never does.
  - Asked: at every width, use the page's `data-thumb` label for the header ask on this route, and keep it quiet (outline) while the element carrying `data-thumb` is on screen. Then only one solid shows.
  - Meanwhile the page keeps exactly one solid of its own on each screen (hero "Talk to sales", then the close "Talk to sales"). It does not restyle shared chrome from its own CSS.
- Still open from docs/build-notes/requests/zen-zen6-max.md: the "Breadcrumb" and "Server" strings, the desktop ask bar floating over content, tokens.css, lib/cta.js and lib/track.js.
