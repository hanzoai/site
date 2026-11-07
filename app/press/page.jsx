import Press from '../../components/pages/Press';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Press Resources. — Hanzo AI',
  description: 'Everything you need to write about Hanzo AI, Inc. Download our press kit, access brand assets, and find media contacts.',
};

export default function Page() {
  return <><JsonLd route="/press" /><Press /></>;
}
