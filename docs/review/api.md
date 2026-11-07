# /api — James-eye review

Verdict: 7/10
First complaint: "Much better. But the button up top still says 'Try Hanzo' on the API page, and the base URL gets chopped off on my phone."

Walked 7 Nov, page file at `aea817e` (`components/pages/ApiPage.jsx`, `ApiPage.css`), on the 15:08 preview (main with the shared system `648b798`, plus the Apps branches), judged against `docs/MASTER.md` and `docs/JAMES.md`. The walk covered:
- a 9-second first-screen film at 1470×801 and 375×812 with no input;
- hover and press on the primary;
- a full scroll pass at both widths;
- a layout-shift pass at both widths: 12 s idle on the hero, then a slow scroll to the end;
- reduced motion, JS off and phone tap targets.

The page files did not change during the walk. Stills: `review/api/desktop-walk.jpg`, `review/api/phone-walk.jpg`, `review/api/desktop-first-9s.jpg`.

## What works
- **The first screen now sells.** A 52px headline, lede and "Get an API key, free" sit left of the live console. The console types the path after `https://api.hanzo.ai`, streams the answer and plays the model film (Enso, Zen…). It is in view at 1470×801 and moving within the first second.
- **One focal point per screen,** with real rhythm: big console, medium headline, small captions.
- **The chapter panes are real now:** the route list with its bearer line, client and downstream headers, the OpenAPI and client columns.
- **The black room** has a styled endpoint list (no browser select), and Copy as curl confirms.
- **The page ends on a Band:** "Every Hanzo capability answers under one base URL, behind one key." with the ask once more.
- **Checks:**
  - no labels over headings, no floating bar;
  - layout shift 0 at both widths;
  - JS off hides 1 of 35 text blocks, and reduced motion leaves 0 running;
  - no phone target under 44px;
  - taste.py passes;
  - parity: text 80/80, links 18/18.

## Card check
- `docs/coverage/api.md` does not exist, so the verdict is capped at 7. All 18 parts are missing a `Done here:` line. The header comment does now carry Persona, Goal, CTA and the metric.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes: the console types at once. On this loaded machine the headline's cut-in came a few seconds after the console. Make sure it paints first.
2. **One in, one out, or a document?** Scenes through the chapters and the black room. "Core endpoints" is still a 15-row list, but each row opens.
3. **A real visual object in every section?** Yes.
4. **One ask, in the sticky header?** The header shows "Try Hanzo" (shared header label; the page has filed a request), while the page's ask is "Get an API key, free". The hero and Band carry the right ask with one solid each.
5. **Every hover and press answers, no jumps?** Yes: press .98, hover darkens, rows open.
6. **Overlaps, font swap, layout shift?** None. One flaw on phone: in the black room, the display-size `https://api.hanzo.ai/v1` is clipped at the right edge ("…hanzo.ai/v").
7. **Which reference, is its motion there?** Apple product page (product as hero, pinned chapters): yes. The MASTER §4.6 developer hero (request, streamed response, key ask beside it): yes.
8. **Different from neighbours?** Yes: a console with model film, unlike /cli's terminal room or /gen's board.
9. **18 parts (MASTER §2)?** No card. See below.
10. **Banned tells?** None found on this build.
11. **Copy untouched?** Yes (parity clean).

## Missing from the 18 parts
- **Card:** `docs/coverage/api.md` is missing (caps at 7).
- **Part 4 Conversion:** the header label (shared) should read the page's ask. The two "Next" cards sit as equal boxes just before the Band.
- **Part 11 Mobile:** the base URL is clipped at 375.
- **Part 16 Developer:** no curl / Python / JS tabs on the request.

## Fixes (in order)
1. **Write `docs/coverage/api.md`**: 18 parts, each with real evidence. This is the only thing between the page and 8.
2. **Fix the phone base URL.** Let it wrap after `api.hanzo.ai`, or size it to fit 375, so `/v1` is seen.
3. **Fold "Next" into the Band.** Make "API reference" and "Getting started" two text rows under the Band's ask, not two boxes before it.
4. **Paint the h1 first,** then start the console, so the words lead on a slow laptop.
5. **(shared)** Follow up the header-label request so the header reads "Get an API key, free" on this page.
