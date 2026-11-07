# Requests from the Business 2 pages (/risk /sign /tabs /treasury /ui /zap /legal /templates /features /gallery)

1. **Header ask stays outlined beside a page solid.** Since the system merge (`648b7985`), the header's "Try Hanzo" renders solid on every first screen, so each of these pages shows two solid pills at once (the header's and the page's hero ask with `data-thumb`). SYSTEM.md §5 said the header turns outline while a page solid is on screen; please restore that.
2. **SetupMenu agent marks in brand colours.** `components/SetupMenu.jsx` (via `public/hanzo.css`) draws the Gemini and DeepSeek marks in blue (rgb 66,133,244 and 77,107,254). /templates greys them page-locally; a shared fix would cover every page that mounts it.
3. **Dark first rooms.** /zap and /treasury open on a dark room; a header that starts dark there would stop a white bar boxing the room.
