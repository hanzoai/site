# /skills: requests (fix pass, 7 Nov)

UI strings: none added. Every visible word on the page is Hanzo's; the essay stage and the thread previews draw file contents as blank lines.

Shared changes this page needs (it cannot edit these files):

1. **`components/v2/A2Lines.jsx`: hydration mismatch under reduced motion.** `initial={calm ? false : { y: '105%' }}` renders `transform: translateY(105%)` on the server (where `useReducedMotion()` is false) and no style on a reduced-motion client, so React logs "A tree hydrated but some attributes ... didn't match" and the dev badge shows "1 Issue" on every reduced-motion load (seen on /skills for "Skills", "Coverage costs context. / This is the trade." and "Get started / with Skills"). Suggested fix: always render `initial={{ y: '105%' }}` and let the reduced-motion case skip the animation (`transition={calm ? { duration: 0 } : …}`), or move the reduced-motion reset to CSS (`@media (prefers-reduced-motion: reduce) { .a2-ln-in { transform: none !important } }` in A2.css). /skills already carries that CSS reset in its own file, so the headings are visible; only the console error remains. With normal motion /skills hydrates clean (10 of 10 fresh loads, desktop and phone).
2. **Header (shared chrome): the phone header ask stays "Try Hanzo".** On desktop it swaps to the hero ask's `data-thumb` ("View on GitHub", solid) once the hero ask leaves view; at 375×812 it never swaps. The hero ask carries `data-thumb="View on GitHub"` and `data-cta="skills.hero"`.
