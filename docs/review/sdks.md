# /sdks — James-eye review

Verdict: 6/10
First complaint: "The black boxes have black writing on them. 'AI + Agents', the Python card and the selected language are just blank black shapes. And once you're past that nice code window, it's a document again: grey cards and a long table."

Walked 7 Nov 2026 with Playwright Chromium at 1470×801 and 375×812 (isMobile, hasTouch). I recorded video and took 10 frames over the first 6 s with no input. Then I scrolled the whole page slowly: wheel steps on desktop, smooth scroll steps on phone, dwelling about 1 s per step. I clicked the dialect and language tabs, Copy (and read the clipboard back), the SDK picker and the module finder (typed "sql", then a miss). I hovered the CTA, an org row and the library cards. I also did a 40-stop Tab crawl, a reduced-motion run, a JS-off run, and checked 375×667 and 320×640. Non-localhost POSTs were blocked.

Stills: `sdks/d-f3.jpg` (hero at 2 s), `sdks/st-two.jpg` (the "AI + Agents" heading, invisible), `sdks/st-pick.jpg` (the selected picker label, invisible).

Environment note: during my first pass a syntax error in another chat's `components/pages/Pricing.jsx` made the dev server put its build-error overlay and red badge on every page (/pricing returned 500). The owner says it is fixed. On a reload /sdks showed 0 console errors and no error badge (the `nextjs-portal` there is only the dev indicator). That window is not held against /sdks.

## What works
- **The hero object is right for a developer page.** A big black console takes the left 8 columns. It flips OpenAI → Anthropic on its own at about 900 ms, then every 4.2 s while in view. Only the lines that differ get re-set, with a brief light band, so the difference (base URL, header, `max_tokens`) reads at a glance. This is a real signature, and it is Hanzo's own code.
- Copy puts exactly the displayed text on the clipboard (checked on cURL/Anthropic), and the label turns to "Copied".
- The dialect pill glides (layoutId). Language tabs, the picker, org-row hover fill (white 6%) and library lift (−4px) all answer.
- The Go module finder is a nice idle "time" moment: the placeholder types module names by itself. Typing filters live (`sql` → 4 / 50), and a miss shows "No module at that path."
- The header ask becomes "API reference" once the hero ask leaves view: the page's own ask, solid, in the header.
- CLS 0.0002 desktop and 0.00002 phone; no horizontal scroll at 1470, 375 or 320. Reduced motion: 0 running animations after 3.5 s and the console stays still. JS off: nothing hidden.
- `parity.py /sdks`: text 217/217, links 69/69. `taste.py`: OK. `unique.py`: OK.

## The 11 answers
1. **5 s / 1 s.** Desktop: yes. The h1 cuts in, the console rises, and the dialect flips at about 0.9 s. Phone: no. The first screen at 375×812 is the h1, lede, ask, "Code Examples" and the cookie card, and the console starts below the fold. Nothing moves in the first second without input.
2. **One in, one out?** Only at the top. After the hero comes a run of static rooms: a paste strip, two text cards, the picker, a six-row table, three library cards, the module wall and the close. Each section just sits there when it arrives (no entrance beyond the h2 line-cut). On phone the org table becomes six stacked records of 6 lines each (about 1.5 screens of mono text). This part reads as a document.
3. **A real object in every section?**
   - Hero: yes (console).
   - "Full Cloud SDK / AI + Agents": no. Two text cards with a `{ }` and ✦ glyph.
   - Picker: partly (install line with Copy).
   - Orgs: a table.
   - Flagship: three code-pill cards.
   - Modules: yes (type wall plus finder).
