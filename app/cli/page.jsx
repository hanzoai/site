// Signature: The terminal is the first screen: a full-bleed black room that is one giant terminal window, where hanzo is typed, the request streams and the gateway lands on staging, all in Hanzo's own example session
// Beyond: Add to the script: the install script takes any of the binary's own commands (scan, share, status, link, auth show) as one press each, under Hanzo's own heading for it, and every block and the whole script copy as you built them
import CliPage from '../../components/pages/CliPage';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'A senior engineer in your shell — Hanzo AI',
  description: 'One unified CLI for autonomous coding, model inference, and cloud deployments. Plan, edit, deploy, and monitor directly from your terminal.',
};

export default function Page() {
  return <><JsonLd route="/cli" /><CliPage /></>;
}
