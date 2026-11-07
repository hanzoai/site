# /sentinel: shared change requested (7 Nov)

- **Header ask on phones** (`components/Ask.jsx`, `Chrome.jsx`): at 375 the header's solid "Try Hanzo" shows beside the hero's solid "Read the docs", and the bottom bar adds a third ask. Desktop already swaps the header to the page's own ask ("Read the docs") once the hero ask leaves view and keeps it quiet while it is on screen. Please do the same on phones: header ask quiet while the page's `data-thumb` ask is visible, then the page's label. Raised by the /sentinel critic (run 2); it applies to every page with its own hero ask.
