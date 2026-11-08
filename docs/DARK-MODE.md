# Dark mode: how to convert your pages (8 Nov)

Live hanzo.ai follows the device setting: `<html>` gets `dark t_dark` in dark mode and `light t_light` in light mode. The shared foundation for this is done (commit "dark mode foundation"). Your job is your own page files only. Bright mode must not change by a single pixel, and the copy rule still holds: change no words, and `scripts/copycheck.mjs` stays at missing 0.

## What the foundation does (don't redo it)
- **Theme before paint.** `app/layout.jsx` runs live hanzo.ai's own script in `<head>`. It reads the saved choice from `localStorage['hanzo.appearance.painted']` (`{ theme: 'light' | 'dark' | 'system' }`), or the device setting when nothing is saved. It sets `light`/`dark` and `t_light`/`t_dark` on `<html>`, plus `color-scheme` and `data-scheme`, and re-applies when the device setting changes. There is no flash, and hydration and client navigation keep the class (measured: `dark t_dark` at first paint, after hydration and after a link click). With JS off the page stays bright.
- **No switch.** No captured live menu shows an appearance control, so none was added (no new words). A saved choice is still honoured.
- **Hanzo's own CSS** (`public/hanzo.css`) already draws Hanzo's header, menus, footer and every Hanzo-ported section in dark.
- **Tokens.** `app/globals.css` (`html.dark`) and `app/system.css` give every shared token Hanzo's dark value, read from Hanzo's stylesheet: page `#0d0d0d`, text `#e5e5e5`, muted text `#a3a3a3`, borders white 10%, muted surface `#171717`, card and popover `#0f0f0f`, secondary `#262626`, primary `#fafafa` on `#0a0a0a`.
- **Shared pieces already converted:** cookie banner and preferences, the announcement strip, sign-in buttons, buttons, the search palette, the language and account menus, the menu feature card, scrims, shared sheets, drawers, pause buttons, related cards, and every `components/v2/*.css`. The home hero's dot field draws in the page's ink at 17%: dark grey dots on white, light dots on `#0d0d0d`.

## The tokens

| Use it for | Token | Light (unchanged) | Dark |
|---|---|---|---|
| Page background | `var(--bg)` | `#fff` | `#0d0d0d` |
| Text, headings, ink fills | `var(--ink)` | `#0a0a0a` | `#e5e5e5` |
| Secondary text | `var(--soft)` | `#6e6e73` | `#a3a3a3` |
| Captions, mono labels | `var(--faint)` | `#86868b` | `#858585` |
| Hairlines | `var(--line)` | black 8% | white 10% |
| Muted fill (old `#f5f5f7`) | `var(--x-fill)` | `#f5f5f7` | `#171717` |
| A surface on the page (old `#fff` card, button, menu) | `var(--x-raised)` | `#fff` | `#0f0f0f` |
| Text on an ink fill (old `#fff` on `#0a0a0a`) | `var(--x-on-ink)` | `#fff` | `#0a0a0a` |
| Recessed bar (old `#fafafa`) | `var(--x-sunk)` | `#fafafa` | `#141414` |
| Selected pill in a track | `var(--x-knob)` | `#fff` | `#262626` |
| Stronger borders (old black 10, 12, 15%) | `var(--x-e10)`, `var(--x-e12)`, `var(--x-e15)` | black .10, .12, .15 | white .10, .12, .15 |
| Rooms (`[data-room]`) | `var(--room-*)` | as before | Hanzo's dark; `[data-room=light]` follows the page into dark |

**Don't use `var(--card)`, `var(--raised)` or `var(--muted)` for a new fill.** Hanzo's stylesheet defines those names on inner elements (`--card` is `#f2f2f2`, `--raised` is `#e4e4e4`), so they don't resolve to our values and bright mode shifts. That is why the new tokens start with `--x-`.

**A one-off grey** (`#efeff1`, `#ececef`, `#f1f1f3` and so on) keeps its exact light value with `light-dark(#ececef, #171717)`. `light-dark()` follows the html class: `html.light` and `html.dark` set `color-scheme`.

## How to convert a page
1. **Find what's left.** Run `node scripts/darkcheck.mjs /your-page` with the dev server on :4180 (`CHROME=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome` in the cloud). It lists every bright background and low-contrast text by class, at 1470 and 375.
2. **Replace hard-coded colours in your page CSS:**
   - `#fff` / `#ffffff` backgrounds → `var(--x-raised)`, or `var(--bg)` for a full-width section.
   - `#0a0a0a` / `#0a0a0b` / `#111` text → `var(--ink)`. `#6e6e73` → `var(--soft)`. `#86868b` → `var(--faint)`.
   - `#f5f5f7` → `var(--x-fill)`. `#fafafa` → `var(--x-sunk)`.
   - `color: #fff` on an ink fill → `var(--x-on-ink)`.
   - `rgba(0,0,0,.08)` hairlines → `var(--line)`.
   - In inline `style={{}}` and canvas code, read the colour from CSS (`getComputedStyle(el).color` with `color: var(--ink)`), and redraw when `<html>`'s class changes (see `Dots` in `components/Hero.jsx`).
3. **Leave alone** anything that is black in both modes: `[data-room=dark]` sections, films, Hanzo's media, and white type on a film.
4. **Bright mode is unchanged.** Start a server on the code before your change (a `git worktree` of origin/main on :4190, `npx next dev -p 4190`, with node_modules copied or linked; turbopack refuses a link), then run `HZ_OLD=http://localhost:4190 node scripts/lightcheck.mjs /your-page`. Done means `light: OK`. Every token above has exactly today's colour in light, so a correct swap gives 0 diffs.
5. **Dark looks right.** `darkcheck.mjs` should say `dark: OK`. Then look at it yourself: Playwright `newContext({ colorScheme: 'dark' })`, or DevTools › Rendering › "Emulate CSS prefers-color-scheme: dark". Check 1470×801 and 375×812, with no console errors and no overlaps.
6. **Copy unchanged.** Run `node scripts/copycheck.mjs /your-page` and confirm missing 0.

## Left for the page chats (measured 8 Nov)
- `/` (Home): the activity feed (`.xs-ev`), the pause button (`.xh-pause`) and the platform mock in `components/pages/Home.css`.
- `/pricing`: the `.xpr-*` panel, tabs and rail.
- `/chat`: the `.cht-*` window, tools and rows.
- Every other page: run `darkcheck.mjs` on it.
