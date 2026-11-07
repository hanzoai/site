# /kms: shared-chrome requests (round 2, from docs/review/kms.md fix 10)

Done page-local instead where possible; these need the shared owners.

1. **Header ask on phone** (Chrome/Header owner): at 375 the header ask stays "Try Hanzo" for the whole page and never swaps to the page's hero label "Open KMS" (desktop swaps once the hero ask leaves view).
2. **Header glass** (Chrome/Header owner): on desktop the header glass shows the hero vault's shadow and blur under the left nav (review screen 01), and the header was caught mid-drop at y67 on one stop (screen 09).
3. **FooterHTML hydration mismatch** (Footer owner): every page logs one "A tree hydrated but some attributes ... didn't match" from `FooterHTML` `dangerouslySetInnerHTML`, which raises the red "1 Issue" badge in dev.
4. **Solid button hover token** (`app/system.css`): `--btn-solid-hover: #2c2c2e` and the dark room's `#f5f5f7` are not deck values. KMS overrides them page-locally (`#262626` on light, `#e5e5e5` on dark); a shared fix would retire the override.
5. **`html:not(.js) .v2-in`** (`components/v2/v2scale.css`): the shared `.v2-in` arrival has no JS-off rule. KMS adds `html:not(.js) .km .v2-in { animation: none; opacity: 1 }` page-locally.
6. **`.x-arrow` in v2 dark rooms** (`components/v2/v2scale.css`): `.v2-dark` does not reset `--ink`, so a `kind="link"` Cta is ink on black. KMS sets its own colour in `.km-disk`.
