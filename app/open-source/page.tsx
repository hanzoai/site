import OpenSource from '../../components/pages/OpenSource';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Open Source — 1700+ repositories — Hanzo AI',
  description: 'Explore 1700+ open-source repos across AI infrastructure and models.',
};

export default function Page() {
  return <><JsonLd route="/open-source" /><OpenSource /></>;
}
