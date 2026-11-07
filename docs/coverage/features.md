# /features coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Features.jsx` (+ `Features.css`) · gallery: `docs/gallery/features/` · metric id: `first_chat`

Open copy questions for James: "Find a feature" is the finder's aria-label only (no visible placeholder); visible text would need `content/ui-strings.json`. The closing band repeats the three product names already on the page as its object.
Shared changes requested (`docs/requests/features.md`): none. Noted: `parity.py /features` reports the shared header and footer units as missing on this route (a capture artifact); all 29 page units (indices 10–38 of `content/live/features.json`) are in the server HTML. No skip link in shared chrome; `tokens.css` not merged.
Forks this page deleted: the page's own chat room (a live AI call, banned by MASTER 3.3, and a duplicate of the footer's chat box) with its invented suggestions, error line and `title=` tooltips; the hero's second "Try Hanzo" (it repeats the header); "$ hanzo dev" and the agent/model/tool/memory labels in the chapter mocks; the floating pauses; the black lit key (now pressed silver); every spring; the "pink accent" comment.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; "Open Chat" → /chat?skip=login
- [x] One h1; clear in 5 seconds
- [x] No dead button
- [x] Copy questions listed

Done here: gate: 1 h1, max 1 solid per viewport. "Launch Dev" is a text link beside the ask.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; n/a skip link (shared)
- [x] Every link through `A`
- [x] n/a breadcrumb
- [x] Page links /chat?skip=login and /dev present

Done here: see the parity note above; page links 2/2.

## 3. First impression and page narrative
- [x] Sells in 5 s; a key presses within 2.1 s and the display changes
- [x] h1 CSS cut-in painted by the server; "Platform Features" sits below the h1
- [x] JS off: one feature shows on the display (no overlap)
- [x] Hero keyboard → three pinned chapters → closing band
- [x] Ends on the band with the one ask, then footer
- [x] n/a Morph

Done here: the display and the top row of keys sit on the first screen at 1470×801; on phone the display is sticky above the board, so a tapped key answers in view.

## 4. Conversion system
- [x] Kit `A` + `.w2-cta`
- [x] Sticky ask "Open Chat"
- [x] n/a copy button
- [x] `data-cta` and `data-thumb` on both primaries

Done here: `features.hero` and `features.close`, both `data-thumb="Open Chat"`.

## 5. Trust and proof
- [x] No logo, seal or invented number
- [x] Keycaps 1–0 and "NN / 10" count Hanzo's ten features
- [x] n/a marquees
- [x] n/a submit

Done here: every word on the display and in the chapters is Hanzo's feature copy.

## 6. Content presentation (copy untouched)
- [x] Phone text 14px+
- [x] Display feature names are paragraphs (no h1 → h3 skip)
- [x] n/a tables
- [x] Page units present (see parity note)

Done here: gate small375 [].

## 7. Visual design system
- [x] `taste.py` passes (0 hues)
- [x] No label above a headline
- [x] The board is one raised object; keys flat-raised
- [x] One icon set
- [x] Differs from neighbours: a keyboard instrument, not a window, desk or editor

Done here: gate hues []; the display's feature name rests at 26px.

## 8. UI component library
- [x] Hover in `@media (hover:hover)`; keys travel 4px on press; focus-visible
- [x] Focus ring on every key; number keys 1–0 play keys
- [x] n/a dialogs
- [x] No bare `:hover`
- [x] Forks deleted: listed above

Done here: hovering a key with a mouse previews its feature on the display.

## 9. Motion and interaction
- [x] Signature (self-playing keyboard), supporting: Settle, PinChapters, magnetic; 0 fade-ups
- [x] Idle (keyboard, chapter rows), pointer (hover preview, magnetic), state (key press), arrival (h1 cut-in), scroll (pin)
- [x] Moves without input; every control answers
- [x] Reduced motion: the keyboard rests; no springs
- [x] n/a sound (shared kit)

Done here: in the chapters one feature row lights at a time and the visual answers that row (chip, checklist line, graph or store).

## 10. Media
- [x] Kit `Img` only (Enso mark)
- [x] n/a video
- [x] Sized
- [x] n/a photos

Done here: one decorative `Img`.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Targets 44px+
- [x] Primary above the fold at 375×667

Done here: `.xft-hero` uses `overflow: clip` so the phone display can stick.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast: display text #d4d4d4 / #a3a3a3 on #0a0a0a
- [x] Pause in the display bar and under the chapter visual
- [x] Finder labelled
- [x] One h1; no skips
- [x] Keyboard reaches every key; the display announces only keys the visitor presses

Done here: `aria-live` is off while the keyboard plays itself.

## 13. Performance and engineering
- [x] h1 in server HTML
- [x] One small image
- [x] No live API call, no third party
- [x] Nothing heavy on James's laptop

Done here: the page no longer posts to api.hanzo.ai.

## 14. SEO and machine files
- [x] Title and description from `content/pages.json`
- [x] Canonical from shared layout
- [x] `<JsonLd route="/features" />`
- [x] n/a cards

Done here: `app/features/page.jsx`.

## 15. Catalogue and product pages
- [x] n/a
- [x] n/a
- [x] n/a
- [x] n/a

Done here: n/a.

## 16. Developer experience
- [x] n/a: no code on the page
- [x] n/a
- [x] n/a
- [x] n/a

Done here: n/a.

## 17. States and resilience
- [x] Finder: empty, matches ("N of 10"), no match (keys dim)
- [x] Blocked network: complete page, no console errors
- [x] n/a submit
- [x] n/a

Done here: look.cjs both widths errors none.

## 18. Measurement and handover
- [x] `data-cta` on every primary
- [x] Nothing identifier-bearing
- [x] `V2:` line in `app/features/page.jsx`
- [ ] Review 8 or more (re-review pending)

Done here: previous review 5/10; its six fixes addressed.
