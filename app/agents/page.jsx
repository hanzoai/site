// Signature (docs/MOTION-MAP.md `live-chat`): pick one of the page's questions and Hanzo answers it live, word by word
// Entrances, in order: squash-land, ripple, venetian-type, grow-from-point, stretch-scroll (components/pages/agents-index)
import AgentsPage from '../../components/pages/AgentsPage';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Hanzo for agents: free to start, pay as you go — Hanzo AI',
  description: 'Sign up free with a wallet. Get an API key free. A small free allowance to try it. Top up in USDC or USDT over the API to raise your limits and pay as you go. No human required.',
};

export default function Page() {
  return <><JsonLd route="/agents" /><AgentsPage /></>;
}
