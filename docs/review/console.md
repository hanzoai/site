# /console — James-eye review
Ready: 2026-11-08 phone Keys chip no longer sits on its scope line; phone canvas is one sideways swipe row (page still scrolls under a finger, tallest card fits); hero views centre their object in the pane (no dead pane) and the phone Projects view is no longer clipped; stacked heading fades out under the canvas card; pressed module tab and Revoke answer hover. taste OK, parity 93/93 + 14/14, unique OK, check.mjs 0 errors / 0 Next issues / no overflow / 0 overlaps at 1470 and 375.

Verdict: 7/10
First complaint: "You show me the same console window three times, and when I type in the search the word snaps in half: 'Usa' on one line, 'ge' under it. And on the phone the little window cuts its own text off."

Walked 7 Nov 2026 on the dev server at 1470×801 and 375×812, moving. Method: Playwright, with video recorded at 1470×801. I wheel-scrolled in 130px notches with about 1.2s dwell per screen (14 screens). I hovered 36 controls, clicked 15, typed in the palette and used arrow keys and Enter, opened a sheet and pressed Esc, and did a 22-stop Tab crawl. I loaded the page under reduced motion and ran three cold reloads to catch console errors. On the phone (isMobile, hasTouch) I took 17 screens top to bottom, tapped 11 controls and checked scrollWidth, text sizes and tap targets. Proof: `docs/review/console/desktop-sheet.jpg` and `phone-sheet.jpg`. The `desktop-walk.jpg` and `phone-walk.jpg` beside them are from an earlier round and were not touched.

## What works
- **The hero runs by itself.** About 1.5s after load, a palette drops over the console window and types "key", then the window changes to Keys. It then cycles about every 6s (Projects → Keys → Usage). On the Usage panel the record list grows and its count goes up (I saw 3, then 6). The pause button (46×46, top right of the window) stops it. This is real product UI on a black stage, with no fake chrome.
- **The pinned chapter stage is the right move.** A 4,434px section holds the window on the left while one panel swaps per chapter: Projects, Models, Usage, Keys, Apps, Organization. Each swap brings in a new state (the Keys card with Revoke, the org switch from acme to globex), and an `01 ──── 06` scrub bar tracks it. This is the apple.com "one panel changes" pattern, and it is actually there.
- **The palette demo is a working toy.** You can type in "Find it by typing it", it filters, ArrowDown plus Enter opens Usage in the preview window beside it, and the esc key-cap swaps in. It is a real interaction, not a picture of one.
- **The client cards open.** `/v1`, OIDC, Per-org and OSS each open a sheet. The `/v1` sheet holds the `app.py` code and a Copy button. Esc closes it and focus returns to the card.
- **The asks are in place.** The header ask turns from an outlined "Try Hanzo" into a solid "Open Console" once the hero ask has scrolled away, so there is one solid fill at a time on desktop. Press gives `scale(0.98)`.
- **The page is clean.** CLS is 0.0005 across the full walk. The h1 box held at 659×54 from 588ms to 2.5s through the font load, so there is no font swap. I found no hue anywhere in the UI. Reduced motion leaves 0 running animations and shows the final state. There is no horizontal scroll at 375 (scrollWidth 375). Parity is 93/93 text and 14/14 links.

## The 11 answers
1. **Does it sell in 5s, and does something move within 1s?** Mostly yes.
   - The 52px "Hanzo Console" h1 is on the left. The lede "One admin for everything you run" and the solid "Open Console" are on the right at y=230. The live console window starts at y=392.
   - Motion starts at about 1.2–1.5s, when the palette drops in. That is slightly over the 1s mark: frames at 0.3s and 0.9s are still.
   - On the phone, the h1 (40px), lede and primary (bottom at 304px) are above the window, and the window starts at about 390px.
2. **One thing in, one thing out, or a document?** On desktop it is mostly one in, one out, with two weak spots.
   - Weak spot 1: about 300px of empty white band sits between the black hero and "A module per product, one shell around them".
   - Weak spot 2: "Get Console" reads as a plain document block (pills, two text links and a link list, no object). It is saved by the agent-prompt terminal under it.
   - On the phone the pinned stage unstacks into 6 repeats of dark card, h3, mono kicker and paragraph, each with a hairline. That is 11,606px of page, and it reads as a document.
3. **Does every section hold a real visual object?** Yes. The hero has the live window, the chapters have the pinned window, Find has the palette plus preview, Client has four figure cards, Get has the agent-prompt terminal, and the close has the acme/globex org picker.
   - The flaw is repetition. The same `platform.hanzo.ai` window appears three times: hero, chapter stage, and the palette preview. James's "too many repeats" applies here.
   - In the hero the window's main pane is mostly empty dark space for the Usage and Keys states: about 200px of nothing under the list at scrollY 500.
4. **One ask, nothing floating, and does scale have rhythm?**
   - Ask: on desktop, yes. There is one solid fill at a time and nothing floats over content.
   - Scale: it has rhythm. There is the 52px h1, 26px section heads, a 44px close "Open the console", and 64px+ figure faces (`/v1`, `OIDC`, `OSS`) as the one big thing in the Client screen. The rest is 14–17px.
   - On the phone, the header "Try Hanzo" (white solid) and the hero "Open Console" (white solid) share the first screen, so there are two solid fills with two different labels. See Shared chrome.
5. **Does every hover and press answer, with no jumps?**
   - Most do: the sidebar rows, the in-mock rail icons (tooltip plus fill), the client cards (`#f2f2f2` → `#ededed`), the GitHub row (fills `#f5f5f5`) and the primaries (fill change plus scale 0.98).
   - Five links showed no measured change in colour, background, border or transform on the element itself: Documentation (hero), Deploy to Cloud, Self-host, and the Related rows "Console docs →", Chat, Bot and Search. If an underline or arrow moves inside them it is too faint to see in frames.
   - The hero mock's "Find it by typing it /" button narrows from 212px to 204px on hover, a small jump.
