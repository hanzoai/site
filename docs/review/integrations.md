# /integrations — James-eye review
Ready: 2026-11-07 card opens into its own sheet and its way in lands at the guide's top on phone (no glide), no empty bands around the pinned track (room rises over its end), phone rows show Hanzo's sentence, bare marks on the ring (no grey tiles), family hash in the URL, pressed arrow goes ink, dark-room ask hover answers, phone code keeps its shape; hydration error traced to the screenshot tool (0 in 12 painted loads); header/glass items filed in docs/requests/integrations.md
Verdict: 6/10
First complaint: "I click a card and nothing opens. It just jumps to another page, and on my phone it lands halfway down with no header and then scrolls itself back up. That's the one moment this page is meant to have."

Walked moving on 7 Nov with Playwright at 1470x801 and 375x812, deviceScaleFactor 1: frames every 250 ms for 8 s with no input, a slow wheel scroll through the whole page, hover and press probes on the hero ask, orbit chips, cards and filter tabs, a search with a hit and a miss, three click-throughs per size (the first and second as warm-up, the third judged), Back, JS off, reduced motion and 320px. "Shared chrome" marks complaints about the site header, footer, cookie card or dev overlay, not the page itself.

## The 11 answers

**1. Sells in 5 s, moves within 1 s?** Yes. The h1 "Works with everything" cuts in by about 250 ms. The base-URL lede and "Get an API key" are on the first screen at both sizes. The orbit of 19 marks around the black "api.hanzo.ai/v1 / 19" core is already turning at frame 0, so it sells "one URL, everything plugs in" at a glance. On phone the orbit sits below the ask and the bottom of the ring falls under the fold.

**2. One in, one out, or a document?** Mostly a document after the hero. Hero, rotating code block, grid, black "Paste and ship" room, footer. Each section is one idea. But between the code block and the black room the scroll is a long run of the same grey card (19 cards on desktop; 19 stacked rows of about 78px on phone, roughly 1,500px). Nothing in that run changes as you scroll. The black room does open from an inset rounded card to full width as you reach it (good). Under the grid there is a 150px empty band before the room.

**3. A real visual in every section?** Yes. The orbit of real marks, the code block that rotates between languages on its own, the grid of marks, and the agent-prompt terminal in the black room. The initials "Co", "Ds" and "AG" stand in for tools that publish no mark, as briefed. They read as honest, though they are the weakest tiles.

**4. One ask in the header, nothing floating; scale rhythm?** Not yet. The header ask says "Try Hanzo" on the hero while the page's ask is "Get an API key". On desktop the header changes to "Get an API key" once the hero leaves. On phone it stays "Try Hanzo" and stays solid for the whole page. So the phone's first screen has two solid black buttons with two labels (proof 3). The black room adds a third solid "Get an API key", next to the header's on desktop. During its crossfade (about 300 ms) the header ask passes through a flat mid-grey that looks disabled (desktop scroll frame s008). Nothing floats over content apart from the cookie card. Scale has rhythm: a 52px h1 against a 64px-plus "19" in the core; wide cards (with descriptions) set against narrow ones (titles only) in the grid; a 26px "Paste and ship".

**5. Does every hover and press answer, with no jumps?** Largely yes, and well. Hero ask: hover lifts 1px and fills #2a2a2c, press scales to 0.97. Orbit chip hover: the chip turns black and the core swaps "19" for the tool's name and category (proof 1). This is the best detail on the page. Card hover: the fill goes from #f5f5f5 to #ededed, the arrow chip turns solid, and a hidden description slides in (for example Anthropic SDK); press scales to 0.97. Filter tabs: hover fills #e4e4e7, and selecting one changes the h2 to the tab name and counts down to 7. Search: "rust" leaves 1 card and dims the empty tabs to 0. "zzzz" gives "Nothing matches 'zzzz'." with an "All 19" reset. Three gaps remain. On a click the arrow goes flat grey for 300 to 500 ms, which reads as disabled rather than pressed. The descriptions revealed on hover never appear on touch. Filtering is an instant swap with no visible glide between frames 100 ms apart, and it does not write a hash.

**6. Overlap, font swap, layout shift?** CLS 0.0002 on load and 0.0004 after a full scroll at 1470x801; 0 at 375x812. The only shifts come from the header's tool row (the Sound icon arriving after hydration; shared chrome). No horizontal overflow at 375 or 320 (scrollWidth equals clientWidth). The h1 box does not move. The orbit's off-screen chips on phone are clipped inside it.

Console errors on plain loads:
- 0 in 5 networkidle loads, and 0 in 10 more loads with a 6 s wait.
- The hydration error appeared on 4 of 21 loads overall: whenever frames were being captured during hydration (both sizes in the first walk, and both desktop loads in a later 4-load run).
- Error text: "A tree hydrated but some attributes of the server rendered HTML didn't match the client properties…"
- It names two components. One is the page's own search `<input type="search" placeholder="Find your tool">` inside `.xii-cat-top > label.xii-find`, with server `style={{}}` against client. The other is `<FooterHTML>`, whose `__html` string differs (shared chrome).
- It raises Next's red "1 Issue" badge, which sat on top of "Reject all" on phone.

