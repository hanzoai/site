# /registry: James-eye review (independent walk, 7 Nov, third pass)

Verdict: 8/10
First complaint: "That's a proper page now. The push runs on its own, the stack does something on every step. Only thing: by the end it's the same little stack of squares again, and the related bit is three grey boxes in a row."

Walked moving at 1470×801 (hover-capable Chromium) and 375×812 (touch), cookie bar dismissed, frames about 1 s apart on the first screen, wheel-scrolled with a layout-shift observer and video. `parity.py /registry`: OK, text 69/69, links 12/12. Proof: `img/registry-hero.jpg` (hero at rest, pinned intro), `img/registry-tail.jpg` (related row on hover).

1. **Sells in 5 s, moves within 1 s?** Yes. h1 "Hanzo Registry" at 52px, lede and the one solid "View Source" sit right of a two-pane window; within the first second the `docker push` line is highlighted and the 401, token, signature and layer bars play out in about 9 s untouched, then rest on the signed image with a blinking caret and a Replay control. On phone the h1, lede and ask fit by y=430 and the terminal starts running in view.
2. **One in, one out?** Yes. Hero → dark room (one switch) → pinned stage where one big layer stack changes per fact (token seats, org inks the top plate, signature and attestation dock, /v2/ at 64px, a tag slides out as the storage bar shrinks, people fold into one directory) → a registry console → related → close. Each screen has one new idea; nothing reads as a document.
3. **Real visual in every section?** Yes: the push window, the terminal plus the swap ledger, the isometric stack, the console with a building image, drawn related art, the close's Sigil card. No Hanzo media exists for this product, so no 4-up media block applies.
4. **One ask in the header, nothing floating; scale rhythm?** Desktop: one solid fill per viewport throughout; the header carries "View Source" once the hero ask leaves view (outlined while the hero's is on screen). Nothing floats over content. Scale has rhythm: 52px h1, 32px chapter heads, the 64px /v2/ figure only while it is the moment, 13–14px mono labels. Phone: see shared-chrome note (header stays "Try Hanzo" solid next to the page's solid "View Source").
5. **Every hover and press answers, no jumps?** Yes. Measured: hero ask darkens and presses to 0.97; push steps highlight and show that moment on hover (tap on phone); pause/Replay fill and press; the swap switch slides, strikes the heading and wipes IAM's phrases in row by row; Quickstart fills white; console rows fill and outline, icons show a tip, "Open in the console" fills ink; related cards fill and their art spreads; rail buttons press. No geometry change on hover anywhere.
6. **Overlap, font swap, layout shift?** None owned by the page. Total CLS under 0.001 on both sizes (largest entries are the shared header's icon row and `rg-rc-path` at 0.0003). No horizontal scroll at 375. Phone on-object labels sit beside the stack, not on text.
7. **Reference and its motion?** apple.com product page: the product as hero, a pinned scrubbed scene where one object changes, a persistent header ask. The pin actually holds and steps through six states; the dark room's state switch is the one authored "state" moment.
8. **Different from neighbours?** Yes in hero medium (a live push window, object-left) and signature (a push that asks IAM first). The tail uses the shared LaunchClose and a console frame that sibling cloud pages share, but its console is Registry's own (repositories opening into layers and tags).
9. **18 parts covered?** On what the page shows: one h1, one main, one solid ask with `data-cta`/`data-thumb`, pause and replay on the self-running demo, reduced-motion rules for every mover, 44px targets, `aria-pressed` switch, listbox console with keyboard, morph source on related cards. Nothing visibly missing.
10. **Banned tells?** No hue, no label above a headline (h1/h2 have no preceding sibling), no gradient text, no glow. One borderline: the related row is three tiles side by side (5fr/4fr/4fr, 434 / 347 / 347px) — reads as three boxes in a row.
11. **Copy untouched?** Yes: parity 69/69 text, 12/12 links; "Get Registry", the console caption and the agent prompt trace to `content/live/registry.json` and siblings.

Shared chrome (not counted against the page):
- Red "1 Issue" dev badge on both sizes: a hydration mismatch in the shared footer (`FooterHTML` `dangerouslySetInnerHTML`).
- Phone: the header ask stays a solid "Try Hanzo" all the way down while the page's ask is "View Source" (solid in hero, outlined bottom bar) — two solid fills and two different asks in the first phone screen. Desktop swaps correctly.
- Phone: 404 on one resource and font preload warnings.

Polish (not blocking 8):
1. Break the three-tile related row: make Projects a wide lead tile with Environments and Builds stacked beside it, or set the three as hairline rows with the art at the right.
2. Thin out the stack motif in the tail: the console's selected-image stack and the three related drawings repeat the hero's and the pin's stack; give the console a tag/digest list as its object instead of a fourth stack.
