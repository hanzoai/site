// Persona: Developer who needs compute. Goal: buy compute on hanzo.network.
// CTA: "Buy Compute" → https://docs.hanzo.ai/docs/network (data-cta network.hero, network.close; the site's sticky ask carries it). Metric: api_key_created.
// Signature: ask the fabric — a live map of the peers connected right now; a request leaves you and walks the links to a peer that already has the model loaded, and a model nobody has loaded gets a placement
// Beyond: lend it to — in the chain of six blocks choose inference or builds and get the one command (hanzo fabric join or hanzo runner) with Hanzo's line and a copy button
// V2: 8/10 Round 3 to MASTER.md: copy left and the live fabric right on the 5/8 split with its toolbar in its own frame (nothing over the map or the text); 52px title; blocks that shrink as they settle; one black room with flat graphite ends; deck greys, hairlines or fills, no springs; one ask
import Network from '../../components/pages/cloud/Network';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/network'].title, description: INDEX['/network'].description };

export default function Page() {
  return <><JsonLd route="/network" /><Network /></>;
}
