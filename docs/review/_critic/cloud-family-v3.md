# /cloud/* (42 pages, one template): James-eye review

Verdict: 5/10

First complaint: "These are all the same page with a different word on it. GPUs, Kubernetes, Evals: same black box, same gateway, payments-api, checkout-web, same 'a human signs a company into existence', same Google list, same 'Talk to us'. I said it's not just a template."

Reviewed: branch `claude/ecstatic-edison-nyv8vo`. `CloudProduct.jsx` at `b287a24`/`2106935` (the console now starts on the first screen); `cloudfam.css` with the owner's token-only working-tree edits at 14:52 UTC (files hash `adeb85e6398b`). The shared ask bar was measured at `2106935`.
Walked 7 Nov 14:20–14:55 UTC on the dev server, moving, at 1470×801 and 375×812. Members:
- Required: /cloud/gpus, /cloud/prompts (conversation console), /cloud/local (boot terminal).
- Spot checks: /cloud/kubernetes (a thin page: no lede, no features) and /cloud/logs (CLI-lines console with full content).
- Crossed into /cloud/evals through the finder.
Evidence: a scripted 16 s film, first-screen frame logs with pixel diffs, a per-screen idle log, hover and press probes, a solid-button and ask-bar probe every 400 px, a card-click film (0–1500 ms), JS-off and reduced-motion runs, contrast, font-floor and tap audits, and a data dump of all 42 pages from `cloudData.js`.
Proof: `cloud-family.jpg` (first screens of gpus, kubernetes, logs and evals, plus gpus on the phone).

## What the 42 pages actually differ by (measured from `cloudDoc()` for every slug)
- **Console:** 36 of 42 consoles show the identical four services (gateway Ready, payments-api Ready, checkout-web Building, docs-site Ready). 3 show the same conversation ("Add rate limiting to the payments API."), 2 print CLI lines, and 1 is /cloud/local's boot.
- **Repeated blocks:** 41 of 41 product pages carry the same full-screen genesis line ("A human signs a company into existence. After genesis, agents can run it."). All 41 carry the same 18-row Google Cloud finder; /cloud/local, which has no Google counterpart, carries it too. All 41 ask "Talk to us".
- **Thin pages:** 31 of 42 have no lede, no description and no features. What changes there is the h1, the Sigil seed, the sidebar's sibling list and the API path.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Mostly.
   - Desktop: the name is huge (167 px, leading 0.9), with the lede and "Talk to us" beside it. The Sigil field drifts and the agent prompt types within a second.
   - The console starts tipped back 24° like a lid, so the product UI's text reads skewed until you scroll 620 px, and only its top 350 px is above the fold.
   - On Prompts and Logs the console body is an empty black panel for the first 2–3 s, while the prompt types.
   - The server renders the full prompt, then the script wipes it and retypes from "R", so the text visibly blinks out.
   - Phone: the console is on the first screen and typing (good).
2. **One in, one out, or a document?** A document. Hero → Paste and ship → What it is (on 11 pages only) → genesis line → spec sheet → finder (18 rows, about 1.5 screens desktop, 3 on phone) → related → Band. There is no pinned scene, and nothing leaves as the next thing arrives. The only scroll effect is the stage settling flat.
3. **A real object in every section?** Yes, nominally: console, the prompt's route, a contour Sigil, Hanzo's silver mark, the silver spec card, the finder and the card Sigils. But four of them are the same contour drawing (hero, About, spec card, related cards), and the genesis line's "object" is the logo. /cloud/local's "Runs on your machine, too." block is a heading and a paragraph.
4. **One ask, sticky after the hero?**
   - Desktop: yes. "Talk to us" sits in the hero, then the bar ("GPUs · Talk to us →") from the first scroll, then the Band.
   - **Phone: no.** At `2106935` the bar never appears on /cloud/gpus or /cloud/kubernetes. Probed every screen with a 1.5 s settle: 0 bars. After the hero the header's "Try Hanzo" turns solid again and is the only ask, a different verb.
   - **Desktop, as the console passes under the header:** "Try Hanzo" goes solid in the dark header beside the console's solid white "Open in the console". On Paste and ship, the solid black "Copy" sits beside the bar's "Talk to us".
