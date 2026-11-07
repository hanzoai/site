# /sign/: James-eye review
Verdict: 7/10
First complaint: "The top is lovely, the contract signs itself. But I scroll to the prices and they shrink: '$50' goes from a big number to a tiny spaced-out 'F r e e' and '$ 5 0' the moment it lands. That's the one number I came to see, and it looks broken."

Walked 2026-11-07 ~16:40 UTC on the dev server at 1470x801 and 375x812, moving.

## The 11 answers
1. **First screen, 1 s.**
   - It sells: h1 52px "Hanzo Sign", lede and Try Hanzo + Documentation at h1 top 342px, with the Agreement.pdf desk on the right.
   - Motion within 1 s with no input: the PDF lines load in between 300 ms and 1000 ms. By 3.6 s the desk is on step 03/05 (fields placed, signers "sent"), and a pause control is present.
2. **One in, one out.**
   - Desktop: the five chapters are one pinned stage (01 Upload, 02 Place, 03 Send, 04 Watch, 05 Keep the record). One h2 and one desk state per stop, so it reads as a story rather than a document.
   - After the pin it slackens. There is ~170px of blank white before "What is in it" (d-07) and ~250px of empty grey under the signing pad (d-10).
3. **A real object in every section.**
   - Yes. The self-signing desk; a live recipient list (persons 1-5 ticking sent, opened, signed); the "Twelve languages" rotator (Spanish 03/12); a drawable signing pad (drawn, then Sign turns solid, then a "Signed Nov 7, 2026, 4:38 PM" stamp); price cards; the fork curve documenso to hanzoai.
   - The 8 part tiles are text-only, but they open into sheets, so that is acceptable.
4. **Ask and scale.**
   - One solid fill per viewport on desktop: the header Try Hanzo is outlined while the hero ask is visible and turns solid once it leaves. Nothing floats over content, and no cursor label appears on the tiles (checked).
   - Scale: h1 52, h2 26, h3 17, figures 44. There is rhythm, apart from the price bug in Fixes 1.
   - Shared chrome: the phone header's always-solid Try Hanzo duplicates the hero solid at 375 (request filed, not this page's fault).
5. **Hover and press.**
   - Hero ask: hover changes background #0a0a0b to #2c2c2e, press scales 0.98. The Documentation outline goes ink and gains a 4% fill.
   - Tiles: hover lifts 3.5px, press scales 0.999. Every tap answers and nothing jumps (the measured box delta is 1.7px, which is the press scale).
   - Tile hover is only a lift (no preview or number), and the 3.5px lift is not on the allowed hover-transform list.
6. **Overlaps, swaps, shift.**
   - No overlaps at either size. No horizontal scroll at 375 (scrollWidth 375). The h1 box is stable.
   - The lede and asks rise 13px on arrival (an entry transform, not CLS).
   - Console: 0 errors on 4 of 4 cold loads, and no red badge on 4 of 4 cold loads. One "1 Issue" badge appeared in a single run during an aborted navigation to hanzo.ai and did not reproduce, so it is not counted.
7. **Reference.** apple.com product page: a pinned scene where one panel changes and the product is the hero. The motion is really there (a self-running demo plus the scroll hand-off). It also has motion.dev-style state (the pad and the run toggle).
8. **Different from neighbours.** It has its own hero medium (a PDF that signs itself, with an ink line draw) and its own signature. It does not reuse the home or launch tricks I know.
9. **18 parts.**
   - Present: one h1, `data-cta="sign.hero"`, 3 pause controls, sheets with Esc, a pad with a keyboard path, sound toggle in the header, and two black rooms that are not back to back.
   - Phone: one tap target under 44px, the inline "Documenso" link at 87x21.
10. **Banned tells.**
    - `taste.py` OK; none of the hard bans.
    - Borderline 1: "Most Popular" mono label sits above the Business h3 (not an h1 or h2, so allowed).
    - Borderline 2: tiles carry both a fill and a 5% outline ("raise or outline, never both").
    - Borderline 3: on phone, two mono labels are stacked ("A document, signed" over "DOCUMENT SIGNING").
11. **Copy.** `parity.py /sign`: text 106/106, links 9/9.

## Fixes (in order)
1. **The price flip shrinks the figures.**
   - On desktop, once `.sg-plans` is 40% in view, `Flap` replaces the 44px price with 15px letter-spaced cells (`.x-flap.sg-flap`): "F r e e", "$ 3 0", "$ 5 0", "C u s t o m" (flap-d-1).
   - The roll must land at the 44px figure size, tabular and not spaced, or drop the flap.
   - Same check after the Run it yourself / We run it toggle.
2. **Close the dead stretches after the pinned stage.**
   - About 170px of empty white sits between the desk's last frame and "What is in it". About 250px of empty grey sits under the pad before "What it costs".
   - Overlap the next object by about 40px, per MASTER part 3.
3. **Signing pad dominates its screen while empty.**
   - At 1356x362, an empty dashed box fills most of the screen until someone draws.
   - Either give it a ghost signature that writes itself once at 60% in view, then clears on pointer down, or cap its width to the 8/5 grid so the section has a big, a medium and a small.
4. **Polish.**
   - Give the tile hover something that tells (the sheet's first line or the 01 number moving), not only a lift.
   - Drop the 5% outline on the filled tiles.
   - On phone, pick one of the two stacked mono labels above the desk.
   - Give the Documenso inline link a 44px tap box.
