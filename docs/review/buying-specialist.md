# /buying-specialist — James-eye review

Verdict: 7/10
First complaint: "On the phone the promise list slides under that black card and the headline gets sliced off, and there are two black buttons fighting at the top. Sort the phone out and this one's there."

Walked 2026-11-07, HEAD ca765e59, at 1470x801 and 375x812 (touch). First screen sampled at 0.2/1/3/6/9 s plus a reload; whole page scrolled in 60%-viewport wheel notches with 1 s dwell; hovered and pressed the chips and the primary; dragged the seat slider and used the arrow keys on it; tapped a chip on the phone; typed "We are 120 people" + Enter (chat and form POSTs to api.hanzo.ai blocked, so Hanzo's written fallback answers showed); reduced motion and JS off at both sizes. taste.py OK (3 files), parity OK (text 20/20, links 1/1).

## What works
- The hero sells at once: the greeting cuts in by line, and beside it a black quote sheet arrives and fills its seat grid (10 to 50 desktop, 10 to 25 phone) while the price rolls. About 23% of the frame changes between 0.2 and 3 s with no input, then it settles quietly.
- The signature is real: a chat answer re-sizes the quote. "10 developers" set the sheet to 10 seats at $200/$250; "120 people" switched it to Enterprise Configuration at $2,400/mo with the primary flipped to Start Enterprise Plan. Dragging the slider and the arrow keys re-price it and update the cart href (`quantity=16`).
- The desktop promises are a pinned scene: the six promises scroll on the right while the card on the left changes per promise (seats, price, typing into a prompt, page dots). That's the Apple "one panel changes" move.
- Header ask hands over cleanly on desktop: "Try Hanzo" goes quiet while the sheet's solid button is on screen, then becomes a solid "Start Team Plan →" once you scroll past it.
- Hover/press answer: chips change fill and border, the primary brightens, and press scales it to 0.98. No fades, no layout jump.
- Monochrome throughout. No hue, no kicker above the h1, and nothing floats over content apart from the shared cookie card.
- Reduced motion shows the final state immediately and stays still (the idle frames are identical). With JS off, the hero, the quote sheet, the promises and the chips all read.

## The 11 answers
1. Yes. Something moves within 1 s at both sizes (h1 cut-in, then the sheet arrives and the seats roll), and the offer is clear in 5 s.
2. Mostly one-in-one-out on desktop: hero, then the pinned promise stage, then the band, then the footer. On the phone the stage is a sticky card with the list scrolling underneath, which reads as a document sliding under a lid.
3. Yes: the quote sheet, the promise card (which renders the page's own UI), and the band. The band is the weakest: one repeated line on black.
4. Desktop: one ask, and the header takes it over. Phone: the header keeps a solid "Try Hanzo" for the whole page while the mini-quote's solid "Start Team Plan →" sits in the same first screen, so there are two solid fills and the header never carries the page's ask. Scale has rhythm: 52px h1, a 64px-class figure in the sheet, small chips, and a big 88px band moment.
5. Yes on both (see What works). Chips show no press transform, which is minor.
6. Phone 375: in the promise stage the active heading lands against the sticky card's bottom edge with its top pixels cut ("A sales rep if you want one."), and list text passes under the card. The bubble inside the card is cut mid-line ("self-serve setup (20 to 500 seats) and…"). Desktop: while the dark sheet is under the header (scroll about 270–560px), the shared header switches to dark glass over a white page, so the whole header becomes a grey band. No font swap or CLS seen.
7. Apple product page (live configurator plus a pinned scene) crossed with chatgpt.com/business calm. The pinned stage motion is genuinely there on desktop and only half there on the phone.
8. Yes. A configurator plus chat is its own medium and signature. It is not a template hero.
9. Mostly covered: one h1, the sticky ask, `data-cta` on the primary (`buying-specialist.quote` / `.mini`), the Privacy line by the submit, the Band then the footer, reduced motion and JS off. Not verified: sound on the primary and chips.
10. None found. The "SAVE 20% ANNUALLY" pill sits beside the card title, not above a heading. The four suggestion chips are equal pills but read as chat prompts, not a button row.
11. Untouched (parity 20/20, 1/1).

Console: no page errors. A hydration diff appeared only when a screenshot was taken mid-hydration: Playwright's injected `caret-color` on the range input, plus the FooterHTML diff. It did not recur in 4 clean loads, so it is not the page's. BlogIndex.jsx parse error overlay belonged to another page being edited, not this one.
Shared (not counted): FooterHTML hydration diff; kit `Band`/`Words` heading stays blurred with JS off ("The fastest path in." unreadable on the JS-off capture); cookie card covers the lower screen on both sizes.

## Fixes (in order)
1. Phone promise stage: stack it under 900px as MASTER says. Each promise gets its own card render, or the card unpins, so no heading slides under or butts against the sticky card. Give the active item at least 24px clearance, and let the in-card answer bubble end on a whole line or fade under a gradient instead of a hard cut.
2. Phone ask: one solid fill per screen. Make the header ask quiet while the mini-quote's "Start Team Plan →" is visible, then hand the header the page's ask once it scrolls out, as desktop already does.
3. Desktop header over the hero sheet: the sheet's `data-room="dark"` flips the shared header to dark glass over a white page (grey band at scroll 270–560). Stop that sheet from counting as a dark room for the header, or limit the flip to full-bleed dark sections.
4. Give the closing band an object or a small live echo of the quote (seats and price), not only the repeated line.
5. Add a press response to the suggestion chips (scale 0.98 or translateY 1px), and check the tick sound on chips and the slider.
