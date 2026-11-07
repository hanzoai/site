# /team coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/TeamPage.jsx` (+ `TeamPage.css`) · route: `app/team/page.jsx` · gallery: `docs/gallery/team/`

1. **Strategy and conversion.** Persona: a team lead choosing where people and agents work together. Goal: start a team. One ask in Hanzo's words, "Create your team" (hanzo.team/start, metric `signup_start`). It is the solid button in the hero and at the close. "Open Hanzo Team" is outlined, and every other action is a text link. `data-cta` sits on each primary (`team.hero`, `team.close`) and on the secondary actions.
2. **Information architecture and navigation.** Hanzo's header and footer are unchanged. Order: the canvas (what it feels like), what it is (three chapters), together (who does what), the rooms, ten workflows, the code channel, leaders, the spec, the close. All 20 links are kept (parity 20/20).
3. **First impression and page narrative.**
   - The h1 "The playground for humans + AI" cuts in by line (128px, line height 0.92). The lede and "Create your team" sit beside it, all above the fold at 1470×801 and 375×812.
   - The canvas starts its story within half a second: Zoe reports, Dev fixes, Qa verifies and moves the card to Done. It then rests on Done.
   - After that, one idea per screen. There are no labels over any headline. The former kickers are section names (`aria-label`), and "Hanzo Team · the workspace for humans and AI" is the canvas window's title.
4. **Conversion system.** `data-thumb="Create your team"` feeds the site's shared ask bar (`components/Ask.jsx`) after the hero at every width, named by `data-ask-name="Hanzo Team"`. The close button also carries `data-thumb`, so the bar steps aside when that button is on screen and only one solid shows. Buttons are the kit's `Btn`: press .98, hover lift.
5. **Trust and proof.** Proof is the product itself: the shared canvas, the bugfix crew's thread, a real diff, and "42/42 E2E GREEN" with its check mark. The leaders appear with their portraits and links. Nothing is invented.
6. **Content presentation (copy untouched).** Parity is 242/242 text and 20/20 links. The detail lives in things you open: the workflow tabs, the six steps of the code session and the pinned chapters. The only words not in the live copy are control names given as `aria-label`s ("Replay", the group name of the team buttons, the networks' names on icon links).
7. **Visual design system.**
   - Type and space follow `vc-type.css` (display 128, headline 56, body 19, 13px mono captions), 28px radius on hero objects and 16px on cards.
   - 0 UI hues (JAMES.md). Everything is ink #1d1d1f, #424245, #6e6e73, greys and alpha steps. Agents are told apart by shape (◆, an outlined label) rather than colour, and diff lines by weight and strike-through. Colour comes only from Hanzo's memoji.
   - There is one dark room: the ten workflows.
8. **UI component library.** It uses the kit's `A` and `Btn`, `Copy` (with a drawn tick), `Sigil`, and the Company page-local `MaskLines` and `PinScenes`. The workflow rail and the six steps are APG tab lists with arrow keys. There are no native tooltips or browser-default controls.
9. **Motion and interaction.**
   - Idle: the canvas story plays once on arrival, with Replay to see it again; the Sigil at the close drifts and leans toward the pointer.
   - Pointer: the handoff cards draw their two faces together, the cursor labels follow springs, and buttons lift and press.
   - State: the workflow room switches channel, and the code session steps through six states.
   - Scroll (2 of 6 kinds): the canvas tilts up and settles, and the pinned chapters.
   - Arrival: the line-mask headlines.
10. **Media.** Hanzo's memoji are drawn over grey initial discs, so a failed load leaves a clean disc. The leaders' portraits fall back to an initial plate. There is no video. The hero object is product UI.
11. **Mobile and responsive.**
   - At 375 the canvas becomes a single column, the chapters stack with their visuals, and the workflow rail becomes a swipe row of 44px pills.
   - The code window drops its side bar, and every button and tab is 44px or more.
   - There is no sideways scroll at 320 or 375.
12. **Accessibility.**
   - One h1. Tabs follow the APG pattern with `aria-selected` and arrow keys, and the team buttons use `aria-pressed`.
   - Focus rings are ink with a white halo (white in the dark room).
   - The canvas is `aria-hidden` decoration beside real text, and Replay is a real button that is disabled while playing.
   - Reduced motion shows the final picture and no story.
13. **Performance and engineering.**
   - Motion is transform and opacity only.
   - The canvas runs once and only while seen (`useInView`), and the Sigil pauses off screen.
   - No video, no blur, no raw `<img>`. Memoji and portraits are CSS backgrounds with a reserved box, so CLS is 0.
14. **SEO and machine files.** Metadata and JSON-LD are unchanged. Every word, every tab panel and every chapter is in the server HTML. The masked headlines are real text, and JS off shows them through the Company MaskLines `<noscript>` rule.
15. **Catalogue and product pages.** Not a catalogue. As a product page it has an identity hero, three facts as chapters, openable features (rooms, workflows, steps), a spec (License: MIT, source, deploy, the paste-and-ship prompt) and a closing ask.
16. **Developer experience.** The "Paste and ship" prompt copies exactly the displayed text (`Copy`). The hanzoai source and "Deploy to Cloud" are outlined links. The diff and PR are shown as Hanzo wrote them.
17. **States and resilience.** The figures are static, from Hanzo's page, so there is no loading or error state. Replay is disabled while the story runs. Memoji and portrait failures leave designed discs and plates.
18. **Measurement and handover.** `data-cta` on every primary and secondary action. There are no analytics yet (PLAN 2.18 is pending the event log). Ledger: this page deleted the amber accent, the eyebrows, the endless canvas loop, three invented labels and the visible network words. Filmed into `docs/gallery/team/`: no console errors, no sideways scroll.
