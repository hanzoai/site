# Request from /studio to the shared-file owners

## 1. Header: honour the page's `data-thumb` ask at phone widths (owner: header / Chrome chat)
From docs/build-notes/review/studio.md, fix 9. At 1470 the header ask swaps from "Try Hanzo" to the page's ask, "Launch
studio.hanzo.ai", once the hero ask leaves view. At 375 it stays "Try Hanzo" (a solid black pill) for the whole walk,
so the page's ask never reaches the header on a phone, and the first phone screen carries two solid fills (the header
pill and the hero ask). Studio's hero and closing asks both carry `data-thumb="Launch studio.hanzo.ai"` and
`data-cta` (`studio.hero`, `studio.close`), through the kit `<Cta thumb>`.

Suggested change: apply the same `data-thumb` swap below 900px, and show the header ask quiet (outlined) while the
hero's own solid ask is on screen. No page-side workaround is used.

## 2. `components/v2/A2Lines.jsx`: hydration mismatch under reduced motion (owner: Apps 2 kit)
With `prefers-reduced-motion: reduce`, every A2Lines heading fails hydration: the server renders
`style="transform: translateY(105%)"` (it cannot know the preference, so `useReducedMotion()` is null) while the
client's first render uses `initial={false}` and renders `transform: none` (or no transform). Next shows the red
"1 Issue" badge on every page that uses A2Lines in a reduced-motion browser. On /studio it is the only remaining
console error (the page's own film-strip `<video>` mismatch is fixed in Studio.jsx with a mounted flag).

Suggested change: keep the server and first client render the same, e.g. always `initial={{ y: '105%' }}` and, when
`calm`, animate with `{ duration: 0 }`; or gate `calm` on a mounted flag. The `noscript` rule already covers JS off.

## 3. `components/v2/A2Paste.jsx`: the Copy button is 40px tall (owner: Apps 2 kit)
Touch targets are 44px or more (MASTER part 11). The Copy button measures 40px at 1470 (it is 44px at 375), which fails on touch laptops and tablets.
