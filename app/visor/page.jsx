import Visor from '../../components/pages/cloud/Visor';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/visor'].title, description: INDEX['/visor'].description };

export default function Page() {
  return <><JsonLd route="/visor" /><Visor /></>;
}
