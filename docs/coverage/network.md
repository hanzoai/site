# /network coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/cloud/Network.jsx` · route: `app/network/page.jsx` · gallery: `docs/gallery/network/`

1. **Strategy and conversion.** Persona: a developer who needs compute. Goal: buy compute on hanzo.network. One ask, Hanzo's "Buy Compute" (docs.hanzo.ai/docs/network), metric `api_key_created`: solid in the hero (`data-cta="network.hero"`), carried by the site's sticky ask after the hero, and again as the close's one solid (`network.close`). "Run a Node", "Get an API Key", "Provide Compute", "View on GitHub", "Deploy to Cloud" and "Self-host" are text links, ghost buttons or cards.
2. **Information architecture and navigation.** Hanzo's header and footer are unchanged. Order: the fabric (what it is), how it works (six blocks), the two ends (call it or serve it), paste and ship, get it. "Provide Compute" and "Run a Node" lead to /node.
3. **First impression and page narrative.** At 1470×801 the first screen is the h1 (cut-in, set in the server HTML), the live fabric full-bleed behind it, the lede, the ask, and the hero object's own toolbar. A request walks the map within 1s, with no input. No eyebrow above the h1: "Compute Marketplace" now names the hero object's toolbar. After that, one idea per screen.
4. **Conversion system.** `data-thumb="Buy Compute"` on the hero ask drives the site's sticky ask at every width; `data-ask-name="Hanzo Network"` names it. The close's ask carries `data-thumb` too, so the sticky bar steps aside there. One solid button per screen. The dark room's "Get an API Key" no longer carries a second `data-thumb`.
5. **Trust and proof.** Every figure is Hanzo's ("a tenth of the block reward", six facts, two commands). The map, hashes, peers and the strand are drawn and say so in the header comment.
6. **Content presentation (copy untouched).** Parity is 37/37 text and 5/5 links. The statement "How the Network Works" is now the pinned scene's intro beside the chain, not a screen of its own. The "01 / 06 — 06 / 06" kicker is gone (the chapters carry "01 / 06" … "06 / 06").
7. **Visual design system.** v2 launch type (`components/v2/LaunchType.css`). 0 UI hues: the indigo accent is gone. Ink, greys (#6e6e73 and darker on white) and white; a route is told by weight, a preview by a dash, a hit by a filled tag. One dark room.
8. **UI component library.** Kit pieces: `LineMask`, `PinnedChapters` (with `intro`), `ClipWipe`, `LaunchClose` (with `ask`/`cta`), `LivePause`. Frame's `Paste` and `Copy`. The model picker and the lend toggle are styled segmented controls with a sliding pill; nothing uses browser-default controls; no `title=`.
9. **Motion and interaction.**
   - Idle: the request walking the fabric, pausable from the hero toolbar (`LivePause`; run = in view && !paused && not pointing).
   - Pointer: point at any peer and the fabric draws the route it would take there (dashed) and the toolbar reads the hops and what that peer has loaded; in the dark room, pointing at "call it" or "serve it" sends a request or a serve down the strand between the two ends; the close's ask is magnetic.
   - State: the model picker and lend toggle (layoutId pill, spring {420, 34}); the placement tag springs in.
   - Arrival: cut-in title; the timed wipe into the dark room; the strand runs once on arrival.
   - Scroll (under half): the map eases back as you leave the hero; the pinned chain of blocks.
   - No `setInterval` in the page (timeouts via `useSteps`).
10. **Media.** The page has no Hanzo images or film; its objects are drawn product UI: the fabric map, the chain of blocks, the strand, the agent prompt and the close's Sigil.
11. **Mobile and responsive.** At 390×664 the first screen holds the h1, the live map with the route, the lede and the ask. The toolbar card follows. Pinned chapters put the block on top and the words below, clear of the thumb bar (pinchk: 7/7 ok). Targets are 44px or more; no text under 14px; no sideways scroll at 320.
12. **Accessibility.** The map is `aria-hidden`; the model picker is a `radiogroup` with a visible label; the lend toggle uses `aria-pressed`; answers are `aria-live`. Contrast ≥ 4.5:1 everywhere measured (probe: 0 low on desktop and phone). Reduced motion: no packet, the answer shows at once, chapters swap without movement, the strand rests lit.
13. **Performance and engineering.** Motion is transform, opacity, stroke and clip-path. The walk runs only while the hero is on screen; the strand runs only on arrival or pointing. No canvas, no video, no blur.
14. **SEO and machine files.** Metadata and JSON-LD unchanged (`app/network/page.jsx`). All copy is in the server HTML and visible with JS off (checked: 0 invisible); Frame's Paste is held visible by the page CSS instead of fading up from opacity 0.
15. **Catalogue and product pages.** Does not apply: not a catalogue.
16. **Developer experience.** The two commands (`hanzo fabric join`, `hanzo runner`) are one tap from a copy button in chapter five; the agent prompt is copyable.
17. **States and resilience.** The demo is drawn, so there is no loading or failure state; a model nobody has loaded shows its placement; the pause holds the walk.
18. **Measurement and handover.** CTAs carry `data-cta` (network.hero, network.close); no analytics wired yet. Filmed with the scratch `film.cjs` (desktop d.mp4 and d.jpg, phone strip p.jpg, no errors, no sideways scroll).

Ledger: deleted the indigo accent (and its lavender gradient and coloured packet glow), the "● Compute Marketplace" eyebrow over the h1, the statement-only "How the Network Works" screen and its "01 / 06 — 06 / 06" kicker, the second `data-thumb` on "Get an API Key", the solid indigo "Provide Compute" card (white-on-white in the dark room), the ghost "Run a Node" button (now a text link), and four bare `:hover` rules.
