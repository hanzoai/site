# /zap: shared changes requested (7 Nov)

1. **`content/ui-strings.json`** (shared): register the demo labels the wire and fleet use, so they are no longer page-local strings. Each one restates a sentence Hanzo already has on the page and makes no new claim:
   - "ZAP · the buffer that arrived", "pointer + offset {n}", "JSON · the same message as text", "{n} character walked" / "{n} characters walked", "Read a field"
   - "Agents you run", "An MCP server beside every agent", "One zapd in front, servers shared", "{n} tool-server processes · {n} more of each", "{n} tool-server processes and zapd · none repeated"
2. **Shared chrome** (`Chrome.jsx` / header): start the header dark, with its ask outlined, when the page's first section is `data-room="dark"`, so a white bar never boxes the dark hero and "Try Hanzo" doesn't flip from solid to outline at hydration.
