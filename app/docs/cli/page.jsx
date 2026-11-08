// /docs/cli: one of the nine app and checkout pages from Zack's list (components/pages/flow, hand-offs in lib/handoff.js)
import { Cli } from '../../../components/pages/flow/Docs';
import JsonLd from '../../../components/JsonLd';

export const metadata = {
  title: 'CLI docs — Hanzo AI',
  description: 'Install the Hanzo CLI, sign in and start a session.',
};

export default function Page() {
  return <><JsonLd route="/docs/cli" /><Cli /></>;
}
