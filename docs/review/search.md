# /search: James-eye review

Verdict: 7/10
First complaint: "On the phone the last chapter gets swallowed by the black section. The answer card has no bottom and the second source has gone under it. And on the desktop, if my mouse brushes over one of the steps in the dark section, it stops moving and never starts again. It's nearly there, but those two things make it look broken."

I walked the page on 7 Nov on the dev server (localhost:4180/search/), moving, at 1470×801 (hover-capable Chromium) and at 375×812 (touch), with the cookie bar dismissed. For each screen I took two shots about 1 s apart. I also wheel-scrolled the whole page under a layout-shift observer with video recording on, hovered and pressed every main control, and held the dark room and Frameworks idle for 4 to 6 s. Working files are in `/tmp/claude-0/critic-search2/`. Parity: `/search: OK text 103/103 links 14/14`.

Proof:
- `img/search-phone-rag-cut.jpg`: at 375×812, the black "How it works" room cuts across chapter 04's answer card.
- `img/search-room-held.jpg`: the dark room is stuck on Step 02 for 6 s after the pointer crossed the step card once.

## The 11 answers
1. **Does it sell in 5 seconds and move within 1 second?** Yes, at both widths.
   - "Hanzo Search" is 52px (40px on phone). "HYBRID SEARCH + RAG" sits under it as a mono caption, then the lede and "Read the docs" with "GitHub →".
   - Below that, a search bar the width of the page types "Kubernets" within about a second. The four mode tabs then take turns with a gliding pill.
   - The 300 ms and 1 s shots already differ.
2. **One in, one out, or a document?** One in, one out.
   - The chapters pin, and one picture changes per chapter: the corrected word, the meaning map drawing its three lines, two lists fusing into one rank, and a streamed answer.
   - The dark room runs its three steps by itself, Frameworks cycles its names, and the fit-finder rolls up to "fits Build" once.
   - The close retypes the query and fuses the lists (checked frame by frame; every row stays readable).
   - The phone page is long (13,000px) because the chapters stack, which is correct under 900px.
3. **Does every section hold a real object?** Yes.
   - Hero: the bar. Chapters: four pictures. Dark room: a small bar showing documents landing, then three callers, then an answer.
   - Frameworks: a picker that drives its own bar. Pricing: the fit-finder (four ArrowRight presses on Projects give "fits Enterprise", which is correct). Close: the bar with the merged rank.
   - The weakness is that the same search-bar object appears five times (hero, chapters 01 and 03, the dark room, the close). It is on concept ("one query, four answers"), but it borders on repetition.
4. **One ask, nothing floating, scale with rhythm?** It passes on desktop.
   - The header outlines "Try Hanzo" while the hero's solid "Read the docs" is on screen. Once the hero ask leaves view, the header carries a solid "Read the docs".
   - On phone the header keeps a solid "Try Hanzo" and the hero ask is outlined. But in the phone close, the header's solid white "Try Hanzo" and the Finale's solid white "Read the docs" share one viewport, so there are two solids.
   - Nothing floats over content.
   - Scale has rhythm: h1 52, heads 26, "Kubernetes" 64px Air as the one big thing in chapter 01, then prices, framework names and small mono captions.
5. **Does every hover and press answer, with no jumps?** Mostly.
   - The solid ask darkens. Plan and Finale CTAs press to scale 0.98. Mode tabs fill on hover and hold the mode on click. Framework rows hover and drive the bar. Steps on hover drive the room. The Console drawer opens a sheet and closes with Esc. The fit sliders are styled, not browser default.
   - Flaw: the hover on a step (and on a framework row) sets a permanent "mine" latch in `useSteps`. Once any mouse crosses a step card, the dark room never advances again. In my walk the pointer only passed over it on the way to another control. That hover is a hold that never lets go, which James will read as the page going dead.
   - The hero "GitHub →" link shows no measurable change in colour, border or transform on hover (`.l2-stage a:has-text("GitHub")`).
6. **Overlap, font swap or layout shift?** There is one overlap on phone.
   - At 375×812, chapter 04's picture (`.se2-way`, 3684 to 4154px) runs 60px past its pin container, which ends at 4094px where `.se2-how` begins. The black room covers the bottom of the answer card and the "[2] How it works" source (see proof).
   - CLS is 0.011 on desktop (from list rows) and 0.001 on phone. There is no font swap.
   - The h1 box is steady. There is no horizontal scroll (scrollWidth 1470 and 375).
   - One run showed a hydration-mismatch warning on phone. I could not reproduce it in six fresh loads (all clean, no console errors), so I have not counted it.
7. **Which reference does it feel like, and is its motion there?** apple.com product pages: one idea per screen, pinned scrubbed chapters, the product (the bar) as hero, a persistent ask. The pinned chapters and the line work are present.
8. **Different from its neighbours?** Yes. Its own medium is a Spotlight-sized live search bar, and its signature is "one query, four answers".
9. **Are all 18 parts covered?** Largely, from what the page shows.
   - Present: header comment, one h1, `Cta` with `data-cta`, a pause control first in each self-running object, real `Drawer`, styled range inputs, a closing Band and footer.
   - Not verified here: sound and tracking (both shared).
10. **Banned tells?** None. There is no hue, gradient text or icon boxes. The kicker sits under the h1, not above it. The three plans are stacked rows, not three boxes in a row.
11. **Is the copy untouched?** Yes. Parity is 103/103 text and 14/14 links.

## Fixes to reach 8
1. **Phone overlap:** make the PinScenes stack contain chapter 04's picture at ≤899px, so `.se2-way` ends inside its container and the room starts below it with its full gap. The likely causes are a fixed height on the stacked item or a negative margin; the streamed answer plus sources is taller than the slot. Check 375×812 and 320.
2. **The hover latch:** let a mouse hover hold a step or a framework row only while the pointer is on it. Resume auto-stepping on pointerleave. Keep the permanent hold for click, tap and focus only, or let the room's pause button own "stop". This applies to `How` and `Frameworks`; fix it page-locally rather than changing the shared `useSteps`, for example with a page-local hover flag passed as `live`.
3. **Phone close:** one solid per viewport. Make the Finale ask quiet on phone while the header's "Try Hanzo" is solid there, or request the shared slim-bar or header hand-off.
4. **Hero "GitHub →":** give it a visible hover, such as an arrow nudge or an underline draw, not nothing.

Shared chrome (not counted): the dev overlay can cover the phone's bottom-left slim bar, and the header's room detection lags one frame after an instant scroll into the dark room.
