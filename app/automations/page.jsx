import Automations from '../../components/pages/apps/Automations';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/automations'].title, description: INDEX['/automations'].description };

export default function Page() {
  return <><JsonLd route="/automations" /><Automations /></>;
}