5. **Every hover and press answers, no jumps?** Yes, the best part of the template:
   - Hero buttons shift fill and press to 0.98, and the ask is magnetic.
   - Console rows ring and press to 0.99, and the siblings slide in their arrow.
   - Family pills invert. Related cards lift 6 px and grow their field.
   - Finder rows fill and press. "Copy" presses to 0.92. The pause control fills.
   Gaps: the crumb "Cloud" and the Band's "Source" have no hover.
6. **Overlap, font swap, layout shift?** No: CLS 0 on desktop and 0.006 on phone, h1 box steady from first paint, no sideways scroll. The bar sits over finder rows in the dark room, which is acceptable for a sticky bar.
7. **Which reference, and is its motion there?** apple.com, weakly: a lid opening on scroll. Nothing else from his list:
   - No pinned stage.
   - No headline cut-in (the h1 just appears).
   - No count-up (/cloud/local's 0.30s and 7s are static).
   - No scroll-speed marquee.
   - **No card that opens into its page.** A related card or a finder row hard-cuts through a white frame, and the old page's ask bar lingers on the new page for about 350 ms. The coverage file says the cards open into their page; they do not.
8. **Different from its neighbours?** No. /cloud/gpus, /cloud/kubernetes, /cloud/logs and /cloud/evals have the same layout, the same hero medium, the same signature, the same object (see proof) and the same section order. Only the word and the contour seed change. /cloud/local is the one real variant.
9. **All 18 parts covered?** No, see below. `docs/coverage/cloud-family.md` exists, but several of its claims do not hold.
10. **Banned tells?** No hue (0 saturated UI pixels; the only colour on the page is the shared footer's privacy toggle), no eyebrow over the h1, no gradient text, no green. Present:
    - Three cards in a row in Related.
    - Three equal columns of figures on /cloud/local.
    - A tracked mono-caps label under headings ("COMPUTE" under the repeated "GPUs" h2).
    - The silver-gradient spec card, which is close to a "plain box" with a sheen.
    - The label repeats the crumb: "Cloud / Compute ○ Compute", "Cloud / AI ○ AI".
11. **Copy untouched?** Yes. `parity.py`: gpus 45/45 and 13/13, prompts 30/30 and 11/11, local 27/27 and 2/2, kubernetes 36/36 and 13/13, memory 33/33 and 9/9. The finder's heading "Google Cloud → Hanzo" is a new composition of two Hanzo labels. It is borderline, and James should see it.

## Missing from the 18 parts (PLAN-COMPONENTS §2.1–2.18, measured)
- **2.1 Strategy:** one solid per viewport fails in two places (answer 4), and the phone has no sticky ask. Persona, Goal (`contact_sales_submit`) and CTA are in the header.
- **2.2 IA:** the crumb is visible (good), but the family label repeats its last word on every page without a status.
- **2.3 First impression:**
  - Morph is claimed, but the measurement shows a hard cut through white.
  - The h1 has no arrival.
  - The section rhythm is flat. The finder room is the same 18 rows on all 41 product pages.
  - The genesis line takes a full screen on all 41.
- **2.4 Conversion:**
  - `data-cta="cloud.hero"` is the same id on all 42 pages, not `<page>.<slot>`.
  - The Band's primary has no `data-cta`.
  - Paste and ship's "Copy" is a second solid.
- **2.7 Visual:** 0 hues (good). The product render is not crisp at rest: it is tipped 24°, so the console text is skewed on the first screen.
- **2.9 Motion:**
  - Idle log on /cloud/gpus: 10 of 14 desktop screens and 12 of 17 phone screens do not change without input. Everything after the hero is still except the wire dash, the genesis line's one-time weight change and the finder's scan.
  - 2 `setInterval`.
  - The prompt wipes and retypes after first paint.
  - Reduced motion is clean (0 infinite animations).
- **2.11 Mobile:** no thumb bar (answer 4). Taps are all 44 px or more and nothing scrolls sideways (good).
- **2.15 Catalogue (the cloud template row):**
  - "Openable features" is missing: the features are a static numbered list, on 11 of 42 pages only.
  - The plan's "consistent across 42" is met so literally that it breaks JAMES.md ("It's not just a template", rule 8).
- **2.17 States:** JS off is legible on all four checked (0 hidden runs). There is no error boundary around the Sigils (owner gap).
- **2.18 Measurement:**
  - Coverage claims that do not hold:
    - "cards open into their page"
    - "pages differ through their own console" (36 of 42 identical)
    - "the site's thumb bar carries the ask" on phones
    - "features you can open"
    - "one filled primary per screen"
  - `docs/LEDGER.md` does not exist.
- **§4 gate lines that fail:**
  - 2: no `PageHero` (kit); raw `.x-btn` hero asks.
  - 3: more than one filled primary per viewport in two places; `data-cta` missing on the Band and not per page.
  - 6: 375×812 has no sticky ask; LCP and INP not measured.
  - 7: no rubric scores.
  - 8: no ledger file.
  - Passing: 1, 4 and 5, one h1, no raw img/video/table, CLS ≈ 0, contrast and font floors clean.

## Fixes (in order)
1. **Break the template: give each group its own hero medium and signature, built only from the page's own words.** The breadcrumbs name 11 groups: Science 7, Web3 6, Compute 5, Infrastructure 5, Observe 5, AI 3, Security 3, Apps 3, Network 2, Data 1 and Dev 1. At minimum:
   - In the console, light the page's own product and its `api.hanzo.ai/v1/…` path as the service being walked, instead of "gateway" on 36 pages.
   - Where a page has a lede or features, put them on stage as the object: GPUs' "H100 / A100 / L40S" as a live rack, Logs' lines streaming.
   - Give each group a different first-screen layout (stage console / full-bleed terminal / giant API path / full-bleed Sigil), so neighbours differ.
2. **Stop repeating the same blocks on 41 pages.** Show the finder open only on the 18 pages that have a Google Cloud counterpart, with this page's own pair first and the rest collapsed. On /cloud/local and the other pages without a counterpart, take it off the screen; leave the text in the HTML only if parity requires it. Make the genesis line a quiet line above the Band instead of a full-screen statement.
3. **Phone sticky ask:** with the Ask owner, make "Talk to us" ride under the thumb on /cloud/* at 375 (0 bars measured at `2106935`), and keep the header's "Try Hanzo" outlined while it does.
4. **One solid at a time:** make the console's "Open in the console" an outline or text link, and make Paste and ship's "Copy" a quiet button.
5. **Open into the page:** related cards and finder rows must Morph into the destination hero (`data-morph-target` is already on `.xcf-band`). Use a 250 ms crossfade where the destination has no target (/machines). Remove the white frame and the stale bar. Then correct the coverage file.
6. **Stop the prompt blinking out:** render it empty with the ghost on the server and type into it, or keep the full text and sweep a caret across it. Never show it, wipe it and retype it. Start Prompts' and Logs' first turn or line under the typing, so the console body is never an empty black panel.
7. **Add one scroll scene that hands over:** pin the console while its rows hand over to the spec sheet (the API path flies from the console's footer into the spec card), so one thing leaves as the next arrives. Add the line cut-in to the h1.
8. **Small things:**
   - Show the crumb's last word once (merge "Compute ○ Compute" into one label, keeping the text in the HTML).
   - Align the related cards' titles (Containers sits 27 px lower because it has no description).
   - Count up /cloud/local's 0.30s and 7s once.
   - Use `data-cta="cloud.<slug>.hero"`, and add one to the Band.
