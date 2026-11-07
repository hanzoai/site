# /help/privacy/model-training — James-eye review
7 Nov. Walked moving at 1470x801 and 375x812 (isMobile, hasTouch) with Playwright: frames at 0, 1 and 3 s untouched, wheel scroll a screen at a time with 1.5 s dwell, hover and press on desktop, taps on phone, 320 overflow check, reduced motion, console and Next.js badge watch.

Verdict: 6/10

First complaint: "There's a red '1 Issue' badge in the corner, and the little settings demo is nice but then it just repeats the article back at me in a grey box. Below the demo, it's a document with big empty gaps, and it stops dead at 'More'."

## The 11 answers
1. **5 s and 1 s:** Yes. The h1 cuts in by line mask (box stays at y 219, no shift) and the settings demo's cursor reaches the avatar within 1 s, then runs Settings, Privacy and the switch by itself. It's the right object for the question. At 375 the demo starts at y 900, so on phone the first screen is h1, lede and caption with only the demo's top edge showing.
2. **One in, one out:** Only in the first screen. Below that it's a long article: sections 01, 03, 04 and 05 are plain text, about 200px of white sits between sections, and the sticky panel never changes as you scroll (it only changes on its own timer). On phone it's a straight document.
3. **Real object per section:** The hero has the demo, which is good. Section 02 has the steps cards, which light up in step with the demo. Sections 01, 03, 04 and 05 have no object. 03 is a dash list and 04 is a definition list. The sticky panel stands in for them on desktop, but it does that by repeating section 03's copy word for word.
4. **One ask, nothing floating, scale rhythm:** The header has one solid "Try Hanzo". Nothing of the page floats over content. The cookie bar and the dev "1 Issue" badge do sit over text on both sizes (the badge covers "Reject all" on phone). Scale is calm but flat: an h1 at 52, then 26px h2s and 16px body for the rest of the page. Nothing grows or shrinks, and there's no figure or moment after the hero.
5. **Hover and press:** Tabs, pause and step rows answer with a fill change and a 0.97 press (good). The demo toggle answers by flipping and revealing the result. The TOC rows only nudge their text about 6px on hover, with no fill and no hairline. Inline links (usage policy, Privacy choices, Terms, Privacy Policy, email) don't change on hover at all. The breadcrumb doesn't change either.
6. **Overlap, font swap, layout shift:** No horizontal scroll at 375 or 320, and the h1 box doesn't move. Problems:
   - When the switch is off, the sticky panel grows to about 700px. At the top of the page (top 148) its bottom runs past the 801 fold, so the last bullet is cut off.
   - The section 02 step cards end at x 860, only 18px from the panel at x 878. That's cramped.
   - The breadcrumb's last item is cut mid-word ("How do I change my model improveme…") on desktop even though there's room, and on phone it's hidden.
   - A hydration-mismatch console error shows the red "1 Issue" badge on cold loads, at both sizes.
7. **Reference:** Calm, like apple.com support, with a hint of an Apple how-to demo. The self-running UI demo is the one authored move. There's no pointer motion, nothing tied to scroll, and no count or figure.
8. **Neighbours:** I couldn't reach any sibling help article from /support to compare. The demo-as-hero idea is specific to this article, which is good.
9. **18 parts:** Breadcrumb, TOC, one h1, reduced motion (final state shown, getAnimations empty after 3 s), 44px touch targets and the pause control are all there. Missing: a closing Band (the page ends at "05 More", then about 190px of white, then the footer). The body line length is too long: 679px at 16px is about 85 characters, over the 75 hard limit. And the console error must be zero.
10. **Banned tells:** No hues, no Inter, no gradient. Nothing sits above the h1: "HELP · PRIVACY" is set as a caption under the lede, which is allowed. Borderline: two equal outlined boxes for the step cards (MASTER says tiles are flat fills with no outline). The panel's repeat of section 03 is the kind of clutter he rejects.
11. **Copy:** parity.py passes, with text 45/45 and links 4/4. The panel's verbatim repeat of section 03 doubles the copy on screen, which isn't a rewrite but reads as filler.

## Fixes, in order
1. **Fix the hydration mismatch** behind the red "1 Issue" badge. It shows on cold loads at both sizes (attributes differ between server and client, probably the demo's initial tab, step or paused state, or a viewport-based branch). Render one deterministic first state on the server and pick the device or timer only in an effect.
2. **Stop the sticky panel from repeating section 03.** When the switch turns off, show one short result: the tick and "The change saves to your Hanzo account…" line only. Drop the copied "WHAT TURNING IT OFF CHANGES" list. Instead, scroll-sync the panel so it shows something different per section: 01 the switch's on/off meaning, 02 the steps (as now), 03 the before/after of new conversations, 04 a quiet "not affected" state. Then each section has an object, and one thing comes in as one goes out.
3. **Cap the sticky panel at 100svh minus the header and 32px.** At the top of the page it currently runs to y 846 at 801 when off. Let its inner content scroll, or reserve the result line's height from the start so the panel never grows.
4. **Narrow the article column** to the prose measure: 62–68 characters at 16px, about 600px. That also gives 40px+ of gutter between the step cards and the panel (now 18px).
5. **Step cards in section 02:** make them flat `#f5f5f5` tiles with no outline (raise or outline, never both), and keep the active-step fill in white. On phone, keep only the tab that matches the device first and put the other behind the demo's tab control, so the steps aren't listed twice.
6. **Breadcrumb:** show the full last item on desktop (it fits; don't truncate at about 430px). On phone, wrap it to a second line instead of hiding it.
7. **Hover states:**
   - TOC rows: a `#f5f5f5` row fill plus the number turning ink.
   - Inline links: underline thickness to 2px or offset 3 to 1px with ease-out 150 ms.
   - Breadcrumb link: same as the inline links.
   - No opacity-only changes.
8. **Closing:** add the page's own closing link strip and a `Band` (privacy@hanzo.ai / Help center in existing words). Remove the empty ~190px after "05 More" so the footer follows with no gap.
9. **Tighten section spacing.** The roughly 200px white bands between 01–05 make the page feel dead on scroll. Use 116px. Give 04 a little life: a hairline that draws in under each term, or the row fill on hover.
10. **Phone first screen:** pull the demo up so its top 120px (the tabs and the start of the app frame) sit inside 812. Shorten the space between the caption and the demo, or move the "HELP · PRIVACY" caption under the demo. Keep the demo cut at its true size rather than shrinking it.
