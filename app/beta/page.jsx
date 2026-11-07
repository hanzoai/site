// Signature: three access passes held as a fanned deck that deals itself; a tap brings a pass forward with its Apply stub
// Beyond: say what you are after and the deck hands you the pass made for it, from Hanzo's own description of each
import Beta from '../../components/pages/Beta';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Get there first — Hanzo AI',
  description: 'Early access to Dev, Studio, Kai, Enso and Zen.',
};

export default function Page() {
  return <><JsonLd route="/beta" /><Beta /></>;
}
