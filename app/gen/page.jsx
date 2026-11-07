// Signature: The agent is a flag: Gen's four rails frame one split-flap board, and the flag flips through all 23 agents, each letter tile flipping in place until the next agent's name lands
// Beyond: A command builder: pick the agent, switch Gen's rails on or off, and copy the exact gen command and its hanzo dev twin
import Gen from '../../components/pages/Gen';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: 'Hanzo Gen — any coding agent, on Hanzo’s rails', description: 'Run your favorite coding agents — Claude Code, Cursor, Codex — with Hanzo tools and models attached. Open source, install in one command.' };

export default function Page() {
  return <><JsonLd route="/gen" /><Gen /></>;
}
