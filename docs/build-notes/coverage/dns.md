# /dns coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/cloud/Dns.jsx` (+ `Dns.css`) · gallery: `docs/gallery/dns/` · metric id: `api_key_created` (proxy on this page: `cta_click dns.hero`)

Open copy questions for James: (1) the plan asks "Talk to us" (Starter, Pro, Team) and "Contact Sales" (Enterprise) share one href (/contact-sales) with different labels, as on live (MASTER part 4 says adjacent buttons never should): kept. (2) "Pricing" says "Start free." while every plan reads "Custom": kept as printed. (3) "Popular" marks Pro on live with no written rule behind it (MASTER part 4): kept as Hanzo's word, and the ink tile only follows it until a visitor says what they need.
Shared changes requested (`docs/build-notes/requests/dns.md`): none filed; kit gaps go to the kit owners in the report.
Forks this page deleted: Frame's `useLive`/`useEvery` (a `setInterval`) and the chapters' own `setInterval` loops (now timeout chains that run once and rest); the hand-made terminal with Frame-style `Copy` (now the kit `CodeBlock`, lit a step at a time); 4 hand-made `kn-btn` plan asks (now kit `Cta`, one solid); the "Pricing" and "Use Cases" kickers above their h2s (now under them); two rewritten needs ("More than 5 zones", "More than 2 DNS providers", now Pro's own "Unlimited zones", "All DNS providers"); the invented idle line "Starter covers up to 5 zones and 2 DNS providers." and the unapproved "Fits:" and "Clear" strings; the pink accent, 9 shadows and the glow on the packets.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from Hanzo's copy (`lib/cta.js` does not exist yet; labels are the live ones)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; ~~prices from `lib/plans.js`~~ n/a: every plan reads "Custom" (no figure)
- [x] Open copy questions for James listed, none decided

Done here: "Try Hanzo" → /login is the page's ask (`dns.hero`, `data-thumb`); the kit Stage draws it quiet when the header already carries the same solid "Try Hanzo", so the two never share a view; GitHub is the Stage's text link. Among the plans exactly one ask is solid: the ink plan (Pro, or the plan the needs fit). "Deploy to Cloud" (`dns.close`) owns the close. The header's "Try Hanzo" is always solid since 7 Nov 15:01 (SYSTEM.md §5).

## 2. Information architecture and navigation
- [x] One `<main>`; the layout's skip link reaches its `#main` mark
- [x] Every link through `A` or `Cta`
- [x] ~~Breadcrumb at depth 2 or more~~ n/a: depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: Parity links 4/4 (/login, github.com/hanzoai, /contact-sales, platform.hanzo.ai/deploy).

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] ~~`PageHero`~~ the kit's `KeynoteStage` (h1 52px at ~38%, nothing above it; the kicker sits under the asks)
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof (architecture checks, plans), close, footer
- [x] ~~Card-to-page links use Morph~~ n/a: no card opens into a page

