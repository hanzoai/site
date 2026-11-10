import Payments from '../../components/pages/apps/Payments';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/payments'].title, description: INDEX['/payments'].description };

export default function Page() {
  return <><JsonLd route="/payments" /><Payments /></>;
}
