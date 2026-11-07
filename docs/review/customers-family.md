# /customers/[slug] — James-eye review

Ready: 2026-11-08 copycheck missing 0 of 21 (Damon) and 0 of 14 (KANOA) (COPY-RULE): the room's meta now prints Hanzo's line whole ("2020 · CES launch and preorders" / "2015 · Crowdfunding and preorders"), its hairline moved to a lead-in rule; every picture Hanzo shows is referenced (13/13 Damon, 6/6 KANOA; the photos 404 in this sandbox and show their contour plates); chapter words still arrive with their sheet; taste OK, unique OK, parity 37/37 + 2/2 and 26/26 + 2/2, check.mjs 0 errors / 0 overlaps / no h-scroll on both members at 1470 and 375, reduced motion 0 running animations.

Verdict: 7/10
First complaint: "It shows me the same four numbers twice in a row, once in the black box and again straight underneath. Then it's six screens that all look the same: text on the left, a grey box on the right."

Build `70d1547e`. I walked two members, `/customers/damon-motorcycles/` and `/customers/kanoa/`, with Playwright (Chromium) video at 1470×801 and at 375×812 (isMobile, hasTouch). The desktop walk used wheel steps of 200px with 300ms dwells; the phone walk used 160px steps with 350ms dwells. I watched the first screen with no input at 0.3, 1 and 3s, then sampled it every 500ms for 12s. I dwelt 1.5s on each of Damon's six chapter scenes. Hovers were checked with a real Playwright mouse on the figures, crumb, hero ask, close ask, "Every launch →" and the next card, comparing computed style and pixels before and after. I pressed a figure, opened the next card (Morph) and went Back. I also ran a Tab crawl, reduced motion (desktop and phone), JS off (desktop and phone), a layout-shift observer, console capture and a tap-target audit, plus `parity.py` and `taste.py`. Remote hanzo.ai images are blocked here, so every picture shows its fallback, and the fallbacks are what I judged. Stills: `docs/review/customers-family/desktop-walk.jpg` (Damon, then KANOA) and `docs/review/customers-family/phone-walk.jpg` (Damon).

## What works
- **The arrival is authored.** The black room opens from a rounded card to full width (800ms), the name cuts in by line mask, and the Sigil contour drifts by itself. Something moves well inside 1s with no input.
- **The "Beyond" is real and good.** Pressing `$8.4M` travels the page from y 9113 to y 706, marks "$8.4M" in the lede sentence and sets `aria-pressed="true"`. The other figures point to their chapter ("↓ 01 · Before CES") or to the PDF. This is proof you can check, not decoration.
- **The scenes work as a pinned stage.** Six 100svh chapters wipe up over each other, scrubbed by scroll, each numbered "0N / 06" under its text. It reads like Apple's one-panel-changes stage.
- **The card-to-page open works.** Clicking the next card grows its plate to the full stage, "KANOA" carries across into the black room, and the ledger rises. Back returns to the same scroll (9003).
- **The page is clean on the measurable checks:**
  - Layout shift 0.0012 on desktop and 0 on phone, and the shift comes from the header's tools, not the page.
  - Reduced motion leaves 0 running animations after 3.5s at both sizes.
  - With JS off, 0 headings or paragraphs are hidden at both sizes.
  - Parity: Damon 37/37 text and 2/2 links; KANOA 26/26 and 2/2.
  - `taste.py` passes on both files, and nothing in `main` is under 44px on phone.
  - There is no hue, and no label sits above any h1 or h2 (the mono "2020 —— CES LAUNCH…" meta sits under the h1).
- **The scale has some rhythm.** The h1 starts at 84px and settles to 52 as you leave the room; the lede is 21px, the figures are 64px in Air weight, and captions and mono text are small.

## The 11 answers
1. **Does it sell in 5s, and does something move within 1s?** Something moves within 1s: yes. Sell: mostly. On desktop the name, year, kind and the ask read at once. But in this sandbox the fallback ledger arrives only after the cover request fails, at about 5.8s after navigation on desktop and about 5.3s on phone. Until then the room is a bare contour and a name. On phone, once the ledger lands it sits *above* the h1: a 64px "$8.4M" at y 132–387, then the 44px name at y 496. The first thing you read is a number, not who the customer is, and there are two big things on one screen.
2. **Does one thing come in as one goes out, or is it a document?** It comes in and goes out. The chapters are a real one-in, one-out stage. But the wipe edge passes straight through body copy: mid-wipe at 1470×801, "…$1,335 of spend sold 30+" runs into "propositions stayed on every page through checkout…" as if it were one paragraph (`desktop-walk.jpg`, row 3). The incoming text sits exactly where the outgoing text was, so the transition reads as text splicing, not as a sheet arriving.
3. **Does every section hold a real visual object?** With the pictures blocked, the objects are silver plates holding a Sigil contour and Hanzo's caption. That is honest, but it is 6 chapter plates, 1 report plate and up to 6 wall plates, all the same grey. The next-launch card and the lower wall tiles are bare grey with no contour, so the fallback is inconsistent. The figures row and the ledger are the only non-plate objects, and they repeat each other (see 4).
4. **Is there one ask, sticky in the header, with nothing floating, and does scale have rhythm?**
   - Ask: yes. One solid "The original case study (PDF)" in the room. The header takes the same label once the hero ask leaves, and the close repeats it with no second solid in the same viewport. On phone the shared slim bar shows at the bottom of the report screen without covering text.
   - Rhythm: weakened by repetition. The hero ledger lists `$8.4M · 541:1 · 60,384 · +3,752%`, and the very next section lists the same four at 64px again. `$8.4M` then appears a third time in the lede and a fourth in the report caption. That is the "too many repeats" James complained about.
