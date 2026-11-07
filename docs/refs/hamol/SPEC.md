# hamol.studio: NOT FILMED YET

**Status.** No video or frames yet: the network policy blocks hamol.studio (proxy 403), and WebFetch is blocked too. The run is in `docs/refs/TO-FILM.md`.

**Labels:** "earlier code read" means `docs/BRIEF-v3.md` §9, where an earlier session read the source but did not see the visuals. Web search found **no write-up** about this site: the results were unrelated studios with similar names.

## What is known

| What | Value | Source |
|---|---|---|
| Numbering | Always-visible numbering `01 / 09`, and status chips on items | earlier code read |
| Detail overlay | A project opens in an overlay with Next project and Back, ending in a call to action | earlier code read |
| Spatial scene | A scene where objects are nodes, with a "Static view" option and a skip link | earlier code read |
| Preloader | A named preloader. Do not take. | earlier code read |

## Not known until filmed
- Every timing.
- Whether the scene is WebGL, canvas or DOM.
- How the scene responds to the pointer, and its idle motion.
- The type, spacing and colours.

## Moves Hanzo should borrow (provisional until filmed)

1. **Always-visible position counter, `01 / 09`.**
   - **Pages:** Catalogue (/models, /cloud, /integrations) and Launch chapters.
   - **Behaviour:** tells you where you are in a set without a progress bar. Pair it with BRIEF §8 pattern 5 (single-slot caption, opacity only).
2. **Detail overlay that ends in Next, Back and the one ask.**
   - **Pages:** Catalogue card details (works with synchronized.studio's card-to-page).
   - **Behaviour:** the last thing in every overlay is Hanzo's single ask, never a dead end.
3. **Products as nodes in one spatial scene, with a Static view.**
   - **Pages:** System (/platform map you zoom into, /cloud index).
   - **Behaviour:** the "Static view" toggle doubles as the reduced-motion and low-power path BRIEF §8 asks for. This is also the "not only scroll" motion James wants: pointer and idle.
4. **Status on the item, not above the headline.**
   - **Pages:** Catalogue rows and cards.
   - **Behaviour:** small status text such as "Beta" or "Live" sits in the row.
   - **Limit:** James bans a badge, pill or eyebrow above a headline, so never put one over an H1 or H2.
5. **A skip link for any scene.**
   - **Pages:** every page with a pinned or spatial scene.
   - **Behaviour:** a keyboard and screen-reader way past the scene (earlier code read).

## Sources
- Earlier code read: `docs/BRIEF-v3.md` §9, Craft references
- Web search found nothing about hamol.studio itself (7 Nov).
