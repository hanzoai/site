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
- The pointer-riding news card (now a still column beside the index), the six-column partner logo row (now hairline rows with their downloads), the three-column channel grid (now one numbered index).

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport on the page. "Contact Press Team" is Hanzo's own label, and "Download Press Kit" is an outline.
  - The header's "Try Hanzo" is shared chrome. It turns to outline once the shared bar shows, and the bar sometimes misses (shared bug, requested above).
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button
- [x] Open copy questions for James listed, none decided

Done here: at 1470×801 the h1, its caption, the lede and both actions sit above the fold beside the magnet grid (Hanzo's mark in a field of dots). At 375×812 the ask ends at y≈411.

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
  - No pinned stage: the hero and the kit are plain sections.
  - The boilerplate sits beside its heading, because the `<noscript>` moved out of the grid.
- [x] One idea per 100svh, and the rhythm varies: the hero with its magnet grid, the kit, the statement, the facts, the news, the black room, the assets row, the hairline list, the quiet team room.
- [x] Ends on the page's own closing link ("Request Executive Bios"), then the footer.
- [ ] n/a: Morph. No card opens into a page; the news rows link to /blog, as on hanzo.ai.

Done here: the hero rides in on a conveyor beside the magnet grid, which ripples once from the mark on arrival (motion inside the first second). The kit follows as its own section, pulled back from a close-up of the dark plate; the plates are shown once, on one baseline with their titles on one top line (subgrid).

## 4. Conversion system
- [x] No raw `.x-btn`. The ask is a page-local pill until kit `Cta` merges.
- [x] Sticky ask: the shared bar carries "Contact Press Team" when it fires. Its misses are a shared bug, requested.
- [x] Copy uses ui `Copy`, which copies exactly and never confirms a failed write, plus a `role="status"` line that says "Copied".
- [x] `data-cta` and `data-thumb` on every primary

Done here: `data-cta` is on press.hero, press.kit, press.zip, press.mail, press.bios and press.team.

## 5. Trust and proof
- [x] No seal, no invented number. Logo permission is an open question.
- [x] Every figure traces to Hanzo's live copy (2016, San Francisco, CA, Hanzo AI, Inc., Techstars ’17, every news line)
- [x] Partners appear as stationary greyscale hairline rows (logo, name, its download), not boxes
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
- [x] Never box plus shadow. Only the floating kit plates take the deck's floating shadow. The news column, the tiles and the guidelines card are flat fills; the partners and channels are hairline lists (no three equal boxes anywhere).
- [x] One icon set; no icon in a rounded box (the channel icon circles are gone)
- [x] Differs from neighbours: the mark as a magnetic dot field (MOTION-MAP `magnet-grid`), which /brand, /investors and /contact don't have

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
- [x] At least 3 kinds, scroll under half: arrival (line masks), scroll (velocity-skew on About, the belief line), time (the email types itself, the partner hairlines draw one by one, the channel index walks 01 to 09 once, the team plates open, the phone news card walks the six stories once; each runs once in view, then rests), idle (the grid's arrival ripple and three idle ripples, the plate sheen), pointer on the grid (dots bend, a click ripples), pointer (row focus steps the others back; plates, partners and channels answer hover), state (the news column swaps its story with a 300 ms rise and a progress hairline, copy and download ticks, the email mask)
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state (plain words, settled facts, the full email with its copy button, drawn hairlines, open plates, a still dot field). The one `setInterval` (`useBeat`) runs only in view, never under reduced motion, and clears itself at its last step.
- [ ] n/a: sound (kit not merged)

Done here:
- Signature (MOTION-MAP `magnet-grid`, `press/MagnetGrid.jsx`): Hanzo's mark drawn in a canvas field of dots; the field bends toward the pointer, a click or tap sends a ripple, one ripple runs on arrival and three slow idle ripples follow (5.2 s apart, measured: canvas changes at 0.4-2.9 s, 6.5-7.7 s, 11.8-13 s), then it rests. The rAF runs only while something moves and only on screen; reduced motion draws a still field. A sheen crosses the dark plate three times, then rests.
- Entrances (`press/Enter.jsx`, in page order): conveyor (hero), pull-back (kit), velocity-skew (about, capped at 3°: measured 2.6° on a fast wheel), orbit-in (news), stack-drop (the black room, damped so it lands without a bounce).
- Supporting:
  - line masks (the h1, every section head, the team names);
  - the belief line, demoted: 60 words go from opacity .16 to 1 with the scroll, then the facts settle;
  - one time beat per section below the news (the email typed with a caret, copy appearing after the last letter; partner hairlines drawn 160 ms apart; the channel index walking 01 to 09 once until pointed at; the team plates opening by clip; the guidelines mark drawing in);
  - the news index: a still dark column beside it holds the story in focus (`01 / 06` at 64px Air, a progress hairline, the summary and date rising in at 300 ms). Focus follows the pointer, the keyboard, or, untouched, the row crossing the middle of the screen. Nothing follows the cursor.
- No visible springs: stack-drop's spring is damped (32) so it settles without overshoot.

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

Done here: on phones the grid is 4:3 under the asks. The dark plate spans the width, light and icon sit side by side, and the channels are a one-column hairline list with no mid-word breaks.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured in the black room:
  - #a3a3a3 on #000: 8.3:1
  - white 78% on #000: about 13:1
  - #525252 on white: 7.8:1
- [x] Pause control: n/a. Nothing loops forever; the hero plate's sheen crosses three times (about 14 s) and rests, off under reduced motion.
- [ ] n/a: forms
- [x] One h1, no heading skips
- [x] Keyboard reaches every control; focusing a news row shows that story in the still column

Done here: the news column is `aria-hidden`, because the summary it repeats is in the DOM.

## 13. Performance and engineering
- [x] h1 in server HTML
- [x] Images sized
- [x] No poller; no third-party request
- [x] Filmed in the cloud

Done here: transform, opacity and clip only; the magnet grid is one canvas whose rAF runs only while dots move and the field is on screen, rebuilt on resize (ResizeObserver).

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
- [x] Failed logo: an initial in a hairline circle beside its name. Failed portrait: a black Sigil plate with the leader's initials at 64px Air; the name (26px) and role (CEO, CTO, from the boilerplate) always sit under each plate, so the team never reads as empty boxes. Download: draws a tick.
- [x] Blocked media leaves a complete page with no console errors
- [ ] n/a: no submit
- [x] A thrown island does not blank the page

Done here: Playwright ran with hanzo.ai's media missing locally: the only console lines are 8 resource errors (the 2 portraits and 6 partner logos under Hanzo's /authors and /press/partners paths, which this repo does not mirror); each falls back to its Sigil plate or letter chip, and there are no script errors.

## 18. Measurement and handover
- [x] `data-cta` on every primary (`lib/track.js` pending)
- [x] Nothing identifier-bearing
- [x] `V2: 8/10 …` in the page file header
- [x] Review read: `docs/review/press.md` (7/10, critic 3). Slice D, 7 Nov: the motion-map rebuild (left unverified mid-work) checked and finished: kit plates share a baseline and their titles a top line, the light plate has its grey ground (it was white on white), the zip line is no longer bitten by the pull-back clip's corner, velocity-skew calmed from 8° to 3°, stack-drop no longer bounces, the magnet grid breathes three idle ripples. The review's five fixes (phone pills, a live middle, tighter bands, boilerplate ink at rest, partners as one row) were done in ebf5c606 and hold.
  Earlier: was 6/10. Its fixes are done:
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

  Fourth review (7/10) fixes: the black room no longer jumps: the full address is an invisible sizer and the typed text overlays it, the caret takes no width, the row never wraps (phone email 26-48px), and the copy button's 48px is reserved and revealed by opacity and transform only (Playwright: the next section's y and the row height are identical before, during and after the email types, at 375x812 and 1470x801; CLS 0 through the room at 375); at the close "Request Executive Bios" is an outline and "View Team" a text link, so the header's solid is the one solid (checked at both sizes); 2016 is the facts' one large figure, the other three sit at 32px (24 on phone); the kit plate titles are h2 (no h1 to h3 skip); the phone news card shows only the summary and date; Connect With Us has one object, the walked or pointed channel's handle set large beside the index.

  Third review (7/10) fixes: section heads rest at 26-32px and the h1 at 44-64px, with one big thing per screen (kit, facts at 64, the news figure, the email, the team plates); the lower half has a beat per section (above); phone news shows titles and dates with one dark card under the list walking the stories, its height held by invisible copies so nothing shifts (CLS 0.005); "10-54%" kept whole by CSS; the copy button waits for the typed email; the signature is the kit dealing out.

  Second review (6/10) fixes: grids became lists (channels one numbered index, partners hairline rows with downloads beside), the news card is pinned in a still column instead of riding with the pointer, the team shows names and roles under Sigil plates, and plates, copy icons, email and every download answer hover and press. The re-review is pending.

Done here: Playwright checks:
- plates end at identity (the spread);
- captions are #525252 and visible;
- the card sits 31–32 px clear of every headline;
- all six summaries show on a 1024 touch tablet;
- 0 faint text with JS off;
- no console errors.
