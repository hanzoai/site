import Investors from '../../components/pages/Investors';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Hanzo Investor Relations — Hanzo AI',
  description: 'Models, agents and the cloud beneath them — one account, one key, one bill. See the research, open-source traction, team and investor contact.',
};

export default function Page() {
  return <><JsonLd route="/investors" /><Investors /></>;
}
