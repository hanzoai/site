# /api — James-eye review

Verdict: 6/10
First complaint: "The thing that's meant to be the hero is cut in half at the bottom of my screen, and there's a pill bar floating over the text."

Walked 7 Nov, page file at `4b53974` (`components/pages/ApiPage.jsx`, `ApiPage.css`, shared `v2/AppStage`, `AppScenes`, `v2/x-edison/AppLines`), on the 14:43 preview of main plus the Apps branches, judged against `docs/MASTER.md` and `docs/JAMES.md`.
- **This build:** a 9-second first-screen film at 1470×801 and 375×812 with no input, hover and press on the primary, a full scroll pass at both widths, reduced motion, JS off and phone tap targets.
- **The earlier `f44badd` walk:** the full moving walk, with the same layout, is where the phone layout-shift figure comes from.

Stills: `review/api/desktop-walk.jpg`, `review/api/phone-walk.jpg`, `review/api/desktop-first-9s.jpg`.

## What works
- The idea is right. A big console types each endpoint after `https://api.hanzo.ai`, streams what it returns, and plays the real model film beside it (Enso, Koma, Iro…). Colour now comes only from those films: the page is monochrome and taste.py passes.
- "How it fits together" is a real pinned scene: four chapters, the text holds while the panel changes.
- The base URL in a black room is a strong moment. Copy confirms. "Copy as curl" exists.
- Press scales .98, hover darkens, every desktop hover answers. JS off hides 0 of 39 text blocks. Reduced motion leaves 0 running. Parity: text 80/80, links 18/18.

## Card check
- `docs/coverage/api.md` does not exist, so the verdict is capped at 7. All 18 parts are missing a `Done here:` line.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** The words sell, but at 1470×801 the console starts at y≈690, so only its top strip shows. On the slow machine the h1 was the last thing to arrive (about 7 s), after the lede and buttons. Above the fold, the only mover is a caret.
2. **One in, one out, or a document?** The chapters are a scene. "Core endpoints" is a 15-row accordion list, a document, though the detail opens on click.
3. **A real visual object in every section?** Mostly. The chapter panes are partly grey bars standing in for UI ("One key, one bill" is a list of stripes), not real product.
4. **One ask, in the sticky header?** No. The header says "Try Hanzo", but the page's ask is "Get an API key, free". That ask rides in a floating pill at the bottom of the desktop screen, over the chapter text, the black room and the endpoint list. The page also never repeats the ask at the end; it closes on two equal "NEXT" cards.
5. **Every hover and press answers, no jumps?** Desktop yes. On phone, some endpoint rows gave no visible answer to a tap. "console" (25px) and "Body and parameters" (22px) are under the 44px target.
6. **Overlaps, font swap, layout shift?** The floating pill overlaps content at 1470×801. On phone the console changes height as each answer streams, and the sections below jump: 0.46 layout shift on the full walk (`f44badd`, same layout).
7. **Which reference, is its motion there?** Apple product page (pinned chapters): yes. MASTER §4.6 developer hero is a code block with the existing request, the streamed response and Copy beside the key ask. That is not in the first screen, and there are no language tabs.
8. **Different from neighbours?** Partly. Its stage, chapters and kit are shared with /bot, /desktop and /cli; the hero (console plus model film) is its own.
9. **18 parts (MASTER §2)?** No card. See below.
10. **Banned tells?** Yes:
    - labels directly above the h1 ("API") and above h2s ("UNDER THE HOOD", "BASE URL", "REFERENCE", "NEXT");
    - a floating pill bar over content;
    - a 128px h1 filling the first screen while the hero object is pushed off it.
11. **Copy untouched?** Yes (parity clean).

## Missing from the 18 parts
- **Card:** no coverage card, and no `Persona:` / `Goal:` / `CTA:` / metric lines.
- **Part 3 First impression:** the hero object is not in the first screen. No closing `Band`.
- **Part 4 Conversion:** the header ask does not match; the ask floats; it is not repeated after proof or at the end.
- **Part 7 Visual system:** labels over headings; placeholder bars in the chapter panes.
- **Part 8 Components:** the dark room's endpoint picker is a browser select.
- **Part 11 Mobile:** phone layout shift; small targets.
- **Part 16 Developer:** no readable request and response pair in the hero; no curl / Python / JS tabs.

## Fixes (in order)
1. **Bring the console into the first screen.** Put the h1 at rest size (52px per MASTER §3.1, or a little larger as the moment) beside the console, so the path typing and the streamed answer play above the fold within the first second. Paint the h1 first; let the mask start from its final place.
2. **The ask goes in the header.** "Get an API key, free" in the sticky header for this page (via `lib/cta.js`; write `docs/requests/api.md` for the shared part). Turn off the floating desktop pill. End on a `Band` that repeats the ask once.
3. **Fix the phone jump.** Give the console a fixed height (its longest answer) so nothing below moves while it streams.
4. **Delete every label sitting directly above a heading.** Keep the mono style for chapter captions and figure labels.
5. **Make the chapters real.** Replace the grey bars with the page's own request lines, route names and client names. Swap the browser select in the dark room for the page's own styled list.
6. **Write `docs/coverage/api.md`**: 18 parts, each with real evidence.
