# /affiliate — James-eye review

Reviewed: main, page files at `d6275ed` (7 Nov 13:17). Walked moving at 1470×801 and 375×812 (videos, hovers, presses, idle checks).

Verdict: 6/10

First complaint: "Why is there still a little orange label sitting on top of the headline? I said no tags over the title, and orange isn't us. Hanzo is black and white."

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes on both. "Refer customers to Hanzo" reads at once and the big address bar starts typing the link straight away. But the typing loops forever (it retypes every few seconds), which is decoration on repeat.
2. **One in, one out?** Yes on desktop: the four steps pin on the left while one card on the right changes (01 / 04). On the phone the steps become a plain stack of cards, so it reads more like a list.
3. **A real object in every section?** Mostly. Hero bar, step cards, the dark "attribution check". The closing band is text and a button only.
4. **One ask, sticky after the hero?** No on desktop. The page's ask is "Apply", but after the hero the only solid button left is the header's "Try Hanzo", a different ask. At the top there are two solid buttons at once (header "Try Hanzo" and "Apply"). The phone gets it right with an "Apply" bar at the bottom, though the header still shows "Try Hanzo" beside it.
5. **Every hover and press answers?** Weak. Hovering "Apply" only nudges the arrow a few pixels; pressing it shows nothing. No jumps.
6. **Overlap, font swap, layout shift?** None found. Layout shift 0.0001 desktop, 0.003 phone; the headline box never jumps.
7. **Which reference, and is its motion there?** apple.com product page (pinned chapters with a counter). The pinning is there on desktop. Nothing from synchronized.studio or osply beyond the line-mask headline.
8. **Different from its neighbours?** Yes in idea: the self-typing address bar is its own object. The opening layout (white page, big left headline, lede and pill on the right) is the common one; watch that the other programme pages do not repeat it.
9. **All 18 parts covered?** See below. `docs/PLAN-COMPONENTS.md` is not on main yet, so this is checked against the parts the brief names.
10. **Banned tells?** Yes, two:
    - An eyebrow above the headline ("• AFFILIATES", orange dot, mono caps).
    - A UI colour: orange on the dot, the "POST" chip, the step numbers, `<code>`, the tick and the timeline. JAMES.md allows 0 UI hues.
11. **Copy untouched?** No. All of Hanzo's words are there (parity 15/15), but new words were added: step titles "Reviewed", "Your link", "Attributed", the heading "Who an org is attributed to.", the three case names, "Attributed to you." and "Not to you." Copy is frozen; labels must come from Hanzo's own text.

## Missing from the 18 parts
- Sticky ask on desktop after the hero (the page's own "Apply").
- Press state on the main button.
- A real visual in the closing band.
- Phone: no swipe or pinned moment for the steps; they are a static stack.

## Fixes
1. Remove the orange dot and the "AFFILIATES" kicker above the h1. Keep the word in the HTML elsewhere (for example in the page title area of the header or a breadcrumb), not over the headline.
2. Turn every orange into the ink and grey ladder (black, white, alpha steps). No hue in UI.
3. Make "Apply" the one solid ask: hide the header "Try Hanzo" button on this page, or swap it to "Apply" after the hero, on desktop as well as phone.
4. Give "Apply" a real press (scale 0.98 or 1px down) and a hover that changes more than the arrow.
5. Type the address once, then stop. Let it rest on the full link.
6. Replace the invented labels with Hanzo's own sentences (for example, use "We review the application and reply." as the step itself) or drop the labels and let the number carry it.
