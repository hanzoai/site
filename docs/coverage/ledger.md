# /ledger coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/apps/Ledger.jsx` · gallery: `docs/gallery/ledger/` · review answered: `docs/review/ledger.md` (5/10 at 981cd30)

1. **Strategy and conversion.** Persona, Goal and CTA are in the page header. One ask, Hanzo's "Read the docs": solid in the hero, the AskBar after the hero, the phone thumb bar (`data-thumb`) and again as the close's only solid button. "GitHub", "View on GitHub" and "Deploy to Cloud" are text links.
2. **Information architecture and navigation.** Hanzo's header and footer are unchanged. Order: what it is and the live book, then why a cent cannot go missing (three chapters), what the API gives you, splitting it yourself, and getting it.
3. **First impression and page narrative.** At 1470×801 the title, one line, the ask and the whole live book sit on the first screen. At 375×812 the book starts at about 450px. The h1 cuts in by line mask (pure CSS, so it is legible with JS off), and the book posts within the first second. There is no label above the h1.
4. **Conversion system.** `data-cta="primary"` is on the hero and close asks, and `data-cta="secondary"` on the Deploy row. There is one solid button per screen. The close is one Display sentence, the same ask, and one full-width text row.
5. **Trust and proof.** The book shows the totals meeting (Σ 0 on every transaction), the refusal, the reversal and the idempotent retry, all from Hanzo's own split-payment example (9,500 + 500 of 10,000).
6. **Content presentation (copy untouched).** Parity is 55/55 text and 3/3 links. The hero paragraph is one paragraph in the HTML, placed in two spots by `display: contents`. The request lives in a "See the request" sheet. The capabilities are tabs, with every panel in the HTML.
7. **Visual design system.** Ink, greys and silvers only (0 hues). The v2 scale comes from `components/v2/Biz.css`: display 96, headline 56, title 28, body 19, Zen Mono labels. Hero objects use a 28px radius and hairlines. There is one dark room, the capabilities.
8. **UI component library.** Kit `A` and `More`, v2 `BizLines`, `BizStage`, `BizChapters`, `BizSheet` and `AskBar`, and Frame's `Paste` and `Code`. The slider, tabs, pause button and chips are all styled; nothing uses browser defaults.
9. **Motion and interaction.**
   - Idle: the book posts by itself and pauses on its button.
   - Pointer: the pause and chips lift, the Deploy arrow nudges, the slider thumb grows.
   - State: the capability pill glides (layoutId), the sheet rises, balances roll on a spring.
   - Scroll: the book settles (Stage) and the chapters pin.
10. **Media.** The page has no Hanzo images or film. The hero objects are product UI: the book, the posting, the chain, the retry, the capability objects and the splitter.
11. **Mobile and responsive.** At 375px:
   - the hero stacks as title, line, ask, book, then the rest of the paragraph;
   - the chapters pin their stage on top;
   - the tabs are full width;
   - text is 14px or larger and targets are 44px or larger;
   - there is no sideways scroll.
12. **Accessibility.**
   - One h1.
   - The tabs use real `role=tab` with arrow keys, and the pause button has `aria-pressed`.
   - The sheet traps focus and closes on Esc.
   - Reduced motion shows final states and hides the pause button.
   - Chapters dim only once JS runs.
13. **Performance and engineering.**
   - Motion is transform and opacity only.
   - The book runs only on screen (`useLive`) and stops when paused.
   - No blur, video or canvas.
14. **SEO and machine files.** Metadata and JSON-LD are unchanged (`app/ledger/page.jsx`). All copy is in the server HTML, including the sheet, the inactive tabs and every chapter.
15. **Catalogue and product pages.** This is a product page: the hero object is the product, with chapters, a "See the request" spec sheet and one closing ask.
16. **Developer experience.** The request has a copy button in the sheet, the agent prompt has a copy button, and the splitter writes the postings and the Numscript live.
17. **States and resilience.**
   - Splitter: an empty or zero amount reads "Type an amount above zero" and the seal shows "—".
   - Book: refusals read as inverted ink notes with a × cue.
   - There is no network fetch, so no loading state is needed.
18. **Measurement and handover.** `data-cta` attributes are ready for the event log (not wired yet; BRIEF-v3 §1). The page was filmed with `film.mjs` at 1470×801 and 375×812: `desktop.mp4`, `desktop-hero.jpg`, `phone-1..3.jpg`.
