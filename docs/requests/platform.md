# Requests from the Platform + Cloud chat (/platform and the /cloud/* template)

## 1. `components/Ask.jsx` (owner: chrome): no floating bar on desktop

MASTER 3.2 rule 6 and 3.3: "No floating pill bar or panel over content on desktop", "Anything floating over content: a pill bar … fails".
On desktop the site ask bar (`.x-ask`, bottom centre) still floats over page content after the hero.

Asked:
- On desktop (≥ 900px) carry the page's ask in the sticky header only (the header's quiet ask takes the label of the page's `data-thumb`), and show no bottom bar.
- Keep the phone bar as it is (slim, steps aside for the page's own ask, `[data-ask-hide]`, the footer and `.x-band`).

Until then /platform marks its two pinned scenes (the map and the plane-by-plane chapters) `data-ask-hide`, because their own controls sit on the bottom edge. The /cloud/* template no longer hides the bar anywhere.

## 2. `components/kit.jsx` (owner: kit)

- `Band`: accept `id` (and pass it to its `Cta`) so the closing primary carries `data-cta` like every other primary (MASTER part 4 and 18). /platform would pass `platform.band`, cloud pages `cloud.<slug>.band`.
- `Copy` (used by `CodeBlock`): show the tick only when `navigator.clipboard.writeText` resolves; on failure keep the label (MASTER part 4: "failure never says Copied").
- `PageHero` and an island error boundary (MASTER parts 3 and 17) are named in the 18-part card but are not in the kit yet.

## 3. `lib/` (owner: conductor)

`lib/cta.js` (labels and hrefs) and `lib/track.js` (events) are named in MASTER parts 1 and 18 but do not exist. Both pages keep Hanzo's own labels and one href constant, and send no events, until they do.
