# /sign coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/apps/Sign.jsx` (+ `Sign.css`) · gallery: `docs/gallery/sign/` · metric id: `signup_start`

Open copy questions for James: functional labels not in `content/ui-strings.json`: the pad's "Sign here", "draw here", "ready to sign", "signed", "Clear", "Sign", "Signed <date>"; the plan switch "Run it yourself" / "We run it" uses Hanzo's lede words as button labels.
Shared changes requested (`docs/requests/sign.md`): none. Noted: no skip link in shared chrome; `useEvery`/`useSteps` use `setInterval`; `tokens.css` not merged.
Forks this page deleted: the separate hero (now the pinned story's lead), the floating desk pause, the "09"/"10" tile numbers, the "Most Popular" pill (now a line), the three equal dark cards (now one ask and text links), the white "Get started with Sign" box (now a hairline row), the pad's rewritten certificate sentence, every spring, the "ink indigo" comments.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; "Try Hanzo" → /login
- [x] One h1; clear in 5 seconds
- [x] No dead button; prices are Hanzo's plan copy (n/a `lib/plans.js` until it merges)
- [x] Copy questions listed

Done here: gate: 1 h1, max 1 solid per desktop viewport. The pad's "Sign" is a page solid (`button.solid`), so the ask bar steps aside while it is on screen.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; n/a skip link (shared chrome)
- [x] Every link through `A`; part cards open sheets
- [x] n/a breadcrumb
- [x] Link parity 0 removed

Done here: parity links 9/9.

## 3. First impression and page narrative
- [x] Sells in 5 s; the desk moves within 1 s (it starts at "fields placed")
- [x] h1 CSS cut-in painted by the server; nothing above the h1
- [x] JS off legible
- [x] One idea per screen: hero desk → 5 steps on the same page → parts → pad → price → open source → dark close
- [x] Ends on one ask, then footer
- [x] n/a Morph

Done here: the hero and the five steps are one pinned story on one page object; under reduced motion the desk shows the signed, stamped final state. Gate JS-off hidden 0.

## 4. Conversion system
- [x] Kit `A` + `.w2-cta`
- [x] Sticky ask "Try Hanzo" in header and bar
- [x] n/a copy button
- [x] `data-cta` and `data-thumb` on the primary

Done here: `sign.hero` (`data-thumb`), `sign.close`. The close has one solid; docs and source are text links.

## 5. Trust and proof
- [x] No logo, seal or invented number
- [x] Figures are Hanzo's ($30, $50, twelve languages, five steps)
- [x] n/a marquees
- [x] n/a submit (the pad sends nothing)

Done here: the "09"/"10" decoration numbers are gone; demo names are "signer 1–3" and "person 1–5".

## 6. Content presentation (copy untouched)
- [x] Phone text 14px+ (gate small375 fixed for "Most Popular")
- [x] Measures held; long language names step down a size so "Brazilian Portuguese" fits
- [x] Part sentences live in their sheets; n/a tables
- [x] `parity.py /sign`: 0 missing

Done here: parity `text 106/106 links 9/9`.

## 7. Visual design system
- [x] `taste.py` passes (0 hues)
- [x] No label above a headline; the sheet kicker now sits under its title
- [x] Plans legible when not chosen (muted price, full opacity)
- [x] One icon set
- [x] Differs from neighbours: a paper desk with a contract, not a window or editor

Done here: gate hues []. Headings rest at 26px (Rhythm.css); "$30"/"$50" are the figures.

## 8. UI component library
- [x] Hover inside `@media (hover:hover)`, press .97–.98, focus-visible
- [x] Focus ring on every stop; the pad canvas is focusable (Enter writes the ink line)
- [x] Sheets trap Tab, close on Esc and return focus to the card
- [x] No bare `:hover`; chips 44px with hover and press
- [x] Forks deleted: listed above

Done here: `components/v2/OpenSheet.jsx` now traps Tab and restores focus on close.

## 9. Motion and interaction
- [x] Signature (the self-signing page), supporting: PinChapters, sheets, magnetic; 0 fade-ups
- [x] Idle (desk, five recipients, languages), state (sheets, plan switch), pointer (pad, magnetic), arrival (h1 and five headings cut into their line), scroll (pin)
- [x] Something moves without input; every control answers
- [x] Reduced motion: signed final state; no springs
- [x] n/a sound (shared kit)

Done here: `variety.py` OK; chapter 04 advances its three recipients one by one; the ink path is hidden until it draws (no stray dots).

## 10. Media
- [x] Kit `Img` only (the file icon)
- [x] n/a video
- [x] Sized (38×38)
- [x] n/a photos

Done here: one decorative `Img` with `alt=""`.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Targets 44px+
- [x] Primary above the fold at 375×667

Done here: the phone desk has one top bar (name left, pause right) and the step counter below it; the checkbox tick sits in its own box, off the label.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured (muted plan price #737373 on #f5f5f7 is large text)
- [x] Pause on every moving item, in the object's bar or above its rows
- [x] n/a forms; the pad's result line is `role="status"`
- [x] One h1; h2 → h3 order ("Built on Open Source" is now an h2)
- [x] Keyboard reaches every control

Done here: sheets trap focus; the desk's step names are repeated in an `x-sr` line.

## 13. Performance and engineering
- [x] h1 and lede in server HTML
- [x] One small image, sized
- [x] No poller, no third party
- [x] Nothing heavy on James's laptop

Done here: one client island.

## 14. SEO and machine files
- [x] Title and description from `content/pages.json`
- [x] Canonical from shared layout
- [x] `<JsonLd route="/sign" />`
- [x] n/a cards

Done here: `app/sign/page.jsx`.

## 15. Catalogue and product pages
- [x] n/a
- [x] n/a
- [x] n/a
- [x] Prices shown once each (plan cards)

Done here: n/a, not a catalogue or model page.

## 16. Developer experience
- [x] n/a: no code on the page
- [x] n/a
- [x] n/a
- [x] n/a

Done here: n/a.

## 17. States and resilience
- [x] Pad states: empty, ready, signed; Clear resets
- [x] Blocked network leaves a complete page, no console errors
- [x] n/a submit
- [x] n/a islands that throw

Done here: look.cjs both widths: errors none.

## 18. Measurement and handover
- [x] `data-cta` on every primary
- [x] Nothing identifier-bearing
- [x] `V2:` line in `app/sign/page.jsx`
- [ ] Review 8 or more (re-review pending)

Done here: previous review 6/10 (on an older build); its seven fixes are addressed.
