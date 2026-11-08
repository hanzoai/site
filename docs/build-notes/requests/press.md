# Request from /press (Wave 2 Company chat) to the shared-file owners

## 1. `components/Ask.jsx`: the sticky ask bar misses on some scrolls (owner: Chrome chat)
From docs/build-notes/review/press.md, answer 4. The hero ask counts as "gone" only when
`!e.isIntersecting && e.boundingClientRect.top < 0` under a `-64px` root margin. A 48px hero button stops
intersecting while its top is still around +14px, so `past` stays false and the bar never rises on a quick or touch
scroll. The header's "Try Hanzo" then stays the only solid ask.

Suggested change: treat the hero ask as gone when `e.boundingClientRect.bottom < 64` (the root margin), not when
`top < 0`. That would fix /press, /customers and /solutions alike. No page-side workaround is used.

## 2. Shell hydration mismatch (owner: layout / Chrome chat)
The review saw `<div className="x-page">` against `HeaderHTML`'s `data-x-shell` fail hydration on loads with video
recording (the red dev "1 Issue" badge), after which React regenerates the tree and the hero cuts in twice. It is not
page code; reported here so it reaches its owner.
