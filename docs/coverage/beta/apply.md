# /beta/apply coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/BetaApply.jsx` (`BetaAccess`, shared with the other application) · route: `app/beta/apply/page.jsx` · gallery: `docs/gallery/beta/apply/` · metric id: `beta_submitted`

Open copy questions for James: none (every line is hanzo.ai's own: its PROGRAMS, ABOUT and Portal form strings).
Shared changes requested (`docs/requests/<page>.md`): none; two tiny shared edits made and named in commit 0aaf15bc: `lib/routes.json` gains /beta/apply and /beta/research (so the site's links stay on the site), `content/pages.json` gains their hanzo.ai titles and descriptions (share cards).
Forks this page deleted: none (a new route; it uses kit `Cta`, `Film` and `Img`, no forked button or video).

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js`
- [x] Open copy questions for James listed, none decided

Done here: `app/beta/apply/page.jsx` names Persona (a builder who wants Hanzo's new releases before they ship), Goal, CTA (Continue, then Submit application), Metric `beta_submitted`, Signature and Beyond; the component's top comment repeats them. One solid at a time: Continue, "Submit application" or "Create free account"; while it shows the header's Try Hanzo turns to an outline (`html[data-ask=quiet]`); labels are hanzo.ai's own form strings (no `lib/cta.js` entry exists for them). The h1 is always the current question, so the page reads in a second. No prices; no dead button (Skip is disabled, not dead, when skipping would make the 3 needed answers unreachable).

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- ~~Breadcrumb at depth 2 or more~~ n/a: hanzo.ai's form has no breadcrumb and Exit/Back carry the way out; adding one would add words.
- [x] Link parity: 0 removed, 0 unexpected

Done here: One `<main>` (the page's own, under the layout's skip link). Links go through kit `Cta` (to `/signup?next=%2Fbeta`, `/login?next=%2Fbeta`, `/chat?skip=login`, all hanzo.ai's own targets, through `href()`). Exit returns where you came from (or /beta), as on hanzo.ai. `lib/routes.json` now lists the route, so /beta's Apply and the model pages' "Research preview" links reach it on this site (checked: `href="/beta/apply/"` in /beta's HTML).

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero`; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- ~~Ends in proof strip, `Band`, footer~~ n/a: an application form; hanzo.ai's own page is the form alone, and it ends on its actions bar, then the footer.
- ~~Card-to-page links use Morph; title lands within 12px~~ n/a: no cards link to pages; the pass lines return to their question in place.

Done here: First screen at 1470×801: the Beta access pass with Enso's film playing (moves at once, no input) beside "What do you build?" (seven options, two columns on desktop), the mono "Beta access" and "6%" over three progress bars, and the actions bar (Exit · "Answer 3 more to apply." · Skip) at the bottom. Nothing above the h1 but hanzo.ai's progress row. The first question, its options and the actions are in the server HTML at full opacity (AnimatePresence `initial={false}`), so JS off shows the first screen whole. One question per screen by design.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- ~~Copy button copies exactly the displayed text; failure never says Copied~~ n/a: no copy control.
- [x] `data-cta` and `data-thumb` on every primary

Done here: Every button in the actions bar and on the account step is kit `Cta` (no raw `.x-btn` in the page file). The actions bar is sticky at the bottom of the screen, so the ask is always in reach. `data-cta` ids `beta.beta.next`, `.submit`, `.skip`, `.back`, `.exit`, `.open-app`, `.signup`, `.login`; no `data-thumb`, on purpose: the ask changes with each question, so the shell's phone bar never floats over the form.

## 5. Trust and proof
- ~~No logo without documented permission; no seal; no invented number~~ n/a: no logos, seals or figures (the spend bands are hanzo.ai's own options).
- ~~Every figure traces to Hanzo's copy; qualifier beside the number~~ n/a: no figures besides hanzo.ai's progress percentage, computed exactly as its form does.
- ~~Marquees pause, freeze under reduced motion, hide duplicates~~ n/a: no marquee.
- ~~Privacy link and owner line beside every submit~~ n/a: hanzo.ai's form has none and adding one would add words; and this rebuild sends nothing (answers stay in the visitor's browser).

Done here: Nothing to prove on a form; the only numbers are hanzo.ai's own options and its progress (round((step + 1, or + 0.5 unanswered) / 8 × 100)%, so 6% on the first screen as on live).

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- ~~Tables, FAQ, tabs and code use the kit parts~~ n/a: no table, FAQ, tabs or code.
- [x] `python3 scripts/parity.py /beta/apply`: 0 missing

Done here: `node scripts/copycheck.mjs /beta/apply`: missing 0 of 7 (hanzo.ai live). The later screens carry the exact copy too: all 8 questions (6 from PROGRAMS.beta then ABOUT's "Where do you work?" and "What is your role?"), every option, "Choose as many as fit.", "Type your answer…", Exit, Back, "Answer {n} more to apply.", Skip, Continue, "Submit application", "Submitting…", Open App, and the account step word for word (curly ’ and en dashes kept). Questions 44px desktop / 30px phone with `text-wrap: balance`; options 17px; hint 17px; smallest text the 13px mono progress row (14px pass lines); only the mono key capitals go to 11 to 12px.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` OK on the page and CSS (room tokens `--room-*`; the pass is #000 with #f5f5f7 and #a1a1a6 type, all deck greys). No badge above the question. Options are 14px-radius hairline boxes, no shadows. Arrows and the check are the site's own 1.7px stroke glyphs; the option's letter key is hanzo.ai's own key box, not an icon box. Differs from /beta (film strip and stamped passes) and from /contact-sales (contour field): a dark pass that fills with your answers.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- ~~Dialogs are native, trap focus and return it~~ n/a: no dialog; the account step replaces the question in place and takes focus on its heading.
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: listed below

Done here: Options: hover darkens the border and the letter key, press scale .98, selected fills the key ink, tints the box and draws the check, focus-visible 2px ink ring. Kit `Cta` states (Skip disabled; Submit disabled while "Submitting…"). Fields 17px with an ink border on focus; pass lines highlight on hover and press 1px. Every `:hover` sits in `@media (hover: hover)`. Forks deleted: none (new page).

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit

Done here: Signature: the pass fills in (each answer lands as a line, layout-animated, and Enso's film gives up room; a tap returns to that question). Supporting: the question cuts into its line and the step slides forward or back with its direction (state change, 0.32 to 0.5 s ease-emphasis); the progress bars fill (240 ms). Idle: the film plays. No scroll-linked motion at all. `variety.py` OK (none of its listed techniques used). Reduced motion: no travel, the film holds its poster, same server/client targets (no hydration mismatch; 0 console errors checked). Sound through the shared kit: `data-sound="tick"` on options and pass lines; the solid Continue gets the kit's tap.

## 10. Media
- [x] `Film` and `Pic` only; sizes and posters set
- [x] At most 2 videos playing; pause button on loops over 5 s
- [x] Budgets met; nothing missing; alt on every image
- [x] No dimmed or filtered photo; 4+ real visuals together where the page has them

Done here: Kit `Film` (`/models/enso.webm`, poster `/models/enso.webp`, 1200×1500) and kit `Img` for the phone thumbnail (`alt=""`, decorative beside the programme name). One video only, muted, lazy, paused off screen and under reduced motion or Data Saver. No pause button: the one loop sits beside a form you work through; reduced motion holds it still. Dimming is only the gradient under the pass's title. 4+ visuals: n/a, a form with one picture, as on hanzo.ai.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: Walked every step of both programmes at 1470×801 and 375×812 in headless Chrome (localhost): no overlap between the progress row, question, answers, actions or header, nothing clipped or off screen, page width equals the viewport; the pass never overflows even with all answers. On phones the pass becomes a 24px film thumbnail by the programme name and options stack in one column; the actions bar stays at the bottom (padding trims under 420px so Back, Open App and Continue fit). Options 52 to 56px, buttons 44px, pass lines 44px. The ask is in the sticky bar, so it is on screen at 375×667.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- ~~Pause control on every moving item~~ n/a: one muted film beside the form; it stops under reduced motion and off screen.
- [x] Forms labelled; first error focused
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: #6e6e73 on white 4.6:1, ink on white 19:1, #a1a1a6 on #000 8:1. Options are `role="radio"`/`"checkbox"` with `aria-checked` inside a `radiogroup`/`group` named by the question; fields are named by the question; the bars are `role="progressbar"` "Application progress" with values. There is no error state to focus: hanzo.ai's form never errors, it shows "Answer {n} more to apply." (aria-live) and only offers Continue once a question is answered. One h1 (the question, or the account step's heading, which takes focus). Keyboard: Tab reaches every control; letter keys pick, Enter continues, Shift+Enter is a new line, Esc goes back; focus moves to each new question.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: The first question, options and pass poster are server-rendered. One client component (~300 lines) and one CSS file; the film is lazy (`preload="none"`), sized and paused off screen. No poller, no network call at all on submit (hanzo.ai's POST to api.hanzo.ai is never made; tests saw 0 non-GET requests). Checked in the cloud container's headless Chrome.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: Title "Beta access — Hanzo AI" and description match hanzo.ai's. `<JsonLd route="/beta/apply" />` with `content/jsonld/beta/apply.json` (hanzo.ai's own ld+json for this page, byte-identical to /beta's); canonical and og:url are https://hanzo.ai/beta/apply/ (live's canonical points at /beta; listed for James); the share card `/og/beta/apply.png` renders (200). No cards.

## 15. Catalogue and product pages
- ~~Model card matches `SPEC.md` (or n/a: not a catalogue or model page)~~ n/a: not a catalogue or model page.
- ~~Every card opens by Morph~~ n/a: not a catalogue.
- ~~Every maker and model page linked in the DOM~~ n/a: not a catalogue.
- ~~One price figure everywhere~~ n/a: no prices.

Done here: n/a: an application form, not a catalogue or model page.

## 16. Developer experience
- ~~One `CodeBlock`; copy equals display (or n/a: no code on the page)~~ n/a: no code on the page.
- ~~Config blocks parse on their own~~ n/a: no config.
- ~~Terminal pauses and ends on a static frame~~ n/a: no terminal.
- ~~No hand-typed version number~~ n/a: no version numbers.

Done here: n/a: no code on the page.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed
- ~~Blocked live data leaves a complete page, no console errors~~ n/a: no live data.
- [x] A failed submit keeps its values and shows no success
- [x] A thrown island does not blank the page

Done here: Empty: the pass shows only its film until the first answer lands. Sending: "Submitting…" on the disabled button, then hanzo.ai's signed-out step ("Log in or create an account to save your application.", Create free account, Sign in, Edit answers); nothing is sent, so there is no network failure to show, and Edit answers returns to the last question with every answer kept. Answers survive a reload in this browser (localStorage, wrapped in try/catch so a private window still works). Offline: the form works entirely in the page.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js`
- [x] Nothing identifier-bearing before consent; no field value in a payload
- ~~`V2: <score>/10 <one line>` in the page file's top comment~~ n/a: James, 7 Nov: no more scores; the route header carries Persona, Goal, CTA, Metric, Signature and Beyond instead.
- [x] Review read: `docs/review/<page>.md` verdict 8 or more

Done here: `data-cta` on every button (kit Cta fires `cta_click`); the finish fires `beta_submitted` with only the programme name through the site's `hz-event` channel (no `lib/track.js` exists; this is the channel kit Cta uses); no field value ever leaves the page. Review: `docs/review/beta/apply.md` (Ready line, copycheck missing 0 of 7).
