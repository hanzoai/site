# /zen/* (family) — James-eye review

Reviewed: main, page files at `507397d`. Members walked: `/zen/models` and `/zen/zen6-max`, moving, at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped). `/zen/7` was not walked.

Verdict: 7/10

First complaint: "On Zen 6 Max the first screen is just the name over the film. What is it, and what do I do? The button only turns up once I scroll. And the Zen5 shelf is packed with tiny grey text."

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Moves, yes: both open on Hanzo's own Zen film (the sphere over rippling water) playing. Sells: **/zen/models** yes ("Zen Models / Complete API Catalog", Hanzo's lede, "Get API key" in the hero). **/zen/zen6-max** only half: the first screen is "Zen 6 Max" over the full-bleed film; the lede and "Talk to sales" arrive only after the film settles into its card as you scroll.
2. **One in, one out?** Yes, the best in my scope so far. /zen/models pins one figure per screen ("18" → "2M" → "$0.01/MTok" → "MoE + Dense") with a numbered rail; /zen/zen6-max pins the black rack while Qualification → Isolated production pools → Redundant pools change it, with "9,216 GB" holding. The "One name / Right-sized per request / Long context / Tools and code" rows on Zen 6 Max read as a list.
3. **A real object in every section?** Film, figures, code, rack, shelf: yes.
4. **One ask, sticky after the hero?** Yes: the shared ask bar carries "Get API key" (models) and "Talk to sales" (Zen 6 Max) after the hero, and the header's "Try Hanzo" turns outlined.
5. **Every hover and press answers?** Not measured on these two (the walk's hover pass found no in-page controls in the first screen). Shelf cards lift on hover.
6. **Overlap, font swap, layout shift?** None; layout shift 0.012 and 0. While a figure hands over to the next, both figures overlap for a moment ("18" over "2M", "$0.01/MTok" over "MoE + Dense"); that is the crossfade, but it reads as a smudge.
7. **Which reference, and is its motion there?** anthropic.com model launch (figures as heroes) and apple.com (film that settles into a card, pinned rack). Both are there.
8. **Different from its neighbours?** Yes: catalogue vs launch. Both use the same Zen film, which is right for the family.
9. **All 18 parts covered?** See below. Coverage files exist for both members.
10. **Banned tells?** None: greys only, no eyebrow over either h1.
11. **Copy untouched?** Yes: parity 89/89 and 46/46 text, 5/5 and 4/4 links.

## Missing from the 18 parts (PLAN-COMPONENTS 2.1–2.18, measured)
- **2.3 First impression (Zen 6 Max):** no lede and no ask in the first screen.
- **2.6 Type floor:** 26 labels under 13px on /zen/models (12px "PRO", "PARAMS", "CONTEXT", "ARCH", "AVAILABILITY") and 4 on Zen 6 Max ("DGX B300").
- **2.6 Content:** each Zen5 shelf card carries a paragraph plus four spec rows; plan says at most three text lines per card, detail behind a click.
- **2.10 Media:** the film is a raw `<video>` on both, not the shared `<Film>`; no pause control on a looping film.
- **2.4:** 0 `data-cta`.

## Fixes
1. Zen 6 Max: bring Hanzo's one-line lede and "Talk to sales" onto the first screen over the film (bottom-left), so it sells before the scroll.
2. Zen5 shelf: one figure, the name and one line per card; move the paragraph and spec rows into the card's open state.
3. Raise every label to 13px or more (14 on phone).
4. Make the figure handover a clean cut-in (old one leaves before the new one lands) rather than a crossfade.
5. Play the films through the shared `<Film>` with a pause control.
