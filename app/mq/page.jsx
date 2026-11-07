import Mq from '../../components/pages/cloud/Mq';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/mq'].title, description: INDEX['/mq'].description };

export default function Page() {
  return <><JsonLd route="/mq" /><Mq /></>;
}
