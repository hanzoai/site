// /pay/confirm/card: one of the nine app and checkout pages from Zack's list (components/pages/flow, hand-offs in lib/handoff.js)
import Checkout from '../../../../components/pages/flow/Checkout';
import JsonLd from '../../../../components/JsonLd';

export const metadata = {
  title: 'Checkout — Hanzo AI',
  description: 'Your plan, your total, and one step to pay by card.',
  robots: { index: false, follow: true },
};

export default function Page() {
  return <><JsonLd route="/pay/confirm/card" /><Checkout /></>;
}
