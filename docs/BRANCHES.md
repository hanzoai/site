# Branches

**`main` is the one that matters.** Once the release is approved, `hanzo-handoff` is merged into `main` (pull request #57),
and `main` is the version Hanzo receives. Every other branch is history from the design work. Nothing has been deleted;
any branch can be removed once Hanzo no longer needs it.

| Branch | What it is |
|---|---|
| `main` | **The release.** What Hanzo should build and deploy. |
| `hanzo-handoff` | The release candidate, merged into `main` when approved. Next 16, the new home page, dark mode checked on 152 pages, copy checked against live (148 of 152 match; the other 4 are rotating demo feeds). |
| `release-prep` | This README, release notes and this file (merged into `hanzo-handoff`). |
| `zack-pages-1`, `zack-pages-2`, `zack-pages-3` | Page redesigns and the sign-up and checkout pages (pull requests #65, #66, #64). Merged into `hanzo-handoff`. |
| `home-journey-swap` | The home layout that ships: models as a card grid, products as the 3D scroll journey (pull request #67). Merged into `hanzo-handoff`. |
| `dark-g1`, `dark-g2`, `dark-g3` | Dark-mode proof screenshots and small follow-ups. Not merged; kept for reference. |
| `home-wow`, `home-models-journey`, `home-platform-dock`, `feat/buying-ctas` | Already merged into `hanzo-handoff`. |
| `claude/*` | Working branches from individual design sessions (listed below). |

## Working branches (`claude/*`)

"Merged" means every commit on the branch is already in `hanzo-handoff`. Unmerged ones are earlier drafts whose
work was redone or superseded on the release line; they are kept for reference only.

| Branch | Last commit | Merged | Last commit message |
|---|---|---|---|
| `claude/elegant-thompson-z9jhls` | 2026-11-07 | yes | /newsletter to MASTER: no label above the h1, paper sets its lines once, statem |
| `claude/elegant-johnson-b2vx1q` | 2026-11-07 | yes | Cloud 3: /node and /s3 demos run once and rest (MASTER §4.1), play replays; /n |
| `claude/laughing-hamilton-uisesd` | 2026-11-07 | yes | Cloud 4: 18-part coverage cards for all ten pages; targets 44px, code pane held |
| `claude/loving-gates-q42aa8` | 2026-11-07 | yes | Families A kit: the h1's big arrival is CSS (first paint), scroll shrinks it to |
| `claude/youthful-gauss-hiiqm9` | 2026-11-07 | yes | Legal: two-phase deal, pile inside its sheets, index arrives once, opaque chips |
| `claude/hopeful-hypatia-np2x02` | 2026-11-07 | yes | Machines: MASTER.md rework, 18-part coverage card, new gallery |
| `claude/great-ptolemy-2vwfny` | 2026-11-07 | yes | Merge branch 'main' of https://github.com/jamessburnss1313-dev/hanzo-site into  |
| `claude/inspiring-cray-gv14a3` | 2026-11-07 | yes | Merge branch 'main' of https://github.com/jamessburnss1313-dev/hanzo-site into  |
| `claude/intelligent-darwin-49xfpw` | 2026-11-07 | yes | Merge branch 'main' of https://github.com/jamessburnss1313-dev/hanzo-site into  |
| `claude/friendly-mccarthy-g2d3no` | 2026-11-07 | yes | Merge remote-tracking branch 'origin/main' into claude/friendly-mccarthy-g2d3no |
| `claude/quirky-cannon-cuf24w` | 2026-11-07 | yes | Merge remote-tracking branch 'origin/main' into claude/quirky-cannon-cuf24w |
| `claude/kind-bell-zqjnz2` | 2026-11-07 | yes | Models: fix critic complaints on /models and the model pages |
| `claude/keen-archimedes-q0ieu8` | 2026-11-07 | yes | Morph: the card's title flies onto the page's headline; stage keeps the card's  |
| `claude/ecstatic-edison-nyv8vo` | 2026-11-07 | yes | Platform + Cloud: keep the previous critic reviews (v3) beside the pages' revie |
| `claude/nice-archimedes-wxkcav` | 2026-11-07 | yes | V2 /operator: MASTER rework (deck scale, kit Cta and Band, pause control, no in |
| `claude/owner-ga-fixes-c581ca` | 2026-11-07 | yes | agents: Ready — five steps take the stage on scroll with typed requests, clic |
| `claude/gracious-bardeen-tfpl5f` | 2026-11-07 | yes | feat(agents): critic fixes and MASTER rhythm: steady hero, Koma uncovered and p |
| `claude/laughing-feynman-6p5479` | 2026-11-07 | yes | fix(blog): critic round 2 (working pause, phone plate and strip, count moment,  |
| `claude/modest-pascal-189fh2` | 2026-11-07 | yes | fix(open-source): lists arrive as soon as their top is in view (long phone list |
| `claude/upbeat-euler-kz3ufu` | 2026-11-07 | yes | fix(team): re-review fixes: nine channels sized to content with bugfix the one  |
| `claude/peaceful-goodall-8no2gm` | 2026-11-07 | yes | fix(v2): KeynoteOpen returns focus on Esc and keeps Tab inside; details hidden= |
| `claude/inspiring-lamport-6re0ay` | 2026-11-07 | yes | fix: /compare/* phone race as a compact 2x2 grid, the ask above the 667px fold |
| `claude/fervent-cannon-t8iwda` | 2026-11-07 | yes | fix: revert seven half-pushed page files (chat, crawl, ide, jin, koe, models, s |
| `claude/intelligent-meitner-k002n5` | 2026-11-07 | yes | re-review: /tunnel 5/10 after the system merge (phone scene collapses to 0px, d |
| `claude/compassionate-meitner-8hqzwh` | 2026-11-07 | yes | refs(lab 2): darkroom and locomotive SPECs, ranked pattern library in INDEX |
| `claude/great-bell-2cu3te` | 2026-11-07 | no | refs: INDEX summarising all references, measured values and moves by page type |
| `claude/trusting-mendel-ina4jb` | 2026-11-07 | yes | review: /newsletter 5/10 (no card; labels over headings; three equal big steps) |
| `claude/youthful-brahmagupta-qf247a` | 2026-11-07 | yes | review: /press 6/10 (dealt kit hero, then grids of equal tiles) |
| `claude/inspiring-edison-69biit` | 2026-11-07 | yes | v2.1(design): follow the shared ask (drop data-ask off); synth pads keep their  |
| `claude/focused-wright-mtcf6g` | 2026-11-07 | yes | wip(integrations): motion map in progress: h-gallery signature (scroll drives t |
| `claude/magical-cray-ncal9y` | 2026-11-07 | yes | wip(koe,learn,ledger,legal,mcp,metrics,models): motion-map pass stopped mid-way |
| `claude/confident-ritchie-odp1wg` | 2026-11-07 | yes | wip(motion map): builders stopped mid-way (usage limit); features, grants, hist |
| `claude/jolly-albattani-kyc47n` | 2026-11-07 | yes | wip(motion map): chat, agents, blockchain, blockchain/*, benchmarks/*, cloud/*  |
| `claude/quirky-meitner-lqqf03` | 2026-11-07 | yes | wip(motion-map): signature rebuilds stopped mid-edit for usage limit (skills, s |
| `claude/bold-edison-jfmftq` | 2026-11-07 | yes | wip: motion-map builds stopped mid-way (usage limit): telemetry, treasury, tunn |
| `claude/wonderful-euler-gszsee` | 2026-11-07 | yes | wip: motion-map pivot in progress, stopped for usage limit (signatures and entr |
| `claude/laughing-franklin-fhk352` | 2026-11-07 | yes | wip: motion-map signatures and entrances in progress (stopped mid-build for the |
| `claude/sharp-fermi-16j439` | 2026-11-07 | yes | wip: motion-map signatures and entrances in progress on mori, network, newslett |
| `claude/upbeat-einstein-0ax47d` | 2026-11-07 | yes | wip: motion-map signatures and entrances, builders stopped mid-work (usage limi |
| `claude/charming-babbage-cpkqes` | 2026-11-07 | yes | wip: motion-map signatures and entrances, mid-build (stopped for usage limit) |
| `claude/tender-euler-32wfl2` | 2026-11-07 | yes | wip: motion-map signatures in progress (stopped for usage limit) |
| `claude/jolly-albattani-67qjyu` | 2026-11-07 | yes | wip: stop for usage limit; motion-map rework mid-edit on gui, gateway, guard, h |
| `claude/youthful-knuth-h83kes` | 2026-11-07 | yes | wip: unfinished motion-map signatures and entrances for my 11 designs (stopped  |
| `claude/modest-rosalind-d8d1e2` | 2026-11-08 | yes | dark mode: the home scroll gets light and rhythm (soft top glow per section, al |
| `claude/rebuild-slice-b-5900a7` | 2026-11-08 | yes | dev: Latest release read from GitHub at build (server), not in the visitor's br |
| `claude/owner-ga-fixes-544845` | 2026-11-08 | yes | enso, models: Hanzo's overnight lines (live hanzo.ai, captured by the conductor |
| `claude/rebuild-slice-b-5606f6` | 2026-11-08 | yes | extension: dark mode — the drawn browsers wear their dark theme, panel, tools |
| `claude/rebuild-slice-c-af5376` | 2026-11-08 | yes | gallery: dark mode side by side with live hanzo.ai (kms, iam, investors), 1470x |
| `claude/rebuild-slice-c-5f4f3c` | 2026-11-08 | yes | o11y: dark mode — live's hero halftone (HeroDither) under the hero in dark; c |
| `claude/rebuild-slice-d-6af712` | 2026-11-08 | yes | realtime: last dark half a Hanzo token |
| `claude/rebuild-slice-d-1cda51` | 2026-11-08 | yes | skills: dark — dot field fades at the hero's foot |
