import Engine from '../../components/pages/cloud/Engine';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/engine'].title, description: INDEX['/engine'].description };

export default function Page() {
  return <><JsonLd route="/engine" /><Engine /></>;
}
