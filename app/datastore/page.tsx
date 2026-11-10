import Datastore from '../../components/pages/cloud/Datastore';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/datastore'].title, description: INDEX['/datastore'].description };

export default function Page() {
  return <><JsonLd route="/datastore" /><Datastore /></>;
}
