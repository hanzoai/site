# Coverage: /blog/* (one template: kai-decision-models, pareto-frontier, synthesis)

Template: `components/pages/post/Post.jsx` (+ `postData.js`, `Frontier.jsx`, `Life.jsx`). One line per area of docs/PLAN-COMPONENTS.md §2.

- **2.1 Strategy and conversion:** one goal per post (read it, take its next step); no solid button of the page's own, the post's own closing links carry the ask, and the first is `data-thumb` for the phone bar.
- **2.2 IA and navigation:** "Back to Blog" stays at the top; chapters are anchored h2s with a contents rail (desktop) and a reading bar sheet (phone); other posts close the page. Header and footer untouched (shared).
- **2.3 First impression and narrative:** screen one is the title alone at display size (server-rendered, cut in word by word), the plate then opens to full bleed; chapters run one idea per screen; the page ends on next steps and the other posts. h1 is the `data-morph-target` for cards opening from /blog.
- **2.4 Conversion system:** closing rows are Hanzo's own links as large text rows with an arrow (no second solid button); no forms on these pages.
- **2.5 Trust and proof:** every figure is the post's own (plate figures, GPQA dots with their own sentences and source links); synthesis keeps its numbered sources.
- **2.6 Content presentation:** copy untouched (parity 0 missing on all 3); body 19/17px at 66ch; code in tabs with copy; long figures broken out wide; no wall of text per screen.
- **2.7 Visual design system:** white page, ink and greys only (no UI hues); one dark room (the cover plate); 28px radius on the plate, 16px on cards and code; hairline rules.
- **2.8 UI component library:** kit `A` and `Copy`; tabs are real ARIA tabs with arrow keys and a layoutId pill; contents buttons are 44px+; focus rings visible.
- **2.9 Motion and interaction:** signature = the reading thread (numeral hands over, spine fills, minutes left); supporting = plate opening on scroll, title cut-in, idle model film or Sigil; scroll-linked motion is under half; nothing loops for decoration; reduced motion shows final states and pauses films.
- **2.10 Media:** Hanzo's own model films (kai, enso) on the plate, the named parts (Zen, Enso, Kai) and the next-post cards, with posters and explicit sizes; they play only on screen; Sigil where a post has no film.
- **2.11 Mobile and responsive:** designed at 375: display 48px, plate stacks with the film on top, rail becomes a sticky reading bar with a contents sheet; no sideways scroll (checked at 375).
- **2.12 Accessibility:** one h1, real headings per chapter, `aria-current` on the chapter, keyboard for tabs, Life board and chart dots; decorative films `aria-hidden`; title has an `x-sr` copy for screen readers.
- **2.13 Performance:** transform/opacity only; films `preload="metadata"` and paused off screen; text written via refs (minutes left) not per-frame renders; GPQA chart coordinates rounded so server and client match (hydration error fixed).
- **2.14 SEO and machine files:** metadata from content/pages.json and JsonLd as before; all text in server HTML (chapters, inactive code tabs).
- **2.15 Catalogue and product pages:** not a catalogue; the next-post cards open into their page (synchronized.studio).
- **2.16 Developer experience:** code samples keep Hanzo's highlighting, language tabs and copy; install commands copyable.
- **2.17 States and resilience:** no live data; films fall back to their poster; reduced motion and no-JS show every word; Life board can pause, step and clear.
- **2.18 Measurement and handover:** not wired (no analytics events yet: needs the conductor's event layer). Proof films in `docs/gallery/blog/`.
