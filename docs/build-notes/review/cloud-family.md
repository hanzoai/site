# /cloud/* (42 pages, one template) — James-eye review
7 Nov, critic pass on `claude/modest-rosalind-d8d1e2` (dev server :4182), after `docs/review/_critic/cloud-family-v3.md` (5/10). Template: `components/pages/cloudfam/CloudProduct.jsx`. Members walked, one per first-screen variant: /cloud/gpus (stage, Compute), /cloud/local (stage, boot terminal), /cloud/prompts (wide, AI), /cloud/evals (path, Science), /cloud/secrets (field, Security). /cloud itself returns 404 here; it is not in `content/pages.json`. Walked moving at 1470x801 and 375x812 (phone: isMobile, hasTouch) with Playwright: frames at 0, 1 and 3 s with no input, wheel scrolls one screen at a time with a 1.5 s dwell, hover and press on every control in `main` on desktop, tap-size audit on phone. I measured CLS, horizontal overflow, fixed elements and console output.

Verdict: 6/10
Ready: 8 Nov, held up next to /api and /affiliate (James's new bar, no score). Walked gpus (stage), secrets (field), prompts (wide), evals (path) and local (boot): every member keeps its own first-screen variant and section order; this pass stops the family rows opening under a passing mouse (they open on click, tap or focus; CLS on gpus 0.156 to 0.000), keeps the Google Cloud light walking while in view, keeps an opened row's address on one line on phones and seats the Google Cloud room's words inside its card. copycheck missing 0 on all 42 members (one call, 8 Nov; cascading headings carry their text once, status chips and the session note as plain text); taste/unique OK; 0 console errors (also reduced motion), no overflow at 1470 and 375 (console tabs scroll inside the window). Not done from the fix list: per-group second scenes (fix 1), the pinned console-to-rows handover (fix 2) and card-to-page morphs (fix 6). Shared, not this page: headless Chrome reports no (hover: hover), so motion.mjs calls hover-media rules dead.

First complaint: "Better, it's shorter and the bits move. But GPUs, Secrets, Evals, Prompts: same black console, same list of rows, same 'Related capabilities', same black 'Talk to us' at the bottom. Different word, same page. And after the console nothing happens."

## What changed since v3 (measured)
- Four first screens exist: stage (gpus, local), wide (prompts: tab strip, conversation), path (evals: giant `api.hanzo.ai/v1/eval`), field (secrets: tall contour Sigil). The console now lights this product's own features (H100 / A100 / L40S; Versioned & environment-scoped) instead of the shared gateway project, which sits behind its "Example project" note.
- The genesis line is a quiet strip, not a full screen. The Google Cloud finder is gone from /cloud/local. Phone sticky ask works: the header turns "Talk to us" after the hero on gpus.
- The prompt no longer blinks out; its untyped part is faint from first paint.

## The 11 answers
1. **Sells in 5 s, moves within 1 s: yes.** Name, lede, solid "Talk to us", crumb; the console types the agent prompt and walks the feature rows within a second. On stage/field the console sits low, so only its top third is above the fold at 1470.
2. **One in, one out: no, a short document.** Hero/console → family rows that open in place → Google finder (where paired) → Related capabilities (list + one card) → genesis strip → black Band. Desktop is 5–6 screens; nothing pins and nothing hands over. Once the console finishes its 6–10 s run, every screen below it is still without input (per-screen pixel change after 1.5 s dwell ≈ 0 apart from scroll-ins).
3. **A real object in every section: yes.** Console, the rows' opened panel (a mini console), finder, Sigil card, Hanzo mark, Band with the API path chip.
4. **One ask, nothing floating; scale: yes on ask, flat on scale.** One solid per screen; header takes "Talk to us" after the hero on desktop and phone (/cloud/local: "Run it locally"). First screen still has header "Try Hanzo" solid next to the hero solid at t0 (shared). Scale: the path variant's giant endpoint is the only size moment; elsewhere the 52 px name, 26 px heads and the 64 px `01 / 08` figure repeat page to page.
5. **Hover and press: mostly.** Hero asks, rows, related list and finder rows answer. No hover change on "Source" (hero and Band) on any member, nor on the crumb "Cloud"; the console's window title and sidebar rows read dead in my computed-style probe on gpus/evals/secrets. Phone: console tabs and sidebar items are 39–43 px tall (below 44).
6. **Overlap, font swap, layout shift: clean.** CLS ≤ 0.0001, no overflow, h1 box steady.
7. **Reference: apple.com, weakly** (the lid settling flat). The rows-open is closest to synchronized.studio but opens in place, not into the page. No pinned scene, no count-up (/cloud/local's 0.30s and 7s still static), no scroll-speed marquee.
8. **Different from its neighbours: partly.** The four variants differ in the first 400 px; below that every member is the same sequence and the same objects. Path (evals) is the most distinct; stage and field look alike at a glance (secrets is gpus with a bigger contour).
9. **18 parts: card 18/18** (`docs/coverage/cloud-family.md`). Claims mostly hold now. Not held: "every row and tab answers" (Source, crumb), taps "all 44 px or more" (phone console tabs 39–43). Hydration-mismatch error on every load (diff in `<Head>`, shared; not counted).
10. **Banned tells: none hard.** Monochrome; no eyebrow over the h1; no gradient text. Mono-caps labels sit under headings (allowed).
11. **Copy: untouched.** `parity.py`: gpus 45/45 & 13/13, local 27/27 & 2/2, prompts 30/30 & 11/11, kubernetes 36/36 & 13/13.

Tools: `taste.py CloudProduct.jsx` OK. `unique.py`: OK for the family (exit 1 only for Contact.jsx).

## Fixes, in order
1. **Make below-the-hero differ by group, not only the first screen.** Each variant should carry its own second scene: Compute a rack of the page's own accelerators, Security the secret moving through IAM → KMS → Audit, Science the eval scorecard, AI the conversation continuing. Same rows/related/band order on 42 pages is still the template James rejected.
2. **One scene that hands over.** Pin the console while its feature rows hand over to the family rows (the lit row becomes the opened row), so one thing leaves as the next arrives.
3. **Something alive after the console.** An idle loop in the rows (the open row's mini console keeps walking), and count-ups for /cloud/local's 0.30s and 7s.
4. **Pull the console up.** On stage and field, at least half the console above the fold at 1470.
5. **Taps and hovers.** Phone console tabs and sidebar to 44 px; hover on "Source" (arrow nudge) and the crumb.
6. **Open into the page.** Related cards and finder rows should morph into the destination hero (v3 measured a hard cut; not re-filmed this pass).
