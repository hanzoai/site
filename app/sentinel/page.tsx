import Sentinel from '../../components/pages/cloud/Sentinel';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/sentinel'].title, description: INDEX['/sentinel'].description };

export default function Page() {
  return <><JsonLd route="/sentinel" /><Sentinel /></>;
}
