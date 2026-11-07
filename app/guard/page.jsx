import Guard from '../../components/pages/cloud/Guard';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/guard'].title, description: INDEX['/guard'].description };

export default function Page() {
  return <><JsonLd route="/guard" /><Guard /></>;
}
