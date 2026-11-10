import Idv from '../../components/pages/cloud/Idv';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';
import { goImport } from '../../lib/modules';

export const metadata = { title: INDEX['/idv'].title, description: INDEX['/idv'].description, other: goImport('idv') };

export default function Page() {
  return <><JsonLd route="/idv" /><Idv /></>;
}
