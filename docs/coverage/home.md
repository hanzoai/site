# / coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Home.jsx` (sections: `components/Hero.jsx`, `Models.jsx`, `Platform.jsx`, `Agents.jsx`, `Race.jsx`, `Cheaper.jsx`, `Pareto.jsx`, `Open.jsx`, `Pricing.jsx`; styles `components/pages/Home.css`; v2 pieces owned by Home: `components/v2/Lines.jsx`, `Chapters.jsx`, `Stage.jsx`, `system.css`) · gallery: `docs/gallery/home/` · metric id: `api_key_created`

Open copy questions for James:
- The conductor's note lists "Open Hanzo" and "Read docs" in the hero. Those are live hanzo.ai's signed-in hero. The captured live home (`content/live/index.json`) is signed out and carries "Continue with Google", "Continue with GitHub" and "Continue with email", so the hero keeps those until a signed-in swap exists (PLAN-COMPONENTS 1.2, a cookie the app already sets).
- "Backed by" names ship only with documented permission (PLAN-COMPONENTS 1.3 #3). They are kept as live has them until James decides.

Shared changes requested (`docs/requests/home.md`): none needed. The site ask bar is turned off for this page with `data-ask="off"`, and the cursor label is silenced with `data-cursor=""`. Both are documented options of the shared layers.

Forks this page deleted:
- Two scroll-velocity `Marquee` strips (now still logo walls).
- The coverflow carousel.
- Tablists without panels (pricing and console now use kit `Tabs`).
- `.x-btn` in pricing.
- The calendar's idle sweep.
- Blur in the price roll.
- Per-card `whileInView` entrances.
- The edge "spine" index (it floated over content).
- The springs in pricing, cost, chart and calendar.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`: the header's "Try Hanzo". The hero keeps live's solid "Continue with email" (the hero is live's own, kept exactly).
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button: pricing buttons with no destination (Dev, Max, Ultra, Enterprise, Volume) are hidden, not looped
- [x] Open copy questions for James listed, none decided

Done here: Persona, Goal, CTA, Metric, Signature and Beyond head `Home.jsx`. "Try Hanzo" is the one sticky ask, in the header at every width. One `<h1>` ("Smarter, Faster, Open Source. Pick all three.") is in the server HTML.

## 2. Information architecture and navigation
- [x] One `<main>`; the site skip link reaches it
- [x] Every link through `A` or a real `<a href>`; every card a real link
- [ ] n/a: breadcrumb (depth 1)
- [x] Link parity: 0 removed, 0 unexpected

Done here: Parity shows 132/132 links. Model cards link to `/<model>`, product names to their pages, and repos and logos to their sources.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input: the install command and the prompt type themselves, and the headline lines rise
- [x] Nothing above the h1 except live's own "A New Pareto Frontier" pill (the hero exception in MASTER 3.3). `PageHero` is not used: the hero is live hanzo.ai's own (MASTER 3.1).
- [x] JS off: legible. Every chapter is shown, the doors are open, and the band is sharp (`@media (scripting: none)`).
- [x] One idea per screen. The model cards start within one viewport of the headline at every desktop size from 1024 to 1470 (measured 616–689 px).
- [x] Ends in the Backed-by wall, then `Band`, then the footer
- [x] Model cards open into their page with the WebGL opener; product names carry `data-morph`

Done here: The order is hero, model cards, platform chapters, agents, one dark room (speed, cost, frontier), open source, Trusted by, pricing, Backed by, then Band (MASTER 4.1).

## 4. Conversion system
- [x] No raw `.x-btn` in home sections (kit `Band` and `More` only). `<Cta>` is not in the kit yet.
- [x] Sticky ask in the header at every width. The floating bar is off here because nothing may float over content (MASTER 3.2 rule 6).
- [x] The hero's copy buttons are live's own. The console's kit `Copy` copies exactly the displayed command.
- [x] `data-cta="home.*"` on every action

Done here: The header's "Try Hanzo" is the one solid ask after the hero. Pricing buttons are quiet outlines aligned on one line (subgrid). 8 Nov: the hero terminal's Copy is a real button that copies exactly `curl -fsSL https://hanzo.sh | sh`, says Copied in a `role=status`, has a hover, a .97 press and a 44px hit area (`data-cta=home.install_copy`).

## 5. Trust and proof
- [x] No seal; no invented number
- [x] Every figure traces to Hanzo's copy, with its qualifier beside it ("up to", the 95% interval, the p50 note, and the Epoch and Moonshot sources)
- [x] No marquees: Trusted by and Backed by are still, ordered walls, and a logo's name stands in if its file fails
- [ ] n/a: no form submit on this page

Done here: Parity shows 570/570 texts. The figures are Hanzo's: 3.02×, 9.6×, 14.2×, 530×, the GPQA chart and 805,254.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals and the spec'd model-card pills and descriptions (`SPEC.md`: 10px pill, 13px description)
- [x] Headings balanced, one line each at 26px
- [x] Tabs use the kit (`Tabs`/`TabPanel`); the pricing choices are radio groups with arrow keys
- [x] `python3 scripts/parity.py /`: 0 missing

Done here: Section headings rest at 26px and sublines at 16px; figures rest at 64px in Zen Air, plan prices are 44px and captions are 12–13px Zen Mono capitals, so each screen has one big thing. Plan feature lists beyond the first three stay in the HTML (hidden list items) so parity is 570/570.

## 7. Visual design system
- [x] `python3 scripts/taste.py` passes on every home file
- [x] No label above a headline: chapter counters and figure labels sit under their titles
- [x] Deck greys only (#525252 muted, #a3a3a3 on black, #fafafa on black); radii 20 (cards), 16 and full (pills and buttons)
- [x] One icon style (inline strokes); agent marks are logos
- [x] Differs from neighbours: live's hero, SPEC cards, one dark room for the argument

Done here: There are two black rooms, never back to back: the argument (speed, cost, frontier) and the closing band. The argument room enters as a rounded card inside the gutters and opens to full width as it is reached.

## 8. UI component library
- [x] Every control has hover (inside `@media (hover: hover)`), press (scale .98 or 1px down), and a focus-visible ring
- [x] The focus ring is visible on every stop (the shared ring, plus the ink outline on the model cards)
- [ ] n/a: no dialogs on this page
- [x] No bare `:hover` in `Home.css`
- [x] Forks this page deleted: listed above

Done here: Kit `Tabs` (console, pricing), `Img`/`Film` (model cards), `Band`, `More`, `Copy`.

## 9. Motion and interaction
- [x] One signature (a model card opens into its page). Supporting techniques: line-mask cut-in, pinned scene (platform chapters), count-up. No fade-ups.
- [x] Kinds of movement:
  - **Time:** the hero demo; the race at true speed.
  - **Pointer:** card tilt (±2.7°); the budget line; the calendar lens; the rail.
  - **State:** tab pills, rolling prices, Replay.
  - **Arrival:** the headline cut-in.
  - **Scroll:** chapters, the doors, and figures that grow and settle.
- [x] Something moves untouched (the hero demo, the films); every control answers
- [x] Reduced motion shows the final state. `setInterval` remains only inside live's hero port (`Hero.jsx`, kept exactly) and the agent sign-up typing.
- [ ] n/a: sound is a shared layer

Done here: Hero.jsx keeps live's three springs (bubble, roster, pointer) as part of live's own hero; other tweens use ease-emphasis. The hero lede no longer reveals with blur (opacity and rise only).

## 10. Media
- [x] `Film` and `Img` (kit) on the model cards; sizes and posters set
- [x] The model films loop while in view, exactly as `SPEC.md` asks (its exception to "at most 2 playing"). One pause button beside the subline stops them all.
- [x] Alt text on every logo; product renders are `aria-hidden` with text equivalents in the DOM
- [x] Nine real model films and posters together; never dimmed or filtered (`SPEC.md`)

Done here: Model media is `/models/<slug>.webp|webm`. Logos and the images inside three product screens load from hanzo.ai; when they fail, names stand in.

## 11. Mobile and responsive
- [x] No overlap at 375×812, 390×844, 414×896, 600×800, 768×1024, 800×600, 820×1180, 900×700, 1024×768, 1100×800, 1200×800, 1280×800, 1366×768, 1440×900 or 1470×801 (scripted box check)
- [x] No horizontal scroll at 320, 375 or 1470
- [x] Targets 44px or more; hover detail has a tap path
- [x] The primary ask (the sign-up group) is above the fold at 375×667

Done here: Pinned chapters stack below 900px, model cards go to 2 and 4 columns, and the hero follows live's own phone layout. 8 Nov: the frontier has its own phone drawing (640×660 viewBox, 12px labels, 8px dots, a 96-unit/45px budget handle); the agent panels no longer push past 375px; arrow links, Terms/Privacy and source links are 44px tall on phones.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Muted text #525252 on white (7.8:1); on black #a3a3a3 and white 78%
- [x] Pause control on the model films; the hero demo rests when off screen (live's port)
- [ ] n/a: no forms
- [x] One h1, then h2s per section and h3s in pricing
- [x] Keyboard reaches every control (kit tabs follow APG; the budget line is a slider with arrow keys)

Done here: Inactive chapters are `inert`. Every panel is in the HTML. 8 Nov: the hero demo has a 44px pause (A2Pause, aria-pressed) first in the stage; pausing holds the typing loop and the roster.

## 13. Performance and engineering
- [x] h1 and LCP (the hero headline) in server HTML
- [x] Every image and video sized (`Img`/`Film` w and h)
- [x] No new poller; no third-party request
- [x] Nothing run on James's laptop (cloud only)

Done here: Animation is transform, opacity and clip-path only. CLS is 0.001 on phone and 0.02 on desktop (measured).

## 14. SEO and machine files
- [x] Title and description unchanged (`app/page.jsx`)
- [ ] n/a: canonical is a shared layout concern
- [x] `<JsonLd route="/">` unchanged
- [x] Every card is a real link

Done here: Every word, including inactive tabs and every chapter, is in the server HTML.

## 15. Catalogue and product pages
- [x] Model card matches `SPEC.md`:
  - Grid 2fr plus 4×1fr, rows 220 and gap 12.
  - #000 at radius 20, with the title at 22px (Enso 44px).
  - Mono pills.
  - The webm plays over the webp.
  - Tilt at perspective 900 with a .3s ease.
- [x] Every card opens into its page (WebGL opener)
- [ ] n/a: not the catalogue
- [ ] n/a: no prices repeated across contexts

Done here: The section heading is 26px, as on live. "Explore model pricing →" and "View full model catalog →" sit under the grid, left and right.

## 16. Developer experience
- [x] Copy equals the displayed command (live's terminal; the console's kit `Copy`)
- [ ] n/a: no config blocks
- [x] The agent sign-up script ends on a static step and stops on user input
- [x] No hand-typed version number added

Done here: The console tabs (Hanzo.Start, Hanzo.Agents) hold every command and the four-step script in the HTML.

## 17. States and resilience
- [x] Logos blocked: names stand in. Images blocked in product screens: the frames stay.
- [x] Blocked hanzo.ai assets leave a complete page with no console errors (measured)
- [ ] n/a: no submit
- [x] JS off: the page is legible

Done here: The `scripting: none` rules keep every word visible. 8 Nov: with JS off the hero words show (CSS override on `html:not(.js)`) and the terminal shows the command from `data-cmd`.

## 18. Measurement and handover
- [x] `data-cta="home.*"` on every action
- [x] Nothing identifier-bearing
- [ ] `V2: <score>/10`: pending the critic
- [ ] Review read: pending `docs/review/home.md`

Done here: Proof is in `docs/gallery/home/` (desktop-hero, phone-1..3, 8 Nov). Ready by the new bar, no score.
