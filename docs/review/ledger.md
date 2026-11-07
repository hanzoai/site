# /ledger: James-eye review

Verdict: 6/10
First complaint: "The top is right now: the ledger moves and it's all grey. But as soon as I scroll there are two 'Read the docs' buttons stuck on top of each other at the bottom. It looks broken. In the black section the first tab is just an empty pill, and 'See the request' opens in green, blue and yellow."

Reviewed: main @ `069c088` (last page commit `4e4b1b1`). Files hash: `506a34f8904e`
Walked 7 Nov 14:16–14:18 UTC on the dev server, moving, at 1470×801 and 375×812 (videos, frame sheets and a frame-difference motion log kept by the critic; the site loader was skipped).
Proof: `img/ledger.jpg` (desktop first screen | phone first screen).

## Since the last review
- **Done: the emerald, the red and the eyebrow.** No hues on the page at either width (it was emerald and red). Nothing sits above the h1 (it was the 23px "DOUBLE-ENTRY LEDGER" label). **Still open:** the "See the request" sheet. Its code has green strings (#1a7f37), blue keywords (#0a58ca) and a yellow highlight on the Idempotency-Key line (phone film at 26 s). The walk's hue count missed it because the sheet was open for only about a second.
- **Done: the book is on the first screen at both widths.** At 1470×801 the whole book sits beside the title: four balances (−10,000 / 0 / 9,500 / 500), the journal and the note. At 375×812 it starts at about 450px with all four balances above the fold. On phone 21 of 25 frames move in the first second.
- **Half done: one ask.** "Read the docs" is now the solid button in the hero, the phone bar and the close. "GitHub", "View on GitHub" and "Deploy to Cloud" are text, and there are 3 `data-cta`. But on desktop the page's own sticky pill sits on top of the site's ask bar. That makes two fixed, solid "Read the docs" buttons at y 726 and 734 on every screen from s2 to s8, a few pixels apart, so the edges of both show. At the close (s9) the site's bar steps aside, but the page's pill stays on beside the close's own solid button.
- **Done: buttons answer, pause, coverage.** The hero's "Read the docs" now answers on hover and presses to 0.98 (it was dead). The book has a 44px pause button (`aria-pressed`), and the tap works on phone. No phone targets are under 44px now (before: 21px links and a 40px chip). `docs/coverage/ledger.md` exists, and the header has Persona, Goal and CTA.
- **Half done: the dark room.** Each capability now has an object: the Numscript with its result, "10000 USD/2 → 100.00 USD", and the balances list. Tapping "USD/2" switches to it. But the selected tab is invisible. Its pill never draws, so "send" measures 1.2:1 and looks like an empty outline at both widths, and its hover is dead.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes, now.
   - Desktop: everything fits inside 801: "Hanzo / Ledger" at 96px (line height 0.92), "A double-entry ledger you post to over HTTP.", the ask, and the live book beside them.
   - The title cuts in by line mask (5/25 moving frames in the first second). Then the book posts by itself (15/45 moving frames in the rest of the 3 s): new money from world, the split as one transaction, an overdraft "refused whole", then "Nothing is edited" with the sha256 chain and the reversal.
   - Phone: title, line, ask and the book's four balances are all on the first screen, with 21/25 moving frames in the first second.
2. **One in, one out, or a document?** Mostly one in, one out. The hero book leads into "Every cent lands somewhere" and its three pinned chapters (01–03, one lit at a time, with a progress line). Then come the dark room's tabs and the splitter. On phone the three chapters swap in turn: the posting with a dot running down the arrow, the chain, then the retries. The close is still a block of text: "Get Ledger", two chips, "Get started with Ledger", "Paste and ship", an agent prompt and the "Deploy to Cloud" row.
   - Evidence caveat: the desktop film froze from about 10 s to 19 s and again from 22 s to 27 s, while the page kept changing underneath. Each stop logged 18–55 DOM changes, and the sticky bar measured on at s1 but does not appear in the frames.
   - So the STILL readings at desktop s1, s2 and s4 come from the recording, not the page, and chapter 01 was never filmed lit on desktop.
   - Every phone screen moves, down to the footer.
3. **A real object in every section?** Yes, apart from the close.
   - Hero: the book.
   - Chapters: the posting (source → destination, 9500, USD/2, Σ 0), the chain (tx 1–3, "sha256 of tx 2") and the retries ("the original — tx 2", "different postings — caught", "1 transaction 2, posted once").
   - Dark room: one object per tab.
   - Numscript: the splitter, which rewrites the postings and the Numscript as you drag. 95% → 75% gave 7,500 / 2,500 at both widths.
   - Close: only the shared agent prompt box.
4. **One ask, sticky after the hero?** The verb is right, but desktop doubles it.
   - Phone gets it right: the thumb bar carries "Read the docs" from s2 to s7 and steps aside for the close's button at s8.
   - Desktop, s2 to s8: the page's pill ("Hanzo Ledger | Read the docs") sits over the site's own ask bar (search icon + "Read the docs →"). Both are fixed, both are solid, both sit bottom centre.
   - With the header, that makes three fixed layers. PLAN 0.9 allows two.
   - At s9 the site's bar steps aside for the close's button, but the page's pill stays on next to it.
5. **Every hover and press answers?** Mostly.
   - Hero "Read the docs": the hover answers, and it presses to 0.98.
   - "GitHub": the hover answers, and it presses 1px.
   - Pause: it lifts 1px on hover, which the walker logs as a jump (it is the lift, not a layout move), and presses to 0.94.
   - "Σ users:*": the hover answers, and it presses to 0.98.
   - "See the request": the hover answers, it presses to 0.97, and the sheet rises on phone.
   - The chips, "View on GitHub" and Copy answer (Copy presses to 0.92).
   - Dead: the selected tab "send" (no hover, and its label is gone) and the amount field (no hover).
   - Nothing follows the pointer: no magnetic ask, no tilt, no hover preview (JAMES rule 9).
6. **Overlap, font swap, layout shift?**
   - The two sticky asks overlap each other on desktop. They are fixed, so the overlap count misses them, but a crop of the film at 32 s shows two pills, one behind the other.
   - At s9 the page's pill also sits on top of the "Get started with Ledger" heading.
   - CLS is 0 at both widths, the h1 box is steady (one reading each), and there is no horizontal scroll at 375 or 320.
7. **Which reference, and is its motion there?**
   - apple.com product page: yes. The product is the hero and the chapters pin.
   - motion.dev: the balances roll on a spring and the sheet rises. The gliding pill (layoutId) is in the code but never draws.
   - synchronized.studio card-open: absent.
   - anthropic launch: the balances are big, but there is no hero figure.
8. **Different from its neighbours?** Only the hero is its own now.
   - The book beside the title is not /telemetry's strip on the fold, and /metrics (same commit) has moved to a one-line title over a full-bleed chart.
   - Everything after the hero is the shared Business 1 kit:
     - the same `BizChapters` (stage left, 01/0N right, progress line) as /payments, /console, /flow, /dataroom and /captable;
     - the same "Hanzo X | ask" pill as /payments, /flow, /console, /jin and /captable;
     - the same two-line `bz-display md` "Hanzo / X" title as /dataroom;
     - the same "Get X" close (licence chip, hanzoai chip, Paste and ship, Deploy to Cloud row) as every Cloud page.
   - James: "It's not just a template."
9. **All 18 parts covered?** No; see below. The coverage file exists now, but two of its claims fail the walk.
10. **Banned tells?** Yes:
    - UI hues in the "See the request" sheet: green strings (a green accent), blue keywords and a yellow highlight.
    - Two buttons overlapping: the stacked sticky asks on desktop.

    The page itself is clean: no hues, nothing above the h1, no opacity-only hover, no title tooltips, no sound.
11. **Copy untouched?** Yes. Parity is 55/55 text and 3/3 links. The 26 added strings are demo data (accounts, amounts, hashes, Numscript) and labels. The closest to a new sentence is the splitter's "10,000 in USD/2, the smallest unit: whole numbers, nothing rounds on the way in". It repeats Hanzo's own sentence from the "USD/2" tab and adds no claim or number.

## Missing from the 18 parts (PLAN-COMPONENTS §2.1–2.18, measured)
- **2.1 Strategy / 4 Common gate:** two solid buttons per desktop viewport from s2 to s9 (the stacked bars, then the pill beside the close). The metric id sits inside the Persona line ("metric docs_click"), not on its own line, so the check finds none. There are 6 raw `.x-btn` uses, which gate line 2 bans.
- **2.3 First impression:** with JS off, 12 text runs are hidden, all of them rows in the chapter 02 and 03 scenes (the chain and the retries). Hanzo's own words all show (before: 15 hidden, the lede among them). The close is not a `Band`.
- **2.4 Conversion / 0.9 Sticky layers:** desktop shows the header plus two fixed ask bars (the plan allows the header plus one). The page's `AskBar` does not step aside for the close's button.
- **2.6 Content:** 22 text runs at 13px on phone ("source", "destination", "amount", "asset", "01"), under the 14px floor. On desktop, "Agent prompt" and "Copy" are 12.5px.
- **2.7 Visual system:** the sheet's code colours and its yellow highlight break the 0-hue override.
- **2.8 Components:** 14 bare `:hover` rules (before: 10). The selected capability tab has no hover and no visible state. The amount field has no hover.
- **2.9 Motion:** nothing answers the pointer (rule 9). The shared Frame file has 2 `setInterval` timers. Reduced motion settles (0 running after 3 s).
- **2.11 Mobile:** on phone the chapter stage pins at the top while the chapters scroll under it. The plan says no big sticky at 900px and under: stack them. At 375 the code panes in the dark room and the splitter are cut at the right edge ("@merchants:(").
- **2.12 Accessibility:** the selected tab's label "send" measures 1.2:1.
- **Coverage:** `docs/coverage/ledger.md` exists, but two of its claims fail. It says "one solid button per screen" (desktop shows two) and "text is 14px or larger" at 375 (22 runs are 13px).
- Passing: one h1, visible with JS off; one main; CLS 0 at both widths; no horizontal scroll at 320; no tiny targets; 0 title tooltips; 3 `data-cta` and 1 `data-thumb`; no raw img, video or table; a pause control on the book; an empty-amount state on the splitter; parity 55/55.

## Fixes (in order)
1. **One sticky bar on desktop.** Delete `<AskBar>` from `Ledger.jsx`. The site's ask bar already carries "Read the docs" from the hero's `data-thumb`, and it already steps aside for the close's button (it did at s9). The page's pill is the one that stays on.
2. **Take the colour out of "See the request".** Drop the `mark` prop, or scope `.ld .cf-mark` to a grey wash (`--hz-100`). Set `.ld .cf-code.light .s` and `.k` to ink and grey, and let weight tell them apart.
3. **Draw the dark room's pill.** The rule `.ld-caps-tabs button span { position: relative }` also catches the pill and collapses it. Scope it to the label (`button > span:not(.ld-caps-pill)`). Then the white pill shows and glides, and "send" reads black on white. Give the selected tab a hover.
4. **Make the hero answer the pointer.** Hovering a journal row lights the accounts it touched (the `hot` state already exists), and hovering an account lights its postings. That tells the visitor something and needs no new words.
5. **Floors and hovers.** Raise the phone chapter labels and the "01 / 03" meta to 14px, and "Agent prompt" and "Copy" to 13px. Wrap the 14 bare `:hover` rules in `@media (hover: hover)`.
6. **Stack the chapters on phone.** Under 900px, render each chapter's own scene above its text instead of pinning one stage on top. Every word and scene stays.
