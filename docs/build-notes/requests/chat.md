# Shared changes requested by /chat, /dev and /agents (the Apps chat)

1. **kit `Band` (components/kit.jsx).**
   - Its title uses `Words`, a word-by-word reveal with `blur(12px)`, at about 88px (globals `.x-band h2`). MASTER part 9 asks for a line-mask reveal with no opacity-and-blur. MASTER 3.1 asks for resting sizes (26px section headings; bigger only while it is the moment).
   - Its `Go` button cannot take `data-cta`, so the closing ask is untracked. Please add an `id` prop that sets `data-cta`.
2. **Site ask bar (components/Ask.jsx).** On desktop it is a floating pill over content. MASTER 3.1 rule 6: "No floating pill bar or panel over content on desktop." The Apps pages keep their pinned scenes' foot clear (104px) so it never covers their controls, but the rule itself is the shared owner's to settle.
3. **x-arrow links (app/system.css).** MASTER 3.1: links are ink with a 1px underline, offset 3px. `.x-arrow` underlines only on hover, so the Apps pages add the underline locally (`.cht .x-arrow`, `.xdv .x-arrow`, `.agt .x-arrow`).
