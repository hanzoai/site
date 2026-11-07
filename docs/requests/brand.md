# /brand: shared change requested

Mirror `/press/hanzo-press-kit.zip` (the "Download Assets" target, Hanzo's own file) into `public/press/`. Today the dev server proxies it from hanzo.ai; a static export would 404. Owner: media / public assets.

Still open (7 Nov re-walk): `public/press/hanzo-press-kit.zip` is still not in the repo, so both "Download Assets" targets depend on it. This page invents no file; the link stays Hanzo's.

Note for the Company kit owner: `components/pages/company/deck.css` sets `.vc .vc-title { color: var(--ink) }`, which beats a page's single-class colour inside a dark room (it hid /brand's three h3s on black). /brand fixed it page-local; other pages using `.vc-title` inside `data-room="dark"` may have the same bug.

Shared hydration error (round 3): on every cold load at both sizes the red "1 Issue" badge still shows, and its only diff is `<FooterHTML>`'s `dangerouslySetInnerHTML` (`<footer class="is_View _paddingInline-...`), which renders different HTML on the server and the client. /brand's own diff (the slider's style, written onto the input by screenshot tools before hydration) is gone. Owner: footer / Chrome.
