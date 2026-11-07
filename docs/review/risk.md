# /risk: James-eye review (independent critic, 7 Nov)

Verdict: 7/10
First complaint: "The dial's great, it's alive. But I scroll once and there's a whole screen of nothing, and then the second half turns back into reading. Rules, platforms, plans: blocks of text side by side. One thing in, one thing out, remember."

Walked moving at 1470×801 (hover-capable Chromium) and 375×812 (touch). Frames were taken about 1 s apart on each screen, using a layout-shift observer and wheel scrolling. Every hover and press was measured. `parity.py /risk`: OK, text 114/114, links 7/7. `taste.py` on Risk.jsx/.css: OK. Console: 0 errors at both sizes. CLS: 0.0005 on desktop and 0.0012 on phone; all of it is header or text noise. No horizontal scroll at 375 or 320.

Proof: `img/risk-void.jpg` shows the screen right after the hero, about 450px of blank between the dial's caption and "Where this is today". `img/risk-reading.jpg` shows "Rules, lists and suppression" next to "Platforms and marketplaces": two h2s and their text blocks in one viewport.

## The 11 answers

1. **Sells in 5 s, moves in 1 s?** Yes. The h1 cuts in by line mask and the dial settles on arrival. Within about 2 s the dial is deciding on its own: it steps through the stages, swings the needle, rolls the action word and resizes the reason bars. It has a pause control. The h1, the ask and the decision read at a glance. The hero does a lot: a 52px h1 plus "summon a person" at about 44px with an ACTION label over it, so two big type objects compete in one screen.
2. **One in, one out, or a document?** It's half and half. The hero and the pinned three-chapter stage work well: one panel changes and each chapter has its own stepping visual (alert to case with the five-year clock, the stage track, the four-fact lanes). Two problems break the rhythm:
   - **Voids:** a near-empty screen after the hero, and about 350px of blank after the pin, where only the pause button is left floating.
   - **Text:** from "Rules, lists and suppression" on, it reads as a document. Two headed text columns sit side by side, three open text rows, two paragraphs on Platforms, two text cards in How it connects, and a sentence under every tile in Decides-on and Plans.
3. **A real visual object in every section?** Mostly. Dial, case file, track, lanes, the four card glyphs, the event stream, the rule card, the declare stack, the flow line, the tier ladder and the Sigil are all there. Two are weak:
   - "Where this is today": two big cards that hold only an endpoint name and a +, after the same `/v1/aml` already appeared as a pill and in the paragraph. It's the same thing three times.
   - Plans: tall white tiles that are mostly empty space, with a number at the top.
4. **One ask, in the header, nothing floating; scale rhythm?**
   - **Desktop:** yes. The hero's "Talk to us" is the one solid, and the header swaps to "Talk to us" once the hero ask leaves. Nothing floats over content.
   - **Phone:** the page outlines its own hero "Talk to us", so the only solid fill on the first screen is the header's "Try Hanzo", which is a different ask for a different audience. No bottom ask bar appears anywhere on the page at 375.
   - **Scale:** mostly good (26px section heads, 64px-free, small mono captions). Two exceptions: the hero has two large type objects, and the closing band repeats the h1 sentence word for word.
5. **Every hover and press answers, no jumps?** Yes for controls: the asks, stage tabs, reason toggles, fact switches, + sheets, cards and Next links. Each changes fill or border on hover and scales to 0.98 on press, and the cards lift 4px. No box moved. The non-control objects (tier ladder, stage stops, gaps list, connect cards) give no hover answer, and no hover tells you a number or shows a preview.
6. **Overlap, font swap, layout shift?** None found at either size. Two craft flaws:
   - In "What this is not", the active gap row slides right behind a dash, and the top hairline of that list starts indented, out of line with the rows under it.
   - On phone, "post-purchase" breaks onto two lines inside the stage pill.
7. **Which reference, and is its motion there?** apple.com: a product-as-hero object and a pinned stage where one panel changes. That motion is really there. chatgpt enterprise calm in the "What this is not" honesty. Nothing from synchronized.studio (the + sheets are not card-to-page opens). There are no scrubbed strips, and nothing is tied to scroll speed.
8. **Different from its neighbours?** The hero is its own: a gauge that decides and explains itself, which no other page has. Below the hero it uses the shared PinChapters + OpenCards + Detail-sheet skeleton that 12 other pages also use (Treasury, Zap, Sign, Guard, Gateway, Hsm…). So the middle reads like its siblings.
9. **All 18 parts?** Not audited from the card, by instruction. Seen on the page:
   - Present: one h1, one main, skip link; `data-cta` and `data-thumb` on the primary; pause controls on every self-running object; JS-off `NoJs`; a dark room entered once; the closing band; sheets for long copy.
   - Missing: a working phone ask path.
10. **Banned tells?** No hue, gradient text, Inter or glow. Borderline:
    - an explaining sentence under every tile (4 decides-on tiles, 4 tiers, 2 connect cards);
    - an ACTION eyebrow over the 44px hero decision word, which is not a heading but reads like one;
    - the dashed outline boxes in the lanes and flow, which look a little like wireframes.
11. **Copy untouched?** Yes: parity is 114/114 and 7/7. The band reuses the h1 sentence, which is not new copy but is a repeat.

## Fixes to reach 8

1. **Kill the voids.**
   - Pull "Where this is today" up so the next section peeks about 56px under the hero.
   - Make the pin end on its last panel without leaving an empty screen behind.
   - Hide the chapter pause button when the stage unpins.
   - No scroll position should show more than about 200px of blank.
2. **"Where this is today": one statement, one object.** Drop the duplicate `/v1/aml` pills above the two paragraphs, or the two near-empty endpoint cards. Make what remains the object, for example the two faces as one engine diagram, live on one side and dashed on the other. The words stay.
3. **Turn the second half from reading into objects.**
   - Rules and Platforms side by side: show one at a time (one h2 per screen).
   - Move the three rule descriptions into the RuleCard steps or a sheet, so the rule card is the screen.
   - Do the same for the Platforms paragraphs around the declare stack.
   - Decides-on and Plans tiles: show title + glyph only and let the sentence live in the opened sheet (OpenCards already has the body). That removes the "sentence under every tile" tell.
4. **Plans ladder:** make the tiles carry their weight. Either shorten them so the empty white goes, or put the tier name large in the empty space, so it doesn't look like four unfinished boxes.
5. **Phone ask:** make the hero "Talk to us" the solid on phone, or confirm the shared bottom bar actually rises with "Talk to us" once the hero ask leaves view. Right now an enterprise buyer on a phone only ever sees a solid "Try Hanzo".
6. **Hero scale:** drop the decision word to medium (26–32px) so the 52px h1 is the one big thing. Move the ACTION label below the word as a caption, or beside it.
7. **Small craft:**
   - Align the top hairline of the gaps list with the rows.
   - Stop the active gap row sliding sideways; mark it with ink weight or a tick in place.
   - Keep "post-purchase" on one line in the phone stage pill.

## Shared chrome (not counted against the page)
- On phone, `Ask.jsx` never raised its bottom bar for this page's "Talk to us" at 375×812 (probed at y = 1500, 4000, 7000).
- During a long wheel walk on the dev server, the header remounted once: the ask went back to "Try Hanzo" and the Sound toggle disappeared. A clean instant-scroll probe held "Talk to us" throughout, so this looks like dev HMR, not the page.
