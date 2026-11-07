# Coverage: /dev — components/pages/DevPage.jsx

Persona: a developer choosing a coding agent. Goal: open Dev (or install it). CTA: "Open Dev" (`/login?next=%2Fdev`). Metric: `signup_start`, plus `install_copy` on the install commands. Brief: BRIEF-v3 5.1 ("Dev: terminal with a diff landing") and PLAN-COMPONENTS 2.16.

- **2.1 Strategy and conversion:** Persona, Goal, CTA and metric are in the file header. There is one solid ask in Hanzo's words, "Open Dev": in the hero, in the site's sticky ask bar (`data-thumb`, `data-ask-name="Hanzo Dev"`) and in the dark close. "Read the docs" and "Explore GitHub examples" are text links (on v2, "Read the docs" was a second button). `data-cta` is set on `dev.hero` and `dev.close`.
- **2.2 Information architecture and navigation:** Hanzo's header and footer are unchanged. The `#install` anchor still works. The reading index keeps all 10 of Hanzo's links.
- **2.3 First impression and page narrative:** The h1 cuts into its lines. With no eyebrow, "Hanzo Dev · Coding agent" sits in the terminal's title bar. The terminal is writing its first command within about 1 second at 1470×801. One idea per screen:
  - the session
  - the race, in the one dark middle room
  - the rail of places
  - five stacked sheets (models, controller, proof, sandbox, Gen)
  - install
  - source, Q&A and reading
  - the dark close
- **2.4 Conversion system:** Exactly one solid button per viewport on the page itself. The Replay race button is outlined, and the copy buttons are quiet. Gap: the shared header's "Try Hanzo" is also solid on the first screen (site-wide behaviour, not this page's file).
- **2.5 Trust and proof:**
  - The 3.02× figure, the 44 and 42 task counts, the interval and both ways are kept verbatim, with the link to every task and both runs.
  - The clocks replay the run medians (9.52 s and 2.29 s) at the speed they ran.
  - Proof is three statements with ticks. No figures were added.
- **2.6 Content presentation (copy untouched):** Parity is 0 missing (text 176/176, links 12/12). The section labels (One agent, Install, Models, Controller, Proof, Sandbox, Gen, Open source, Questions, Read, Paste and ship) are now folios below their headings, never above them. Removed as not Hanzo's words: the "Your first session" builder ("Three lines, yours.", "You are on", "Sign in with" and the rest) and the `# dev` channel name.
- **2.7 Visual design system:** Greys only:
  - The diff reads by shape: `-` lines struck through in grey, `+` lines in white weight 500. A test passes with a filled ring and a tick.
  - The race winner is white and the other side grey.
  - The 3.02× figure is white, about 230px tall, in tabular figures.
  - Hero objects have 28px radii.
- **2.8 UI component library:** Uses the kit's `A`, `Copy` and `Faq`, plus `AppLines` and `AppDemo`. Buttons and rows have hover (background, arrow nudge, row shift) and press (scale .97 to .98). Gap: no kit `PageHero`, `Band` or `CodeBlock` yet, so code blocks are page parts.
- **2.9 Motion and interaction:**
  - Time (signature): the session writes the install, the task, the reading, the diff landing in the file pane and the three tests. Then the race replays each median task. Both play once and rest on their final frame, with an icon Pause or Replay button (`AppDemo`), and they pause off screen.
  - Arrival: the headline cut-in and the terminal rise.
  - Pointer: the places rail is dragged with inertia (prev and next buttons for the keyboard); the ladder and the rows preview on hover.
  - State: a selection pill glides on the model and flag rows (layoutId), and the fence changes with the flag.
  - Scroll: the race room's edges open, which is the only scroll-linked effect.
  - Each place card's and each sheet's small scene plays once when first seen (`[data-play]`). No endless loops; the blinking carets are gone.
  - Reduced motion: final frames, with no clip.
- **2.10 Media:** No raster media. Every object is a live UI render.
- **2.11 Mobile and responsive:** At 375×812:
  - The h1, lede, ask and the top of the live terminal are on the first screen, and the panes stack.
  - The rail becomes a native swipe with scroll snap.
  - Sheets stop being sticky.
  - Targets are 44px or more, except one inline link inside a sentence.
  - No sideways scroll at 375 (checked); 320 not checked.
- **2.12 Accessibility (WCAG 2.2 AA):**
  - The terminal's final frame is in the server HTML, so screen readers and JS-off get the whole session.
  - The race result is a visually hidden list (no raw `<table>`).
  - Toggles use `aria-pressed` and `aria-expanded`; the auto-moving content has Pause.
  - Focus is a 2px ring. Text on white is #6e6e73 or darker.
  - Gap: no axe run.
- **2.13 Performance and engineering:** Only transform, opacity and clip-path animate. The session writes into DOM nodes (no state per character), and the race clock ticks only while it plays. Gap: LCP, CLS and INP not measured.
- **2.14 SEO and machine files:** The title and description are unchanged, with `JsonLd` route `/dev`.
- **2.15 Catalogue and product pages:** Not applicable.
- **2.16 Developer experience:** Each install command has Copy, and the copy equals the displayed text (no `$ `). There is a sign-in block, release and getting-started links, and the agent prompt with Copy. Gap: versions are hand-typed (`v0.7.7`) as on Hanzo's page.
- **2.17 States and resilience:** The session states are running (pulsing step), ok (tick), passed and diff ready. The race states are ready, running and done. The poster, JS-off and reduced motion all show the final frame. Nothing calls a network API.
- **2.18 Measurement and handover:** `data-cta` is set on both asks. No events are sent, because `lib/track.js` does not exist yet. Proof is in `docs/gallery/dev/`.

**Ledger (what this page deleted):** the first-session builder (about 70 lines), the endless loops (terminal re-run, race re-run, eleven CSS loops), the green accent, the raw `<table>` and the kickers above headings.
