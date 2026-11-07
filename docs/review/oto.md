# /oto — James-eye review

Reviewed: main at `1417fde` and later (re-walked 14:43–14:48 on the build after the Zen-names fix `1417fde` and the palette recolour `4b53974`), under MASTER.md. Built on the shared creative-model template `components/pages/model/Creative.jsx`. Walked moving at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

Verdict: 7/10 (capped; page itself scores 8)

First complaint: "The Foley console is the best thing here and it's black and white now. The tiny labels on the related cards are too small."

**Cap: part card (MASTER section 6).** `docs/coverage/oto.md` is in the old format: 0 of 18 `Done here:` lines under `## N.` headings. Capped at 7 until it is re-copied from `docs/coverage/_TEMPLATE.md` with every claim true on the page. The shared desktop ask bar floats over content (site-wide, see `_shared.md`); not counted against this page.

**Scale (MASTER 3.1):** passes. The name rests at 176px over the film as the one hero moment (well past live hanzo.ai's 52px, but alone on its screen); each capability screen holds one 56px title, a medium lede and a small mono list. (My counter saw four 56px titles at once; they are the stacked chapter titles, and only one shows at a time.)

## What changed since the first review
Fixed at 14:25 (`1417fde`) and 14:29 (palette): "Request access" now sits on the first screen under the lede, the chapter films play on the phone, the type floor was raised, and no UI hue is left (colour lives only in Hanzo's film).

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes: the waveform film plays under "Oto" with "Request access" on the first screen; on the phone the waveform shape moves a little (1.6% change).
2. **One in, one out?** Yes: the film settles into its shape, capabilities pin one at a time (01–04) with the film beside them, then the signature, fields, related models and the try-it close.
3. **A real object in every section?** Yes: film, capability film card, the Foley console, field cards, model cards.
4. **One ask, sticky after the hero?** Yes: "Request access" in the hero (solid, light on the dark film), the shared ask bar after it, and the close; `data-cta` on the primaries.
5. **Every hover and press answers?** The hero ask and close (×) answer; model cards lift. Not every field card was exercised.
6. **Overlap, font swap, layout shift?** None on the page; layout shift 0 on both sizes.
7. **Which reference, and is its motion there?** synchronized.studio (the card opens into this page, with a close) and apple.com pinned chapters. Both there.
8. **Different from its neighbours?** In film and signature, yes; layout is the shared creative template.
9. **All 18 parts covered?** Card in the old format (cap above).
10. **Banned tells?** None measured.
11. **Copy untouched?** Yes (parity clean on the first review; words unchanged since).

## Missing from the 18 parts (PLAN-COMPONENTS / MASTER, measured)
- **Part 6 type floor:** 10px mono labels ("IMAGE", "VIDEO", "FOLEY" on the related-model cards) sit below even the 11–12px mono exception.
- **Part 10 media:** 7 raw `<video>` elements rather than the kit `Film`.

## Fixes
1. Re-copy the 18-part card into `_TEMPLATE.md` format with `Done here:` evidence (lifts the cap).
2. Raise the related-model labels to 11–12px mono capitals (shared `Creative.jsx`).
3. Play the films through the kit `Film`.
