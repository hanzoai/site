import Playground from '../../components/pages/cloud/Playground';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/playground'].title, description: INDEX['/playground'].description };

export default function Page() {
  return <><JsonLd route="/playground" /><Playground /></>;
}
