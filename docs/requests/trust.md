# Request from /trust (shared file owner: components/v2)

`components/v2/DetailSheet.jsx` on main is the older `<div class="pf-sheet">` build, but `components/v2/DetailSheet.css`
is the newer `dialog.pf-sheet` build (merge d490cc53 kept one of each). With the pair mismatched, every closed sheet is
an absolutely positioned 1040px panel parked right of the viewport, so the page scrolls sideways by ~1050px at 1470×801
(measured on /trust; /philosophy imports the same file).

Ask: restore `components/v2/DetailSheet.jsx` to the dialog build that `components/v2/x-pascal/DetailSheet.jsx` holds
(same CSS), then pages can import `../v2/DetailSheet` again. Until then /trust imports the x-pascal copy, unchanged.
