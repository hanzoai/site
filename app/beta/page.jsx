// Signature: open: each early-access pass is a tile that grows into its own full sheet with a shared-element morph, letter, words and Apply stub carried across
// Beyond: say what you are after (use it first, evaluate it first, build it with the team) and the pass made for it opens, from Hanzo’s own description of each
// V2: 8/10 display hero over the five early-access products (Kai, Enso, Zen as their own films) settling into a row on scroll; pass tiles that open into sheets; a dark closing room
import Beta from '../../components/pages/Beta';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Get there first — Hanzo AI',
  description: 'Early access to Dev, Studio, Kai, Enso and Zen.',
};

export default function Page() {
  return <><JsonLd route="/beta" /><Beta /></>;
}
