# DONE: the finish line (James, 7 Nov). When this is met, everything stops.

There is one version: the final one. ("v2" was only a label; there is no v3, v4 or v5 to wait for.)

## A design is done when all six are true
1. **Colours:** only Hanzo's live palette, the brand deck in `docs/original/brand-deck.html` (from Hanzo's own `@hanzo/design` tokens): black, white, the neutral greys, and `#e4e4e7`. `python3 scripts/taste.py <files>` passes. To fix, run `python3 scripts/taste.py --fix <files>`.
2. **Copy:** word-for-word Hanzo. `python3 scripts/parity.py /<path>` shows 0 missing.
3. **It works:** it returns 200, shows no red error badge, no console errors, every button and menu responds, and nothing overlaps at 1470×801 or 375×812.
4. **Unique and calm:** `python3 scripts/unique.py` passes (unique layout, motion not overdone, palette).
5. **Judged:** a critic walked it moving and scored it 8/10 or better against `docs/JAMES.md`.
6. **Model cards:** wherever they appear, they match `docs/refs/hanzo-model-cards/SPEC.md` exactly.

## The site is done when
- All 151 designs are done (the green "Ready" rows on `docs/status.html`).
- `npm run build` exits 0.
- Sound feedback is in (rule 10 in JAMES.md).

## Then
All chats stop, the conductor's loops stop, everything is pushed to GitHub in one clean commit, and James reviews. Nothing else gets built. No extras nobody asked for.