4. **One ask / scale rhythm.** One solid page ask, and the header carries it after the hero. On phone the shared header's solid "Try Hanzo" sits beside the hero's solid "API reference" (shared header issue, noted, not held against the page). Scale: the hero is good (68px h1 beside a big console), but screen 2 jumps straight to two 56px h2s side by side ("Full Cloud SDK" / "AI + Agents"). That is two big things at once, and both are bigger than the later section heads (32px).
5. **Hover and press.** Yes on every control I tried. The CTA moves from ink to #2c2c2e without fading, rows fill, and cards lift. The dialect, picker and URL transitions use `type: 'spring'` (stiffness 420/380). They are heavily damped so I saw no visible overshoot, but the deck says no springs.
6. **Overlap / font swap / shift.** No layout shift and no font swap seen. Overlap: three labels are **ink on ink**, so the text is there but invisible:
   - the `AI + Agents` h2 (rgb 10,10,10 on #0a0a0b);
   - the Flagship lead card's `Python` h3 (same);
   - the selected label in the Official SDK picker (ink text on an ink `--acc` pill), on desktop and phone.

   All three come from the "0 UI hues" override (`--acc` became ink in light rooms) while the text colour stayed `var(--ink)`. The cookie card sits over the console's foot on desktop and over the hero's lower third on phone (shared chrome).
7. **Reference.** Apple's developer pages and Stripe-style docs heroes: one product object, a persistent ask. The console delivers that. Nothing from the osply/hamol editorial grammar or a pinned scene below the fold.
8. **Different from neighbours.** Yes. Code-first with the console on the left, words on the right, and the dialect diff as its signature. `unique.py` passes.
9. **18 parts.** The card exists with 18 headings, all `Done here:` lines filled. Several ticks are not true (see Card check).
10. **Banned tells.**
    - No hue, gradient text, Inter or eyebrow above a headline (kickers are visually hidden by `.a2-kick`).
    - The 🐍 📘 🔗 language tabs are Hanzo's live copy (`content/live/sdks.json`), so they stay, and they are not headings.
    - The Flagship row is three boxes in a row (1.4fr 1fr 1fr). It is unequal and one is dark, but it reads as the "three cards" pattern.
    - `{ }` / ✦ glyphs in the two cards are icon-as-object.
11. **Copy untouched.** Yes, parity 217/217 and 69/69.

## Card check (`docs/coverage/sdks.md`)
It exists and has 18 parts, all filled. These claims are not true today:
- **Part 12, "Contrast measured, text at 4.5:1":** three labels are at about 1:1 (above).
- **Part 12/8, "Focus ring visible on every stop":** the visually hidden `.x-sr` block of six `<pre>` samples is in the tab order. The crawl lands on 6 invisible stops ("Point the official Ope…", "The OpenAI JS SDK —…", and so on) between the console Copy and the picker.
- **Part 3, "Something moves within 1 s":** true on desktop, false at 375×812.
- **Part 9, "Reduced motion… / motion tokens":** reduced motion is fine, but the spring transitions break the deck's "no springs" rule.
- **Part 18, "Review read: verdict 8 or more":** no review existed before this one. It is now 6.
- **Part 3, "Ends in proof strip, `Band`, footer":** the page has no proof strip. The close is a repeated h1 line plus the ask, which is acceptable as a `Band`, but the tick overstates it.

## To reach 8
1. **Fix the three ink-on-ink labels.**
   - Set `.xsd-half.dark h2`, `.xsd-lib.lead h3` to `#fafafa`.
   - Set `.xsd-pick-l button[aria-selected='true']` to white, or make the picker pill white/`#f2f2f2` with ink text, as the dialect pill already does.

   Then re-measure contrast on every dark surface.
2. **Take the six hidden `<pre>` samples out of the tab order.** Give them `tabindex="-1"`, or render them as non-focusable text, so the Tab crawl has 0 invisible stops.
3. **Phone first screen: get the console moving above the fold.** For example, put the console straight after the h1/lede/ask, move "Code Examples" and the two dialect notes below it, or tighten the 112px top padding. The flip should be visible within 1 s at 375×812.
4. **Make screen 2 one thing, not two 56px headlines.** Bring the "Full Cloud SDK / AI + Agents" h2s down to section scale (26–32px). Give the pair one object, for example a small live diagram of "one OpenAPI document → generated SDKs in six orgs" vs the hand-written library, drawn from the existing words. Or fold the two cards into the console room as its caption, so they come in as the console goes out.
5. **Give the long middle one moment of its own.** Candidates:
   - the org table rows drawing in one by one as the room opens (it is the page's one black room);
   - the picker panel changing on its own until touched, like the console does;
   - on phone, the org records as a snap rail (one language per card, 14–18% peek) instead of six stacked blocks.
6. **Replace the `type: 'spring'` transitions** with `ease-emphasis` at 300 ms (deck rule).
7. **Update the coverage card** to the measured truth (contrast, tab stops, phone 1 s, springs, verdict line).
