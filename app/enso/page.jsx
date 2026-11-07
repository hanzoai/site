// V2: 8/10 Apple-grade launch: the film lands full-bleed and settles into an ensō ring in vermilion; three tiers pin as scrubbed chapters; the live router is the one dark room; GPQA as hero figures, a Pareto chart, a sortable drawer and a spec sheet
// Signature: the switchboard — requests stream through Enso, which weighs quality, speed and cost, and land in the tier made for them; the film settles into an ensō ring and the three tiers pin as chapters
// Beyond: the GPQA Diamond explorer — any model beside Enso's three tiers in Hanzo's own figures, with every result in a drawer you re-sort by score or cost
import Enso from '../../components/pages/model/Enso';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: "Hanzo Enso — Choose an outcome", description: "Intelligent model routing for frontier AI. Enso balances quality, latency, cost, and policy across top models and agents via one API." };

export default function Page() {
  return <><JsonLd route="/enso" /><Enso /></>;
}
