// /pay: one of the nine app and checkout pages from Zack's list (components/pages/flow, hand-offs in lib/handoff.js)
import PayIndex from '../../components/pages/flow/PayIndex';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Pay — Hanzo AI',
  description: 'Plans and checkout.',
  robots: { index: false, follow: true },
};

export default function Page() {
  return <><JsonLd route="/pay" /><PayIndex /></>;
}
