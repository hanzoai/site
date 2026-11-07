import Network from '../../components/pages/cloud/Network';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/network'].title, description: INDEX['/network'].description };

export default function Page() {
  return <><JsonLd route="/network" /><Network /></>;
}
