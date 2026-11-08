# /ide: requests (Apps 2 chat)

UI strings for `content/ui-strings.json` (James's approval). Until approved, each control is icon-only and the string is its accessible name only:
- `Remember it` (the add button in the memory demo)
- `Recall` (each memory's recall button)
- `Nothing yet.` (an empty memory tier; shown as an em dash)
- `One thing about your project` (the memory input's name)

Shared kit parts this page waits for, then swaps in: `Terminal` (the start script that types itself is page-owned until then), `PageHero`.

For the kit owner (`components/kit.jsx`, not mine to edit):
- `Band` renders its button through `Go`, which carries no `data-cta` and sends no `cta_click`. Please give `Band` an `id` prop passed to a `Cta` (or `data-cta` on the link), so a page's closing ask is measured like its hero ask.
- The shared ask bar (`components/v2/AskBar.jsx`) floats over content on desktop (it covered the figure in /kata's dark room at 1470×801). MASTER.md part 3 now says no floating pill bar on desktop; on phones a slim bar only where it covers nothing.
- Re-filed 7 Nov (critic round 8): kit `Band` reveals its words with a blur; please make it a line mask with 4px blur or less, use #fafafa / #a3a3a3 for its text (it uses #f5f5f7 / #a1a1a6, off the deck), and put `data-cta="ide.close"` on its button.