5. **Does every hover and press answer, with no jumps?** Yes, with a real mouse. Pixels change on every control: the figure's rule line goes to ink and its arrow nudges; the crumb, both asks, "Every launch →" and the next card all change. There is 0px size change on any of them. Press scale is present. The next card's hover is weak to the eye because its picture is a bare grey plate.
6. **Overlap, font swap or layout shift anywhere?** No overlap at either size. The ledger (desktop 919–1311 × 379–701) is clear of the h1 (240–334) and the ask (405–457). No font swap was seen. Layout shift is 0.001. Two transient issues:
   - During the first 800ms on phone, the opening card's 32px inset clips the crumb's arrow and the "2020" meta at the left edge (they sit at 16px).
   - Mid-wipe text splicing (see 2).
7. **Which reference does it feel like, and is that reference's motion there?** Apple's pinned stage, where one panel changes: yes. synchronized.studio's card into page: yes. The anthropic.com launch, with benchmarks as hero figures: yes, through the 64px figures and the trace-to-source press. osply.co and hamol.studio's editorial asymmetry is thin: all six scenes use one composition.
8. **Is it different from its neighbours, with its own hero medium and signature?** Yes. A launch photograph in a black room, wiping chapter scenes and press-to-trace figures do not match the blog or /agents. Within the family, members differ by their figures and their Sigil seed only, which is acceptable for a template.
9. **Are all 18 parts covered?** The card has 18 `## N.` headings, each with a `Done here:` line. My spot-checks are under Card check below.
10. **Banned tells?** None found. There is no gradient text, no hue, no label above a heading, no button fading on hover and no cursor glow. The one risk is the "lazy look" of many identical grey plates in the fallback state.
11. **Is the copy untouched?** Yes: parity OK on both members, and the figures sampled during their rise only ever showed Hanzo's values.

## Card check
The card's format is correct: 18 `## N.` headings and 18 `Done here:` lines. Spot-checks against what I measured:
- **Ledger and hero positions: true.** Ledger x 919–1311, y 379–701 at 1470×801; phone ledger y 132–387, h1 496–590, ask 660–712. All matched exactly.
- **Reduced motion: true.** 0 running animations after 3s at both sizes.
- **Parity, taste and sized images: true.** Parity 37/37 and 26/26 with 2/2 links, `taste.py` OK, and 14/14 and 7/7 images carry width and height.
- **Layout shift: true.** Desktop 0.001, phone 0.000.
- **"0 console errors at both sizes": imprecise, not false.** Each load logs one hydration mismatch, and every one I traced came from the shared `FooterHTML` (`dangerouslySetInnerHTML` differs). That is not this page's fault. Each load also logs 7 or 14 `404` resource errors for the page's own pictures (for example `/customers/kanoa/athlete.webp`), which is the blocked-media exemption. The card should say this rather than "0".

No false claim was found, so there is no cap.

## Fixes (in order)
1. **Stop the figures repeating back to back.** The hero ledger and the figures row state the same four numbers one screen apart. Let the room hold one figure, the first (`$8.4M` / `$7M+`, Hanzo's lead figure), as its single big object, and leave the full set to the figures row with its trace-to-source press. On phone, put the room's object *below* the name and the ask, or drop it, so the first read is the customer's name, not a number above the h1.
2. **Break the sameness of the six scenes and fix the wipe splicing text.** Vary the composition across chapters: alternate the plate side, give one a full-bleed plate and one a narrow plate, and keep the last chapter text-only as now. Move or fade the outgoing scene's text before the wipe edge crosses it, so two paragraphs never read as one. When pictures are blocked, six identical grey boxes in a row read as a lazy template.
3. **Make the fallback consistent and on time.** Every plate should carry its Sigil contour, including the next-launch card and the lower wall tiles, which are bare grey now. Decide the "bare" hero state on a short timeout (for example, if the cover has not decoded by about 1.2s) rather than on the error event, which here arrives about 5s late and leaves the first screen without its object. Small items:
   - Give `$8.4M` the same source hint line its three siblings carry.
   - Keep the opening card's inset from clipping the crumb and meta on phone in the first 800ms.
   - The Tab stop on the closing ask lands below the fold (top 874 at 801 high) before the smooth scroll catches up.
