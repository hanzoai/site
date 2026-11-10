import Identity from '../../components/pages/cloud/Identity';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/identity'].title, description: INDEX['/identity'].description };

export default function Page() {
  return <><JsonLd route="/identity" /><Identity /></>;
}
