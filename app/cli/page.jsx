// Signature: compare (Before / after slider, docs/MOTION-MAP.md): in the second screen, under "A resource tree, not a pile of flags", the visitor drags a divider across the CLI's own commands: left of it they lie as a pile of flags, right of it the same commands stand as the resource tree (pointer, finger on the handle, or arrow keys); on arrival it sweeps once, then rests
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
