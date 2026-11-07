import Brand from '../../components/pages/Brand';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Hanzo Brand Guidelines. — Hanzo AI',
  description: 'How to draw a Hanzo interface: the marks, the type, the colour, and the spacing.',
};

export default function Page() {
  return <><JsonLd route="/brand" /><Brand /></>;
}
