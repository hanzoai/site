import Visor from '../../components/pages/cloud/Visor';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';
import { goImport } from '../../lib/modules';

export const metadata = { title: INDEX['/visor'].title, description: INDEX['/visor'].description, other: goImport('visor') };

export default function Page() {
  return <><JsonLd route="/visor" /><Visor /></>;
}
