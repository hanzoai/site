# /metrics: James-eye review

Verdict: 6/10
First complaint: "It's orange again. I said greys, silvers, blacks and whites, and colour only from our own media, but the chart, the bars, the tags and the arrow are all orange. There's a little label stuck on top of the headline too. And when it opens I'm looking at a big title on white with the chart cut in half at the bottom of my screen."

Reviewed: branch `claude/elegant-johnson-b2vx1q` @ `e02c4dc` (not on main yet). Files hash: `371e08d88787`
Walked 7 Nov 13:30–13:45 UTC on the dev server, moving, at 1470×801 and 375×812 (videos, frame sheets and a frame-difference motion log kept by the critic; the once-per-visit site loader was skipped so the page is judged on its own).
Proof: `img/metrics.jpg` (desktop first screen | phone first screen).

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Half. The words are clear ("Hanzo Metrics / The metrics half of Hanzo O11y"), and the chart streams by itself, so something does move without input. But at 1470×801 the console sits on the fold: you see its toolbar and the top of one orange curve, not the product. The headline is hidden until the page's script runs: on the dev server the first screen is a lede and a button on white for about 2 s, then the 128px title appears in one step. Phone is better: the live chart is on the first screen.
2. **One in, one out, or a document?** Mostly one in, one out. The six points are one pinned table that changes per chapter (01/06 to 06/06), which is the right Apple move. After that it turns back into a document: the dark room, then a "Related capabilities" list, then the Get block.
3. **A real object in every section?** Yes for the hero (live chart, then traces), the chapters (the table) and the dark room (console with services building). The closing "Get Metrics" block has a faint Sigil but no object.
4. **One ask, sticky after the hero?** No. Desktop: the page's ask is "View on GitHub", but after the hero the only sticky button is the global header's "Try Hanzo". Phone: the header's "Try Hanzo" and the bottom bar's "View on GitHub" are two solid buttons on every screen. The close adds a third solid ask, "Deploy to Cloud", on the same screen as both.
5. **Every hover and press answers?** No. Hero "View on GitHub": no hover change and no press state. The per-model / per-route / per-tenant tabs: no hover at all (they do press to 0.98). The chapter dots only change opacity on hover (a banned tell: "buttons that fade on hover"). Copy presses well (0.94). Pressing a chapter dot jumps the page back up to that chapter, mid-scroll, which feels like a jump. Nothing on the page follows the pointer: no magnetic ask, no tilt, no cursor-aware light.
6. **Overlap, font swap, layout shift?** None found. CLS 0 on desktop, 0.022 on phone (the "what" section and the falling list settle once), h1 box steady, no horizontal scroll at 375.
7. **Which reference, and is its motion there?** apple.com product page: the pinned table that changes per chapter is there and is the best part. synchronized.studio (card opens into its page) is absent: "Related capabilities: Logs" is a plain row link. No anthropic-style hero figure.
8. **Different from its neighbours?** No. The first screen is the shared Cloud kit skeleton: a two-line 128px "Hanzo X" on the left, lede and one black button on the right, a console strip on the fold, pinned 0N/0N chapters, one dark room, a "Get X" block. /ledger has the same first screen and order. James: "It's not just a template."
9. **All 18 parts covered?** No; see below. `docs/coverage/metrics.md` is missing.
10. **Banned tells?** Yes:
   - Orange UI hue throughout (chart series, trace bars, "alert rule" and "token · org a" pills, tenant column, arrow). JAMES.md rule 7: the UI has 0 brand hues.
   - "● METRICS.HANZO.AI" eyebrow 22px above the h1.
   - A green "api" tag in the dark room's agent prompt (green accent).
   - Opacity-only hover on the chapter dots.
11. **Copy untouched?** Yes. Parity 59/59 text and 12/12 links. The added strings are drawn demo data (query, table rows, service names) plus a few labels ("a spike is the start of a question", "series = models", "1 more column"). They read as UI, not as new claims.

## Missing from the 18 parts
The component master plan (`docs/PLAN-COMPONENTS.md`) has not landed, so this uses the 18 parts BRIEF-v3 implies. It will be rechecked against the plan when it lands.
- **Sticky ask on desktop**: there is no page-ask bar or sub-nav after the hero.
- **Local sub-nav**: no product sub-nav with tabs and the ask (BRIEF 3.3 rule 3).
- **Proof / figures**: none, though "4 stars" sits in the close. That is fine if Hanzo has no figure, but nothing is a hero number.
- **Card-to-page continuity**: "Related capabilities" does not open into its page.
- **Pointer layer**: no hover detail on the console or table rows.
- **Loading/error states** for the live chart are not visible.
- **Coverage file**: `docs/coverage/metrics.md` is missing.

## Fixes (in order)
1. **Take the orange out.** Draw the zen/kai/enso series as ink, mid grey and light grey (weight or dash to tell them apart), and make the trace bars, pills, tenant column and arrow grey or ink. Remove the green "api" tag too.
2. **Delete the "● METRICS.HANZO.AI" eyebrow above the h1.** If the address must stay, put it in the console toolbar, where it already appears.
3. **Make the first screen the product at 1470×801.** Shrink the gap so the whole console is visible under the title, or put the console beside the title at full height. Render the h1 visible in the server HTML: the cut-in may animate from a visible state, but never from nothing.
4. **One ask.** Choose the page's verb (it is "View on GitHub" in the hero), make the phone bottom bar and a desktop sticky bar carry that same verb, and make the close repeat it as the one solid button. "Deploy to Cloud" becomes the text row beneath.
5. **Every control answers.** The hero button and tabs need a visible hover that is not opacity (fill or ink shift, an arrow nudge) and a press of scale 0.98. The chapter dots need a real hover (a width or label reveal), and clicking one should scrub the pinned table, not jump the page.
6. **Break the template.** Give /metrics a first screen /ledger doesn't have, for example the chart full-bleed behind the title with the spike landing under the cursor. Make "Related capabilities" a card that opens into /logs.
