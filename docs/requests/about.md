# Requests from the Story pages (/about, /history, /blog)

1. `components/v2/Unfold.jsx`: MASTER.md 3.1 bans springs. Its sheet morph uses `type: 'spring'`. /about now uses a page-local copy (`components/pages/StorySheet.jsx`) with a 600 ms ease-in-out tween; please switch the shared file and the copy can go.
2. `components/kit.jsx` `Band`: its heading reveals word by word with `filter: blur(12px)` (MASTER part 8: blur 4px or less, once per page; part 9: no opacity-and-blur reveal). The Story pages close with a page-owned `StoryClose` (same `.x-band` room, line-mask cut) until Band is fixed.
3. `components/kit.jsx` `Tabs`: the pill glides with `SPRING.pill` (a spring). Please make it a 300 ms ease-emphasis tween (MASTER 3.1).
4. `components/v2/Lines.jsx`: MASTER part 3 asks 700 ms per line with 60 ms between lines; the shared file runs 1.05 s. The Story pages pass `stagger={0.06}`.
5. `components/Ask.jsx`: MASTER 3.2 rule 6 and the banned list: no floating pill bar over content on desktop. The Story pages carry `data-thumb` for the bar's label, but the bar itself is shared.
6. `scripts/taste.py --fix` rewrote Hanzo copy on /about ("Merge pull request #299" became "#737373"): a commit message is copy, not a colour. Restored, and the source now writes it as `#299` so the fixer cannot match it; please make the fixer skip JS string content.
