// Signature: the same record landing on three client screens at once — created, updated, deleted — with the delete reaching only clients whose rule can read it
// Beyond: rule switch — flip each client's access rule and replay the create, update and delete to see who hears about record b
// V2: Split launch in grey: three live client screens (pause, rule switch per client) settle under a two-line title beside the one ask; the statement opens eight pinned chapters over one stream map; use cases on a drag rail with its own toolbar; the handshake as the one dark room; growth as three figures you press beside a tenant map; the first collection as a card that opens
// Persona: Developer
// Goal: get an API key and open a first stream
// CTA: Start Building → https://platform.hanzo.ai/api-keys (data-cta realtime.hero, realtime.close)
// Metric: api_key_created
import Realtime from '../../components/pages/cloud/Realtime';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/realtime'].title, description: INDEX['/realtime'].description };

export default function Page() {
  return <><JsonLd route="/realtime" /><Realtime /></>;
}
