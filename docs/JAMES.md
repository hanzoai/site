# Conducting as James: the standards every page is judged by

"Act as James" does not mean "approve what a chat suggests". It means holding his taste and refusing what he would refuse.

This file outranks any chat's own score.

Sources:
- His own measured taste file, `~/.claude/skills/building-websites/refs/taste.md`, built from every site he has approved or rejected.
- His words on this project, 6 and 7 Nov.
- His references.

## What he said about Hanzo (his words are the bar)
- "Not enough movement or motion, too many repeats of the same colours… 4/10. It needs to be more immersive. At least 8/10."
- "An overload of information… instead of, as you scroll, one thing comes in, one goes out. There's no premium feel."
- "Premium means subtle and alive: nice user feedback things loading in as you scroll, movement, motion, not just a dead sort of page." It must not look AI-made, and a very quiet page was pushed back.
- "We don't want every page being the same. It's not just a template." Each page gets its own idea, object and moment on one shared system.
- "The Apple vibe… logic applied, clear CTA, psychology… speed, luxury, feel." And: "simplify the complicated".
- "Pure design." Do not change the copy, and keep the heroes.
- "See the motion on other sites, not just screenshots." Timings, easing, what is tied to scroll, pinned scenes, hover and press.
- "Go deeper, not bigger." Every one of the 18 parts of a website, and every element inside them, must be considered on every page (see the component master plan).

## What he reliably likes, applied to Hanzo
1. **Display type that reads like a logo.** Big and tight, with h1 line height 1.05 or less at 72px and up.
2. **One live object on a quiet stage.** Every section has something to look at: a real product UI, a film, a canvas, an SVG, a giant numeral or a logo wall. An icon alone fails.
3. **Authored motion,** not fade-ups:
   - Headlines cut into their line.
   - Scrubbed strips.
   - A marquee whose speed answers the scroll.
   - Count-ups.
   - Pinned stages where one panel changes.
   - Cards that open into their page (synchronized.studio).
   - One 3D or WebGL moment where it earns its place.
4. **Every tap answers.** Hover and press change something other than opacity, with no layout jump. Press is translateY(1px) or a scale of 0.98, and the hover detail tells you something (a number, a preview).
5. **One solid ask in Hanzo's words.** It sits in the header and in a sticky bar after the hero at every width. Never 3 or more equal buttons.
6. **Many real visuals at once.** A block of 4 or more real Hanzo images or videos on screen together where the page has them (model media, product UI).
7. **Colour from the brand, not from boxes.** Hanzo's logo is black and white, so the UI has 0 brand hues: greys, silvers, blacks and whites (his "brand deck"). Colour arrives only through Hanzo's own media and model imagery. This replaces VISION.md's "one accent per page".
8. **Variation.** Neighbouring pages differ in hero medium, layout and signature move.

9. **Movement that is not just scroll.** (James, 7 Nov 14:20: "Not everything is a scroll animation.") Every page mixes kinds of motion:
   - **Idle and ambient:** a live demo that runs itself, a Sigil field drifting, a ticker or a counter, a model card breathing.
   - **Pointer:** a cursor-aware light, magnetic asks, tilt, previews on hover, a drag rail with inertia.
   - **Time:** typing, streaming text, staged loading, a clock or calendar that is actually live.
   - **State changes:** tabs that morph (layoutId), sheets that rise, toggles with springs, the card-to-page open.
   - **Arrival:** headline cut-in and the page transition.

   Scroll-linked effects are **at most half** of a page's motion. A page whose only motion is scroll fails.

10. **Sound feedback, subtle.** (James, 7 Nov: "sound feedback… not an overwhelming amount.") The shared system owns one tiny sound kit, synthesized with Web Audio so it needs no audio files. It is very quiet (about -24 dB) and plays only after the visitor's first interaction. A mute toggle sits in the header and the choice is remembered. Sounds go only on meaningful moments:
    - a card opening into its page (a soft whoosh);
    - pressing the primary ask (a soft tap);
    - tabs, toggles and switches (a tick);
    - copy-to-clipboard succeeding (a confirm chime);
    - ⌘K opening (a soft pop);
    - a self-running demo finishing (a faint chime).

    Never on hover, scroll or page load, and never more than one sound at once.
11. **Hanzo's black model cards are copied exactly.** The size, grid, type, pills, video and pointer-tilt are in `docs/refs/hanzo-model-cards/SPEC.md`, measured from live hanzo.ai.

## What he reliably rejects (a page with any of these fails)
- **Clutter:** walls of text, explaining sentences under every tile, 3 equal boxes in a row, overload.
- **A dead page:** nothing moves without input, or only fade-ups.
- **Repeated colours or one tone across pages.**
- **A framed or boxed static hero.** Blacked-out or filtered photos: dimming is only a gradient under text.
- **A visible font swap while loading.** The h1 box never moves.
- **Unverifiable claims.** Every number traces to Hanzo's own copy.
- **Overlap:** hero card, buttons and nav overlapping at 1470×801 or at 375×812.
- **Browser-default controls** (selects, checkboxes, tooltips), plain boxes, a "lazy" look.
- **Green accents.**
- **His banned tells:**
  - purple-to-blue gradients
  - gradient text
  - emojis in headings
  - the Inter font
  - a coloured stripe down a card
  - low-contrast dark mode
  - three icon boxes in a row
  - **a badge, pill or eyebrow above the headline** (so no kicker over an h1)
  - Lucide icons everywhere
  - untouched shadcn
  - a cursor beam or glow
  - buttons that fade on hover
  - inconsistent spacing
  - serif italic accent words
  - grain over a gradient

  The rest of his list (em dashes, buzzwords) is about copy we write, and we write none.

## His references: what each must visibly contribute
The Reference Lab (cloud) films and measures each one into `docs/refs/<site>/`: video, frames, and measured durations, easing and scroll values. It also finds 15 or more similar sites. Use the measured values, not guesses.
| Reference | What it must contribute |
|---|---|
| synchronized.studio | A card opens into its page, and the next page's hero is the card you clicked. Its timing comes from the measurement. |
| apple.com product pages | One idea per screen, pinned scrubbed scenes, the product as the hero, huge type, and a sub-nav with a persistent ask. |
| osply.co, hamol.studio, grubogrubo.com | An editorial type scale, confident asymmetry, image-led sections, pointer-aware details, playful but restrained micro-motion. |
| chatgpt.com/business/enterprise | Calm trust: big statements and proof listed quietly. |
| anthropic.com model launch | A model launch told as a story, with benchmarks as hero figures. |
| motion.dev examples | The motion engine and its named patterns (see BRIEF-v3 §8). |

## The James-eye review (how a critic judges a page; this verdict decides "ready")
Walk the page as him, moving, at 1470×801 and at 375×812, at full frame rate. A screenshot is not a walk. Answer each question:
1. Does the first screen sell in 5 seconds, and does something move within 1 second without input?
2. As you scroll, does one thing come in as one goes out, or is it a document?
3. Does every section hold a real visual object?
4. Is there one ask in Hanzo's words, and is it sticky after the hero?
5. Does every hover and press answer, with no jumps?
6. Do overlaps, a font swap or layout shift appear anywhere, on desktop or phone?
7. Which reference does it feel like, and is that reference's motion actually there?
8. Is it different from its neighbours, with its own hero medium and signature?
9. Is every one of the 18 parts covered (component master plan checklist)?
10. Are there any banned tells?
11. Is the copy untouched?

Then give a verdict out of 10, and the **first thing James would complain about**, in his words. Under 8 goes back to the chat that owns the page with that complaint.
