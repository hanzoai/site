// Persona: Developer who needs compute. Goal: buy compute on hanzo.network.
// CTA: "Buy Compute" → https://docs.hanzo.ai/docs/network (data-cta network.hero, network.close; the site's sticky ask carries it). Metric: api_key_created.
// Signature: ask the fabric — a live map of the peers connected right now, each wearing Hanzo's render of the models it has loaded; a request leaves you and walks the links to a peer that already has the model loaded, and a model nobody has loaded gets a placement
// Beyond: lend it to — in chapter five choose inference or builds: the machine that joins the map is labelled for it, with the one command (hanzo fabric join or hanzo runner), Hanzo's line and a copy button
// V2: 8/10 Answering the 7/10 review: the fabric is the hero and the chapters' object (each fact changes the map: topology, work, attestation, route and placement, a join, the settlement), peers wear Hanzo's model renders, the demo runs once and rests, the title, lede and ask sit together, the prompt lives in the black room; /node keeps the terminal and the machine
import Network from '../../components/pages/cloud/Network';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/network'].title, description: INDEX['/network'].description };

export default function Page() {
  return <><JsonLd route="/network" /><Network /></>;
}
