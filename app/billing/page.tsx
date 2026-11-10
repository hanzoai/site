import Billing from '../../components/pages/apps/Billing';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/billing'].title, description: INDEX['/billing'].description };

export default function Page() {
  return <><JsonLd route="/billing" /><Billing /></>;
}
