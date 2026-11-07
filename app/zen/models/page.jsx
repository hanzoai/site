import ZenCatalog from '../../../components/pages/model/ZenCatalog';
import JsonLd from '../../../components/JsonLd';

export const metadata = { title: "The complete Zen API catalog — Hanzo AI", description: "45 open foundation models for agentic coding, vision, audio, and reasoning. Run locally or call via Hanzo Cloud from $0.015/MTok." };

export default function Page() {
  return <><JsonLd route="/zen/models" /><ZenCatalog /></>;
}
