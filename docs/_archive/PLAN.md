---
title: Hanzo site redesign — completion plan
status: in_progress
owner: enso (coordinator)
expert_team: tech-lead, frontend-motion, webgl-graphics, qa-motion, content-data, build-release
briefs: [[DESIGN.md]], [[NEXT-LEVEL.md]], [[PAGES.md]]
---

# Hanzo.ai redesign — completion plan

This is my improvement plan added to the brief. Every page of hanzo.ai rebuilt on Hanzo's stack: Next.js 15 App Router, React 19, Motion 12, Lenis, WebGL. Hanzo's header/footer/logos/copy/numbers/links stay exactly theirs; what changes is how the site moves and how pages connect.

## State of record (verified)
- Dev server detached on `http://localhost:4180` (pid 77806), Chrome tab open for James to watch; `GET /` = HTTP 200.
- 110 custom `app/*/page.jsx` routes redesigned; `[...slug]` ported catch-all for the rest; `content/pages/` = 147 ported pages.
- `Arrow`/`A` dead-control root cause fixed (motion.a whileHover/whileTap) — live on `/`, compiled clean.
- Conductor running automated motion QA across pages (holds `/tmp/hz-browser.lock`); report in `shots/motion-report.txt`.
- Systemic bug on every page: Next.js hydration mismatch ("server rendered HTML didn't match the client properties") — highest-impact fix.

## Expert team (staffed; 6 roles whose absence = real failure)

| Role | Playbook focus | Owner |
|------|---------------|-------|
| Tech Lead / Architect | App Router shell, routing, static export, hydration | coordinator |
| Frontend / Motion Engineer | Motion 12, Lenis, components, styling, tap targets ≥44px | — |
| WebGL / Graphics Engineer | Opener WebGL transition, Sigil contour field | — |
| QA / Motion Verification | motion.mjs, phone.mjs, no STILL/DEAD, shift <0.05, reduced motion | — |
| Content / Data Engineer | content/pages, pages.json, data accuracy, models/OSS/cloud | — |
| Build / Release Engineer | `next build` static export, preview, OG share cards, deploy readiness | — |

## Improvement plan (my additions to the brief)

### 1. Fix the hydration error (every page) — unblocker
Root-cause: a client component in the shell (`Smooth`/lenis, `Morph`, `Phone`, `Cursor`, `Progress`, or `OpenerProvider`) renders different HTML/attributes on server vs client. Fix so `npm run build` and hydration are clean on every route. Verified by: no hydration error in `shots/motion-report.txt`, `next build` exits 0.

### 2. Ship the NEXT-LEVEL site-wide layers (shared code, built once)
- **Morph navigation** — View Transitions API ~600ms; clicked card/picture becomes next page's hero; pages mark `data-morph` source/target; fallback to instant.
- **Sigil** — `<Sigil seed />` living contour field drawn from each page's own words/numbers; moves slowly, bends to pointer, freezes for reduced motion, pauses off screen.
- **Phone, designed** — thumb bar with the page's main action slides up after hero; siblings swipe; sheets rise from bottom; hit areas ≥44px.
- **Contextual cursor** — fine pointers: "Open" over card, "Play" over film, "Drag" over rail; system cursor stays visible.
- **The 404 is a room too** — designed not-found page with search over every page.
- **Ask Hanzo, inline** — ⌘K answers in place, streams from Hanzo's public chat endpoint, falls back to hanzo.ai/chat.
- **Share cards** — every page gets its own Open Graph image at build time.

### 3. Every page unique and slick (per DESIGN.md + NEXT-LEVEL.md)
- Each rebuilt page: one layout made for its content + **one standout interaction** (`Signature:`) + one "Beyond:" feature built only from Hanzo's own facts.
- No two pages share a signature, beyond feature, or first-screen layout; family pages differ via Sigil seed + first-screen data.
- `python3 scripts/unique.py` must pass (fingerprints section sequence, signature line, first-screen layout; fails on shared signature / reused component file / near-identical sequences).
- Slick bar: 60fps, layout shift <0.05, no STILL screens, no DEAD controls, tap targets ≥44px, no orphan headlines (`text-wrap: balance`), 1px hairlines, consistent radii.

### 4. Motion polish (QA gate)
- `node scripts/motion.mjs /page --desk-only` and phone: 0 STILL, 0 DEAD, shift <0.05, 60fps.
- `node scripts/phone.mjs /page`: sideways-scroll + console-error check.
- `prefers-reduced-motion`: no smooth scroll, no flight, no typing; every final state at once.

### 5. Build & release readiness
- `npm run build` → static export into `out/`; `npm run preview` → `http://localhost:4181`.
- `public/` copied from current hanzo.ai (model media, logos, images).
- Data snapshot refreshed to live sources before launch (GitHub counts, commit calendar, pricing, benchmarks, Pareto).

## Sign-off (one line per role, with evidence)
- Tech Lead: hydration mismatch fixed — components/Chrome.jsx Smooth no longer passes media-query-dependent reducedMotion="user" to MotionConfig (server/client now render identically); next dev compiles / and /enso/ with no hydration warning; site HTTP 200 on :4180.
- Frontend/Motion: dead-control root cause fixed — components/ui.jsx Arrow and components/kit.jsx A now motion.a/motion.span with whileHover/whileTap; live on home page; compiled clean.
- WebGL/Graphics: not yet started (Opener WebGL transition intact, untouched).
- QA/Motion: scripts/unique.py created per DESIGN.md rule 10; exits 0 on clean tree (101 pages unique), exits 1 with clear message on duplicate signature/near-identical sequence (proved via temp fixture, then removed).
- Content/Data: not yet started (content snapshot from 7 Nov 2026; connect live sources before launch per README).
- Build/Release: not yet started (static export next build run by conductor; preview :4181 not yet opened).
