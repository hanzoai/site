// /pay/cart: one of the nine app and checkout pages from Zack's list (components/pages/flow, hand-offs in lib/handoff.js)
import Checkout from '../../../components/pages/flow/Checkout';
import JsonLd from '../../../components/JsonLd';

export const metadata = {
  title: 'Cart — Hanzo AI',
  description: 'Your plan and a card-only total.',
  robots: { index: false, follow: true },
};

export default function Page() {
  return <><JsonLd route="/pay/cart" /><Checkout cart /></>;
}
