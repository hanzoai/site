# /api — James-eye review

Verdict: 6/10
First complaint: "The thing that's meant to be the hero is cut in half at the bottom of my screen. And why is everything blue?"

Walked 7 Nov, page file at `a1dcdca` (`components/pages/ApiPage.jsx`, `ApiPage.css`, shared `v2/AppStage`, `AppScenes`, `v2/x-edison/AppLines`), on the preview of main plus the Apps 1 branch. The full walk was filmed at `f44badd`. Merge `a1dcdca` only moved the headline component's import and fixed the tab-pill CSS, and a fresh hero shot at `a1dcdca` matches. Filmed moving at 1470×801 and 375×812 (wheel and finger scroll, dwell on every screen, hover and press on desktop, taps on phone), plus reduced motion and JS off. Stills: `review/api/desktop-walk.jpg`, `review/api/phone-walk.jpg`.

## What works
- The idea is right. A big console types each endpoint after `https://api.hanzo.ai`, streams what it returns, and plays the real model film beside it (Koma, Iro and the rest). That is Hanzo's own media giving the colour.
- "How it fits together" is a real Apple pinned scene: four chapters, the text holds while the panel changes. One comes in, one goes out.
- The base URL in a dark room at display size is a strong moment. Copy confirms ("Copy" turns to "Copied", announced). "Copy as curl" exists.
- Desktop: 60fps, CLS 0, every hover answers. Parity: text 80/80, links 18/18. Reduced motion leaves 0 running animations.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** The headline sells. But at 1470×801 the console, which is the hero object, starts at y≈690 and only its top half shows. Above the fold, after the headline cut-in, the only thing moving is a blinking caret. The typing and streaming happen below the fold.
2. **One in, one out, or a document?** The pinned chapters are a scene. "Core endpoints" is a long accordion list of 15 rows, which is a document, though the detail sits behind clicks.
3. **A real visual object in every section?** Mostly. The console with model film, the dark base URL and the route diagram, yes. But the chapter panels are grey and blue bars standing in for UI: skeleton stripes, not real product.
4. **One ask, sticky after the hero?** Phone: yes, "Get an API key, free" bottom bar. Desktop: no sticky ask, only the site header's "Try Hanzo", a different ask. The page never repeats "Get an API key, free" at the end. It closes on two equal "NEXT" cards (API reference, Getting started).
5. **Every hover and press answers, no jumps?** Hovers answer. Press on "Get an API key, free" only darkens; there is no .98 scale or 1px drop. On phone, tapping some endpoint rows (`/v1/decisions`, `/v1/embeddings`, `/v1/billing/balance`) did nothing visible.
6. **Overlaps, font swap, layout shift?** Phone layout shift is 0.46, which is huge: the console changes height as each answer streams, and the "Paste and ship" section, the chips and the film jump under your thumb. Desktop 0. No font swap. JS off: 8 of 39 text blocks stay invisible. Phone targets under 44px: "console" (25px), "Body and parameters" (22px).
7. **Which reference, is its motion there?** Apple product page (pinned chapters, product as hero): yes, apart from the hero sitting under the fold. BRIEF §5.6 developer hero is "a terminal with a streamed curl and Copy, Get API key beside it". It is close, but there is no request and response you can read and copy in the first screen, and no curl / Python / JS switch.
8. **Different from neighbours?** Partly. It shares its stage, scenes and type kit with /cli, /bot, /desktop and /gen. All five open with a mono kicker over a Display headline. The cobalt here sits beside /desktop's blue and /operative's blue.
9. **18 areas (PLAN-COMPONENTS)?** See below. No `docs/coverage/api.md`.
10. **Banned tells?** Yes:
    - eyebrows over the h1 ("API" in blue) and over headlines ("UNDER THE HOOD", "01 · BILLING", "BASE URL", "REFERENCE", "NEXT");
    - a cobalt UI accent on the kicker, method pills, chapter bars, "/v1" and the round arrow buttons;
    - a green live dot;
    - a browser-default `<select>` for the endpoint picker in the dark room.
11. **Copy untouched?** Yes (parity clean).

## Missing from the 18 areas
- **2.3 First impression:** h1, lede, primary and the hero object do not fit 1470×801 together. No closing Band in Hanzo's words.
- **2.4 Conversion:** no desktop sticky ask. The ask is not repeated after proof or at the end. The press state is missing.
- **2.7 Visual system:** a cobalt accent breaks the 0-hue rule. The chapter "UI" is placeholder bars.
- **2.8 Components:** native select; some phone rows give no tap feedback.
- **2.11 / 2.12:** phone CLS 0.46; small tap targets; hidden text with JS off.
- **2.16 Developer:** no readable request and response in the hero, no language switch.
- **2.18:** no `Persona:` / `Goal:` / `CTA:` lines, no `data-cta`.

## Fixes (in order)
1. **Bring the console into the first screen at 1470×801.** Shrink the h1 to about 96px, or put the console beside the headline (7/5 split), so the path typing and the streamed answer play above the fold within the first second.
2. **Fix the phone jump.** Give the console a fixed height (the longest answer) so nothing below it moves while it streams. Layout shift must read 0.
3. **Take the blue out.** Method pills, bars, "/v1" and the arrow buttons go ink or white alpha steps. Colour only from the model films. Drop the green dot (use a shape or the word). Delete every kicker above a headline.
4. **One ask, everywhere.** Add the desktop sticky "Get an API key, free" once the hero button leaves. End on a closing Band that repeats it as the one solid button, with "OpenAPI Reference" as a text row. Add press: scale .98.
5. **Make the chapters real.** Replace the grey and blue placeholder bars with the actual request, header and response text from the page (the bearer line, the route list, the client names), and swap the native endpoint select for the page's own styled list.
