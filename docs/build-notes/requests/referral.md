# /referral: shared change requested (components/Ask.jsx)

On phones (≤ 700 px) the header's solid "Try Hanzo" shows over the hero's own solid ask, and after the hero a bottom bar carries the page's ask in different words. Desktop already does the right thing (header quiet while the hero ask is on screen, then the header carries the page's `data-thumb` label).

Request: do the desktop move at every width. Quiet header while the hero's ask is on screen; then the header carries the page's ask (label and href from `data-thumb`), and the bottom bar stays hidden while the header carries it.

Until then, `/referral` does this page-locally (`usePhoneHeaderAsk` in `components/pages/Referral.jsx`): it sets `html[data-ask=quiet]` while the hero ask is visible, then swaps the header button's label and href and marks it `data-ask-hide` so the bar stays away; it restores everything on unmount. Remove that hook once Ask.jsx does it for every page.