6. **Overlaps, font swap or layout shift, at either size?** There is no font swap and no page-level layout shift. There are three defects:
   - **Palette highlight breaks the word (desktop and phone).** After typing "usa", the result renders "Usa" on one line with a 2px rule under it and "ge" on the next. The cause is `.cs-find-n` being `display:flex; flex-direction:column`, which makes the `<mark>` a block row.
   - **Phone, palette preview window.** Its content scrolls under its own title bar and footer. The "Projects" heading is cut by the title bar, and "Every request enters here, so the…" is sliced by the `api.hanzo.ai/v1 · Open in the console` footer (frames p-09 and e-phone-clip).
   - **Phone, Keys chapter card.** "scoped to a…" is truncated, and the `active` chip drops to its own line under the key name, centred and unanchored.
7. **Which reference does it feel like, and is that reference's motion there?** It feels like apple.com product pages: the product is the hero, there is a pinned scene where one panel changes, and there is a scrub counter. That motion is genuinely there. The motion.dev patterns are partly there (the self-typing palette, the count-up of usage records). synchronized.studio's card-into-page is only a sheet, not a morph, which is fine for this page type.
8. **Different from its neighbours?** Its hero medium (a self-running admin UI in a black room) and its signature (the pinned module stage plus the typed palette) are this page's own. I did not walk the neighbouring cloud product pages. If they also use the `platform.hanzo.ai` window mock, they will collide.
9. **Are all 18 parts covered?** I only checked what is visible from the walk. Observed on the page:
   - One h1, a skip link first in tab order, and `data-cta` on both primaries (`console.hero`, `console.close`).
   - A pause control on the self-running demo, a 2px focus ring on every stop, Esc closing the sheet, reduced motion settled, tabular figures, the closing band, then the footer.
   - Not checked: sound, tracking, JSON-LD and budgets.
10. **Any banned tells?** No hue, no gradient text, no kicker above a headline (the `01 PROJECTS` mono labels sit below their h3), no Inter, and no three equal boxes. The client grid is a 2+1 with a wide OSS tile. There is no cursor glow and no fading button.
11. **Is the copy untouched?** Yes: parity 93/93 text and 14/14 links. One thing visible is copy rather than layout: every phone chapter shows its title twice, once as the mock's heading and again as the h3 under it ("Providers and models" twice, "Usage and balance" twice). The words are frozen Hanzo copy, so only the presentation can change: the mock title could be hidden from view, or the h3 could carry it alone.

## Fix list (to reach 8+), most important first
1. **Palette result highlight.** Make the `<mark>` inside `.cs-find-n` inline. For example, wrap the name in its own inline span so the column flex only stacks name and `<em>` description. "Usage" must read as one word with the match shown on "Usa".
2. **Phone palette preview (`.cs-find` window at 375).** Stop the content from scrolling under the title bar and footer. Either crop to a clean state that starts below the title bar and ends above the footer, or give the body a fixed height that holds the Projects table plus the gateway note in full.
3. **Kill the third window.** The palette section's preview is the same `platform.hanzo.ai` window seen twice already. Give it a different crop or object, such as only the target panel, larger and with no chrome, or the palette alone on the black stage. Then each screen brings something new and James stops seeing a repeat.
4. **Phone chapter stack.** Turn the six stacked card, h3, kicker and paragraph blocks into one sticky window with the copy scrolling past, or a swipe rail with a `01 / 06` caption. Also drop the doubled title by hiding the mock's own heading on phone. Right now it is 11,606px of the same rhythm six times.
5. **Phone Keys card.** Lay out `sk-...`, "scoped to acme" and `active` so nothing truncates at 375. Put the chip inline after the scope line or under the key on the left, not floating centre.
6. **Hero window's dead pane.** For the Usage and Keys states, fit the window height to the content, or anchor the content to fill it. About 200px of empty black in the main pane at scrollY 500 looks unfinished.
7. **The white void after the hero** (about 300px above "A module per product, one shell around them"). Tighten it to the section-padding token so the next idea peeks in.
8. **Give the silent links a hover answer**: hero "Documentation →", "Deploy to Cloud →", "Self-host →", and the Related capabilities rows. Use the arrow nudge or the row fill that "View on GitHub" already has.
9. **Hero search button width jump** (212px to 204px on hover). Hold the width.
10. **Start the hero demo a little earlier.** The palette arrives at about 1.2–1.5s. Starting it, or a cursor blink or row highlight, before 1s meets the "moves within 1 second" bar.

## Shared chrome
- **Console error, seen once.** On the first cold load of my walk, React logged "A tree hydrated but some attributes of the server rendered HTML didn't match the client properties", and the red "1 Issue" badge sat bottom-left for the whole desktop walk. That load had no consent stored and showed the cookie card. Three further cold loads did not reproduce it: two desktop without consent and one phone. It may have come from concurrent HMR on the shared dev server, but whoever owns the cookie card and header should check SSR/client attribute parity on first visit.
- **Two solid asks on the phone's first screen.** The phone header ask stays a solid white "Try Hanzo" on the black hero, beside the page's solid white "Open Console". The label also never swaps to "Open Console" on the phone, while desktop does swap it.
- The header "Company" button measured 30×34px in the Tab crawl. The header items are 34px tall, under the 44px target.
- I saw a mid-transition 5px downward offset of the header in one click frame. It was not reproduced.
