# /careers coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page files: `components/pages/Careers.jsx`, `CareersBoard.css`, `app/careers/page.jsx` · gallery: `docs/gallery/careers/` · review addressed: `docs/review/careers.md` (6/10, 7 Nov).

1. **Strategy and conversion.**
   - Persona: an engineer or researcher deciding whether to apply.
   - Goal: open a role and apply. Metric: one contact click (`cta_click careers.*`).
   - One ask in Hanzo's words, "View Open Positions": solid in the hero (`data-cta="careers.hero"`, `data-thumb`), carried by the site Ask bar after the hero at every width, and again in the dark close ("Browse Open Positions", `careers.close`).
2. **Information architecture and navigation.**
   - Header and footer unchanged.
   - Order: promise, how the team works, the roles, internships and grants, the close.
   - Every role is a real `<a href>` to `/careers/<slug>`; the direct-link anchors (`#<role id>`) are kept.
3. **First impression and page narrative.**
   - At 1470×801 the h1 (4 masked lines, 92px, line height .94), the lede and the one solid ask sit above the fold. The ask's bottom is at about 680px.
   - The live object is the hiring card, which slides its four steps through a mask by itself within a second.
   - After that: a headline screen; the four perks pinned (one in as the last goes out); the deck of role sheets; the 7/5 internships; one dark close.
4. **Conversion system.**
   - One solid per viewport: the hero ask; the sheets' "Apply for this role" is outlined (the sheet itself is the click); Academic keeps one solid, with "Apply for Credit Grant" outlined; the close has one solid.
   - The header's "Try Hanzo" turns outline while the Ask bar shows (site layer).
5. **Trust and proof.** "2,137+ open repositories" is a giant figure, traced to Hanzo's careers copy. No other figures. Nothing invented.
6. **Content presentation (copy untouched).**
   - Parity: text 76/76, links 13/13.
   - No label above any headline:
     - "Careers" names the hero region (`aria-label`) and the Ask bar (`data-ask-name`);
     - "Benefits & Perks" sits under its headline as a meta line;
     - each role's team moved into its meta row.
   - Visible words invented in v2 are gone. "Link", "Copied", "Clear", "Match what you know" and "ask for it" are now icons with `aria-label`s.
7. **Visual design system.**
   - Ink #1d1d1f, #424245, #6e6e73, #f5f5f7 and black/white alpha steps only: 0 UI hues (the ember accent is deleted).
   - The v2 scale from `components/v2/vc-type.css`. Radii 28 on hero objects, 24 and 16 on chips.
   - One dark room (the close); the hiring card is a dark object, not a room.
8. **UI component library.**
   - Kit `A`; the company `MaskLines` and `PinScenes` (page-local, `components/pages/company/`); `Sigil`.
   - The team filter is a pill that glides (layoutId). Skill chips are real toggle buttons (`aria-pressed`).
   - No native `title=` tooltips and no browser-default controls.
9. **Motion and interaction.** Signature: the role sheets stack as you scroll.
   - Arrival: the h1 lines cut in once.
   - Idle: the hiring card slides its steps; Sigil fields drift and lean to the pointer.
   - Pointer: a sheet's giant numeral darkens and lifts, and its title underlines; buttons press at .98.
   - State: the filter pill glides; matched words are marked and the rest step back; the copy icon draws a tick.
   - Scroll: the pinned perks and the sheet stack. That is 2 of the page's 6 kinds of motion, under half.
10. **Media.**
    - The careers copy carries no Hanzo images or films.
    - Each section's object: the hiring card; four Sigil fields with giant numerals; the role sheets with numerals; a Sigil band in Academic; the 2,137+ figure; a Sigil in the dark close.
11. **Mobile and responsive.**
    - At 375×812 the h1, lede and ask fit, followed by the hiring card.
    - The pinned perks stack, each with its object. The filter and skill chips become swipe rails. Sheets stack with 10px offsets.
    - Targets are 44px or more ("Read the history" and "View Details" included), with no sideways scroll at 320 or 375.
12. **Accessibility.**
    - Real buttons with `aria-pressed`; a `role=status` count with a spoken label; a focus ring in ink with a white halo.
    - The copy confirmation is announced (`role=status`) and never claims a copy that failed.
    - Reduced motion: final states, the deck unstuck, no running bars. JS off: the h1 and every heading are legible (`noscript` rule in the company MaskLines).
13. **Performance and engineering.**
    - Transform, opacity and clip-path only. Sigil pauses off screen.
    - The hiring card's timer runs only in view and stops when you take it.
    - No video and no blur on large areas.
14. **SEO and machine files.** Metadata and JSON-LD unchanged. One h1 in server HTML; all role text, perks and steps are in the HTML.
15. **Catalogue and product pages.** The roles are the catalogue:
    - a filter by team re-flows the deck;
    - each sheet opens into its page, and its title carries `data-morph` and flies into the role page's h1, which carries `data-morph-target` on the role template.
16. **Developer experience.** Not applicable.
17. **States and resilience.**
    - Filters with no match leave the open-application sheet.
    - "Match what you know" with no hits dims every role and shows 0.
    - Clipboard blocked: no false confirmation.
18. **Measurement and handover.**
    - `data-cta` on every primary: `careers.hero`, `careers.role.<id>`, `careers.open`, `careers.intern`, `careers.grant`, `careers.close`.
    - Header lines Persona, Goal, CTA and Metric in `app/careers/page.jsx` and the component.
    - Ledger (deleted): the ember accent, 4 eyebrows, solid "Apply" on 7 sheets, the second solid in Academic, native tooltips, the cross-fade in the hiring card, 5 invented visible labels.
