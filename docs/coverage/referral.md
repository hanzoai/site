# /referral coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Referral.jsx` · gallery: `docs/gallery/referral/` · metric id: `signup_start`

Open copy questions for James: none decided. Only the 21 strings of `content/live/referral.json` appear; the invented channel names, row labels and the split affiliate sentence from the earlier build are gone.
Shared changes requested (`docs/requests/<page>.md`): `docs/requests/referral.md` (Ask.jsx: on phones, quiet header while the hero ask shows, then the header carries the page's ask; done page-locally until then).
Forks this page deleted: hand-rolled `xp-cta`/`xp-ghost` anchors (now kit `Cta`), the icon boxes (now one stepping object), the CSS rails (now one rAF rail with pause), the share-chip list and the channel-name rail, the definition-list dark room, every Apple grey.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href are the live page's ("Get your link" → /signup?next=/referral)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; n/a prices
- [x] Open copy questions listed, none decided

Done here: one `<h1>` in server HTML; at the top the header is an outline at both widths (measured `rgba(0,0,0,0)` background) beside the hero's solid "Get your link"; after the hero the header is solid "Get your link" (measured `rgb(10,10,10)`) at 1470 and 375.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it (`app/layout.jsx`)
- [x] Every link through `A` or `Cta`
- [x] n/a breadcrumb: depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: `parity.py /referral` → links 3/3 (/signup, /login, /affiliate).

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] Line-masked h1; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per section, each shown once: the card (link and counts), the counts rail, the stepping stage, the one difference (two tracks), the close
- [x] Ends on a close with the ask ("Get your link", Sign in), then the footer
- [x] n/a Morph: no card opens a page

Done here: the dark room enters as a rounded card inside 32px gutters and opens to full width by `clip-path` as it reaches 25% of the screen; the page ends on Hanzo's sign-in line with the one ask.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in the header after the hero, same label, at both widths; no bottom bar (measured 0 `.x-ask`)
- [x] n/a copy: signed-out Copy is `aria-disabled`; pressing it shakes the link and lights Sign in, never says Copied
- [x] `data-cta` (`referral.hero`, `referral.close`) and `data-thumb` on the primary

Done here: `usePhoneHeaderAsk` mirrors the desktop Ask.jsx move on phones (request filed).

## 5. Trust and proof
- [x] No logo, no seal, no invented number (counts show an em dash, as signed out on hanzo.ai)
- [x] No figure to trace; the pay tracks carry no numbers
- [x] Marquee pauses (44px `aria-pressed`), stops off screen, freezes under reduced motion, `aria-hidden`
- [x] n/a Privacy: no form

Done here: the rails carry only Hanzo's words (Referred, Pending, Qualified, `hanzo.ai/?ref=…`).

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Headings balanced; the dark room's two sentences sit in two columns (5/7)
- [x] Steps are a keyboard tablist; no table, FAQ or code
- [x] `python3 scripts/parity.py /referral`: 0 missing

Done here: parity `text 20/20 links 3/3`; no word on the page outside `content/live/referral.json`.

## 7. Visual design system
- [x] `taste.py` passes; deck greys only
- [x] No label above a headline ("Referrals" sits under the asks)
- [x] Radii 16/20/24/full; flat tiles
- [x] One icon set; no icon in a rounded box
- [x] Differs from /affiliate (display link) and /bounty: the signed-out card, a counts rail and a stepping stage

Done here: `taste.py components/pages/Referral.jsx components/pages/Referral.css` → OK.

## 8. UI component library
- [x] Every control has hover (in `@media (hover:hover)`), press, focus-visible
- [x] Focus ring on every Tab stop
- [x] n/a dialogs
- [x] n/a inputs
- [x] Forks deleted: listed above

Done here: Copy and Pause fill ink; steps slide 6px; "Affiliates" links ink and underline; press .97 or 1px.

## 9. Motion and interaction
- [x] One signature (the counts rail) plus 3 (line-mask h1, the card's landing builder, the dark room opening); 0 fade-ups; `variety.py` OK (4 techniques)
- [x] Kinds: idle (rail, flow dots, pay tracks), time (builder lands once, steps run once), pointer (hovers, scroll-boosted rail), state (step tabs), arrival (h1, room opening); scroll-linked under half
- [x] `motion.mjs`: 0 still screens at both widths, layout shift 0.000
- [x] Reduced motion: final states (card on Qualified, step 04, affiliate track full); no `setInterval`
- [x] Sound: `data-sound="tick"` on steps, pause and Copy

Done here: `motion.mjs /referral` desktop 0 still, phone 0 still and 0 dead controls; the last desktop dead hover ("Affiliates") now changes colour and underline.

## 10. Media
- [x] n/a `Film`/`Pic`: no Hanzo photo or film on this page
- [x] n/a videos
- [x] No images to size
- [x] n/a photos

Done here: every object is DOM or inline SVG.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap (flow dots run on their own track under the tiles)
- [x] No horizontal scroll (0 at 375)
- [x] Targets 44px or more
- [x] Primary ask above the fold at 375×667 (y ≈ 315)

Done here: phone stacks the stage above its steps and the two dark sentences one over the other, each over its own track.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Text at 4.5:1 or better (unlit rail words #737373)
- [x] Pause control on the rails
- [x] n/a forms
- [x] One h1; h2s for How it works, the dark room and the close
- [x] Keyboard: roving tabindex on steps, arrows move

Done here: Copy is `aria-describedby` the sign-in line; the tracks are `aria-hidden` beside the sentences they draw.

## 13. Performance and engineering
- [x] h1 and lede in server HTML
- [x] No new dependency; the rails' rAF stops off screen
- [x] No poller; no third-party request
- [x] Filming in the cloud only

Done here: 200 and 0 console errors at both sizes.

## 14. SEO and machine files
- [x] Title and description from the live page
- [x] Canonical from shared metadata
- [x] `<JsonLd route="/referral" />` renders
- [x] n/a cards

Done here: `app/referral/page.jsx` metadata unchanged.

## 15. Catalogue and product pages
- [x] n/a: not a catalogue or model page
- [x] n/a Morph
- [x] n/a model links
- [x] n/a prices

Done here: n/a, a programs page.

## 16. Developer experience
- [x] n/a: no code
- [x] n/a config
- [x] n/a terminal
- [x] n/a versions

Done here: n/a, the only mono text is `hanzo.ai/?ref=…`.

## 17. States and resilience
- [x] Signed-out state designed (Hanzo's own)
- [x] No live data
- [x] n/a submit
- [x] The header hook restores the header on unmount

Done here: `usePhoneHeaderAsk` undoes its label, href and `data-ask` on route change.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events through the kit's `hz-event`
- [x] Nothing before consent
- [x] `V2:` line in the page file
- [x] Review read: `docs/review/referral.md` (6.5/10) fix list answered point by point

Done here: 1 repeats folded (one facet per section), 2 added words removed, 3 closing ask, 4 phone header ask, 5 dots off the tiles, 6 dark room opens from a card.
