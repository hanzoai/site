// V2: 8/10 v3 to JAMES.md: ink and greys only, no labels over headlines, one solid ask (Contact investor relations) with the shared ask bar, a counter that rolls once and rests with pause and replay, a still logo wall, every figure to its source, Sigil close
// Persona: an investor or press doing diligence · Goal: reach investor relations · CTA: Contact investor relations (investors.hero) · Metric: one contact click
// Signature: the figure counter: every measured figure rolls in digit by digit, one at a time, each named in Hanzo's words and linked to the run it comes from; press any step to hold it
// Beyond: Read the source: the seven figures as one list you tick off as you open each source, a giant tabular counter filling as you go, kept in this browser
// Deletes: the indigo accent, two eyebrows, the endless counter loop and marquee, native checkboxes, invented labels, visible initials
import Investors from '../../components/pages/Investors';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Hanzo Investor Relations — Hanzo AI',
  description: 'Models, agents and the cloud beneath them — one account, one key, one bill. See the research, open-source traction, team and investor contact.',
};

export default function Page() {
  return <><JsonLd route="/investors" /><Investors /></>;
}
