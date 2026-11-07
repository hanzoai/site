# Requests from /enterprise and /pricing (one line each)

- Shared ask bar (`components/Ask.jsx`): on desktop it is a pill floating bottom-centre over page content, and on phones it covers the bottom of tiles and cards. MASTER 3.2 rule 6 and 3.3 ban anything floating over content. Asking the shared owner to dock it (or hide it on desktop and keep it slim on phones where it covers nothing). The pages set `data-thumb` correctly either way.
- Kit `Band`: with JS off its headline renders blurred (the `Words` entrance is not cleared by the noscript rule). Seen on /enterprise and /pricing by the critic.
- Kit `Film`: no pause control for loops over 5 s (MASTER parts 10 and 12). /enterprise adds a page-local 44px pause button on its Zen film until the kit has one.
- `lib/cta.js`, `lib/plans.js`, `PageHero` and `tokens.css` are not merged yet; both pages carry page-local deck values and Hanzo's own labels until then.
