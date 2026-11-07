// Signature: an agent signs itself up live, the five steps lighting as it reaches each request
// Beyond: who is installing, the install block keeps only the lines your path needs
import AgentsPage from '../../components/pages/AgentsPage';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Hanzo for agents: free to start, pay as you go — Hanzo AI',
  description: 'Sign up free with a wallet. Get an API key free. A small free allowance to try it. Top up in USDC or USDT over the API to raise your limits and pay as you go. No human required.',
};

export default function Page() {
  return <><JsonLd route="/agents" /><AgentsPage /></>;
}
