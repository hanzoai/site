# /automations — James-eye review

Reviewed 7 Nov 2026, 16:30 UTC, walked moving at 1470x801 and 375x812.

Verdict: 5/10

First complaint: "I typed in the search and pressed Commerce and nothing happened. It says 8 of 81 and still shows me all 81. Under that it's a wall of 81 identical coloured emoji tiles. It's an app directory, not a premium page."

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes, mostly. The h1 cuts in by line mask at 52px (40px on phone), and by 1 s the dock has dropped Slack onto the Hanzo Auto canvas. It keeps building Slack, Google Sheets and Anthropic Claude by itself, and the text changes between rest shots taken 4 s apart. At 300 ms the lede, ask and object are still blank and only half the h1 is in, so the first frame is a white page with half a headline. On desktop the object starts at y 460, so only the top 340px of the canvas is seen at 1470x801. The third node is cut off at the fold.
2. **One in, one out?** No. The structure is hero, then about 250px of empty white (desktop y 230 to 500 after the first scroll; about 150px on phone), then the catalogue: 12 rows of 7 identical tiles on desktop, and on phone 27 rows of 3 tiles about 2,880px tall. Then the black "Not here?" band. The catalogue is one long document with nothing coming in or going out.
3. **A real object in every section?** The hero (dock and canvas) and the band (HTTP request node to credential, drawn) each have one. The catalogue's only object is the grid itself, which has no moment, no preview and no hover.
4. **One ask, sticky after the hero?** Yes. There is one solid "All Integrations" in the hero, with the header carrying the shared ask. The band has a solid "Request Integration" and a text "Build Custom Integration". Nothing floats over content. Scale has no rhythm after the hero: 81 tiles at 17px titles and 40px emoji, all one size, with nothing big or small.
5. **Every hover and press answers?** No. Dock tiles answer well: hover gives a fill and border, and a tap rebuilds the canvas flow. The pause button answers. But the **category chips and the search are dead**. The chip goes ink and the counter reads "8 of 81" / "0 of 81" / "7 of 81", yet all 81 tiles stay on screen. The `li.am2-card` items get `hidden=""`, but the card's `display:flex` overrides it (measured: 80 have `hidden`, 81 visible). The "Not here?" empty-state note does appear above an unfiltered grid. The catalogue tiles have no hover state at all: background, transform and border do not change.
6. **Overlap, font swap, layout shift?** No overlap, and no horizontal overflow at either size. The h1 box is stable (159,204 662x171 before and after load). On phone, CLS is **0.080** (0.053 at 2.4 s plus 0.027 at 4.0 s; sources `am2-dock-wrap`, `am2-slot` and `l2-sec am2-cat`) as the canvas grows and pushes the dock and catalogue down. The desktop CLS of 0.005 is fine. On phone the red Next.js "1 Issue" badge shows, from the console error "A tree hydrated but some attributes of the server rendered HTML didn't match the client properties".
7. **Which reference, and is its motion there?** The hero dock dropping onto the canvas is a motion.dev-style state demo, and it works. Nothing from apple.com (no pinned or scrubbed scene; the card claims "scroll only in the pinned scene", but there is no pinned scene) and nothing from synchronized.studio. The catalogue feels like a Zapier directory.
8. **Different from its neighbours?** Partly. The dock-to-canvas idea is its own. But the canvas is the same dotted-grid stage as /auto, with white rounded nodes, black connectors and a round pause button top right, and the room order (light hero, light content, black band) is the common one. /integrations turns its emoji grey, which shows this page's full-colour emoji are off-system.
9. **All 18 parts covered (docs/coverage/automations.md, claims true on the page)?** The card has 18 headings, but several claims are false on the page:
   - Part 4 says "Copy is the kit `Copy`, which copies the prompt string it shows". There is no copy button or prompt on the page.
   - Part 9 and the card say "every control answers". The chips and search do not filter.
   - Part 9 says "scroll only in the pinned scene". There is no pinned scene.
   - Part 11 says "375x812 pass". The phone CLS of 0.08 and the "1 Issue" badge say otherwise.
   - Part 13 says "0 console errors at both widths". The phone hydration error contradicts it.
10. **Banned tells?**
    - **Colour.** The page has 81 plus 12 full-colour emoji as tile art (🤖🧠✨💬🎮📱 and so on). They are decoration in hue, against "no hue, colour only through Hanzo's own media". /integrations already shows the greyscale treatment.
    - **Browser-default control.** The search field's cancel "x" is the default blue WebKit `::-webkit-search-cancel-button`, which is also a hue.
    - **Plain boxes and a lazy look.** The catalogue is a uniform grid of identical flat tiles.
    - **Mid-word breaks.** Tile titles break mid-word at 1470: "WooCommerc / e", "LemonSqueez / y", "ActiveCampai / gn".
    - No purple gradients, no Inter, and nothing above the h1. The mono caption "HANZO AUTO · CONNECTORS" sits under it, correctly.
11. **Copy untouched?** It looks so. The h1, lede, "Most reached for", "All Integrations", "Not here?" paragraph and the integration names match `content/outline/automations.json`. "request node / HTTP / connection / credential" in the band diagram are taken from the band's own sentence.

## Fixes (ordered, most important first)
- **Make the filter and search work.** Add `.am2-card[hidden]{display:none}`, or stop rendering filtered items. "Commerce" must show 8 tiles, "goo" 7 and "zzzq" 0 plus the Not-here note. Animate the reflow (FLIP on transform, 300 ms ease-emphasis) so the chips' state change is the catalogue's moment.
- **Fix the phone hydration mismatch** that raises the red "1 Issue" badge and the console error. It is probably a server/client branch or random/time value in the dock or canvas.
- **Remove the phone layout shift (CLS 0.08).** Reserve the canvas's final height (three nodes plus connectors) before the demo starts, so `am2-dock-wrap` and the catalogue never move.
- **Take the hue out of the emoji.** Render the tile and dock emoji in greyscale (as /integrations does: `filter: grayscale(1)` with the contrast lifted), and let colour return only on the active or hovered tile, or on the node landing on the canvas. That makes colour a state.
- **Break up the 81-tile wall.**
  - Default to the "Most reached for" or a single category with the chips leading, or collapse to a dense 44px list on phone (27 rows of 3 tiles, about 2,880px, is far too long).
  - Give each tile a hover or tap answer that tells you something, such as the category chip and "read / write / trigger" preview, or dropping it onto a mini canvas. Use `transform` with no layout jump.
- **Cut the dead white gap** (about 250px desktop, about 150px phone) between the hero object and "All Integrations". Pull the hero object up so the whole three-node flow sits inside 801px at 1470 (it currently starts at y 460 and is cut at the fold).
- **Fix the tile titles.** Stop mid-word breaks with `overflow-wrap: normal; hyphens: manual`, and either let a long name take two lines or drop the title to 16px inside the 156px tile.
- **Style the search clear button.** Replace the native blue search-cancel "x" with the page's own 44px clear control in ink.
- **Make the hero less like /auto's stage.** Give the canvas its own treatment (for example, no dotted grid, or the dock-to-node arc drawn as the connector), and add one non-scroll ambient or pointer element in the catalogue so the lower 70% of the page is not static.
- **Correct the coverage card.** Remove the non-existent Copy button claim and the "pinned scene" claim, and update the parts 11 and 13 evidence.
