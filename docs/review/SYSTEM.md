# The shared system: what exists and how to use it

The shared-system chat owns this file, along with everything it lists: `app/layout.jsx`, `app/globals.css`, `app/system.css`, `components/{Chrome,Nav,HeaderTools,Ask,Morph,Phone,Cursor,Opener,Sigil,ui,kit,JsonLd}`, `lib/{motion,scroll,route}.js` and `next.config.mjs`.

Page chats: use these and do not fork them. If something is missing, write the request at the bottom of this file. Every addition is additive, so nothing on your page changes unless you opt in. The few site-wide fixes are listed under "Changed for everyone".

Pull main, then read this file again. It grows with every push.

---

## 1. Colour: the grey and silver deck (0 UI hues)

`app/system.css` holds the tokens. There is no blue, green or red for UI. Colour comes only from Hanzo's own media.

| Token | Use |
|---|---|
| `--hz-950 … --hz-50`, `--hz-black`, `--hz-white` | The grey ladder (#0a0a0b to #f5f5f7). |
| `--silver-hi`, `--silver`, `--silver-lo`, `--silver-deep` | Silvers for objects such as chips and hairlines. |
| `--silver-sheen` | A brushed-metal surface for an object. Never use it on text: gradient text is banned. |
| `--room-bg`, `--room-surface`, `--room-raised`, `--room-ink`, `--room-soft`, `--room-faint`, `--room-line`, `--room-line-strong`, `--room-fill`, `--room-fill-strong` | Semantic colours that follow the room you are in. |
| `--focus` | The focus ring colour. It is ink in light rooms and #f5f5f7 in dark rooms. |

- **Dark rooms.** Put `data-room="dark"` on a dark section. Every `--room-*` token, the focus ring and `.x-btn.solid` flip for it: solid buttons become #f5f5f7 with ink text. The header also turns dark while it sits over that section.
- **Light inside dark.** For a light card inside a dark room, put `data-room="light"` on the card.
- **Status.** A status that needs colour gets a shape or a word as well, never colour alone.

**Fix on your page:** replace any literal `#0a84ff` (38 page files have it), green or other UI hue with `var(--room-ink)`, `var(--focus)` or a grey token.

## 2. Motion tokens

`lib/motion.js` and the CSS variables in `app/system.css` hold the same values.

```js
import { EASE_OUT_EXPO, EASE_CALM, EASE_SOFT, EASE_IN, DUR, SPRING, STAGGER } from '../lib/motion';
<motion.div transition={{ duration: DUR.enter, ease: EASE_OUT_EXPO }} />   // or transition={SPRING.sheet}
```

- **CSS easings:** `var(--ease-out-expo)`, `var(--ease-calm)`, `var(--ease-soft)`, `var(--ease-in)`.
- **CSS durations:** `var(--dur-press)` .1s, `--dur-hover` .2s, `--dur-exit` .25s, `--dur-fade` .4s, `--dur-enter` .6s, `--dur-reveal` 1.1s.
- **Reduced motion is handled site-wide.** Motion uses `MotionConfig reducedMotion="user"`. CSS animations and transitions collapse to their final state.
- **Write the final state first.** Under reduced motion, the end state you wrote is what people see.

## 3. Component states (hover, press, focus, loading, disabled, selected)

Nothing fades on hover. Press is a scale of .98 (or translateY of 1px for links), with no layout jump.

| Part | Class or component | States |
|---|---|---|
| Button | `.x-btn`, `.x-btn.solid`, `<Btn>`, `<Go>` | **Hover:** a grey veil on outline buttons, and a darker or lighter fill on solid ones (safe on any colours). **Press:** scale .98. **Loading:** `aria-busy="true"`, or `<Btn busy>`; a ring turns in place and the width stays. **Disabled:** `disabled`, `aria-disabled="true"` or `<Btn disabled>`. **Selected:** `aria-pressed="true"`, `aria-current="page"`, `data-selected` or `<Btn selected>`; it reads inverted. |
| Arrow link | `.x-arrow`, `<More>`, `<Arrow>` | The chevron nudges on hover and the link drops 1px on press. |
| Text link | `.x-link` | An underline draws in from the left on hover and stays for `aria-current="page"`. |
| Card | `.x-card` on an `<a>`, `<button>` or `[tabindex]` | **Hover** (fine pointers only): lifts 5px and the hairline strengthens. **Press:** scale .98. **Selected:** `aria-selected`, `aria-current` or `data-selected` give it an ink ring. `.x-card.inv` is the one inverted odd tile. |
| Tabs | `<Tabs>`, `<TabPanel>` (kit) | A gliding pill. Arrow keys, Home and End move between tabs, and disabled tabs are skipped. Every panel stays in the server HTML. |
| Sheet | `<Sheet>` (kit) | Opens from the right on desktop and from the bottom on phones (drag down to close). Esc, the scrim and the close button shut it. Focus is trapped inside and returns to where it was. Scroll is held. |
| Table | `.x-table-wrap > table.x-table` | Sticky header and first column, tabular figures, and a row hover fill. Mark the subject column's cells with `data-subject`; it gets a grey tint, never a hue. Use `.x-gap` on an honest "—". |
| Field | `.x-field > label + .x-input2` | 48px tall with 16px text. `aria-invalid="true"` gives a dashed ink border. `.x-field-msg` holds the message. |
| Loading | `<Skeleton lines={3} />` or `<Skeleton h={320} />` | Holds the exact box the content will take, so nothing moves when it arrives. |
| Empty | `<Empty title detail action to />` | Pass Hanzo's own words. |
| Error | `<Problem title detail onRetry action to />` | Has `role="alert"`. Pass Hanzo's own words. |

```jsx
import { Tabs, TabPanel, Sheet, Skeleton, Empty, Problem, Img, Film } from '../kit';  // pages: '../../components/kit'
const [i, setI] = useState(0);
<Tabs id="plans" label="Plans" tabs={['Personal', 'Team', 'API']} value={i} onChange={setI} />
<TabPanel id="plans" i={0} value={i}>…</TabPanel>
```

`v2/DetailSheet` stays as the button-and-sheet pair. `<Sheet>` is the bare, controlled sheet for any trigger.

## 4. Headlines

`<Lines as="h1" play="load" lines={['Smarter, Faster,', 'Pick all three.']} className="your-h1" />` from `components/ui.jsx` is the line-mask reveal:

- Each line rises out of its own mask in 1.1s, 80ms apart, once.
- The whole sentence is in the HTML for screen readers and search engines.
- Give the heading your own `font-size` and `line-height`; the mask clips at the line box.
- `play="load"` is for heroes; the default plays once in view.

## 5. The ask: one solid button on screen

- **The ask bar** (`components/Ask.jsx`, mounted for you) arrives once the hero has gone by, on every page at every width:
  - **Desktop:** a small bar at the bottom centre with the Hanzo mark, the page name (tap it to go back to the top), search and the ask.
  - **Phones (900px and under):** a full-width bar under the thumb.
  - It replaces the old phone thumb bar and reads the same attributes.
- **While the bar shows,** the header's "Try Hanzo" turns from solid to outline, so only one solid button is on screen.
- **`data-thumb` on your hero's main button.** The bar then carries your words and href, for example `<Go to="/contact-sales" solid data-thumb="Talk to sales">Talk to sales</Go>`. Without it, the bar carries the header's "Try Hanzo". The bar steps aside whenever any `[data-thumb]` button is on screen itself.
- **Optional attributes:**
  - `data-ask-name="Hanzo Dev"`: the page name in the bar. The default is the first part of the `<title>`.
  - `data-ask-note="No card needed"`: a 12px risk line beside the button on desktop. Use Hanzo's words only.
  - `data-ask-hide` on a section whose bottom edge the bar must not cover.
  - `data-ask="off"` on `<main>` for a page with no ask (the 404 and error pages use it).
  - `data-dock` on your own fixed bottom bar.
- **It also yields to** the footer, the closing `.x-band`, menus, search, sheets, the cookie note and the phone keyboard.

## 6. Header and menus

- **Hanzo's own header and items, untouched** (Company, Research, Products, Solutions, Developers, Learn, Pricing, search, language, Log in, Try Hanzo).
- **Hover** opens a menu with intent. Moving between menus slides the columns.
- **Keyboard:**
  - Enter, Space or ↓ on a heading opens its menu and focuses the first link.
  - ↑ ↓ Home End move through the links.
  - Tab past the last link closes the menu and goes on to the next heading.
  - Shift+Tab from the first link returns to the heading.
  - Esc closes the menu and returns focus.
- **Phones:** the Hanzo AI chevron opens a full-screen sheet of accordions.
- **"Try Hanzo" no longer fades on hover.** Its fill shifts instead.
- **No overlay blurs the page.** One backdrop blur per page, the header's. The menu scrim and the search backdrop are now a plain tint.
- **The header does not hide on scroll.** Over 40 page stickies assume a 60px header at `top: 60px`, and hiding it would open gaps above all of them.

## 7. Page transitions (card to page)

`components/Morph.jsx` is already on:

- Every in-site click is a ~600ms View Transition.
- A big link (160×90 or larger), or anything marked `data-morph` inside a link, flies into the next page's `[data-morph-target]`. Without a target, it flies into the first section.
- Small links turn the page while the header stays put.
- Opt out with `data-no-morph`.
- Pages are fetched on hover and on the first touch.
- Reduced motion, new-tab clicks and browsers without View Transitions navigate instantly.

## 8. Fonts: no visible swap

- Zen and Zen Mono are both preloaded and use `font-display: block`, so text paints once, in Zen.
- If a very slow network outlasts the block period, metric-matched fallbacks (`Zen Fallback`, `Zen Mono Fallback`) take the same box, so the h1 never moves.
- Use `var(--sans)` and `var(--mono)`; they already include the fallbacks.
- **Never** add another webfont or a Google Font.

## 9. Media and performance rules (BRIEF-v3 §10 budgets)

**Budgets** (75th percentile, mid-phone on 4G):

| Metric | Target |
|---|---|
| LCP | 1.8s on a phone, 1.2s on desktop |
| INP | 100ms or less |
| CLS | 0.02 or less |
| Animation | 50fps or better |

**First-load JS (gzipped):**

| Page type | Budget |
|---|---|
| Home | 170 KB |
| Launch and System | 150 KB |
| Catalogue | 140 KB |
| Developer | 130 KB |
| Model | 100 KB |
| Utility and legal | 90 KB |

**`<Img src w h alt priority />`** (kit):
- Always give `w` and `h`, so the box is reserved.
- Put `priority` only on the one image that is the page's LCP.
- Everything else is lazy and decodes off the main thread.
- First-view images are 250 KB or less.

**`<Film src poster w h label />`** (kit):
- Muted and looping.
- Plays only while on screen and while the tab is visible.
- Never plays under reduced motion or Data Saver; the poster stays.
- Downloads only when near the screen.
- No autoplaying clip over 1.5 MB, and nothing autoplays above the fold before first paint.

**Also:**
- Put `.x-cv` on long sections far below the fold. It applies `content-visibility: auto` with a 900px intrinsic height; set your own if you know it.
- Animate only transform, opacity, clip-path and filter. No `transition: all`.
- Pause your CSS loops off screen with `[data-off] .x { animation-play-state: paused }`. Chrome sets `[data-off]` for you.
- No third-party scripts above the fold.

## 10. SEO, share cards, structured data

Every `page.jsx` already does the right thing:

```jsx
export const metadata = { title: '…', description: '…' };     // Hanzo's own words
export default function Page() { return <><JsonLd route="/your/path" /><YourPage /></>; }
```

**What `<JsonLd>` gives each page:**
- Its canonical link (`https://hanzo.ai/your/path/`).
- Open Graph and X tags pointing at its own card image (`/og/your/path.png`).
- Hanzo's schema.org data.

**Site-wide, added by this system:**
- `app/sitemap.js`: every route.
- `app/robots.js`.
- `app/icon.svg`: the Hanzo mark, light and dark.
- `viewportFit: cover`.
- A `twitter:site` tag.

## 11. Accessibility

- **Skip link.** "Skip to content" is the first tab stop and jumps past the header to `#main`.
- **Focus.** One ring, 2px in the room's ink with a 3px offset. Never `outline: none` without a replacement.
- **Reduced motion:** see section 2.
- **Targets.** Hit targets are 44px or more on touch.
- **Overlays.** Esc closes every overlay and returns focus.

## 12. States: 404, error, loading

- **Unknown address:** `app/not-found.jsx` renders `components/pages/Lost.jsx`, the 404 with its contour map and search.
- **A page that throws while rendering:** `app/error.jsx` shows the same dark room with "Try again" and "Go home". The header and footer stay.
- **The shell itself fails:** `app/global-error.jsx`.
- **No root `loading.jsx`, on purpose.** It would put a blank frame inside every card-to-page transition. Use `<Skeleton>` for live parts of your page instead.

## 13. Helpers

- `lib/scroll.js`: `scrollToEl(el, { offset: -110 })` and `scrollToY(y)` work with or without Lenis and respect reduced motion. Use them instead of branching on `window.__lenis`.
- `lib/route.js`: `href(p)` keeps links inside the site when the page exists here. Otherwise it sends them to hanzo.ai.

---

## Changed for everyone (already live)

- **Focus ring:** ink or white, not blue. Its 8px border-radius override is gone.
- **Solid buttons inside `data-room="dark"`** are now #f5f5f7 with ink text. Before, they were black on black, for example the dark heroes on /guard, /hsm, /machines, /world, /gateway, /network, /pubsub, /telemetry and /visor.
- **Green and blue accents** in shared CSS are now grey: code syntax colours, the Pareto chart, the cookie "Always Active" label, the savings chip and the race lane label.
- **The old phone thumb bar** is replaced by the ask bar, with the same attributes.

## Known breaks on main, owned by their page chats

These are not changed by this system:

- `components/pages/cloud/Crawl.css` has an extra `}` at line 94, which shows a build error overlay on every page in dev. It is fixed on the Cloud 1 branch, waiting to merge.
- `components/pages/cloud/Metrics.jsx` declares `LABELS` twice, which is a build error.

## Requests to the shared system

Write each request as one line: the page, what you need, and why.
