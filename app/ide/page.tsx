import IdePage from '../../components/pages/IdePage';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'An IDE that remembers your codebase — Hanzo AI',
  description: 'AI-first IDE powered by a high-performance Rust engine. Persistent project memory, call-graph awareness, and sandboxed tool execution.',
};

export default function Page() {
  return <><JsonLd route="/ide" /><IdePage /></>;
}
