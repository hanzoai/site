import Dataroom from '../../components/pages/apps/Dataroom';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';
import { goImport } from '../../lib/modules';

export const metadata = { title: INDEX['/dataroom'].title, description: INDEX['/dataroom'].description, other: goImport('dataroom') };

export default function Page() {
  return <><JsonLd route="/dataroom" /><Dataroom /></>;
}
