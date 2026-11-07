# /api — James-eye review

Verdict: 7/10
First complaint: "It's good up top, it moves, it sells. But turn on reduced motion and there's a red error badge in the corner, and on my phone there are two black buttons fighting each other. Then the endpoint list just goes on and on like a doc page."

Walked 2026-11-07 16:18 UTC, HEAD 8f134455, at 1470x801 and 375x812 (isMobile, hasTouch). First screen at 0.2/1/3/6 s with no input, then a reload. Scrolled the whole page in 400px wheel steps with about 0.9 s pauses (23 desktop screens, 29 phone). Hovered and pressed the primary. Clicked and tapped the console pause, the endpoint chips, Copy (agent prompt, base URL, curl), the dark-room endpoint list, the All/POST/GET segment, the filter including its empty state and "Show all", the accordion rows and the Next rows. Also checked reduced motion, JS off, 320px width, console errors, taste.py and parity.py.

## What works
- The hero console is a real live object. The path types itself, the description streams, a Hanzo model film (Enso, Zen, Iro...) swaps per endpoint, and the gliding tab pill follows. Measured pixel change: 2.6% between 0.2 s and 1 s, 1.5% between 1 and 3 s, 3.3% between 3 and 6 s on desktop. It never goes dead. Pause works (aria-pressed, the path freezes), and chips respond to click and tap.
- The h1 cuts in by line mask with no font swap. The scale is right: a 52px h1, medium console text and small mono chips.
- "How it fits together" is a pinned stage with four chapters (01–04), and each chapter has its own little UI: a key/bill list, a gateway that strips headers, an OpenAPI→client tick-off, a /v1 routing diagram. Apple-style one-panel-changes. It stacks to static panels on phone, as the brief asks.
- The Base URL dark room opens with a clip wipe and holds one big mono URL, the one big thing on its screen. The endpoint picker rewrites the curl with a clip reveal, and "Copy as curl" copies exactly what is shown (checked against the clipboard). The base URL and agent prompt copy is exact too.
- Core endpoints filter and search work, including the empty state with "Show all". The accordion toggles. Hovering a row nudges the path 6px with no layout jump. The Next arrows rotate and fill on hover.
- Primary: on hover the fill goes #0a0a0a→#2c2c2e and opacity stays 1, so no fade. Press is scale(.98). It links to platform.hanzo.ai/api-keys.
- taste.py OK. parity.py: text 80/80, links 18/18. No horizontal scroll at 375 or 320. JS off is fully legible. Under reduced motion getAnimations() is 0 after 3 s and the final state shows.

## The 11 answers
1. Yes. It sells in 5 s ("One API…", a key ask and a live console), and something moves before 1 s.
2. Mostly. The top half is one-in-one-out: hero, then paste strip, then pinned chapters, then the dark room. Core endpoints is a document: 15 accordion rows stacked about 1,650px tall beside a sticky left column, all at the same medium size, and about 250px of empty space after /v1/tools before the close.
3. Yes in every section. Paste and ship is the thinnest (a prompt block only), and the "How it fits together" h2 sits alone with about 200px of blank space before the stage arrives (desktop).
4. Desktop: yes. The header ask starts as "Try Hanzo", turns quiet, then becomes "Get an API key, free" once the hero ask leaves view, and goes quiet again at the close band. Phone: the header keeps a solid black "Try Hanzo" the whole way, so the first screen and the close band have two solid fills, and the sticky ask is not the page's ask. Nothing of the page's own floats over content. The consent card (shared chrome) sits over content at both sizes until dismissed. Scale rhythm is good above Core endpoints.
5. Yes, everywhere tested. One weak spot: endpoint chips change colour only on hover (#333→#0a0a0a), with no detail.
6. No overlap, font swap or layout shift seen at either size.
7. apple.com product pages (pinned scene, one panel changes, a persistent ask) and motion.dev (layoutId pill, clip reveals). Both are actually present.
8. Yes. PAGES.md gives /api an endpoint explorer, /cli a tree, /mcp a tool stream. Its hero medium (a live request console with model films) is its own. Gap: the signature is meant to be "the response streams in", but what streams is the endpoint description, not a response.
9. Mostly covered. Not met: one solid fill per viewport and the sticky ask on phone (part 4), the error-free reduced-motion load (parts 9 and 17), and Film showing native browser video controls with JS off (part 10, and see JS-off below).
10. No banned tells found: no hue (taste OK), no eyebrow above an h1 or h2 (the "Agent prompt", "Client" and "OpenAPI" kicks label objects, not headings), no 3 equal boxes, no fade-on-hover.
11. Copy is untouched (parity 0 missing).

Console: no errors with normal motion. **With `reducedMotion: 'reduce'` a hydration-mismatch error fires on every load (4 of 4 runs, desktop and phone), and the dev "1 Issue" badge shows.** The server renders `transform: translateY(108%)` on the "How it fits together" lines and `clip-path: inset(0% 3% round 48px)` on the dark room. The client renders neither. Causes: `components/v2/x-edison/AppLines.jsx` (`initial={calm ? false : …}`) and `ApiPage.jsx` line 313 (`style={calm ? undefined : { clipPath: clip }}`). Both branch on `useReducedMotion()` during render.

JS off: legible, but the hero film shows the browser's native video control bar (play, 0:00, mute, fullscreen) over the "ENSO" label.

## Fixes (in order)
1. Make the reduced-motion render identical on server and client. Always pass the same `initial` and `style`, and switch to calm only after mount (a CSS `@media (prefers-reduced-motion)` override, or a `useEffect`-set flag). Do this for the dark-room `clipPath` style and the AppLines `initial`. Recheck with `reducedMotion:'reduce'` until the console is clean.
2. Phone header ask: give it the same treatment as desktop. It should be quiet while the hero ask is on screen, swap to "Get an API key, free" (the page's `lib/cta.js` label) once the hero ask leaves, and go quiet again at the close band, so there is one solid fill per viewport. If this lives in shared chrome, request it from the header owner.
3. Core endpoints: stop it reading as a doc. For example, show about 6 rows at first with the rest one tap away (the brief's disclosure patterns), or pin the list and let the expanded row be the one moving thing. Close the about 250px empty space after the last row.
4. Close the empty space under the "How it fits together" h2 so the stage arrives with the heading (about 200px of blank space at 1470x801).
5. Signature: let the hero stream a response (from existing copy) rather than only the description, as MASTER 4.6 asks. Give the chips a hover detail beyond the colour change.
6. JS off: hide the native `controls` on the hero Film (poster only) so no browser-default control bar shows.
