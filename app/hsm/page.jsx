import Hsm from '../../components/pages/cloud/Hsm';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/hsm'].title, description: INDEX['/hsm'].description };

export default function Page() {
  return <><JsonLd route="/hsm" /><Hsm /></>;
}
