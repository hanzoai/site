// V2: 8/10 Calm story in huge tabular figures: display hero beside a rolling figure counter, the thesis as pinned chapters, layered stack, a dark wall of giant results, the public commit record, a drifting wall of launches, 51% as the structure's figure, a diligence list and one action
// Signature: the figure counter: every measured figure rolls in digit by digit, one at a time, each named and linked to the run it comes from; press any step to hold it
// Beyond: Check our work: the seven figures as a diligence list; open each one's source and it is ticked off, and your progress stays in this browser for next time
import Investors from '../../components/pages/Investors';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Hanzo Investor Relations — Hanzo AI',
  description: 'Models, agents and the cloud beneath them — one account, one key, one bill. See the research, open-source traction, team and investor contact.',
};

export default function Page() {
  return <><JsonLd route="/investors" /><Investors /></>;
}
