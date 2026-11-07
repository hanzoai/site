# Read first: James's rules from 8 Nov (these override anything else)

James, word for word: "its very important that we change no wording on the site. anywhere. its just a redesign we are doing. spreading the same information"

1. **No wording changes, anywhere.** Every heading, sentence, label, link, number, list item, FAQ and footnote on live hanzo.ai appears on our page, word for word. Don't rewrite, shorten, merge or drop anything. A redesign changes how it looks and moves, never what it says.
2. **The old copy check didn't work.** `scripts/parity.py` reported "text 0/0" on every page because it had no reference text, so it passed everything. Use **`node scripts/copycheck.mjs /<page>`** instead. It reads live hanzo.ai and our dev server in a headless browser and lists every live line missing from ours (`shots/copycheck/<page>.txt`). A page isn't done until it says `missing 0`.
3. **Pages must be usable, not just impressive.** Show a visitor how they'd actually use the product. On /dev, someone should come away knowing how to install it, start a session and get a change made, with Hanzo's own links (Read the docs, Open Dev on the web, Getting started, the latest release).
4. **Simple pages stay simple.** A page that only explains something (blog index, legal, help, docs-like pages) should read as clearly as Hanzo's own. Not every page needs a long motion scroll. Hanzo's blog and Enso hero are clearer than ours: keep their clarity and add polish.
5. **Keep Hanzo's people and pictures.** /about must show the founders' photos (`public/authors/*.jpg` are now in the repo). Never remove an image Hanzo shows.

Results of the real check on 8 Nov (lines on live hanzo.ai that our page is missing):
/ 44 of 232 · /about 29 of 146 · /benchmarks 193 of 354 · /blog 21 of 81 · /dev 17 of 103 · /models 28 of 123 · /studio 2 of 55 · /beta 1 of 7 · /chat 0 · /enso 0 · /pricing 0. Every other page is unchecked, so run the tool on each page you own.

**What to do now:** run `node scripts/copycheck.mjs` on every page you own, starting with the ones you already marked Ready. Restore every missing line. Re-check usability against rule 3 and simplicity against rule 4. Remove the `Ready:` line from any page that fails, until it passes.