**7. Which reference, and is its motion there?** It is meant to be synchronized.studio (card opens into its page). That motion is absent. Desktop, third warm click: the URL changes about 300 to 500 ms after the click. The destination h1 then cuts in by word mask at its own place (159, 197). The card's mark and title do not travel and nothing grows out of the card: it is a plain route change. Phone, third warm click: the destination paints at the old scroll offset with no header and a white band at the bottom (proof 2). It then scrolls itself to the top over about 700 ms, with the h1 moving from y=-584 to 76. Back returns to the grid at the right offset. The orbit is the page's own idea, not a reference's.

**8. Different from its neighbours?** Yes in the hero. A rotating mark orbit around a count is its own medium. The grid of grey numbered cards ("01 / 19") and the black "Paste and ship" room are the shared Catalogue and closing patterns, so below the hero it reads like its siblings.

**9. All 18 parts covered?**
- Covered: the hero count and search; filter tabs with counts; a numbered grid; an empty state; JS off (fully legible at both sizes, and the hero arrives through CSS); reduced motion (static, `getAnimations()` empty); pause controls on the orbit and the code block; a 72px-class phone list; links that are real `<a href>`.
- Missing or weak: the Morph (part 3, part 15); a gliding filter pill and hash sync (part 6); the one-place solid fill and sticky ask behaviour on phone (part 4); 44px touch targets (the orbit chips are 36 to 44 x 36 at 375); "never an icon in a rounded box" (part 7), which the grey rounded tiles of the orbit and the phone rows break; a quiet hydration log (part 13).

**10. Any banned tells?** None outright: no hue, no gradient text, no emoji, no eyebrow above the h1. These are close to the line:
- The marks sit in rounded grey squares in the orbit and the phone rows (the icon-in-a-box rule).
- The sticky "INTEGRATIONS 19" sub-bar under the header repeats the h2 as a mono label.
- The header glass, over the dark code block and the black room, turns into a grey smear with white end caps; over the footer on phone it turns solid black (shared chrome).
- The header ask's mid-crossfade grey reads as "a button that fades" (shared chrome).

**11. Is the copy untouched?** The words seen are Hanzo's own, and tools without descriptions on hanzo.ai show none. Two notes:
- The h2 swaps its words from "Integrations" to the selected tab label (for example "Frameworks") on filter. Those words are Hanzo's, but the heading changes.
- The index ask says "Get an API key" and the destination's says "Get API key — Free". That is not a rewrite, but it is a CTA-label question for James's list.

## Proofs (overwritten 7 Nov)
- `integrations/1-hero-emoji-orbit.jpg`: desktop hero with an orbit chip hovered. The chip turns black and the core names it ("OpenAI Python SDK / AI SDKs"). The header still says "Try Hanzo" while the page asks "Get an API key". (It no longer shows emoji; the file name is kept as instructed.)
- `integrations/2-card-open-blank-emoji.jpg`: phone, third warm click on the Cursor card. The destination paints at the old scroll offset with no header and a white band at the bottom, before it scrolls itself up. No card-to-page open.
- `integrations/3-double-ask-and-gap.jpg`: phone first screen. Two solid black asks with two labels: header "Try Hanzo" and hero "Get an API key".

## Fixes (by impact)
1. **Build the Morph.** On card click, the card's mark and title move to the destination hero in 600 ms (ease-in-out), with a 250 ms crossfade fallback. The title must land within 12px of the destination h1, and Back must reverse it. Reduced motion is a cut. Measure the title's x/y at the end of the frame sequence against the h1.
2. **Fix the phone arrival.** The destination must paint at scrollY 0 with the header present on its first frame after a card tap: no visible scroll-to-top and no white band. Check frame by frame at 100 ms that the h1's y is 76 from the first destination frame.
3. **One solid ask, one label.** On this page the header ask reads "Get an API key" at both sizes from the first frame. It is quiet (outline) while the hero ask is on screen and solid only after it leaves. At most one solid fill per viewport at 375x812 and 1470x801, including where the black room's "Get an API key" sits beside the header (shared chrome request for the header part).
4. **Clear the hydration mismatch on the search input.** Server and client `style` must match on `label.xii-find input`. Target 0 errors in 10 fresh loads with frames captured during hydration, at both sizes. Send the `FooterHTML` `__html` mismatch to the footer owner (shared chrome).
5. **Make the grid scroll alive.** Add one list-level entrance (not per card), or a scrubbed counter that ties the "01 / 19" index to scroll. Close the 150px empty band under the grid so the black room overlaps the grid's end by about 40px.
6. **Show the descriptions on touch.** Where Hanzo has a description, a phone row shows its first line, or opens it inline on tap. Hover-only text must not be the only path.
7. **Animate the filter.** A gliding pill between tabs (300 ms, ease-emphasis) and a cross-fade of the cards (150 ms out, 300 ms in). Write `#frameworks` and similar to the URL, and open by hash.
8. **Touch targets of 44px or more** for the orbit chips at 375 (now 36 to 44 x 36). Drop the grey rounded tile behind each mark, or make it the card itself, so it no longer reads as an icon in a box.
9. **Pressed, not disabled.** On click, the card's arrow chip goes solid ink at scale 0.97 instead of flat 50% grey, and the header ask's crossfade never passes through a mid-grey (shared chrome).
10. **Header glass over dark rooms (shared chrome).** Over the code block and the black room the header must be either clean glass or a dark header. No grey band with white end caps, and no solid-black header over the light footer on phone.
