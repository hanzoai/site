import Gateway from '../../components/pages/cloud/Gateway';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/gateway'].title, description: INDEX['/gateway'].description };

export default function Page() {
  return <><JsonLd route="/gateway" /><Gateway /></>;
}
