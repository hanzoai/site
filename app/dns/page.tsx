import Dns from '../../components/pages/cloud/Dns';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/dns'].title, description: INDEX['/dns'].description };

export default function Page() {
  return <><JsonLd route="/dns" /><Dns /></>;
}
