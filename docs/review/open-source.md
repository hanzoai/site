# /open-source — James-eye review

Verdict: 5/10
First complaint: "Half the page is blank. The totals, the commitments and the repos under Contribute never appear, so I'm scrolling through white space and it looks broken."

Walked 7 Nov 2026 on the dev server at 1470x801 and 375x812 (recorder walk at both sizes: first 0/1000/3000 ms, 13 desktop and 20 phone scroll stops with a/b idle frames, 14 hovers, 9 clicks. Then my own Playwright probes: a slow wheel scroll through the whole page at both sizes logging the charter list's opacity, hero frames every 200 ms for 2.4 s, hovering and clicking a constellation cluster, hover on the org cards, tiles and closing ask, the Zoo org tab, reduced motion, JS off, and 375x667 ask position). Parity: `scripts/parity.py /open-source` OK, text 417/417, links 139/139. The console's one error is the known FooterHTML hydration mismatch (shared chrome, not counted). It is also what causes the red "1 Issue" badge.

## What works
- **The hero is a real idea.** A black room with a canvas "sky" of every repository. At 0 ms it is black with the lede. By 400 ms the h1 is cutting in by line mask (`probe/hero-0400.jpg`). By 1.6 s the dots pull back into three labelled galaxies: Lux, Hanzo, Zoo, each with its organization and repository counts. It drifts while idle (idle diff 426 bytes at rest). Pointing at a cluster rings it and shows a tip with real numbers ("hanzoskill · 749 repositories · 786 commits this year"), and clicking it opens `/oss/hanzoskill/`. This is the "one live object", and it is this page's alone. See `open-source/hero-sky-hover.jpg`.
- The h1 is 52px / 497, its box never moves, CLS is 0.0015 on desktop and 0 on phone, and there is no horizontal overflow at either size.
- **"What we publish"** is a proper state change. The ecosystem tabs re-light a commit-year heat grid, a language bar and the latest three commits, inside a quiet `#f5f5f5` panel. The sheet "The year in Zoo, every repository" opens and closes.
- **"Every organization"**: numbered `01 / 37` cards with a repository bar. The Hanzo/Lux/Zoo tabs work (Zoo `aria-selected=true`). Cards rise in properly (`xos-up`), and hover shifts the fill `#f5f5f5` → `#ededed` and tilts.
- Colour is monochrome throughout: no hue, and greys only.
- Reduced motion shows every final state, and `getAnimations()` is 0 after 3 s. With JS off the h1 and every charter article are legible.
- At 375x667 the hero ask sits at 571–619px, above the fold.

## The 11 answers
1. **Sells in 5 s, moves within 1 s?** Yes on desktop. At 1000 ms the field is already moving and the h1 is cut in, and by 1.6 s the galaxies have formed. On phone the h1 sits over the dot field at 1000 ms, then the field settles above it by 3000 ms. Two faults:
   - **The hero lede is low-contrast dark mode, which is a banned tell.** Computed colour is `rgb(82,82,82)` on `#000`, about 2.7:1. `.pf-r .pf-lede` in `components/v2/ProofRhythm.css:19` (specificity 0,2,0) beats `.xos-lede { color: rgba(255,255,255,.78) }` in `OpenSource.css:40`.
   - **Two big things compete in the first screen.** The 112px "1,733" and the 44px row of figures sit directly under the 52px h1, and at 1470x801 the 1,733 is cut by the fold (top 680px).
2. **One in, one out, or a document?** Neither, because whole screens are empty. The slow wheel probe shows `.xos-arts > li` stuck at opacity 0 even after `data-arrive="in"`, and the same happens at both sizes:
   - **Totals:** "Total across Hanzo" sits pinned next to nothing (`d/screen-03-a.jpg`, phone `open-source/totals-blank-phone.jpg`). The page's count-up "moment" is inside that invisible list, so nobody ever sees it.
   - **Charter:** about 1,000px of white under "Our Stewardship Commitments" (`open-source/charter-blank-desktop.jpg`). Only the signature line draws.
   - **Contribute:** the language chips switch, but the repository list under them is invisible (`d/screen-10-a.jpg`: the right column is empty).

   **Cause:** `@keyframes xos-in` (`OpenSource.css:7`) has only a `from`, so the animation ends at the element's own value. That value is `opacity:0; transform:translate3d(0,16px,0)` from `[data-arrive] > li` (`OpenSource.css:13`). `xos-ocards` and `xos-tiles` work only because line 15 swaps them to `xos-up`, which has a `to`.
3. **Real visual object in every section?** Hero: yes (the sky). Publish: yes (the heat-grid dashboard). Orgs: yes (the cards and bars). The other four fall short:
   - **Built on:** 12 tiles with greyscaled emoji glyphs. The glyphs are Hanzo's live copy, but at 32px in grayscale they read as lazy placeholders.
   - **Totals, Charter, Contribute:** today they show nothing (answer 2). On phone, "Built on" is 12 identical tall cards, about 3.5 screens of the same shape.
4. **One ask, nothing floating; scale rhythm?**
   - **Duplicate ask.** On desktop the header ask swaps to quiet "View on GitHub". The page's own sticky local bar (`.xos-local`, top 60px) then shows a second "View on GitHub" 60px under it, so two identical buttons are stacked on every screen after the hero.
   - **Phone header mismatch.** On phone the header keeps a solid black "Try Hanzo" while the local bar says "View on GitHub", so the page has two different asks. The header is shared chrome, but the local-bar duplicate is the page's.
   - **No `data-thumb`.** The closing "Start Contributing" has `data-cta` but no `data-thumb`.
   - **Scale rhythm.** It is right below the hero: 26px heads, 17px titles, mono captions, with "Contribute" as the one display word at the end. The hero breaks it (answer 1).
5. **Every hover and press answers, no jumps?** Mostly.
   - **Answers:** cluster hover gives a tip with numbers; org cards and tiles change fill and tilt (`#f5f5f5`→`#ededed`); the closing ask lifts 1px; the pause button and chips have `scale(.97)`.
   - **Dead hovers:** "Star Our Repos" and the "The year in Hanzo" disclosure (4/14 dead on desktop).
   - **Off-palette fill:** the closing ask's hover fill is `rgb(42,42,44)`, which is not a deck value.
   - **Touch hint:** on phone the hint still says "POINT AT A CLUSTER", and there is no pointer on touch.
6. **Overlaps, font swap, layout shift?**
   - **Layout shift:** none (CLS 0.0015 / 0).
   - **Overlap:** no overlap of the page's own content.
   - **Shared chrome:** the cookie card covers the hero figures and the phone's lower 220px (shared chrome).
   - **Visual gaps:** the empty screens read as a broken layout, which is worse than a shift.
7. **Which reference, and is its motion there?** It is a Catalogue page reaching for synchronized.studio: the cluster and the card open their org page, and titles carry `data-morph`. The click navigates. I did not verify a Morph hand-off frame by frame. The hero pull-back has the restraint of motion.dev. The charter's "signed" line-art is a good Story beat, but it signs an empty page.
8. **Different from neighbours?** Yes. A canvas constellation of repositories is not used elsewhere, and the heat-grid dashboard and the signed charter are its own.
9. **18 parts?** Parts that fail on what I saw:
   - Part 3: one-in/one-out is broken by the blank screens.
   - Part 4: duplicate ask in the local bar; `data-thumb` missing on the band primary.
   - Part 9: the "count once" figure is never seen.
   - Part 11: hover-only wording on touch.
   - Part 12: hero lede contrast 2.7:1.

   Copy parity passes, and reduced motion and JS off pass.
10. **Banned tells?**
    - **Present:** low-contrast text in the dark room (the hero lede).
    - **Borderline:** emoji glyphs as tile icons (live copy, not headings).
    - **Not seen:** purple/blue gradient, gradient text, Inter, cursor glow, or a pill above an h1. "OPEN SOURCE FIRST" and "CHARTER" sit below their headings, which is correct.
11. **Copy untouched?** Yes. `parity.py`: 417/417 text, 139/139 links.

## Fixes (in order)
1. **Make the hidden lists appear.** In `components/pages/OpenSource.css:7`, give the keyframe an end state: `@keyframes xos-in { from { opacity: 0; transform: translate3d(0,16px,0); } to { opacity: 1; transform: none; } }`. Alternatively, point line 14 at `xos-up`. This one change brings back:
   - Totals, including the count-up moment.
   - All six charter articles.
   - The Contribute repository list.

   Then re-walk both sizes and confirm `.xos-arts > li` and `.xos-total-n > li` reach opacity 1 and the `.xos-lrepos` items are visible.
2. **Fix the hero lede contrast.** `.xos-lede` loses to `.pf-r .pf-lede` (`#525252`). Use `.xos-hero .xos-lede { color: rgba(255,255,255,.78); }` in `OpenSource.css:40` to reach at least 4.5:1 on black.
3. **One ask on screen.** Remove the "View on GitHub" button from `.xos-local` (`OpenSource.jsx`, Local, `.xos-local-a`) on desktop, since the header already carries it. Alternatively, keep the local bar's button and let the header stay quiet. Add `data-thumb` to `[data-cta="open-source.band"]`. Ask the shared-chrome owner (`docs/requests/open-source.md`) to swap the phone header ask to "View on GitHub" as the desktop header does.
4. **Calm the first screen.** Let the 1,733 rest at 64px (deck figure size) under the h1, or move the hero stat row below the fold so the h1 is the one big thing. Do not cut a 112px figure in half at the fold at 1470x801. Let it grow only as the moment, in Totals, once that list is visible.
5. **Give "Built on" an object and a phone composition.**
   - Render the live emoji glyphs smaller, as a monochrome mark row, rather than as 32px greyscale icons heading 12 equal tiles.
   - On phone, use 72px list rows or a 2-column grid instead of 12 full-width cards (about 3.5 screens).
6. **Touch and hover details.**
   - Hide "POINT AT A CLUSTER" under `(hover: none)`, or swap it for "tap".
   - Give "Star Our Repos" and the "The year in …" disclosure a hover change other than opacity.
   - Replace the closing ask's hover fill `rgb(42,42,44)` with a deck value (`#262626` or `#171717`).
7. **Re-walk after fix 1.** Once the lists show, check that the totals and charter sticky headers (`.xos-total-h`, `.xos-ch-h`, top 120px) still pair with visible content all the way down, and that no section leaves more than about 40px of dead white between the outgoing and incoming object.

Frames: `open-source/hero-sky-hover.jpg` (what works), `open-source/charter-blank-desktop.jpg` and `open-source/totals-blank-phone.jpg` (what is broken).
