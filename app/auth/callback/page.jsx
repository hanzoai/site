// /auth/callback: one of the nine app and checkout pages from Zack's list (components/pages/flow, hand-offs in lib/handoff.js)
import Callback from '../../../components/pages/flow/Callback';
import JsonLd from '../../../components/JsonLd';

export const metadata = {
  title: 'Signing in — Hanzo AI',
  description: 'Signing you in to Hanzo.',
  robots: { index: false, follow: true },
};

export default function Page() {
  return <><JsonLd route="/auth/callback" /><Callback /></>;
}
