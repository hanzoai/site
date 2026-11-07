# /newsletter: shared changes requested (7 Nov)

1. **Phone header ask (Chrome / Ask owner).** On phones the sticky header keeps a solid "Try Hanzo" for the whole page, so the first phone screen has two solids (header "Try Hanzo" and the page's "Subscribe"). On desktop the header already swaps to the page's `data-thumb` ("Subscribe") once the hero ask leaves view, and on phone the bottom ask bar already carries "Subscribe". Request: on phone, let the header follow the same rule (outline while the page's own solid is on screen, carry `data-thumb` after it). Page-local nothing can do this without editing `Chrome.jsx`/`Ask.jsx`.
2. **Kit `Cta` solid hover (kit owner).** The solid hover fill is `#2c2c2e`, not on the deck ramp (`#262626` is). Flagged by the critic; not page-local.
