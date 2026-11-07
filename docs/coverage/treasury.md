# /treasury coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/apps/Treasury.jsx` · gallery: `docs/gallery/treasury/` · Persona: developers building wallets, splits and payouts inside their product · Goal and metric: `api_key_created` via the docs · CTA: "Read the docs" → docs.hanzo.ai/docs/cli/treasury

1. **Strategy and conversion.** One ask, Hanzo's "Read the docs": solid in the hero (`data-thumb`, `data-cta="treasury.hero"`), in the ask bar after the hero, and solid again at the close (`data-cta="treasury.close"`). GitHub, "View on GitHub" and "Deploy to Cloud" are outlined.
2. **Information architecture and navigation.** Header and footer unchanged. Order: the dark-room split, the one-line statement, five pinned parts, the wallet you drive, the close.
3. **First impression and page narrative.** "Hanzo Treasury" cuts in over the dark room; split.num writes itself under it and each destination's stream pours out until "balanced". Then one part per screen.
4. **Conversion system.** One solid per viewport. The wallet's buttons are controls.
5. **Trust and proof.** The only figures are the split's own (10,000 / 9,000 / 500 / 500, USD/2). No uptime or customer numbers.
6. **Content presentation (copy untouched).** Parity 57/57, 3/3. "Treasury Operations" names the editor bar instead of sitting above the headline; "Wallets with holds" sits under its headline; part tags sit under the words.
7. **Visual design system.** v2 scale. 0 UI hues: the 90% stream is white, the 5% silver, the remainder grey; a break is an inverted ink mark; a hold is a grey hatch. One dark room (the hero).
8. **UI component library.** Kit `A`, `Magnetic`; v2 `Settle`, `x-gauss/PinChapters`, `LineMask`, `Pause`, `NoJs`.
9. **Motion and interaction.**
   - Idle: split.num types itself and the streams draw (line draw); the flow chapter walks capture, split, pay out, retry with events; the wallet takes, holds, pays and releases by itself.
   - Pointer: magnetic ask; buttons press at .98.
   - State: the wallet's numbers roll; events arrive one by one.
   - Scroll: the split settles; parts pin.
   - Pause buttons on the split, the parts and the wallet.
10. **Media.** Product UI only (editor, streams, ledger rows, wallet).
11. **Mobile and responsive.** At 375px the editor and the streams stack, part visuals pin above their words, the wallet stacks; targets 44px; no sideways scroll.
12. **Accessibility.** One h1. Event list is `aria-live`. JS off: `NoJs` (the editor shows every line).
13. **Performance and engineering.** Loops stop off screen and when paused.
14. **SEO and machine files.** Unchanged.
15. **Catalogue and product pages.** Does not apply.
16. **Developer experience.** The Numscript split is shown in full as Hanzo writes it.
17. **States and resilience.** The wallet has idle, held, paid and released; buttons disable when they don't apply.
18. **Measurement and handover.** `data-cta` on both asks. Filmed into `docs/gallery/treasury/`.
