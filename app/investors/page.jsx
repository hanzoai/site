// V2: 8/10 After review: hero after the curtain and legible with JS off, thesis and results as pinned scenes (one figure at a time, true objects on a zero baseline, 400x twice 200x), slabs that layer, commit stats roll in, one solid in the close; Hanzo's deck only
// Persona: an investor or press doing diligence · Goal: reach investor relations · CTA: Contact investor relations (investors.hero) · Metric: one contact click
// Signature: the figure counter: every measured figure rolls in digit by digit, one at a time, each named in Hanzo's words and linked to the run it comes from; press any step to hold it
// Beyond: Read the source: the seven figures as one list you tick off as you open each source, a giant tabular counter filling as you go, kept in this browser
// Deletes: the indigo accent, the eyebrows, the endless loops and marquee, native checkboxes, the drawn Pareto scatter, invented labels, forked buttons
import Investors from '../../components/pages/Investors';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Hanzo Investor Relations — Hanzo AI',
  description: 'Models, agents and the cloud beneath them — one account, one key, one bill. See the research, open-source traction, team and investor contact.',
};

export default function Page() {
  return <><JsonLd route="/investors" /><Investors /></>;
}
