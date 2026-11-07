// Signature: One Chrome window, full width, inspector-led: Hanzo's side agent works the active checkout tab step by step while a DevTools drawer follows it live (the DOM node it reads, the console error, the policy check, the network trace), then the patch lands in your code channel's tab
// Beyond: A site-policy tester: type any address and see whether Hanzo's example allowlist lets the agent in, wildcards matched as you type, with the part each * stands for marked in the address
import ChromePage from '../../components/pages/ChromePage';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: 'Hanzo in Chrome — Browser Agent & Enterprise Site Governance — Hanzo AI', description: 'Put an AI teammate in Chrome’s side panel. Inspect live DOM and network traces, automate web apps, and govern site allowlists and password-manager rules across your organization.' };

export default function Page() {
  return <><JsonLd route="/chrome" /><ChromePage /></>;
}
