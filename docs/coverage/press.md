# /press coverage (MASTER.md part 2, the 18 parts)

- **Page file:** `components/pages/Press.jsx` + `Press.css`
- **Route:** `app/press/page.jsx`
- **Gallery:** `docs/gallery/press/`
- **Metric id:** one contact click (`press.hero`, mailto:press@hanzo.ai)

Open copy questions for James:
- (1) The partner logo files are linked and shown as live has them (MASTER part 5 asks for documented permission).
- (2) May the two leadership portraits from /authors appear on /press? They are Hanzo's own pictures, and the boilerplate names both leaders.

Shared changes requested (`docs/requests/press.md`): none.

Forks this page deleted:
- the page-local Sigil room;
- the spring-driven pointer card (now ease-out, beside the row);
- the masthead h1 size (the deck's h1 now);
- the outline-plus-shadow kit cards (now flat fills).

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport. "Contact Press Team" is Hanzo's own label (`lib/cta.js` does not exist yet). "Download Press Kit" is a quiet outline.
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button
- [x] Open copy questions for James listed, none decided

Done here: at 1470×801 the h1, lede and both actions sit above the fold. At 375×812 the ask ends at y≈384.

## 2. Information architecture and navigation
- [x] One `<main id="main">` and the skip link (both from the layout)
- [x] Every link goes through `A` or a real `<a>` (mailto, downloads)
- [ ] n/a: breadcrumb (depth 1)
- [x] Link parity: 0 removed, 0 unexpected

Done here: links 20/20. The kit zip, mail, /brand, six partner logo files, /blog, nine channels and hanzo.team are all present.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input. After the curtain, the h1 cuts in and the kit starts dealing.
- [x] `PageHero` equivalent: MaskLines h1, lede, one ask, the kit. Nothing sits above the h1.
- [x] JS off: legible. Checked with JS disabled: 0 faint or offset text. A `<noscript>` rule shows the words and facts.
- [x] One idea per 100svh. The rhythm alternates: hero, flat spread, statement, facts, news, black room, assets, tiles, quiet team room.
- [x] Ends on the page's own closing link ("Request Executive Bios"), then the footer.
- [ ] n/a: Morph. No card here opens into a page; the news rows link to /blog, as live does.

Done here: Story order per MASTER 4.4: hero sentence, the belief line with a scroll word reveal, the facts settling once, the news, the team.

## 4. Conversion system
- [x] No raw `.x-btn`. A page-local pill until kit `Cta` merges.
- [x] Sticky ask in the header and in the bar after the hero, same label
- [x] Copy buttons use ui `Copy`: it copies exactly the text and never confirms a failed write
- [x] `data-cta` and `data-thumb` on every primary

Done here: `data-cta` values are press.hero, press.kit, press.zip, press.mail, press.bios and press.team. `data-thumb` is on the hero ask and the closing bios ask.

## 5. Trust and proof
- [x] No seal, no invented number. Logo permission is an open question (above).
- [x] Every figure traces: 2016, San Francisco, CA, Hanzo AI, Inc., Techstars ’17, and every news line
- [ ] n/a: marquees (none)
- [ ] n/a: Privacy link (no form)

Done here: the facts and boilerplate are word for word from the live page.

## 6. Content presentation (copy untouched)
- [x] No text under 13px, except 12px mono capitals
- [x] Measures held: news headlines are 18ch and balanced, the belief line is a statement
- [ ] n/a: tables, FAQ, tabs, code
- [x] `python3 scripts/parity.py /press`: 0 missing

Done here: text 83/83, links 20/20.

## 7. Visual design system
- [x] `taste.py` passes; only deck greys
- [x] No label above a headline. "Media Inquiries", "Headquarters" and the fact labels sit under what they name.
- [x] Never box plus shadow. Kit cards and tiles are flat fills. Only the dealing plates and the pointer card float (deck floating shadow).
- [x] One icon set; no icon in a rounded box. The guidelines tile holds the Hanzo mark, not an icon.
- [x] Differs from neighbours in hero medium (a stack of kit plates)

Done here:
- `deck.css` is in: h1 clamp(52px, 7vw, 84px), headings 497, the statement at clamp(22px, 2.6vw, 32px), facts Air 220.
- Container 1152; buttons 48px. One black room (press contact).

## 8. UI component library
- [x] Every control has hover (inside `@media (hover:hover)`), press .97 and focus-visible
- [x] Focus ring: 2px ink with a white halo (white with a black halo in the black room)
- [ ] n/a: dialogs
- [ ] n/a: inputs
- [x] Forks deleted: listed above

Done here: the copy buttons are 48px icons with an aria-label ("Copy boilerplate", "Copy") and announce "Copied".

## 9. Motion and interaction
- [x] One signature, 3 supporting, 0 fade-ups (`variety.py` OK)
- [x] At least 3 kinds of movement: arrival, idle, scroll, pointer, state. Scroll-linked effects are 1 of 6.
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state: plain words, settled facts, no dealing. No `setInterval`.
- [ ] n/a: sound (kit not merged)

Done here:
- Signature: the belief line (60 words, from opacity .16 to 1 by scroll).
- Supporting: the line-mask h1; the kit dealing once (2.4 s apart, 500 ms ease-in-out); the news card beside the row (300 ms ease-out).
- The facts settle by mask (700 ms ease-emphasis). No springs.

## 10. Media
- [x] `Pic` (kit `Img`, with a fallback) only; sizes set
- [ ] n/a: videos
- [x] Alt: portraits carry the leaders' names, logos their names
- [x] No dimmed or filtered photo. The portraits' greyscale filter is gone.

Done here: the portraits and partner logos come from Hanzo's /public. They are blocked in this cloud box, so a grey plate with the mark stands in.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more. Each news summary shows under its headline, so no hover is needed.
- [x] Primary ask above the fold at 375×667

Done here: on phone the channel tiles go two up and the facts become a 2×2 grid at 32px.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast: #525252 on white is 7.8:1. The unread belief words are transitional and the text stays in the tree.
- [x] Pause control: the kit deals once and stops
- [ ] n/a: forms
- [x] One h1, no heading skips
- [x] The keyboard reaches every control; focusing a news row shows its card

Done here: the pointer card is `aria-hidden` because it repeats a summary that is in the DOM. The belief words are spans inside one `<p>`, so it reads as one sentence.

## 13. Performance and engineering
- [x] The h1 is in server HTML
- [x] Images sized
- [x] No poller; no third-party request
- [x] Filmed in the cloud

Done here: transform, opacity and clip only. The dealing timer runs only after arrival and in view, and stops after one round.

## 14. SEO and machine files
- [x] Title and description unchanged
- [x] Canonical from the layout (shared)
- [x] `<JsonLd route="/press">`
- [x] Every card is a real link (kit downloads, guidelines, channels)

Done here: every summary and the full boilerplate are in the server HTML.

## 15. Catalogue and product pages
- [ ] n/a: not a catalogue or model page

Done here: n/a. /press is a Story page.

## 16. Developer experience
- [ ] n/a: no code on the page

Done here: n/a. There is no code, terminal or config.

## 17. States and resilience
- [x] Images: a failed logo shows a mark tile, a failed portrait keeps the mark plate. The download draws a tick.
- [x] Blocked live data leaves a complete page (no live data)
- [ ] n/a: no submit
- [x] A thrown island does not blank the page

Done here: a Playwright run with hanzo.ai blocked showed no console errors.

## 18. Measurement and handover
- [x] `data-cta` on every primary (`lib/track.js` pending)
- [x] Nothing identifier-bearing
- [x] `V2: 8/10 …` in the page file header
- [ ] Review read: there is no `docs/review/press.md` yet. Ready for its critic.

Done here: Playwright checks:
- belief words lit: 8, then 29, then 55 of 60 across three scroll positions;
- facts settled: 4 of 4;
- the news card shows beside the row;
- no console errors;
- 0 faint text with JS off.
