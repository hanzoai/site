// /docs/quickstart: one of the nine app and checkout pages from Zack's list (components/pages/flow, hand-offs in lib/handoff.js)
import { Quickstart } from '../../../components/pages/flow/Docs';
import JsonLd from '../../../components/JsonLd';

export const metadata = {
  title: 'Quickstart — Hanzo AI',
  description: 'An empty project to a first call that works.',
};

export default function Page() {
  return <><JsonLd route="/docs/quickstart" /><Quickstart /></>;
}
