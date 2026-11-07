import Commerce from '../../components/pages/apps/Commerce';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/commerce'].title, description: INDEX['/commerce'].description };

export default function Page() {
  return <><JsonLd route="/commerce" /><Commerce /></>;
}
