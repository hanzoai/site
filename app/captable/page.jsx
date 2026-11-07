import Captable from '../../components/pages/apps/Captable';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/captable'].title, description: INDEX['/captable'].description };

export default function Page() {
  return <><JsonLd route="/captable" /><Captable /></>;
}
