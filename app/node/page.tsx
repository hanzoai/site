// Persona: Developer with a machine to lend (a compute provider). Goal: run a node.
// CTA: "Run a Node" → https://docs.hanzo.ai/docs/proof-of-ai/node-operator (data-cta node.hero, node.close; the site's sticky ask carries it). Metric: api_key_created.
// Signature: one machine, up — hanzo fabric up starts the node, it joins the fabric, reports its hardware, each routed job lights its level on the five-level ladder and batches settle as Merkle roots on Lux
// Beyond: drive it — press up, join or stop: the node starts on the active network, switches and starts, or stops by its recorded pid while the process that shares its name keeps running
// V2: 8/10 Round 4 (review 7/10): h1 cuts in after first paint; the machine shows its own process (pid, network, level), not peer lines; the dead bands are gone; figures settle once; the stage is 48svh a chapter and each chapter plays a scripted beat, then rests on a blinking prompt; under 900px it stacks; Copy confirms cleanly; text links part their stroke
import Node from '../../components/pages/cloud/Node';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/node'].title, description: INDEX['/node'].description };

export default function Page() {
  return <><JsonLd route="/node" /><Node /></>;
}
