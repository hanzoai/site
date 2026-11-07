# Request: restore the native-dialog `components/v2/DetailSheet.jsx` (shared owner: Wave 2 Proof kit)

**What is broken.** Merge `d490cc53` kept main's older `DetailSheet.jsx` (a portalled `div.pf-sheet` with `role="dialog"`), while `DetailSheet.css` is the newer version from `5e4c6ce5` that positions only `dialog.pf-sheet`. With the halves mismatched, the closed panel is unpositioned: on phones it draws over the page, on desktop opening it scrolls to the top with no scrim, and the parked panel's shadow shows down the right edge (scrollWidth > viewport). Seen on /security and /trust; likely on every user: /compare, /comparison, /open-source, /leaderboard, /benchmarks.

**Fix asked for.** Restore `components/v2/DetailSheet.jsx` from `5e4c6ce5` (native `<dialog>` + `showModal()`), swapping its `<noscript>` for the shared `<NoJs>` as in `7100c23b`.

**What /security did meanwhile.** A page-local copy, `components/pages/security/Sheet.jsx`, with the same props and the shared CSS. Delete it and switch back once the shared file is fixed.
