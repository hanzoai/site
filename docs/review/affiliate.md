# /affiliate — James-eye review

Verdict: 7/10
First complaint: "There's a big empty hole under the link before 'How it works', and there's a red error badge in the corner. It looks unfinished."

Walked 2026-11-07 16:17 UTC, HEAD aae15550, at 1470x801 and 375x812 (isMobile, hasTouch). Took first-screen shots at 0.2, 1, 3 and 6 s plus a reload, then scrolled the whole page in 200px (desktop) and 180px (phone) wheel steps with about 0.9 s dwell. Hovered and pressed the Apply button, the copy button, the email link and the three rule tabs. Collected console errors and checked CLS, `reducedMotion: 'reduce'`, JS off, `taste.py` and `parity.py`.

## What works
- The hero object is the referral link itself: `https://hanzo.ai/?aff=` plus a black `<code>` chip, set in big mono with a blinking caret, and it reveals on arrival. It is on the first screen at both sizes and tells you the product in one line.
- "How it works" is a pinned stage: a 4-dot rail on the left and one panel on the right that changes from step 01/04 to 04/04 (POST card or email, the application rows, `<code>` and the link, then "org signs up through the link" leading to "attributed to you"). On phone it becomes a snap rail with dots and a peek. It feels like Apple's pinned scenes.
- The dark attribution room has a real SVG diagram (1, 2 and org, with the losing path crossed out). Its tabs change the drawing (first touch, one affiliate per org, never your own) and update aria-selected.
- The header ask swaps to "Apply" on desktop once the hero ask scrolls away, and it turns quiet again while the hero or closing Apply is in view, so there is one solid fill at a time on desktop.
- Apply hovers from #0a0a0a to #2c2c2e and presses to scale(.98). It never fades. The copy button copies `POST /v1/affiliate/apply` exactly and changes to "Copied".
- The page is monochrome. `taste.py` passes, CLS is 0.0002, there is no horizontal scroll, and reduced motion shows the final link and every step. JS off is legible: the steps lay out as 4 cards.
- Copy parity: text 15/15. The one "missing link" is `/cdn-cgi/l/email-protection`, a Cloudflare email-obfuscation artefact on the live page, not a real link.

## The 11 answers
1. **Sells in 5 s, moves within 1 s:** Mostly. The h1, lede and Apply are clear, and the caret blinks and the header ask animates within 1 s. But at 1 s the link band is still an empty ruled box with a lone caret (desktop x≈936, phone at the right edge). The URL only fills in somewhere between 1 and 3 s, so the hero object reads as blank for the first second.
2. **One in, one out:** The pinned steps and the dark room do this well. The hand-off from the link band to the steps does not: the band ends in an "AFFILIATES" caption, then there is about 400px of blank white on desktop (about 180px on phone) before "How it works". You scroll through nothing. The 3685px pin also holds about 14 wheel notches for 4 states, which is long.
3. **Real visual object per section:** Yes: the link, the request and email card, the application rows, the code chip, the org pill and the attribution SVG. The close is text and a button, which is acceptable for a closing Band.
4. **One ask, nothing floating, scale rhythm:** Desktop is good: the header ask is Apply, the solid fill sits in one place, and scale runs from the link (big moment) to the h1 at 52 to the h2s at 26 to the mono captions. On phone the header keeps a solid black "Try Hanzo" next to a full-width solid "Apply" on the first screen. That is two solid fills and two different words for the ask. Phone never swaps the header label to Apply.
5. **Hover and press:** Apply, copy and the tabs all answer (the tabs change to light ink and the selected pill moves), and there are no jumps. The email link only gets an underline, which is fine. The step dots (01 to 04) are buttons.
6. **Overlaps, font swap, layout shift:** No overlaps at either size. There is no visible font swap, and CLS is 0.0002. With JS off, the "How it works" heading and step cards run past the page gutter (they start at x≈24 instead of 159) and the step-1 POST bar is clipped. That only shows with JS off.
7. **Reference feel:** Apple product page (a pinned scene where one panel changes) for the steps, and Anthropic or osply-style editorial type for the hero. The pinned motion is actually there.
8. **Different from neighbours:** Yes. A typed URL as the hero medium plus the attribution diagram is a signature no other page shares.
9. **18 parts:** Covered: one h1, `data-cta` and `data-thumb` on the hero, the closing Band, a tabs kit with ARIA, the copy kit at 44px, reduced motion and no-JS legibility. Gaps: one ask per viewport fails on phone (point 4), and the red console-error badge fails "it works".
10. **Banned tells:** None on the page. There are no hues or gradients. "AFFILIATES" is a caption below the link, not a kicker over a heading. Nothing floats except the shared cookie bar. The 3 rule tabs are a pill tablist, not 3 equal boxes.
11. **Copy untouched:** Yes (parity text 15/15).

Console: 1 error on every load, a React hydration mismatch in the shared `FooterHTML` (`dangerouslySetInnerHTML` differs between server and client). It shows the red Next "1 Issue" badge bottom-left at both sizes. It is not this page's file, but it is visible on this page and fails DONE item 3.

## Fixes (in order)
1. Fix the hydration mismatch in the shared footer (`FooterHTML` server HTML vs client) so the red "1 Issue" badge and the console error go away. This needs the shared-chrome owner.
2. Close the dead gap between the link band and "How it works". `.xaf-link { padding-bottom: 116px }` (88px on phone) stacks on top of the pinned section's own top padding. Cut it so the caption hands straight into the stage, ideally with the h2 peeking within the first scroll.
3. Phone first screen: keep only one solid fill. Make the header ask quiet while the hero Apply is in view and swap its label to "Apply" as desktop does, or ask the header owner to.
4. Fill the hero link without the empty first second. Either start the reveal at about 0.2 s, or render the URL at rest and animate only the `<code>` chip, so the band never shows as a blank ruled box with a lone caret.
5. Shorten the "How it works" pin (3685px for 4 states) to about 1 viewport per step, so the scroll doesn't sit on the same frame for several notches.
6. JS off: keep the step grid inside the page gutter and stop the POST bar from clipping.
