# /desktop — James-eye review
Was ready (7 Nov), withdrawn 8 Nov: copycheck.mjs shows Hanzo lines missing (docs/COPY-RULE.md). 2026-11-07 the window is the real thing and leads the first screen (thread, limit.go, go test, Tests pass; no stripes, no blue or green; the empty file box now waits for its step, the first build runs faster and later loops keep the window built instead of blanking); missing hovers/press added (window tabs, terminal hold and command chips, note toggles). taste OK, parity 59/59 + 9/9, unique OK, check.mjs 0 errors / 0 overlaps / no h-scroll at 1470 and 375, phone CLS 0, reduced motion rests on the finished frame.

Verdict: 6/10
First complaint: "It's a box of grey stripes pretending to be an app. Show me the real thing, and drop the blue."

Walked 7 Nov, page file at `a1dcdca` (`components/pages/DesktopPage.jsx`, `DesktopPage.css`, shared `v2/AppStage`, `AppScenes`, `AppSheet`), on the preview of main plus the Apps 1 branch. Filmed moving at 1470×801 and 375×812 (wheel and finger scroll, dwell on every screen, hover and press on desktop, taps on phone), plus reduced motion and JS off. Motion was judged from the frames (the machine was overloaded). Stills: `review/desktop/desktop-walk.jpg`, `review/desktop/phone-walk.jpg`.

## What works
- The app window assembles itself and does one real job from Hanzo's example: "Add rate limiting to the payments API", "Read 14 files…", "Wrote gateway/limit.go and a test at 100 req/min per key. Tests pass." The window chrome follows your OS.
- "Cut the network" is a good Beyond and a proper dark room: pick local or cloud, flip the network off, and see which agent keeps running.
- "Available everywhere you work" as three huge OS names is a confident type moment. "See the spec" opens a sheet, so the detail sits behind a click.
- Press scales .98, hovers answer, CLS 0 at both widths, no font swap. Copy confirms. Parity: text 59/59, links 9/9. Reduced motion leaves 0 running.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Half. A centred kicker, a centred name, one line and two buttons, with the app window only peeking in the bottom third at 1470×801. Once the window has built, the first screen sits still.
2. **One in, one out, or a document?** Yes for the three pinned chapters and the dark room. The ending is not: after "Download it and build one" come a "Get Desktop" card, "Related capabilities" and "Paste and ship".
3. **A real visual object in every section?** There are objects everywhere, but most are not real. The editor's code is grey and blue bars, and the three chapter panes (agents, models, workflows) are mostly stripes and pills. They read as loading skeletons, the "lazy look" he rejects.
4. **One ask, sticky after the hero?** No sticky "Download" at either width; only the header's "Try Hanzo", a different ask. The closing screen has two solids side by side ("Download" and "Deploy to Cloud"). On phone, a sky-blue solid "Open in the console" sits right under the hero's black "Download".
5. **Every hover and press answers, no jumps?** Desktop yes. Phone: tapping "macOS" and the spec rows gave no visible answer. "Desktop docs →" is 15px tall and "Open in the console" 18px on phone.
6. **Overlaps, font swap, layout shift?** None. JS off hides 7 of 32 text blocks.
7. **Which reference, is its motion there?** Apple product page in the pinned chapters, yes. The "product as the hero" half is weakened because the product is drawn as placeholders.
8. **Different from neighbours?** Weakly. The centred kicker, name and two buttons over a stage is the same opening as /bot. Pinned chapters, dark room and "Paste and ship" are shared with /api, /bot and /cli.
9. **18 areas (PLAN-COMPONENTS)?** See below. No `docs/coverage/desktop.md`.
10. **Banned tells?** Yes:
    - eyebrows over the h1 ("NATIVE DESKTOP CLIENT" in blue) and over headlines ("01 · AGENTS", "IT WORKS WITH THE NETWORK OFF");
    - a sky-blue UI accent on the send button, chips, bars, toggle, round arrow buttons and a solid button;
    - green "Tests pass" and "Running".
11. **Copy untouched?** Yes (parity clean).

## Missing from the 18 areas
- **2.3 First impression:** the hero object is mostly below the fold. The page carries on after its Band.
- **2.4 Conversion:** no sticky ask; two solids at the close; a blue solid in the phone hero.
- **2.7 Visual system:** sky-blue and green UI hues. Placeholder bars in place of product renders ("Show the real thing", plan 0.1).
- **2.11 / 2.12:** 15–18px phone targets; some taps give no answer.
- **2.18:** no `Persona:` / `Goal:` / `CTA:` lines, no `data-cta`.

## Fixes (in order)
1. **Replace every stripe with real content.** The editor shows the real `limit.go` lines and the test result. The chapter panes show the real job, tools and model rows the page already names. No grey bars anywhere.
2. **Lead with the window.** Make the app window the first screen (name and Download over or beside it at about 96px), so the build plays above the fold at 1470×801.
3. **Take out the blue and green.** Chips, toggles, bars and arrows go ink or white alpha steps. Status is a shape or a word, not green. Delete the kickers over the h1 and the headlines.
4. **One ask.** Add a sticky "Download" after the hero at both widths. End on "Download it and build one" with one solid. Move "Get Desktop", the related links and "Paste and ship" above it, or into the spec sheet.
5. **Phone.** Make "Open in the console" a text link. Make "Desktop docs" and the OS rows 44px targets that answer on tap.
