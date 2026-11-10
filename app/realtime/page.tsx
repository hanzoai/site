// Persona: Developer
// Goal: get an API key and open a first stream
// CTA: Start Building → https://platform.hanzo.ai/api-keys (data-cta realtime.hero, realtime.close)
// Metric: api_key_created
// Signature: graph — the stream as a living graph: the one store, the API, the access rule, a broker per org, GET /v1/realtime, the grant, the deployment, the subscriptions and three clients settle into place; records travel it, and pointing at a node lights its paths, names them and reads out what that part gives you
// Beyond: the rule switch — in the hero, flip each client's access rule and replay the create, update and delete to see who hears about record b
// V2: Three live clients under a two-line title beside the one ask; then the living graph of the stream with its words beside it (no pinned chapters); the statement and subscribe call; the handshake one call at a time; growth one note at a time beside the tenant map; a calm card strip, then the close
import Realtime from '../../components/pages/cloud/Realtime';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/realtime'].title, description: INDEX['/realtime'].description };

export default function Page() {
  return <><JsonLd route="/realtime" /><Realtime /></>;
}
