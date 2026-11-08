# Requests from /node (Cloud 3) to the shared owners

The same six items as `docs/build-notes/requests/network.md`: Frame's Paste on the deck (page-local `.nd .cf-paste-*` overrides until then), `Copy` press .97, the desktop ask bar floating over content, the hue in the shared nav, the pinned chapter count above the h3, and `lib/cta.js` / `lib/track.js` (asks carry `data-cta="node.<slot>"` and `data-thumb`).

Added after the 7 Nov review (7/10):

7. **Header / Ask owner: the phone header ask.** On desktop the header ask goes from solid "Try Hanzo" to outlined while the hero ask is in view, then becomes solid "Run a Node" (from `data-thumb`) once it leaves. On phone the header keeps a solid "Try Hanzo" the whole way down, so the first phone screen has two solid fills and the header never carries the page's ask. Please give phones the desktop behaviour: quiet while the hero ask is in view, then the page's own label ("Run a Node").
8. **LineMask owner (`components/v2/LineMask.jsx`).** The hero variant starts its CSS cut at style time; on a cold load that is before first paint, so the cut is over before anyone sees it (measured on /node: animation ~0.4–1.1 s, first paint 1.06 s). /node now uses a page-local h1 that starts the cut on mount, with a CSS failsafe at 1.6 s. Every LineMask hero likely has the same problem.
9. **PinnedChapters owner.** (a) Under 900px the scene still pins; MASTER part 11 says pinned scenes stack. /node stacks page-locally (a `Stack` shown under 900px, `PinnedChapters` hidden). (b) The rail's tick buttons and any `extra` control inside a chapter are not clickable while that chapter is not the active one (`pointer-events: none` on past/next steps), which a pointer test reports as "not clickable".
10. **Copy (`components/ui.jsx`).** `AnimatePresence mode="popLayout"` keeps the old icon fading behind the new one, so "Copied" briefly shows both the copy icon and the tick. /node hides the outgoing icon page-locally (`.nd .x-copy[aria-label='Copied'] svg:has(rect)`).

Added 8 Nov:

11. **LaunchClose owner (`components/v2/LaunchClose.jsx`).** Under reduced motion the close's `motion.h2` renders `style={calm ? undefined : { scale }}`: the server HTML carries the scale transform and the first client frame drops it, so React logs a hydration mismatch (seen on /node with `reducedMotion: 'reduce'`; no error with motion allowed). Keep the style and hold the transform at 1 instead (as /node's page-local Grow now does).
