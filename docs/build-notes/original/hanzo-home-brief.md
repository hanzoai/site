# Hanzo home: the brief I am building to

**Start from hanzo.ai itself, in its own dark theme.** The real header, hero, "Backed by" logo strip, the nine Frontier cards with their videos, the bottom logo strip and the footer stay exactly as Hanzo ships them. Nothing of theirs is restyled.

**Below the Frontier cards the page becomes a theatre.** True black, hairlines, glass. One idea per screen: a heading, one anchor, at most one line of support. Every section is a scene that holds the screen while the visitor reads it; nothing is stacked, nothing competes. All of Hanzo's words, numbers and links are kept; they are sequenced, not cut.

**Every act has its own kind of interaction. Never the same trick twice.**

1. **Platform** — the nine products as three cards at a time. The front is the product's name and address, quiet. Hover (or tap) turns the card over and shows what is behind it: the product's real screen fragment and its two actions. Scroll brings the next three.
2. **Agents** — the install command and the four steps an agent takes to sign itself up. The steps are a stepper the visitor can click; the active endpoint types itself; left alone, it walks the four steps on its own.
3. **Faster** — the two races run at true speed when they are reached, and can be replayed with one press.
4. **Cheaper** — one chart with a switch: Enso against frontier LLMs, Kai against frontier LLMs. The figure and the lanes change in place.
5. **Frontier** — the Pareto plot draws itself; every point can be pointed at or reached with the keyboard and reads out its result.
6. **Open** — the counts settle one screen at a time, then the repositories, then the three ways in.
7. **Pricing** — the three plans, one solid action.

**Motion rules.** Entrances fade and rise 24px while coming into focus from a blur, on `cubic-bezier(.16, 1, .3, 1)` over 0.9s. A scene's content scrubs in, holds and out with scroll (opacity 0 → 1 → 1 → 0, scale .94 → 1 → .96, rise 40px) only where the section tells a sequence. Cards answer the pointer physically: 1.015 on hover, .985 on press, 200ms. No springs, no bounce, no gradients, no neon, no icon circles. Reduced motion: everything readable, nothing pinned. 60 frames a second, keyboard reachable, phones first-class (one card at a time, swipeable).

**What wow means here:** the visitor never feels the page is long. Each screen answers one question, then gets out of the way.
