import Machines from '../../components/pages/cloud/Machines';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/machines'].title, description: INDEX['/machines'].description };

export default function Page() {
  return <><JsonLd route="/machines" /><Machines /></>;
}
