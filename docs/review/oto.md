# /oto — James-eye review

Reviewed: main, page files at `dbe4459` (Oto is built on the shared creative-model template, `components/pages/model/Creative.jsx`, with its own Foley console; see also /iro, /koe, /koma, /mori). Walked moving at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

Verdict: 7/10

First complaint: "The waveform film is great. But the Foley console has little coloured emoji icons and a blue-purple spectrum, and there's still no button on the first screen."

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Desktop: Hanzo's Oto film (a white waveform) plays full-bleed under "Oto" and "Sound generation and audio understanding."; no ask on the first screen. Phone: the film settles into a waveform shape above "Give every moment its sound." with the ask, then is nearly still.
2. **One in, one out?** Yes on desktop: film settles, capabilities pin, then the signature Foley console (props fire, the spectrum paints, the bus meters answer), fields, try-it close.
3. **A real object in every section?** Yes; the Foley console is the richest live object of the creative models.
4. **One ask, sticky after the hero?** After the hero, yes ("Request access", then the ask bar). Not on the first screen.
5. **Every hover and press answers?** Not reliably measured (hero buttons hidden under the film during the hover pass); console props highlight when they fire.
6. **Overlap, font swap, layout shift?** None; layout shift 0 on both sizes.
7. **Which reference, and is its motion there?** synchronized.studio card-to-page; apple.com chapters; a self-running product console. All there.
8. **Different from its neighbours?** Yes: the Foley console is Oto's own.
9. **All 18 parts covered?** See below.
10. **Banned tells?** Yes, inside the console: coloured emoji icons on each prop (drum, footsteps, lock, rain), an orange fill, and a navy-to-violet spectrum. JAMES.md allows 0 UI hues; the console is UI, not Hanzo's film.
11. **Copy untouched?** Yes: parity 74/74 text, 4/4 links.

## Missing from the 18 parts (PLAN-COMPONENTS 2.1–2.18, measured)
- **2.1 / 2.4:** no ask on the first screen; 0 `data-cta`.
- **2.6 Type floor:** 18 labels under 13px (the console's mono meta, the 11px "AUDIO" chip).
- **2.11 Mobile:** most phone screens after the hero are still.

## Fixes
1. Console in ink and greys: monochrome glyphs instead of emoji, a white-on-black spectrum, no orange.
2. "Request access" (solid) and "Try it in Design" (link) on the first screen (shared template fix).
3. Raise console meta to 13px where it is read, or drop the decorative readouts.
