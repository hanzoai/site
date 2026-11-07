import Ingress from '../../components/pages/cloud/Ingress';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/ingress'].title, description: INDEX['/ingress'].description };

export default function Page() {
  return <><JsonLd route="/ingress" /><Ingress /></>;
}
