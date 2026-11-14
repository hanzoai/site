import type { Metadata } from 'next';
import IntegrationsIndex from '../../components/pages/integrations/IntegrationsIndex';
import JsonLd from '../../components/JsonLd';
import { indexDoc, metaOf, SLUGS, guideDoc } from '../../components/pages/integrations/intData';

const m = metaOf('/integrations') || {};
export const metadata: Metadata = { title: m.title, description: m.description };

/* what a card opens into: each guide's own headline and its first code sample (its first 12 lines), read from the
   guide's captured page; nothing written here */
function previews() {
  const out: Record<string, { title: string; sample: string; lang: string; lines: unknown[] }> = {};
  for (const slug of SLUGS()) {
    const g = guideDoc(slug);
    const s = g.samples.find((x) => x.code);
    out[slug] = { title: g.title, sample: s ? s.title : '', lang: s ? s.lang : '', lines: s?.code ? s.code.lines.slice(0, 12) : [] };
  }
  return out;
}

export default function Page() {
  return <><JsonLd route="/integrations" /><IntegrationsIndex doc={indexDoc()} previews={previews()} /></>;
}
