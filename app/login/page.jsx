// /login: one of the nine app and checkout pages from Zack's list (components/pages/flow, hand-offs in lib/handoff.js)
import Auth from '../../components/pages/flow/Auth';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Log in — Hanzo AI',
  description: 'Log in to Hanzo with Google or email.',
};

export default function Page() {
  return <><JsonLd route="/login" /><Auth /></>;
}
