// V2: 8/10 Apple-grade launch in Hanzo's own black and white: the film lands full-bleed and settles into an ensō ring (pinned on desktop, by itself on phones); the three tiers pin as chapters over Enso's film; the live router is the one dark room; GPQA as hero figures, the Pareto chart and a sortable table; the tiers side by side; Hanzo's exact model cards; a closing band
// Persona: Developer
// Goal: route every request through one endpoint
// CTA: Try Hanzo (/login, data-thumb)
// Metric: signup_start
// Signature: the switchboard — requests stream through Enso, which weighs quality, speed and cost, and land in the tier made for them; the film settles into an ensō ring and the three tiers pin as chapters
// Beyond: the GPQA Diamond explorer — any model beside Enso's three tiers in Hanzo's own figures, with every result in a table you re-sort by score or cost
import Enso from '../../components/pages/model/Enso';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: "Hanzo Enso — Choose an outcome", description: "Intelligent model routing for frontier AI. Enso balances quality, latency, cost, and policy across top models and agents via one API." };

export default function Page() {
  return <><JsonLd route="/enso" /><Enso /></>;
}
