// Signature: one machine, up — hanzo fabric up starts the node, it joins the fabric, reports its hardware, each routed job lights its level on the five-level ladder and batches settle as Merkle roots on Lux
// Beyond: drive it — press up, join or stop: the node starts on the active network, switches and starts, or stops by its recorded pid while the process that shares its name keeps running
// V2: 8/10 Round 2 to JAMES.md: the machine settles beside huge type, runs itself (pausable), leans toward your pointer and takes a job of whatever level you point at; no eyebrow (its words sit under the h1); ink and greys only; six reasons in one pinned terminal; one dark room; one ask
// Persona: Developer with a machine to lend (a compute provider). Goal: run a node.
// CTA: "Run a Node" → https://docs.hanzo.ai/docs/proof-of-ai/node-operator (data-cta node.hero, node.close; the site's sticky ask carries it). Metric: api_key_created.
import Node from '../../components/pages/cloud/Node';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/node'].title, description: INDEX['/node'].description };

export default function Page() {
  return <><JsonLd route="/node" /><Node /></>;
}
