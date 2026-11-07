// Signature: Your browser with an AI teammate: Chrome's tabs and a side agent working the active tab step by step, the PR leaving for your channel
// Beyond: A site-policy tester: type any address and see whether Hanzo's example allowlist lets the agent in, wildcards matched as you type
import ChromePage from '../../components/pages/ChromePage';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: 'Hanzo in Chrome — Browser Agent & Enterprise Site Governance — Hanzo AI', description: 'Put an AI teammate in Chrome’s side panel. Inspect live DOM and network traces, automate web apps, and govern site allowlists and password-manager rules across your organization.' };

export default function Page() {
  return <><JsonLd route="/chrome" /><ChromePage /></>;
}
