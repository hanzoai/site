# /jin: shared-chrome requests (round 2, from docs/review/jin.md fix 9)

Not edited by the /jin page; for the owners of the shared files.

1. **Cta primary hover** (`components/kit.jsx` / shared Cta): the solid hover goes to `rgb(44,44,46)`, which is not on the deck ramp. Suggest `#262626` or `#171717`.
2. **Header ask on phone** (Chrome/Header): at 375x812 the header keeps a solid "Try Hanzo" beside the hero's solid "Read the docs", so the first screen has two solid fills. Suggest the header ask stays quiet (outlined) until the hero ask leaves view, as it already does on desktop.
3. **Header glass** (Chrome/Header): at desktop scroll stops the header's blur leaves grey smudges over the page edge (review frames 01, 03, 04). Suggest an opaque fallback or a tighter blur region.
4. **FooterHTML hydration** (shared footer): the `dangerouslySetInnerHTML` footer markup differs between server and client, which logs one hydration error on every page.
