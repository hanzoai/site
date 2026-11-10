// Signature: the console plays its first request once, by itself: the ask, what the agent read, what it wrote
import AgentLanding from '../../components/pages/AgentLanding';
import JsonLd from '../../components/JsonLd';
import { agentLanding } from '../../components/pages/agentLandingData';
import { goImport } from '../../lib/modules';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/agent'].title, description: INDEX['/agent'].description, other: goImport('agent') };

export default function Page() {
  return <><JsonLd route="/agent" /><AgentLanding d={agentLanding()} /></>;
}
