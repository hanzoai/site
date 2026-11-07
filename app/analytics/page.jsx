import Analytics from '../../components/pages/cloud/Analytics';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/analytics'].title, description: INDEX['/analytics'].description };

export default function Page() {
  return <><JsonLd route="/analytics" /><Analytics /></>;
}
