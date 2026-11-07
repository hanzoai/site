// V2: 8/10 round 2: the 17 GPQA results fold into one drawer under the chart (hidden="until-found", #eo-results opens it), the spec table is gone (each switchboard lane carries its tier's prices under Hanzo's spec heading in the dark room), the white gap closed, 44px targets on the source marks and small links, the film pause rides the ring after the settle, model cards press to .98. Round 1:Enso Ultra's 98.0% now leads alone (8 of 13 columns, counts up) with Enso 96.5% and Flash 95.5% stacked beside it at 32px; tier rail rows step in on hover, hidden chapters' links leave reach, the × close takes the kit hover page-locally, the GPQA tour starts when the plot is in view, and the spec heading carries a breathing ensō. Still: film lands full-bleed and settles into the ring, tiers pin as chapters, the live router room, Pareto chart and sortable table, Hanzo's model cards, a closing band
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
