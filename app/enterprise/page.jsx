import Enterprise from '../../components/pages/Enterprise';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Enterprise AI — Hanzo AI',
  description: 'Models, agents and one shared workspace for everyone in your company, in your cloud, on your servers or fully offline.',
};

export default function Page() {
  return <><JsonLd route="/enterprise" /><Enterprise /></>;
}
