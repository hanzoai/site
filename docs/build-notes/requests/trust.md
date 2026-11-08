# Request from /trust (shared file owner: components/v2)

`components/v2/DetailSheet.jsx` on main is the older `<div class="pf-sheet">` build, but `components/v2/DetailSheet.css`
is the newer `dialog.pf-sheet` build (merge d490cc53 kept one of each). With the pair mismatched, every closed sheet is
an absolutely positioned 1040px panel parked right of the viewport, so the page scrolls sideways by ~1050px at 1470×801
(measured on /trust; /philosophy imports the same file).

Ask: restore `components/v2/DetailSheet.jsx` to the dialog build that `components/v2/x-pascal/DetailSheet.jsx` holds
(same CSS), then pages can import `../v2/DetailSheet` again. Until then /trust imports the x-pascal copy, unchanged.

# Request from /trust (shared file owner: header / `app/system.css`, `components/Ask.jsx`)

The desktop header's ask carries the page's own ask after the hero (Ask.jsx), but `app/system.css:280` caps it:
`header[data-slot=masthead] a[data-x-ask] { max-width: 240px; overflow: hidden; text-overflow: ellipsis; }`. /trust's ask,
"Request a review or an enterprise deployment", needs 313px at 13px/600, so the critic saw it clipped at both ends
for the whole page (docs/build-notes/review/trust.md, fail 2).

Ask: let the sticky ask size to its label (no max-width, `white-space: nowrap`, width from content), and give the nav
room for it. Measured on /trust after the hero (header buttons' boxes): at 1470 the nav ends at 1125 and a full-width
ask fits (1133-1446); at 1280 the nav also ends at 1125, so even the 240px cap runs past the viewport (1133-1373); at
1024 the ask starts at 932. Between about 1000 and 1399 the header needs to drop the nav icons or the language label,
or let the ask wrap to two lines, before a page ask longer than "Try Hanzo" can fit.

Until then /trust carries a page-scoped override in `components/pages/Trust.css` (`html:has(main.xtr) …`, the same
pattern as cloud/Playground.css): one line from 1400px, two lines at 200px from 701 to 1399px. It fits at 1470 and
1180; at 1024 and 1280 the shared nav leaves no room, which only the header owner can fix.

# Request from /trust (shared file owner: components/v2, the "Proof" chat)

`components/v2/MaskLines.jsx` and `components/v2/SceneWipe.jsx` call `useReducedMotion()` during render and feed it into
the first render (`initial={reduce ? false : …}`, `clipPath: still ? 'none' : clip`). The server always renders the
motion start state, so with reduced motion on the client's first render differs and React logs "A tree hydrated but
some attributes of the server rendered HTML didn't match" (every reduced-motion load of /trust, 1470 and 375).

Ask: render the start state on the first pass and read the preference in an effect (or show the final state from
CSS under `prefers-reduced-motion`, which beats the inline transform with `!important`). /trust now uses its own
`Lines` and `Room` (same motion and values, in Trust.jsx) and can switch back once these are fixed.
