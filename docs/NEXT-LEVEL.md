# The next level: what no prompt asked for (James, 7 Nov: "think of the next level we are missing… across all pages… every single page unique")

hanzo.ai today is a set of good pages. The top 1% of sites feel like one continuous product: nothing jumps, every click
becomes the next thing, the site answers you, and no two rooms are alike. Below are the site-wide layers that do that. The
conductor builds them once in shared code. Each page then uses them in its own way, so the system is shared but no
experience is.

## Site-wide layers (shared code, built by the conductor)
1. **Morph navigation.** Every in-site click is a transition: what you clicked (a card title, a picture, a menu
   item) becomes the next page's hero, and the rest of the page turns like a sheet. View Transitions API, ~600 ms, falls
   back to instant. Pages mark their own `data-morph` source and `data-morph-target` hero. Model cards keep the WebGL opener.
2. **Generative identity (`<Sigil seed data />`).** A living contour field drawn from each page's own words and numbers.
   Same template, never the same picture: 544 model pages, 56 OSS repos and 37 cloud products each get their own. It moves
   slowly by itself, bends toward the pointer, freezes for reduced motion and pauses off screen.
3. **Phone, designed.**
   - A thumb bar with the page's own main action slides up after the hero.
   - Siblings swipe: model to model, role to role, document to document.
   - Sheets rise from the bottom.
   - Hit areas are 44px or larger.
4. **Contextual cursor (fine pointers only).** Over a card it says Open, over a film it says Play, over a rail it says
   Drag. The system cursor stays visible.
5. **The 404 is a room too.** A designed not-found page, with search over every page.
6. **Ask Hanzo, inline.** ⌘K answers in place, streaming from Hanzo's public chat endpoint and aware of the page you're
   on. If it can't reach the endpoint, it falls back to hanzo.ai/chat.
7. **Share cards.** Every page gets its own Open Graph image (build phase).

## Every page adds one thing hanzo.ai does not have (builders)
- Each page ships one "beyond the brief" feature that helps the visitor decide or understand, such as a calculator you
  drive, a playable demo, a comparison you can re-sort or a timeline you scrub.
- It is built only from Hanzo's own facts. Never invent a number. If a fact isn't on hanzo.ai, the feature can't use it.
- Name it in the page file's top comment as `Beyond:` next to `Signature:`.

## Unique means checked
- `python3 scripts/unique.py` fingerprints every rebuilt page from three things: its section sequence, its signature
  line and its first-screen layout.
- It fails when two top-level pages share a signature, reuse the same component file, or have near-identical section
  sequences.
- Family pages pass when their Sigil seed and their first-screen data differ.
