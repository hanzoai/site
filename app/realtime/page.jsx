// Persona: Developer
// Goal: get an API key and open a first stream
// CTA: Start Building → https://platform.hanzo.ai/api-keys (data-cta realtime.hero, realtime.close)
// Metric: api_key_created
// Signature: the same record landing on three client screens at once — created, updated, deleted — with the delete reaching only clients whose rule can read it
// Beyond: rule switch — flip each client's access rule and replay the create, update and delete to see who hears about record b
// V2: 8/10 Three live clients of three sizes settle under a two-line title beside the one ask; eight pinned chapters over one outlined stream map; the handshake one call at a time with the full paragraph behind a disclosure; growth one note at a time beside the tenant map; a calm card strip, then the close
import Realtime from '../../components/pages/cloud/Realtime';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/realtime'].title, description: INDEX['/realtime'].description };

export default function Page() {
  return <><JsonLd route="/realtime" /><Realtime /></>;
}
