import Ingress from '../../components/pages/cloud/Ingress';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';
import { goImport } from '../../lib/modules';

export const metadata = { title: INDEX['/ingress'].title, description: INDEX['/ingress'].description, other: goImport('ingress') };

export default function Page() {
  return <><JsonLd route="/ingress" /><Ingress /></>;
}
