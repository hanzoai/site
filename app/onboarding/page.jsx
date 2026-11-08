// /onboarding: one of the nine app and checkout pages from Zack's list (components/pages/flow, hand-offs in lib/handoff.js)
import Onboarding from '../../components/pages/flow/Onboarding';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Welcome — Hanzo AI',
  description: 'Set up Hanzo and pick a plan.',
  robots: { index: false, follow: true },
};

export default function Page() {
  return <><JsonLd route="/onboarding" /><Onboarding /></>;
}
