# /oss/* (template) — James-eye review
Verdict: 6/10
First complaint: "I click one of the organisation cards and the page goes white, with a giant word sat at the bottom of the screen for two seconds, then it jumps to a different place. That's not the card opening into its page, that's a blank page. And everything above it reads like a spreadsheet."

Walked on 7 Nov, moving, at 1470×801 and 375×812, with Playwright on the dev server: `/oss/hanzoai/` (461 repositories, the full case) and `/oss/hanzo-app/` (11 repositories, mostly zeros, the sparse case). I took frames every 250 ms for 8 s with no input, then slow wheel scrolls (120 px every 90 ms) through to the footer. I probed hover, press and keyboard on the rows, filters, sort, search, the repository sheet and the org cards, then ran the card-to-page open frame by frame, JS off, reduced motion, and widths of 320, 375 and 1470.

**Proof images** (`docs/review/oss/`; the filenames are the old ones, but the contents are new):
- `1-hero-1470-badge.jpg`: `/oss/hanzoai/` at 1470×801, 7.75 s after load. The hero figure card has settled (568,900, contour field, monthly bars). The red Next "1 Issue" badge, caused by the hydration error below, sits bottom-left. The cookie card overlaps the "Counted from GitHub" stats.
- `2-jsoff-375-clipped-h1-missing-figure.jpg`: `/oss/hanzoai/` at 375×812 with JS off. The earlier problem is fixed. The h1 is whole (y 76, 42 px tall, not clipped), 568,900 and the bar chart are in the static HTML, and 461 / 1,602 / 154 render.
- `3-row01-misaligned-actions.jpg`: the row-01 action misalignment is fixed (the Forge pill and ↗ are both centred at y 467.1, which is the row's own centre). The image now shows the card-to-page open 900 ms after clicking the `hanzobot` org card. The page is blank white, and the stage title sits at 106 px at y≈581. The destination h1 lands at y 173, 52 px.

## The 11 questions

**1. Does the first screen sell in 5 s, and does something move within 1 s?**
Yes, in part. Within 500 ms the figure card counts up (568,900 for hanzoai, 11 for hanzo-app), its bars grow left to right behind a scan line, and the contour field drifts. hanzo-app has a marquee of its repo names. So it is alive with no input. But the composition sells weakly. On desktop the h1 sits at y 230 under about 170 px of empty white on the left, while the lede and the ask float top-right. The left half of the first screen above the card is dead space. It looks like a document header with a chart under it, not a moment.

**2. As you scroll, does one thing come in as one goes out, or is it a document?**
It is mostly a document. After the hero card come two stat blocks ("Counted from GitHub", "Counted on Hanzo Forge"): a heading on the left, figures stacked on the right, each counting up once. Then 11 near-identical 130 px rows, then a rail of 4 org cards, then the Band. Nothing pins and no panel replaces another. The count-ups are the only scroll moments. On hanzo-app the GitHub block is one lonely figure ("1 forks") plus "0 stars", and about 60% of the row is empty. It looks unfinished.

**3. Does every section hold a real visual object?**
Mostly yes. The hero has the figure card with contours and monthly bars. The Forge block has progress bars (2,178 of 2,732 private; 159,289 of the commits). Each row has a 12-month sparkline. The org cards have contour art, and the Band has a contour field. The "Counted from GitHub" block has only three numbers and no object. On hanzo-app the rows have no sparkline (zero data), so the right 40% of every row is blank.

**4. Is there one ask in Hanzo's words, in the sticky header, with nothing floating over content? Does scale have rhythm?**
Not quite. The header ask swaps to "hanzoai on GitHub" once the hero ask leaves view, which is right. But there are two solid fills in one viewport:
- At 375×812 the header keeps a solid "Try Hanzo" above the solid hero "hanzoai on GitHub" the whole time.
- On desktop both are solid for the first ~1.5 s, before the header ask turns outlined.
- With the repository sheet open, the header's solid ask stays bright above the scrim, next to the sheet's own solid button.

The header behaviour is shared chrome. The cookie card (shared) covers the stats at both sizes; at 375 it is about 200 px tall. Scale has rhythm: one big figure per screen (568,900 at about 84 px, then 159,289 lower down), medium headings at 26 px, small mono metadata.

**5. Does every hover and press answer, with no jumps?**
Mostly. A row hover fills grey and darkens its sparkline. A press scales the row to 0.982. A click opens a sheet with the description, stars, forks, commits, a monthly chart, `git clone` with a GitHub/Forge toggle, and a copy that puts exactly `git clone https://github.com/hanzoai/ui.git` on the clipboard. Focus moves to Close and Tab is trapped. Filters, sort and search all work: Rust gives Rust repositories, Stars re-sorts, "mcp" leaves 1 row.

Three things are wrong:
- **Esc returns focus to the skip link at the top of the document, not to the row that opened the sheet.**
- The sort and "All languages" controls are icon-only (clock, star, bars, grid). Hover gives no label or preview, so the hover tells you nothing.
- Row 01's sparkline is drawn dark at rest, so the first row looks selected when nothing is.

No layout jump on hover.

**6. Do overlaps, a font swap or layout shift appear anywhere?**
- **Layout shift** is excellent: CLS 0.0007 over a full desktop walk and 0 on the phone. All three shifts come from the shared header's right cluster (`is_View _marginInlineStart-_lg_auto`), at about 1.1 s and on scroll.
- **Overflow and font swap:** none at 320, 375 or 1470 (scrollWidth equals the viewport). The h1 box stays still.
- **Overlaps:** the cookie card over content (shared chrome). The card-open stage puts a 106 px title over a blank page for about 2.2 s (question 7).
- **Console:** `A tree hydrated but some attributes of the server rendered HTML didn't match the client properties`.
  - It fired on 5 of 5 fresh loads at each size on both members (20 of 20). It did not appear on 10 loads that waited for network idle, so it depends on timing.
  - The diff names the page's own search field, `<label className="xos-search"> <input type="search" placeholder="Search 461 repositories" … - style={{}}>`, under `v2f-grid > xos-tools`, and the shared `<FooterHTML> <div data-x-shell="footer" dangerouslySetInnerHTML={{__html: "<footer class=\"is_View _paddingInline-…"}}>`.
  - The footer half is shared chrome; the search input half is this template's.
  - It puts the red "1 Issue" badge on screen in dev.

**7. Which reference does it feel like, and is that reference's motion actually there?**
It aims at synchronized.studio (a card opens into its page) and an Apple-style figure moment. The figure moment is there. The card open is not, measured frame by frame after clicking `hanzobot`:
- The URL changes within 200 ms.
- Then a white stage holds a `P.x-stage-t` title at 105.84 px, y 581, until about 2.2–3.0 s. The cap is 700 ms.
- The real h1 sits at y 173 and 52 px, about 400 px away. The brief says within 12 px.
- One run took 1.5 s before the URL even changed.

Back reverses correctly: you land on the org rail with scroll restored at y 3023. The transition engine is shared chrome, but the family's org cards trigger it and the family's hero is where it has to land.

**8. Is it different from its neighbours, with its own hero medium and signature?**
Within the family, members differ only by data and the contour seed, which the brief allows for families. hanzo-app swaps the bar chart for a repo-name marquee, which is a nice data-driven variation. Its signature, a live figure card plus rows that open into sheets, belongs to this family. I did not compare it against the /oss index in this walk.

**9. Is every one of the 18 parts covered?**
No. Gaps:
- **Part 2:** no breadcrumb at depth 2.
- **Part 8:** focus is not returned when the sheet closes.
- **Part 3:** Morph timing and landing are off.
- **Part 4:** two solid fills.
- **Part 13:** a console error.
- **Part 15:** the phone rows are about 85 px, not 72 px.

What is covered:
- Phone rows hide the description, commits and push date, but all of them appear in the tap sheet.
- JS off is fully legible (figures are in static HTML).
- Reduced motion shows the final state and leaves 0 running animations after 3.8 s.
- 44 px targets hold on the phone.
- Zeros are handled with restraint (hanzo-app's Forge zeros sit in a small sentence line, never at hero size).
- The Band closes the page with the org name and the ask, straight into the footer.

**10. Are there any banned tells?**
None of the listed ones. There is no hue, gradient text, Inter, coloured stripe or three icon boxes. "OPEN SOURCE · HANZO" is set under the lede, not above the h1. Arguably "everything quiet, rows all the same" edges towards a dead look below the fold, but motion exists.

**11. Is the copy untouched?**
It appears so. Hanzo's own wording and figures are shown as given, including "1 forks", "1 public repositories" and "[Legacy] Hanzo app templates — see github.com/hanzoai for current projects". Nothing was rewritten that I could see. Descriptions are hidden on phone rows but present in the sheet.

## Fixes (ordered by impact)

1. **Fix the card-to-page open** (shared engine, triggered by the family's org cards). The stage hold should be 700 ms or less from click to the settled page, measured at 80 ms intervals. The flying title must end within 12 px of the destination h1 (currently y 581 at 106 px versus y 173 at 52 px). Never show a blank white page behind it: the destination hero should be visible under the title by 300 ms.
2. **Remove the hydration mismatch.**
   - Search input (this template): render the same `style` on server and client, or remove whatever writes inline style to `input[type=search]` before hydration.
   - Footer (shared): make `FooterHTML` emit identical HTML on server and client.
   - Target: 0 console errors over 5 fresh loads at both sizes, with the same timing as the walk (`waitUntil: 'commit'` plus screenshots every 250 ms).
3. **Have one solid fill per viewport.**
   - At 375 the header ask must be quiet or swapped while the hero ask is on screen.
   - On desktop it must start quiet, not solid for 1.5 s.
   - While the sheet is open, the header must sit under the scrim (z 60 or lower versus the sheet at 90).
4. **Return focus to the row that opened the sheet** on Esc, Close and scrim click. The check: after Esc, `document.activeElement` is the row button.
5. **Make the hero a composition, not a header block.** Close the roughly 170 px dead zone above the h1 on the left at 1470×801. Either put the h1 baseline near 38% of 100svh with the lede beside it, aligned to the bottom (brief part 3), or let the figure card rise into that space so the first screen has one object, not white space plus a strip.
6. **Break the document below the hero.** Make the two "Counted" blocks one pinned stage at 900 px wide and above, where the GitHub figures hand over to the Forge figures (one in, one out), instead of two stacked text-left/numbers-right blocks. On sparse members (hanzo-app) collapse the lone "1 forks / 0 stars" into the small sentence line the Forge block already uses, so there is no 60% empty row.
7. **Label the icon-only controls.** On hover and focus, show a `Tip` with the existing accessible name ("Recently pushed", "Stars", "Commits this year", "All languages") within 150 ms, or set the label beside the active icon. The hover must tell you something.
8. **Draw row 01's sparkline at the resting grey** like the other rows; reserve the dark ink for hover and focus.
9. **Sparse rows:** where a repository has no monthly data (all of hanzo-app), close the empty right 40% of the row, for example by letting the meta line span it. Do not leave a blank column.
10. **Phone rows** at 72 px (currently about 85 px), per part 15. Put the sort pill on the same line as the search field at 375 so the controls take one row less.
11. **Add the breadcrumb** at depth 2 ("Open source / Hanzo AI", using the nav's own labels, last item not a link).
12. **Cookie card** (shared): 160 px or less at 375×812 (currently about 200 px), and it must not cover the first stat row at 1470×801.
