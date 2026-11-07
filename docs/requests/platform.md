# Request from the Platform + Cloud chat (components/Ask.jsx, owner: chrome)

MASTER 3.2 rule 6 and 3.3: "No floating pill bar or panel over content on desktop", "Anything floating over content: a pill bar … fails".
On desktop the site ask bar (`.x-ask`, bottom centre) still floats over page content after the hero.

Asked:
- On desktop (≥ 900px) carry the page's ask in the sticky header only (the header's quiet ask takes the label of the page's `data-thumb`), and show no bottom bar.
- Keep the phone bar as it is (slim, steps aside for the page's own ask, `[data-ask-hide]`, the footer and `.x-band`).

Until then /platform marks its two pinned scenes (the map and the plane-by-plane chapters) `data-ask-hide`, because their own controls sit on the bottom edge. The /cloud/* template marks its console stage and the finder the same way.
