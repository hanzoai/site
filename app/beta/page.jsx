// Signature: open: each early-access pass is a tile carrying Hanzo’s own media that grows into its full sheet with a shared-element morph, picture and words carried across
// Beyond: the five products in early access as their own tiles, Kai, Enso and Zen as their films, each opening into its page
// V2: 8/10 grey deck, no eyebrow; one solid Apply sticky after the hero; a film on the phone’s first screen with a pause control; pass tiles with real media open into sheets; the close over Enso’s film; no added words
import Beta from '../../components/pages/Beta';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Get there first — Hanzo AI',
  description: 'Early access to Dev, Studio, Kai, Enso and Zen.',
};

export default function Page() {
  return <><JsonLd route="/beta" /><Beta /></>;
}
