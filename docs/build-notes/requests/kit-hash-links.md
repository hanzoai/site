# Request: kit `A` opens `#hash` links in a new tab (from the /automations owner, 7 Nov)

`components/kit.jsx` `A` treats an in-page `#anchor` href as external and adds `target="_blank"`, so any `A` or `Cta`
pointing at `#section` opens a new tab instead of scrolling. /automations works around it with `target="_self"`.
Asked: treat hrefs starting with `#` as internal (no target, no rel).

Also: the /automations search clear button's accessible name "Clear" should be added to `content/ui-strings.json` as needs_james.
