# /press coverage (MASTER.md part 2, the 18 parts)

- **Page file:** `components/pages/Press.jsx` + `Press.css`
- **Route:** `app/press/page.jsx`
- **Gallery:** `docs/gallery/press/`
- **Metric id:** one contact click (`press.hero`, mailto:press@hanzo.ai)

Open copy questions for James:
- (1) The partner logo files are linked and shown as hanzo.ai shows them (MASTER part 5 asks for documented permission).
- (2) May the two leadership portraits from /authors appear on /press? They are Hanzo's own pictures, and the boilerplate names both leaders.

Shared changes requested (`docs/requests/press.md`):
- `Ask.jsx`: the sticky bar misses on quick or touch scrolls. The hero ask counts as gone only at `top < 0`; it should count as gone at `bottom < 64`.
- The shell hydration mismatch.

Neither is page code.

Forks this page deleted:
- The second copy of the kit plates. The hero stack now becomes the spread.
- The 3×3 channel tiles and their icon circles.
- The six partner boxes.
- The page tokens that overrode deck.css's greys.
- The aria-label-only "Press & Media" and "Leadership".

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport on the page. "Contact Press Team" is Hanzo's own label, and "Download Press Kit" is an outline.
  - The header's "Try Hanzo" is shared chrome. It turns to outline once the shared bar shows, and the bar sometimes misses (shared bug, requested above).
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button
- [x] Open copy questions for James listed, none decided

Done here: at 1470×801 the h1, its caption, the lede and both actions sit above the fold beside the kit stack. At 375×812 the ask ends at y≈411.

## 2. Information architecture and navigation
- [x] One `<main id="main">` and the skip link (both from the layout)
- [x] Every link through `A` or a real `<a>` (mail, downloads)
- [ ] n/a: breadcrumb (depth 1)
- [x] Link parity: 0 removed, 0 unexpected

Done here: links 20/20.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s. The h1 cuts in at about 0.5 s, then the lede and asks rise (0.95 s).
- [x] `PageHero` equivalent; nothing above the h1. "Press & Media" is a visible caption under it.
- [x] JS off: legible, checked with JS disabled.
  - 0 faint or offset text.
  - The pointer card is hidden.
  - All six summaries show.
  - The pinned stage lies flat.
  - The boilerplate sits beside its heading, because the `<noscript>` moved out of the grid.
- [x] One idea per 100svh, and the rhythm varies: the pinned hero-kit stage, the statement, the facts, the news, the black room, the assets row, the hairline list, the quiet team room.
- [x] Ends on the page's own closing link ("Request Executive Bios"), then the footer.
- [ ] n/a: Morph. No card opens into a page; the news rows link to /blog, as on hanzo.ai.

Done here: the hero and the kit are one object. As the stage scrolls, the headline fades and the stack fans out into the three kit plates. The three plates are never shown twice.

## 4. Conversion system
- [x] No raw `.x-btn`. The ask is a page-local pill until kit `Cta` merges.
- [x] Sticky ask: the shared bar carries "Contact Press Team" when it fires. Its misses are a shared bug, requested.
- [x] Copy uses ui `Copy`, which copies exactly and never confirms a failed write, plus a `role="status"` line that says "Copied".
- [x] `data-cta` and `data-thumb` on every primary

Done here: `data-cta` is on press.hero, press.kit, press.zip, press.mail, press.bios and press.team.

## 5. Trust and proof
- [x] No seal, no invented number. Logo permission is an open question.
- [x] Every figure traces to Hanzo's live copy (2016, San Francisco, CA, Hanzo AI, Inc., Techstars ’17, every news line)
- [x] Partners appear as one stationary greyscale row with a hairline above, not boxes
- [ ] n/a: Privacy link (no form)

Done here: the facts and the boilerplate are word for word from hanzo.ai.

## 6. Content presentation (copy untouched)
- [x] No text under 13px, except 12px mono capitals
- [x] Measures held. News headlines run 18ch and balanced, and channel handles never break mid-word (`white-space: nowrap`).
- [ ] n/a: tables, FAQ, tabs, code
- [x] `python3 scripts/parity.py /press`: 0 missing

Done here: text 83/83, links 20/20. Every Hanzo label is visible:
- "Press & Media" and "Leadership" are captions under their headings.
- "Media Inquiries" and "Headquarters" are #a3a3a3 on black.
- All six summaries show on touch screens of any width (`hover: none`) and with JS off.

## 7. Visual design system
- [x] `taste.py` passes; only deck greys
- [x] No label above a headline. All captions sit below.
- [x] Never box plus shadow. Only the floating kit plates and the pointer card take the deck's floating shadow. The tiles and the guidelines card are flat fills, and the channels are a hairline list.
- [x] One icon set; no icon in a rounded box (the channel icon circles are gone)
- [x] Differs from neighbours: a stack that turns into a spread on scroll, which /brand, /investors and /contact don't have

