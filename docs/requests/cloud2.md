# Shared requests from the Cloud 2 / Wave 2 chat (/extension /flow /functions /gateway /guard /gui /help/privacy/model-training /hsm /iam /identity /idv)

## 1. Shell hydration mismatch: the red "1 Issue" badge (owner: layout / Chrome chat)
Same issue as `docs/requests/press.md` section 2, with the exact diff (7 Nov, main at `f244a55c`). Loading six cloud pages at once
on the dev server, /iam failed hydration in the root layout, not in page code:

```
<div className="x-page">            (client)
- className={null} data-x-shell="header" style={{display:"contents"}}   (server)
  <HeaderHTML>
+   <div data-x-shell="header" dangerouslySetInnerHTML={{__html:"<header cl..."}}>   (client expects)
-   <header className="is_View ..." data-scrolled="false" data-slot="masthead">       (DOM found)
```

React finds the live `<header>` where it expects the `HeaderHTML` wrapper div, so something touches the shell DOM before
hydration finishes (only when hydration is slow: under load, cold compiles, screen recording). A single quiet load of every page
above is clean. Asked for: keep the shell wrapper untouched until hydration completes (start header/nav DOM work in an
effect, not in an inline script), or render the shell outside React's hydrated tree. Every reviewer counts this badge against
the page it sees it on.

The /guard fixer saw the same mismatch on the footer shell too (`data-x-shell="footer"`: the expected `__html` wrapper
against a live `<footer class="is_View …">`), and the /gui fixer found a second one in `components/v2/BizStage` (under
reduced motion it renders a transform on the server and none in the browser; owner Business 1 chat). /gui now uses its own `Settle`.

**Reviewer note (found by the /gateway fixer):** Playwright's `page.screenshot()` hides the text caret by injecting a style on
inputs. A screenshot taken before React hydrates (the "0 s" frame) therefore causes a hydration mismatch of its own, which is
what most critics saw as the badge. Take screenshots with `{ caret: 'initial' }`, or after hydration, before counting it.

## 1b. `@property --w` in `public/hanzo.css` (owner: shared styles)
Found by the /extension fixer: `public/hanzo.css` registers `@property --w`, so any page that sets `--w` inline and uses it in
`scaleX(var(--w))` or `width: var(--w)` silently gets the registered initial value: every bar renders the same length. /extension
now uses `--xw`, and /help uses per-bar widths in CSS. Other pages that use `--w` this way may have the same hidden bug. Asked for:
rename the registered property, or list it as reserved.

## 1c. Parity does not catch invented copy (owner: conductor / scripts)
`scripts/parity.py` checks that Hanzo's words are present, not that nothing else was added. An audit of this group's 11 pages
(every visible text node in `<main>` matched against `content/live/<page>.json`, `content/pages/<page>.html` and
`content/ui-strings.json`) found invented section headings and labels on most of them, e.g. "Sign one, forge one" (/idv),
"Forge one yourself" (/gateway), "Pick your module" (/hsm), "Wear your name" (/identity), "Paste your own" (/guard),
"You are on Chrome" (/extension), "One handler, your choices" (/functions). They are being replaced with Hanzo's own words.
Other chats' pages built the same way likely have the same problem. Suggested: a reverse check in `parity.py` (page text
not found in the source, excluding code fragments and ui-strings).

Invented strings inside shared components (not this group's files):
- `components/pages/cloud/Frame.jsx` console: "A build is running from the last commit on main." is not Hanzo's copy and shows on every
  cloud page that uses the console (hidden page-locally on /gateway only). The "↗" it appends to "Open in the console" is also added.
- `components/v2/x-hypatia/PinChapters.jsx`: builds the screen-reader label "<heading>: go to" for its dots; ": go to" is not a
  registered UI string.

- `components/v2/BizOpen` (opened-card dialog): its accessible name comes from a label the caller passes ("Open iOS" on /gui),
  which is not a registered UI string. /gui stopped passing it, so the dialog now has no name. Asked for: name the dialog with
  `aria-labelledby` pointing at the card's own heading, or register "Open" in `content/ui-strings.json`.

- `components/kit.jsx` `CodeBlock` (around line 491) marks itself `data-room="dark"`, so every small code card (e.g. the cloud
  pages' "Paste and ship" prompt) turns the sticky header dark while it passes under it, over a white page. Asked for: only real
  dark rooms carry `data-room="dark"`.

- Missing route: `/aup` (Hanzo's "usage policy" link on /help/privacy/model-training, kept as Hanzo's href) returns 404 on this
  server and lands on `/`. Asked for: the `/aup` page or a redirect owned by the legal/routes chat.

## 2. Header ask (shared chrome)
Critics of /functions, /gui, /guard, /gateway and /flow asked for one solid fill on the phone's first screen: the header's
"Try Hanzo" stays solid beside each page's own hero ask. Same ask as `docs/review/_shared.md` section 1: let a page name its
header ask, or outline the header button while a page solid is on screen. At 320px the header "Try Hanzo" is cut at the right edge.
