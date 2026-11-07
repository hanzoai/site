# Requests from /pricing (shared owners)

1. **Header ask on phones** (`Chrome.jsx` / header owner): on desktop the header's "Try Hanzo" drops to an outline while a page's own solid ask (`data-thumb`) is on screen. On phones it stays solid, so /pricing's first phone screen shows two solid fills (header and Free's "Try Hanzo"). Asked: the same outline rule at every width.
2. **`Band` reveal** (`components/kit.jsx`): the closing Band's heading reveals with a blur. MASTER part 9 bans opacity-and-blur reveals; asked: the line-mask cut-in (translateY 105% to 0, 700 ms, ease-emphasis). Also the Band ask sits in `Magnetic` + `Go`, which gives two keyboard stops for one button.
