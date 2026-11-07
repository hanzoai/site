// Persona: Developer with a machine to lend (a compute provider). Goal: run a node.
// CTA: "Run a Node" → https://docs.hanzo.ai/docs/proof-of-ai/node-operator (data-cta node.hero, node.close; the site's sticky ask carries it). Metric: api_key_created.
// Signature: one machine, up — hanzo fabric up starts the node, it joins the fabric, reports its hardware, each routed job lights its level on the five-level ladder and batches settle as Merkle roots on Lux
// Beyond: drive it — press up, join or stop: the node starts on the active network, switches and starts, or stops by its recorded pid while the process that shares its name keeps running
// V2: 8/10 Round 3 to MASTER.md: the machine settles from big beside the 52px title on the 8/5 split, runs itself (pausable), tilts 2.5° at most and takes a job of whatever level you point at; figures are the next screen's one big thing; one graphite terminal, one quiet room (no black room, unlike /network); deck greys, flat surfaces, no springs; one ask
import Node from '../../components/pages/cloud/Node';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/node'].title, description: INDEX['/node'].description };

export default function Page() {
  return <><JsonLd route="/node" /><Node /></>;
}
