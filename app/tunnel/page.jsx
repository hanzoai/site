import Tunnel from '../../components/pages/cloud/Tunnel';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/tunnel'].title, description: INDEX['/tunnel'].description };

export default function Page() {
  return <><JsonLd route="/tunnel" /><Tunnel /></>;
}
