# Hosts still needed to film (for James)

The cloud box can only reach hosts on the `hanzo-site` environment's allow list. These sites were picked, but they need extra hosts before they can be filmed properly. Until then, their SPECs use values "from code/write-up", not "measured".

To allow them: in the session's title bar, open the cloud environment menu, choose **hanzo-site**, then **Edit**, and add each host under **Allowed domains**.

## Reference Lab 2 (`docs/refs/more/`)

| Site | Why it matters for Hanzo | Hosts to add | What breaks without them |
|---|---|---|---|
| linear.app | Premium developer product page: pinned product UI, quiet monochrome | `static.linear.app`, `webassets.linear.app` | All scripts, styles and images (307 blocked requests); the page renders unstyled |
| lusion.co | Card-to-page project transitions over a WebGL stage | `lusion.dev` | 3D assets; the page stays on its loader |
| exoape.com | Editorial type and route transitions (Awwwards Site of the Month, May 2022) | `www.exoape.com` | The apex redirects to `www`, so nothing loads |
| vercel.com | Already filmed; a few customer images missing | `lishhsx6kmthaacj.public.blob.vercel-storage.com` | 3 images |
| basement.studio | Already filmed; showcase images missing | `cdn.sanity.io` | 36 project images (grey boxes in the film) |
| obys.agency | Already filmed; project images missing | `cms.obys.agency` | 38 project images (grey boxes in the film) |
| locomotive.ca | Already filmed; showreel missing | `player.vimeo.com` | The hero showreel video |
| igloo.inc | Awwwards Site of the Year 2024: one 3D moment told by scroll | `igloo.inc` | Everything (not on the list) |
| osmo.supply | Awwwards Site of the Day, 16 Dec 2025 (Dennis Snellenberg and Ilja van Eck) | `osmo.supply` | Everything (not on the list) |
| arc.net / diabrowser.com | Playful, restrained pointer detail on a product page | `arc.net`, `diabrowser.com` | Everything (not on the list) |
| family.co | Micro-interactions where every tap answers | `family.co` | Everything (not on the list) |

Also note: the cloud box has no GPU. WebGL scenes ran at 3.5 fps, so films are recorded with WebGL off and canvas scenes are described "from code". Filming them properly needs a machine with a GPU (James's Mac).
