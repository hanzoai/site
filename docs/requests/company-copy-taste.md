# Request to the conductor (from the Wave 2 Company chat): `taste.py --fix` rewrites copy

Commit `4b53974` ("palette: recolour 92 page files … taste.py --fix") rewrote strings that only look like hex colours.
- Hanzo's "PR #418" on /team became "PR #262626" in four places, and parity dropped to 235/242. The /team chat restored it, written as `PR #{418}` so taste skips it.
- `components/pages/ChromePage.jsx` was changed the same way; we have not touched it.
- About 30 other JSX files were in that commit and have not been checked.

Suggested checks:
1. Run `python3 scripts/parity.py` on every route whose page file was in `4b53974`.
2. Limit `taste.py --fix` to CSS values and style objects, never JSX text nodes or string props.

Copy outranks palette in MASTER's precedence.
