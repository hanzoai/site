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

## 2. Header ask (shared chrome)
Critics of /functions, /gui, /guard, /gateway and /flow asked for one solid fill on the phone's first screen: the header's
"Try Hanzo" stays solid beside each page's own hero ask. Same ask as `docs/review/_shared.md` section 1: let a page name its
header ask, or outline the header button while a page solid is on screen. At 320px the header "Try Hanzo" is cut at the right edge.
