// Signature: peel the layers: the OpenAPI document, the generated Cloud SDK, the hand-written AI + Agents library and your application lift apart in 3D and close again; drag across to peel it, pick a layer and it rises out and explains itself.
// Beyond: the hero console flips one request OpenAI ⇄ Anthropic, re-typing only the lines that differ; pick your language and its install line, registry, docs and org line up in one place; and a Go import path you can type to find.
import Sdks from '../../components/pages/Sdks';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'SDKs for every language — Hanzo AI',
  description: 'Official SDKs for TypeScript, Python, Go, Rust, and Swift. Integrate Hanzo AI models, autonomous agents, and cloud APIs with type safety.',
};

export default function Page() {
  return <><JsonLd route="/sdks" /><Sdks /></>;
}
