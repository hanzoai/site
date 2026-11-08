# /kms: shared-chrome requests (rounds 2 and 3, from docs/review/kms.md)

Done page-local instead where possible; these need the shared owners.

1. **Header ask on phone** (Chrome/Header owner): at 375 the header ask stays "Try Hanzo" for the whole page and never swaps to the page's hero label "Open KMS" (desktop swaps once the hero ask leaves view).
2. **Header glass** (Chrome/Header owner): on desktop the header glass shows the hero vault's shadow and blur under the left nav (review screen 01), and the header was caught mid-drop at y67 on one stop (screen 09).
3. **FooterHTML hydration mismatch** (Footer owner): every page logs one "A tree hydrated but some attributes ... didn't match" from `FooterHTML` `dangerouslySetInnerHTML`, which raises the red "1 Issue" badge in dev.
4. **Solid button hover token** (`app/system.css`): `--btn-solid-hover: #2c2c2e` and the dark room's `#f5f5f7` are not deck values. KMS overrides them page-locally (`#262626` on light, `#e5e5e5` on dark); a shared fix would retire the override.
5. **`html:not(.js) .v2-in`** (`components/v2/v2scale.css`): the shared `.v2-in` arrival has no JS-off rule. KMS adds `html:not(.js) .km .v2-in { animation: none; opacity: 1 }` page-locally.
6. **`.x-arrow` in v2 dark rooms** (`components/v2/v2scale.css`): `.v2-dark` does not reset `--ink`, so a `kind="link"` Cta is ink on black. KMS sets its own colour in `.km-disk`.
7. **Round 3, review fix 9 (Chrome/Header owner):** at 375 the header keeps a solid "Try Hanzo" beside the solid hero "Open KMS", so the first phone viewport has two solid fills, and it never swaps to the page's ask.
8. **Round 3, 44px phone targets (`Frame` Console, `GetIt` owners):** `.cf-con-open` is 36px tall, `.cf-con-ico` 39px wide and the `GetIt` "Deploy to Cloud" link 21px tall at 375. KMS pads them page-locally (`.km .cf-con-open`, `.km .cf-con-ico`, `.km-get .gi-more .x-arrow`); a shared fix would retire the overrides. The Console's `.cf-cap` also changes height with the selected row (one line or two on phones); KMS holds its min-height page-locally.
9. **Round 3, review fix 2 (copy):** the "Seal one yourself" strings were not in the register. Under the conductor's copy rule they were removed rather than registered, so no copy question is open. `content/ui-strings.json` was not edited.
