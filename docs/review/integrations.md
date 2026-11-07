# /integrations — James-eye review
Verdict: 6/10
First complaint: "Why are the logos emojis? A whale for Docker, a snake for Python, a ship for CrewAI. It looks AI-made, not premium. And when I click a card I get a blank white page with a cartoon emoji floating on it. That's not a card opening into its page."

Walked on 7 Nov with Playwright at 1470x801 and 375x812 (DPR 1): frames every 250 ms for 8 s with no input, a slow wheel scroll through the whole page, hovers and presses on the hero ask, the orbit, the code tabs, Copy, the filter chips, search and the cards, and a click and a tap from a card through to its page and back. I also ran reduced motion, JS off, layout shift, console errors and overflow checks. Proof is in `docs/review/integrations/`.

## The 11 answers

**1. Does it sell in 5 s, and does something move within 1 s?** Mostly. "Works with everything" cuts in at about 0.5 s, the lede and asks follow, and the orbit of 19 tiles around the black "19" disc drifts by itself (about 16 px/s). Hovering a tile swaps the disc to that tool's name and category, which is a good detail. What does not sell are the tiles themselves: they are greyed-out emojis (octopus, whale, snake, robot, handshake, ship), not real tool marks. Up close, the hero's one object reads as clip art.

**2. One thing in, one thing out, or a document?** Halfway. The hero hands over to a self-typing code block (Python, TypeScript, Go), and the black "Paste and ship" band wipes in. In between, the catalogue is 2,074 px of 19 near-identical grey cards, each with a 4 to 5 line paragraph. As you scroll it reads as a document. Between the code block and "Integrations" there is about 265 px of empty white (103 px + 162 px of padding), which feels like a dead pause, not a breath.

**3. Does every section hold a real visual object?** The hero has the orbit, the start section has the code block and the band has the agent-prompt console, so yes. The catalogue's only "visual" is a 36 px emoji per card. No real logos, screenshots or product UI appear anywhere on the page.

**4. One ask in the sticky header, nothing floating, and does scale have rhythm?** No. Once you scroll past the hero, the header ask becomes "Get an API key", and the 57 px local bar directly beneath it carries a second "Get an API key". From y=900 down, two identical asks sit 51 px apart, with 117 px of chrome on desktop. The hero and the band add a third and fourth. Scale is fine in the hero (52 px h1 against the big disc and 64 px-class "19"). The grid is one flat size for 19 cards, with no big, medium and small.

**5. Does every hover and press answer, with no jumps?** Largely yes. Hero ask: hover lifts 1 px and darkens, press scales to 0.97. Cards: the background lightens, the arrow fills black, there is a slight 3D tilt, press is 0.97, and the box does not move. Orbit hover shows the tool name in the disc. Code tabs retype, and Copy turns into "Copied". Search filters live, dims the empty chips and shows "Nothing matches "zzzz"". The filter chips change state, but I could not see a pill glide between them in the 150 ms frames: the black fill jumps.

**6. Overlaps, font swap, layout shift?** CLS was 0.0004 on desktop and 0 on phone. There was no font swap, and the h1 box stays put. I found no overlap with the sticky header. A hydration-mismatch console error fires on every load (on the search input's `style` and on the footer HTML), and the dev "1 Issue" badge shows in every frame. On the phone, the code block scrolls sideways inside itself (367 px of content in 343 px), so `base_url="https://api.hanzo.ai/v` is cut at the edge. The "SDK docs" link is a 22 px tap target. The page itself has no horizontal overflow at 375.

**7. Which reference, and is its motion there?** It is aiming at synchronized.studio's card-to-page open, and it fails. On click, the card fades and the emoji flies out. Then for roughly 900 ms there is a blank white page with a full-colour emoji (a teal chain for LangChain, a whale for Docker, a ship for CrewAI). After that the detail page arrives with a different hero. The next page's hero is not the card you clicked, and the in-between frame looks broken. The full-colour emoji is also the only hue on the journey.

**8. Is it different from its neighbours?** Yes. /models leads with the black model-card grid and /solutions with a stacked film card. The integrations orbit plus the typing code block is its own medium and signature.

**9. Are all 18 parts covered?** Mostly covered: a count as the focal figure, search, filter chips with counts, a numbered grid (`01 / 19`), a phone list of 72 px-ish rows, an empty state, reduced motion and JS-off. Weak or missing: real media (part 10), a Morph that holds the card (part 15), one ask (part 4), a clean console (part 13), and the phone code block (part 11). Sound kit: the mute toggle is present.

**10. Any banned tells?** "Low-contrast dark mode": the band lede "Paste this into any agent…" is #525252 on near-black, about 2.6:1, which fails AA. Emojis are not in headings, but emoji as brand marks gives exactly the "AI-made" tell he warned about. Desaturating them to grey makes it worse, because it amounts to filtering the imagery. There is no gradient text, Inter, purple or green. There is no eyebrow over the h1: the "INTEGRATIONS" mono label sits in the local bar, not above a headline.

**11. Is the copy untouched?** Yes. `scripts/parity.py /integrations` gives text 71/71 and links 21/21.

## Fixes (ordered by impact)

1. **Replace every emoji with the tool's real monochrome mark** (an SVG logo in ink on the deck's neutral tile) in the orbit, the cards, the phone rows and the Morph flyer. Done means no emoji glyph exists anywhere in `/integrations` or its 19 detail heroes.
2. **Make the card open a real Morph.** The clicked card, with its title and mark, should become the detail page's hero block in one move, with no blank white frame. The title should land within 12 px of the detail h1, and the hold should stay at 700 ms or less. Check it with 100 ms frames on desktop and on a phone tap, and confirm Back reverses it. A full-colour glyph must never appear on white.
3. **One ask on screen.** When the local bar is visible, drop "Get an API key" from either the header or the local bar. At any scroll position, at most one solid "Get an API key" should be inside the top 120 px.
4. **Turn the catalogue into a scene, not a document.** Give it scale rhythm: 2 or 3 feature cards large, the rest compact with the paragraph collapsed to 2 lines and revealed on hover or focus. Add a list-level entrance as rows enter. The grid should drop from about 2,074 px to 1,400 px or less on desktop without cutting any copy from the DOM.
5. **Close the dead gap** between the code block and "Integrations" from about 265 px to 160 px or less, and stop the 821 px hero leaving about 140 px of white under the orbit before the local bar.
6. **Fix the hydration error**, on the search input `style` and in the footer HTML, so the console shows 0 errors and the "1 Issue" badge never appears.
7. **Band contrast:** raise the "Paste this into any agent…" lede to at least 4.5:1 on black (for example the deck's #a3a3a3 or lighter).
8. **Phone code block:** at 375 px, wrap or reflow the code so no line is clipped, with no inner horizontal scroll, and keep Copy on the tab row instead of on its own line. Make "SDK docs" a tap target of at least 44 px.
9. **Filter chips:** add a visible gliding pill between chips that animates over 200 to 300 ms on the deck's curve, rather than a fill swap.
10. **Phone first screen:** the orbit starts at about y=380 and is half covered by the cookie sheet. Bring the "19" disc into the first 812 px, either by sizing the orbit to fit beside or under a tighter hero or by moving the asks.
