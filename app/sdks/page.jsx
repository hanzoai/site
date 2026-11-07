// Signature: one request in two dialects: flip OpenAI ⇄ Anthropic and only the lines that differ re-type, in Python, TypeScript or cURL.
// Beyond: pick your language and its install line, registry, docs and org line up in one place, ready to copy; and a Go import path you can type to find.
import Sdks from '../../components/pages/Sdks';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'SDKs for every language — Hanzo AI',
  description: 'Official SDKs for TypeScript, Python, Go, Rust, and Swift. Integrate Hanzo AI models, autonomous agents, and cloud APIs with type safety.',
};

export default function Page() {
  return <><JsonLd route="/sdks" /><Sdks /></>;
}
