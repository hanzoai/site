# /risk coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/apps/Risk.jsx` · gallery: `docs/gallery/risk/` · Persona: enterprise buyer (fraud, AML, trust and safety) · Goal and metric: `contact_sales_submit` · CTA: "Talk to us" → /contact-sales

1. **Strategy and conversion.** One ask, Hanzo's "Talk to us": solid in the hero (`data-thumb`, `data-cta="risk.hero"`), carried by the shared ask bar after the hero, and again as the first of the three "Next" cards at the close (`data-cta="risk.close"`, outlined so only one solid shows per screen).
2. **Information architecture and navigation.** Hanzo's header and footer unchanged. Order: the dial (hero), the two faces as one statement, where it stands today, three pinned chapters (compliance, lifecycle, agents), what it decides on, the dark room (your data, your model), rules and platforms, how it connects and plans, what it is not and next. Links to /commerce, /idv, /guard, /analytics, /api and the source stay in Hanzo's sentences.
3. **First impression and page narrative.** Headline cuts in line by line; the live dial sits under it and is already deciding within a second (needle, score, action). After that, one idea per screen: the statement, the two faces, then pinned chapters where the words hold and the case file, the stage track and the four-fact lanes change beside them.
4. **Conversion system.** One solid per viewport: the hero ask, then the shared ask bar (the header's Try Hanzo turns outline while it shows). No same-page hrefs.
5. **Trust and proof.** Every status reads by word and shape (a filled chip for available now, a hollow ring for in development). The dial says "Illustration. No figure on this page is a customer result." No seals, no invented numbers.
6. **Content presentation (copy untouched).** Parity 114/114 text, 7/7 links. No label above any headline: "Risk" now sits inside the dial as its name; chapter tags sit under the words. The six AML capabilities, the three stages and the agents argument open from buttons into sheets; the four "decides on" cards open into sheets; all text stays in the HTML.
7. **Visual design system.** v2 scale (`components/v2/Scale.css`). 0 UI hues (JAMES.md): the hot side of the dial is grey with an ink tick, "summon a person" is an inverted ink chip, lanes and stops are ink. Hero object 28px radius, cards 16px. One dark room.
8. **UI component library.** Kit `A`, `Magnetic`; v2 `Settle`, `OpenSheet` (`OpenCards`, `Detail`), `x-gauss/PinChapters`, `x-gauss/LineMask`, `x-gauss/Pause`, `x-gauss/NoJs`; shared `Sigil`. Stage tabs are `role=tablist`; fact toggles are `role=switch`. No browser-default controls.
9. **Motion and interaction.**
   - Idle: the dial walks the stages and sets signals to neutral by itself; the case file fills step by step; the lifecycle track walks its stages; the lanes route a caller.
   - Pointer: magnetic ask; reasons and buttons press at .98/.99; cards lift and their plus turns; the Sigil leans to the mouse.
   - State: tabs, toggles and the attribution (set a signal to neutral and the score drops); sheets morph out of their card.
   - Scroll: the dial settles (Stage) and the chapters pin. Scroll is under half of the page's motion.
   - Every self-running demo has a pause button (WCAG 2.2.2); decorative CSS loops run once.
10. **Media.** No Hanzo photography belongs to this page; its objects are product UI (dial, case file, track, lanes, endpoint) and the shared Sigil, seeded with the page's own figures (5-year clock, 20 rules, 4 tiers, 3 stages).
11. **Mobile and responsive.** At 375px the dial's gauge peeks under the ask on the first screen; chapters stack with their visual pinned above the words; sheets rise from the bottom; targets are 44px or more; no sideways scroll.
12. **Accessibility.** One h1. Live score and action are `aria-live`. Sheets trap focus, Esc closes, focus returns. Pause buttons are `aria-pressed` with a label. JS off: `NoJs` shows every word and stacks the chapters.
13. **Performance and engineering.** Transform, opacity and clip only. Every loop stops off screen (`useLive`) and when paused.
14. **SEO and machine files.** Metadata and JSON-LD unchanged (`app/risk/page.jsx`).
15. **Catalogue and product pages.** Does not apply.
16. **Developer experience.** The endpoint paths (/v1/aml, /v1/risk, POST /v1/event) are shown as product UI; no code to copy on this page.
17. **States and resilience.** Static Hanzo copy, no live data; no loading or error state needed. Reduced motion shows the final dial.
18. **Measurement and handover.** `data-cta` on both asks. Filmed into `docs/gallery/risk/`.