Done here: At first paint by CSS: the title cuts in and the command `hanzo dns zones records create example.com` types itself (0.3 s, 1 s, 42 steps) with a caret that blinks four times; then the record lands as a diff and the query walks its path. JS off at 1470 and 375: every word shows (diff line, answer, merged view, pipeline, layers are base states; only the kit's JS-only chapter rail numbers hide).

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn` or hand-made `kn-btn` ask
- [x] Sticky ask in header ("Try Hanzo", the page's own words, so no phone bar)
- [x] Copy button copies exactly the displayed text (the kit CodeBlocks: CLI, agent prompt)
- [x] `data-cta` and `data-thumb` on every primary

Done here: `data-cta` ids: dns.hero (thumb), dns.hero-2, dns.plan-starter/pro/team/enterprise, dns.close. The CLI copies the comments and commands without the `$ ` prompt.

## 5. Trust and proof
- [x] No logo; no seal; no invented number
- [x] Every figure traces to Hanzo's copy
- [x] ~~Marquees~~ n/a: none
- [x] ~~Privacy link by every submit~~ n/a: no form

Done here: The page prints no figures beyond Hanzo's (Up to 5 zones, 2 DNS providers, /month). Zone names and addresses are documentation examples (example.com, 192.0.2.0/24); bars and dials are drawn.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Code uses the kit CodeBlock; ~~tables, FAQ, tabs~~ n/a: none on the page
- [x] `python3 scripts/parity.py /dns`: 0 missing

Done here: Parity text 113/113, links 4/4. Phone audit at 375: nothing under 14px outside the kit's 12px mono counts. Sizes: h1 52/40, headings 26, H3 17 (use cases) and 21 (plan names), body 16, plan "Custom" 32.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; deck greys only
- [x] No label, tag, badge or pill above a headline
- [x] Radii 6/12/16/24/999; no shadow; never outline plus fill
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: taste OK. Replaced #a1a1a6 #d1d1d6 #141416 #6e6e73 #48484a #f5f5f7 #0b0b0c #8e8e93 #c7c7cc #f0f0f3 #161618 and the pink; 9 shadows and the packet glow removed. Status by shape: the "+" and fill of the added line, filled path nodes, providers lit by fill, the control plane as the one light plate in the room, Hanzo plugins as the one ink outline, the ink plan.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] ~~Dialogs~~ n/a: none
- [x] ~~Inputs~~ n/a: no input; no bare `:hover`
- [x] Forks this page deleted: listed above

Done here: Need chips use `aria-pressed`, hover a border, press .97 at 90 ms, focus `2px solid var(--focus)` (white inside the ink plan). The room's pause is the kit `.kn-pause` (44px, `aria-pressed`, "Pause" from `content/ui-strings.json`). 0 `title=`.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [ ] ~~Sound~~ need chips carry the kit's `data-sound="tick"`; nothing else added

Done here: `variety.py` OK (pathLength only). Kinds: idle (zone cycle, packets), time (typing, the path walk), state (needs light a plan), arrival (cut-in), scroll (chapters, Stage settle, room). Phones step each chapter once and rest; the DNSSEC key turns once (3 s). Loops over 5 s: the hero (Stage pause) and the packets (the room's own pause, before the diagram in the DOM).

## 10. Media
- [x] ~~`Film`/`Pic`~~ n/a: no Hanzo image or film; objects are drawn product UI
- [x] ~~Videos~~ n/a
- [x] ~~Budgets, alt~~ n/a
- [x] ~~Photos~~ n/a

Done here: Objects: the zone as code, six chapter scenes (ring, fan-out, CodeBlock, pipeline, dial, stack), the architecture flow, the plan sheet, the prompt.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: Audit: 320 sideways none, phone targets under 44px none (the Stage's GitHub link was 21px, now 44px), sweep desk/phone none. The command now wraps beside its `$`; the ask ends near y≈270 at 375.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] ~~Forms~~ n/a
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: Muted text #525252 on #f5f5f5 plates, #737373 only on white; on ink #fafafa, white 78%, #a3a3a3. Plans that fall short step back to 50% (a state, the fitting plan stays full). Heading order 1, 2, 3×6, 2, 2, 3×3, 2, 3×4, 2: no skips.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: First-screen motion is CSS on server HTML; the zone runs one timeout chain only while seen and unpaused. Filming ran in the cloud container.

## 14. SEO and machine files
- [x] Title and description match live (`content/pages.json`)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses
- [x] ~~Every card is a real link~~ n/a: no cards link out

Done here: "Hanzo DNS — Hanzo AI" and Hanzo's description via `app/dns/page.jsx`; canonical and og:url `https://hanzo.ai/dns/`.

## 15. Catalogue and product pages
- [x] ~~Model card~~ n/a: not a catalogue or model page
- [x] ~~Morph~~ n/a
- [x] ~~Maker and model links~~ n/a
- [x] One price figure everywhere ("Custom", as printed)

Done here: Cloud product anatomy: identity (Stage), the console (zone), openable capabilities (six chapters), the plan sheet, the Get block.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display
- [x] ~~Config parses~~ n/a: shell only
- [x] Terminal ends on a static frame (the CLI rests on its last step; the hero's caret stops after four blinks)
- [x] No hand-typed version number

Done here: The CLI block is Hanzo's six comment/command pairs; `curl -fsSL https://hanzo.sh | sh` copies without a `$ `. The close's prompt is the kit CodeBlock.

## 17. States and resilience
- [x] ~~Loading, empty, error, offline~~ n/a: no live data or form
- [x] Blocked live data leaves a complete page, no console errors
- [x] ~~Failed submit~~ n/a
- [x] A thrown island does not blank the page

Done here: No fetch on the page; film and sweep: 0 console errors at desk and phone. The no-need state of the Beyond shows Pro as Hanzo's Popular; reduced motion shows every scene finished.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through the kit `Cta`
- [x] Nothing identifier-bearing before consent
- [x] `V2: 8/10 …` in the page file's top comment
- [ ] Review read: no `docs/build-notes/review/dns.md` yet

Done here: Gallery `docs/gallery/dns/` (desktop.mp4, desktop.jpg, phone-1..3.jpg). Own score 8/10; the critic's verdict decides.