Done here:
- deck.css's `--ink2: #525252` is back. Page tokens use their own names (`--xi`, `--xs`, `--xm`, `--xr`, `--xk`), so ledes, body and labels show the deck's second tone again.
- Radii come from the deck: plates 24, phone 20, guidelines 24 with a 12 inner. Buttons are 48px.

## 8. UI component library
- [x] Every control has hover (inside `@media (hover:hover)`), press (.97, and .98 on news rows) and focus-visible
- [x] Focus ring: 2px ink with a white halo, or white with a black halo in the black room
- [ ] n/a: dialogs
- [ ] n/a: inputs
- [x] Forks deleted: listed above

Done here: the copy buttons are 48px icons with an aria-label, and they sit beside what they copy (the email copy is in the email's row). The email link is at least 44px tall.

## 9. Motion and interaction
- [x] One signature, 3 supporting, 1 fade-up (the lede and asks, in CSS)
- [x] At least 3 kinds: arrival, scroll (the stage fan-out and the belief line), pointer (the news card), state (copy and download ticks, the email mask)
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state (plain words, settled facts and email, the stage flat); no `setInterval`
- [ ] n/a: sound (kit not merged)

Done here:
- Signature: the belief line. 60 words go from opacity .16 to 1 with the scroll.
- Supporting:
  - the h1 line mask;
  - the stack fanning out (pinned, 230svh, ease-in-out with the scroll);
  - the news card, 300 ms ease-out, placed 32 px past the headline's real text edge and moved on focus as well as on pointer.
- No springs.

## 10. Media
- [x] `Pic` (kit `Img`, with a fallback) only; sizes set
- [ ] n/a: videos
- [x] Alt: portraits carry the leaders' names, logos carry their names
- [x] No dimmed or filtered photo

Done here: the portraits and partner logos load from Hanzo's /public paths. They are not mirrored into this repo (a shared media task), and they are blocked in this cloud box, so each portrait shows a Sigil plate (MASTER part 7 fallback) and each logo shows its name.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; each summary shows under its headline
- [x] Primary ask above the fold at 375×667

Done here: on phones the stage lies flat. The dark plate spans the width, light and icon sit side by side, and the channels are a one-column hairline list with no mid-word breaks.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured in the black room:
  - #a3a3a3 on #000: 8.3:1
  - white 78% on #000: about 13:1
  - #525252 on white: 7.8:1
- [x] Pause control: n/a. Nothing loops; every motion is scroll-linked or plays once.
- [ ] n/a: forms
- [x] One h1, no heading skips
- [x] Keyboard reaches every control; focusing a news row places its card beside that row (checked: 16 px under the row top)

Done here: the pointer card is `aria-hidden`, because the summary it repeats is in the DOM.

## 13. Performance and engineering
- [x] h1 in server HTML
- [x] Images sized
- [x] No poller; no third-party request
- [x] Filmed in the cloud

Done here: transform, opacity and clip only. The stage reads one measurement on mount and on resize.

## 14. SEO and machine files
- [x] Title and description unchanged
- [x] Canonical from the layout (shared)
- [x] `<JsonLd route="/press">`
- [x] Every card is a real link

Done here: every summary, plate caption and the full boilerplate are in the server HTML.

## 15. Catalogue and product pages
- [ ] n/a: a Story page

Done here: n/a.

## 16. Developer experience
- [ ] n/a: no code

Done here: n/a.

## 17. States and resilience
- [x] Failed logo: its name shows. Failed portrait: a Sigil plate. Download: draws a tick.
- [x] Blocked media leaves a complete page with no console errors
- [ ] n/a: no submit
- [x] A thrown island does not blank the page

Done here: Playwright ran with hanzo.ai blocked, and the console was clean.

## 18. Measurement and handover
- [x] `data-cta` on every primary (`lib/track.js` pending)
- [x] Nothing identifier-bearing
- [x] `V2: 8/10 …` in the page file header
- [x] Review read: `docs/review/press.md` was 6/10. Its fixes are done:
  - the black room is lit;
  - the deck greys are back;
  - the captions are visible;
  - the summaries show on touch and with JS off;
  - the stack becomes the spread;
  - the hairline channel list;
  - the partner row;
  - the Sigil portraits;
  - the email cut-in with its copy button;
  - the card placed by the real text edge and on focus;
  - the row press;
  - the JS-off card and boilerplate;
  - 44px email;
  - the shared bar requested.

  The re-review is pending.

Done here: Playwright checks:
- plates end at identity (the spread);
- captions are #525252 and visible;
- the card sits 31–32 px clear of every headline;
- all six summaries show on a 1024 touch tablet;
- 0 faint text with JS off;
- no console errors.
