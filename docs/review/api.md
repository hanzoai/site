# /api — James-eye review

Verdict: 7/10
First complaint: "I press GET on the endpoints list and it goes empty. It says 5 of 15 and shows nothing. That's broken."

Walked 2026-11-07 16:35 UTC, HEAD 08fcbcbf, at 1470x801 and 375x812 (first screen at 0.2/1/3/6 s plus a reload, 200px wheel steps with 0.7 s dwell to the footer, hover and press on the asks, hero tabs, pause, copy buttons, the 01–04 scene steps, the dark endpoint picker, All/POST/GET, search, empty state, Show all, accordion rows and Next rows; taps on phone; reduced motion and JS off at both sizes; taste.py and parity.py).

## What works
- The first screen sells in 5 s: h1, lede, "Get an API key, free", and a live request bar typing `https://api.hanzo.ai/v1/chat/completions`. The description streams in, and a Hanzo model visual (Enso, Zen, Iro…) changes with each of the 8 routes. Something moves within 1 s (2% pixel change from 0.2 to 1 s, and it keeps moving to 6 s).
- Pause works: aria-pressed flips, the label changes to Play and the text freezes.
- The pinned "How it fits together" scene is the best moment on the page: 4 panels (key/bill list, identity strip, OpenAPI-to-client check list, gateway diagram), one at a time, with 01–04 steps that jump to each panel. It stacks cleanly on phone.
- The black room is a proper scale moment: `https://api.hanzo.ai/v1` at display size with Copy, then an endpoint picker that rewrites the curl. Copy as curl copies exactly what is shown (checked against the clipboard). The agent prompt copy also copies exactly and says "Copied".
- Monochrome throughout; colour only comes from the model media. taste.py OK, parity 80/80 text and 18/18 links. No horizontal scroll at either size.
- Primary: hover darkens the fill (#0a0a0a to #2c2c2e), press scales to 0.98, no movement. Next rows slide and the arrow fills on hover. The gliding segment pill on All/POST/GET works.
- Reduced motion shows the final state (0 animations, full description, full request). JS off is fully legible at both sizes.

## The 11 answers
1. Yes. It sells in 5 s and moves within 1 s. One small thing: when a route retypes, the description card sits empty for a beat (blank "01 / 08" card at 3 s), which looks unfinished.
2. Mostly one in, one out. The pinned scene does it properly. Around it there are large empty bands (about 250px of white between the hero and "Paste and ship"; the lone "How it fits together" heading followed by roughly 160px of nothing; a screen of empty black on the left of the dark room while the picker scrolls by).
3. Yes, every section holds a real object: request bar plus media, agent prompt card, 4 scene visuals, base URL plus curl, endpoint table, closing band. But they are mostly the same object: the `/v1/...` path list appears in the hero tabs, scene 1, scene 3 (twice), the gateway diagram, the dark picker and the core table. That is 6 or 7 retellings of one list, the "too many repeats" James already named.
4. One solid ask, "Get an API key, free", in Hanzo's words. On desktop the header swaps to it after the hero, which is good. On phone the header keeps a solid "Try Hanzo" the whole way down. The first phone screen shows two solid fills with two different asks, and the page's ask never reaches the phone header. On desktop at 0.2–1 s the header "Try Hanzo" is also solid next to the hero primary, before it turns outlined. Scale has rhythm: h1 52, scene heads 32, base URL as the big moment, mono captions small. Nothing floats over content except the shared cookie card.
5. Not all of them. The hero tabs, primary, Next rows, segment and copy buttons answer. "OpenAPI Reference ↗" (hero and band) shows zero pixel change on hover, so a secondary ask that does nothing on hover. **GET filter is broken** (see Fixes 1).
6. No overlap at either size. Clipping: the gateway diagram chips truncate the routes it is meant to show (`/v1/chat/c…`, `/v1/images…`, `/v1/videos…`). The dark curl line is cut mid-word at desktop (`/v1/chat/comple`) because it is an overflow-x scroll box with no visible cue. No font swap seen.
7. apple.com (pinned scene with a numbered step rail) and motion.dev (layoutId pill, typed or streamed text). Both are actually there. It is calmer than an Apple product page because the hero object is a framed card rather than a full-bleed product.
8. Yes. The hero medium (a typing request bar that changes model media per route) is its own, and the signature (the request types and the answer streams, pausable) is the brief's /api signature.
9. Visible coverage looks complete for a developer page: hero code object with the key ask beside it, request-flow drawing, base URL, curl, endpoint table with states (empty state "No endpoint matches. Show all" exists), band, next links. The search input is 15px (part 8 asks for 16px or more, and iOS will zoom). I did not audit the coverage card, per the brief.
10. No banned tells seen. No hue, no gradient text, no eyebrow above an h1/h2 ("AGENT PROMPT" and "ENDPOINT" sit inside their cards), no 3 equal boxes, no fade-on-hover buttons.
11. Copy untouched: parity 80/80 and 18/18.

Shared (not counted): one hydration-attribute mismatch with a red "1 Issue" badge on the first cold desktop load. It did not come back in 9 more loads (desktop, phone, reduced motion), and the truncated diff did not point into ApiPage, so it is consistent with the known FooterHTML issue. The cookie card (203px tall on phone) and the phone header ask are shared chrome.

## Fixes (in order)
1. **GET filter shows an empty list (desktop and phone).** All five GET rows have `<li>` height 0. Cause, in `components/pages/ApiPage.jsx` `Table()`: the effect sets `hidden="until-found"` on `li[data-more]` (rows 7 and up under All). When a filter makes those same keyed rows index < 6, `data-more` is dropped, and the effect only re-queries `li[data-more]`, so the old `hidden` attribute is never removed. Fix: in the effect, clear `hidden` on every `li` when `full` is true (or drive `hidden` from JSX instead of imperatively). The same bug will hit any search whose matches were rows 7 and up.
2. Stop repeating the path list. Keep it in the hero tabs and the core table. Give scene 1, scene 3 and the gateway a different view of the idea (one key meeting one bill figure, one row ticking through, the gateway fanning to a few short labelled stubs) so each screen says something new. While there, stop the gateway chips truncating the routes they exist to show.
3. Get the page's ask into the phone header: request a shared-header change so /api's "Get an API key, free" replaces a solid "Try Hanzo", and so the header ask is never solid while the hero primary is on screen (also desktop, first 1 s).
4. Make "OpenAPI Reference ↗" answer on hover (underline draw or arrow nudge, something other than opacity), in the hero and in the band.
5. Don't blank the hero description between routes: keep the previous text until the new one starts streaming, or stream over it.
6. Dark curl: wrap the curl, or show a scroll cue or fade on the clipped edge, so `/v1/chat/comple` doesn't read as a cut-off.
7. Tighten the dead bands: the gap between the hero and Paste and ship, the lone h2 before the pinned scene, and the empty left column in the black room. Also set the endpoint search input to 16px.
