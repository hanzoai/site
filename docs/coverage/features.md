# /features coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Features.jsx` (+ `Features.css`) · gallery: `docs/gallery/features/` · metric id: `first_chat`

Open copy questions for James: "Find a feature" is the finder's label and now also its visible placeholder (a UI string, listed here for the register). The closing band repeats the three product names already on the page as its object.
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
- [x] Hero keyboard → three product rooms, each its own layout (Chat: rows beside the film; Dev: a full-bleed black room with the film as its ground; Design & Cloud: a wide film over two side-by-side rows) → closing band
- [x] Ends on the band (three film cards and the one ask), then footer
- [x] Each room's film card and heading open its product (/chat, /dev, /design) as a page transition; no `data-morph` (its title would not land on those pages' h1s)

Done here: the display and the top row of keys sit on the first screen at 1470×801; the first self-press lands 0.9 s after arrival. On phone the display sits in the instrument above the board (no longer sticky, so it never covers keys), and a tapped key and the display share the first 812px.

## 4. Conversion system
- [x] Kit `A` + `.w2-cta`
- [x] Sticky ask "Open Chat" (desktop by the shared Ask; phones by the page-local `usePhoneAsk`: the header outlines while the page's ask shows and reads "Open Chat" after the hero, probed at 0/900/2000/4000px)
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
- [x] Signature (self-playing keyboard), supporting: Settle, rows that step and open, magnetic; 0 fade-ups
- [x] Idle (keyboard, films, rows stepping), pointer (key and row hover, magnetic, film card lift), state (key press, row open), arrival (h1 cut-in), scroll (settle only)
- [x] Moves without input; every control answers
- [x] Reduced motion: the keyboard rests; no springs
- [x] n/a sound (shared kit)

Done here: in each product room one feature row opens at a time (stepping every 2.6 s while in view; hover, tap or focus takes over), and the film answers it: it moves to a new crop (scale and origin, 500 ms ease-in-out) and its caption names the open feature, with the counter and progress bar. The pinned chapters and their word mocks are gone.

## 10. Media
- [x] Hanzo's own model films through the shared `ModelFilm` (poster first, plays only in view, never under reduced motion)
- [x] At most 2 playing (the ModelFilm budget); one page pause (`FilmPause`) in the first room stops films and rows
- [x] Sized
- [x] n/a photos

Done here: Enso (Hanzo Chat), Zen (Hanzo Dev) and Iro (Design & Cloud) films are the rooms' objects and the page's only colour; the close shows their three posters together.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Targets 44px+
- [x] Primary above the fold at 375×667

Done here: (8 Nov) the three rooms ride one sideways gallery on wide screens and a swipe rail on phones (scroll-snap, never pinned). On phones every film is 16:9 and each room has its own order: Chat film then rows, Dev words then a film strip, Design title then film then rows (one `@media (max-width: 899px)` block in Features.css). On desktop the Design room reads title, wide film, then its two rows and the description. Room descriptions announce only after a hand picks a row (`aria-live` off while they step); the description crossfade lets the old line go before the new one lands. The spring-snap entrance now lands on a hard ease-out with no overshoot.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast: display text #d4d4d4 / #a3a3a3 on #0a0a0a
- [x] Pause in the display bar, and the page film pause in the first room's corner
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
- [x] `V2:` line in the top comment of `components/pages/Features.jsx` (the file the status board reads)
- [ ] Review 8 or more (re-review pending)

Done here: review 6/10 (7 Nov) read; round 3 answers it: rooms stack on phone, real Hanzo films, rooms open their products, phone ask, hero tightened (h1 52px, first key row above 801), display label wraps, rows drive the film, band has an object.
