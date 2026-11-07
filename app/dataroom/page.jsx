import Dataroom from '../../components/pages/apps/Dataroom';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/dataroom'].title, description: INDEX['/dataroom'].description };

export default function Page() {
  return <><JsonLd route="/dataroom" /><Dataroom /></>;
}
